import type { ReactNode } from "react";
import { vi } from "vitest";

const testMocks = vi.hoisted(() => {
  const initialClerkUser = {
    id: "user_test",
    firstName: "Ada",
    fullName: "Ada Lovelace",
    imageUrl: "",
    publicMetadata: {} as Record<string, unknown>,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    primaryEmailAddress: { emailAddress: "ada@example.com" },
  };
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    message: vi.fn(),
  });

  return {
    initialClerkUser,
    pathname: "/",
    params: {} as Record<string, string>,
    searchParams: new URLSearchParams(),
    router: {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
    },
    toast,
    clerk: {
      isLoaded: true,
      isSignedIn: true,
      userId: initialClerkUser.id,
      user: {
        ...initialClerkUser,
        publicMetadata: {} as Record<string, unknown>,
        delete: vi.fn(),
      },
    },
  };
});

export { testMocks };

export function resetTestMocks() {
  testMocks.pathname = "/";
  testMocks.params = {};
  testMocks.searchParams = new URLSearchParams();
  testMocks.clerk.isLoaded = true;
  testMocks.clerk.isSignedIn = true;
  testMocks.clerk.userId = testMocks.initialClerkUser.id;
  Object.assign(testMocks.clerk.user, {
    ...testMocks.initialClerkUser,
    publicMetadata: {},
  });
  vi.clearAllMocks();
}

vi.mock("next/link", async () => {
  const { createElement } = await import("react");

  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: string;
      children?: ReactNode;
    }) => createElement("a", { href, ...props }, children),
  };
});

vi.mock("next/image", async () => {
  const { createElement } = await import("react");

  return {
    default: ({ alt, src }: { alt?: string; src?: string }) =>
      createElement("img", { alt, src }),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => testMocks.router,
  usePathname: () => testMocks.pathname,
  useSearchParams: () => testMocks.searchParams,
  useParams: () => testMocks.params,
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: testMocks.toast,
}));

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: testMocks.clerk.isLoaded,
    isSignedIn: testMocks.clerk.isSignedIn,
    user: testMocks.clerk.user,
  }),
  useAuth: () => ({
    isLoaded: testMocks.clerk.isLoaded,
    isSignedIn: testMocks.clerk.isSignedIn,
    userId: testMocks.clerk.userId,
    getToken: vi.fn(),
  }),
  ClerkProvider: ({ children }: { children: ReactNode }) => children,
  SignInButton: ({ children }: { children?: ReactNode }) => children,
  SignOutButton: ({ children }: { children?: ReactNode }) => children,
  UserProfile: () => null,
}));
