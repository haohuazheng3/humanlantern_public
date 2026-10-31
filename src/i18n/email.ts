import type { Lang } from "./config";

/** The delivery email, in the language of the edition the buyer came from. */
export interface DeliveryCopy {
  subject: (title: string) => string;
  preheader: (ref: string) => string;
  thanks: (title: string) => string;
  attached: (pages: number) => string;
  button: string;
  linkNote: (days: number) => string;
  editions: string;
  start: string;
  order: (ref: string) => string;
  again: string;
  againLink: string;
  refund: (days: number) => string;
  waiver: string;
}

export const DELIVERY_EMAIL: Record<Lang, DeliveryCopy> = {
  en: {
    subject: (title) => `Your copy of ${title}`,
    preheader: (ref) => `Your PDF is attached. Order ${ref}.`,
    thanks: (title) => `Thanks for buying ${title}.`,
    attached: (pages) =>
      `Your personal copy is attached as a PDF (${pages} pages). Each page carries a small line with your email and order number, so please keep it to yourself.`,
    button: "Download the PDF",
    linkNote: (days) => `Can’t open the attachment? The button works for ${days} days.`,
    editions: "Your purchase includes all three editions. Read them here:",
    start: "Where to start: the Situation Finder at the front sends you to the chapter for whatever is on your mind. Or read Part 1 tonight; it’s eight short chapters.",
    order: (ref) => `Order: ${ref}`,
    again: "Need the file again later?",
    againLink: "Get a fresh link",
    refund: (days) => `Changed your mind? You have ${days} days for a full refund. Just reply to this email.`,
    waiver: "As you confirmed before paying, you asked for immediate access to this digital content.",
  },
  de: {
    subject: (title) => `Dein Exemplar von „${title}“`,
    preheader: (ref) => `Dein PDF ist angehängt. Bestellung ${ref}.`,
    thanks: (title) => `Danke, dass du „${title}“ gekauft hast.`,
    attached: (pages) =>
      `Dein persönliches Exemplar hängt als PDF an (${pages} Seiten). Jede Seite trägt eine kleine Zeile mit deiner E-Mail-Adresse und Bestellnummer – behalte es also bitte für dich.`,
    button: "PDF herunterladen",
    linkNote: (days) => `Der Anhang lässt sich nicht öffnen? Der Button funktioniert ${days} Tage lang.`,
    editions: "Dein Kauf enthält alle drei Ausgaben. Hier kannst du sie lesen:",
    start: "Wo du anfängst: Der Situationsfinder vorne im Buch führt dich zu dem Kapitel, das zu deiner Frage passt. Oder lies heute Abend Teil 1 – acht kurze Kapitel.",
    order: (ref) => `Bestellung: ${ref}`,
    again: "Du brauchst die Datei später noch einmal?",
    againLink: "Neuen Link anfordern",
    refund: (days) => `Doch nicht das Richtige? Du hast ${days} Tage Zeit für eine volle Erstattung. Antworte einfach auf diese E-Mail.`,
    waiver: "Wie du vor dem Bezahlen bestätigt hast, wolltest du sofortigen Zugang zu diesen digitalen Inhalten.",
  },
  ja: {
    subject: (title) => `『${title}』をお届けします`,
    preheader: (ref) => `PDFを添付しています。ご注文番号 ${ref}`,
    thanks: (title) => `『${title}』をお買い上げいただき、ありがとうございます。`,
    attached: (pages) =>
      `あなた専用のPDF（${pages}ページ）を添付しました。各ページの下部に、メールアドレスの一部とご注文番号が小さく入っています。ご自身の範囲でお使いください。`,
    button: "PDFをダウンロード",
    linkNote: (days) => `添付ファイルが開けない場合は、上のボタンから${days}日間ダウンロードできます。`,
    editions: "ご購入には3つの言語版すべてが含まれます。こちらから読めます：",
    start: "おすすめの読み始め方：冒頭の「お悩み別ガイド」で、いま気になっていることに合う章を探してください。または今夜、第1部（短い8章）から読んでみてください。",
    order: (ref) => `ご注文番号：${ref}`,
    again: "あとでもう一度ファイルが必要になったら",
    againLink: "新しいリンクを受け取る",
    refund: (days) => `お気に召さなかった場合は、ご購入から${days}日以内であれば全額返金します。このメールにご返信ください。`,
    waiver: "お支払い前にご確認いただいたとおり、本デジタルコンテンツへの即時アクセスをご希望いただきました。",
  },
};
