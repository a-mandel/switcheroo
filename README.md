# Switcheroo

Hands free Claude in Chrome: dictation, read aloud, a switchboard for every Claude tab, and the HQ screen.

Install or update: open [switcheroo.user.js](https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js) with Tampermonkey installed. Tampermonkey keeps it current from this repo on its own. Say "update Switcheroo" to check right away.

## Code ears you can see (9.9.18)

The ears opened when Code finished but heard nothing, and nothing showed they were on, so a squeeze closed them. Now Code's mic glows orange while Switcheroo listens, so a squeeze sends instead of shutting it off. The pause watcher goes by words on Code rather than opening a second mic stream beside the ears, the quiet window waits for the AirPods to wake, and every listen logs its sound, words and errors to the trouble log.

## Code ears (9.9.17)

Claude Code's mic opens by itself again when Code finishes. Chrome ignores a scripted press on Code's hold mic, so the old way never took. On Code tabs Switcheroo now listens with Chrome's own speech recognition, the same ears the Swipe Deck uses, and types what you say into Code's box as you talk. No click needed, since claude.ai already has the mic. Pause, "over", send and cancel work as before, and holding Code's own mic yourself still works.

## Solo (9.9.16)

Work with one chat for a while. Say "solo" (or "focus mode") and Switcheroo stays with the chat you're in; "solo Kelly" picks one by name and takes you there. The Solo pill on HQ's rail does the same for the chat you're in, glows while it's on, and names the chat. The other chats keep working, nothing is stopped, but they go quiet: no "needs you" lines, no chimes, no approvals read out, and "next" or a triple press stays on the solo chat (from anywhere else, it takes you back). HQ tiles still change color, so a glance still tells you. Say "unsolo", "solo off" or "end solo", or tap the pill again, and you hear one line: who needs you, approvals first, then urgent, then longest waiting. "Status" still gives the whole board.

## One talker, in order (9.9.15)

Arriving in a chat either reads its last reply, if you haven't heard it, or opens the mic with its cue. Never neither, and no name line in front of a reply you've already heard. A chat that just popped gets 10 seconds to draw before Switcheroo decides. Other chats' "needs you" lines wait for a prompt: they play only in the gap after you send, while this chat works, one line per gap, and the mic doesn't open after them. HQ tiles still change color right away, and this chat's own requests are never held back. The mic cue waits until the AirPods deliver real sound, so a short cue works again, and it's skipped right after a Switcheroo line. "Over" closes the mic in under half a second, said once or twice. The room's noise is learned over a full second, and when no new words land for the pause, the mic closes however noisy the room is.

## Forty voices, and Code's turn (9.9.14)

Mic sound 22, Voices, now speaks in forty ElevenLabs voices instead of two, three or four lines each, and never the same voice twice running. Each line is still made once, so it costs the same credits as before; the set is made fresh the first time the mic opens after the update, with Chirp standing in until it lands. A voice your ElevenLabs key can't use is skipped for the next one on the list. Claude Code tabs now open the mic on their own when Code finishes, held down for you and let go when you stop talking, so no squeeze is needed.

## Claude Code tabs (9.9.13)

Switcheroo now knows the Claude Code page at claude.ai/code. Its mic is press and hold, so a squeeze, F8 or Space holds it down for you and lets go when you finish or say over; if the press doesn't take, Switcheroo holds Shift F10, the mic's own key. Code tabs go green while Claude works and chime when it's your turn, the same as chats, and each tile and "needs you" line uses the session's name instead of "Claude Code". Plain chats are untouched.

## No double read (9.9.12)

A reply that was read along is no longer read again from the top when Claude swaps it for a fresh copy of itself. That swap happened most when HQ wasn't the tab on top. Each reply remembers what was voiced by its place in the chat, not by its page element.

## More voice cues (9.9.11)

Mic sound 22, Voices, now has 155 lines, most of them flirty. The new ones are made once through your ElevenLabs key and play first; then the whole set runs as a shuffled deck, so no line repeats until every one has had a turn.

## YouTube pauses (9.9.10)

YouTube pauses whenever you talk or Claude talks to you, live or not, and plays on in the quiet, backed up two seconds. The Other tabs pill no longer turns YouTube down. YouTube TV and the sports sites still only turn down. A turn down rule set on YouTube before 9.9.10 is cleared once; set it again from YouTube's Tampermonkey menu if you ever want it.

## New chats open the mic (9.9.9)

Landing on a new chat opens the mic within a few seconds, without queuing behind Switcheroo's lines. Only sound that is really playing holds the one voice lock, so a paused reading's Resume button in a background chat can't block every other tab. No line ever plays into an open mic.

## Read once (9.9.8)

Every reply is read once and only once. When Claude writes more after a tool step, the new text is read as it lands instead of going quiet, and anything already voiced, by read along or an earlier pass, is never voiced again.

## Must pass before every push

Every build is checked against this list. A build that fails any line does not ship, and a rollback is a new version on top of main, never a reset, so later fixes are not lost.

1. A plain reply is read once.
2. A reply that runs a tool first, then writes, is read (only the written part).
3. A reply read along while Claude works is not read again when it finishes.
4. Gray tool and status lines, code, tables, paths and links are never voiced.
5. A long reply stops at about 60 words and asks "Keep going?".
6. Saying stop ends the reading, and it does not restart on its own.
7. Only ElevenLabs talks, one voice at a time across every tab and HQ.
8. YouTube pauses while you talk or Claude talks, and plays on in the quiet. Sports sites only turn down.
9. Arriving in a chat either reads the unheard reply or plays the cue, never neither.
10. No needs you line plays before André's first send in a chat, and none is followed by the mic cue.
11. "Over" at the end closes the mic within about half a second, said once or twice.
12. Room noise with no new words closes the mic after the pause.
13. With solo on, no other chat's line, chime or approval plays, and next or a triple press never leaves the solo chat.
14. Unsolo says who needs you in priority order, once, and those chats aren't announced again right after.
15. On a Claude Code tab, the mic opens by itself when Code finishes, with no click, and the words land in Code's box.
16. With solo off, every chat announces exactly as before.
17. On a Claude Code tab, Code's mic glows while Switcheroo listens and stops glowing when it closes.

## Fewer words, fewer credits (9.9.6)

The voice never reads code blocks, inline code, the gray tool and status lines that scroll by while Claude works, tables, file paths, file names, raw links, IDs or code style names. Links read as their label only.

Replies stop after the first paragraph, about 60 words at most, and ask "Keep going?" with the mic open. Say yes, keep going or keep reading for the rest; no, or just silence, ends it. "Read the whole thing" still reads a reply start to finish. Tampermonkey menu, Read cap on or off, turns the cap off.

## Natural voices (9.7.1)

Replies use ElevenLabs' natural model, not the fast one, and reading speed is back to normal. HQ's own lines keep the voice you had before, Annika (ElevenLabs: HQ lines voice by ID to change it).

## One voice everywhere (9.7.4)

Tampermonkey menu, ElevenLabs: one voice everywhere. It lists your ElevenLabs voices by name, you type a number, and every voice Switcheroo uses changes at once: replies, chats outside a mapped project, and HQ's own lines. No voice IDs to paste. Reload your chat tabs after.

## A voice per project (9.7, off by default since 9.7.3)

Replies can read in a different ElevenLabs voice per project, so you know by ear which agent is talking. It ships off: every chat reads in Annika. To turn it on, Tampermonkey menu, ElevenLabs: project voices, then a list like `kelly = VOICEID; walsh = VOICEID`, matched against the project name or chat title.

## Earbud gestures (9.6)

One press opens the mic. Two presses open a new chat in the project of the chat you're in, mic ready. Three presses jump to the next chat waiting, the same as saying "next". Two and three are ignored while the mic is open. Your turn mode is now Option Shift L only.

## Cleaner HQ (9.5.1)

Chief of Staff, CHxTLD and Mandel are pills at the top left only, not cards in the views. HQ opens any of the three that isn't open, behind it, a few seconds after it loads. A reply you already heard isn't read again when another tab or a jump lands on it; say "read it" to hear it again. Outbox drafts: sent ones leave the stack, the chat you're on comes first, then the newest edit.

## One screen for the chats (9.5)

HQ now holds the AirPods press. Minimize or bury the window with your chats and the press still lands: HQ hears it and hands it to the chat that has the floor. When Claude starts reading, HQ takes the press straight back. HQ needs one click after it opens; until then, or when HQ is closed, the chat holds the press the old way.

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
