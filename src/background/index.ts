import {
  isMessageOfType,
  type PageSummary,
  type SummaryReply,
  type UnfoldMessage,
} from '@/shared/messages'

const summariseTab = async (tabId: number): Promise<PageSummary> => {
  await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] })
  const request: UnfoldMessage = { type: 'summarise-page' }
  return chrome.tabs.sendMessage(tabId, request)
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isMessageOfType(message, 'summarise-tab')) return false
  summariseTab(message.tabId).then(
    page => sendResponse({ ok: true, page } satisfies SummaryReply),
    (error: unknown) => sendResponse({ ok: false, error: String(error) } satisfies SummaryReply),
  )
  // Keeps the channel open until the asynchronous reply above is sent.
  return true
})
