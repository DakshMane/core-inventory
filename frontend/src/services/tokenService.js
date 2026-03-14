const KEY = 'ci_token'

export const tokenService = {
  get: ()        => localStorage.getItem(KEY),
  set: (token)   => localStorage.setItem(KEY, token),
  clear: ()      => localStorage.removeItem(KEY),
}