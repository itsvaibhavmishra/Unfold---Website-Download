export type NavigationVerdict = 'allow' | 'block'

const withoutTrailingSlash = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

/**
 * Whether going from `current` to `target` keeps the explorer on the same page.
 * Hash and query changes on the same path are allowed; another path, origin or scheme is not.
 */
export const judgeNavigation = (current: string, target: string): NavigationVerdict => {
  let from: URL
  let to: URL
  try {
    from = new URL(current)
    to = new URL(target, current)
  } catch {
    return 'block'
  }

  // A javascript: link runs in the page instead of leaving it, which is how many tabs are built.
  if (to.protocol === 'javascript:') return 'allow'

  const samePage =
    from.origin === to.origin &&
    withoutTrailingSlash(from.pathname) === withoutTrailingSlash(to.pathname)
  return samePage ? 'allow' : 'block'
}
