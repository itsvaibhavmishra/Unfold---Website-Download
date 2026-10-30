import { judgeNavigation } from '@/shared/url-policy'

const page = 'https://example.com/resources/guide?ref=home#top'

describe('judgeNavigation', () => {
  test.each([
    ['a hash change', '#section-2'],
    ['a query change', '?tab=2'],
    ['the same path with a trailing slash', 'https://example.com/resources/guide/'],
    ['a javascript: link', 'javascript:void(0)'],
  ])('allows %s', (_, target) => {
    expect(judgeNavigation(page, target)).toBe('allow')
  })

  test.each([
    ['another path', '/resources/other'],
    ['another origin', 'https://elsewhere.com/resources/guide'],
    ['a subdomain', 'https://blog.example.com/resources/guide'],
    ['another scheme', 'http://example.com/resources/guide'],
    ['a mailto: link', 'mailto:someone@example.com'],
    ['a URL that cannot be parsed', 'http://['],
  ])('blocks %s', (_, target) => {
    expect(judgeNavigation(page, target)).toBe('block')
  })
})
