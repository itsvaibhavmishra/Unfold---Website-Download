import { isMessageOfType, type PageSummary } from '@/shared/messages'

const LISTENING_FLAG = '__unfoldListening'

const summarisePage = (): PageSummary => ({ title: document.title, url: location.href })

// The background injects this on every run, so a second copy in the same page must stay quiet.
if (!(LISTENING_FLAG in window)) {
  Object.defineProperty(window, LISTENING_FLAG, { value: true })
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (isMessageOfType(message, 'summarise-page')) sendResponse(summarisePage())
    return false
  })
}
