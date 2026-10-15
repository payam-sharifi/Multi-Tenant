export type Lang = "en" | "de";

export const LANGS: { code: Lang; label: string; htmlLang: string }[] = [
  { code: "en", label: "EN", htmlLang: "en" },
  { code: "de", label: "DE", htmlLang: "de" },
];

const de = {
  meta: {
    title: "VELORA Wohnbau — Schlüsselfertige Sanierung in Deutschland",
    description:
      "Komplettsanierung, Bad, Fenster und Innenausbau aus einer Hand. Festpreis, 3D-Visualisierung und Förderberatung — deutschlandweit.",
  },
  nav: {
    services: "Leistungen",
    guarantees: "Garantien",
    projects: "Projekte",
    reviews: "Bewertungen",
    team: "Über uns",
    beforeAfter: "Vorher–Nachher",
    financing: "Finanzierung",
    faq: "FAQ",
    contact: "Kontakt",
  },
  header: {
    cta: "Kostenlose Beratung",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    language: "Sprache",
    call: "Anrufen",
    hours: "Mo–Fr 08:00–18:00",
  },
  hero: {
    badge: "Sanierung & Umbau · deutschlandweit",
    title: "Ihr Zuhause, schlüsselfertig neu gedacht — alle Gewerke, ein Ansprechpartner.",
    subtitle:
      "Kein Handwerker-Chaos, keine Überraschungen. Von der ersten Skizze bis zur besenreinen Übergabe begleiten wir Ihre Immobilie — mit Festpreis, Visualisierung und Förderberatung.",
    ctaPrimary: "Kostenlose Beratung anfragen",
    ctaSecondary: "Leistungen ansehen",
    bullets: [
      "100 % Festpreis & Termine",
      "3D-Visualisierung vor Baustart",
      "Fördermittel-Service",
      "Alles aus einer Hand",
    ],
    stats: [
      { value: "180+", label: "realisierte Projekte" },
      { value: "21 Tage", label: "Baustart-Zusage" },
      { value: "bis 70 %", label: "mögliche Förderung" },
      { value: "5 Jahre", label: "Gewährleistung" },
    ],
  },
  services: {
    eyebrow: "Leistungen",
    title: "Komfort beginnt mit den richtigen Experten",
    subtitle: "Vier Schwerpunkte — und dahinter alle Gewerke, die ein Wohnraum wirklich braucht.",
    items: [
      {
        title: "Komplettsanierung",
        description: "Altbau und Bestand komplett erneuern: Grundriss, Technik, Oberflächen — schlüsselfertig.",
      },
      {
        title: "Wohnraum-Renovierung",
        description: "Küche, Wohnzimmer, Flur: moderne Materialien, ruhige Farbwelten, saubere Übergaben.",
      },
      {
        title: "3D-Visualisierung",
        description: "Sie sehen das Ergebnis, bevor der erste Hammer fällt. Änderungen noch am Bildschirm.",
      },
      {
        title: "Staatliche Förderungen",
        description: "Wir prüfen, beantragen und dokumentieren. KfW, BAFA und kommunale Programme.",
      },
    ],
  },
  guarantees: {
    eyebrow: "Sicherheit",
    title: "Entwickelt, um Budget, Zeitplan und Ergebnis zu schützen",
    items: [
      {
        title: "Echter Festpreis",
        description:
          "Steigt der Materialpreis, tragen wir die Differenz. Sie zahlen keinen Cent mehr als vereinbart.",
      },
      {
        title: "Baustart mit Ausfall-Garantie",
        description: "Starten wir nicht im zugesagten Fenster, gilt eine Vertragsstrafe pro Verspätungstag.",
      },
      {
        title: "24h-Erreichbarkeit",
        description: "Keine Antwort innerhalb von 24 Stunden — Ihr Meilenstein wird sofort priorisiert.",
      },
      {
        title: "Ein Projektleiter",
        description: "Sie sprechen nur mit einer Person. Alle Gewerke steuern wir im Hintergrund.",
      },
      {
        title: "Volle Verantwortung",
        description: "Fehler beheben wir unbürokratisch. Kein Abwälzen auf Subunternehmer.",
      },
      {
        title: "Fördermittel-Service",
        description: "Prüfung, Antrag, Nachweise — damit Ihnen keine staatlichen Mittel entgehen.",
      },
    ],
  },
  projects: {
    eyebrow: "Referenzen",
    title: "Ausgeführte Arbeiten von VELORA Wohnbau",
    area: "Fläche",
    duration: "Ausführungszeit",
    kind: "Art der Sanierung",
    items: [
      { title: "Altbau Harvestehude", area: "86 m²", duration: "10 Wochen", kind: "Komplettsanierung", city: "Hamburg" },
      { title: "Stadtwohnung Belgisches Viertel", area: "64 m²", duration: "8 Wochen", kind: "Designer-Renovierung", city: "Köln" },
      { title: "Loft Maxvorstadt", area: "92 m²", duration: "12 Wochen", kind: "Komplettsanierung", city: "München" },
    ],
  },
  reviews: {
    eyebrow: "Google",
    title: "Google-Bewertungen aus Hamburg",
    subtitle:
      "Lesen Sie, wie Eigentümer aus Hamburg die Zusammenarbeit bewerten — Auszüge aus unseren Google-Bewertungen.",
    source: "Google",
    rating: "4,9",
    count: "47 Google-Bewertungen",
    location: "Hamburg",
    items: [
      {
        name: "Clara Weiss",
        city: "Harvestehude",
        date: "vor 2 Monaten",
        text: "Ruhige Kommunikation, pünktlicher Start, und das Bad sieht aus wie in der Visualisierung. Genau das wollten wir.",
        rating: 5,
      },
      {
        name: "Malte Jensen",
        city: "Eppendorf",
        date: "vor 3 Monaten",
        text: "Ein Ansprechpartner statt fünf Firmen. Die Küche war in acht Wochen fertig — ohne Nachträge.",
        rating: 5,
      },
      {
        name: "Parisa Noori",
        city: "Winterhude",
        date: "vor 5 Monaten",
        text: "Fördermittel komplett mitübernommen. Wir hätten das allein nie so sauber beantragt.",
        rating: 5,
      },
      {
        name: "Henning Bruns",
        city: "Altona",
        date: "vor 6 Monaten",
        text: "Saubere Baustelle, klare Meilensteine. Die Wärmedämmung hat den Altbau spürbar ruhiger gemacht.",
        rating: 5,
      },
      {
        name: "Saskia Holm",
        city: "Eimsbüttel",
        date: "vor 8 Monaten",
        text: "Vom ersten Gespräch bis zur Übergabe ein fester Ansprechpartner. Keine Überraschungen auf der Rechnung.",
        rating: 5,
      },
      {
        name: "Jonas Kröger",
        city: "Hamburg-Nord",
        date: "vor 11 Monaten",
        text: "Elektrik, Boden und Bad aus einer Hand. Termine haben gehalten — das ist in Hamburg selten.",
        rating: 5,
      },
    ],
  },
  quality: {
    eyebrow: "Baustelle",
    title: "Hinter den Kulissen: Qualität in Echtzeit",
    subtitle:
      "Wöchentliche Fotos, klare Meilensteine, dokumentierte Abnahmen. Sie wissen jederzeit, wo Ihr Projekt steht.",
  },
  team: {
    eyebrow: "Menschen",
    title: "Ihr Expertenteam",
    subtitle:
      "VELORA Wohnbau steht für ruhige, hochwertige Sanierung mit klaren Zusagen. Wir arbeiten für Eigentümer in ganz Deutschland.",
    mission:
      "Unsere Mission: Räume, die funktionieren — und den Charakter der Menschen zeigen, die darin leben.",
    note: "Keine Sprachbarrieren, kein Handwerker-Jargon. Wir sprechen klar.",
    items: [
      { name: "Mira Ellermann", role: "Gründerin" },
      { name: "Jonas Bergmann", role: "Gründer" },
      { name: "Lena Krüger", role: "Geschäftsführung" },
      { name: "Tarik Yilmaz", role: "Beratung & Verkauf" },
      { name: "Sofia Brandt", role: "Architektin" },
      { name: "Henrik Vogt", role: "Projektleiter" },
      { name: "Nora Lindberg", role: "Projektleiterin" },
      { name: "Emre Sahin", role: "Bauleitung" },
    ],
  },
  beforeAfter: {
    eyebrow: "Verwandlung",
    title: "Vorher–Nachher Projekte",
    before: "Vorher",
    after: "Nachher",
    items: [
      { title: "Altbauwohnungen Hamburg-Eimsbüttel", area: "78 m²", duration: "11 Wochen", kind: "Komplettsanierung", city: "Hamburg" },
      { title: "Stadthaus Köln-Sülz", area: "110 m²", duration: "14 Wochen", kind: "Komplettsanierung", city: "Köln" },
      { title: "Etagenwohnung München-Schwabing", area: "71 m²", duration: "9 Wochen", kind: "Wohnraum-Renovierung", city: "München" },
    ],
  },
  financing: {
    eyebrow: "Planung",
    title: "Finanzierungsrechner",
    subtitle:
      "Ungefähre monatliche Rate für Ihr Sanierungsvorhaben — zur Orientierung, ohne Bankpartner-Bindung.",
    amountLabel: "Vorhabenssumme",
    yearsLabel: "Laufzeit (Jahre)",
    rateLabel: "Zinssatz p. a.",
    resultLabel: "Monatliche Rate ca.",
    note: "Kein Angebot. Konditionen hängen von Ihrer Bank und Bonität ab.",
  },
  process: {
    eyebrow: "Ablauf",
    title: "Ihr Weg zum neuen Zuhause",
    items: [
      { title: "Kostenlose Beratung", description: "Ziele, Budget und Zeitplan klären wir unverbindlich." },
      { title: "3D & Festpreisangebot", description: "Visualisierung mit transparentem Festpreis — vor dem ersten Schnitt." },
      { title: "Baustart nach Zusage", description: "Vertraglich zugesicherter Start, pünktlich und planbar." },
      { title: "Schlüsselfertige Übergabe", description: "Fertig, gereinigt, dokumentiert — bereit zum Einziehen." },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Häufig gestellte Fragen",
    items: [
      {
        question: "Was bedeutet schlüsselfertig bei VELORA?",
        answer:
          "Planung, Gewerke, Material, Bauleitung und Endreinigung liegen bei uns. Sie übergeben uns die Immobilie und bekommen sie bezugsfertig zurück.",
      },
      {
        question: "Wie verbindlich ist der Festpreis?",
        answer:
          "Der Preis im Angebot ist der Preis, den Sie zahlen. Materialsteigerungen tragen wir. Änderungen am Leistungsumfang rechnen wir vorher transparent nach.",
      },
      {
        question: "Arbeiten Sie nur in Hamburg?",
        answer:
          "Nein. Hauptsitz ist Hamburg, Projekte führen wir bundesweit — mit festen Teams in Köln und München.",
      },
      {
        question: "Übernehmt ihr die Förderanträge?",
        answer:
          "Ja. Wir prüfen, welche Programme passen, bereiten Unterlagen vor und begleiten die Einreichung.",
      },
      {
        question: "Kann ich während der Bauzeit wohnen bleiben?",
        answer:
          "Bei Teilmaßnahmen oft ja. Bei Komplettsanierung planen wir Auszugfenster oder alternative Wohnlösungen mit Ihnen.",
      },
      {
        question: "Wie lange dauert eine typische Wohnungssanierung?",
        answer:
          "Je nach Fläche und Tiefe zwischen 8 und 16 Wochen. Den Zeitplan schreiben wir fest ins Angebot.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Kontakt & Standorte",
    coverageLabel: "Einsatzgebiete",
    coverage: "In ganz Deutschland",
    hqLabel: "Hauptsitz",
    hqAddress: "Große Bleichen 31, 20354 Hamburg",
    hoursLabel: "Öffnungszeiten",
    hours: "Mo–Fr 08:00–18:00",
    hoursRows: [
      { days: "Montag – Freitag", hours: "08:00 – 18:00" },
      { days: "Samstag", hours: "09:00 – 14:00" },
      { days: "Sonntag", hours: "geschlossen" },
    ],
    mapLabel: "Standort in Google Maps",
    directions: "Route in Google Maps",
    phoneLabel: "Telefon",
    emailLabel: "E-Mail",
    firstName: "Vorname",
    lastName: "Nachname",
    emailPlaceholder: "E-Mail",
    phonePlaceholder: "Telefonnummer",
    message: "Erzählen Sie uns von Ihrem Projekt",
    submit: "Kostenlose Beratung anfragen",
    success: "Danke. Wir melden uns innerhalb von 24 Stunden.",
    formNote: "Mit dem Absenden stimmen Sie der Kontaktaufnahme zu.",
    locations: [
      { name: "VELORA Hamburg", address: "Große Bleichen 31, 20354 Hamburg" },
      { name: "VELORA Köln", address: "Hohenzollernring 22, 50672 Köln" },
      { name: "VELORA München", address: "Türkenstraße 84, 80799 München" },
    ],
  },
  materials: {
    eyebrow: "Ausstattung",
    title: "Materialien, die wir einsetzen",
    subtitle: "Eine Auswahl typischer Qualitäten — immer abgestimmt auf Grundriss, Licht und Alltag.",
    items: [
      { title: "Eiche Laminat Natur", spec: "1.292 × 193 × 8 mm" },
      { title: "Sockelleiste Kiefer", spec: "lackiert, 240 × 1,8 × 5,8 cm" },
      { title: "Dämmunterlage Basic", spec: "grau, 25 m², 1,2 mm" },
      { title: "Raufasertapete mittel", spec: "weiß, 33 × 0,53 m" },
      { title: "Wandfarbe Dispersion", spec: "stumpfmatt, 10 l" },
      { title: "Feinsteinzeug 60×60", spec: "matt, rutschhemmend" },
      { title: "Zimmertür Röhrenspan", spec: "weiß, 885 × 2.005 mm" },
      { title: "Türgriff Edelstahl", spec: "zweiteilig, Buntbart" },
    ],
  },
  footer: {
    about: "Wir schaffen Räume, die ruhig wirken und den Alltag tragen.",
    quick: "Schnellzugriff",
    services: "Leistungen",
    legal: "Rechtliches",
    imprint: "Impressum",
    privacy: "Datenschutz",
    rights: "© 2026 VELORA Wohnbau GmbH. Alle Rechte vorbehalten.",
    company: "VELORA Wohnbau GmbH",
    represented: "Vertreten durch Geschäftsführerin Lena Krüger",
    hours: "Öffnungszeiten",
  },
  quote: {
    title: "Kostenlose Erstberatung",
    close: "Schließen",
  },
};

const en: typeof de = {
  meta: {
    title: "VELORA Wohnbau — Turnkey renovation across Germany",
    description:
      "Full renovations, bathrooms, windows and interiors from a single team. Fixed price, 3D visualisation and funding support — nationwide.",
  },
  nav: {
    services: "Services",
    guarantees: "Guarantees",
    projects: "Projects",
    reviews: "Reviews",
    team: "About",
    beforeAfter: "Before & after",
    financing: "Financing",
    faq: "FAQ",
    contact: "Contact",
  },
  header: {
    cta: "Free consultation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    call: "Call us",
    hours: "Mon–Fri 08:00–18:00",
  },
  hero: {
    badge: "Renovation & conversion · nationwide",
    title: "Your home, rebuilt turnkey — every trade, one contact.",
    subtitle:
      "No contractor chaos, no surprises. From the first sketch to a broom-clean handover we modernise your property — with a fixed price, visualisation and funding support.",
    ctaPrimary: "Request a free consultation",
    ctaSecondary: "View services",
    bullets: ["100% fixed price & dates", "3D visualisation before start", "Funding service", "Everything from one team"],
    stats: [
      { value: "180+", label: "completed projects" },
      { value: "21 days", label: "start commitment" },
      { value: "up to 70%", label: "possible funding" },
      { value: "5 years", label: "warranty" },
    ],
  },
  services: {
    eyebrow: "Services",
    title: "Comfort starts with the right experts",
    subtitle: "Four focus areas — and behind them every trade a home actually needs.",
    items: [
      { title: "Full renovation", description: "Rebuild layout, services and finishes in existing buildings — turnkey." },
      { title: "Interior refresh", description: "Kitchen, living room, hallway: calm palettes, precise joins, clean handovers." },
      { title: "3D visualisation", description: "See the result before the first hammer. Change it on screen, not on site." },
      { title: "Public funding", description: "We check, apply and document. KfW, BAFA and local programmes." },
    ],
  },
  guarantees: {
    eyebrow: "Assurance",
    title: "Built to protect your budget, schedule and result",
    items: [
      { title: "True fixed price", description: "If materials rise, we absorb the difference. You pay what was agreed." },
      { title: "Start-date guarantee", description: "If we miss the promised window, a contractual penalty applies per day." },
      { title: "24h response", description: "No reply within 24 hours — your milestone is immediately prioritised." },
      { title: "One project lead", description: "You talk to one person. We coordinate every trade in the background." },
      { title: "Full responsibility", description: "We fix issues without bureaucracy. No passing blame to subcontractors." },
      { title: "Funding service", description: "Review, application, evidence — so no public money is left on the table." },
    ],
  },
  projects: {
    eyebrow: "References",
    title: "Completed work by VELORA Wohnbau",
    area: "Area",
    duration: "Duration",
    kind: "Type of renovation",
    items: [
      { title: "Period apartment Harvestehude", area: "86 m²", duration: "10 weeks", kind: "Full renovation", city: "Hamburg" },
      { title: "City apartment Belgian Quarter", area: "64 m²", duration: "8 weeks", kind: "Designer refresh", city: "Cologne" },
      { title: "Loft Maxvorstadt", area: "92 m²", duration: "12 weeks", kind: "Full renovation", city: "Munich" },
    ],
  },
  reviews: {
    eyebrow: "Google",
    title: "Google reviews from Hamburg",
    subtitle: "How owners in Hamburg rate the work — excerpts from our Google reviews.",
    source: "Google",
    rating: "4.9",
    count: "47 Google reviews",
    location: "Hamburg",
    items: [
      { name: "Clara Weiss", city: "Harvestehude", date: "2 months ago", text: "Calm communication, on-time start, and the bathroom matches the visualisation. Exactly what we wanted.", rating: 5 },
      { name: "Malte Jensen", city: "Eppendorf", date: "3 months ago", text: "One contact instead of five firms. The kitchen was done in eight weeks — no extras.", rating: 5 },
      { name: "Parisa Noori", city: "Winterhude", date: "5 months ago", text: "They handled the funding paperwork. We would never have filed it this cleanly alone.", rating: 5 },
      { name: "Henning Bruns", city: "Altona", date: "6 months ago", text: "Tidy site, clear milestones. The insulation made the period building noticeably quieter.", rating: 5 },
      { name: "Saskia Holm", city: "Eimsbüttel", date: "8 months ago", text: "One contact from first call to handover. No surprises on the invoice.", rating: 5 },
      { name: "Jonas Kröger", city: "Hamburg-Nord", date: "11 months ago", text: "Electrics, floors and bathroom from one team. Dates held — rare in Hamburg.", rating: 5 },
    ],
  },
  quality: {
    eyebrow: "On site",
    title: "Behind the scenes: quality in real time",
    subtitle: "Weekly photos, clear milestones, documented inspections. You always know where the project stands.",
  },
  team: {
    eyebrow: "People",
    title: "Your expert team",
    subtitle: "VELORA Wohnbau stands for calm, high-quality renovation with clear commitments. We work for owners across Germany.",
    mission: "Our mission: rooms that work — and reflect the people who live in them.",
    note: "No jargon. We speak plainly.",
    items: [
      { name: "Mira Ellermann", role: "Founder" },
      { name: "Jonas Bergmann", role: "Founder" },
      { name: "Lena Krüger", role: "Managing director" },
      { name: "Tarik Yilmaz", role: "Consulting & sales" },
      { name: "Sofia Brandt", role: "Architect" },
      { name: "Henrik Vogt", role: "Project lead" },
      { name: "Nora Lindberg", role: "Project lead" },
      { name: "Emre Sahin", role: "Site management" },
    ],
  },
  beforeAfter: {
    eyebrow: "Transformation",
    title: "Before & after projects",
    before: "Before",
    after: "After",
    items: [
      { title: "Period apartments Hamburg-Eimsbüttel", area: "78 m²", duration: "11 weeks", kind: "Full renovation", city: "Hamburg" },
      { title: "Townhouse Cologne-Sülz", area: "110 m²", duration: "14 weeks", kind: "Full renovation", city: "Cologne" },
      { title: "Apartment Munich-Schwabing", area: "71 m²", duration: "9 weeks", kind: "Interior refresh", city: "Munich" },
    ],
  },
  financing: {
    eyebrow: "Planning",
    title: "Financing calculator",
    subtitle: "An approximate monthly rate for your renovation — for orientation only, no bank partnership.",
    amountLabel: "Project sum",
    yearsLabel: "Term (years)",
    rateLabel: "Interest p.a.",
    resultLabel: "Approx. monthly rate",
    note: "Not an offer. Terms depend on your bank and credit.",
  },
  process: {
    eyebrow: "Process",
    title: "Your path to a new home",
    items: [
      { title: "Free consultation", description: "We clarify goals, budget and timeline with no obligation." },
      { title: "3D & fixed-price offer", description: "Visualisation with a transparent fixed price — before the first cut." },
      { title: "Site start after signing", description: "A contractually guaranteed start, on time and planned." },
      { title: "Turnkey handover", description: "Finished, cleaned, documented — ready to move in." },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      { question: "What does turnkey mean at VELORA?", answer: "Planning, trades, materials, site management and final cleaning sit with us. You hand over the property and get it back ready to live in." },
      { question: "How binding is the fixed price?", answer: "The price in the offer is what you pay. We absorb material increases. Scope changes are priced before we build them." },
      { question: "Do you only work in Hamburg?", answer: "No. Headquarters is Hamburg; we run projects nationwide with teams in Cologne and Munich." },
      { question: "Do you handle funding applications?", answer: "Yes. We check which programmes fit, prepare documents and accompany the filing." },
      { question: "Can I stay in the home during works?", answer: "For partial works often yes. For full renovations we plan move-out windows or temporary housing with you." },
      { question: "How long does a typical apartment renovation take?", answer: "Depending on size and depth, 8 to 16 weeks. The schedule is written into the offer." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact & locations",
    coverageLabel: "Coverage",
    coverage: "Throughout Germany",
    hqLabel: "Headquarters",
    hqAddress: "Große Bleichen 31, 20354 Hamburg",
    hoursLabel: "Opening hours",
    hours: "Mon–Fri 08:00–18:00",
    hoursRows: [
      { days: "Monday – Friday", hours: "08:00 – 18:00" },
      { days: "Saturday", hours: "09:00 – 14:00" },
      { days: "Sunday", hours: "closed" },
    ],
    mapLabel: "Location on Google Maps",
    directions: "Directions in Google Maps",
    phoneLabel: "Phone",
    emailLabel: "Email",
    firstName: "First name",
    lastName: "Last name",
    emailPlaceholder: "Email",
    phonePlaceholder: "Phone number",
    message: "Tell us about your project",
    submit: "Request a free consultation",
    success: "Thank you. We will reply within 24 hours.",
    formNote: "By submitting you agree to be contacted.",
    locations: [
      { name: "VELORA Hamburg", address: "Große Bleichen 31, 20354 Hamburg" },
      { name: "VELORA Cologne", address: "Hohenzollernring 22, 50672 Köln" },
      { name: "VELORA Munich", address: "Türkenstraße 84, 80799 München" },
    ],
  },
  materials: {
    eyebrow: "Fit-out",
    title: "Materials we actually use",
    subtitle: "A sample of typical grades — always matched to layout, light and daily use.",
    items: [
      { title: "Oak laminate, natural", spec: "1,292 × 193 × 8 mm" },
      { title: "Pine skirting", spec: "painted, 240 × 1.8 × 5.8 cm" },
      { title: "Underlay basic", spec: "grey, 25 m², 1.2 mm" },
      { title: "Woodchip wallpaper", spec: "white, 33 × 0.53 m" },
      { title: "Emulsion wall paint", spec: "matt, 10 l" },
      { title: "Porcelain stoneware 60×60", spec: "matt, slip-resistant" },
      { title: "Hollow-core interior door", spec: "white, 885 × 2,005 mm" },
      { title: "Stainless steel handle", spec: "two-piece, lever lock" },
    ],
  },
  footer: {
    about: "We create rooms that feel calm and carry everyday life.",
    quick: "Quick links",
    services: "Services",
    legal: "Legal",
    imprint: "Imprint",
    privacy: "Privacy",
    rights: "© 2026 VELORA Wohnbau GmbH. All rights reserved.",
    company: "VELORA Wohnbau GmbH",
    represented: "Represented by managing director Lena Krüger",
    hours: "Opening hours",
  },
  quote: {
    title: "Free first consultation",
    close: "Close",
  },
};

export type Dict = typeof de;
export const dictionaries: Record<Lang, Dict> = { de, en };

export const tenantTexts: Record<Lang, { ctaSecondary: string }> = {
  de: { ctaSecondary: "Leistungen ansehen" },
  en: { ctaSecondary: "View services" },
};
