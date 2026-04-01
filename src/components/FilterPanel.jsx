import { useState } from 'react'
import './FilterPanel.css'

export default function FilterPanel({ isOpen, onClose, filterOptions, onFilterChange }) {
  const [activeFilters, setActiveFilters] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchQuery, setSearchQuery] = useState('')

  const emit = (filters, dr, sq = searchQuery) => {
    onFilterChange({
      tags:        filters.filter(f => f.type === 'tag').map(f => f.value),
      fileTypes:   filters.filter(f => f.type === 'fileType').map(f => f.value),
      uploaders:   filters.filter(f => f.type === 'uploader').map(f => f.value),
      dateRange:   dr,
      searchQuery: sq,
    })
  }

  const addFilter = (type, value) => {
    if (!value) return
    if (activeFilters.some(f => f.type === type && f.value === value)) return
    const next = [...activeFilters, { type, value }]
    setActiveFilters(next)
    emit(next, dateRange)
  }

  const removeFilter = (type, value) => {
    const next = activeFilters.filter(f => !(f.type === type && f.value === value))
    setActiveFilters(next)
    emit(next, dateRange)
  }

  const updateDate = (key, value) => {
    const dr = { ...dateRange, [key]: value }
    setDateRange(dr)
    emit(activeFilters, dr)
  }

  const updateSearch = (value) => {
    setSearchQuery(value)
    emit(activeFilters, dateRange, value)
  }

  const clearAll = () => {
    setActiveFilters([])
    setDateRange({ start: '', end: '' })
    setSearchQuery('')
    onFilterChange({ tags: [], fileTypes: [], uploaders: [], dateRange: { start: '', end: '' }, searchQuery: '' })
  }

  const hasActive = activeFilters.length > 0 || dateRange.start || dateRange.end || searchQuery
  const available = (type, list) => list.filter(v => !activeFilters.some(f => f.type === type && f.value === v))
  const chipLabel = (f) => f.type === 'fileType' ? (f.value.split('/')[1] || f.value).toUpperCase() : f.value
  const typeLabel = (type) => ({ tag: 'Tag', fileType: 'Type', uploader: 'By' }[type] ?? type)

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="close-btn" onClick={onClose} aria-label="Close filters">×</button>
      </div>

      <div className="filter-content">

        <div className="filter-search-section">
          <input
            className="filter-search-input"
            type="search"
            placeholder="Search all fields…"
            value={searchQuery}
            onChange={e => updateSearch(e.target.value)}
            aria-label="Search artifacts"
          />
        </div>

        {hasActive && (
          <div className="active-filters-section">
            <div className="active-filters-title-row">
              <span className="active-filters-label">Active</span>
              <button className="clear-all-btn" onClick={clearAll}>Clear all</button>
            </div>
            <div className="filter-chips">
              {searchQuery && (
                <span className="filter-chip filter-chip--search">
                  <span className="chip-kind">Search</span>
                  <span className="chip-value">{searchQuery}</span>
                  <button className="chip-remove" onClick={() => updateSearch('')}>×</button>
                </span>
              )}
              {activeFilters.map(f => (
                <span key={`${f.type}:${f.value}`} className={`filter-chip filter-chip--${f.type}`}>
                  <span className="chip-kind">{typeLabel(f.type)}</span>
                  <span className="chip-value">{chipLabel(f)}</span>
                  <button className="chip-remove" onClick={() => removeFilter(f.type, f.value)}>×</button>
                </span>
              ))}
              {dateRange.start && (
                <span className="filter-chip filter-chip--date">
                  <span className="chip-kind">From</span>
                  <span className="chip-value">{dateRange.start}</span>
                  <button className="chip-remove" onClick={() => updateDate('start', '')}>×</button>
                </span>
              )}
              {dateRange.end && (
                <span className="filter-chip filter-chip--date">
                  <span className="chip-kind">To</span>
                  <span className="chip-value">{dateRange.end}</span>
                  <button className="chip-remove" onClick={() => updateDate('end', '')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="filter-section">
          <h3>Tags</h3>
          <select className="filter-select" value="" onChange={e => { addFilter('tag', e.target.value); e.target.value = '' }}>
            <option value="">Add tag filter…</option>
            {available('tag', filterOptions.tags).map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        <div className="filter-section">
          <h3>File Type</h3>
          <select className="filter-select" value="" onChange={e => { addFilter('fileType', e.target.value); e.target.value = '' }}>
            <option value="">Add file type filter…</option>
            {available('fileType', filterOptions.fileTypes).map(ft => (
              <option key={ft} value={ft}>{ft.split('/')[1] ? ft.split('/')[1].toUpperCase() : ft}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <h3>Uploader</h3>
          <select className="filter-select" value="" onChange={e => { addFilter('uploader', e.target.value); e.target.value = '' }}>
            <option value="">Add uploader filter…</option>
            {available('uploader', filterOptions.uploaders).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="filter-section">
          <h3>Upload Date Range</h3>
          <div className="date-inputs">
            <label className="date-label">From<input type="date" value={dateRange.start} onChange={e => updateDate('start', e.target.value)} /></label>
            <label className="date-label">To<input type="date" value={dateRange.end} onChange={e => updateDate('end', e.target.value)} /></label>
          </div>
        </div>

      </div>
    </div>
  )
}
