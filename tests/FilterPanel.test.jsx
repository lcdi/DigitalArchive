import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterPanel from '../src/components/FilterPanel'

// ── Shared props ─────────────────────────────────────────────────────────────

const defaultFilterOptions = {
  tags: ['craftwork', 'daily life', 'historical', 'architecture'],
  fileTypes: ['image/jpeg', 'image/png', 'audio/mp3', 'video/mp4'],
  uploaders: ['Jane Smith', 'John Doe', 'Alice Brown'],
}

function renderPanel(overrides = {}) {
  const props = {
    isOpen: true,
    onClose: vi.fn(),
    filterOptions: defaultFilterOptions,
    onFilterChange: vi.fn(),
    ...overrides,
  }
  render(<FilterPanel {...props} />)
  return props
}

// ── Rendering ────────────────────────────────────────────────────────────────

describe('FilterPanel — rendering', () => {
  it('renders the panel when isOpen is true', () => {
    renderPanel()
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('renders section headings for Tags, File Type, Uploader, and Upload Date Range', () => {
    renderPanel()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('File Type')).toBeInTheDocument()
    expect(screen.getByText('Uploader')).toBeInTheDocument()
    expect(screen.getByText('Upload Date Range')).toBeInTheDocument()
  })

  it('renders a search input', () => {
    renderPanel()
    expect(screen.getByPlaceholderText('Search all fields…')).toBeInTheDocument()
  })

  it('does not show the active-filters section when no filters are active', () => {
    renderPanel()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })
})

// ── Close button ─────────────────────────────────────────────────────────────

describe('FilterPanel — close button', () => {
  it('calls onClose when the × close button is clicked', () => {
    const { onClose } = renderPanel()
    fireEvent.click(screen.getByLabelText('Close filters'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

// ── Search input ─────────────────────────────────────────────────────────────

describe('FilterPanel — search input', () => {
  it('calls onFilterChange with the typed search query', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), {
      target: { value: 'basket' },
    })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchQuery: 'basket' })
    )
  })

  it('shows a search chip in the active filters when a query is entered', () => {
    renderPanel()
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), {
      target: { value: 'Vermont' },
    })
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Vermont')).toBeInTheDocument()
  })

  it('removing the search chip clears the searchQuery in onFilterChange', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), {
      target: { value: 'Vermont' },
    })
    // The × on the search chip
    const removeBtn = screen.getByText('Search').closest('.filter-chip').querySelector('.chip-remove')
    fireEvent.click(removeBtn)
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchQuery: '' })
    )
  })
})

// ── Tag filter ───────────────────────────────────────────────────────────────

describe('FilterPanel — tag filter', () => {
  it('calls onFilterChange with the selected tag', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add tag filter…'), {
      target: { value: 'craftwork' },
    })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ tags: ['craftwork'] })
    )
  })

  it('shows a chip for the active tag filter', () => {
    renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add tag filter…'), {
      target: { value: 'historical' },
    })
    expect(screen.getByText('historical')).toBeInTheDocument()
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })

  it('does not add a duplicate tag filter', () => {
    const { onFilterChange } = renderPanel()
    const select = screen.getByDisplayValue('Add tag filter…')
    fireEvent.change(select, { target: { value: 'craftwork' } })
    fireEvent.change(select, { target: { value: 'craftwork' } })
    // After second duplicate attempt the tags array should still have one entry
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1][0]
    expect(lastCall.tags.filter(t => t === 'craftwork')).toHaveLength(1)
  })

  it('removes a tag filter when its chip × is clicked', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add tag filter…'), {
      target: { value: 'craftwork' },
    })
    const chip = screen.getByText('craftwork').closest('.filter-chip')
    fireEvent.click(chip.querySelector('.chip-remove'))
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ tags: [] })
    )
  })

  it('can add multiple distinct tags', () => {
    const { onFilterChange } = renderPanel()
    const select = screen.getByDisplayValue('Add tag filter…')
    fireEvent.change(select, { target: { value: 'craftwork' } })
    fireEvent.change(select, { target: { value: 'historical' } })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ tags: expect.arrayContaining(['craftwork', 'historical']) })
    )
  })
})

// ── File-type filter ─────────────────────────────────────────────────────────

describe('FilterPanel — file type filter', () => {
  it('calls onFilterChange with the selected file type', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add file type filter…'), {
      target: { value: 'image/jpeg' },
    })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ fileTypes: ['image/jpeg'] })
    )
  })

  it('shows the file type chip with an uppercased label (part after /)', () => {
    renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add file type filter…'), {
      target: { value: 'image/jpeg' },
    })
    expect(screen.getByText('JPEG')).toBeInTheDocument()
  })

  it('removes a file type chip when × is clicked', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add file type filter…'), {
      target: { value: 'audio/mp3' },
    })
    const chip = screen.getByText('MP3').closest('.filter-chip')
    fireEvent.click(chip.querySelector('.chip-remove'))
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ fileTypes: [] })
    )
  })
})

// ── Uploader filter ──────────────────────────────────────────────────────────

describe('FilterPanel — uploader filter', () => {
  it('calls onFilterChange with the selected uploader', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add uploader filter…'), {
      target: { value: 'Jane Smith' },
    })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ uploaders: ['Jane Smith'] })
    )
  })

  it('shows a chip labelled with "By" for the uploader', () => {
    renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add uploader filter…'), {
      target: { value: 'John Doe' },
    })
    expect(screen.getByText('By')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('removes an uploader chip when × is clicked', () => {
    const { onFilterChange } = renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add uploader filter…'), {
      target: { value: 'Alice Brown' },
    })
    const chip = screen.getByText('Alice Brown').closest('.filter-chip')
    fireEvent.click(chip.querySelector('.chip-remove'))
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ uploaders: [] })
    )
  })
})

// ── Date-range filter ────────────────────────────────────────────────────────

describe('FilterPanel — date range', () => {
  it('calls onFilterChange with the start date when From input changes', () => {
    const { onFilterChange } = renderPanel()
    const [fromInput] = screen.getAllByDisplayValue('')  // date inputs start empty
    // target the date inputs via label text
    const fromLabel = screen.getByText('From')
    const fromDateInput = fromLabel.querySelector('input')
    fireEvent.change(fromDateInput, { target: { value: '2023-01-01' } })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ dateRange: expect.objectContaining({ start: '2023-01-01' }) })
    )
  })

  it('calls onFilterChange with the end date when To input changes', () => {
    const { onFilterChange } = renderPanel()
    const toLabel = screen.getByText('To')
    const toDateInput = toLabel.querySelector('input')
    fireEvent.change(toDateInput, { target: { value: '2023-12-31' } })
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ dateRange: expect.objectContaining({ end: '2023-12-31' }) })
    )
  })

  it('shows a "From" chip when a start date is set', () => {
    renderPanel()
    const fromLabel = screen.getByText('From')
    const fromDateInput = fromLabel.querySelector('input')
    fireEvent.change(fromDateInput, { target: { value: '2023-01-01' } })
    // Now "From" appears both as a date-label and as a chip-kind
    expect(screen.getAllByText('From').length).toBeGreaterThanOrEqual(2)
  })

  it('shows a "To" chip when an end date is set', () => {
    renderPanel()
    const toLabel = screen.getByText('To')
    const toDateInput = toLabel.querySelector('input')
    fireEvent.change(toDateInput, { target: { value: '2023-12-31' } })
    expect(screen.getAllByText('To').length).toBeGreaterThanOrEqual(2)
  })

  it('removing the From chip clears the start date', () => {
    const { onFilterChange } = renderPanel()
    const fromLabel = screen.getByText('From')
    const fromDateInput = fromLabel.querySelector('input')
    fireEvent.change(fromDateInput, { target: { value: '2023-01-01' } })
    // click the × on the date chip (not the label)
    const chips = document.querySelectorAll('.filter-chip--date')
    fireEvent.click(chips[0].querySelector('.chip-remove'))
    expect(onFilterChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ dateRange: expect.objectContaining({ start: '' }) })
    )
  })
})

// ── Clear all ────────────────────────────────────────────────────────────────

describe('FilterPanel — clear all', () => {
  it('calls onFilterChange with all-empty values when Clear all is clicked', () => {
    const { onFilterChange } = renderPanel()
    // Activate a few filters first
    fireEvent.change(screen.getByDisplayValue('Add tag filter…'), { target: { value: 'craftwork' } })
    fireEvent.change(screen.getByPlaceholderText('Search all fields…'), { target: { value: 'basket' } })

    fireEvent.click(screen.getByText('Clear all'))

    expect(onFilterChange).toHaveBeenLastCalledWith({
      tags: [],
      fileTypes: [],
      uploaders: [],
      dateRange: { start: '', end: '' },
      searchQuery: '',
    })
  })

  it('hides the active-filters section after clearing all', () => {
    renderPanel()
    fireEvent.change(screen.getByDisplayValue('Add tag filter…'), { target: { value: 'craftwork' } })
    expect(screen.getByText('Active')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Clear all'))
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })
})
