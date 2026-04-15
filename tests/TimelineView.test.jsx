import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TimelineView from '../src/components/TimelineView'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeArtifact(overrides = {}) {
  return {
    id: Math.random(),
    title: 'Test Artifact',
    uploadDate: '2024-01-15',
    image: '/test.jpg',
    tags: [],
    ...overrides,
  }
}

const ARTIFACTS = [
  makeArtifact({ id: 1, title: 'Alpha',   uploadDate: '2024-03-01', tags: ['tag-a', 'tag-b', 'tag-c', 'tag-d'] }),
  makeArtifact({ id: 2, title: 'Beta',    uploadDate: '2024-01-15' }),
  makeArtifact({ id: 3, title: 'Gamma',   uploadDate: '2024-06-20', location: { city: 'Burlington', state: 'Vermont' } }),
  makeArtifact({ id: 4, title: 'Delta',   uploadDate: '2023-11-10', subject: { name: 'Maria S.', isPseudonym: true } }),
  makeArtifact({ id: 5, title: 'Epsilon', uploadDate: '2024-09-05' }),
]

function renderTimeline(artifacts = ARTIFACTS, onArtifactClick = vi.fn()) {
  render(<TimelineView artifacts={artifacts} onArtifactClick={onArtifactClick} />)
  return { onArtifactClick }
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('TimelineView — rendering', () => {
  it('renders all artifacts when no date filter is set', () => {
    renderTimeline()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('shows the correct artifact count in the summary', () => {
    renderTimeline()
    expect(screen.getByText('5 artifacts in timeline')).toBeInTheDocument()
  })

  it('uses singular "artifact" when only one artifact is shown', () => {
    renderTimeline([makeArtifact({ id: 99, title: 'Solo', uploadDate: '2024-01-01' })])
    expect(screen.getByText('1 artifact in timeline')).toBeInTheDocument()
  })

  it('renders From and To date inputs', () => {
    renderTimeline()
    expect(screen.getByLabelText('From:')).toBeInTheDocument()
    expect(screen.getByLabelText('To:')).toBeInTheDocument()
  })

  it('does not show the Clear button when no dates are set', () => {
    renderTimeline()
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })
})

// ── Chronological ordering ────────────────────────────────────────────────────

describe('TimelineView — ordering', () => {
  it('displays artifacts in chronological order (oldest first)', () => {
    renderTimeline()
    const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)
    expect(titles).toEqual(['Delta', 'Beta', 'Alpha', 'Gamma', 'Epsilon'])
  })
})

// ── Date filtering ────────────────────────────────────────────────────────────

describe('TimelineView — date filtering', () => {
  it('excludes artifacts before the start date', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2024-03-01' } })
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('excludes artifacts after the end date', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('To:'), { target: { value: '2024-01-31' } })
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })

  it('applies both start and end date together', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2024-01-01' } })
    fireEvent.change(screen.getByLabelText('To:'),   { target: { value: '2024-04-01' } })
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('updates the artifact count after filtering', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2024-06-01' } })
    expect(screen.getByText('2 artifacts in timeline')).toBeInTheDocument()
  })
})

// ── Clear button ──────────────────────────────────────────────────────────────

describe('TimelineView — clear button', () => {
  it('shows the Clear button after setting a start date', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2024-01-01' } })
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('shows the Clear button after setting an end date', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('To:'), { target: { value: '2024-12-31' } })
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('restores all artifacts and hides the Clear button after clicking it', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2024-06-01' } })
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Clear'))

    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('5 artifacts in timeline')).toBeInTheDocument()
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })
})

// ── Empty state ───────────────────────────────────────────────────────────────

describe('TimelineView — empty state', () => {
  it('shows an empty state message when no artifacts are passed', () => {
    renderTimeline([])
    expect(screen.getByText('No artifacts found in the selected date range.')).toBeInTheDocument()
  })

  it('shows the empty state when filters exclude all artifacts', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2030-01-01' } })
    expect(screen.getByText('No artifacts found in the selected date range.')).toBeInTheDocument()
  })

  it('shows the adjustment hint when dates are active and no results found', () => {
    renderTimeline()
    fireEvent.change(screen.getByLabelText('From:'), { target: { value: '2030-01-01' } })
    expect(screen.getByText(/Try adjusting your date filters/)).toBeInTheDocument()
  })

  it('does not show the adjustment hint when the list is empty with no filters', () => {
    renderTimeline([])
    expect(screen.queryByText(/Try adjusting/)).not.toBeInTheDocument()
  })
})

// ── Click interaction ─────────────────────────────────────────────────────────

describe('TimelineView — artifact click', () => {
  it('calls onArtifactClick with the correct artifact when a card is clicked', () => {
    const { onArtifactClick } = renderTimeline()
    fireEvent.click(screen.getByText('Alpha').closest('.timeline-card'))
    expect(onArtifactClick).toHaveBeenCalledWith(expect.objectContaining({ title: 'Alpha' }))
  })

  it('calls onArtifactClick with the correct artifact for a different card', () => {
    const { onArtifactClick } = renderTimeline()
    fireEvent.click(screen.getByText('Gamma').closest('.timeline-card'))
    expect(onArtifactClick).toHaveBeenCalledWith(expect.objectContaining({ title: 'Gamma' }))
  })
})

// ── Artifact details ──────────────────────────────────────────────────────────

describe('TimelineView — artifact details', () => {
  it('renders the artifact location when present', () => {
    renderTimeline()
    expect(screen.getByText(/Burlington, Vermont/)).toBeInTheDocument()
  })

  it('renders the artifact subject name when present', () => {
    renderTimeline()
    expect(screen.getByText('Maria S.')).toBeInTheDocument()
  })

  it('shows up to 3 tags on an artifact', () => {
    renderTimeline()
    expect(screen.getByText('tag-a')).toBeInTheDocument()
    expect(screen.getByText('tag-b')).toBeInTheDocument()
    expect(screen.getByText('tag-c')).toBeInTheDocument()
  })

  it('shows a "+N more" tag when an artifact has more than 3 tags', () => {
    renderTimeline()
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })
})
