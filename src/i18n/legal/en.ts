import type { LegalSet } from "./types";

/*
 * Legal pages, English (the governing version). de.ts and ja.ts translate this text; where
 * a translation and this version differ, this version applies (each translation says so).
 * Inline markup: **bold**, [label](href), `code`.
 */

export const legalEn: LegalSet = {
  privacy: {
    title: "Privacy policy",
    metaDescription:
      "What Human Lantern collects, why, who processes it (Stripe, Resend, FlowGlance, Cloudflare, Vercel, Neon, Clerk), how long we keep it, and your rights.",
    updated: "2026-10-31",
    intro:
      "Plain language first: we collect what we need to sell and deliver your book, answer your messages and improve the site. There are no accounts to create. We don’t sell your data and we don’t run ads.",
    sections: [
      {
        h: "Who we are",
        blocks: [{ p: "Human Lantern (“we”, “us”) publishes What AI Can’t Take From You and the guides on humanlantern.com. For anything in this policy, write to [contact@humanlantern.com](mailto:contact@humanlantern.com)." }],
      },
      {
        h: "What we collect, and why",
        blocks: [
          { h3: "No accounts" },
          { p: "Buying the book doesn’t require an account or a password. The email address you enter on Stripe’s checkout page is the only identifier we keep for your purchase: it’s how we deliver your book and how we find your order when you ask for the file again at humanlantern.com/download." },
          { h3: "Purchases" },
          { p: "Payments are processed by **Stripe**. We never see or store your card number. Stripe tells us the order details we need to deliver and support your purchase: an order reference, amount, currency, the email used at checkout, any promotion code, the language edition you bought from, and Stripe’s customer and payment identifiers. Stripe processes your payment details under [its own privacy policy](https://stripe.com/privacy)." },
          { h3: "Your personal copy and delivery" },
          { p: "Each copy of the book is personalized: a small line at the bottom of every page shows a masked version of your email (for example `j***n@example.com`) and your order reference. Personalized copies are stored privately in **Cloudflare R2** and delivered through signed links that expire. When email delivery is active, we email the PDF to your checkout address through **Resend**, our email delivery provider. We log each read or download (time, approximate country) and each delivery email to prevent abuse of download links." },
          { h3: "Messages you send us" },
          { p: "When you use the contact form we store your name (optional), email address, topic and message, together with a one-way hash of your IP address and your browser’s user agent to filter spam. We receive a notification so we can reply." },
          { h3: "Analytics (FlowGlance)" },
          { p: "We use **FlowGlance** as our only analytics tool, to understand which pages help and where people get stuck. It records page views, clicks, scrolling and navigation between pages, device and browser type, and approximate location derived from your IP address. We have enabled FlowGlance’s detailed capture, which means it also records **text you submit in forms** (for example the email address you type to get your copy again, or a contact message) and **images you upload** through any upload field. Your card details are entered on Stripe’s page, never on ours, so FlowGlance cannot see them. After a purchase we also tell FlowGlance which order and checkout email the visit belongs to, so we can see how buyers found the book." },
          { p: "**Where you are decides how it starts.** If you visit from the European Union, the European Economic Area, the United Kingdom or Switzerland (or we can’t tell where you are), FlowGlance only loads after you click “Accept analytics” in the banner; if you choose “Essential only” it never loads. Everywhere else we don’t show a banner: FlowGlance runs by default." },
          { p: "**How to say no, wherever you are.** Click “Do not track me” at the bottom of any page. We save your choice in a cookie (`hl_consent`, 180 days) and FlowGlance stops at once and doesn’t load again on this browser. We also treat a Global Privacy Control signal from your browser as a no. You can change your mind with “Cookie settings” in the same place. See our [cookie policy](/cookie-policy)." },
          { h3: "Error reports" },
          { p: "If something breaks, our servers and your browser send a technical error report (error message, the page, browser and device details) to our own error log so we can fix it." },
        ],
      },
      {
        h: "Who processes data for us",
        blocks: [
          {
            ul: [
              "**Vercel** hosts the website (United States).",
              "**Neon** hosts our database: orders, the email each order belongs to, messages and logs (United States).",
              "**Resend** sends the email that delivers your book, when email delivery is active.",
              "**Clerk** secures the sign-in to our own admin area (buyers never sign in).",
              "**Stripe** processes payments, receipts and refunds.",
              "**Cloudflare** provides DNS, email routing for our addresses, private file storage (R2) and the small workers that deliver files and route email.",
              "**FlowGlance** provides website analytics as described above.",
              "**Google Search Console** gives us aggregated search statistics about the site; it does not receive your personal data from us.",
            ],
          },
          { p: "We do not sell personal information and we do not share it for cross-context behavioral advertising." },
        ],
      },
      {
        h: "Legal bases (EU/UK visitors)",
        blocks: [
          {
            ul: [
              "Performing our contract with you: your purchase and delivering your book.",
              "Legitimate interests: security, fraud and abuse prevention, error monitoring, answering messages.",
              "Consent: analytics, for visitors in the EU, EEA, UK and Switzerland. You can withdraw consent at any time with “Do not track me” in the footer.",
              "Legal obligations: keeping transaction records for tax and accounting.",
            ],
          },
        ],
      },
      {
        h: "How long we keep it",
        blocks: [
          {
            ul: [
              "Order records, including the email your book belongs to: seven years, for tax and accounting.",
              "Contact messages: up to 24 months.",
              "Error logs and download logs: up to 12 months.",
              "Database backups: rolling 30 days.",
            ],
          },
        ],
      },
      {
        h: "Your rights",
        blocks: [
          { p: "Depending on where you live, you can ask to access, correct, export or delete your personal data, object to or restrict certain processing, and withdraw consent. California residents have the right to know, delete and correct personal information and not to be discriminated against for exercising those rights. To opt out of analytics, click “Do not track me” in the footer or send a Global Privacy Control signal. For anything else, email [contact@humanlantern.com](mailto:contact@humanlantern.com) from the address you bought with and we’ll respond within 30 days. You can also complain to your local data protection authority." },
        ],
      },
      {
        h: "International transfers",
        blocks: [{ p: "Our providers process data in the United States and other countries. Where required, transfers rely on the providers’ standard contractual clauses or equivalent safeguards." }],
      },
      { h: "Children", blocks: [{ p: "This site and the book are intended for adults (18+). We do not knowingly collect data from children." }] },
      { h: "Changes", blocks: [{ p: "If we change this policy we’ll update the date above, and for material changes we’ll tell buyers by email." }] },
    ],
  },
  terms: {
    title: "Terms of service",
    metaDescription: "The terms for using humanlantern.com and buying What AI Can’t Take From You: your license, payment, refunds, and what the book is and isn’t.",
    updated: "2026-10-31",
    intro: "By using humanlantern.com or buying the book you agree to these terms. They’re written to be read.",
    sections: [
      { h: "1. Who can use the site", blocks: [{ p: "You must be at least 18 years old to buy the book." }] },
      {
        h: "2. Delivery and your email",
        blocks: [
          { p: "There are no accounts. Your purchase is tied to the email you enter at checkout: the page you land on after paying lets you read or download the book right away, and anyone who can read that inbox can ask us to send the book to it again. Use an address you control, and tell us at [contact@humanlantern.com](mailto:contact@humanlantern.com) if you think someone else got hold of your copy." },
        ],
      },
      {
        h: "3. What you’re buying",
        blocks: [
          { p: "What AI Can’t Take From You is a digital book delivered as a PDF in three language editions (English, German, Japanese). When you buy it you receive a personal, non-exclusive, non-transferable license to read it and keep copies for your own use on your own devices, including updates to this edition that we publish. You may not resell, share, upload, sublicense or redistribute the book or any substantial part of it, or remove the personalization line printed on its pages." },
        ],
      },
      {
        h: "4. Prices and payment",
        blocks: [
          { p: "Prices are shown in US dollars and charged once at checkout; there is no subscription. Your bank may convert the amount into your currency. Payments are processed by Stripe. Any taxes required by law are shown at checkout. If a payment is reversed (for example through a chargeback), access to the book ends." },
        ],
      },
      {
        h: "5. Refunds and your right of withdrawal",
        blocks: [
          { p: "If the book isn’t for you, you can get a full refund within 7 days of purchase. See the [refund policy](/refund-policy)." },
          { p: "If you live in the EU or the UK: because the book is digital content delivered immediately, before checkout we ask you to confirm that you want immediate access and that your statutory right of withdrawal ends once delivery begins. Our 7-day money-back guarantee applies regardless." },
        ],
      },
      {
        h: "6. What the book is, and isn’t",
        blocks: [
          { p: "The book and our guides offer general information about work, careers, skills, income and wellbeing in a time of rapid technological change. They are not career, financial, investment, legal, medical or psychological advice, and they are not a substitute for a qualified professional. Examples are illustrative composites. Studies are summarized in plain language; read the original sources for detail. Results depend on you, your circumstances and the market; we don’t promise any particular outcome, job or income." },
        ],
      },
      { h: "7. Acceptable use", blocks: [{ p: "Don’t misuse the site: no attempts to break or overload it, no scraping or bulk downloading, no sharing of download links, and no use of our content to train or build competing products without permission." }] },
      { h: "8. Intellectual property", blocks: [{ p: "The book, the site, the Human Lantern name and logo, and all guides are owned by Human Lantern and protected by copyright and trademark law. Brief quotations with attribution are welcome." }] },
      {
        h: "9. Disclaimers and limits of liability",
        blocks: [
          { p: "The site and book are provided “as is.” To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential damages, and our total liability for any claim relating to the book is limited to the amount you paid for it. Nothing in these terms limits rights you have under consumer protection laws that can’t be waived." },
        ],
      },
      { h: "10. Ending access", blocks: [{ p: "You can stop using the site at any time and ask us to delete the data we hold about you. We may disable download links and refuse further sales to anyone who breaks these terms, for example by distributing the book." }] },
      { h: "11. Governing law", blocks: [{ p: "These terms are governed by the laws of the State of Michigan, United States, except where the law of your country of residence gives you protections that can’t be overridden." }] },
      { h: "12. Changes and contact", blocks: [{ p: "We may update these terms; the date above will change and the new version applies from then on. Questions: [contact@humanlantern.com](mailto:contact@humanlantern.com)." }] },
    ],
  },
  refund: {
    title: "Refund policy",
    metaDescription: "Full refund within 7 days of purchase, no forms and no arguments. How to ask, how long it takes, and what happens to your copy.",
    updated: "2026-10-31",
    intro: "Short version: if the book isn’t for you, email us within 7 days and you get every cent back.",
    sections: [
      { h: "The promise", blocks: [{ p: "If What AI Can’t Take From You doesn’t help you, you can have a full refund within 7 days of your purchase. You don’t need to explain why, though we always appreciate knowing what we could do better." }] },
      {
        h: "How to ask",
        blocks: [
          {
            ol: [
              "Email [contact@humanlantern.com](mailto:contact@humanlantern.com?subject=Refund) from the address you used to buy, with “Refund” in the subject. Your order reference (it starts with HL-) helps but isn’t required.",
              "We confirm within two business days and issue the refund through Stripe to your original payment method.",
              "Your bank usually shows it within 5–10 business days, depending on the card issuer.",
            ],
          },
        ],
      },
      { h: "What happens to your copy", blocks: [{ p: "When a refund is issued, your download links stop working. Please delete the copies you downloaded." }] },
      { h: "After 7 days", blocks: [{ p: "Outside the window we look at requests case by case, for example if you were charged twice or couldn’t access the book because of a problem on our side. In those cases we always make it right." }] },
      {
        h: "EU and UK customers",
        blocks: [
          { p: "Digital content comes with a statutory right of withdrawal that ends once delivery begins with your express consent, which you give before checkout. That doesn’t affect this policy: the 7-day money-back guarantee applies to every order, wherever you live." },
        ],
      },
      { h: "Chargebacks", blocks: [{ p: "If something went wrong, please email us before disputing a charge with your bank: a refund from us is faster and simpler for you. Disputed purchases lose access to the book while the dispute is open." }] },
      { h: "Free orders", blocks: [{ p: "Orders completed with a 100% promotional code have nothing to refund, but you can still ask us to remove the book and your data." }] },
    ],
  },
  cookies: {
    title: "Cookie policy",
    metaDescription: "The few cookies humanlantern.com uses: one essential choice cookie, Stripe at checkout, a theme preference, and FlowGlance analytics only where allowed.",
    updated: "2026-10-31",
    intro: "We keep this short: there are no accounts and no sign-in cookies for buyers. A few essential cookies so checkout works, one preference, and our only analytics tool.",
    sections: [
      {
        h: "What we use",
        blocks: [
          {
            table: {
              head: ["Name", "Type", "Purpose", "Duration"],
              rows: [
                ["hl_consent", "Essential", "Remembers your analytics choice, including “Do not track me”, so FlowGlance stays off and we don’t ask again.", "180 days"],
                ["hl-theme (local storage)", "Preference", "Remembers if you chose the light or dark theme. Never sent to us.", "Until cleared"],
                ["hl_checkout (session storage)", "Essential", "Keeps one checkout attempt together so a double tap never opens two payments.", "This tab"],
                ["Stripe cookies", "Essential", "Set by Stripe on checkout.stripe.com to process payments and prevent fraud.", "Set by Stripe"],
                ["FlowGlance identifiers", "Analytics", "Recognize repeat visits and connect page views into journeys. Only set when analytics are on.", "Set by FlowGlance"],
              ],
            },
          },
        ],
      },
      {
        h: "Analytics and your choice",
        blocks: [
          { p: "FlowGlance records page activity, including text you submit in forms and images you upload. In the EU, EEA, UK and Switzerland (or when we can’t tell where you are) it only runs after you accept it in the banner. Everywhere else there’s no banner and it runs by default." },
          { p: "Anyone can turn it off with “Do not track me” at the bottom of every page: FlowGlance stops at once and doesn’t load again on this browser. A Global Privacy Control signal from your browser counts as the same no." },
          { controls: true },
        ],
      },
      { h: "Blocking cookies", blocks: [{ p: "You can block or delete cookies in your browser settings. If you block essential cookies, checkout may not work. (Our own admin area uses Clerk sign-in cookies; buyers never receive them.)" }] },
    ],
  },
  commerce: null,
};
