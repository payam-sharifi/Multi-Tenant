const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const sectionIds = {
  services: "services",
  guarantees: "guarantees",
  projects: "projects",
  reviews: "reviews",
  quality: "quality",
  team: "team",
  beforeAfter: "before-after",
  financing: "financing",
  process: "process",
  faq: "faq",
  contact: "contact",
  materials: "materials",
  hours: "hours",
} as const;

export const IMAGES = {
  hero: unsplash("1600585154340-be6161a56a0c", 1800),
  sanierung: unsplash("1600607687939-ce8a6c25118c", 900),
  renovierung: unsplash("1618221195710-dd6b41faaea6", 900),
  visual: unsplash("1600210492486-724fe5c67fb0", 900),
  foerderung: unsplash("1560518883-ce09059eeffa", 900),
  project1: unsplash("1600607687644-c7171b42498b", 1100),
  project2: unsplash("1600566753190-17f0baa2a6c3", 1100),
  project3: unsplash("1600210492493-0946911123ea", 1100),
  quality: unsplash("1503387762-592deb58ef4e", 1400),
  living: unsplash("1616594039964-ae9021a400a0", 900),
  kitchen: unsplash("1556912173-46c336c7fd55", 900),
  guest: unsplash("1615874959471-1f27d1c6d0d6", 900),
  team1: unsplash("1573496359142-b8d87734a5a2", 600),
  team2: unsplash("1560250097-0b93528c311a", 600),
  team3: unsplash("1580489944761-15a19d654956", 600),
  team4: unsplash("1507003211169-0a1dd7228f2d", 600),
  team5: unsplash("1544005313-94ddf0286df2", 600),
  team6: unsplash("1500648767791-00dcc994a43e", 600),
  team7: unsplash("1589156280159-27698a70f29e", 600),
  team8: unsplash("1506794778202-cad84cf45f1d", 600),
  material1: unsplash("1581858726788-13b11e37d12e", 800),
  material2: unsplash("1615874959471-1f27d1c6d0d6", 800),
  material3: unsplash("1615529328331-f8917597711f", 800),
  material4: unsplash("1615873968403-89e068629265", 800),
  material5: unsplash("1562259949-e8e91054ce95", 800),
  material6: unsplash("1600566753086-00f18fb6b3ea", 800),
  material7: unsplash("1600585154526-990dced4db0d", 800),
  material8: unsplash("1504148453052-db7450bddffe", 800),
};

export const PHONE = "+49 40 8090 4410";
export const EMAIL = "hallo@velora-wohnbau.de";
