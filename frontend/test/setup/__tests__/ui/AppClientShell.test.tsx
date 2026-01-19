import { render, screen, fireEvent } from '@testing-library/react'
import AppClientShell from '@/app/AppClientShell'
import { useSession } from 'next-auth/react'
import '@testing-library/jest-dom'

jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(),
}))

jest.mock('@/app/components/Header', () => ({
  __esModule: true,
  default: (props: { onLoginClick: () => void }) => (
    <button onClick={props.onLoginClick}>login</button>
  ),
}))

jest.mock('@/app/components/LoginModal', () => ({
  __esModule: true,
  default: (props: { opened: boolean }) => (props.opened ? <div>modal</div> : null),
}))

const mockUseSession = useSession as unknown as jest.Mock

describe('AppClientShell', () => {
  beforeEach(() => {
    mockUseSession.mockReset()
  })

  it('shows modal when unauthenticated and login clicked', async () => {
    mockUseSession.mockReturnValue({ status: 'unauthenticated', data: null })

    render(
      <AppClientShell>
        <div>child</div>
      </AppClientShell>,
    )

    expect(screen.queryByText('modal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('login'))
    expect(await screen.findByText('modal')).toBeInTheDocument()
  })

  it('does not open modal when authenticated', () => {
    mockUseSession.mockReturnValue({ status: 'authenticated', data: { user: {} } })

    render(
      <AppClientShell>
        <div>child</div>
      </AppClientShell>,
    )

    fireEvent.click(screen.getByText('login'))
    expect(screen.queryByText('modal')).not.toBeInTheDocument()
  })
})
