// Switcheroo (the Tampermonkey script) fires this event; pass it to the background so it can switch tabs.
document.addEventListener('switcheroo-front', (e) => {
  const who = (e && e.detail === 'hq') ? 'hq' : 'video';
  try { chrome.runtime.sendMessage({ front: who }); } catch (x) {}
}, true);

// 9.9.4: a site set to mute asks for its whole tab to be muted while you talk, and unmuted in the quiet.
document.addEventListener('switcheroo-mute', (e) => {
  try { chrome.runtime.sendMessage({ mute: e && e.detail === 'on' }); } catch (x) {}
}, true);
