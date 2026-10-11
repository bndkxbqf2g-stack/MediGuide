# MediGuide – Master-Spezifikation v0.1

Stand: 11.10.2026  
Projektstatus: fachliche Grundlage / noch keine klinische Freigabe

## 1. Zweck

MediGuide wird zunächst als privates, mobiloptimiertes Nachschlagewerk für den Stationsalltag aufgebaut. Der erste Schwerpunkt liegt auf Onkologie, Strahlentherapie und den am UKW verwendeten Aufzieh- und Infusionsstandards.

MediGuide darf Informationen auffindbar und nachvollziehbar machen. Es ersetzt keine ärztliche Anordnung, keine aktuelle UKW-Vorgabe, keine Fachinformation und keine zweite Pflegekontrolle.

## 2. Verbindliche Grenzen des MVP

- private iPhone-PWA
- zunächst offline nutzbar
- keine Anmeldung und keine Cloud-Synchronisation
- keine Patientendaten, keine Namen, keine Fallakten
- keine automatische Dosierungsberechnung
- keine automatische Freigabe oder Handlungsempfehlung
- keine öffentliche Wissensdatenbank
- jede kritische Angabe muss eine Quelle und einen Prüfstatus besitzen

## 3. Quellenbestand zum Start

| Quelle | Verwendung im MVP | Status |
|---|---|---|
| `Infusomaten_Aufziehstandard_Medikamentendatenbank.pdf` | Primäre historische Referenz für Aufziehen, Lösungsmittel, Konzentration, Stabilität und Infusionsdauer | 2020-12, ungeprüft |
| `Medikamentendatenbank_UKW_Startversion.xlsx` | Strukturierter Arbeitsbestand mit 51 ausgewählten Einträgen | historisch, nicht klinisch freigegeben |
| `EinarbeitungskonzeptStation (2).pdf` | Stationsabläufe, Tätigkeiten und Orientierung im Stationsalltag | interne Arbeitsunterlage |
| `Klinik und Poliklinik der Strahlentherapie.docx` | interne Kontaktdaten und Bereichsübersicht | nur geschütztes internes Modul |
| `PEGHandlingInformationfürPatienten.pdf` | Patienteninformation; Bild-PDF, muss vor Nutzung separat geprüft werden | noch nicht strukturiert |
| `InformationHautpflegewährendderBestrahlungInformationfürPatienten.pdf` | Patienteninformation; Bild-PDF, muss vor Nutzung separat geprüft werden | noch nicht strukturiert |
| `Cisplatin - Vinorelbin.zip` | Protokoll- und Etikettenbestand mit vielen historischen Dokumenten | nur nach Einzelprüfung |

Die Start-Tabelle dokumentiert selbst ausdrücklich: Die 51 Einträge sind historische Originalangaben und nicht validiert. Diese Kennzeichnung wird unverändert in MediGuide übernommen.

## 4. Wissensmodell

Jeder Inhalt wird als eigener Datensatz gespeichert. Ein Datensatz darf erst als nutzbare Information erscheinen, wenn seine Herkunft und sein Status sichtbar sind.

### Medikamentenkarte

- Wirkstoff
- Handelsname
- Stärke und Darreichungsform
- Kategorie
- Zubereitung laut Quelle
- verwendetes Lösungsmittel
- Zielkonzentration
- Infusionsdauer oder Rate
- dokumentierte Stabilität
- Warnhinweise und Kommentare
- Quelle und Seitenangabe
- Quellenstand
- Prüfstatus
- letzte Prüfung
- Änderungsnotiz
- Suchbegriffe und Synonyme

### Dokumentenkarte

- Titel
- Dokumenttyp
- Bereich
- Quelle
- Erstellungs- oder Änderungsdatum, sofern vorhanden
- Text-/Bildstatus
- Gültigkeitsstatus
- kurze Inhaltsbeschreibung
- Verknüpfungen zu Medikamenten, Tätigkeiten oder Themen

### Prüfstatus

- `UNGEPRÜFT_HISTORISCH`
- `TEXT_ERFASST_ABGLEICH_OFFEN`
- `BILDINHALT_ABGLEICH_OFFEN`
- `WIDERSPRUCH_ODER_UNKLAR`
- `GEPRÜFT_INTERNE_FREIGABE_OFFEN`
- `NUR_QUELLDOKUMENT`
- `GESPERRT_NICHT_VERWENDEN`

Im MVP wird kein Datensatz als klinisch freigegeben bezeichnet. Eine spätere Freigabe muss eine definierte verantwortliche Prüfung außerhalb der App voraussetzen.

## 5. Startmodule

### A. Schnell-Suche

Suche nach Wirkstoff, Handelsname, Kurzname, Synonym oder Kategorie. Treffer zeigen sofort Prüfstatus und Quellenstand.

### B. Medikamentenkarte

Die Karte zeigt Zubereitung, Lösungsmittel, Konzentration, Infusionsdauer, Stabilität und Warnhinweise getrennt. Kritische Hinweise stehen vor der Detailinformation.

### C. Quellenansicht

Jede Aussage kann bis zur Ursprungsdatei und, wenn möglich, zur PDF-Seite zurückverfolgt werden. Nicht auslesbare Bild-PDFs werden als Quelldokument geöffnet, aber nicht automatisch als geprüfter Text dargestellt.

### D. Favoriten und Verlauf

Lokale Favoriten und zuletzt geöffnete Einträge. Keine personenbezogenen Notizen im MVP.

### E. Stationswissen

Geprüft getrennt vom Medikamentenlexikon: Dienstabläufe, Strahlentherapie-Orientierung, PEG-Grundlagen und interne Kontaktübersicht. Interne Kontaktdaten erhalten eine zusätzliche Bestätigungssperre gegen veraltete Angaben.

## 6. Sicherheitslogik

1. Keine Quelle bedeutet keine Aussage.
2. Fehlende Angaben werden als `Nicht dokumentiert` angezeigt, niemals ergänzt oder geschätzt.
3. Historische Angaben bleiben sichtbar als historisch markiert.
4. Widersprüchliche Angaben werden nebeneinander mit Warnung angezeigt und nicht zusammengeführt.
5. Kritische Felder wie Lösungsmittel, Konzentration, Stabilität und Infusionsdauer benötigen eine Einzelquelle.
6. Angaben aus Etiketten, Kurven oder patientenbezogenen Dateien dürfen nicht automatisch zu allgemeinen Standards werden.
7. Patientenbezogene Dateien werden nicht in den allgemeinen Suchindex übernommen.
8. Ein Informationsbanner erinnert bei jeder Medikamentenkarte an aktuelle Fachinformation, lokale Vorgabe und zweite Kontrolle.
9. Der Datenstand ist in jeder Ansicht sichtbar.
10. Änderungen werden versioniert und mit Quelle, Datum und Begründung protokolliert.

## 7. Umgang mit dem ZIP-Bestand

Der ZIP-Bestand enthält rund 200 Dateien, darunter Chemotherapie- und Kurvenetiketten, historische Varianten, Verknüpfungen, Sicherungskopien und teilweise patientenbezogen benannte Dokumente. Er wird deshalb in Stufen behandelt:

1. reine Dateiinventur
2. Ausschluss von temporären Dateien, Sicherungskopien und Verknüpfungen
3. Ausschluss oder lokale Sperrung patientenbezogener Dokumente
4. Auswahl allgemeiner Protokollvorlagen
5. Einzelprüfung jeder ausgewählten Vorlage
6. Aufnahme nur mit Originaldatei, Änderungsdatum und Prüfstatus

Im MVP wird der ZIP-Bestand nicht pauschal als gültiger Chemotherapie-Katalog importiert.

## 8. MVP-Akzeptanzkriterien

- Suche findet mindestens die strukturierten Einträge aus der Start-Tabelle.
- Jede Medikamentenkarte zeigt Quellenstand und Prüfstatus.
- Historische oder ungeprüfte Angaben sind visuell eindeutig gekennzeichnet.
- Eine Karte ohne dokumentierte Stabilität zeigt `Nicht dokumentiert`.
- Bild-PDFs werden nicht fälschlich als vollständig ausgelesen angezeigt.
- Widersprüche werden nicht automatisch aufgelöst.
- Favoriten und Verlauf funktionieren lokal.
- Die App funktioniert ohne Netzwerkverbindung.
- Es gibt keinen Speicherort für Patientennamen oder Falldaten.
- Jede spätere Inhaltsänderung erzeugt einen nachvollziehbaren Versionsstand.

## 9. Technische Reihenfolge

1. Wissensbasis und Quellenregister
2. normiertes Datenmodell
3. Import- und Prüfstatus-Logik
4. lokale Suchfunktion
5. Medikamenten- und Quellenansicht
6. Favoriten und Verlauf
7. Sicherheits- und Regressionstests
8. erst danach weitere Dokumentmodule

Die technische Umsetzung startet erst auf Basis dieses Dokuments. Rechnermodule, KI-Chat, Cloud, Login und Chemotherapie-Entscheidungsunterstützung bleiben außerhalb des MVP.

## 10. Umsetzungsstand

- Das normalisierte Datenmodell enthält 51 historische Einträge.
- Die erste mobile Suchansicht ist als dependency-freie Offline-PWA-Struktur umgesetzt.
- Suche und Treffer beschränken sich auf dokumentierte Identifikationsfelder.
- Jede Detailansicht zeigt Prüfstatus, Quellenstand und Datenversion.
- Der lokale Offline-Fallback verwendet ausschließlich die zuvor geladene versionierte Datenbasis.

## 11. Nächster konkreter Arbeitsschritt

Als Nächstes werden Medikamentenkarte und Quellenansicht weiter verfeinert. Favoriten und Verlauf folgen erst danach. Rechner, KI-Chat, Cloud, Login und Chemotherapie-Entscheidungsunterstützung bleiben außerhalb dieses MVP-Schritts.
