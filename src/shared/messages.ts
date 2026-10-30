export type PageSummary = { title: string; url: string }

export type UnfoldMessage =
  | { type: 'summarise-tab'; tabId: number }
  | { type: 'summarise-page' }

export type SummaryReply = { ok: true; page: PageSummary } | { ok: false; error: string }

export const isMessageOfType = <Type extends UnfoldMessage['type']>(
  value: unknown,
  type: Type,
): value is Extract<UnfoldMessage, { type: Type }> =>
  typeof value === 'object' && value !== null && (value as { type?: unknown }).type === type
