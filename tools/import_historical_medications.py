#!/usr/bin/env python3
"""Read-only importer for the historical UKW medication workbook.

The importer copies source-near values into the MediGuide data model. It does
not calculate concentrations, infer diluents, fill missing values, or make
clinical statements.
"""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET


NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"


def qname(namespace: str, name: str) -> str:
    return f"{{{namespace}}}{name}"


def column_index(cell_ref: str) -> int:
    letters = re.match(r"([A-Z]+)", cell_ref.upper())
    if not letters:
        raise ValueError(f"Ungültige Zellreferenz: {cell_ref}")
    result = 0
    for char in letters.group(1):
        result = result * 26 + ord(char) - ord("A") + 1
    return result


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    values: list[str] = []
    for item in root.findall(qname(NS_MAIN, "si")):
        values.append("".join(item.itertext()))
    return values


def workbook_sheets(archive: zipfile.ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in relationships.findall(qname(NS_PKG_REL, "Relationship"))
    }
    result: dict[str, str] = {}
    for sheet in workbook.findall(f"{qname(NS_MAIN, 'sheets')}/{qname(NS_MAIN, 'sheet')}"):
        name = sheet.attrib["name"]
        relation_id = sheet.attrib[qname(NS_REL, "id")]
        target = targets[relation_id].lstrip("/")
        if not target.startswith("xl/"):
            target = posixpath.join("xl", target)
        result[name] = posixpath.normpath(target)
    return result


def cell_value(cell: ET.Element, strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        inline = cell.find(qname(NS_MAIN, "is"))
        return "" if inline is None else "".join(inline.itertext())

    value = cell.find(qname(NS_MAIN, "v"))
    if value is None or value.text is None:
        return ""
    raw = value.text
    if cell_type == "s":
        return strings[int(raw)]
    return raw


def read_rows(archive: zipfile.ZipFile, sheet_path: str, strings: list[str]) -> list[list[str]]:
    root = ET.fromstring(archive.read(sheet_path))
    rows: list[list[str]] = []
    for row in root.findall(f".//{qname(NS_MAIN, 'row')}"):
        cells: dict[int, str] = {}
        for cell in row.findall(qname(NS_MAIN, "c")):
            cells[column_index(cell.attrib["r"])] = cell_value(cell, strings)
        if not cells:
            rows.append([])
            continue
        width = max(cells)
        rows.append([cells.get(index, "") for index in range(1, width + 1)])
    return rows


def clean(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped if stripped else None


def source_page(value: str | None) -> int | str | None:
    value = clean(value)
    if value is None:
        return None
    return int(value) if re.fullmatch(r"\d+", value) else value


def unique_terms(*values: str | None) -> list[str]:
    result: list[str] = []
    for value in values:
        value = clean(value)
        if value and value not in result:
            result.append(value)
    return result


def import_workbook(input_path: Path, expected_count: int) -> dict[str, Any]:
    with zipfile.ZipFile(input_path) as archive:
        strings = shared_strings(archive)
        sheets = workbook_sheets(archive)
        if "MEDIKAMENTE" not in sheets:
            raise ValueError("Das Tabellenblatt MEDIKAMENTE fehlt.")

        rows = read_rows(archive, sheets["MEDIKAMENTE"], strings)
        if not rows:
            raise ValueError("Das Tabellenblatt MEDIKAMENTE ist leer.")

    headers = rows[0]
    required = [
        "Kategorie",
        "Wirkstoff",
        "Handelsname",
        "Stärke / Form",
        "Zubereitung laut PDF",
        "Konzentration laut PDF",
        "Infusionszeit / Rate laut PDF",
        "Stabilität laut PDF",
        "Warnhinweis / Kommentar",
        "Quellseite PDF",
        "Quellstand",
        "Prüfstatus",
    ]
    missing = [header for header in required if header not in headers]
    if missing:
        raise ValueError(f"Erforderliche Spalten fehlen: {', '.join(missing)}")

    index = {header: headers.index(header) for header in required}
    entries: list[dict[str, Any]] = []
    for row in rows[1:]:
        values = row + [""] * (len(headers) - len(row))
        if not any(clean(value) for value in values):
            continue

        active = clean(values[index["Wirkstoff"]])
        trade = clean(values[index["Handelsname"]])
        if not active:
            raise ValueError("Eintrag ohne Wirkstoff gefunden.")

        entries.append(
            {
                "id": f"ukw-historical-{len(entries) + 1:03d}",
                "activeIngredient": active,
                "tradeName": trade,
                "strengthForm": clean(values[index["Stärke / Form"]]),
                "category": clean(values[index["Kategorie"]]),
                "preparationText": clean(values[index["Zubereitung laut PDF"]]),
                "diluent": None,
                "finalConcentration": clean(values[index["Konzentration laut PDF"]]),
                "infusionDurationOrRate": clean(values[index["Infusionszeit / Rate laut PDF"]]),
                "stabilityText": clean(values[index["Stabilität laut PDF"]]),
                "warningText": clean(values[index["Warnhinweis / Kommentar"]]),
                "sourceId": "source-ukw-infusomaten-aufziehstandard-2020-12",
                "sourcePage": source_page(values[index["Quellseite PDF"]]),
                "sourceVersion": clean(values[index["Quellstand"]]) or "2020-12",
                "reviewStatus": "UNGEPRÜFT_HISTORISCH",
                "lastReviewedAt": None,
                "reviewNote": "Historischer Tabellenimport; klinischer Abgleich offen.",
                "searchTerms": unique_terms(active, trade),
            }
        )

    if len(entries) != expected_count:
        raise ValueError(f"Erwartet waren {expected_count} Einträge, gefunden wurden {len(entries)}.")

    return {
        "datasetId": "medications-ukw-historical",
        "dataVersion": "0.1.0-historisch",
        "sourceDocument": {
            "id": "source-ukw-infusomaten-aufziehstandard-2020-12",
            "fileName": "Medikamentendatenbank_UKW_Startversion.xlsx",
            "documentType": "XLSX",
            "sourceArea": "UKW",
            "sourceDate": "2020-12",
            "contentStatus": "textuell",
            "usageStatus": "nur Quelle",
            "description": "Historische Arbeitsversion aus den UKW-Infusomaten-Aufziehstandards.",
            "originalLibraryId": "libfile_bf20c220333481918ddf3c91e7cb399f",
        },
        "reviewStatus": "UNGEPRÜFT_HISTORISCH",
        "usageStatus": "historische Referenz",
        "importPolicy": {
            "mode": "read-only",
            "calculatesMedicalValues": False,
            "fillsMissingFields": False,
            "clinicalValidation": False,
        },
        "entries": entries,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Pfad zur XLSX-Quelldatei")
    parser.add_argument("--output", type=Path, help="Zielpfad für die normalisierte JSON-Datei")
    parser.add_argument("--expected-count", type=int, default=51)
    args = parser.parse_args()

    result = import_workbook(args.input, args.expected_count)
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
