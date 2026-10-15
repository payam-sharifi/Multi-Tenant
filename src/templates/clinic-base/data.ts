export const PHONE = "+49 123 456789";
export const PHONE_HREF = "tel:+49123456789";

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${w}&q=80`;

/** Default visuals used when the backend JSON does not provide icon/image (same order as the built-in services). */
export const defaultServiceVisuals: { id: string; icon: string; image: string }[] = [
  { id: "therapy", icon: "stethoscope", image: unsplash("1631217868264-e5b90bb7e133", 900) },
  { id: "dentistry", icon: "smile", image: unsplash("1606811841689-23dfddce3e95", 900) },
  { id: "womens-health", icon: "flower2", image: unsplash("1493894473891-10fc1e5dbd22", 900) },
  { id: "pediatrics", icon: "baby", image: unsplash("1515488042361-ee00e0ddd4e4", 900) },
  { id: "diagnostics", icon: "microscope", image: unsplash("1581594693702-fbdc51b2763b", 900) },
  { id: "psychiatry", icon: "brain", image: unsplash("1559757148-5c350d0d3c56", 900) },
];

export const defaultCheckupMeta = [
  { price: 149, old: null, featured: false },
  { price: 299, old: 352, featured: true },
  { price: 229, old: null, featured: false },
] as const;

export type DefaultDoctor = {
  id: string;
  name: string;
  rating: number;
  years: number;
  /** index in dict.doctors.specs */
  specIndex: number;
  /** index in the built-in services (booking pre-fill) */
  serviceIndex: number;
  image: string;
};

export const defaultDoctors: DefaultDoctor[] = [
  { id: "hartmann", name: "Dr. Lena Hartmann", rating: 4.9, years: 18, specIndex: 0, serviceIndex: 0, image: unsplash("1559839734-2b71ea197ec2", 1000) },
  { id: "mehta", name: "Dr. Arjun Mehta", rating: 4.9, years: 14, specIndex: 1, serviceIndex: 4, image: unsplash("1612349317150-e413f6a5b16d", 1000) },
  { id: "moretti", name: "Dr. Leila Moretti", rating: 5.0, years: 16, specIndex: 2, serviceIndex: 2, image: unsplash("1594824476967-48c8b964273f", 1000) },
  { id: "costa", name: "Dr. Daniel Costa", rating: 4.8, years: 11, specIndex: 3, serviceIndex: 1, image: unsplash("1622253692010-333f2da6031d", 1000) },
  { id: "okafor", name: "Dr. Naomi Okafor", rating: 4.9, years: 12, specIndex: 4, serviceIndex: 3, image: unsplash("1651008376811-b90baee60c1f", 1000) },
  { id: "varga", name: "Dr. Tomas Varga", rating: 4.8, years: 20, specIndex: 5, serviceIndex: 4, image: unsplash("1582750433449-648ed127bb54", 1000) },
];

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  /** map pin position in % */
  x: number;
  y: number;
  /** service indexes available at this branch */
  services: number[];
};

export const defaultBranches: Branch[] = [
  {
    id: "mitte",
    name: "Hamburg-Mitte",
    address: "Lumerastraße 12, 20095 Hamburg",
    phone: "+49 123 456789",
    phoneHref: "tel:+49123456789",
    x: 48,
    y: 42,
    services: [0, 1, 2, 3, 4, 5],
  },
  {
    id: "eimsbuettel",
    name: "Eimsbüttel",
    address: "Sonnenallee 45, 20259 Hamburg",
    phone: "+49 123 456790",
    phoneHref: "tel:+49123456790",
    x: 46,
    y: 66,
    services: [0, 1, 2, 4],
  },
  {
    id: "altona",
    name: "Altona",
    address: "Gartenweg 28, 22765 Hamburg",
    phone: "+49 123 456791",
    phoneHref: "tel:+49123456791",
    x: 28,
    y: 44,
    services: [0, 2, 3, 4],
  },
  {
    id: "wandsbek",
    name: "Wandsbek",
    address: "Lindenhof 22, 22041 Hamburg",
    phone: "+49 123 456792",
    phoneHref: "tel:+49123456792",
    x: 68,
    y: 54,
    services: [0, 1, 3, 4],
  },
  {
    id: "harburg",
    name: "Harburg",
    address: "Frühlingsstraße 36, 21073 Hamburg",
    phone: "+49 123 456793",
    phoneHref: "tel:+49123456793",
    x: 40,
    y: 86,
    services: [0, 1, 2, 3, 5],
  },
  {
    id: "winterhude",
    name: "Winterhude",
    address: "Kastanienallee 207, 22303 Hamburg",
    phone: "+49 123 456794",
    phoneHref: "tel:+49123456794",
    x: 42,
    y: 16,
    services: [0, 2, 4, 5],
  },
];

export const sectionIds = {
  services: "services",
  checkup: "checkup",
  about: "about",
  doctors: "doctors",
  locations: "locations",
  faq: "faq",
} as const;

export const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export const defaultPlanIcons = ["shieldcheck", "heartpulse", "flower2"];
export const defaultValueIcons = ["award", "languages", "cpu", "handshake"];
