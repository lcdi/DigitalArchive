import '@testing-library/jest-dom'

// jsdom may emit "--localstorage-file was provided without a valid path" in this
// environment, leaving localStorage as a broken object. Replace it with a real
// in-memory implementation so AuthContext and api helpers work correctly.
const makeStorage = () => {
  let store = {}
  return {
    getItem:    (key)        => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem:    (key, value) => { store[key] = String(value) },
    removeItem: (key)        => { delete store[key] },
    clear:      ()           => { store = {} },
    key:        (n)          => Object.keys(store)[n] ?? null,
    get length()             { return Object.keys(store).length },
  }
}

Object.defineProperty(global, 'localStorage',  { value: makeStorage(), writable: true })
Object.defineProperty(global, 'sessionStorage', { value: makeStorage(), writable: true })
