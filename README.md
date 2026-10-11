# MediGuide

Privater persönlicher digitaler Stationsassistent für den Stationsalltag mit Schwerpunkt Onkologie, Strahlentherapie und geprüfter UKW-Arbeitsgrundlage.

## Status

- App-Version: `0.1.0`
- Daten-Version: `0.1.0-historisch`
- Projektphase: Repository-Grundlage und Wissensmodell
- Zielplattform des MVP: private, mobiloptimierte Offline-PWA

## Verbindliche Grenzen

MediGuide ist zunächst ein privates Nachschlagewerk. Es enthält keine Patientendaten und ersetzt keine ärztliche Anordnung, aktuelle Fachinformation, lokale Vorgabe oder zweite Kontrolle.

Nicht Bestandteil des MVP sind automatische Therapieentscheidungen, automatische Dosierungsfreigaben, eine öffentliche Wissensdatenbank und ungeprüfte Protokollübernahmen.

## Repository-Regeln

Vor jeder Änderung sind `AGENTS.md`, `PROJECT_MASTER_SPEC.md`, `MEDICATION_DATA_SCHEMA.md` und `MEDICATION_SAFETY_RULES.md` zu lesen. Änderungen erfolgen in kleinen, nachvollziehbaren Arbeitspaketen und müssen durch CI geprüft werden.

## Datenprinzip

Jeder medizinische Wert benötigt eine konkrete Quelle, einen Quellenstand und einen sichtbaren Prüfstatus. Fehlende Angaben werden als `Nicht dokumentiert` dargestellt. Historische Originalquellen werden nicht automatisch als aktuelle Standards behandelt.

## Dokumentation

- [AGENTS.md](AGENTS.md)
- [PROJECT_MASTER_SPEC.md](PROJECT_MASTER_SPEC.md)
- [MEDICATION_DATA_SCHEMA.md](MEDICATION_DATA_SCHEMA.md)
- [MEDICATION_SAFETY_RULES.md](MEDICATION_SAFETY_RULES.md)
- [MODULES.md](MODULES.md)
- [CHANGELOG.md](CHANGELOG.md)
