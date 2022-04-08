export const handleSessionStorage = (key) => ({
  get() {
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  set(id) {
    window.sessionStorage.setItem(key, JSON.stringify(id))
  },
})

export const handleLocalStorage = (key) => ({
  get() {
    return JSON.parse(window.localStorage.getItem(key))
  },
  set(id) {
    window.localStorage.setItem(key, JSON.stringify(id))
  },
})
