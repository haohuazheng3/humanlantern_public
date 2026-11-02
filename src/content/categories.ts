import type { Lang } from "@/i18n/config";

/**
 * Blog taxonomy, shared by the three editions. /blog is a navigation hub; every article lives
 * under /blog/<category>/<slug> (prefixed per edition), and each category page is a hub that can
 * rank on its own (own title, description, intro, breadcrumbs, paginated archive). A hub with no
 * articles yet is noindex and stays out of the sitemap.
 */

export interface CategoryCopy {
  name: string;
  title: string;
  description: string;
  intro: string;
}

export interface Category {
  slug: string;
  /** Chapters of the book this hub draws on (for the book card and finder links). */
  chapters: string[];
  copy: Record<Lang, CategoryCopy>;
}

export const CATEGORIES: Category[] = [
  {
    slug: "ai-and-jobs",
    chapters: ["1.1", "1.3", "1.4", "1.5", "1.7"],
    copy: {
      en: {
        name: "AI and your job",
        title: "AI and Jobs: Will AI Replace Jobs? What the Evidence Says",
        description: "Will AI replace jobs? What the 2026 data shows on AI and jobs: which occupations are most exposed, what's happening to hiring, and how to check your own job.",
        intro: "Most of what you hear about AI and jobs is hype or panic. These guides start from the evidence: which tasks AI can do, which jobs are most exposed and what that means for your next move.",
      },
      de: {
        name: "KI und dein Job",
        title: "Nimmt mir KI den Job weg? Was die Forschung wirklich sagt",
        description: "Welche Aufgaben KI zuerst übernimmt, welche Berufe sich am stärksten verändern und was das für Einsteiger heißt, mit Quellen.",
        intro: "Das meiste, was du über KI und Jobs hörst, ist Hype oder Panik. Diese Guides gehen von den Daten aus: welche Aufgaben sich ändern, wer am stärksten betroffen ist und was das für deinen nächsten Schritt bedeutet.",
      },
      ja: {
        name: "AIと仕事",
        title: "AIに仕事を奪われる？研究データが示す本当のところ",
        description: "AIが最初に置き換える業務、変化が大きい職種、新人の仕事に起きていることを、出典つきで解説します。",
        intro: "AIと仕事の話は、誇大宣伝か不安をあおる話がほとんどです。ここでは研究データから出発し、どの業務が変わり、誰が影響を受けやすく、あなたが次に何をすべきかを整理します。",
      },
    },
  },
  {
    slug: "careers",
    chapters: ["8.1", "8.2", "8.4", "8.5", "8.6"],
    copy: {
      en: {
        name: "Career moves",
        title: "Career Change: How to Change Careers in the Age of AI",
        description: "How to change careers without a panic move: decision tests, career change at 30, 40 and 50, whether a degree pays, layoffs, severance and jobs worth switching to.",
        intro: "Big career decisions made in a panic are usually the wrong ones. These guides give you decision tests, honest odds and the steps that work whether you stay, switch or get pushed.",
      },
      de: {
        name: "Karriere",
        title: "Karriere im KI-Zeitalter: wechseln, bleiben oder aufsteigen",
        description: "Branche wechseln, weiterbilden oder dranbleiben? Entscheidungstests für Karriereschritte, Kündigungen und den Aufstieg auf einer Leiter, die KI flacher macht.",
        intro: "Große Karriereentscheidungen aus Panik sind meistens falsch. Diese Guides geben dir Entscheidungstests, ehrliche Chancen und Schritte, die funktionieren, egal ob du bleibst oder gehst.",
      },
      ja: {
        name: "キャリア",
        title: "AI時代のキャリア選択：転職するか、とどまるか、伸ばすか",
        description: "業界を変えるべきか、学び直すべきか、今の道を極めるべきか。転職・リストラ・昇進の判断に使えるチェックリストを解説します。",
        intro: "焦って下した大きなキャリア判断は、たいてい間違います。ここでは判断のための問い、現実的な見通し、とどまっても動いても役立つ手順を紹介します。",
      },
    },
  },
  {
    slug: "job-search",
    chapters: ["7.1", "7.2", "7.3", "7.4", "7.5"],
    copy: {
      en: {
        name: "Getting hired",
        title: "Job Search Tips That Work When AI Floods Every Opening",
        description: "Job search tips and strategies for 2026: résumés that survive software, referrals, cover letters, thank-you emails, negotiation and using AI without faking it.",
        intro: "AI made applying nearly free, so every opening drowns in applications. These guides show how to step out of the flood: fewer, sharper applications, proof of work and people who vouch for you.",
      },
      de: {
        name: "Bewerbung",
        title: "So wirst du eingestellt, wenn KI jede Stelle mit Bewerbungen flutet",
        description: "Lebensläufe, die Software und Menschen überzeugen, Empfehlungen, Portfolio-Projekte, Interviews und KI in der Jobsuche, ohne zu schummeln.",
        intro: "KI hat das Bewerben fast kostenlos gemacht, also ertrinkt jede Stelle in Bewerbungen. Diese Guides zeigen dir, wie du aus der Masse heraustrittst: weniger, aber gezieltere Bewerbungen, Arbeitsproben und Menschen, die für dich bürgen.",
      },
      ja: {
        name: "就職・転職活動",
        title: "AIで応募が殺到する時代に、採用される方法",
        description: "ソフトにも人にも読まれる履歴書、紹介（リファラル）、ポートフォリオ、判断力を見る面接、そしてごまかさずにAIを就活に使う方法。",
        intro: "AIで応募が簡単になり、どの求人にも応募が殺到しています。ここでは、その波から抜け出す方法を解説します。数を減らして精度を上げた応募、実績の見える化、そしてあなたを推してくれる人です。",
      },
    },
  },
  {
    slug: "skills",
    chapters: ["5.1", "5.2", "5.4", "5.5", "8.3"],
    copy: {
      en: {
        name: "Skills to learn",
        title: "Skills to Learn in the Age of AI, and How to Learn Them",
        description: "Which skills to learn now: the AI skills employers want, the human skills AI makes more valuable, transferable skills for career changers and how to finish learning.",
        intro: "The skills that last pair AI fluency with what AI does poorly. These guides help you find what you already have, rate what you're missing and learn it without fooling yourself.",
      },
      de: {
        name: "Skills",
        title: "Welche Fähigkeiten du im KI-Zeitalter lernen solltest (und welche nicht)",
        description: "Fähigkeiten, die sich lohnen, wenn KI die Entwürfe schreibt: lernen lernen, Schreiben, Zahlen, Urteilsvermögen, Tiefe plus Breite und ob du programmieren lernen solltest.",
        intro: "Jeder Guru hat eine andere Liste von Fähigkeiten, die du unbedingt brauchst. Diese Guides gehen davon aus, was wirklich wertvoller wird, wenn Ergebnisse billig werden, und wie du es aufbaust, ohne ein Jahr zu verschwenden.",
      },
      ja: {
        name: "スキル",
        title: "AI時代に学ぶべきスキル（と、学ばなくていいもの）",
        description: "下書きをAIが書く時代に価値が増すスキル：学び方、書く力、数字、判断力、深さと幅、そしてプログラミングを学ぶべきか。",
        intro: "身につけるべきスキルのリストは、人によってバラバラです。ここでは「アウトプットが安くなると何の価値が上がるのか」から出発し、1年を無駄にせずに身につける方法を解説します。",
      },
    },
  },
  {
    slug: "working-with-ai",
    chapters: ["4.1", "4.2", "4.3", "4.5", "4.7"],
    copy: {
      en: {
        name: "Working with AI",
        title: "AI in the Workplace: How to Use AI at Work Without Getting Worse",
        description: "AI in the workplace in 2026: how people use AI at work, prompts for weekly tasks, what never to paste into a chatbot, and the risks of trusting it too much.",
        intro: "Used well, AI makes you faster and better. Used carelessly, it quietly makes you worse. These guides show the difference, with prompts you can use today.",
      },
      de: {
        name: "Arbeiten mit KI",
        title: "KI im Job nutzen, ohne dabei schlechter zu werden",
        description: "Prompts, die funktionieren, KI-Ergebnisse prüfen, ein eigener Workflow, was nie in einen Chatbot gehört, und mit KI lernen, ohne dich selbst zu täuschen.",
        intro: "Gut eingesetzt macht KI dich schneller und besser. Unachtsam eingesetzt macht sie dich leise schlechter. Diese Guides zeigen den Unterschied, mit Prompts, die du heute nutzen kannst.",
      },
      ja: {
        name: "AIとの働き方",
        title: "仕事でAIを使っても、自分の力を落とさない方法",
        description: "効くプロンプト、AIの出力の確かめ方、自分なりのワークフロー、チャットに貼ってはいけないもの、自分をごまかさないAI学習法。",
        intro: "うまく使えば、AIはあなたを速く、上手にします。雑に使えば、気づかないうちに力を落とします。その違いを、今日から使えるプロンプトとともに解説します。",
      },
    },
  },
  {
    slug: "side-income",
    chapters: ["9.1", "9.2", "9.3", "9.5", "9.7"],
    copy: {
      en: {
        name: "Income beyond a paycheck",
        title: "How to Make Extra Money: Side Hustle Ideas Without the Scams",
        description: "How to make extra money with skills you already have: side hustle ideas that survive a bad year, freelance pricing, AI money reality checks and scam red flags.",
        intro: "One income is a single point of failure. These guides cover realistic ways to make extra money, honest odds and the red flags of the AI money schemes flooding your feed.",
      },
      de: {
        name: "Nebeneinkommen",
        title: "Ein zweites Einkommen im KI-Zeitalter, ohne Abzocke",
        description: "Freelancing mit KI-Hebel, dein Wissen als Produkt, eine eigene Zielgruppe aufbauen, Preise setzen und KI-Reich-werden-Maschen erkennen.",
        intro: "Ein einziges Einkommen ist ein Single Point of Failure. Diese Guides zeigen realistische Nebeneinkommen, ehrliche Chancen und die Warnzeichen der KI-Geldmaschen in deinem Feed.",
      },
      ja: {
        name: "副収入",
        title: "AI時代の副収入：詐欺にひっかからずに始める",
        description: "AIを活用したフリーランス、知識の商品化、発信力づくり、価格のつけ方、そして「AIで簡単に稼げる」話の見抜き方。",
        intro: "収入源がひとつだけなのは、単一障害点です。ここでは現実的な副収入、正直な見通し、そしてタイムラインにあふれる「AIで稼ぐ」話の危険信号を解説します。",
      },
    },
  },
  {
    slug: "money",
    chapters: ["10.1", "10.2", "10.3", "10.4", "10.6"],
    copy: {
      en: {
        name: "Money and runway",
        title: "How to Build an Emergency Fund (and Why Runway Is Freedom)",
        description: "How to build an emergency fund: how much to save, how long savings last if your paycheck stops and turning raises into runway. General education, not advice.",
        intro: "Savings aren't just security; they're the freedom to say no, to switch and to learn. These guides keep it general and practical. Not financial advice.",
      },
      de: {
        name: "Geld und Puffer",
        title: "Geld, das dir Zeit verschafft: Puffer, Fixkosten und das schlechte Jahr",
        description: "Wie viel Puffer du brauchst, warum Fixkosten deine Optionen bestimmen, Lifestyle-Inflation und warum du dein Erspartes nicht auf Hype setzt. Allgemeine Infos, keine Finanzberatung.",
        intro: "Ersparnisse sind nicht nur Sicherheit, sondern die Freiheit, Nein zu sagen, zu wechseln, zu lernen. Diese Guides bleiben allgemein und praktisch. Keine Finanzberatung.",
      },
      ja: {
        name: "お金と生活防衛資金",
        title: "時間を買うお金：生活防衛資金、固定費、そして「悪い年」への備え",
        description: "どれくらい備えるか、固定費が選択肢を決める理由、生活水準の上昇、流行に貯金を賭けない理由。一般的な情報であり、金融アドバイスではありません。",
        intro: "貯金は安心のためだけでなく、断る自由、移る自由、学ぶ自由をくれます。ここでは一般的かつ実践的な内容に絞ります。金融アドバイスではありません。",
      },
    },
  },
  {
    slug: "clear-head",
    chapters: ["2.1", "2.2", "2.3", "11.1", "11.5"],
    copy: {
      en: {
        name: "A clear head",
        title: "Job Insecurity: How to Think Clearly When Work Feels Unsafe",
        description: "Job insecurity and AI anxiety: why the fear feels so strong, what the evidence says, how to cope this week, burnout and imposter checks, and when to get help.",
        intro: "You can't make good decisions with a head full of headlines. These guides help you turn worry into one next step and protect the attention, sleep and nerve your work depends on.",
      },
      de: {
        name: "Ein klarer Kopf",
        title: "KI-Angst: klar denken, wenn die Schlagzeilen nicht aufhören",
        description: "Angst als Signal, Doomscrolling, Hype und Weltuntergang, Fokus, Schlaf, Einsamkeit und Burnout unter Druck, und wann Sorgen mehr brauchen als einen Guide.",
        intro: "Mit einem Kopf voller Schlagzeilen triffst du keine guten Entscheidungen. Diese Guides helfen dir, Sorgen in einen nächsten Schritt zu verwandeln und Aufmerksamkeit, Schlaf und Nerven zu schützen.",
      },
      ja: {
        name: "クリアな思考",
        title: "AI不安：ニュースが止まらない時代に、冷静に考える方法",
        description: "不安をシグナルとして扱う、ドゥームスクロール、誇大宣伝と悲観論、集中力、睡眠、孤独、燃え尽き。そして専門家の助けが必要なとき。",
        intro: "ニュースで頭がいっぱいのままでは、良い判断はできません。不安を「次の一歩」に変え、仕事を支える集中力・睡眠・気力を守るためのガイドです。",
      },
    },
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
