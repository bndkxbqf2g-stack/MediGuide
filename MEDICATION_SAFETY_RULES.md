# MediGuide – Medication Safety Rules v0.1

## Grundsatz

MediGuide darf Informationen auffindbar und nachvollziehbar machen. Die App darf keine ärztliche Anordnung, aktuelle UKW-Vorgabe, Fachinformation oder zweite Pflegekontrolle ersetzen.

## Verbindliche Regeln

- Keine Quelle bedeutet keine medizinische Aussage.
- Fehlende Werte werden als `Nicht dokumentiert` angezeigt.
- Historische Angaben bleiben als historisch gekennzeichnet.
- `UNGEPRÜFT_HISTORISCH` ist kein Freigabestatus.
- Lösungsmittel, Konzentration, Stabilität, Infusionsdauer und Rate werden nur quellengebunden angezeigt.
- Widersprüchliche Angaben werden nicht zusammengeführt.
- Unklare Angaben werden nicht berechnet, normalisiert oder ergänzt.
- Kritische Aussagen müssen bis zur Originalquelle zurückverfolgbar sein.
- Bild-PDFs und OCR-Ergebnisse werden nicht ohne Einzelprüfung als strukturierte Handlungsanweisung verwendet.
- Etiketten, Kurven und patientenbezogene Dokumente dürfen keinen allgemeinen Standard erzeugen.
- Patientendaten, Namen und Fallbezüge werden weder gespeichert noch indexiert.
- Alte oder gesperrte Quellen werden nicht als aktuelle Handlungsanweisung dargestellt.
- Sicherheitswarnungen stehen vor der Detailinformation.
- Datenstand, Quellenstand und Prüfstatus sind in jeder Medikamentenkarte sichtbar.

## Prüfstatus

- `UNGEPRÜFT_HISTORISCH`
- `TEXT_ERFASST_ABGLEICH_OFFEN`
- `BILDINHALT_ABGLEICH_OFFEN`
- `WIDERSPRUCH_ODER_UNKLAR`
- `GEPRÜFT_INTERNE_FREIGABE_OFFEN`
- `NUR_QUELLDOKUMENT`
- `GESPERRT_NICHT_VERWENDEN`

## Sicherheitsverhalten bei Konflikten

Bei abweichenden Quellen zeigt MediGuide ausschließlich:

> Abweichende Angaben vorhanden – Quelle prüfen.

Es gibt keine automatische Priorisierung allein nach Dateiname, Importreihenfolge oder vermeintlicher Aktualität.

## Nicht erlaubt

- automatische Dosierungsfreigaben
- automatische Therapieentscheidungen
- klinische Handlungsempfehlungen ohne konkrete Quelle
- Schätzungen fehlender Werte
- stilles Überschreiben historischer Daten
- pauschaler Import eines Protokollarchivs als gültiger Standard
