import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '../src/context/AuthContext'
import Landing from '../src/pages/Landing/Landing'
import { api } from '../src/utils/api'

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

// 3 public artifacts the API will return by default
const fixtures = [
  {
    id: 1, title: 'Public Basket',   uploadDate: '2024-01-15',
    image: '/a.jpg', fileType: 'image/jpeg', tags: ['craftwork'], uploader: 'Jane',
  },
  {
    id: 2, title: 'Public Document', uploadDate: '2024-03-10',
    image: '/b.jpg', fileType: 'image/png',  tags: ['historical'], uploader: 'John',
  },
  {
    id: 3, title: 'Public Song',     uploadDate: '2024-05-22',
    image: '/c.jpg', fileType: 'audio/mp3',  tags: ['music'], uploader: 'Jane',
  },
]

vi.mock('../src/utils/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  setToken: vi.fn(),
  clearToken: vi.fn(),
}))

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockNavigate.mockClear()
  // Resolve /artifacts with fixtures; reject /users/me so AuthContext keeps user=null
  api.get.mockImplementation((path) =>
    path === '/artifacts' ? Promise.resolve(fixtures) : Promise.reject(new Error('unauthorized'))
  )
  api.post.mockReset()
  api.post.mockResolvedValue({ token: 'fake-token', user: { id: 1, name: 'Test User' } })

  // ResizeObserver is not available in jsdom
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // scrollY used by the rect slide effect
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
})

async function renderLanding() {
  await act(async () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <MemoryRouter>
          <AuthProvider>
            <Landing />
          </AuthProvider>
        </MemoryRouter>
      </GoogleOAuthProvider>
    )
  })
}

// ── Header ────────────────────────────────────────────────────────────────────

describe('Landing — header', () => {
  it('renders the backstory title', async () => {
    await renderLanding()
    expect(screen.getByText('backstory')).toBeInTheDocument()
  })

  it('renders the username input', async () => {
    await renderLanding()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('renders the password input', async () => {
    await renderLanding()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders the filter hamburger button', async () => {
    await renderLanding()
    expect(screen.getByLabelText('Toggle filters')).toBeInTheDocument()
  })
})

// ── Login button state ────────────────────────────────────────────────────────

describe('Landing — login button', () => {
  it('is disabled when both inputs are empty', async () => {
    await renderLanding()
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is disabled when only the username is filled', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is disabled when only the password is filled', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is enabled when both username and password are filled', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    expect(screen.getByText('Login')).toBeEnabled()
  })
})

// ── Login action ──────────────────────────────────────────────────────────────

describe('Landing — login action', () => {
  it('navigates to /archive after a successful login', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/archive'))
  })

  it('does not navigate when the form is submitted with empty fields', async () => {
    await renderLanding()
    fireEvent.click(screen.getByText('Login'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('submits when Enter is pressed in the password field', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.keyDown(screen.getByPlaceholderText('Password'), { key: 'Enter' })
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/archive'))
  })

  it('submits when Enter is pressed in the username field', async () => {
    await renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.keyDown(screen.getByPlaceholderText('Username'), { key: 'Enter' })
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/archive'))
  })
})

// ── Public artifacts ──────────────────────────────────────────────────────────

describe('Landing — public artifacts', () => {
  it('shows public artifacts in the grid', async () => {
    await renderLanding()
    expect(screen.getByText('Public Basket')).toBeInTheDocument()
    expect(screen.getByText('Public Document')).toBeInTheDocument()
    expect(screen.getByText('Public Song')).toBeInTheDocument()
  })

  it('hides artifacts where publicAccess is false', async () => {
    await renderLanding()
    expect(screen.queryByText('Private Report')).not.toBeInTheDocument()
    expect(screen.queryByText('Private Video')).not.toBeInTheDocument()
  })

  it('shows the correct public artifact count in the archive info bar', async () => {
    await renderLanding()
    expect(screen.getByText(/3 artifacts/)).toBeInTheDocument()
  })
})

// ── 40-artifact cap ───────────────────────────────────────────────────────────

describe('Landing — artifact cap', () => {
  it('shows at most 40 artifacts even when more than 40 are public', async () => {
    const fiftyArtifacts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1, title: `Artifact ${i + 1}`, uploadDate: '2024-01-01',
      image: '/x.jpg', fileType: 'image/jpeg', tags: [], uploader: 'Test',
    }))
    api.get.mockImplementation((path) =>
      path === '/artifacts' ? Promise.resolve(fiftyArtifacts) : Promise.reject(new Error('unauthorized'))
    )
    await renderLanding()
    const cards = document.querySelectorAll('.artifact-card')
    expect(cards.length).toBeLessThanOrEqual(40)
  })
})

// ── Filter panel ──────────────────────────────────────────────────────────────

describe('Landing — filter panel', () => {
  it('filter panel is not open initially', async () => {
    await renderLanding()
    expect(document.querySelector('.filter-panel.open')).not.toBeInTheDocument()
  })

  it('opens the filter panel when the hamburger is clicked', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    expect(document.querySelector('.filter-panel.open')).toBeInTheDocument()
  })

  it('closes the filter panel when the × button inside it is clicked', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.click(screen.getByLabelText('Close filters'))
    expect(document.querySelector('.filter-panel.open')).not.toBeInTheDocument()
  })

  it('shows no filter count badge when no filters are active', async () => {
    await renderLanding()
    expect(document.querySelector('.landing-filter-count')).not.toBeInTheDocument()
  })

  it('shows a filter count badge after a filter is applied', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'basket' } })
    expect(document.querySelector('.landing-filter-count')).toBeInTheDocument()
    expect(document.querySelector('.landing-filter-count').textContent).toBe('1')
  })

  it('filters the artifact grid based on the search query', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'Basket' } })
    expect(screen.getByText('Public Basket')).toBeInTheDocument()
    expect(screen.queryByText('Public Document')).not.toBeInTheDocument()
  })

  it('shows "matching filters" in the count text when filters are active', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'Basket' } })
    expect(screen.getByText(/matching filters/)).toBeInTheDocument()
  })

  it('shows the empty state when no artifacts match the filter', async () => {
    await renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'xyzzy-no-match' } })
    expect(screen.getByText('No artifacts match your current filters.')).toBeInTheDocument()
  })
})
