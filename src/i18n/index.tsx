import { createContext, useContext, useLayoutEffect, useState } from 'react';

export type Lang = 'en' | 'ar';

const STORAGE_KEY = 'articode-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext);
  return { lang, setLang, t: ui[lang] };
}

const en = {
  nav: {
    home: 'Home',
    expertise: 'Expertise',
    projects: 'Projects',
    about: 'About Us',
    contact: 'Contact',
    startProject: 'Start a project',
    toggleMenu: 'Toggle menu',
    switchLang: 'العربية',
  },
  hero: {
    badge: 'Now accepting projects for Q3 2026',
    line1: 'We engineer',
    line2: 'software & intelligence',
    line3: 'that compounds.',
    description:
      'ArtiCode is a technology studio building software systems, mobile apps, AI, and cybersecurity solutions for companies that take production seriously.',
    exploreExpertise: 'Explore expertise',
  },
  home: {
    servicesEyebrow: 'What we do',
    servicesTitle: 'Nine disciplines, one accountable team.',
    allExpertise: 'All expertise',
    projectsEyebrow: 'Selected work',
    projectsTitle: 'Projects that earned their numbers.',
    projectsDescription:
      'Real products for real clients — every project below is live in production, with results we can stand behind.',
    allProjects: 'All projects',
    visitSite: 'Visit live site',
    processEyebrow: 'How we work',
    processTitle: 'A process that respects production.',
    processDescription:
      'From discovery to scale: five stations every project passes through — combining rigorous engineering with production-grade discipline.',
    processStation: 'Station',
    strengthsEyebrow: 'Why teams pick us',
    strengthsTitle: 'Built for companies that ship to production.',
    strengthsDescription:
      'Anyone can build a demo. We are engineered for everything that comes after it — the launch night, the traffic spike, the security audit, the second year of maintenance.',
    strengthsCompareEyebrow: 'The difference',
    strengthsCompareTitle: 'What changes when ArtiCode is the team.',
    strengthsTypical: 'Typical vendor',
    strengthsUs: 'With ArtiCode',
    strengthsCtaTitle: 'Still comparing options?',
    strengthsCtaDescription:
      'Send us the brief. We reply within one business day with an honest read — including when we think we are the wrong fit.',
    strengthsCtaAction: 'Talk to an engineer',
  },
  cta: {
    title: 'Have a system worth building right?',
    description:
      "Tell us what you're building. We'll come back within one business day with a first-read assessment — no sales loop.",
    seeOurWork: 'See our work',
  },
  footer: {
    blurb:
      'A software and technology studio engineering systems, products, and intelligence for companies that build for the long run.',
    navigate: 'Navigate',
    startProject: 'Start a project',
    startBlurb:
      "Tell us what you're building. We'll come back within one business day with a first-read assessment.",
    getInTouch: 'Get in touch',
    copyright: 'ArtiCode. Engineered with intent.',
    available: 'Available for new engagements',
  },
  expertise: {
    eyebrow: 'Expertise',
    titleA: 'Nine disciplines.',
    titleB: 'One accountable team.',
    description:
      'From embedded firmware to LLM agents, ArtiCode covers the full stack of modern technology — without the hand-offs and vendor juggling that break projects.',
    processEyebrow: 'Engagement model',
    processTitle: 'A process that respects production.',
    processDescription:
      'Every engagement moves through the same five phases — calibrated to your timeline and risk profile.',
  },
  projects: {
    eyebrow: 'Projects',
    titleA: 'Selected work,',
    titleB: 'measured by outcomes.',
    description:
      "A selection of platforms we've shipped for communities, non-profits, hospitality brands, and commerce — all live and in production.",
    all: 'All',
    discussSimilar: 'Visit live site',
  },
  about: {
    eyebrow: 'About ArtiCode',
    titleA: 'A studio built for',
    titleB: 'long-running systems.',
    description:
      'ArtiCode is a focused team of senior engineers, designers, and researchers who treat production as the point — not a distant phase.',
    storyTitle: 'We started ArtiCode because shipping software kept getting harder.',
    storyP1:
      "Modern products span mobile, web, cloud, AI, and hardware — and the teams that win are the ones that can hold all of it in one head. Most agencies specialize in one slice and hand the rest off. We didn't want to be that.",
    storyP2:
      'So we built a small, senior-only studio that covers nine disciplines end to end: from embedded firmware to LLM agents, from checkout flows to zero-trust gateways. One team, one contract, one throat to choke.',
    storyP3:
      'We work with companies that take production seriously — fintechs, manufacturers, commerce brands, and security-conscious teams who need a partner that can ship and stand behind it.',
    byTheNumbers: 'By the numbers',
    valuesEyebrow: 'What we stand for',
    valuesTitle: "Principles we don't bend on.",
    valuesDescription: 'The non-negotiables that shape how every ArtiCode engagement runs.',
    teamEyebrow: 'The team',
    teamTitle: "Senior people who've shipped before.",
    teamDescription:
      "Leads across each discipline. Every engagement is staffed by people who've owned production systems.",
    processEyebrow: 'How we engage',
    processTitle: 'Five phases, calibrated to you.',
    processDescription:
      'No two engagements are identical, but every one moves through the same disciplined arc.',
    quote:
      '"Production is the point. A demo that doesn\'t survive contact with real traffic is a sketch, not a system."',
    quoteAttribution: '— The ArtiCode engineering charter',
  },
  contact: {
    eyebrow: 'Contact',
    titleA: 'Tell us what you’re',
    titleB: 'building.',
    description:
      'Share a few details and we’ll come back within one business day with a first-read assessment — no sales loop, no generic pitch deck.',
    fullName: 'Full name',
    namePlaceholder: 'Jordan Avery',
    email: 'Email',
    emailPlaceholder: 'jordan@company.com',
    company: 'Company',
    companyPlaceholder: 'Company name (optional)',
    serviceOfInterest: 'Service of interest',
    selectService: 'Select a service',
    projectDetails: 'Project details',
    detailsPlaceholder:
      'What are you building, what problem does it solve, and what does success look like?',
    sending: 'Sending…',
    sendMessage: 'Send message',
    successTitle: 'Message received.',
    successBody:
      'Thanks for reaching out. We’ll review your project and reply within one business day.',
    sendAnother: 'Send another message',
    errRequired: 'Please fill in your name, email, and project details.',
    errEmail: 'That email address doesn’t look right.',
    errSubmit: 'Something went wrong sending your message. Please try again.',
    directContact: 'Direct contact',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    studioLabel: 'Studio',
    studioValue: 'Remote-first · Global delivery',
    responseLabel: 'Response time',
    responseValue: 'Within 1 business day',
    nextTitle: 'What happens next',
    nextStep1: 'We review your details and reply within one business day.',
    nextStep2: 'A 30-minute scoping call to align on goals, constraints, and timeline.',
    nextStep3: 'You receive a written assessment with a recommended approach — no obligation.',
  },
};

const ar: typeof en = {
  nav: {
    home: 'الرئيسية',
    expertise: 'خبراتنا',
    projects: 'المشاريع',
    about: 'من نحن',
    contact: 'تواصل معنا',
    startProject: 'ابدأ مشروعك',
    toggleMenu: 'فتح القائمة',
    switchLang: 'English',
  },
  hero: {
    badge: 'نستقبل الآن مشاريع الربع الثالث من 2026',
    line1: 'نهندس',
    line2: 'برمجيات وذكاءً اصطناعياً',
    line3: 'يتضاعف أثرها.',
    description:
      'آرتي كود استوديو تقني يبني أنظمة برمجية وتطبيقات جوال وحلول ذكاء اصطناعي وأمن سيبراني للشركات التي تأخذ بيئة الإنتاج على محمل الجد.',
    exploreExpertise: 'استكشف خبراتنا',
  },
  home: {
    servicesEyebrow: 'ماذا نفعل',
    servicesTitle: 'تسعة تخصصات، فريق واحد مسؤول.',
    allExpertise: 'كل الخبرات',
    projectsEyebrow: 'أعمال مختارة',
    projectsTitle: 'مشاريع أثبتت أرقامها بجدارة.',
    projectsDescription:
      'منتجات حقيقية لعملاء حقيقيين — كل مشروع هنا يعمل فعلياً في بيئة الإنتاج، بنتائج نقف خلفها بثقة.',
    allProjects: 'كل المشاريع',
    visitSite: 'زيارة الموقع',
    processEyebrow: 'كيف نعمل',
    processTitle: 'منهجية تحترم بيئة الإنتاج.',
    processDescription:
      'من الاستكشاف إلى التوسع: خمس محطات يمر بها كل مشروع داخل الاستوديو، تجمع بين الهندسة الدقيقة وانضباط بيئة الإنتاج.',
    processStation: 'المحطة',
    strengthsEyebrow: 'لماذا تختارنا الفرق',
    strengthsTitle: 'صُمّمنا للشركات التي تُطلق منتجاتها للإنتاج فعلاً.',
    strengthsDescription:
      'بناء نموذج تجريبي يستطيعه الجميع. نحن مهندسون لما يأتي بعده — ليلة الإطلاق، وذروة الضغط، وتدقيق الأمن، وسنة الصيانة الثانية.',
    strengthsCompareEyebrow: 'الفارق',
    strengthsCompareTitle: 'ما الذي يتغيّر حين تكون آرتي كود هي الفريق.',
    strengthsTypical: 'المورّد التقليدي',
    strengthsUs: 'مع آرتي كود',
    strengthsCtaTitle: 'ما زلت توازن بين الخيارات؟',
    strengthsCtaDescription:
      'أرسل لنا موجز المشروع، ونعود إليك خلال يوم عمل واحد برأي صريح — بما في ذلك إن كنا الخيار غير المناسب لك.',
    strengthsCtaAction: 'تحدث إلى مهندس',
  },
  cta: {
    title: 'لديك نظام يستحق أن يُبنى بإتقان؟',
    description:
      'أخبرنا بما تبنيه، وسنعود إليك خلال يوم عمل واحد بتقييم أولي — دون دوامة مبيعات.',
    seeOurWork: 'شاهد أعمالنا',
  },
  footer: {
    blurb:
      'استوديو برمجيات وتقنية يهندس الأنظمة والمنتجات والذكاء الاصطناعي للشركات التي تبني للمدى الطويل.',
    navigate: 'التنقل',
    startProject: 'ابدأ مشروعك',
    startBlurb: 'أخبرنا بما تبنيه، وسنعود إليك خلال يوم عمل واحد بتقييم أولي.',
    getInTouch: 'تواصل معنا',
    copyright: 'آرتي كود. هُندس بعناية.',
    available: 'متاحون لمشاريع جديدة',
  },
  expertise: {
    eyebrow: 'خبراتنا',
    titleA: 'تسعة تخصصات.',
    titleB: 'فريق واحد مسؤول.',
    description:
      'من البرمجيات المدمجة إلى وكلاء الذكاء الاصطناعي، تغطي آرتي كود كامل منظومة التقنية الحديثة — دون تسليمات متعثرة أو تنقّل بين الموردين يُفشل المشاريع.',
    processEyebrow: 'نموذج العمل',
    processTitle: 'منهجية تحترم بيئة الإنتاج.',
    processDescription:
      'كل مشروع يمر بالمراحل الخمس ذاتها — مضبوطة وفق جدولك الزمني ومستوى المخاطر لديك.',
  },
  projects: {
    eyebrow: 'المشاريع',
    titleA: 'أعمال مختارة،',
    titleB: 'تُقاس بالنتائج.',
    description:
      'مختارات من المنصات التي أطلقناها لمجتمعات ومنظمات غير ربحية وعلامات ضيافة وتجارة إلكترونية — كلها تعمل الآن في بيئة الإنتاج.',
    all: 'الكل',
    discussSimilar: 'زيارة الموقع',
  },
  about: {
    eyebrow: 'عن آرتي كود',
    titleA: 'استوديو بُني من أجل',
    titleB: 'أنظمة تدوم طويلاً.',
    description:
      'آرتي كود فريق مركّز من كبار المهندسين والمصممين والباحثين يعتبرون بيئة الإنتاج هي الهدف — لا مرحلة بعيدة.',
    storyTitle: 'أسسنا آرتي كود لأن إطلاق البرمجيات كان يزداد صعوبة باستمرار.',
    storyP1:
      'المنتجات الحديثة تمتد عبر الجوال والويب والسحابة والذكاء الاصطناعي والعتاد — والفرق التي تنجح هي التي تستوعب كل ذلك في رؤية واحدة. معظم الوكالات تتخصص في جزء واحد وتُسلّم الباقي لغيرها. لم نرغب أن نكون كذلك.',
    storyP2:
      'لذا بنينا استوديو صغيراً من الكبار فقط يغطي تسعة تخصصات من البداية إلى النهاية: من البرمجيات المدمجة إلى وكلاء الذكاء الاصطناعي، ومن مسارات الدفع إلى بوابات انعدام الثقة. فريق واحد، عقد واحد، وجهة مسؤولية واحدة.',
    storyP3:
      'نعمل مع شركات تأخذ بيئة الإنتاج بجدية — شركات التقنية المالية والمصنّعون وعلامات التجارة الإلكترونية والفرق المهتمة بالأمن، ممن يحتاجون شريكاً يُنجز ويقف خلف ما أنجزه.',
    byTheNumbers: 'بالأرقام',
    valuesEyebrow: 'ما نؤمن به',
    valuesTitle: 'مبادئ لا نتنازل عنها.',
    valuesDescription: 'الثوابت التي تحكم طريقة سير كل مشروع في آرتي كود.',
    teamEyebrow: 'الفريق',
    teamTitle: 'خبراء أطلقوا منتجات حقيقية من قبل.',
    teamDescription:
      'قادة في كل تخصص. كل مشروع يعمل عليه أشخاص تولّوا مسؤولية أنظمة إنتاج فعلية.',
    processEyebrow: 'كيف نتعاون',
    processTitle: 'خمس مراحل، مضبوطة على مقاسك.',
    processDescription: 'لا يتطابق مشروعان، لكن كل مشروع يمر بالمسار المنضبط ذاته.',
    quote: '«بيئة الإنتاج هي الهدف. العرض التجريبي الذي لا يصمد أمام الحركة الحقيقية مجرد مسودة، لا نظام.»',
    quoteAttribution: '— ميثاق الهندسة في آرتي كود',
  },
  contact: {
    eyebrow: 'تواصل معنا',
    titleA: 'أخبرنا بما',
    titleB: 'تبنيه.',
    description:
      'شاركنا بعض التفاصيل وسنعود إليك خلال يوم عمل واحد بتقييم أولي — دون دوامة مبيعات أو عروض تقديمية جاهزة.',
    fullName: 'الاسم الكامل',
    namePlaceholder: 'محمد أحمد',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'mohammed@company.com',
    company: 'الشركة',
    companyPlaceholder: 'اسم الشركة (اختياري)',
    serviceOfInterest: 'الخدمة المطلوبة',
    selectService: 'اختر خدمة',
    projectDetails: 'تفاصيل المشروع',
    detailsPlaceholder: 'ما الذي تبنيه، وما المشكلة التي يحلها، وكيف يبدو النجاح بالنسبة لك؟',
    sending: 'جارٍ الإرسال…',
    sendMessage: 'إرسال الرسالة',
    successTitle: 'وصلتنا رسالتك.',
    successBody: 'شكراً لتواصلك. سنراجع مشروعك ونرد عليك خلال يوم عمل واحد.',
    sendAnother: 'إرسال رسالة أخرى',
    errRequired: 'يرجى تعبئة الاسم والبريد الإلكتروني وتفاصيل المشروع.',
    errEmail: 'عنوان البريد الإلكتروني لا يبدو صحيحاً.',
    errSubmit: 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.',
    directContact: 'تواصل مباشر',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'الهاتف',
    studioLabel: 'الاستوديو',
    studioValue: 'عمل عن بُعد · تسليم عالمي',
    responseLabel: 'زمن الاستجابة',
    responseValue: 'خلال يوم عمل واحد',
    nextTitle: 'ماذا يحدث بعد ذلك',
    nextStep1: 'نراجع تفاصيلك ونرد خلال يوم عمل واحد.',
    nextStep2: 'مكالمة تحديد نطاق لمدة 30 دقيقة للاتفاق على الأهداف والقيود والجدول الزمني.',
    nextStep3: 'تستلم تقييماً مكتوباً مع النهج الموصى به — دون أي التزام.',
  },
};

export const ui: Record<Lang, typeof en> = { en, ar };
