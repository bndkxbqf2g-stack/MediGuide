# AGENTS.md

## Projekt

MediGuide ist ein privates, mobiloptimiertes Nachschlagewerk für den Stationsalltag. Der erste Schwerpunkt liegt auf Onkologie, Strahlentherapie und den geprüften bzw. klar als historisch markierten UKW-Quellen.

## Arbeitsregeln

1. Erst verstehen, dann ändern.
2. Vor jeder Änderung den aktuellen `main`-Stand und die CI prüfen.
3. Kleine, klar abgegrenzte Arbeitspakete erstellen.
4. Keine fachfremden Änderungen in einem Arbeitspaket.
5. Kritische medizinische Aussagen nie ergänzen, schätzen oder automatisch freigeben.
6. Jede strukturierte Aussage benötigt Quelle, Quellenstand und Prüfstatus.
7. Fehlende Werte werden als `Nicht dokumentiert` geführt.
8. Widersprüche werden sichtbar gemacht und nicht automatisch aufgelöst.
9. Originalquellen bleiben unverändert und werden nicht ungeprüft in den Suchindex übernommen.
10. Patientendaten, Namen, Fallakten und patientenbezogene Dateien gehören nicht in das Repository.
11. Keine Zugangsdaten, Tokens, lokalen Exportdateien oder privaten Rohdokumente committen.
12. Nach jeder Änderung Tests und CI ausführen.
13. Versionen von App und Wissensbasis getrennt und sichtbar halten.
14. Bei medizinisch unklaren oder widersprüchlichen Inhalten Arbeit stoppen und markieren.

## Definition of Done

- Spezifikation und betroffene Module aktualisiert.
- Tests oder Prüfungen ergänzt.
- Sicherheits- und Quellenstatus nachvollziehbar.
- CI erfolgreich.
- CHANGELOG.md aktualisiert.
- Keine ungeprüften internen Originaldokumente oder Patientendaten enthalten.
