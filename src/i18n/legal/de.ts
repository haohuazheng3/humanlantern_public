import type { LegalSet } from "./types";

/*
 * Rechtstexte, Deutsch. Übersetzung von en.ts (die englische Fassung ist maßgeblich; jedes
 * Dokument sagt das im Feld `governing`). Anrede: „du“. Interne Links zeigen auf /de/….
 * Inline-Markup: **fett**, [Text](href), `code`.
 */

const GOVERNING =
  "Diese Übersetzung dient deiner Information. Maßgeblich ist die englische Fassung, soweit zwingendes Verbraucherrecht nichts anderes vorsieht.";

export const legalDe: LegalSet = {
  privacy: {
    title: "Datenschutzerklärung",
    metaDescription:
      "Was Human Lantern erhebt, wozu, wer die Daten verarbeitet (Stripe, Resend, FlowGlance, Cloudflare, Vercel, Neon, Clerk), wie lange wir sie speichern und welche Rechte du hast.",
    updated: "2026-10-31",
    intro:
      "Vorab in einfachen Worten: Wir erheben, was wir brauchen, um dein Buch zu verkaufen und auszuliefern, deine Nachrichten zu beantworten und die Website zu verbessern. Ein Konto musst du nicht anlegen. Wir verkaufen deine Daten nicht und schalten keine Werbung.",
    governing: GOVERNING,
    sections: [
      {
        h: "Wer wir sind",
        blocks: [
          {
            p: "Human Lantern („wir“, „uns“) veröffentlicht das Buch „Was KI dir nicht nehmen kann“ (englischer Originaltitel: „What AI Can’t Take From You“) und die Ratgeber auf humanlantern.com. Bei allen Fragen zu dieser Datenschutzerklärung schreib uns an [contact@humanlantern.com](mailto:contact@humanlantern.com).",
          },
        ],
      },
      {
        h: "Was wir erheben und warum",
        blocks: [
          { h3: "Keine Konten" },
          { p: "Für den Kauf des Buchs brauchst du weder ein Konto noch ein Passwort. Die E-Mail-Adresse, die du auf der Checkout-Seite von Stripe eingibst, ist die einzige Kennung, die wir zu deinem Kauf speichern: Darüber liefern wir dein Buch aus, und darüber finden wir deine Bestellung, wenn du die Datei unter humanlantern.com/de/download erneut anforderst." },
          { h3: "Käufe" },
          { p: "Zahlungen wickelt **Stripe** ab. Deine Kartennummer sehen und speichern wir nie. Stripe übermittelt uns die Bestelldaten, die wir brauchen, um dein Buch auszuliefern und dir bei Fragen zu deinem Kauf zu helfen: eine Bestellnummer, Betrag, Währung, die beim Checkout verwendete E-Mail-Adresse, einen etwaigen Aktionscode, die Sprachversion der Website, über die du gekauft hast, sowie die Kunden- und Zahlungskennungen von Stripe. Stripe verarbeitet deine Zahlungsdaten nach [seiner eigenen Datenschutzerklärung](https://stripe.com/privacy)." },
          { h3: "Dein persönliches Exemplar und die Auslieferung" },
          { p: "Jedes Exemplar des Buchs wird personalisiert: Eine kleine Zeile am unteren Rand jeder Seite zeigt eine maskierte Form deiner E-Mail-Adresse (zum Beispiel `j***n@example.com`) und deine Bestellnummer. Personalisierte Exemplare liegen nicht öffentlich zugänglich in **Cloudflare R2** und werden über signierte Links ausgeliefert, die ablaufen. Ist der E-Mail-Versand aktiv, schicken wir dir das PDF über **Resend**, unseren Dienstleister für den E-Mail-Versand, an deine Checkout-Adresse. Jedes Lesen und jeden Download (Zeitpunkt, ungefähres Land) sowie jede Auslieferungs-E-Mail protokollieren wir, um Missbrauch von Download-Links zu verhindern." },
          { h3: "Nachrichten an uns" },
          { p: "Wenn du das Kontaktformular nutzt, speichern wir deinen Namen (freiwillig), deine E-Mail-Adresse, das Thema und deine Nachricht, zusammen mit einem Einweg-Hash deiner IP-Adresse und dem User-Agent deines Browsers, um Spam herauszufiltern. Wir erhalten eine Benachrichtigung, damit wir dir antworten können." },
          { h3: "Webanalyse (FlowGlance)" },
          { p: "Unser einziges Analysetool ist **FlowGlance**. Damit sehen wir, welche Seiten weiterhelfen und wo es hakt. FlowGlance erfasst Seitenaufrufe, Klicks, Scrollen und die Navigation zwischen Seiten, Geräte- und Browsertyp sowie deinen ungefähren Standort, der aus deiner IP-Adresse abgeleitet wird. Wir haben die erweiterte Erfassung von FlowGlance aktiviert. Das heißt: Es erfasst auch **Text, den du in Formularen absendest** (zum Beispiel die E-Mail-Adresse, mit der du dein Exemplar erneut anforderst, oder eine Kontaktnachricht), und **Bilder, die du über ein Upload-Feld hochlädst**. Deine Kartendaten gibst du auf der Seite von Stripe ein, nie auf unserer. FlowGlance kann sie also nicht sehen. Nach einem Kauf teilen wir FlowGlance außerdem mit, zu welcher Bestellung und welcher Checkout-E-Mail-Adresse der Besuch gehört, damit wir sehen, wie Käuferinnen und Käufer das Buch gefunden haben." },
          { p: "**Dein Standort entscheidet, wie FlowGlance startet.** Besuchst du uns aus der Europäischen Union, dem Europäischen Wirtschaftsraum, dem Vereinigten Königreich oder der Schweiz (oder können wir nicht erkennen, wo du bist), lädt FlowGlance erst, nachdem du im Banner auf „Analyse erlauben“ geklickt hast. Wählst du „Nur notwendige“, lädt es nie. Überall sonst zeigen wir kein Banner: Dort läuft FlowGlance standardmäßig." },
          { p: "**So sagst du Nein, egal wo du bist.** Klick unten auf jeder Seite auf „Mich nicht tracken“. Wir speichern deine Wahl in einem Cookie (`hl_consent`, 180 Tage), FlowGlance stoppt sofort und lädt in diesem Browser nicht mehr. Ein Global-Privacy-Control-Signal deines Browsers werten wir ebenfalls als Nein. Umentscheiden kannst du dich jederzeit über „Cookie-Einstellungen“ an derselben Stelle. Mehr dazu in unserer [Cookie-Richtlinie](/de/cookie-policy)." },
          { h3: "Fehlerberichte" },
          { p: "Wenn etwas nicht funktioniert, senden unsere Server und dein Browser einen technischen Fehlerbericht (Fehlermeldung, die betroffene Seite, Browser- und Geräteangaben) an unser eigenes Fehlerprotokoll, damit wir das Problem beheben können." },
        ],
      },
      {
        h: "Wer Daten für uns verarbeitet",
        blocks: [
          {
            ul: [
              "**Vercel** hostet die Website (USA).",
              "**Neon** hostet unsere Datenbank: Bestellungen, die E-Mail-Adresse, zu der jede Bestellung gehört, Nachrichten und Protokolle (USA).",
              "**Resend** verschickt die E-Mail, mit der wir dein Buch ausliefern, sofern der E-Mail-Versand aktiv ist.",
              "**Clerk** sichert die Anmeldung zu unserem eigenen Admin-Bereich (wer das Buch kauft, meldet sich nie an).",
              "**Stripe** wickelt Zahlungen, Zahlungsbelege und Erstattungen ab.",
              "**Cloudflare** stellt DNS, die E-Mail-Weiterleitung für unsere Adressen, privaten Dateispeicher (R2) und die kleinen Worker bereit, die Dateien ausliefern und E-Mails weiterleiten.",
              "**FlowGlance** stellt die oben beschriebene Webanalyse bereit.",
              "**Google Search Console** liefert uns zusammengefasste Suchstatistiken zur Website; personenbezogene Daten von dir erhält der Dienst von uns nicht.",
            ],
          },
          { p: "Wir verkaufen keine personenbezogenen Daten und geben sie nicht für kontextübergreifende verhaltensbasierte Werbung weiter." },
        ],
      },
      {
        h: "Rechtsgrundlagen (EU und Vereinigtes Königreich)",
        blocks: [
          {
            ul: [
              "Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): dein Kauf und die Auslieferung deines Buchs.",
              "Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO): Sicherheit, Verhinderung von Betrug und Missbrauch, Fehlerüberwachung, Beantwortung von Nachrichten.",
              "Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): Webanalyse bei Besuchen aus der EU, dem EWR, dem Vereinigten Königreich und der Schweiz. Du kannst deine Einwilligung jederzeit über „Mich nicht tracken“ in der Fußzeile widerrufen.",
              "Rechtliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO): Aufbewahrung von Transaktionsdaten für Steuer und Buchhaltung.",
            ],
          },
        ],
      },
      {
        h: "Wie lange wir Daten speichern",
        blocks: [
          {
            ul: [
              "Bestelldaten, einschließlich der E-Mail-Adresse, zu der dein Buch gehört: sieben Jahre, für Steuer und Buchhaltung.",
              "Kontaktnachrichten: bis zu 24 Monate.",
              "Fehler- und Download-Protokolle: bis zu 12 Monate.",
              "Datenbank-Backups: 30 Tage, danach fortlaufend überschrieben.",
            ],
          },
        ],
      },
      {
        h: "Deine Rechte",
        blocks: [
          { p: "Je nachdem, wo du lebst, kannst du Auskunft über deine personenbezogenen Daten verlangen, sie berichtigen, exportieren oder löschen lassen, bestimmten Verarbeitungen widersprechen oder sie einschränken lassen und deine Einwilligung widerrufen. Wer in Kalifornien lebt, hat das Recht zu erfahren, welche personenbezogenen Daten wir verarbeiten, sie löschen und berichtigen zu lassen und wegen der Ausübung dieser Rechte nicht benachteiligt zu werden. Um der Webanalyse zu widersprechen, klick in der Fußzeile auf „Mich nicht tracken“ oder aktiviere Global Privacy Control in deinem Browser. Für alles andere schreib eine E-Mail an [contact@humanlantern.com](mailto:contact@humanlantern.com), und zwar von der Adresse, mit der du gekauft hast. Wir antworten innerhalb von 30 Tagen. Außerdem kannst du dich bei der für dich zuständigen Datenschutzaufsichtsbehörde beschweren." },
        ],
      },
      {
        h: "Internationale Datenübermittlung",
        blocks: [{ p: "Unsere Dienstleister verarbeiten Daten in den USA und in anderen Ländern. Soweit erforderlich, stützen sich diese Übermittlungen auf die von den Dienstleistern verwendeten Standardvertragsklauseln oder gleichwertige Garantien." }],
      },
      { h: "Kinder", blocks: [{ p: "Diese Website und das Buch richten sich an Erwachsene (ab 18 Jahren). Wir erheben nicht wissentlich Daten von Kindern." }] },
      { h: "Änderungen", blocks: [{ p: "Wenn wir diese Datenschutzerklärung ändern, aktualisieren wir das Datum oben. Über wesentliche Änderungen informieren wir alle, die das Buch gekauft haben, per E-Mail." }] },
    ],
  },
  terms: {
    title: "Allgemeine Geschäftsbedingungen",
    metaDescription:
      "Die AGB für humanlantern.com und den Kauf von „Was KI dir nicht nehmen kann“: deine Lizenz, Zahlung, Erstattung und was das Buch ist und was nicht.",
    updated: "2026-10-31",
    intro: "Wenn du humanlantern.com nutzt oder das Buch kaufst, stimmst du diesen Bedingungen zu. Sie sind so geschrieben, dass man sie auch wirklich lesen kann.",
    governing: GOVERNING,
    sections: [
      { h: "1. Wer die Website nutzen darf", blocks: [{ p: "Um das Buch zu kaufen, musst du mindestens 18 Jahre alt sein." }] },
      {
        h: "2. Auslieferung und deine E-Mail-Adresse",
        blocks: [
          { p: "Es gibt keine Konten. Dein Kauf ist an die E-Mail-Adresse gebunden, die du beim Checkout eingibst: Auf der Seite, auf der du nach dem Bezahlen landest, kannst du das Buch sofort lesen oder herunterladen, und wer Zugriff auf dieses Postfach hat, kann uns bitten, das Buch erneut dorthin zu schicken. Verwende eine Adresse, über die du selbst verfügst, und melde dich unter [contact@humanlantern.com](mailto:contact@humanlantern.com), wenn du glaubst, dass jemand anderes an dein Exemplar gelangt ist." },
        ],
      },
      {
        h: "3. Was du kaufst",
        blocks: [
          { p: "„Was KI dir nicht nehmen kann“ (englischer Originaltitel: „What AI Can’t Take From You“) ist ein digitales Buch, das als PDF in drei Sprachausgaben (Englisch, Deutsch, Japanisch) ausgeliefert wird. Mit dem Kauf erhältst du ein persönliches, einfaches (nicht ausschließliches) und nicht übertragbares Nutzungsrecht: Du darfst das Buch lesen und Kopien zum eigenen Gebrauch auf deinen eigenen Geräten speichern. Das gilt auch für Aktualisierungen dieser Ausgabe, die wir veröffentlichen. Du darfst das Buch oder wesentliche Teile davon nicht weiterverkaufen, teilen, hochladen, unterlizenzieren oder weiterverbreiten und die Personalisierungszeile auf den Seiten nicht entfernen." },
        ],
      },
      {
        h: "4. Preise und Zahlung",
        blocks: [
          { p: "Die Preise werden in US-Dollar angezeigt und beim Checkout einmalig berechnet; ein Abo gibt es nicht. Deine Bank rechnet den Betrag gegebenenfalls in deine Währung um. Zahlungen wickelt Stripe ab. Gesetzlich vorgeschriebene Steuern werden beim Checkout ausgewiesen. Wird eine Zahlung rückgängig gemacht (zum Beispiel durch eine Rückbuchung), endet dein Zugang zum Buch." },
        ],
      },
      {
        h: "5. Erstattung und dein Widerrufsrecht",
        blocks: [
          { p: "Wenn das Buch nichts für dich ist, kannst du innerhalb von 7 Tagen nach dem Kauf den vollen Kaufpreis zurückverlangen. Mehr dazu unter [Rückerstattung](/de/refund-policy)." },
          { p: "Wenn du in der EU oder im Vereinigten Königreich lebst: Da das Buch ein digitaler Inhalt ist, der sofort bereitgestellt wird, bitten wir dich vor dem Checkout, ausdrücklich zuzustimmen, dass wir sofort mit der Bereitstellung beginnen, und zu bestätigen, dass dir bekannt ist, dass dein gesetzliches Widerrufsrecht mit Beginn der Bereitstellung erlischt. Unsere 7-Tage-Geld-zurück-Garantie gilt trotzdem." },
        ],
      },
      {
        h: "6. Was das Buch ist und was nicht",
        blocks: [
          { p: "Das Buch und unsere Ratgeber bieten allgemeine Informationen zu Arbeit, Karriere, Fähigkeiten, Einkommen und Wohlbefinden in einer Zeit schnellen technologischen Wandels. Sie sind keine Karriere-, Finanz-, Anlage- oder Rechtsberatung und keine medizinische oder psychologische Beratung, und sie ersetzen keine qualifizierte Fachperson. Die Beispiele sind zur Veranschaulichung aus mehreren Fällen zusammengesetzt. Studien fassen wir in einfacher Sprache zusammen; Einzelheiten findest du in den Originalquellen. Ergebnisse hängen von dir, deinen Umständen und dem Markt ab. Wir versprechen kein bestimmtes Ergebnis, keinen bestimmten Job und kein bestimmtes Einkommen." },
        ],
      },
      { h: "7. Zulässige Nutzung", blocks: [{ p: "Missbrauche die Website nicht: keine Versuche, sie lahmzulegen oder zu überlasten, kein Scraping und keine Massendownloads, kein Teilen von Download-Links und keine Verwendung unserer Inhalte, um ohne Erlaubnis konkurrierende Produkte zu trainieren oder zu entwickeln." }] },
      { h: "8. Geistiges Eigentum", blocks: [{ p: "Das Buch, die Website, der Name und das Logo von Human Lantern sowie alle Ratgeber gehören Human Lantern und sind urheber- und markenrechtlich geschützt. Kurze Zitate mit Quellenangabe sind willkommen." }] },
      {
        h: "9. Haftung und ihre Grenzen",
        blocks: [
          { p: "Die Website und das Buch werden „in der vorliegenden Form“ bereitgestellt. Soweit gesetzlich zulässig, haften wir nicht für indirekte Schäden, Neben- oder Folgeschäden, und unsere Gesamthaftung für Ansprüche im Zusammenhang mit dem Buch ist auf den Betrag begrenzt, den du dafür bezahlt hast. Nichts in diesen Bedingungen schränkt Rechte ein, die dir nach zwingendem Verbraucherrecht zustehen und auf die nicht verzichtet werden kann, etwa deine gesetzlichen Gewährleistungsrechte." },
        ],
      },
      { h: "10. Ende des Zugangs", blocks: [{ p: "Du kannst die Nutzung der Website jederzeit beenden und uns bitten, die Daten zu löschen, die wir über dich gespeichert haben. Bei Verstößen gegen diese Bedingungen, zum Beispiel durch Weiterverbreitung des Buchs, können wir Download-Links deaktivieren und weitere Verkäufe ablehnen." }] },
      { h: "11. Anwendbares Recht", blocks: [{ p: "Für diese Bedingungen gilt das Recht des US-Bundesstaats Michigan. Gewährt dir das Recht deines Wohnsitzlandes einen Schutz, der sich vertraglich nicht ausschließen lässt, bleibt dieser Schutz unberührt." }] },
      { h: "12. Änderungen und Kontakt", blocks: [{ p: "Wir können diese Bedingungen aktualisieren. Dann ändert sich das Datum oben, und die neue Fassung gilt ab diesem Zeitpunkt. Fragen: [contact@humanlantern.com](mailto:contact@humanlantern.com)." }] },
    ],
  },
  refund: {
    title: "Rückerstattung",
    metaDescription:
      "Volle Rückerstattung innerhalb von 7 Tagen nach dem Kauf, ohne Formulare und ohne Diskussion. Wie du sie anforderst, wie lange es dauert und was mit deinem Exemplar passiert.",
    updated: "2026-10-31",
    intro: "Kurz gesagt: Wenn das Buch nichts für dich ist, schreib uns innerhalb von 7 Tagen, und du bekommst jeden Cent zurück.",
    governing: GOVERNING,
    sections: [
      { h: "Das Versprechen", blocks: [{ p: "Wenn dir „Was KI dir nicht nehmen kann“ nicht weiterhilft, kannst du innerhalb von 7 Tagen nach dem Kauf den vollen Kaufpreis zurückverlangen. Einen Grund musst du nicht nennen. Wir freuen uns aber immer, wenn du uns sagst, was wir besser machen können." }] },
      {
        h: "So forderst du sie an",
        blocks: [
          {
            ol: [
              "Schreib eine E-Mail an [contact@humanlantern.com](mailto:contact@humanlantern.com?subject=Refund), und zwar von der Adresse, mit der du gekauft hast, mit „Refund“ (oder „Erstattung“) im Betreff. Deine Bestellnummer (sie beginnt mit HL-) hilft uns, ist aber nicht nötig.",
              "Wir bestätigen deine Anfrage innerhalb von zwei Werktagen und erstatten den Betrag über Stripe auf dein ursprüngliches Zahlungsmittel.",
              "Deine Bank zeigt die Gutschrift meist nach 5 bis 10 Bankarbeitstagen an, je nach Kartenaussteller.",
            ],
          },
        ],
      },
      { h: "Was mit deinem Exemplar passiert", blocks: [{ p: "Sobald die Erstattung veranlasst ist, funktionieren deine Download-Links nicht mehr. Bitte lösche die Kopien, die du heruntergeladen hast." }] },
      { h: "Nach 7 Tagen", blocks: [{ p: "Außerhalb dieses Zeitraums prüfen wir Anfragen im Einzelfall, zum Beispiel wenn dir der Betrag doppelt berechnet wurde oder du wegen eines Problems auf unserer Seite nicht auf das Buch zugreifen konntest. In solchen Fällen bringen wir das immer in Ordnung." }] },
      {
        h: "EU und Vereinigtes Königreich",
        blocks: [
          { p: "Bei digitalen Inhalten besteht ein gesetzliches Widerrufsrecht, das erlischt, sobald die Bereitstellung mit deiner ausdrücklichen Zustimmung beginnt. Diese Zustimmung gibst du vor dem Checkout. An unserer Erstattungsregel ändert das nichts: Die 7-Tage-Geld-zurück-Garantie gilt für jede Bestellung, egal wo du lebst." },
        ],
      },
      { h: "Rückbuchungen", blocks: [{ p: "Wenn etwas schiefgelaufen ist, schreib uns bitte, bevor du eine Zahlung bei deiner Bank anfechtest: Eine Erstattung durch uns geht für dich schneller und einfacher. Solange eine Rückbuchung läuft, ist der Zugang zum Buch für den betreffenden Kauf gesperrt." }] },
      { h: "Kostenlose Bestellungen", blocks: [{ p: "Bei Bestellungen, die mit einem Aktionscode über 100 % Rabatt abgeschlossen wurden, gibt es nichts zu erstatten. Du kannst uns aber trotzdem bitten, das Buch und deine Daten zu entfernen." }] },
    ],
  },
  cookies: {
    title: "Cookie-Richtlinie",
    metaDescription:
      "Die wenigen Cookies auf humanlantern.com: ein notwendiges Cookie für deine Wahl, Stripe beim Checkout, eine Design-Einstellung und FlowGlance-Analyse nur dort, wo sie erlaubt ist.",
    updated: "2026-10-31",
    intro: "Wir fassen uns kurz: Es gibt keine Konten und damit auch keine Anmelde-Cookies für dich. Was es gibt: ein paar notwendige Cookies, damit der Checkout funktioniert, eine gespeicherte Einstellung und unser einziges Analysetool.",
    governing: GOVERNING,
    sections: [
      {
        h: "Was wir verwenden",
        blocks: [
          {
            table: {
              head: ["Name", "Art", "Zweck", "Dauer"],
              rows: [
                ["hl_consent", "Notwendig", "Speichert deine Wahl zur Webanalyse, auch „Mich nicht tracken“, damit FlowGlance aus bleibt und wir nicht erneut fragen.", "180 Tage"],
                ["hl-theme (lokaler Speicher)", "Einstellung", "Speichert, ob du das helle oder das dunkle Design gewählt hast. Wird nie an uns gesendet.", "Bis zum Löschen"],
                ["hl_checkout (Sitzungsspeicher)", "Notwendig", "Hält einen Checkout-Versuch zusammen, damit doppeltes Tippen nie zwei Zahlungen öffnet.", "Nur in diesem Tab"],
                ["Stripe-Cookies", "Notwendig", "Werden von Stripe auf checkout.stripe.com gesetzt, um Zahlungen abzuwickeln und Betrug zu verhindern.", "Legt Stripe fest"],
                ["FlowGlance-Kennungen", "Analyse", "Erkennen wiederholte Besuche und verbinden Seitenaufrufe zu Besuchsverläufen. Werden nur gesetzt, wenn die Webanalyse aktiv ist.", "Legt FlowGlance fest"],
              ],
            },
          },
        ],
      },
      {
        h: "Webanalyse und deine Wahl",
        blocks: [
          { p: "FlowGlance erfasst die Aktivität auf unseren Seiten, auch Text, den du in Formularen absendest, und Bilder, die du hochlädst. In der EU, im EWR, im Vereinigten Königreich und in der Schweiz (oder wenn wir nicht erkennen können, wo du bist) läuft es erst, nachdem du im Banner zugestimmt hast. Überall sonst gibt es kein Banner, und es läuft standardmäßig." },
          { p: "Egal wo du bist: Mit „Mich nicht tracken“ unten auf jeder Seite kannst du es abschalten. FlowGlance stoppt sofort und lädt in diesem Browser nicht mehr. Ein Global-Privacy-Control-Signal deines Browsers zählt als dasselbe Nein." },
          { controls: true },
        ],
      },
      { h: "Cookies blockieren", blocks: [{ p: "Du kannst Cookies in deinen Browsereinstellungen blockieren oder löschen. Blockierst du notwendige Cookies, funktioniert der Checkout möglicherweise nicht. (Unser eigener Admin-Bereich nutzt Anmelde-Cookies von Clerk; wer das Buch kauft, bekommt sie nie.)" }] },
    ],
  },
  commerce: null,
};
