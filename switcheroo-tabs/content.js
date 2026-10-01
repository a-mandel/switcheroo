// Switcheroo (the Tampermonkey script) fires this event; pass it to the background so it can switch tabs.
document.addEventListener('switcheroo-front', (e) => {
  const who = (e && e.detail === 'hq') ? 'hq' : 'video';
  try { chrome.runtime.sendMessage({ front: who }); } catch (x) {}
}, true);
