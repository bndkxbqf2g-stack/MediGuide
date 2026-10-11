# Historischer Medikamentenimport

Dieses Paket importiert die 51 Zeilen aus der historischen UKW-Arbeitsversion der Medikamententabelle in das MediGuide-Datenmodell.

## Ausführen

```bash
python3 tools/import_historical_medications.py \
  /pfad/zu/Medikamentendatenbank_UKW_Startversion.xlsx \
  --output data/medications-historical.v0.1.0.json

node tools/validate_historical_data.mjs data/medications-historical.v0.1.0.json
```

Der Importer arbeitet read-only gegenüber der XLSX-Quelle. Er berechnet keine medizinischen Werte, interpretiert keine Verdünnung und ergänzt keine fehlenden Angaben. Leere Felder bleiben leer. Quellennahe Zeichen wie `—` oder `PUR` bleiben erhalten.

Alle Einträge erhalten:

- `reviewStatus: UNGEPRÜFT_HISTORISCH`
- `sourceVersion: 2020-12`
- `usageStatus: historische Referenz`

Die Daten dürfen im MVP nur als historisches Nachschlagewerk angezeigt werden. Eine klinische Freigabe, aktuelle Fachinformation oder lokale Stationsvorgabe wird dadurch nicht ersetzt.
