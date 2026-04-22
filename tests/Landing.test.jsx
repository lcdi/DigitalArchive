import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '../src/context/AuthContext'
import Landing from '../src/pages/Landing/Landing'

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

// Controlled artifact set: 3 public, 2 private
vi.mock('../src/data/artifacts', () => ({
  artifacts: [
    {
      id: 1, title: 'Public Basket',  uploadDate: '2024-01-15',
      image: '/a.jpg', fileType: 'image/jpeg', tags: ['craftwork'], uploader: 'Jane',
      privacy: { publicAccess: true },
    },
    {
      id: 2, title: 'Public Document', uploadDate: '2024-03-10',
      image: '/b.jpg', fileType: 'image/png', tags: ['historical'], uploader: 'John',
      privacy: { publicAccess: true },
    },
    {
      id: 3, title: 'Public Song',    uploadDate: '2024-05-22',
      image: '/c.jpg', fileType: 'audio/mp3', tags: ['music'], uploader: 'Jane',
      privacy: {},
    },
    {
      id: 4, title: 'Private Report', uploadDate: '2024-02-01',
      image: '/d.jpg', fileType: 'image/jpeg', tags: ['restricted'], uploader: 'Admin',
      privacy: { publicAccess: false },
    },
    {
      id: 5, title: 'Private Video',  uploadDate: '2024-04-18',
      image: '/e.jpg', fileType: 'video/mp4', tags: ['restricted'], uploader: 'Admin',
      privacy: { publicAccess: false },
    },
  ],
}))

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockNavigate.mockClear()

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

function renderLanding() {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MemoryRouter>
        <AuthProvider>
          <Landing />
        </AuthProvider>
      </MemoryRouter>
    </GoogleOAuthProvider>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

describe('Landing — header', () => {
  it('renders the backstory title', () => {
    renderLanding()
    expect(screen.getByText('backstory')).toBeInTheDocument()
  })

  it('renders the username input', () => {
    renderLanding()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('renders the password input', () => {
    renderLanding()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders the filter hamburger button', () => {
    renderLanding()
    expect(screen.getByLabelText('Toggle filters')).toBeInTheDocument()
  })
})

// ── Login button state ────────────────────────────────────────────────────────

describe('Landing — login button', () => {
  it('is disabled when both inputs are empty', () => {
    renderLanding()
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is disabled when only the username is filled', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is disabled when only the password is filled', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('is enabled when both username and password are filled', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    expect(screen.getByText('Login')).toBeEnabled()
  })
})

// ── Login action ──────────────────────────────────────────────────────────────

describe('Landing — login action', () => {
  it('navigates to /archive after a successful login', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByText('Login'))
    expect(mockNavigate).toHaveBeenCalledWith('/archive')
  })

  it('does not navigate when the form is submitted with empty fields', () => {
    renderLanding()
    fireEvent.click(screen.getByText('Login'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('submits when Enter is pressed in the password field', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.keyDown(screen.getByPlaceholderText('Password'), { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/archive')
  })

  it('submits when Enter is pressed in the username field', () => {
    renderLanding()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.keyDown(screen.getByPlaceholderText('Username'), { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/archive')
  })
})

// ── Public artifacts ──────────────────────────────────────────────────────────

describe('Landing — public artifacts', () => {
  it('shows public artifacts in the grid', () => {
    renderLanding()
    expect(screen.getByText('Public Basket')).toBeInTheDocument()
    expect(screen.getByText('Public Document')).toBeInTheDocument()
    expect(screen.getByText('Public Song')).toBeInTheDocument()
  })

  it('hides artifacts where publicAccess is false', () => {
    renderLanding()
    expect(screen.queryByText('Private Report')).not.toBeInTheDocument()
    expect(screen.queryByText('Private Video')).not.toBeInTheDocument()
  })

  it('shows the correct public artifact count in the archive info bar', () => {
    renderLanding()
    expect(screen.getByText(/3 artifacts/)).toBeInTheDocument()
  })
})

// ── 40-artifact cap ───────────────────────────────────────────────────────────

describe('Landing — artifact cap', () => {
  it('shows at most 40 artifacts even when more than 40 are public', async () => {
    // Dynamically override the mock with 50 public artifacts
    const { artifacts: mockedModule } = await import('../src/data/artifacts')
    const original = [...mockedModule]

    // Replace the array contents in place
    mockedModule.length = 0
    for (let i = 1; i <= 50; i++) {
      mockedModule.push({
        id: i, title: `Artifact ${i}`, uploadDate: '2024-01-01',
        image: '/x.jpg', fileType: 'image/jpeg', tags: [], uploader: 'Test',
        privacy: { publicAccess: true },
      })
    }

    renderLanding()
    const cards = document.querySelectorAll('.artifact-card')
    expect(cards.length).toBeLessThanOrEqual(40)

    // Restore
    mockedModule.length = 0
    original.forEach(a => mockedModule.push(a))
  })
})

// ── Filter panel ──────────────────────────────────────────────────────────────

describe('Landing — filter panel', () => {
  it('filter panel is not open initially', () => {
    renderLanding()
    expect(document.querySelector('.filter-panel.open')).not.toBeInTheDocument()
  })

  it('opens the filter panel when the hamburger is clicked', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    expect(document.querySelector('.filter-panel.open')).toBeInTheDocument()
  })

  it('closes the filter panel when the × button inside it is clicked', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.click(screen.getByLabelText('Close filters'))
    expect(document.querySelector('.filter-panel.open')).not.toBeInTheDocument()
  })

  it('shows no filter count badge when no filters are active', () => {
    renderLanding()
    expect(document.querySelector('.landing-filter-count')).not.toBeInTheDocument()
  })

  it('shows a filter count badge after a filter is applied', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'basket' } })
    expect(document.querySelector('.landing-filter-count')).toBeInTheDocument()
    expect(document.querySelector('.landing-filter-count').textContent).toBe('1')
  })

  it('filters the artifact grid based on the search query', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'Basket' } })
    expect(screen.getByText('Public Basket')).toBeInTheDocument()
    expect(screen.queryByText('Public Document')).not.toBeInTheDocument()
  })

  it('shows "matching filters" in the count text when filters are active', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'Basket' } })
    expect(screen.getByText(/matching filters/)).toBeInTheDocument()
  })

  it('shows the empty state when no artifacts match the filter', () => {
    renderLanding()
    fireEvent.click(screen.getByLabelText('Toggle filters'))
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'xyzzy-no-match' } })
    expect(screen.getByText('No artifacts match your current filters.')).toBeInTheDocument()
  })
})
