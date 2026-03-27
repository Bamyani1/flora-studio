import React, { forwardRef } from "react";
import { vi } from "vitest";

type MockRouter = {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
};

export const mockRouter: MockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

let mockPathname = "/";

export function setMockPathname(pathname: string) {
  mockPathname = pathname;
}

export function resetMockNavigation() {
  mockPathname = "/";
  mockRouter.push.mockReset();
  mockRouter.replace.mockReset();
  mockRouter.back.mockReset();
  mockRouter.refresh.mockReset();
  mockRouter.prefetch.mockReset();
}

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >(function MockNextLink({ href, ...props }, ref) {
    return React.createElement("a", { ...props, href, ref });
  }),
}));
