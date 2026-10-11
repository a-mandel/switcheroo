// HQ comes to the front when a conversation starts; the video comes back when it plays on,
// but only if HQ is what's showing in that window, so it never yanks you off something else.
let hqTab = null, lastSwitch = 0;
// the service worker can sleep; keep the HQ tab id in session storage
chrome.storage.session.get('hqTab').then((v) => { if (v && v.hqTab != null && hqTab == null) hqTab = v.hqTab; }).catch(() => {});
const setHq = (id) => { hqTab = id; chrome.storage.session.set({ hqTab: id }).catch(() => {}); };

chrome.runtime.onMessage.addListener((msg, sender) => {
  const tab = sender && sender.tab;
  if (!msg || !tab || tab.id == null) return;
  if ('mute' in msg) { muteTab(tab.id, !!msg.mute); return; }
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

// 1.1: mute a tab while you talk to Claude, for sites whose player Switcheroo can't reach. Unmutes only tabs
// it muted itself, so a tab you muted by hand stays muted.
async function muteTab(id, on) {
  try {
    const v = await chrome.storage.session.get('muted');
    const mine = new Set((v && v.muted) || []);
    if (on) {
      const t = await chrome.tabs.get(id);
      if (t.mutedInfo && t.mutedInfo.muted) return;
      await chrome.tabs.update(id, { muted: true });
      mine.add(id);
    } else {
      if (!mine.has(id)) return;
      mine.delete(id);
      await chrome.tabs.update(id, { muted: false });
    }
    await chrome.storage.session.set({ muted: [...mine] });
  } catch (e) {}
}
chrome.tabs.onRemoved.addListener((id) => {
  chrome.storage.session.get('muted').then((v) => {
    const l = ((v && v.muted) || []).filter((x) => x !== id);
    return chrome.storage.session.set({ muted: l });
  }).catch(() => {});
});
