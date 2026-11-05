import productData from '../data/products.json';

export const langs = ['pl', 'en', 'de'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'pl';

export type Category = 'sailing' | 'motor' | 'catamaran' | 'laminates';
export const categories: Category[] = ['sailing', 'motor', 'catamaran', 'laminates'];

export interface Product {
  slug: string;
  category: Category;
  featured: string;
  gallery: string[];
  i18n: Partial<Record<Lang, { title: string; description: string[] }>>;
}
export const products = productData as Product[];

export type PageKey = 'home' | 'about' | 'products' | 'partners' | 'contact' | 'subsidies';

/** URL segment of each page per language; null means the page does not exist in that language. */
export const routes: Record<Lang, Record<PageKey, string | null>> = {
  pl: { home: '', about: 'o-nas', products: 'produkty', partners: 'partnerzy', contact: 'kontakt', subsidies: 'dotacje-ue' },
  en: { home: '', about: 'about-us', products: 'products', partners: 'partners', contact: 'contact', subsidies: null },
  de: { home: '', about: 'uber-uns', products: 'produkte', partners: 'partner', contact: 'kontakt', subsidies: null },
};

const prefix = (lang: Lang) => (lang === defaultLang ? '' : `/${lang}`);

/** Deployment base path (e.g. "/yacht-service" on GitHub Pages, "" on a custom domain). */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Route of a page relative to the site root, as Astro expects it in getStaticPaths. */
export function pageRoute(lang: Lang, page: PageKey): string {
  const segment = routes[lang][page];
  return segment ? `${prefix(lang)}/${segment}/` : `${prefix(lang)}/`;
}

export function productRoute(lang: Lang, slug: string): string {
  return `${prefix(lang)}/${routes[lang].products}/${slug}/`;
}

/** Public URL paths include the deployment base. */
export const pagePath = (lang: Lang, page: PageKey) => base + pageRoute(lang, page);
export const productPath = (lang: Lang, slug: string) => base + productRoute(lang, slug);

export function categoryPath(lang: Lang, category: Category): string {
  return `${pagePath(lang, 'products')}#${category}`;
}

export const ui = {
  pl: {
    nav: { about: 'O nas', products: 'Produkty', partners: 'Partnerzy', contact: 'Kontakt', subsidies: 'Dotacje UE' },
    skip: 'Przejdź do treści',
    menu: 'Menu',
    language: 'Język',
    categories: { sailing: 'Jachty żaglowe', motor: 'Jachty motorowe', catamaran: 'Katamarany', laminates: 'Laminaty przemysłowe' },
    categoryBlurb: {
      sailing: 'Od zwinnych jolek po pełnowymiarowe daysailery – żegluj z klasą.',
      motor: 'Sportowy charakter i ponadczasowa linia na jeziora i rzeki.',
      catamaran: 'Wysokie osiągi dwukadłubowca zaprojektowanego z myślą o prędkości.',
      laminates: 'Elementy przemysłowe z laminatów w technologii One-Off.',
    },
    allProducts: 'Wszystkie produkty',
    ourProducts: 'Nasze produkty',
    partnersTitle: 'Współpracujemy z',
    partnersIntro: 'Budujemy jednostki wspólnie z uznanymi markami z całej Europy.',
    visit: 'Odwiedź stronę',
    contactTitle: 'Porozmawiajmy o Twojej łodzi',
    contactCta: 'Napisz do nas',
    phone: 'Telefon',
    email: 'E-mail',
    address: 'Siedziba',
    hours: 'Godziny pracy',
    hoursValue: 'pn–pt 7:00–15:00',
    contactIntro: 'Masz pytania o nasze produkty? Zadzwoń lub napisz – odpowiemy najszybciej, jak to możliwe.',
    gallery: 'Galeria',
    back: 'Wszystkie produkty',
    prev: 'Poprzednia',
    next: 'Następna',
    close: 'Zamknij',
    footerTagline: 'Producent jachtów od 1992 roku',
    notFound: 'Nie znaleziono strony',
    notFoundText: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    backHome: 'Wróć na stronę główną',
  },
  en: {
    nav: { about: 'About us', products: 'Products', partners: 'Partners', contact: 'Contact', subsidies: 'EU funding' },
    skip: 'Skip to content',
    menu: 'Menu',
    language: 'Language',
    categories: { sailing: 'Sailing yachts', motor: 'Motor yachts', catamaran: 'Catamarans', laminates: 'Industrial laminates' },
    categoryBlurb: {
      sailing: 'From nimble keelboats to full-size daysailers – sail in style.',
      motor: 'Sporty character and a timeless line for lakes and rivers.',
      catamaran: 'The performance of a twin-hull designed with speed in mind.',
      laminates: 'Industrial GRP components made with One-Off technology.',
    },
    allProducts: 'All products',
    ourProducts: 'Our products',
    partnersTitle: 'We work with',
    partnersIntro: 'We build boats together with renowned brands from across Europe.',
    visit: 'Visit website',
    contactTitle: 'Let’s talk about your boat',
    contactCta: 'Write to us',
    phone: 'Phone',
    email: 'E-mail',
    address: 'Location',
    hours: 'Opening hours',
    hoursValue: 'Mon–Fri 7:00–15:00',
    contactIntro: 'Questions about our products? Call or write – we will get back to you as soon as possible.',
    gallery: 'Gallery',
    back: 'All products',
    prev: 'Previous',
    next: 'Next',
    close: 'Close',
    footerTagline: 'Yacht manufacturer since 1992',
    notFound: 'Page not found',
    notFoundText: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home page',
  },
  de: {
    nav: { about: 'Über uns', products: 'Produkte', partners: 'Partner', contact: 'Kontakt', subsidies: 'EU-Förderung' },
    skip: 'Zum Inhalt springen',
    menu: 'Menü',
    language: 'Sprache',
    categories: { sailing: 'Segelyachten', motor: 'Motoryachten', catamaran: 'Katamarane', laminates: 'Industrielaminate' },
    categoryBlurb: {
      sailing: 'Vom wendigen Kielboot bis zum vollwertigen Daysailer – mit Stil segeln.',
      motor: 'Sportlicher Charakter und zeitlose Linie für Seen und Flüsse.',
      catamaran: 'Die Leistung eines Zweirumpfers, entworfen für Geschwindigkeit.',
      laminates: 'Industrielle GFK-Bauteile im One-Off-Verfahren.',
    },
    allProducts: 'Alle Produkte',
    ourProducts: 'Unsere Produkte',
    partnersTitle: 'Wir arbeiten zusammen mit',
    partnersIntro: 'Wir bauen Boote gemeinsam mit renommierten Marken aus ganz Europa.',
    visit: 'Website besuchen',
    contactTitle: 'Sprechen wir über Ihr Boot',
    contactCta: 'Schreiben Sie uns',
    phone: 'Telefon',
    email: 'E-Mail',
    address: 'Standort',
    hours: 'Öffnungszeiten',
    hoursValue: 'Mo–Fr 7:00–15:00',
    contactIntro: 'Fragen zu unseren Produkten? Rufen Sie an oder schreiben Sie uns – wir antworten so schnell wie möglich.',
    gallery: 'Galerie',
    back: 'Alle Produkte',
    prev: 'Zurück',
    next: 'Weiter',
    close: 'Schließen',
    footerTagline: 'Yachtproduktion seit 1992',
    notFound: 'Seite nicht gefunden',
    notFoundText: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    backHome: 'Zurück zur Startseite',
  },
} as const;

export const company = {
  name: 'Yacht Service Sp. z o.o.',
  phone: '+48 91 31 21 307',
  phoneHref: '+48913121307',
  email: 'info@yachtservice.com.pl',
  projectEmail: 'projekt@yachtservice.com.pl',
  street: 'Światowida 6',
  city: '71-726 Szczecin',
  mapEmbed: 'https://www.google.com/maps?q=%C5%9Bwiatowida%206%2C%2071-726%20Szczecin&t=m&z=14&output=embed&iwloc=near',
};

/** `mono`: the logo is white on transparent, so it is rendered dark to stay visible on the light page. */
export const partners: { name: string; url: string; logo: string; mono?: boolean }[] = [
  { name: 'Leonardo Yachts', url: 'https://www.leonardoyachts.com/en/', logo: 'LeonardoYachts-Logo.png' },
  { name: 'DaVinci Yachts', url: 'https://www.davinciyachts.com/en/', logo: 'DaVinciYachts-logo.png', mono: true },
  { name: 'Mantra Yachts', url: 'http://www.mantra-yachts.de/', logo: 'mantra-yachts-logo.png' },
  { name: 'Bente Yachts', url: 'https://www.benteyachts.com/en', logo: 'bente-yachts-logo.png' },
];

export const aboutText: Record<Lang, { heading: string; paragraphs: string[] }> = {
  pl: {
    heading: 'Produkcja jachtów od 1992 roku',
    paragraphs: [
      'Firma Yacht Service, założona w 1992 roku, jest producentem łodzi, jachtów oraz innych wyrobów z laminatów poliestrowych i epoxydowych. Stale modernizowana, dysponuje powierzchnią produkcyjną 3 000 m².',
      'Zajmujemy się produkcją zarówno na rynek krajowy jak i eksport. Współpracujemy z wieloma firmami z Europy Zachodniej. Posiadamy wysoko wykwalifikowany personel z dużym doświadczeniem. Stosujemy nowoczesne rozwiązania technologiczne oraz wysokiej klasy materiały do produkcji.',
      'Atutem firmy jest jej położenie: bliskość granicy niemieckiej oraz dużych akwenów wodnych.',
    ],
  },
  en: {
    heading: 'Manufacturing yachts since 1992',
    paragraphs: [
      'Yacht Service, founded in 1992, manufactures boats, yachts and related products primarily made from GRP.',
      'We serve both domestic and export markets, cooperating with multiple companies and well-known brands throughout Europe. Yacht Service’s experienced and qualified team uses advanced technology methods together with the highest quality materials for production.',
      'Yacht Service is additionally specialized in the production of custom boats and moulds.',
    ],
  },
  de: {
    heading: 'Yachtproduktion seit 1992',
    paragraphs: [
      'Yachtservice ist seit 1992 Hersteller von Segelyachten und Motorbooten. Im Mittelpunkt unserer Tätigkeit liegt auch die Epoxid- und Polyesterlaminatproduktion. Die Werft wird ständig modernisiert und verfügt über 3000 m² Produktionsfläche.',
      'Mit unserer Gewährleistung der hohen Qualität und dank der Zusammenarbeit mit vielen westeuropäischen Unternehmen werden unsere Produkte sowohl für inländische als auch ausländische Kunden hergestellt.',
      'Im Produktionsprozess verwenden unsere hochqualifizierten Mitarbeiter moderne technologische Lösungen und hochwertige Materialien.',
    ],
  },
};

export const subsidies = {
  title: 'Dotacje UE',
  text: 'Zapytanie ofertowe z dnia 09.06.2020 na usługę promocji w związku z realizacją projektu unijnego pod tytułem „Opracowanie ekologicznego jachtu wielokadłubowego z biokompozytów” (POIR) – realizowanym w ramach Programu Operacyjnego Inteligentny Rozwój 2014–2020, Działanie 1.1. „Projekty B+R przedsiębiorstw”.',
  contact: 'Dane kontaktowe',
};

export function productTitle(p: Product, lang: Lang): string {
  return (p.i18n[lang] ?? p.i18n.pl)!.title;
}

export function productDescription(p: Product, lang: Lang): string[] {
  return (p.i18n[lang] ?? p.i18n.pl)!.description;
}
