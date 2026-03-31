export const NAV_ITEMS = [
  { label: "Work", href: "/work", kind: "link" },
  { label: "Process", href: "/process", kind: "link" },
  { label: "About", href: "/about", kind: "link" },
  { label: "Get in touch", href: "/contact", kind: "cta" },
] as const;

export const LEGAL_NAV_ITEMS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.kind === "link");
export const HEADER_NAV_ITEMS = PRIMARY_NAV_ITEMS.filter(
  (item) => item.href === "/work" || item.href === "/process" || item.href === "/about",
);
export const NAV_CTA = NAV_ITEMS.find((item) => item.kind === "cta")!;

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
