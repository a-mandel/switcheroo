# Switcheroo

Hands free Claude in Chrome: dictation, read aloud, a switchboard for every Claude tab, and the HQ screen.

Install or update: open [switcheroo.user.js](https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js) with Tampermonkey installed. Tampermonkey keeps it current from this repo on its own. Say "update Switcheroo" to check right away.

## Looks (8.9.3)

HQ comes in three looks: CHxTLD (light), Tron and Retro (a sunset sky over a rolling neon floor). Click the Look tile on the control panel to step through them, click the brand, press Option Shift D, or say "retro look", "Tron mode" or "light mode".

## Boot (8.9)

One click starts everything: Chrome with the Switcheroo settings, HQ, your 10 most recent chats behind it, and the mic ready in the newest one. It also runs when the Mac starts.

Set it up once on the Mac. Paste this in Terminal and press Return:

```
curl -fsSL https://raw.githubusercontent.com/a-mandel/switcheroo/main/mac/install.sh | bash
```

It builds **Switcheroo Chrome** (with the Switcheroo eye icon) in your Applications folder, puts it in the Dock and makes it a login item. Click it any time: if Chrome isn't running the Switcheroo way it restarts Chrome, then boots.

Already running? Say "boot up" in any chat, click BOOT on HQ, or pick Boot in the Tampermonkey menu.
