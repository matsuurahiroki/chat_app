// test/render.tsx
import type { ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

type Props = {
  children: ReactNode
  session?: Parameters<typeof SessionProvider>[0]['session']
}

function Providers({ children, session = null }: Props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export function renderWithProviders(
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'> & { session?: Props['session'] },
) {
  const { session, ...rest } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => <Providers session={session}>{children}</Providers>,
    ...rest,
  })
}
