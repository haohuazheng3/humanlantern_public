/**
 * Pillar copy for the English category hubs: an answer-first lead, the guides to start with,
 * short sourced sections and an FAQ. Shown on page 1 of each hub only; the paginated archive
 * stays a plain list. Every number here is in research/seo/facts.md with its source.
 */

export interface Pillar {
  /** 40–60 words, answer first. Inline markup: **bold**, [label](href). */
  answer: string;
  /** The guides to read first, in order: post slug + one line on why. */
  start: { slug: string; why: string }[];
  sections: { h2: string; body: string[]; bullets?: string[] }[];
  faq: { q: string; a: string }[];
}

export const PILLARS: Record<string, Pillar> = {
  "ai-and-jobs": {
    answer:
      "**AI is replacing tasks faster than whole jobs.** US data show no broad AI-driven job loss so far, but the work inside many jobs is changing, and hiring of young workers in the most exposed office jobs has slowed. Jobs built mostly on routine writing, data handling and screen work face the most pressure.",
    start: [
      { slug: "will-ai-take-my-job", why: "Rate your own weekly tasks and see how much of your job AI could carry." },
      { slug: "what-jobs-will-ai-replace", why: "The 40 jobs with the highest exposure, ranked with BLS data." },
      { slug: "ai-proof-jobs", why: "Find careers AI matches poorly, filtered by education and pay." },
    ],
    sections: [
      {
        h2: "Will AI replace jobs? What the data shows in 2026",
        body: [
          "**Not across the economy, at least not yet.** Yale's Budget Lab found [no clear evidence of broad labor-market disruption](https://interactives.budgetlab.yale.edu/tools/ai-labor-market-tracker/?tab=current-update) from AI through September 2026, though unemployment among AI-exposed workers has risen slightly faster than among similar unexposed workers.",
          "The pressure shows up at the bottom of the ladder. Stanford economists found employment of [22-to-25-year-olds in the most AI-exposed occupations](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/) 19% below the path of less-exposed peers by mid-2026, mostly from fewer hires rather than more firings.",
        ],
      },
      {
        h2: "Which jobs are most exposed to AI?",
        body: [
          "**BLS now rates every occupation's AI exposure, and exposure isn't the same as job loss.** Of 761 occupations in its [2025–35 exposure categories](https://www.bls.gov/emp/publications/ai-exposure-categories.htm), 188 are rated very high, 183 high, 188 moderate and 202 low.",
          "Very high exposure includes claims adjusters (projected −5.5% by 2035) and customer service representatives, but also data scientists, projected to grow about 35%. Low exposure is mostly hands-on work: dental assistants (+7.4%), construction laborers (+7.3%) and maintenance and repair workers.",
        ],
      },
      {
        h2: "How to check your own job",
        body: ["**Look at your tasks, not your title.** Two people with the same title can have very different exposure depending on how their week is split."],
        bullets: [
          "List the tasks that fill your week and how much time each takes.",
          "Mark which ones AI can already do, which it can draft for you to check, and which need you.",
          "Move your time toward the third group: judgment, trust, people and physical work.",
        ],
      },
    ],
    faq: [
      { q: "Will AI replace jobs?", a: "AI is replacing tasks within jobs faster than whole jobs. Through September 2026, Yale's Budget Lab found no clear evidence of broad labor-market disruption, but hiring of young workers in the most AI-exposed office occupations has slowed." },
      { q: "What jobs will AI not replace?", a: "Jobs that rely on physical work in unpredictable places, hands-on care, trust and accountability are the least exposed: skilled trades, many healthcare roles and maintenance work sit in BLS's low exposure band. Even there, AI will change some tasks." },
      { q: "How many jobs will AI replace?", a: "No one knows, and early forecasts have been wrong before. In 2013, Oxford researchers estimated 47% of US employment was at risk of computerisation; employment kept growing. BLS still projects total US employment to rise 3.5% from 2025 to 2035." },
      { q: "Is AI creating new jobs?", a: "Yes, though they're harder to see in advance. About 60% of US employment in 2018 was in job titles that didn't exist in 1940, and BLS projects data scientists to grow about 35% to 2035." },
    ],
  },

  careers: {
    answer:
      "**A good career change starts with a small test, not a resignation letter.** Talk to people in the field, try the work on a side project, check your money, then switch in steps. Changing course is normal: Americans born from 1957 to 1964 held an average of 12.9 jobs between ages 18 and 58.",
    start: [
      { slug: "career-change-quiz", why: "Ten questions that show which stage of a switch you're in." },
      { slug: "should-i-quit-my-job", why: "Weigh your case for leaving against your readiness to leave well." },
      { slug: "best-jobs-for-the-future", why: "Growth, pay and AI exposure side by side for the jobs worth moving into." },
      { slug: "severance-calculator", why: "If the change wasn't your choice, start with what you're owed." },
    ],
    sections: [
      {
        h2: "How to change careers: five steps that lower the risk",
        body: ["**Treat a career change as a series of experiments, each one cheap to undo.**"],
        bullets: [
          "Pick one target role and read ten real job postings for it.",
          "Talk to three people who do the job now.",
          "Try the work: a course with real assignments, a volunteer project or a paid gig.",
          "Count the cost: training, any pay cut and how many months of savings you have.",
          "Switch in steps: an internal move, a hybrid role or freelance work before a full jump.",
        ],
      },
      {
        h2: "Is it too late to change careers?",
        body: [
          "**No, but the approach changes with age.** BLS data show people still start new jobs in their 40s and 50s, about [2.2 jobs at ages 45 to 54](https://www.bls.gov/news.release/nlsoy.nr0.htm) on average for one generation. After 40, the federal ADEA protects you from [age discrimination](https://www.eeoc.gov/age-discrimination); in practice, experience and networks become your strongest assets.",
        ],
      },
      {
        h2: "Should you switch careers because of AI?",
        body: [
          "**Switch because of evidence about your own tasks, not headlines.** High AI exposure often means the job is changing, not disappearing. Moving can pay, though: the Atlanta Fed's tracker shows median pay for [job switchers rising 4.7%](https://www.atlantafed.org/research-and-data/data/wage-growth-tracker) a year in September 2026, against 3.4% for people who stayed.",
        ],
      },
    ],
    faq: [
      { q: "How do I change careers?", a: "Pick one target role, talk to people who do it, try the work in a small way, check your finances and switch in steps, such as an internal move or freelance work, before making a full jump." },
      { q: "What is the best age to change careers?", a: "There isn't one. People change jobs throughout their working lives; the approach changes with age, from building skills fast in your 20s and 30s to leading with experience and your network in your 40s and 50s." },
      { q: "How do I change careers with no experience?", a: "Build small pieces of proof in the new field (a project, a certificate with real assignments, volunteer work) and translate your existing experience into the new field's language on your résumé." },
      { q: "Is a career change worth it financially?", a: "It can be, especially if you move into a growing field, but plan for a possible pay dip at first. Check training costs against the likely pay difference, and keep at least six months of essential costs saved before you switch." },
    ],
  },

  "job-search": {
    answer:
      "**The job search strategies that work now are fewer, sharper applications backed by proof and people.** Applications through LinkedIn jumped 45% in a year to about 11,000 a minute, so mass-applying gets lost. Tailor each application, link a work sample, ask for referrals and follow up.",
    start: [
      { slug: "how-to-get-a-job-with-no-experience", why: "What the 2026 data says about entry-level hiring, and the moves that still work." },
      { slug: "chatgpt-resume", why: "Résumé prompts that polish your real experience without inventing any." },
      { slug: "how-to-ask-for-a-referral", why: "Messages that get a yes from friends, ex-colleagues and strangers." },
      { slug: "salary-negotiation-email", why: "Got the offer? Ask for more, politely and once." },
    ],
    sections: [
      {
        h2: "Job search tips that actually move the needle",
        body: [
          "**Referrals, tailoring and follow-up beat volume.** At one US company economists studied, referred candidates were [6% of applicants but 29% of hires](https://repec.iza.org/dp8175.pdf). In a field experiment by the résumé company ResumeGo, [tailored cover letters got 53% more callbacks](https://www.resumego.net/research/cover-letters/) than none.",
        ],
        bullets: [
          "Apply to fewer roles, each tailored to the ad's own words.",
          "Link one piece of proof: a project, a portfolio or a short case study.",
          "Ask one person inside the company for advice or a referral.",
          "Send a thank-you email within 24 hours of every interview.",
        ],
      },
      {
        h2: "Job search strategies for the AI era",
        body: [
          "**Use AI to polish, never to invent.** In a study of nearly half a million jobseekers, those offered [algorithmic writing help](https://www.nber.org/papers/w30886) on their résumés were hired 8% more often. But software screens hard: 88% of executives in a Harvard Business School survey agreed qualified people get [filtered out for not matching exact criteria](https://www.hbs.edu/managing-the-future-of-work/research/Pages/hidden-workers-untapped-talent.aspx).",
        ],
      },
      {
        h2: "How long does a job search take?",
        body: [
          "**Longer than most people plan for.** In September 2026 the median unemployed American had been looking for [11.5 weeks](https://fred.stlouisfed.org/series/UEMPMED), but the average was 24.8 weeks, and 27.1% had been out of work for six months or more.",
        ],
      },
    ],
    faq: [
      { q: "What are the best job search tips?", a: "Apply to fewer jobs and tailor each application, link a work sample, ask for referrals, prepare for structured interview questions and send a thank-you email within 24 hours." },
      { q: "What job search strategies work best?", a: "Referrals and tailored applications. Referred candidates are hired at far higher rates than their share of applicants, and tailored cover letters get more callbacks than generic ones or none." },
      { q: "Should I use AI for my job search?", a: "Yes, to polish real experience, prepare for interviews and tailor applications. Never let it invent numbers, skills or titles, and check every line before you send it." },
    ],
  },

  skills: {
    answer:
      "**The skills worth learning now pair AI fluency with what AI does poorly: judgment, clear communication, working with people and deep knowledge of a field.** Employers rank AI and big data as the fastest-growing skill to 2030, but analytical thinking is still the core skill they most often call essential.",
    start: [
      { slug: "ai-skills", why: "Rate yourself on 10 practical AI skills and find the one to build next." },
      { slug: "transferable-skills", why: "Turn the experience you already have into résumé lines for a new field." },
    ],
    sections: [
      {
        h2: "Which skills should you learn in 2026?",
        body: [
          "**Learn one AI skill and one human skill at the same time.** The World Economic Forum's [Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/) lists AI and big data, networks and cybersecurity and technological literacy as the fastest-growing skills, and expects 39% of workers' existing skills to be transformed or outdated by 2030.",
          "Human skills are rising too. PwC's [2026 AI Jobs Barometer](https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html) found new tasks in AI-exposed jobs are 2.5 times more likely to rely on empathy, judgement and creativity.",
        ],
        bullets: [
          "AI fluency: briefing, checking and building workflows.",
          "Analytical thinking: reading data and spotting what's wrong.",
          "Writing and speaking so people act.",
          "Deep knowledge of one field, plus enough range to connect it to others.",
        ],
      },
      {
        h2: "How to learn a new skill and actually finish",
        body: [
          "**Learn by making something real, in small, regular sessions.** Courses alone rarely stick: in six years of MIT and Harvard courses on edX, [only 3.13% of participants](https://doi.org/10.1126/science.aav7958) finished in 2017–18, though 46% of those who paid for a certificate did. Commitment, deadlines and a project you care about make the difference.",
        ],
      },
    ],
    faq: [
      { q: "What skills should I learn?", a: "Combine AI fluency (writing clear briefs, checking output, building workflows) with skills AI does poorly: analytical thinking, clear writing and speaking, working with people and deep knowledge of your field." },
      { q: "What are the most in-demand skills?", a: "In the World Economic Forum's 2025 survey, AI and big data, networks and cybersecurity and technological literacy are the fastest-growing skills, while analytical thinking remains the core skill most employers call essential." },
      { q: "How long does it take to learn a new skill?", a: "Basic competence often takes weeks of regular practice; real proficiency takes months. Short daily sessions and a real project you finish matter more than the total hours you plan." },
    ],
  },

  "working-with-ai": {
    answer:
      "**AI in the workplace is common but uneven: about half of US employees have used it at work, yet only 3 in 10 use it weekly.** Used well, it makes you faster on tasks it handles well; used carelessly, it makes confident mistakes and leaks data. The difference is how you brief it, check it and what you paste.",
    start: [
      { slug: "how-to-use-ai-at-work", why: "Copy-ready prompts for the email, meetings and documents you handle every week." },
      { slug: "is-chatgpt-safe", why: "Scan text for sensitive details before you paste it into a chatbot." },
    ],
    sections: [
      {
        h2: "How is AI used in the workplace?",
        body: [
          "**Mostly for writing, summarising and analysis, and much more in some industries than others.** As of May 2026, Gallup found [52% of US employees](https://www.gallup.com/699797/indicator-artificial-intelligence.aspx) used AI at work at least a few times a year and 15% daily. Daily use reached 42% in technology and 27% in finance.",
          "Users mostly like it: in the Fed's 2025 survey, [81% said it saves them time](https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-employment-and-job-quality.htm), 52% said it improved quality and 55% said it let them do new tasks.",
        ],
      },
      {
        h2: "The risks of AI at work",
        body: [
          "**Wrong answers on hard tasks, and data in the wrong place.** In a Harvard Business School study with BCG, consultants using GPT-4 were [19% less likely to get a task right](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700) when it lay outside what AI does well. And only 25% of employees say their organization has a clear AI plan, so many people improvise.",
        ],
        bullets: [
          "Use your company's approved tool for anything confidential.",
          "Strip names and figures before pasting into a personal account.",
          "Check every fact, number and quote before it leaves your desk.",
          "Be open about where AI helped and how you checked it.",
        ],
      },
    ],
    faq: [
      { q: "How is AI used in the workplace?", a: "Most often for drafting and editing text, summarising documents and meetings, analysing data and writing code. As of May 2026, 15% of US employees used AI daily in their role and 30% a few times a week or more." },
      { q: "What are the risks of AI at work?", a: "Confident but wrong answers, especially on complex tasks; confidential or personal data pasted into unapproved tools; and over-reliance that erodes your own skills. Approved tools, careful checking and clear rules reduce all three." },
      { q: "Will using AI at work make me worse at my job?", a: "It can if you hand over your thinking. Use it to go faster on work you understand, check what it produces, and keep doing the hard parts yourself often enough to stay sharp." },
    ],
  },

  "side-income": {
    answer:
      "**The surest way to make extra money is to sell a skill you already have to people you can reach, and use AI to deliver it faster.** About 9 million Americans hold more than one job. Skip anything that asks you to pay first: the FTC has sued AI 'business opportunities' over tens of millions of dollars in alleged losses.",
    start: [
      { slug: "second-income-ideas", why: "Ideas compared on startup cost, speed and how they hold up in a bad year." },
      { slug: "how-to-make-money-with-ai", why: "A 10-question reality check on your AI money idea." },
      { slug: "freelance-rate-calculator", why: "Set a rate that covers tax, costs and unpaid hours." },
      { slug: "how-much-to-charge-for-logo-design", why: "The same pricing logic, applied to a logo project." },
    ],
    sections: [
      {
        h2: "Side hustle ideas that hold up",
        body: [
          "**Pick work people need even when money is tight, that costs little to start.** Tutoring, bookkeeping, repairs, care services and freelance work in your own field pass that test. Bulk AI-made content mostly doesn't: after ChatGPT launched, writing freelancers on Upwork saw [earnings fall 5.2%](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18441) relative to less exposed fields.",
        ],
      },
      {
        h2: "How to make extra money without getting scammed",
        body: [
          "**A real side hustle has customers before it has costs.** In its 2024 [Operation AI Comply](https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes), the FTC alleged one AI store scheme cost consumers at least $25 million.",
        ],
        bullets: [
          "Walk away from upfront fees for coaching, courses or 'done-for-you' stores.",
          "Treat any promised monthly income as a red flag.",
          "Set aside a quarter to a third of side earnings for tax; self-employment tax applies from $400 a year.",
        ],
      },
    ],
    faq: [
      { q: "How can I make extra money?", a: "Sell a skill you already have, such as tutoring, bookkeeping, repairs, care or freelance work in your field, to people you can reach directly. Start with one paying customer and grow from referrals." },
      { q: "What are the best side hustle ideas?", a: "Ones that cost little to start, pay within weeks and survive a downturn: freelance work in your field, tutoring, bookkeeping for small businesses, home repairs, and pet, child or elder care." },
      { q: "Do I have to pay tax on side hustle income?", a: "Yes. In the US, self-employment tax applies once net earnings reach $400 a year, and you generally need to make quarterly estimated payments if you expect to owe $1,000 or more." },
    ],
  },

  money: {
    answer:
      "**To build an emergency fund, set a target of three to six months of essential costs, start with a first $1,000, and automate a transfer on every payday into a separate, insured savings account.** Only 55% of US adults had three months of expenses saved in 2025. General education, not financial advice.",
    start: [
      { slug: "how-much-should-i-have-in-savings", why: "Your target in months and dollars, based on your situation." },
      { slug: "how-long-will-my-savings-last", why: "How many months your money covers if your paycheck stops." },
      { slug: "raise-calculator", why: "Turn your next raise into savings before it becomes spending." },
    ],
    sections: [
      {
        h2: "How to build an emergency fund, step by step",
        body: ["**Start small, automate it and keep it out of sight.** The Consumer Financial Protection Bureau calls automatic recurring transfers [one of the easiest ways to save](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/)."],
        bullets: [
          "Add up your essential monthly costs: housing, food, utilities, insurance, transport, minimum debt payments.",
          "Save a first $1,000, then one month of costs, then your full target.",
          "Set an automatic transfer on payday into a separate savings account.",
          "Send windfalls and part of every raise straight to it.",
        ],
      },
      {
        h2: "How big should an emergency fund be?",
        body: [
          "**Three to six months for most people, more if your income is less secure.** Job searches run long: in September 2026 the [average unemployment spell](https://fred.stlouisfed.org/series/UEMPMEAN) had lasted 24.8 weeks. Self-employed people need more, because 58% say their income varies month to month.",
        ],
      },
      {
        h2: "Where should an emergency fund be kept?",
        body: [
          "**Somewhere safe, separate and quick to reach,** such as an insured savings account at a bank or credit union. Avoid relying on retirement accounts: withdrawals before age 59½ generally carry an [additional 10% tax](https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions) on top of income tax.",
        ],
      },
    ],
    faq: [
      { q: "How do I build an emergency fund?", a: "Work out your essential monthly costs, aim for a first $1,000, then three to six months of those costs, and automate a transfer into a separate insured savings account every payday." },
      { q: "How much should be in an emergency fund?", a: "Three to six months of essential expenses for most people; closer to six to eight if you're the only earner, have variable or freelance pay, support others or work in a field where job searches are slow." },
      { q: "How long does it take to build an emergency fund?", a: "Divide your target by what you can save each month. Saving $500 a month toward an $11,000 target takes about 22 months; windfalls and raises shorten it." },
    ],
  },

  "clear-head": {
    answer:
      "**Job insecurity is the fear of losing your job or the value of your work, and it's rising: in 2026, 32% of US workers worried about losing their job within months, up from 26% a year earlier.** It weighs on you long before anything happens. What helps is turning the vague threat into specific information and one action.",
    start: [
      { slug: "ai-anxiety", why: "What the evidence says about AI and jobs, and a 7-day plan that helps." },
      { slug: "burnout-quiz", why: "Burned out or just tired? Twelve questions on the three signs researchers measure." },
      { slug: "imposter-syndrome-test", why: "A private check on how you see your own success." },
    ],
    sections: [
      {
        h2: "Why job insecurity hits so hard right now",
        body: [
          "**Because the threat is vague, constant and partly about AI.** In the American Psychological Association's [2026 Work in America survey](https://www.apa.org/pubs/reports/work-in-america/2026), 48% of workers worried AI could make some or all of their job duties obsolete, and 64% felt technological change benefits employers more than workers.",
        ],
      },
      {
        h2: "How to cope with job insecurity",
        body: ["**Swap the unknown for numbers and the waiting for action.**"],
        bullets: [
          "Check which of your tasks AI can really do with a task-level risk check.",
          "Work out your savings runway, so the worst case has a number.",
          "Rebuild contact with five people in your field this month.",
          "Start one skill or side project you control.",
          "Limit job and AI news to a short, fixed window each day.",
        ],
      },
      {
        h2: "When worry needs more than a guide",
        body: [
          "**If anxiety is constant or affects your sleep, work or relationships, talk to a professional.** The World Health Organization calls anxiety disorders the [world's most common mental disorders](https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders), and effective treatments exist. In a crisis in the US, call or text [988](https://988lifeline.org/).",
        ],
      },
    ],
    faq: [
      { q: "What is job insecurity?", a: "Job insecurity is the worry that you could lose your job, or that it could change for the worse, such as lower pay, fewer hours or less meaningful work. It's a perceived threat, so it can be stressful even when nothing has happened yet." },
      { q: "How do I deal with job insecurity?", a: "Turn the vague fear into specifics: check how exposed your tasks really are, calculate your savings runway, strengthen your network and start one skill or project you control. Limit news to a short daily window." },
      { q: "Is it normal to worry about losing my job to AI?", a: "Yes. In 2026, 48% of US workers said they worried AI could make some or all of their job duties obsolete. The evidence so far shows tasks changing faster than whole jobs disappearing." },
    ],
  },
};
