export const mockPush = jest.fn();
export const mockReplace = jest.fn();
export const mockPrefetch = jest.fn();

jest.mock("next/navigation", () => ({
   useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
   }),
   usePathname: () => "/",
   useSearchParams: () => new URLSearchParams(),
}));
