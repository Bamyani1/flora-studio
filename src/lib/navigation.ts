export const NAV_ITEMS = [
  { label: "Work", href: "/work", kind: "link" },
  { label: "Process", href: "/process", kind: "link" },
  { label: "About", href: "/about", kind: "link" },
  { label: "Connect", href: "/contact", kind: "cta" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.kind === "link");
export const NAV_CTA = NAV_ITEMS.find((item) => item.kind === "cta")!;

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/silkroadstudio", icon: "instagram" },
  { label: "Behance", href: "https://behance.net/silkroadstudio", icon: "behance" },
  { label: "LinkedIn", href: "https://linkedin.com/company/silkroadstudio", icon: "linkedin" },
] as const;
