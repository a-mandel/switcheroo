# Switcheroo

Hands free Claude in Chrome: dictation, read aloud, a switchboard for every Claude tab, and the HQ screen.

Install or update: open [switcheroo.user.js](https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js) with Tampermonkey installed. Tampermonkey keeps it current from this repo on its own. Say "update Switcheroo" to check right away.

## Outbox (9.1)

The CHxTLD Outbox joins HQ the way Chief of Staff did. An OUT wedge and rail sit on the pie, lit while drafts are ready. Click it and your drafts open over the pie in the Outbox's white mail look. Click one to edit it right there: subject and body save back to the Outbox a moment after you stop typing, or on Save or Cmd S. If a newer version lands while you type, a bar offers Load it or Keep mine, so nothing gets typed over. Copy for Gmail puts the body and your signature on the clipboard. If the Outbox isn't open anywhere, the click opens it in a tab behind HQ.

By voice, in any chat:

- "outbox" reads what's waiting, numbered, and opens the panel on HQ.
- "read draft two" reads that one. Right after "outbox", "draft two" or "read the draft" works too; any time, "read outbox draft two" does.

Nothing sends from HQ. Sending still runs through your spoken gate.

## Chief of Staff (9.0)

Chief of Staff joins HQ. A COS wedge and rail sit on the pie, sized by how many threads need you. Click it and the morning brief and Start Here open over the pie, numbered, each with Mark done. Read it hands the brief to the chat you're talking to. Open board brings the board's tab forward, or opens it behind HQ when it isn't open anywhere.

By voice, in any chat:

- "chief" reads the morning brief and the counts.
- "what needs me" reads Start Here, up to five threads, numbered.
- "done two" closes number two on the board. A plain "done" works when only one was read. These only count for ten minutes after Start Here is read.
- "undo" reopens the thread you just closed, for three minutes.

HQ also gets a fourth look, Night drive, from the board, and takes it once on update unless Retro is already your pick.

## Looks (9.0.1)

HQ has 50 looks: CHxTLD, Tron, Retro and Night drive first, then synthwave floors, green and amber terminals, blueprint, sonar, deep space, design movements, places, paper, metals and more. Click the Look tile on the control panel for the next one, right click to go back, click the brand, or press Option Shift D. By voice: "next look", "previous look", "random look", or a name like "blueprint look" or "night drive look".

## Boot (8.9)

One click starts everything: Chrome with the Switcheroo settings, HQ, your 10 most recent chats behind it, and the mic ready in the newest one. It also runs when the Mac starts.

Set it up once on the Mac. Paste this in Terminal and press Return:

```
curl -fsSL https://raw.githubusercontent.com/a-mandel/switcheroo/main/mac/install.sh | bash
```

It builds **Switcheroo Chrome** (with the Switcheroo eye icon) in your Applications folder, puts it in the Dock and makes it a login item. Click it any time: if Chrome isn't running the Switcheroo way it restarts Chrome, then boots.

Already running? Say "boot up" in any chat, click BOOT on HQ, or pick Boot in the Tampermonkey menu.
