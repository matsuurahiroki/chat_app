// test/next-navigation.mock.ts
const push = jest.fn()
const replace = jest.fn()
const prefetch = jest.fn()

export const useRouter = () => ({
  push,
  replace,
  prefetch,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
})

export const usePathname = () => '/'
export const useSearchParams = () => new URLSearchParams()
export const redirect = jest.fn()
export const notFound = jest.fn()

export const __routerMocks__ = { push, replace, prefetch }
