import type { SummaryReply, UnfoldMessage } from '@/shared/messages'

const statusLine = document.getElementById('status')

const showStatus = (text: string) => {
  if (statusLine) statusLine.textContent = text
}

const describeActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id === undefined) return 'There is no tab to unfold.'

  const request: UnfoldMessage = { type: 'summarise-tab', tabId: tab.id }
  const reply: SummaryReply = await chrome.runtime.sendMessage(request)
  return reply.ok
    ? `Ready to unfold "${reply.page.title || reply.page.url}".`
    : `Unfold cannot run on this page: ${reply.error}`
}

describeActiveTab().then(showStatus, (error: unknown) => showStatus(String(error)))
