# Switcheroo

Hands free Claude in Chrome: dictation, read aloud, a switchboard for every Claude tab, and the HQ screen.

Install or update: open [switcheroo.user.js](https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js) with Tampermonkey installed. Tampermonkey keeps it current from this repo on its own. Say "update Switcheroo" to check right away.

## Fits the screen (9.4.3)

The model pills (Sonnet, Opus, Haiku, Fable) now sit in the control panel's header, beside Controls, so they no longer fall off the bottom of HQ. A window too short for HQ scales it down to fit instead of cutting off the bottom.

## Two outboxes, ten looks (9.4)

The **ANDRÉ MANDEL Outbox** is a second outbox for private practice mail, beside the CHxTLD one. It has its own page, its own AMO wedge on the pie, and opens over the pie on its own letterhead. Each outbox keeps its own lane: every relay, save and answer names which one it belongs to, so a draft never crosses over. **CHxTLD** and **Mandel** pills sit beside Chief on the rail with their ready counts, and the panels open under the rail so you can hop between them. Say "mandel outbox" or "practice outbox" for the ANDRÉ MANDEL drafts; "outbox" is still CHxTLD. Nothing sends from either.

Ten new looks. The sketch family now runs by how sketchy it is: Trace (a light pencil), Sketch, Marker (bold felt tip), Charcoal (smudged and shaky), Chalkboard and Funnies (comic ink on newsprint). Five genre looks: Space Opera, Overdrive, Dime Novel, Desert Neon and Bunker.

## Dark to light (9.3)

The looks now run in order of brightness, darkest first and the whites at the end, with each band of dark looks sweeping through the colors so a step lands on a neighbor instead of a flash. A change fades from the old background to the new one.

**Retro Sky** leads the list. It's retro futurist and its sky follows the time of day: violet night, rosy dawn, a pale peach morning, a bright blue noon, golden hour, then the sunset at dusk. HQ moves to it once with this update.

**Follow the clock** (in the Look picker, or say "follow the clock") picks from your favorites by daylight: darkest at night, brightest at noon, easing between. Picking a look yourself turns it off; "clock off" does too. Look numbers changed with the new order; favorites keep.

## Views and looks (9.2)

A pill rail sits over the stage. **View** steps through eleven ways to draw your chats: Pie, Radar, Puzzle, Seismograph, Mixer, Orbit, Lanes, Timeline, Departures, Honeycomb and Treemap. Tap the name for all of them, press Option Shift V, or say "radar view" or "next view". **Look** steps one look at a time either way; tap the name for every look as a tile in its own colors and type, favorites first, with a star to keep one. "Arrows step through" can keep the arrows to favorites. Say "look eight" to jump by number. Two new looks, Sketch and Sketch Night, are hand lettered architectural sketches.

The **Chief** pill opens Chief of Staff any time (Option Shift C). Start Here runs the full height, and every card has Open chat, or New chat with the thread typed in and not sent.

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
