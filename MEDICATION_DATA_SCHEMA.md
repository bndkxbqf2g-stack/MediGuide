# MediGuide – Datenmodell v0.1

Stand: 11.10.2026  
Zweck: sichere lokale Wissensbasis für den MVP

## 1. Grundprinzip

MediGuide speichert keine „freien Antworten“, sondern versionierte Wissenseinträge. Jeder sichtbare medizinische Wert gehört zu einer konkreten Quelle. Fehlt ein Wert, bleibt das Feld leer und wird als `Nicht dokumentiert` dargestellt.

## 2. Entitäten

### `MedicationEntry`

| Feld | Typ | Pflicht | Bedeutung |
|---|---|---:|---|
| `id` | stabile ID | ja | interne unveränderliche Kennung |
| `activeIngredient` | Text | ja | Wirkstoff |
| `tradeName` | Text | nein | Handelsname |
| `strengthForm` | Text | ja | Stärke / Form laut Quelle |
| `category` | Enum/Text | ja | z. B. Antiinfektiva |
| `preparationText` | Text | nein | wörtlich bzw. quellengetreu übernommen |
| `diluent` | Enum/Text | nein | NaCl 0,9 %, Aqua, G5 %, PUR oder nicht dokumentiert |
| `finalConcentration` | Text | nein | Konzentration laut Quelle |
| `infusionDurationOrRate` | Text | nein | Dauer oder Rate laut Quelle |
| `stabilityText` | Text | nein | Stabilität laut Quelle |
| `warningText` | Text | nein | Warnung / Kommentar |
| `sourceId` | Referenz | ja | konkrete Quelldatei |
| `sourcePage` | Zahl/Text | nein | PDF-Seite oder Dokumentstelle |
| `sourceVersion` | Text | ja | z. B. 2020-12 |
| `reviewStatus` | Enum | ja | Prüfstatus |
| `lastReviewedAt` | Datum | nein | letzte Prüfung |
| `reviewNote` | Text | nein | Begründung und offene Punkte |
| `searchTerms` | Liste | nein | Synonyme, Kurzformen, Handelsnamen |

### `SourceDocument`

| Feld | Typ | Pflicht | Bedeutung |
|---|---|---:|---|
| `id` | stabile ID | ja | interne Kennung |
| `fileName` | Text | ja | Originalname |
| `documentType` | Enum | ja | PDF, XLSX, DOCX, ZIP, Bild-PDF |
| `sourceArea` | Text | ja | z. B. UKW / Strahlentherapie |
| `sourceDate` | Text | nein | Stand oder Änderungsdatum |
| `contentStatus` | Enum | ja | textuell, bildbasiert, gemischt, nicht auslesbar |
| `usageStatus` | Enum | ja | verwendbar, nur Quelle, gesperrt |
| `description` | Text | nein | kurze Inhaltsbeschreibung |
| `originalLibraryId` | Referenz | ja | Rückverfolgung zur Originaldatei |

### `ReviewRecord`

- `id`
- `entryId` oder `sourceId`
- `reviewDate`
- `reviewerLabel`
- `reviewType`
- `result`
- `changedFields`
- `reason`
- `supersedesReviewId`

Im privaten MVP wird kein Personenname als Prüfer gespeichert, sofern der Nutzer dies nicht ausdrücklich benötigt. Ein neutraler Prüferstatus reicht zunächst aus.

## 3. Prüfstatus und Darstellung

| Status | Darstellung | Suchverhalten |
|---|---|---|
| `UNGEPRÜFT_HISTORISCH` | gelbe Warnmarkierung | auffindbar, aber nicht als aktueller Standard formulieren |
| `TEXT_ERFASST_ABGLEICH_OFFEN` | orange Markierung | auffindbar, mit offenem Abgleich |
| `BILDINHALT_ABGLEICH_OFFEN` | orange Markierung | nur Quelldokument und geprüfte Auszüge |
| `WIDERSPRUCH_ODER_UNKLAR` | rote Warnmarkierung | Treffer mit Konfliktbanner |
| `GEPRÜFT_INTERNE_FREIGABE_OFFEN` | blaue Markierung | nur nach explizitem Hinweis verwenden |
| `NUR_QUELLDOKUMENT` | graue Markierung | keine strukturierte Handlungsansicht |
| `GESPERRT_NICHT_VERWENDEN` | rote Sperrmarkierung | standardmäßig ausgeblendet, über Quellenarchiv erreichbar |

## 4. Importregeln für die Start-Tabelle

Die Datei `Medikamentendatenbank_UKW_Startversion.xlsx` enthält 51 Einträge:

- 41 Antiinfektiva
- 7 Einträge in `Sonstige`
- 1 Antiarrhythmikum
- 1 Elektrolyt
- 1 Inodilator

Alle 51 Einträge erhalten beim Erstimport:

```text
sourceVersion = "2020-12"
reviewStatus = "UNGEPRÜFT_HISTORISCH"
usageStatus = "historische Referenz"
```

Die Tabellenfelder werden nicht stillschweigend medizinisch interpretiert. Insbesondere bleiben Angaben wie `—`, `PUR`, `keine Daten`, uneinheitliche Volumenangaben oder Kommentare als quellennahe Information erhalten und werden nicht in vermeintlich präzise Werte umgerechnet.

## 5. Konfliktregeln

- Gleicher Wirkstoff und unterschiedliche Quellen bleiben zunächst getrennte Einträge oder Versionen.
- Ein neuerer Datensatz überschreibt keinen älteren Datensatz automatisch.
- Unterschiedliche Handelsformen dürfen nicht zu einer Wirkstoffkarte ohne Form/Stärke zusammengefasst werden.
- Widersprüche werden als Konflikt verknüpft, nicht durch Mittelwert oder Prioritätsannahme gelöst.
- Die App darf bei einem Konflikt nur sagen: `Abweichende Angaben vorhanden – Quelle prüfen.`

## 6. ZIP-Importregeln

Aus dem ZIP werden zunächst nur Metadaten erfasst. Der Bestand enthält zahlreiche historische Dateien sowie temporäre Dateien, Sicherungskopien, Verknüpfungen und möglicherweise personenbezogene Dokumente.

Vor einem möglichen Inhaltsimport muss jede Datei klassifiziert werden:

1. allgemeine Vorlage ohne Personenbezug
2. allgemeine Vorlage mit unklarem Gültigkeitsstand
3. patientenbezogene Datei
4. temporäre oder technische Datei
5. Sicherungskopie / Dublette
6. nicht lesbares oder ungeeignetes Format

Nur Kategorie 1 kann nach Einzelprüfung in die Wissensbasis gelangen. Kategorie 2 bleibt ein Quelldokument. Kategorien 3 bis 6 werden nicht in den allgemeinen Suchindex aufgenommen.

## 7. Suchindex

Der Suchindex enthält nur:

- Wirkstoff
- Handelsname
- Stärke/Form
- Kategorie
- ausdrücklich dokumentierte Synonyme
- geprüfte Schlagworte

Freitext aus Kommentaren, patientenbezogenen Dokumenten und unklaren OCR-Ergebnissen wird nicht automatisch als Suchsynonym verwendet.

## 8. Lokale Speicherung

Für den MVP genügt eine lokale versionierte Datenablage. Die Originalquellen bleiben unverändert erhalten. Strukturierte Einträge referenzieren die Quelle, statt deren Inhalt losgelöst zu kopieren.

Spätere Cloud-Funktionen dürfen erst eingeführt werden, wenn Datenschutz, Zugriffsschutz, Versionierung und Löschkonzept separat festgelegt sind.

## 9. Technischer nächster Schritt

Als nächstes wird ein read-only Importer für die 51 Tabellenzeilen erstellt. Sein Ergebnis muss pro Eintrag Wirkstoff, Form, Zubereitung, Konzentration, Infusionsangabe, Stabilität, Quelle und Prüfstatus enthalten. Der Importer darf keine medizinischen Werte berechnen und keine fehlenden Felder ergänzen.
