// HQ comes to the front when a conversation starts; the video comes back when it plays on,
// but only if HQ is what's showing in that window, so it never yanks you off something else.
let hqTab = null, lastSwitch = 0;
// the service worker can sleep; keep the HQ tab id in session storage
chrome.storage.session.get('hqTab').then((v) => { if (v && v.hqTab != null && hqTab == null) hqTab = v.hqTab; }).catch(() => {});
const setHq = (id) => { hqTab = id; chrome.storage.session.set({ hqTab: id }).catch(() => {}); };

chrome.runtime.onMessage.addListener((msg, sender) => {
  const tab = sender && sender.tab;
  if (!msg || !tab || tab.id == null) return;
  if (Date.now() - lastSwitch < 1200) return;
  if (msg.front === 'hq') {
    setHq(tab.id);
    if (tab.active) return;
    lastSwitch = Date.now();
    chrome.tabs.update(tab.id, { active: true }).catch(() => {});
    return;
  }
  if (msg.front === 'video') {
    if (tab.active) return;
    chrome.storage.session.get('hqTab').then((v) => { if (hqTab == null && v) hqTab = v.hqTab; })
      .then(() => chrome.tabs.query({ active: true, windowId: tab.windowId })).then((act) => {
      const front = act && act[0];
      if (!front || front.id !== hqTab) return;   // only swap back from HQ
      lastSwitch = Date.now();
      chrome.tabs.update(tab.id, { active: true }).catch(() => {});
    }).catch(() => {});
  }
});

chrome.tabs.onRemoved.addListener((id) => { if (id === hqTab) setHq(null); });
