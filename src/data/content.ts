import {
  Cpu,
  Smartphone,
  Globe,
  Radio,
  Search,
  Brain,
  Workflow,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import type { Lang } from '@/i18n';
import { publicAsset } from '@/lib/publicAsset';

type L = { en: string; ar: string };

export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

const servicesData: {
  id: string;
  title: L;
  tagline: L;
  description: L;
  icon: LucideIcon;
  features: L[];
}[] = [
  {
    id: 'software',
    title: { en: 'Software Systems', ar: 'الأنظمة البرمجية' },
    tagline: { en: 'Architectures that scale', ar: 'بنى تتوسع مع نموك' },
    description: {
      en: 'Distributed backends, microservices, and mission-critical platforms engineered for reliability and scale.',
      ar: 'أنظمة خلفية موزعة وخدمات مصغّرة ومنصات حرجة مهندسة للموثوقية والتوسع.',
    },
    icon: Cpu,
    features: [
      { en: 'Microservices & APIs', ar: 'خدمات مصغّرة وواجهات API' },
      { en: 'Distributed systems', ar: 'أنظمة موزعة' },
      { en: 'Real-time data pipelines', ar: 'خطوط بيانات لحظية' },
      { en: 'Cloud-native infra', ar: 'بنية سحابية أصيلة' },
    ],
  },
  {
    id: 'mobile',
    title: { en: 'Mobile Apps', ar: 'تطبيقات الجوال' },
    tagline: { en: 'Native-feeling, cross-platform', ar: 'إحساس أصلي، متعددة المنصات' },
    description: {
      en: 'Polished iOS and Android experiences with offline-first design and buttery 60fps interactions.',
      ar: 'تجارب متقنة على iOS وأندرويد بتصميم يعمل دون اتصال وتفاعلات سلسة بمعدل 60 إطاراً في الثانية.',
    },
    icon: Smartphone,
    features: [
      { en: 'iOS & Android', ar: 'iOS وأندرويد' },
      { en: 'Offline-first sync', ar: 'مزامنة دون اتصال' },
      { en: 'Push & notifications', ar: 'إشعارات فورية' },
      { en: 'App Store delivery', ar: 'نشر على المتاجر' },
    ],
  },
  {
    id: 'web',
    title: { en: 'Web Development', ar: 'تطوير الويب' },
    tagline: { en: 'Fast, beautiful, accessible', ar: 'سريع، جميل، سهل الوصول' },
    description: {
      en: 'Marketing sites, dashboards, and full-stack web apps with sub-second loads and pixel-perfect UI.',
      ar: 'مواقع تسويقية ولوحات تحكم وتطبيقات ويب متكاملة بتحميل أقل من ثانية وواجهات متقنة حتى البكسل.',
    },
    icon: Globe,
    features: [
      { en: 'SPA & SSR', ar: 'تطبيقات SPA وSSR' },
      { en: 'Design systems', ar: 'أنظمة تصميم' },
      { en: 'Performance budgets', ar: 'ميزانيات أداء' },
      { en: 'Accessibility (a11y)', ar: 'إمكانية الوصول' },
    ],
  },
  {
    id: 'iot',
    title: { en: 'IoT', ar: 'إنترنت الأشياء' },
    tagline: { en: 'Connected hardware & firmware', ar: 'عتاد وبرمجيات مدمجة متصلة' },
    description: {
      en: 'Embedded firmware, edge gateways, and device clouds that turn sensor data into decisions.',
      ar: 'برمجيات مدمجة وبوابات طرفية وسحابات أجهزة تحوّل بيانات المستشعرات إلى قرارات.',
    },
    icon: Radio,
    features: [
      { en: 'Embedded firmware', ar: 'برمجيات مدمجة' },
      { en: 'Edge & gateway', ar: 'حوسبة طرفية وبوابات' },
      { en: 'Device telemetry', ar: 'قياس عن بُعد للأجهزة' },
      { en: 'OTA updates', ar: 'تحديثات عبر الأثير' },
    ],
  },
  {
    id: 'seo',
    title: { en: 'SEO', ar: 'تحسين محركات البحث' },
    tagline: { en: 'Rank, measure, repeat', ar: 'تصدّر، قِس، كرّر' },
    description: {
      en: 'Technical SEO, structured data, and content strategy that compounds organic traffic over time.',
      ar: 'تحسين تقني وبيانات منظمة واستراتيجية محتوى تضاعف الزيارات المجانية مع الوقت.',
    },
    icon: Search,
    features: [
      { en: 'Technical audits', ar: 'تدقيقات تقنية' },
      { en: 'Core Web Vitals', ar: 'مؤشرات الويب الأساسية' },
      { en: 'Structured data', ar: 'بيانات منظمة' },
      { en: 'Content strategy', ar: 'استراتيجية محتوى' },
    ],
  },
  {
    id: 'ai',
    title: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
    tagline: { en: 'Models that earn their keep', ar: 'نماذج تستحق تكلفتها' },
    description: {
      en: 'LLM integrations, computer vision, and predictive models deployed behind your products.',
      ar: 'تكاملات نماذج لغوية ورؤية حاسوبية ونماذج تنبؤية تعمل خلف منتجاتك.',
    },
    icon: Brain,
    features: [
      { en: 'LLM integrations', ar: 'تكاملات النماذج اللغوية' },
      { en: 'Computer vision', ar: 'رؤية حاسوبية' },
      { en: 'Predictive models', ar: 'نماذج تنبؤية' },
      { en: 'RAG & agents', ar: 'RAG ووكلاء ذكيون' },
    ],
  },
  {
    id: 'automation',
    title: { en: 'Automation', ar: 'الأتمتة' },
    tagline: { en: 'Remove the repetitive', ar: 'تخلّص من المتكرر' },
    description: {
      en: 'Workflow engines, integrations, and internal tooling that remove manual work from your operations.',
      ar: 'محركات سير عمل وتكاملات وأدوات داخلية تزيل العمل اليدوي من عملياتك.',
    },
    icon: Workflow,
    features: [
      { en: 'Workflow engines', ar: 'محركات سير العمل' },
      { en: 'API integrations', ar: 'تكاملات API' },
      { en: 'Internal tooling', ar: 'أدوات داخلية' },
      { en: 'Process mining', ar: 'تنقيب العمليات' },
    ],
  },
  {
    id: 'cybersecurity',
    title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
    tagline: { en: 'Secure by construction', ar: 'آمن بالتصميم' },
    description: {
      en: 'Threat modeling, penetration testing, and zero-trust architecture woven through every layer.',
      ar: 'نمذجة تهديدات واختبار اختراق وبنية انعدام الثقة منسوجة في كل طبقة.',
    },
    icon: ShieldCheck,
    features: [
      { en: 'Threat modeling', ar: 'نمذجة التهديدات' },
      { en: 'Pen testing', ar: 'اختبار الاختراق' },
      { en: 'Zero-trust design', ar: 'تصميم انعدام الثقة' },
      { en: 'Compliance & audit', ar: 'امتثال وتدقيق' },
    ],
  },
  {
    id: 'ecommerce',
    title: { en: 'E-commerce', ar: 'التجارة الإلكترونية' },
    tagline: { en: 'Stores that convert', ar: 'متاجر تحوّل الزوار عملاء' },
    description: {
      en: 'Headless storefronts, checkout optimization, and inventory systems built for conversion and scale.',
      ar: 'واجهات متاجر مرنة وتحسين لمسار الدفع وأنظمة مخزون مبنية للتحويل والتوسع.',
    },
    icon: ShoppingBag,
    features: [
      { en: 'Headless storefronts', ar: 'واجهات متاجر مرنة' },
      { en: 'Checkout optimization', ar: 'تحسين مسار الدفع' },
      { en: 'Inventory & ERP', ar: 'مخزون وأنظمة ERP' },
      { en: 'Subscriptions', ar: 'اشتراكات' },
    ],
  },
];

export function getServices(lang: Lang): Service[] {
  return servicesData.map((s) => ({
    id: s.id,
    title: s.title[lang],
    tagline: s.tagline[lang],
    description: s.description[lang],
    icon: s.icon,
    features: s.features.map((f) => f[lang]),
  }));
}

export type Project = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  tags: string[];
  image: string;
  /** Deep brand hue of the client, used to tint the project card. */
  tint: string;
  link: string;
  metric: { value: string; label: string };
  year: string;
  duration: string;
  stack: string[];
  results: { value: string; label: string }[];
};

const projectsData: {
  id: string;
  name: L;
  category: L;
  blurb: L;
  tags: L[];
  image: string;
  tint: string;
  link: string;
  metric: { value: L; label: L };
  year: string;
  duration: L;
  stack: string[];
  results: { value: string; label: L }[];
}[] = [
  {
    id: 'yca',
    name: { en: 'YCA Birmingham', ar: 'الجالية اليمنية في برمنغهام' },
    category: { en: 'Web Development', ar: 'تطوير الويب' },
    blurb: {
      en: 'The official platform of the Yemeni Community Association in Birmingham — programmes, events, and legal support services for the community.',
      ar: 'المنصة الرسمية لجمعية الجالية اليمنية في برمنغهام — برامج وفعاليات وخدمات دعم قانوني لأبناء الجالية.',
    },
    tags: [
      { en: 'Community platform', ar: 'منصة مجتمعية' },
      { en: 'Programmes & events', ar: 'برامج وفعاليات' },
      { en: 'Legal services', ar: 'خدمات قانونية' },
      { en: 'Non-profit', ar: 'غير ربحي' },
    ],
    image: publicAsset('projects/yca-birmingham.jpg'),
    tint: '#4a3520',
    link: 'https://yca-birmingham.org.uk',
    metric: { value: { en: 'UK', ar: 'بريطانيا' }, label: { en: 'Birmingham', ar: 'برمنغهام' } },
    year: '2024',
    duration: { en: '10 weeks', ar: '10 أسابيع' },
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'],
    results: [
      { value: '3x', label: { en: 'More event signups', ar: 'تضاعف التسجيل في الفعاليات' } },
      { value: '1.1s', label: { en: 'Median page load', ar: 'متوسط زمن التحميل' } },
      { value: '40+', label: { en: 'Programmes published', ar: 'برنامجاً منشوراً' } },
    ],
  },
  {
    id: 'owis',
    name: { en: 'Owis Al-Qarni Waqf', ar: 'وقف أويس القرني' },
    category: { en: 'Web Development', ar: 'تطوير الويب' },
    blurb: {
      en: "The digital home of an endowment foundation building sustainable investment vehicles and partner programmes that serve Yemen's development.",
      ar: 'الواجهة الرقمية لمؤسسة وقفية تبني أوعية استثمارية مستدامة وبرامج شراكة تخدم نهوض اليمن.',
    },
    tags: [
      { en: 'Waqf & endowment', ar: 'وقف واستثمار خيري' },
      { en: 'Sustainable programmes', ar: 'برامج مستدامة' },
      { en: 'Arabic RTL', ar: 'عربي RTL' },
      { en: 'Non-profit', ar: 'غير ربحي' },
    ],
    image: publicAsset('projects/owis-qarni.jpg'),
    tint: '#4a1220',
    link: 'https://owis-ten.vercel.app',
    metric: {
      value: { en: 'AR', ar: 'عربي' },
      label: { en: 'Arabic-first platform', ar: 'منصة عربية بالكامل' },
    },
    year: '2025',
    duration: { en: '8 weeks', ar: '8 أسابيع' },
    stack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
    results: [
      { value: '3', label: { en: 'Languages served', ar: 'لغات مدعومة' } },
      { value: '4', label: { en: 'Programme tracks', ar: 'مسارات برامج' } },
      { value: '95+', label: { en: 'Lighthouse score', ar: 'درجة Lighthouse' } },
    ],
  },
  {
    id: 'niola',
    name: { en: 'Niola Lounge', ar: 'نيولا لاونج' },
    category: { en: 'Web Development', ar: 'تطوير الويب' },
    blurb: {
      en: 'The online presence of a Nile-view lounge in Zamalek, Cairo — coffee, shisha, and an atmosphere worth the visit.',
      ar: 'الحضور الرقمي لصالة بإطلالة على النيل في الزمالك بالقاهرة — قهوة وشيشة وأجواء تستحق الزيارة.',
    },
    tags: [
      { en: 'Hospitality', ar: 'ضيافة' },
      { en: 'Café & lounge', ar: 'مقهى ولاونج' },
      { en: 'Menu experience', ar: 'تجربة قائمة طعام' },
      { en: 'Cairo', ar: 'القاهرة' },
    ],
    image: publicAsset('projects/niola-lounge.jpg'),
    tint: '#3d2c11',
    link: 'https://niola-lounge.vercel.app',
    metric: {
      value: { en: 'Nile', ar: 'النيل' },
      label: { en: 'Zamalek, Cairo', ar: 'الزمالك، القاهرة' },
    },
    year: '2024',
    duration: { en: '5 weeks', ar: '5 أسابيع' },
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    results: [
      { value: '60+', label: { en: 'Menu items online', ar: 'صنفاً في القائمة الرقمية' } },
      { value: '2x', label: { en: 'Reservation enquiries', ar: 'تضاعف طلبات الحجز' } },
      { value: '0.9s', label: { en: 'Median page load', ar: 'متوسط زمن التحميل' } },
    ],
  },
  {
    id: 'laqmah',
    name: { en: 'LQMAH Cafe & Bakery', ar: 'لقمة — مقهى ومخبز' },
    category: { en: 'Web Development', ar: 'تطوير الويب' },
    blurb: {
      en: 'A bilingual site for a specialty coffee cafe and bakery in Melvindale, Michigan — menu, atmosphere, and community in two languages.',
      ar: 'موقع ثنائي اللغة لمقهى قهوة مختصة ومخبز في ميلفينديل بولاية ميشيغان — القائمة والأجواء والمجتمع بلغتين.',
    },
    tags: [
      { en: 'Café & bakery', ar: 'مقهى ومخبز' },
      { en: 'Specialty coffee', ar: 'قهوة مختصة' },
      { en: 'Bilingual EN·AR', ar: 'ثنائي اللغة EN·AR' },
      { en: 'Michigan, USA', ar: 'ميشيغان، أمريكا' },
    ],
    image: publicAsset('projects/laqmah-cafe.jpg'),
    tint: '#3d1520',
    link: 'https://laqmah.vercel.app',
    metric: {
      value: { en: 'EN·AR', ar: 'EN·AR' },
      label: { en: 'Bilingual experience', ar: 'تجربة بلغتين' },
    },
    year: '2025',
    duration: { en: '6 weeks', ar: '6 أسابيع' },
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'i18n RTL', 'Vercel'],
    results: [
      { value: '2', label: { en: 'Full languages', ar: 'لغتان كاملتان' } },
      { value: '45+', label: { en: 'Products showcased', ar: 'منتجاً معروضاً' } },
      { value: '98', label: { en: 'Accessibility score', ar: 'درجة إمكانية الوصول' } },
    ],
  },
  {
    id: 'beckah',
    name: { en: 'Beckah Exchange', ar: 'بيكاه إكستشينج' },
    category: { en: 'E-commerce', ar: 'التجارة الإلكترونية' },
    blurb: {
      en: "A community marketplace for pre-owned and donated items with live auctions — every purchase supports the Beckah Foundation's mission.",
      ar: 'سوق مجتمعي للمقتنيات المستعملة والمتبرَّع بها مع مزادات مباشرة — كل عملية شراء تدعم رسالة مؤسسة بيكاه.',
    },
    tags: [
      { en: 'Marketplace', ar: 'سوق إلكتروني' },
      { en: 'Live auctions', ar: 'مزادات مباشرة' },
      { en: 'Donations', ar: 'تبرعات' },
      { en: 'Non-profit commerce', ar: 'تجارة خيرية' },
    ],
    image: publicAsset('projects/beckah-exchange.jpg'),
    tint: '#123a2a',
    link: 'https://beckahex.org',
    metric: {
      value: { en: 'Live', ar: 'مباشر' },
      label: { en: 'Auctions & marketplace', ar: 'مزادات وسوق' },
    },
    year: '2025',
    duration: { en: '14 weeks', ar: '14 أسبوعاً' },
    stack: ['React', 'TypeScript', 'Supabase', 'Realtime WS', 'Stripe', 'Vercel'],
    results: [
      { value: '500+', label: { en: 'Listings at launch', ar: 'قطعة معروضة عند الإطلاق' } },
      { value: 'Live', label: { en: 'Realtime bidding', ar: 'مزايدة لحظية' } },
      { value: '100%', label: { en: 'Proceeds to mission', ar: 'من العوائد للرسالة' } },
    ],
  },
];

export function getProjects(lang: Lang): Project[] {
  return projectsData.map((p) => ({
    id: p.id,
    name: p.name[lang],
    category: p.category[lang],
    blurb: p.blurb[lang],
    tags: p.tags.map((tag) => tag[lang]),
    image: p.image,
    tint: p.tint,
    link: p.link,
    metric: { value: p.metric.value[lang], label: p.metric.label[lang] },
    year: p.year,
    duration: p.duration[lang],
    stack: p.stack,
    results: p.results.map((r) => ({ value: r.value, label: r.label[lang] })),
  }));
}

export type Strength = {
  title: string;
  description: string;
  stat: string;
  statLabel: string;
};

const strengthsData: { title: L; description: L; stat: string; statLabel: L }[] = [
  {
    title: { en: 'Senior-only teams', ar: 'فرق من الكبار فقط' },
    description: {
      en: 'Every engineer has shipped production systems for years. No hand-offs to juniors mid-project.',
      ar: 'كل مهندس لدينا أطلق أنظمة إنتاج لسنوات. لا تسليم للمبتدئين في منتصف المشروع.',
    },
    stat: '8+',
    statLabel: { en: 'Avg. years experience', ar: 'متوسط سنوات الخبرة' },
  },
  {
    title: { en: 'Design-engineering unity', ar: 'وحدة التصميم والهندسة' },
    description: {
      en: 'Designers and engineers share one Figma file and one codebase. Pixel-perfect is the default, not a phase.',
      ar: 'المصممون والمهندسون يتشاركون ملف Figma واحداً وقاعدة شيفرة واحدة. الإتقان حتى البكسل هو الأصل، لا مرحلة.',
    },
    stat: '100%',
    statLabel: { en: 'Design fidelity', ar: 'مطابقة التصميم' },
  },
  {
    title: { en: 'Production hardening', ar: 'تحصين بيئة الإنتاج' },
    description: {
      en: 'Observability, load testing, and incident runbooks are part of delivery — not an afterthought.',
      ar: 'المراقبة واختبارات الحمل وأدلة التعامل مع الحوادث جزء من التسليم — لا فكرة لاحقة.',
    },
    stat: '99.98%',
    statLabel: { en: 'Avg. uptime shipped', ar: 'متوسط زمن التشغيل' },
  },
  {
    title: { en: 'Security by default', ar: 'الأمان افتراضياً' },
    description: {
      en: 'Threat models and dependency scanning start in week one. We assume adversaries, not good intentions.',
      ar: 'نمذجة التهديدات وفحص الاعتماديات تبدأ من الأسبوع الأول. نفترض وجود خصوم، لا حسن النوايا.',
    },
    stat: 'SOC2',
    statLabel: { en: 'Aligned controls', ar: 'ضوابط متوافقة' },
  },
  {
    title: { en: 'Working software every fortnight', ar: 'برنامج يعمل كل أسبوعين' },
    description: {
      en: 'Every two weeks you get a running build on staging — not a slide deck. Scope changes are priced before they land.',
      ar: 'كل أسبوعين تحصل على نسخة تعمل على بيئة الاختبار — لا عرضاً تقديمياً. وأي تغيير في النطاق يُسعّر قبل تنفيذه.',
    },
    stat: '14d',
    statLabel: { en: 'Demo cadence', ar: 'وتيرة التسليم' },
  },
  {
    title: { en: 'The code stays yours', ar: 'الشيفرة تبقى ملكك' },
    description: {
      en: 'Repos, pipelines, infrastructure-as-code, and documentation are handed over from day one. No lock-in, no black boxes.',
      ar: 'المستودعات وخطوط النشر والبنية ككود والتوثيق تُسلّم لك من اليوم الأول. لا احتكار ولا صناديق مغلقة.',
    },
    stat: '100%',
    statLabel: { en: 'IP handover', ar: 'ملكية فكرية مُسلّمة' },
  },
];

export function getStrengths(lang: Lang): Strength[] {
  return strengthsData.map((s) => ({
    title: s.title[lang],
    description: s.description[lang],
    stat: s.stat,
    statLabel: s.statLabel[lang],
  }));
}

export type Comparison = { typical: string; ours: string };

const comparisonData: { typical: L; ours: L }[] = [
  {
    typical: { en: 'Sold by a senior, built by a junior', ar: 'يبيعه خبير، وينفّذه مبتدئ' },
    ours: { en: 'The engineers who scoped it are the ones who write it', ar: 'المهندسون الذين حدّدوا النطاق هم من يكتبون الشيفرة' },
  },
  {
    typical: { en: 'Four vendors for mobile, web, cloud, and security', ar: 'أربعة موردين للجوال والويب والسحابة والأمن' },
    ours: { en: 'Nine disciplines under one contract and one roadmap', ar: 'تسعة تخصصات بعقد واحد وخارطة طريق واحدة' },
  },
  {
    typical: { en: 'Handover is a zip file and a phone number', ar: 'التسليم ملف مضغوط ورقم هاتف' },
    ours: { en: 'Runbooks, dashboards, and a monitored launch window', ar: 'أدلة تشغيل ولوحات مراقبة ونافذة إطلاق تحت المتابعة' },
  },
  {
    typical: { en: 'Security reviewed after the launch date is set', ar: 'مراجعة الأمن بعد تحديد موعد الإطلاق' },
    ours: { en: 'Threat modelling and dependency scanning from week one', ar: 'نمذجة التهديدات وفحص الاعتماديات من الأسبوع الأول' },
  },
];

export function getComparisons(lang: Lang): Comparison[] {
  return comparisonData.map((c) => ({ typical: c.typical[lang], ours: c.ours[lang] }));
}

const statsData: { value: string; label: L }[] = [
  { value: '120+', label: { en: 'Systems shipped', ar: 'نظام تم إطلاقه' } },
  { value: '9', label: { en: 'Disciplines', ar: 'تخصصات' } },
  { value: '14', label: { en: 'Countries served', ar: 'دولة نخدمها' } },
  { value: '99.98%', label: { en: 'Avg. uptime', ar: 'متوسط زمن التشغيل' } },
  { value: '7', label: { en: 'Years in business', ar: 'سنوات من العمل' } },
  { value: '38', label: { en: 'Active clients', ar: 'عميلاً نشطاً' } },
  { value: '<24h', label: { en: 'First response time', ar: 'زمن أول استجابة' } },
  { value: '92%', label: { en: 'Clients who return', ar: 'عملاء يعودون مجدداً' } },
];

export function getStats(lang: Lang): { value: string; label: string }[] {
  return statsData.map((s) => ({ value: s.value, label: s.label[lang] }));
}

const processStepsData: { title: L; description: L }[] = [
  {
    title: { en: 'Discover', ar: 'الاستكشاف' },
    description: {
      en: 'We map your constraints, users, and success metrics before a single line of code is written.',
      ar: 'نرسم خريطة قيودك ومستخدميك ومقاييس نجاحك قبل كتابة سطر شيفرة واحد.',
    },
  },
  {
    title: { en: 'Architect', ar: 'التصميم المعماري' },
    description: {
      en: 'We design the system — data models, services, and boundaries — and pressure-test it against scale.',
      ar: 'نصمم النظام — نماذج البيانات والخدمات والحدود — ونختبره تحت ضغط التوسع.',
    },
  },
  {
    title: { en: 'Build', ar: 'البناء' },
    description: {
      en: 'Weekly demos, trunk-based development, and continuous deployment keep you in control throughout.',
      ar: 'عروض أسبوعية وتطوير على الفرع الرئيسي ونشر مستمر تُبقيك متحكماً طوال الوقت.',
    },
  },
  {
    title: { en: 'Harden', ar: 'التحصين' },
    description: {
      en: 'Load tests, security reviews, and observability dashboards make production a destination, not a gamble.',
      ar: 'اختبارات الحمل والمراجعات الأمنية ولوحات المراقبة تجعل الإنتاج وجهة، لا مقامرة.',
    },
  },
  {
    title: { en: 'Scale', ar: 'التوسع' },
    description: {
      en: 'We instrument, tune, and extend the system as your traffic and ambitions grow beyond launch.',
      ar: 'نقيس ونضبط ونوسّع النظام مع نمو حركتك وطموحاتك بعد الإطلاق.',
    },
  },
];

export function getProcessSteps(lang: Lang): { title: string; description: string }[] {
  return processStepsData.map((s) => ({ title: s.title[lang], description: s.description[lang] }));
}

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  image?: string;
};

const teamData: { name: L; role: L; initials: string; image?: string }[] = [
  {
    name: { en: 'Jalal Al-Omari', ar: 'جلال العمري' },
    role: { en: 'Company President', ar: 'رئيس الشركة' },
    initials: 'JA',
    image: publicAsset('team/jalal-alomari.jpg'),
  },
  {
    name: { en: 'Mohammed Al-Dhaheri', ar: 'محمد الظاهري' },
    role: { en: 'Chief Executive Officer', ar: 'المدير التنفيذي' },
    initials: 'MA',
    image: publicAsset('team/mohammed-al-dhaheri.jpg'),
  },
  {
    name: { en: 'Emad Al-Shabati', ar: 'عماد الشباطي' },
    role: { en: 'Relations Officer', ar: 'مسؤول العلاقات' },
    initials: 'EA',
    image: publicAsset('team/emad-al-shabati.jpg'),
  },
  {
    name: { en: 'Laila Qasim', ar: 'ليلى قاسم' },
    role: { en: 'Projects Director', ar: 'مديرة المشاريع' },
    initials: 'LQ',
  },
];

export function getTeam(lang: Lang): TeamMember[] {
  return teamData.map((m) => ({
    name: m.name[lang],
    role: m.role[lang],
    initials: m.initials,
    image: m.image,
  }));
}

export const clientLogos = [
  'YCA Birmingham',
  'Owis Al-Qarni Waqf',
  'Niola Lounge',
  'LQMAH',
  'Beckah Exchange',
];
