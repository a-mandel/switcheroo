// ==UserScript==
// @name         Claude Hands Free Text Mode
// @namespace    andre.mandel
// @version      9.9.5
// @description  Hands free dictation and read aloud for claude.ai, an agenda review player, and the Switchboard: a traffic light tile for every Claude tab, chimes when a chat needs you, voice commands to move between chats, and a squeeze to allow once. 7.9: ballot cards by voice, and Swipe Deck hands free. 8.0: Hold stops every response in every tab until you resume, and screen mode has a control panel. 8.1: Switcheroo. Screen mode (HQ) answers approvals and question cards with a click, runs the Swipe Deck over the pie, glows the sentence being read, and the pie's center plays and pauses everything; arriving in a chat reads its last reply. 8.3: videos in other tabs pause while you and Claude talk, and play on in the quiet. 8.7: HQ takes files and typing, and updates Claude sends mid task are read as they land. 8.8: one model for every open chat, by voice ("all chats to Sonnet") or from the HQ model pills. 8.9: Boot. The Switcheroo Chrome launcher opens HQ with your 10 most recent chats behind it and the mic ready, no clicks; or say "boot up". 8.9.1: "stop, new chat in Alder" works: a lead in no longer hides a command, and new chat finds every project, not just the sidebar. 8.9.2: the mic bell is now the Long bell, struck three times so the AirPods can't clip it. 8.9.3: Retro, a third HQ look: sunset sky, a neon floor rolling toward you, chrome type. Click Look on the control panel, or say "retro look". 9.0: Chief of Staff joins HQ as the COS wedge and panel, and a fourth look, night drive, from the board. Say chief for the brief, what needs me for Start Here, done two to close a thread, undo to reopen it. 9.0.1: fifty looks. Each push of Look steps to the next one (right click goes back); say "next look", "previous look", "random look" or a look by name. And "next, over" heard as "next server" still jumps. 9.1: the CHxTLD Outbox joins HQ as the OUT wedge, and a click opens your drafts over the pie to read and edit; edits save back to the Outbox. Say "outbox" to hear them, "read draft two" to hear one. Nothing sends from HQ. 9.2: a View pill with eleven ways to draw your chats, a Look pill with a picker and favorites, two hand sketched looks, and Chief of Staff one tap away with Open chat on every Start Here card. 9.3: looks run dark to light, so stepping never jumps from black to white, and a change fades instead of cutting. Retro Sky, a retro futurist look whose sky follows the time of day. Follow the clock picks from your favorites by daylight; say "follow the clock". 9.4: a second Outbox, ANDRÉ MANDEL, on its own letterhead beside the CHxTLD one, both one tap away on the pill rail ("mandel outbox"); and ten new looks: Trace, Marker, Charcoal, Chalkboard, Funnies, Space Opera, Overdrive, Dime Novel, Desert Neon, Bunker. 9.4.1: Chief of Staff wears HQ's look; Night drive keeps the board's own. 9.4.3: the model pills sit in the control panel's header, so nothing falls off the bottom of HQ, and a short window scales HQ down instead of cutting it off. 9.5: HQ holds the AirPods press, so the chats window can be minimized. 9.6: double press is a new chat in this project, triple press is the next chat waiting. 9.7: a voice per project: Mississippi Nikola, Walsh Hank, Haynes Jamieson, Kelly Samantha, and Eleanor for any other chat. 9.7.1: the natural ElevenLabs model, normal speed, and HQ's own lines keep your old voice. 9.7.2: mic sound 22, Voices: a woman's voice says one of 24 short lines when the mic opens, a different one each time. 9.7.3: every chat back to Annika; per project voices are off until you add one. 9.7.4: one voice everywhere, picked from your ElevenLabs library by name. 9.9.4: mute, a fourth rule for sites whose player hides from Switcheroo; with the Switcheroo Tabs extension the whole tab mutes while we talk. 9.9.5: the Outboxes open only when you tap their pills, and an ElevenLabs refusal says why and which key.
// @match        https://claude.ai/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        unsafeWindow
// @connect      storage.googleapis.com
// @connect      dropbox.com
// @connect      dropboxusercontent.com
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @connect      *
// @sandbox      JavaScript
// @updateURL    https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js
// @downloadURL  https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js
// @run-at       document-idle
// ==/UserScript==

/*
  HOTKEYS (Mac)
    AirPods squeeze           start dictation (squeeze again to finish and send)
    Say "over"                (4.2) as its own word after a beat: ends what you're saying now.
                              A note saves and the reading picks up; a message sends.
    Squeeze while Claude reads  pauses the reading, takes a quick note into the
                                box without sending, then resumes the reading.
                                The notes wait in the box and go out with your next message.
    F8 (play/pause key)       same as a squeeze; double tap F8 = new chat in this chat's project (9.6)
    F9 (next track key)       new chat in this chat's project (same signal as a double squeeze, 9.6)
    Space (8.5) or Option + Space  same thing from the keyboard. Plain Space only when you're not typing in a box.
    Squeeze, F8 or Space, then "stop" / "abort" / "shut up" while Claude reads: drops that reading (8.5)
    Double squeeze (9.6)      new chat in the project of the chat you're in (outside a project, a plain new chat)
    Triple squeeze (9.6)      next chat waiting, same as saying "next"
    Option + Shift + L        your turn mode on or off: when Claude finishes reading,
                              the mic opens by itself. Say nothing for 8 seconds and it closes.
                              3.4: the Switchboard says what's waiting first, then the mic opens.
                              A soft tick means the mic is really listening; start talking then.
                              4.0: warm mic is gone. Holding the mic open turned every squeeze
                              into a Mac mute button. The script now opens the mic only while
                              you're talking.
    Option + Shift + H        hands free off or on in THIS TAB ONLY
                              or click the pill above the message box
    Option + Shift + A        auto send on pause, on or off (default on)
    Option + Shift + R        auto read aloud, on or off (default on)
    Option + Shift + 3        teach: next click on the SPEAKER button is remembered
    Option + Shift + 1 / 2    teach mic / finish buttons (backup only)
                              Wrong one learned? Tampermonkey menu, Forget learned buttons (4.5).

  SWITCHBOARD (new in 2.5)
    Every Claude tab gets a tile, named by its chat title.
      green    Claude is working. Silent.
      yellow   Claude finished and wants you. Soft chime and "name needs you",
               again every 3 minutes until you visit that chat.
      red      Claude needs approval, or a reply opens with the word URGENT.
               Folder requests (2.6) turn red and announce too, but you allow
               those yourself at the keyboard with Command Enter.
               Sharper chime and the request read aloud, again every minute.
      grey     Idle, parked, or hands free off.
    One tab holds the floor (headphones on its tile). It owns your AirPods, reads
    replies aloud and does all the talking. Other tabs stay quiet and chime.
    Click or type in a Claude tab and it takes the floor.

    Say these as a whole message:
      next                 park this chat and jump to the one waiting longest
      switch to alder      jump to a chat by words in its title, or by tile number
      take me to alder     same thing (6.5). Go to, bring me to, head to and back to work too,
                           and the chat doesn't have to be open: any chat in your sidebar or
                           your recent chats opens right in this tab.
      status               hear the whole board
      read it              read Claude's latest reply here (4.8); also repeat, say that again
      snooze 10            no chimes for 10 minutes (any number)
      go quiet             no chimes until you say wake up
      pause switchboard    no chimes or alerts for your next two messages (7.2)
      wake up              chimes back on
      silence              (8.0) HOLD: nothing reads, talks, chimes or opens the mic, in any tab,
                           until you resume. Also hold everything, responses off, meeting mode, shut up.
      resume               (8.0) ends a hold. Also responses on, back on, meeting over.
      quieter / louder     other tabs quieter or louder while Claude reads (3.4)
      faster / slower      the ElevenLabs voice reads faster or slower (6.6)
      keep reading         the rest of a reply that stopped at the 150 word cap (6.7)
      mic sound 7          pick the sound that plays when the mic goes live (7.0)
      next sound           try the next one; mic sound louder or quieter
    QUESTION CARDS (3.9): when Claude asks with numbered choices, the card is read aloud.
      two, the first one  picks that choice. Its name works too. skip skips it.
      anything else       goes out as a regular reply. End with next to answer and move on.
    BALLOT CARDS (7.9): cards with choices but no numbers, a Submit button, a recommended
      choice or an Other box are read aloud too, numbered top to bottom.
      two, recommended     picks it and presses Submit for you.
      one and three        several picks on a card that takes several; all of them works too.
      other, then words    picks Other, types your words in its box, and submits.
      read it again        reads the card again; so does options.
      Card not heard? Tampermonkey menu, Copy question card snapshot, then paste it to Claude.
  SWIPE DECK BY VOICE (7.9)
    Say "swipe deck" in any chat and the deck opens in a new tab and starts reading. Or in a
    deck tab: squeeze, Option Shift V, or click the pill. Each card is read aloud: project,
    business, how many to go, the question and its context. Then just say
      yes / no / TBD (or hold)   answers it. Add a reason, "no, wait for the engineer", as a note.
      back one                   reopens the card you just answered.
      details                    source and who asked.   repeat   reads it again.
      screen                     moves the card to the Visual deck, for your desk.
      visual / audio             switch decks when one runs out.   stop   ends it.
    Two squeezes stop it too. It only ever answers the card it just read to you.
      new chat in alder    fresh chat in that project, in this tab (3.3). The chat you
                           left keeps its tile in a background tab. "new chat" alone
                           starts one outside any project. End a message with it after
                           a pause to send first.
    End any message with "next" after a pause (or with "next chat") and it sends,
    then jumps to the chat waiting longest. Red chats go first.

    Approvals: after the request is read aloud, squeeze within 20 seconds and
    Allow once is clicked for you. Squeezes during the reading are ignored.
    Voice and squeezes never click Always allow; only a click (two, to confirm) in screen mode does (8.1).

    Option + Shift + N        same as saying next
    Option + Shift + B        board small or full
    Option + Shift + Q        pause switchboard for two turns, or resume it (7.3)
    Tampermonkey menu, Always bring chats forward (4.9): the chat you land on comes to the
                              front even when you're in another app. Works best with each
                              chat in its own window.
    Drag the board's heading  move it anywhere; every tab uses the new spot (2.8).
                              Tampermonkey menu, Reset board position, puts it back.

  QUIET OTHER TABS (new in 3.0)
    While you talk to Claude, any other Chrome tab playing audio or video is turned down,
    and it comes back up as soon as your message goes out. Outside claude.ai this script
    does nothing else. Reload the other tab once after installing so it can listen.
    3.1: while Claude reads, other tabs drop to about a quarter volume instead of silent.
    3.2: reaches players inside embedded frames, like most sports streams.
    3.7: while another tab plays sound, Claude keeps taking the AirPods squeeze back from it.
  FLOOR TAB (3.8): plays a hum too low to hear so Chrome keeps it awake in the background.
    It shows Chrome's speaker icon on its tab, which is a handy way to spot the floor.
    Tampermonkey menu: Quiet other tabs on or off, Quiet them while Claude reads too,
    and Other tabs during readings (10, 25 or 50 percent).

  SCREEN MODE (new in 2.7)
    Option + Shift + M        in a spare Claude tab: that tab becomes a live mirror of the
                              chat you're talking to. Put it on its own screen. It follows
                              every jump and shows your dictation. Press again to leave.
    Option + Shift + = / -    bigger or smaller transcript text on the mirror
    Option + Shift + D        (7.8) light CHxTLD look or dark ANDRÉ MANDEL look, remembered
    CONTROLS (8.0)            clickable panel under the pie: HOLD (or RESUME), then labeled
                              switches for read aloud, mic after reading, auto send, chimes,
                              lowering other tabs and the ElevenLabs voice. Every tab follows them.
    No keyboard: click the Tampermonkey icon, then Screen mode in this tab (or Leave screen mode).
    Option + Shift + 4 / 5    teach the Allow once / Stop response buttons (backup only)

  AGENDA REVIEW PLAYER (new in 2.4)
    When a Claude reply contains a line like
        AGENDA TAKE 2: https://...mp3
        SECTIONS: Intro 26 | 01 Phase 43 | 02 Decisions 80 | ...
    the take loads into a small player above the message box. That reply is not read aloud.
    Squeeze or F8             play. While it plays: pause it and open dictation for a note.
                              The note is stamped with the section and time, like
                              "[03 Scope, 1:12]". Squeeze again, or just stop talking,
                              and the note is saved and playback picks up where it left off.
    End of the take           all your notes go to Claude in one message.
    Option + Shift + P        play or pause the take without taking a note
    Option + Shift + J        back 10 seconds
    Option + Shift + X        close the player (squeezes go back to normal)
    Click the progress bar    jump to that spot

  ELEVENLABS VOICE (5.1): with an ElevenLabs API key saved (Tampermonkey menu, ElevenLabs: set
    API key), every reply is read in an ElevenLabs voice instead of Claude's read aloud. The key
    stays in Tampermonkey on this Mac. Default voice Annika; Jessica if Annika isn't in your voices.
    If ElevenLabs fails, Claude's read aloud takes over.

  5.3: the Mac voice no longer reads replies. ElevenLabs or Claude's read aloud only.
  5.4: with ElevenLabs set up, the Switchboard's own lines (who needs you, approvals, questions,
    status) use the ElevenLabs voice too. Short lines are remembered so repeats cost nothing.
  5.5: auto read works again in chats that used tools. Claude's page labels tool chips
    "Memory: read" and "Web search: 1 site read", and those were taken for Read aloud.
    Read aloud is now found by its own tag, and hidden "Show message actions" buttons
    (which carry your words) are never taken for Send, Dictate or anything else.
  5.6: no more play, pause, play. Auto read waits until Claude has fully finished the reply,
    reads each reply once, and never clicks the button while Claude is already reading.
  5.7: a reply is never read twice. Claude sometimes swaps a finished reply for a fresh copy of
    itself, which looked like a new reply; now replies are matched by what they say.
    Other tabs stay turned down for the whole reading: the volume is pressed down again every
    second, because some players (live sports especially) keep putting their volume back.
  5.8: a command gets caught however it goes out. "next", "switch to alder", "read it" and the
    rest used to work only when the script sent your dictation. Press Enter, click send, or let
    Claude's own dictation send it, and the script still catches it instead of sending it to Claude.
  5.9: a small trouble log. The last 80 steps (squeeze, mic open, what was heard, command or
    message, who pressed send) are kept in this browser so a problem can be traced. Nothing leaves
    the Mac. Tampermonkey menu, Clear trouble log, empties it.
  6.0: one voice at a time. A reply waits for a Switchboard line to finish before it starts, and a
    tab only talks if the shared record agrees it holds the floor, so two tabs that both think
    they have it can't talk over each other.
    Only the floor tab listens, too. A tab that loses the floor while its mic is open cancels that
    dictation instead of sending it, so one squeeze can no longer send the same words to two chats
    or leave a mic open in the background (the "cannot control mic with AirPods" alert).
  6.1: "read again", "repeat again", "read aloud", "read it back" and similar now count as read it.
    The trouble log also notes every reply the reader sees and why it did or didn't read it.
  6.2: the reader skips Claude's hidden "Claude responded:" summary line, which made the first
    sentence of every reply play twice. And "next, new chat in Birch" with nothing before it
    just opens the chat instead of sending a stray word first.
  6.3: whenever the Switchboard finishes talking (who needs you, arriving in a chat, a question),
    your mic opens right after, with your turn mode on. Say nothing for 8 seconds and it closes.
    And the Switchboard never talks over a reply being read: it waits, and a reply waits for it.
  6.4: the mic comes on by itself in more places. Open Claude or start a new chat (sidebar,
    Command Shift O, or by voice) and the mic opens in the tab you're looking at. Every line the
    Switchboard says now ends with the mic open, including status, snooze and the other command
    replies. Your turn mode is now on by default, and all of this follows it (double squeeze
    turns it off). Approvals are the one wait: the mic opens after the 20 second squeeze window,
    so a squeeze can still allow once. It still closes after 8 quiet seconds.
    On a cold start Chrome may not let a tab nobody has clicked take the mic; then your first
    click in that tab opens it. A tab like that also sends by the words landing in the box,
    since it can't hear the mic level yet.
  6.5: "take me to", "bring me to", "head to", "back to" and "let's go to" jump like "go to".
    "open", "pull up" and "show me" do too, but only when the words clearly match a chat title,
    so "show me the plan" still goes to Claude. The chat doesn't need to be open in a tab: any
    chat in your sidebar or your recent chats opens right in the tab you're talking in, and the
    chat you left keeps its tile in a background tab if it was working. End a message with
    "take me to roof study" after a pause to send it first, then go.
  6.6: the ElevenLabs voice reads faster, 1.2 times normal to start. Say "faster" or "slower" to
    step it between 1 and 1.6 times, or "normal speed". The Tampermonkey menu has Voice faster and
    Voice slower too. The pitch stays the same, and it costs no extra credits.
  6.7: long replies stop after about 150 words in the ElevenLabs voice, to save credits. Say
    "keep reading" (or "read more", "the rest", and right after the stop "keep going") for the rest,
    or "read the whole thing" to hear a reply start to finish. Tampermonkey menu, Read cap on or off.
    Read commands also work with "could you" or "can you" in front: "could you repeat that".
  6.8: approvals by voice. Once a request is read aloud, the mic opens: say "allow" (or "approve",
    "yes", "go ahead") and Allow once is clicked, or "deny" (or "no") to turn it down. It still never
    clicks Always allow, and it only works for the exact request you heard. Stay quiet and the mic
    closes; a squeeze then allows once for the rest of 30 seconds. "Allow" keeps working for as long
    as that request is still waiting. Folder requests are still yours at the keyboard.
    Question cards read the real question now, not the first choice's note.
  6.9: folder requests by voice too. "Alder needs your ALDER DOCS folder. Say allow, or deny." Say
    allow and Allow once is clicked for that folder, for this session. A squeeze still never allows a
    folder. Saying "allow" or "deny" in the chat that's showing a request works even before the
    Switchboard reads it. And a message that's only "over" is dropped instead of sent.
  7.0: twenty mic live sounds, all louder than the old tick and leveled to match. Say "mic sound 7"
    (any number, 1 to 20) to hear it and keep it, "next sound" to step through them, and "mic sound
    louder" or "mic sound quieter". The install page plays all twenty. Default is 2, Two tone.
  7.0.1: dictation hears "sound" as bound, found, round or sounds; those count too.
  7.0.2: and "next" as X, ex, necks or text. "Another sound" is the phrase dictation hears best.
  7.0.3: the first word often gets clipped while the AirPods wake up, so any two word message that
    ends in "sound" steps to the next sound ("that's sound", "X sound"), and so does "sound" alone.
  7.1: "mic sound" in any words. Any short phrase made only of mic words (mic, microphone, hot,
    open, Claude), sound words (sound, ping, bell, alert, notification, tone, chime, beep) and change
    words (change, adjust, revise, next, another, new, switch) steps to the next mic sound: "adjust
    hot mic ping", "change Claude notification sound", "revise open microphone bell". Add a number to
    pick one ("mic bell 7"), "previous" or "back" to go back, "louder", "quieter", "turn up" or "turn
    down" for its volume. "Mic sound" alone says which one you have. Any other word in the phrase and
    it goes to Claude as usual.
  7.2: "pause switchboard" holds every chime and alert for your next two messages, so you can talk
    with one chat in peace. It picks back up when the reply to your second message is done, and
    tells you anything that came up. "pause switchboard for 4" gives it four; "resume switchboard"
    ends it early. It lets go on its own after 30 minutes either way.
  7.3: pause without your voice. The board has a Pause button in its heading (Resume while paused),
    Option Shift Q does the same from the keyboard, and the Tampermonkey menu has Pause switchboard.
  7.4: AirPods mishearings of "read again" now read the last reply too: breathe again, breath again,
    reed again, red again, bread again, breed again, freed again, we'd again, lead again, read a game,
    read the game, read against, Reagan, regain, or just "again".
  7.5: replies read start to finish again (the 150 word cap is off; the menu can turn it back on).
    Say "pause" as a note while Claude reads and everything stops, reading, chimes and the mic,
    until you click in the tab or squeeze. A command said after notes waiting in the box, like
    "read it" or "next", now runs instead of going out with the notes. And the page scrolls
    along with the ElevenLabs voice, a sentence at a time; scroll yourself and it waits 6 seconds.
  7.6: after notes, next, take me to and new chat send the notes first, then go. Read it, keep
    reading, pause and the settings commands leave the notes in the box for your next message.
    The optional read cap (menu) is 300 words when on.
  7.7: the pill moved to the left corner above the message box, sits under Claude's own menus,
    and hides while the model picker or any other Claude menu is open.
  7.8: screen mode redrawn flat. The transcript docks on the left with the latest image under it,
    a pie of every chat sits in the middle, load rails with live timers run down the right.
    Two looks, same layout: light (CHxTLD letterhead standards) and dark (ANDRÉ MANDEL).
    Option Shift D flips them. Your turn mode now comes on by itself every time hands free
    does: at every load and whenever a tab's hands free turns back on. A double squeeze still
    turns it off, until the next reload.
  7.9: ballot cards by voice. Question cards without numbers, with Submit instead of Skip, a
    recommended choice, an Other box, or several picks allowed are read and answered by voice
    now, and Submit is pressed for you. Swipe Deck by voice: "swipe deck" opens it and reads each
    card, and yes, no, TBD and back one answer it. Needs the Swipe Deck page from 9/30/26 or later.

  8.0: HOLD. One click stops everything in every Claude tab: replies aren't read, the Switchboard
    doesn't talk or chime, the mic doesn't open by itself, question cards wait, Swipe Deck stops, and
    other tabs aren't turned down. You can still type, and a squeeze still opens the mic, so you can
    say "resume". Replies that land during a hold aren't read later; say "read it" for one.
    Hold from: screen mode's HOLD button, the board's Hold button, the Tampermonkey menu, or say
    "silence", "hold everything", "responses off", "meeting mode" or "shut up". It stays on, even
    across reloads, until you click RESUME or say "resume", "responses on" or "back on".
    Screen mode gets a control panel: HOLD plus labeled switches, all clickable with the mouse.
    Mic after reading switched off there stays off, even after a reload.

  8.1.3: Screen mode fonts are Grid Runner: Orbitron titles, Exo 2 text, Share Tech Mono numbers. Light and dark.
  8.1.2: UPDATE TEST. Screen mode text is temporarily serif to prove auto update works. 8.1.3 puts it back.
  8.2: LINKS AND PAGES ON HQ. Every link in a reply is caught and numbered, newest reply first, and logged in
    the LINKS pill on HQ, kept apart by practice: CHxTLD, ANDRÉ MANDEL, and Unsorted. A chat's practice comes
    from its project name or title (Tampermonkey menu, Links: project words, kept on this Mac only), or click
    its practice in the Links panel to move it. Say "open" for the latest reply's first link, "open two" for
    the second, "close page" to close it; or click a link in the panel. The page takes the right side of HQ;
    the transcript stays on the left, still glowing word by word. A site that won't show inside HQ opens in a
    window docked to the right half (allow pop-ups for claude.ai once so voice can open it). With no HQ open,
    "open" opens a tab. Agents write links as [short spoken label](url), so the readout says the label.
  8.4: SPORTS STAY LIVE, AND VIDEOS KNOW WHO THEY'RE TALKING TO.
    Live streams and sports sites (ESPN, YouTube TV, NBA, NFL, Peacock, Fubo, Kayo and more, plus any
    YouTube live) turn down while we talk; they never pause. Regular videos still pause, and when they play
    on they back up two seconds so you don't miss a word.
    Fewer interruptions: chimes and short Switcheroo lines ("Alder needs you") only turn a video down for
    a moment. Pausing is for real conversation: you talking, a reply or a question being read.
    Your way, per site: on any site, Tampermonkey menu, "Switcheroo on this site" cycles pause, turn down,
    leave alone, and back to Switcheroo deciding.
    Say "video check": it says which video tabs are connected and what each does. On HQ, Quiet other tabs
    and Pause videos are now one switch, Other tabs: click through Pause, Turn down and Off. It shows how
    many video tabs are connected. No tabs connected while one is playing means
    Tampermonkey isn't running on that site: click its icon there and allow it on all sites.
  8.5: ABORT A READING, AND SPACEBAR TALKS.
    While Claude reads aloud: squeeze, press F8 or tap Space (the reading pauses right away), then say
    "stop", "abort", "shut up", "skip it", "cancel", "enough" or "never mind". That reading is dropped for
    good; it won't pick back up. Say anything else and it's a note, as before. "Pause", "hold on" and
    "wait" still pause so you can pick it back up. Away from a reading, "shut up" is still Hold.
    9.4.4: you no longer have to squeeze first. While a reading plays, those words drop it whenever the
    mic is open, whether you opened it or your turn mode did.
    Spacebar alone now does what Option Space does (talk, again to send), whenever you're not typing
    in a text box. Option Space still works.
  9.1: OUTBOX. The CHxTLD Outbox joins HQ, the way Chief of Staff did: an OUT wedge and rail on the pie, lit
    while drafts are ready, and a click opens the drafts over the pie in the Outbox's own white mail look. Click
    one to edit it right there: subject and body save back to the Outbox a moment after you stop typing, or on
    Save or Cmd S. If Claude saves a newer version while you type, nothing lands on top of you; a bar offers
    Load it or Keep mine. Copy for Gmail puts the body and your signature on the clipboard. If the Outbox isn't
    open, the click opens it in a tab behind HQ, so Switcheroo is all you keep in front. By voice in any chat:
    "outbox" reads what's waiting and opens the panel, "read draft two" reads one. Nothing sends from HQ.
  9.0.1: FIFTY LOOKS. The Look tile on the control panel now steps through 50 looks: CHxTLD, Tron, Retro
    and Night drive first, then synthwave floors, green and amber terminals, blueprint, sonar, deep space, Bauhaus,
    Swiss, brutalist, art deco, mid century, Tahoe, Sierra granite, redwood, fog city and more. Each one
    has its own colors, fonts, background and panel shape. The tile shows its number and name; a click
    goes forward, a right click goes back. By voice: "next look", "previous look", "random look", or
    a name, like "blueprint look" or "change the look to aurora". A look's fonts load the first time
    you land on it. Also: "next, over" heard as "next server" now jumps instead of landing as text.
  9.2: VIEWS AND LOOKS. A pill rail over the stage. View steps through eleven ways to draw your chats: Pie, Radar,
    Puzzle, Seismograph, Mixer, Orbit, Lanes, Timeline, Departures, Honeycomb, Treemap (Option Shift V, or "radar view").
    Look steps one look at a time either way; its name opens every look as a tile in its own colors, favorites first,
    and the arrows can keep to favorites. Two sketch looks, hand lettered, black on white and white on black. The Chief
    pill opens Chief of Staff any time (Option Shift C); the panel runs two columns, and every Start Here card has
    Open chat, or New chat with the thread typed in and not sent. "Look eight" jumps to a look by number.
  9.3: DARK TO LIGHT. The looks now run in order of brightness: Retro Sky first, then the darkest looks, sweeping
    through the colors band by band, up to the whites at the end, so a step lands on a neighbor instead of a flash.
    A change fades from the old ground to the new one. Retro Sky is retro futurist and follows the time of day:
    violet night, rosy dawn, a pale peach morning, a bright blue noon, golden hour, then the sunset at dusk. Follow
    the clock (in the Look picker, or say "follow the clock") picks from your favorites by daylight, darkest at night,
    brightest at noon; picking a look yourself turns it off. Look numbers changed; favorites keep.
  9.9.5: NO SURPRISE OUTBOX TABS, AND ELEVENLABS SAYS WHY. HQ no longer opens both Outboxes behind it when it
    loads; an Outbox opens when you tap its pill or say "outbox". Chief of Staff still opens on its own. When
    ElevenLabs refuses, the note now gives the last four characters of the key Tampermonkey holds and
    ElevenLabs' own reason (a missing permission, a bad key), so you can match it against your API Keys page.
  9.9.4: MUTE THIS SITE. Some stream sites bury their player in a frame Tampermonkey can't enter, so turn
    down never reached it. The site menu now steps auto, pause, turn down, mute, leave alone. Mute asks the
    Switcheroo Tabs extension (1.1 or later) to mute the whole tab with Chrome's own tab mute while we talk,
    and unmutes it in the quiet. It only ever unmutes a tab it muted itself.
  9.9.3: BACK TO 9.7.4. Everything from tonight (9.8 through 9.9.2) is rolled back. This is 9.7.4 exactly,
    numbered up so Tampermonkey takes it.
  9.7.4: ONE VOICE EVERYWHERE. A menu item (ElevenLabs: one voice everywhere) lists your ElevenLabs voices by
    name and sets every one of them at once, replies, unmapped chats and HQ's own lines, from a single number.
    No voice IDs to paste, and no three settings to keep in step.
  9.7.3: EVERY CHAT BACK TO ANNIKA. Per project voices ship off. The machinery and the menu stay, so adding one
    back is a menu away (ElevenLabs: project voices), but nothing routes by project until you do.
  9.7.2: VOICE CUES. Mic sound 22 is a spoken line instead of a bell: "talk to me", "I'm listening", "hey baby" and 21
    more, Annika and Jessica taking turns, a different line each time and never the same one twice running. Say
    "mic sound 22" or "mic sound voices". The lines are made once through your ElevenLabs key (a few cents of
    credit) and kept in this browser, so they play instantly after; Chirp stands in for the first minute while
    they're made. "Mic sound 21" by voice works again too; numbers over twenty were being dropped.
  9.7.1: NATURAL VOICES. Replies use ElevenLabs' natural model instead of the fast one, and reading speed resets
    to normal (say faster or slower to change it). HQ's own lines keep the voice you had before, Annika.
  9.7: A VOICE PER PROJECT. Replies read in the voice of their chat's project, so you know who's talking:
    Mississippi Nikola, Walsh Hank Harvey, Haynes Jamieson, Kelly Samantha Easton. HQ's own lines and any chat
    outside those projects read in the Chief's voice, Eleanor. Change them from the Tampermonkey menu
    (ElevenLabs: project voices, ElevenLabs: Chief voice by ID). A voice not in your voices falls back to the Chief.
  9.6: EARBUD GESTURES. Double press opens a new chat in the project of the chat you're in, with the mic
    ready; outside a project it opens a plain new chat. Triple press jumps to the next chat waiting, red first,
    the same as saying "next". Both are ignored while the mic is open, so a stray press never leaves mid
    sentence. Your turn mode moves to Option Shift L only.
  9.5.1: CLEANER HQ. Chief of Staff and both Outboxes are pills only, no longer cards in the views. HQ opens any of
    the three that hasn't reported in, behind it, a few seconds after it loads, so Mandel is there to tap like the
    others. No more double readbacks: a reply heard in one tab isn't started over in another, or when you land back
    on that chat; say "read it" to hear it again. Outbox drafts on HQ and by voice: sent ones leave, the chat you're
    on comes first, then the newest edit.
  9.5: ONE SCREEN FOR THE CHATS IS ENOUGH. HQ now holds the AirPods press. It plays the silent loop, counts the
    taps itself and hands each press to the chat that has the floor, so the chat window can be minimized or
    buried and the press still works. The chats keep awake on an inaudible hum that never takes the press.
    When a reading starts, HQ takes the press straight back. HQ needs one click after it opens before it can
    play; until then, and whenever HQ is closed, the floor chat holds the press the old way.
  9.4.4: STOP MEANS STOP AGAIN. "Stop", "abort" or "shut up" drops the reading that's playing again,
    however the mic came to be open. The abort only ever ran on the one path where a squeeze had paused
    the reading first; once read along and HQ's own voice started reading while the mic was already
    open, the same words fell through to the chat as text, or set Hold, and the reading played on.
    Now a reading in the air outranks everything: those words drop it, and nothing is sent. Away from
    a reading "shut up" is still Hold. Repeats and fillers count too ("no, stop", "shut up, shut up").
  9.4.3: FITS THE SCREEN. The model pills (Sonnet, Opus, Haiku, Fable) move up into the control panel's header,
    beside Controls, so they no longer hang off the bottom of HQ. A window too short for the frame now scales
    HQ down to fit, centered, instead of cropping the bottom.
  9.4.2: "Next, over" heard as "next, or" now jumps too, instead of landing in the chat as text.
  9.4.1: CHIEF WEARS THE LOOK. The Chief of Staff panel on HQ now takes HQ's look: Blueprint gives a
    blueprint Chief, grid and all; Desert Modern, Brutalist or Charcoal give a light Chief in those colors and
    faces; rounded, thick, blocky, cut and art deco panels carry over, and the sketch looks draw it dashed.
    Night drive keeps the board's own look, and only the looks with a floor keep the sunset scene.
  9.4: TWO OUTBOXES. The ANDRÉ MANDEL Outbox joins the CHxTLD one as its own lane: its own page, its own AMO wedge, and
    its own letterhead over the pie (brush A, Tenor caps, graphite on trace). Every relay, save and answer carries the
    lane, so a draft never lands in the wrong one. CHxTLD and Mandel pills sit beside Chief on the rail, with counts;
    panels now open under the rail so you can hop between them. Say "mandel outbox" (or "practice outbox") to hear
    those drafts; "outbox" is still CHxTLD. Ten new looks: the sketch family by how sketchy (Trace, Sketch, Marker,
    Charcoal, Chalkboard, Funnies comic ink) and five genre looks (Space Opera, Overdrive, Dime Novel, Desert Neon, Bunker).
  9.0: CHIEF OF STAFF. The Chief of Staff board joins HQ: a COS wedge and rail on the pie, sized by how many
    threads need you, and a click opens the brief and Start Here over the pie in the board's own look, each thread
    numbered with Mark done. If the board isn't open, the click opens it in a tab behind HQ. By voice in any chat:
    "chief" reads the brief, "what needs me" reads Start Here, "done two" closes number two, "undo" reopens it.
    A fourth look, Night drive, comes from the board; HQ takes it once on update unless Retro is your pick.
  8.9.3: RETRO LOOK. HQ has a third look next to CHxTLD and Tron: a sunset sky over a neon floor grid
    that keeps rolling toward you, chrome headlines, a neon wordmark and faint scan lines. Pick it with
    the new Look tile on the control panel (it steps CHxTLD, Tron, Retro), a click on the brand, Option
    Shift D, the Tampermonkey menu, or by voice: "retro look", "switch to Tron", "light mode". The floor
    moves on the graphics chip, so it costs nothing while you talk; Reduce motion on the Mac stills it.
  8.9.2: LONG BELL. The mic bell kept losing its start while the AirPods switch over to the mic. New sound 21,
    Long bell, strikes three times and rings about three seconds, so enough of it always gets through. It
    replaces your mic bell once on update; "mic sound" still steps through all of them.
  8.9.1: NEW CHAT, HANDS FREE. A command after a lead in counts: "stop, new chat in Alder", "wait,
    next", "okay so take me to Cedar". Only moves count this way (new chat, next, take me to a chat that
    exists, boot, status), so a message that starts with "stop" or "no" still goes to Claude. "New chat in"
    finds every project you have, not just the ones the sidebar shows; when it has to load the page, the
    new chat takes the floor, says its name and opens the mic by itself.
  8.9: BOOT. One click on Switcheroo Chrome in the Dock (it also runs when the Mac starts) opens Chrome on
    claude.ai/new?switcheroo=boot. That tab becomes HQ, opens your 10 most recent chats as tabs behind it
    (any already open are skipped), and hands the floor to the newest one, which says Switcheroo is up and
    opens the mic. No clicks. Already running? Say "boot up" in any chat, click BOOT on HQ, or pick Boot in
    the Tampermonkey menu. A boot HQ replaces an older HQ, so there's only ever one.
    No click needed to talk: Switcheroo Chrome lets sound play without a click, so every chat it opens can
    talk and take the AirPods straight away. In Chrome opened the plain way, a chat still needs one click.
  8.7.1: ONE MIC GRAB PER DICTATION. Every finish used to take the mic right back: Claude's finish button
    lingers a beat after it's clicked, and a new listener started on it the moment Claude let the mic go,
    so the mic flapped on and off and a stray listener could press finish on nothing. Now a listener starts
    only when dictation really starts, lets go as soon as dictation ends, and the message box emptying after
    a send no longer counts as you talking.
  8.7: HQ TAKES FILES AND TYPING. Drag files onto a wedge or a rail and they land in that chat's message
    box; drop on the center or anywhere else and they go to the chat you're talking to. Paste an image
    or a file into HQ, or click + to pick one. Type in the box under the transcript and press Enter or
    SEND; Shift Enter is a new line. The TO chip shows where it goes: it follows the floor, or the wedge
    you last dropped on (click it to go back to the floor). Each chat tab needs 8.7, so reload open chats
    once after updating.
  8.7: READ ALONG. While Claude is still working, each update it sends you is read as it lands, not
    held for the end. When the reply finishes, only what wasn't read yet is read, then your mic opens.
    HQ pill: Read along.
  8.6: HQ AND YOUR VIDEO TRADE PLACES. With the small Switcheroo Tabs Chrome extension installed, the HQ
    tab comes to the front when you or Claude start talking, and the video you were watching comes back
    to the front when it plays on in the quiet. Put HQ and the video as tabs in the same window. Turn it
    off or on from the Tampermonkey menu: "HQ and video trade places".
  8.3: VIDEOS PAUSE WHILE WE TALK. YouTube or any other player in another tab pauses the moment you
    start talking or Claude starts reading, and plays on after about two and a half seconds of quiet,
    so it fills the gaps while Claude thinks. Only what Switcheroo paused comes back. Press play yourself
    mid talk and it's left alone. HQ pill: Pause videos (off turns them down instead, the old way).
    Say "pause videos" or "turn videos down" to switch.
  8.1.1: UPDATES ITSELF. Tampermonkey fetches new versions from github.com/a-mandel/switcheroo on its own.
    Say "update Switcheroo" to check now: a newer one opens Tampermonkey's update page, and one click on
    Update installs it. A new version is also announced once, on its own.
    THE TRANSCRIPT GLOWS WORD BY WORD. ElevenLabs sends a time for every character, so on HQ the word being
    spoken lights up and glows, spoken words settle to full ink with the glow trailing off, the rest of the
    sentence waits half lit, and the panel glides along line by line.
    COMPUTER ACCESS BY VOICE. A card asking to control the computer or its apps is read aloud: "Alder wants
    control of Notes and Finder. Say allow and the app name." Only "allow" plus an app's name allows it, for
    this session. A bare allow, yes or squeeze never does; Always allow stays a click in HQ.
    A SPOKEN QUESTION LISTENS FOR ITS OWN ANSWER. Approvals, folders, computer requests and question cards
    keep the mic open in the tab that asked, using Chrome's own speech recognition, so the answer is never
    typed into a chat. A squeeze within two minutes of the question listens again. "Allow" or "deny" said
    anywhere while a request waits answers that request and is never sent to Claude.
  8.1 FIX: with a ballot card open, "read again", "pause" or any other command said into the card's
    Other box ran as the command instead of going out as your answer. Every phrase is checked against the
    command list first; only a choice number, a choice name, "recommended" or "other, then your words"
    answers a card. Submit, Enter and form submits are held back while the card's box holds a command.
  8.1: SWITCHEROO. The Switchboard is now Switcheroo and screen mode is its HQ.
    Landing in a chat (next, take me to, a click on a rail) reads its last reply right away; no more
    "read it again". On hold, or with read aloud off, it doesn't.
    HQ answers with a click: a panel over the pie shows the waiting approval with ALLOW ONCE, ALWAYS
    ALLOW (a second click confirms, since it sticks) and DENY, for any chat; or the floor chat's question
    card with every choice as a button (several picks, then SUBMIT, on cards that take several).
    Swipe Deck on HQ: the deck is a wedge and a rail (SD). Click it and the cards stack over the pie,
    skinned per practice: CHxTLD in letterhead orange, ANDRÉ MANDEL in the living set standards. Buttons
    answer, cards fling the way they went, and Voice starts the read aloud review in the deck's tab.
    "Swipe deck" by voice uses a deck tab that's already open.
    The transcript follows the voice: the sentence being read glows, its paragraph gets a keyline,
    earlier ones dim, and the panel keeps it in view. Scroll yourself and FOLLOW appears; click it or
    say "follow".
    The pie's center is play and pause for everything (the same as HOLD). Hold it down for meeting mode:
    nothing talks, replies still land on HQ as text, and the center reads MEETING.

  PAUSE LENGTH: change PAUSE_MS below. 3500 = three and a half seconds of quiet.
*/

(function () {
  'use strict';

  // ---------- every other site: turn this tab down while you talk to Claude (3.0) ----------
  // This is the only thing the script does outside claude.ai: it lowers the volume of audio
  // and video here while you dictate to Claude, then puts it back.
  if (location.hostname !== 'claude.ai') { runDuck(); return; }
  if (window.top !== window.self) return;   // the Claude side runs only in the main page
  function runDuck() {
    if (typeof GM_addValueChangeListener !== 'function' || typeof GM_getValue !== 'function') return;
    // 8.4: a quiet mark that Switcheroo runs on this page, so a check can tell when it doesn't
    const VER = (() => { try { return GM_info.script.version; } catch (e) { return 'on'; } })();
    try { document.documentElement.setAttribute('data-switcheroo', VER); } catch (e) {}
    const TOP = window.top === window.self;
    // the site you're on, even from inside a player's frame
    const SITE = (() => {
      try { if (!TOP && location.ancestorOrigins && location.ancestorOrigins.length) return new URL(location.ancestorOrigins[location.ancestorOrigins.length - 1]).hostname.replace(/^www\./, ''); } catch (e) {}
      return location.hostname.replace(/^www\./, '');
    })();
    const saved = new WeakMap();   // media element -> its volume before we turned it down
    const ytSaved = new WeakMap(); // YouTube player -> its own volume (0 to 100) before we turned it down
    let isDucked = false, stamp = 0, level = 0, lastTold = 0;
    const BEAT_ID = Math.random().toString(36).slice(2, 9);   // 8.4: this tab, when it reports in
    let beatAt = 0, beatSig = '';
    // players can sit inside frames (this script runs in each one) or inside shadow roots
    function media(root, out) {
      root = root || document; out = out || [];
      try {
        root.querySelectorAll('video, audio').forEach((m) => out.push(m));
        root.querySelectorAll('*').forEach((el) => { if (el.shadowRoot) media(el.shadowRoot, out); });
      } catch (e) {}
      return out;
    }
    // 8.4: live sports and live streams stay live. They turn down while we talk; they never pause.
    const LIVE_SITES = /(^|\.)(espn\.com|tv\.youtube\.com|nba\.com|nfl\.com|mlb\.com|nhl\.com|wnba\.com|mls(soccer)?\.com|peacocktv\.com|fubo\.tv|paramountplus\.com|foxsports\.com|fox\.com|foxone\.com|dazn\.com|sling\.com|nbcsports\.com|cbssports\.com|kayosports\.com\.au|afl\.com\.au|watchafl\.com\.au|fifa\.com|plus\.fifa\.com|twitch\.tv|kick\.com|directv\.com|stream\.directv\.com|hulu\.com\/live|telemundo\.com|tudn\.com|globoplay\.globo\.com|ge\.globo)$/;
    let rules = {};
    try { rules = GM_getValue('chf_site_media', {}) || {}; } catch (e) {}
    GM_addValueChangeListener('chf_site_media', (n, o, v) => { rules = v || {}; beat(true); if (isDucked) enforce(); muteTab(isDucked); });
    const siteRule = () => rules[SITE] || 'auto';   // pause, lower, mute, ignore, or auto
    // 9.9.4: mute. The top page asks the Switcheroo Tabs extension to mute the whole tab, so a player in a
    // frame we can't reach still goes quiet. Only the top page asks, and only when the answer changes.
    let tabMuted = false;
    function muteTab(on) {
      on = !!(on && TOP && siteRule() === 'mute');
      if (on === tabMuted) return;
      tabMuted = on;
      try { document.dispatchEvent(new CustomEvent('switcheroo-mute', { detail: on ? 'on' : 'off' })); } catch (e) {}
    }
    function ytPlayer(el) {
      try {
        if (!/(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$/.test(location.hostname)) return null;
        const p = el.closest('#movie_player, .html5-video-player');
        if (!p) return null;
        if (typeof p.setVolume === 'function') return p;
        const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const q = w.document.getElementById(p.id || 'movie_player');
        return q && typeof q.setVolume === 'function' ? q : null;
      } catch (e) { return null; }
    }
    function isLive(el) {
      if (LIVE_SITES.test(SITE)) return true;
      if (el.duration === Infinity) return true;
      try {
        const yp = el.closest('#movie_player, .html5-video-player');
        if (yp) {
          if (yp.classList.contains('ytp-live')) return true;
          const b = yp.querySelector('.ytp-live-badge');
          if (b && b.offsetParent !== null && getComputedStyle(b).display !== 'none') return true;
          const p = ytPlayer(el);
          if (p && typeof p.getVideoData === 'function') { const d = p.getVideoData(); if (d && d.isLive) return true; }
        }
      } catch (e) {}
      return false;
    }
    // what Claude's side asked for: pause videos, or turn them down; and what's happening (talk, read, line)
    let gmode = 'lower', kind = 'talk';
    function actionFor(el) {
      const r = siteRule();
      if (r === 'ignore' || r === 'mute') return 'ignore';   // 9.9.4: mute works on the whole tab instead
      let how = r === 'pause' || r === 'lower' ? r : (gmode === 'pause' && !isLive(el) ? 'pause' : 'lower');
      // a short Switcheroo line ("Alder needs you") never pauses a video; it only turns it down
      if (how === 'pause' && kind === 'line') how = held.has(el) ? 'keep' : 'lower';
      return how;
    }
    function lowerEl(el) {
      if (el.paused || el.muted) return;
      const p = ytPlayer(el);
      if (p) {   // YouTube's own volume, so its player doesn't put it back
        try {
          if (!ytSaved.has(p)) ytSaved.set(p, p.getVolume());
          const want = Math.round(ytSaved.get(p) * level);
          if (Math.abs(p.getVolume() - want) > 1) p.setVolume(want);
          return;
        } catch (e) {}
      }
      if (!saved.has(el)) saved.set(el, el.volume);
      const want = Math.max(0, Math.min(1, saved.get(el) * level));
      if (Math.abs(el.volume - want) > 0.005) { try { el.volume = want; } catch (e) {} }
    }
    function restore() {
      for (const el of media()) {
        const p = ytPlayer(el);
        if (p && ytSaved.has(p)) { try { p.setVolume(ytSaved.get(p)); } catch (e) {} ytSaved.delete(p); }
        if (!saved.has(el)) continue;
        const v = saved.get(el);
        saved.delete(el);
        try { el.volume = v; } catch (e) {}
      }
    }
    // 8.3: PAUSE VIDEOS. Playing videos pause while you talk or Claude reads, and play on again once it
    // has been quiet a moment. Only what this script paused comes back; press play yourself mid talk and
    // it's left alone until the next quiet. 8.4: and it backs up two seconds, so you don't miss a word.
    let resumeTimer = 0, resuming = 0;
    const held = new Map();            // players this script paused -> when
    let mine = new WeakSet();          // players you started yourself during this stretch
    const RESUME_MS = 2500;            // the quiet that counts as downtime
    function enforce() {
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = 0; }
      for (const el of media()) {
        const how = actionFor(el);
        if (how === 'ignore' || how === 'keep') continue;
        if (how === 'pause') {
          if (el.paused || el.ended || el.muted || mine.has(el)) continue;   // muted hover previews stay as they are
          held.set(el, Date.now());
          try { el.pause(); } catch (e) {}
        } else lowerEl(el);
      }
      beat(false);
    }
    function resumeAll() {
      resumeTimer = 0;
      resuming = Date.now();
      for (const [el, at] of held) {
        if (!el.isConnected || !el.paused || el.ended) continue;
        try { if (Date.now() - at > 3000 && isFinite(el.duration) && !isLive(el)) el.currentTime = Math.max(0, el.currentTime - 2); } catch (e) {}
        try { const pr = el.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (e) {}
      }
      const played = held.size;
      held.clear();
      mine = new WeakSet();
      beat(false);
      // 8.6: the video plays on, so ask the Switcheroo Tabs extension to bring this tab back to the front
      try { if (played && GM_getValue('chf_tabswap', true) !== false) document.dispatchEvent(new CustomEvent('switcheroo-front', { detail: 'video' })); } catch (e) {}
    }
    function resumeSoon(ms) {
      if (!held.size || resumeTimer) return;
      resumeTimer = setTimeout(resumeAll, typeof ms === 'number' ? ms : RESUME_MS);
    }
    function apply(v) {
      const on = !!(v && v.on && Date.now() - (v.ts || 0) < 20000);
      stamp = (v && v.ts) || 0;
      gmode = v && v.mode === 'pause' ? 'pause' : 'lower';
      kind = (v && v.kind) || 'talk';
      if (on) {
        // a video that was paused for a reading and now only needs turning down (or the reverse) changes over cleanly
        if (!isDucked || level !== (typeof v.level === 'number' ? v.level : 0)) restore();
        isDucked = true; level = typeof v.level === 'number' ? v.level : 0;
        enforce();
        muteTab(true);
      } else {
        if (isDucked) { isDucked = false; restore(); }
        muteTab(false);
        resumeSoon(v && v.resumeMs);
      }
    }
    GM_addValueChangeListener('chf_duck', (name, oldV, newV) => apply(newV));
    try { apply(GM_getValue('chf_duck', null)); } catch (e) {}
    // if the Claude tab vanished mid message, don't leave this tab silent or paused
    setInterval(() => { if (isDucked && Date.now() - stamp > 20000) { isDucked = false; restore(); muteTab(false); resumeSoon(0); } }, 3000);
    // 5.7: some players put their volume back on their own; keep it down while ducked
    // 8.3: and in pause mode, a player that started itself (autoplay, next in queue) pauses too
    setInterval(() => { if (isDucked) enforce(); }, 1000);
    // don't leave YouTube's saved volume turned down if the tab closes mid talk
    addEventListener('pagehide', () => { try { restore(); } catch (e) {} });
    // an audible player can grab the AirPods squeeze; tell Claude so it can take it back
    const audible = (el) => !el.paused && !el.muted && (el.volume > 0 || saved.has(el));
    function tell(force) {
      if (!force && Date.now() - lastTold < 3000) return;
      lastTold = Date.now();
      try { if (typeof GM_setValue === 'function') GM_setValue('chf_media', lastTold); } catch (x) {}
    }
    // 8.4: video tabs report in, so "video check" and HQ can say what's connected and how it behaves
    function beat(force) {
      try {
        const ms = media().filter((el) => el.currentSrc || el.src || el.srcObject);
        if (!ms.length && !held.size && !(TOP && siteRule() === 'mute')) return;   // 9.9.4: a muted site reports even when its player hides
        const play = ms.find((el) => !el.paused && !el.muted) || ms.find((el) => held.has(el)) || ms[0];
        const live = play ? isLive(play) : LIVE_SITES.test(SITE);
        const b = { id: BEAT_ID, site: SITE, title: TOP ? String(document.title || '').slice(0, 80) : '', live, rule: siteRule(),
          playing: ms.some((el) => !el.paused && !el.muted), held: held.size, ver: VER, ts: Date.now() };
        const sig = [b.site, b.live, b.rule, b.playing, b.held].join('|');
        if (!force && sig === beatSig && Date.now() - beatAt < 10000) return;
        beatSig = sig; beatAt = Date.now();
        if (typeof GM_setValue === 'function') GM_setValue('chf_media_beat', b);
      } catch (e) {}
    }
    setInterval(() => beat(false), 3000);
    document.addEventListener('play', (e) => {
      const el = e.target;
      if (!el || (el.tagName !== 'VIDEO' && el.tagName !== 'AUDIO')) return;
      if (isDucked && actionFor(el) === 'pause') {
        // a play we didn't make while you talk is you pressing play: leave it be
        if (Date.now() - resuming > 1500 && navigator.userActivation && navigator.userActivation.isActive) { held.delete(el); mine.add(el); }
        else if (!mine.has(el)) { held.set(el, Date.now()); try { el.pause(); } catch (x) {} return; }
      } else if (isDucked && actionFor(el) === 'lower') lowerEl(el);
      if (audible(el)) tell(false);
      beat(true);
    }, true);
    // 3.7: players that start muted and unmute later never fire play again
    document.addEventListener('volumechange', (e) => {
      const el = e.target;
      if (!el || (el.tagName !== 'VIDEO' && el.tagName !== 'AUDIO')) return;
      if (audible(el) && !isDucked) tell(false);
    }, true);
    setInterval(() => { if (media().some(audible)) tell(true); }, 10000);
    // 8.4: this site, your way. Tampermonkey menu on the site itself
    if (TOP && typeof GM_registerMenuCommand === 'function') {
      const NEXT = { auto: 'pause', pause: 'lower', lower: 'mute', mute: 'ignore', ignore: 'auto' };
      const SAY = { auto: 'Switcheroo decides: videos pause, live and sports turn down', pause: 'Videos here always pause while you talk to Claude',
        lower: 'Videos here always turn down instead of pausing', mute: 'This whole tab mutes while you talk to Claude (needs Switcheroo Tabs 1.1)', ignore: 'Switcheroo leaves this site alone' };
      try {
        GM_registerMenuCommand('Switcheroo on this site: pause, turn down, mute, or leave alone', () => {
          const r = NEXT[siteRule()] || 'pause';
          const all = Object.assign({}, rules);
          if (r === 'auto') delete all[SITE]; else all[SITE] = r;
          rules = all;
          try { GM_setValue('chf_site_media', all); } catch (e) {}
          note(SITE + ': ' + SAY[r]);
          beat(true);
        });
      } catch (e) {}
    }
    function note(text) {
      try {
        const t = document.createElement('div');
        t.textContent = text;
        Object.assign(t.style, { position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff',
          padding: '10px 16px', borderRadius: '8px', font: '14px system-ui,sans-serif', zIndex: 2147483647, pointerEvents: 'none', maxWidth: '80vw', textAlign: 'center' });
        document.documentElement.appendChild(t);
        setTimeout(() => t.remove(), 3500);
      } catch (e) {}
    }
  }


  // ---------- screen mode (2.7) ----------
  // Press Option Shift M in a spare Claude tab, ideally in its own window on another screen,
  // and that tab becomes a live mirror of whichever chat holds the floor. It follows every
  // jump, shows your dictation as it lands, and never talks, chimes or takes the floor.
  // Everything it needs lives inside this function, because the rest of the script never runs there.
  const MIRROR_KEY = 'chf_mirror';
  let mirrorTab = false;
  // 8.9: BOOT. The Switcheroo Chrome launcher opens claude.ai/new?switcheroo=boot. That tab becomes HQ and opens
  // your most recent chats behind it. The flag comes off the address right away, so a reload doesn't boot again.
  const BOOT_KEY = 'chf_boot';
  try {
    const bootRe = /[?&#]switcheroo[=-]boot\b/;
    let nav = '';
    try { nav = ((performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {}).name || ''; } catch (e) {}
    const inUrl = bootRe.test(location.search) || bootRe.test(location.hash);
    if ((inUrl || bootRe.test(nav)) && !sessionStorage.getItem(BOOT_KEY + '_done')) {
      sessionStorage.setItem(MIRROR_KEY, '1');
      sessionStorage.setItem(BOOT_KEY, String(Date.now()));
      sessionStorage.setItem(BOOT_KEY + '_done', '1');
      if (inUrl) history.replaceState(history.state, '', location.pathname);
    }
  } catch (e) {}
  try { mirrorTab = sessionStorage.getItem(MIRROR_KEY) === '1'; } catch (e) {}
  if (mirrorTab) { runMirror(); return; }

  function runMirror() {
    // 8.6: when a conversation starts, ask the Switcheroo Tabs extension to bring this HQ tab forward
    try {
      let frontAt = 0;
      const swapOn = () => { try { return GM_getValue('chf_tabswap', true) !== false; } catch (e) { return true; } };
      GM_addValueChangeListener('chf_duck', (n, o, v) => {
        if (!swapOn() || !v || !v.on || v.kind === 'line') return;
        if (o && o.on && o.kind !== 'line') return;              // already talking
        if (Date.now() - frontAt < 1500) return;
        frontAt = Date.now();
        try { document.dispatchEvent(new CustomEvent('switcheroo-front', { detail: 'hq' })); } catch (e) {}
      });
    } catch (e) {}
    // @@SCREEN-START
    // 7.8: screen mode redrawn flat, from Switchboard Styles 25. Transcript docked on the left,
    // a pie of every chat in the middle, load rails on the right. Four looks, same layout:
    // light is the CHxTLD letterhead look, dark is the ANDRÉ MANDEL radar look (Tron), retro (8.9.3) is the
    // sunset over a rolling floor, and night (9.0) is the Chief of Staff night drive look. Option Shift D steps through them.
    // Colors and type live in SM_THEMES, so graphic standards can be swapped in one place.
    const SM_HUD = { hf: '"Orbitron","Rajdhani",Arial,sans-serif', bf: '"Exo 2","Barlow",Arial,sans-serif',   // 8.1.3: Grid Runner, André's pick from Switcheroo Fonts
      mf: '"Share Tech Mono","SF Mono",Menlo,ui-monospace,monospace' };
    const SM_ARIAL = { hf: '"Orbitron","Rajdhani",Arial,sans-serif', bf: '"Exo 2","Barlow",Arial,sans-serif',   // 8.1.3: Grid Runner in light HQ too. Was Arial (letterhead)
      mf: '"Share Tech Mono","SF Mono",Menlo,ui-monospace,monospace' };
    const SM_NIGHT = { hf: '"Syncopate","Orbitron",Arial,sans-serif', bf: '"Barlow","Exo 2",Arial,sans-serif',   // 9.0: Chief of Staff faces
      mf: '"Barlow Condensed","Share Tech Mono","Arial Narrow",sans-serif',
      rf: '"Barlow Condensed","Rajdhani","Arial Narrow",sans-serif', rs: 24, rl: 1.6 };   // rail names in the condensed face, so they read in full
    // 8.9.3: Retro, wide arcade headlines over the same body and number faces
    const SM_RETRO = { hf: '"Audiowide","Orbitron",Arial,sans-serif', bf: '"Exo 2","Barlow",Arial,sans-serif',
      mf: '"Share Tech Mono","SF Mono",Menlo,ui-monospace,monospace' };
    const SM_THEMES = {
      // CHxTLD, from the letterhead: white ground, black Arial set in bold caps for headings,
      // brand orange DE6A2D for the tagline, bullets and keylines, the cube logo up top.
      light: { id: 'light', label: 'CHxTLD', look: 'CHxTLD', tag: 'CHxTLD', brand: 'ch x tld', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAABwCAYAAADCOeYzAAAntklEQVR42u2dd5iV1bX/P+u06TN0ERTQiF1BRVRk6KKIvSQxMdHEX/QaExNzvale470xpui14M1NNDESYyc2FFBEBBEBRVGx00Sk9yln2jln/f7Y6/W8HKcyc4YZeNfznGfmnLftd+/93avsVURVCSiggPY+CgVdEFBAAbg7DYlIHxHZPxjegPZliuxloC4AegEbgXAwvAEF4N47gN0F2A/4TFWr7LdcVa0OhjmgfZFkbzCoiUgPoIuqLq/nWL6qxoOhDigAd+cDdlegSFU/C4YzoIDSFOrkwO4CFDQFbNPFAwooAHcn4tglqvp5U+eqaqWI5AXDHVAA7o4L6Dyfjt1NVVe34PLAWyegANwdFdiqWiUivQ3YK1pyvapWB9w7oH2JOpVBTUT6A/mq+mEwdAEF1Ek5t4j0EJHJIvKC/d/TdOwPW3nfgHsHFIB7DwJ7IjAfGAEUAAuBU1X13dbe20T7/GDoA9rbKdLBQJ0L3AqcD1wP7ASWAeOAP4tIjqo+1gYAD5xaAgo4dzsCe5hx6IHASFV9FOgKVKnqX4DvApNE5Ldt9LxAPA8oAHc7APtG4Ang76p6hqquEJHuQFRV14pIF1WdAZwCnCEiz7QWnCaeBwAPKAB3lkB9uIgsACYAp6nqJBPNAaKmbwNUm4/4SmA4UAssFJHDWiuhB1MgoADcbQ/sa4CXgJdV9RRVfc84qhfFlQeUe6eratyAr6p6MfAMMFdEzmkF9w72vgPaaymyB0B9APAn4BDgUlV9uYFTS4Atfg7rAV9EilT1RhFZAtwnIn9U1Vt3VzwPpkFAAeduPbAvAeYBm4GhjQAboKcH7syYbFUtF5ESVX0KGANcLSL/aEW7gq2xgAJw7yZ4ikTkfuD3wI9U9f+pamUTl/UCtjfCcXcaB18KnAgcKCKvi0jflgLWRP4A4AEF4G4hsMcCi4Ei49ZTfUazxigfqGgClOVmaNuqqmNwW2mviUjpbuxlp4LpEFAA7uYD+1ZgMnC7ql6kqhvrE7MboFqgSYB6IBaRQlW9FrgFmGoGu5bo3tUB9w5ob6JIlkA9GPgrUAmMUdVlLclnJiL74ZxXyloAzgrbD79HRD4AHhCRo1T1+y0VzwMPtoACzl0/MP8DeBZ4QlVHqeqyFnBrv75dZ/fLbQE4d4hIsarOwzm8HCcisyyxQ7NvE0yLgAJw7wrqQ0RkFnAxcJ6q/r4VtysBdmuLSlXLRKRAVTeo6inAemCxiBzfzOuDwJKAAnD7gH0ZMBtYqqpDVfXNVt4y39O3dyc1saVVyjU9/FvAn4GZthXXXPE8N5geAe2zOreIdDPgDAauVNXn26hdOcCa1tzA5/BSrKq3ici7pocfqar/2ZzXC6ZHQPsk5za3zzdwVu2TVfX5NuR2RcCmtriRieklqjoTGAacKyLTRaQwEM8DCsD9ZWBfCdwL3Kiq31LV7bsrQtdz7y64VEpb2+olzeGl0AJPhpo+v0hEDm9KPA+mSED7DLiNm10LXKGqD2WBu+V67WpLvde2ynJxQSgXAlNwgSdnNfG+QWBJQPsM5z7S/r6WJe5WCOxordrQkB5u4naRqt4E/BC4X0R+1YR4HgA8oH0C3GOBNzxRPAvUDRdYAllyCfUFnjyOCzy5TEQeaeySYKoEtC+A+zRgSRbb1BPY2lY6fBN6uBd4MhToboEnA+rj+EFJooD2anCLSC8Tm1/NYpt60UTASBtz8DygWlXHm6qxwIJdMs+tDKZLQHsz5x4D1KnqW1luU7tZqVW1yjhzoar+GPgl8LiI/LCexS3QvQPaa8F9AvB+thpjom8VUNbeHWHW9GJVvR84E/h3Ebk3cyEIAB7Q3gruE4GpWWxPN5MM9oj7pzm8FKrqItPDjxGR+SKyvx/gwbQJaK8Ct2Ua3R9YmsX2dAcS3iP3RIcYB89T1U0WePIe8LqInJwhYQQU0F7DuUcDb6nqmiy2pwvOnXWPgdvPnS267CrgNmC6iFxhxysDgAfU0aklgSNnkV0rObhc5dvs/z2e9shAXKSqd4nI+8BkCzz5dzuWF4jpAXVqzm1BFt3aAdz5wDoDVnVH6CDbLitU1Vm4BBAjRWSmOcEEwA6o04vlw+3vm9lqiBnQuvg4d4ch08MLTCUZjrPmvy4ixwZTKKDODu5hwKdZ5lS5QIGqlnfEjvISQAAhVb0IeASYIyLXBtMooM6scw8F/p7ltuQBNR4X7yhieQbAvQQQhap6k1U8+YeI9FXVnwXTKaBOBW4r/3Mw2fUnBygmHTDSobOgmJheoqrPiMgpwPMiUmWRZgEF1GnE8lLgYy+LaRZpP9IVRkIdveMs8KRYVT8EfoHbTQgooE4F7nOAt9uhLV+UD+osQRq+vOo72QNFFQMKqLXg7gMsaoe2FOKKGHRG2gKkgpxrAXUanVtESoEC4JV2aEuKdgr1zAKtB6qBHsBnHaFBInKoqToJG+dqVX0jmPJZ7fOugJcfP2n9/r6qrs/iM/sCR5B2+ooAS1R1c1Oi5EnA2paU9WlFp9Sq6uZOOq7bcBVSenUUcJsd4HJc+GwOsEJEhrVl4smAvkSDgOm+7zHgUuChLD5zInAPLppScFvK5wJTmwL3qcDT7dApPbBURp3RpdOs5+ACazoK1VqfVpn6VWvcJKD6GUwRcDoQtn6LGgf8oIV9HvepvFFb9LNJdfapssUkYVJkw2K5iPQ0dn9jO/RtF9LRYJ1tUniLUQI4oIPZU8QmWNS+hwIYN0i9cRVp8w2kOTb3P2jhfcKGq5T1v7TDOEcN2BH7SFM690nAGssxlm0qIG1M62zJCL32luPyv3UUCvvaFyR4bJqSvjlYbf1X09K13sCm9cyPrPEXX/vDmahviM7ajVWrpVwv3ydafOYzCHRGWosrYNjhhIsMTh5QwxwwksEFQ63s8/YeZ2kuuAcCC7ME6lzTVeNmTPuGieae/lrYWQrx+dxk1+G87DqqdBEAu3kS2F4j6UQaAN9gm6gvZgsQInIgLoSyJ/A8MEhEjgJmqeoqj7N3opI+a3AFETv65A2oYSxIBtPrbDYKbRLcpm+XqeqWLHDtgXb/brjiBo9nLCpni0glMNsH8gIg1cGt6GvsnTqaOC4BsJtFcV8/JX26997FuXExy8+2MaiPxm2tJYC3/TW8LVa6UlXfBt4WkaHARBGpM5Av6wQg3wp0sYCSna3opxKgP3AYzgklinPuWQ6sVNXVu7ma12u5NWeXY4ED7af1Nj4fZUkl62vtiFjbwsD25lSwMRtNb5tDnuEqoqorWtGeQ6wtx/q4t4eLo6x/cnAWdO+5m1ozxs1oUwEwADga5yFag/OCXGqxDA3p99IouO3GQ4G/tFFDh1sj60zkXuEfLFWNe77kNngpVX0dlwzhGOBCEdkOvKyqn3RgkO/EudCW2P8t7achwCXA2QbqAna1flYBZVZn/EHgX81UWTxQp/z3E5ELgR/gHC9KfCKoAjtE5G1gkqo+3cb99GvgIpuwnhHrMxE5XVU3NWGnecwYhLdnX2i/Xbmbc7ML8E/gKNJbhR5Aas0WdIFvgUzgjG03AP+bpYXvcpsHB9gciPikiTIR+RC4Q1X/laE6JOvTf3f5ACOAeUBR5rHmfmyyjMRVA70Y6JdxvKCJ6wsyvg+xe10NDPSf19S92usDdAU+AgbvxnWTjDurLYI1uK21nfbZgcv+UmODqMACoLSR+06283baPZfZswqAf9gxb/tnCy5op8yeG/cZlu5q437qB6w0oJTbMxX43yau+4m38NhCVwt8AuzXirYUA4vtfbdYf8Tt/nFr3w6cB2KZnZMArmngfqfaOMZ94/nVZrblAusXtYW4xqTBTdaG7daeOjvnPrvuUvte5hu301W1XrH8XJw/bPlurDxd7QUHmA76gKru8HFltQoflU0Y3DI5+WJgsYgMAk63cj+zMzi57knjm6puN1tBSQv66zDjwkMMZJU2sEmcM0XMtyrXkvZGSpjdYrqI/ExV/68RndsTfeP2d7Jxzm3G+fLsWX69M2yTJQVcKyIVqvqrNuqnz0TkeuBRa2PSJu0VIvKUqr5UTz8dh3MoqSbt9RUGrlbVja1oTtgWvDz71PqOhew3P6Ua+L21HPsXwG+s7yvsGTUN2HC8efJdm29raMBhpj5wHwU80cLGDTBLcV/gQ2CyqlbYsTxcTez4bkyEuN2jUFUrVPUd4B0zvI03kL+iqu/7QL4nQ0Y34Vxpm9tnz5huXW4TLQkU2Smf2v3UQDjAuG6NDeZO3PZhc/K4qS06j+Pi83faxPkUWO1TKQ4xzlpG2pUxjqu+Ml1V57cRwJ8UkYeBy2wyR3A+0beKyMh6GMtt1v4d1q4i4A/1LQQtpGrgb6bH98H5dngLTh7wLjDHZ5Sssd8XtiGwfwjcYnPAc3v1JLr3TBpcbWMxBDjOxq7M1KpKe49Io2I58BXgrUwxuhFRYiDwTdN5hmUcywfy21ikywfyfN+PAn4EXAMcmSGu57ejSJ5nf+9vSGSr55oXbDDLbXB22vcXTJXZ33duEXAycJcNqieaP9vI/f/hE8vjPjE8gXMY+j7QJ+Oa/sAddl6VTWZPbH6gjftsf2CFPaPSxE4F/ivjvJ/7OJonjr+WhTHsb4tHpQ9oP2vhPVoklptty1O34vZJARuBfwMK67lmMPCUr08q7R5VmWJ55oWXAPOb8RLHmeL/XeDYxgCYJTAVAbm+70cbwK8BjsnmAtMEuP8A3NqM8y/L0B8rbYB/1oxrjzd9+wOgZzN0bk+H9p7xGnBIE8+42SZZuW/CrW6NftvAcy60xabSZ2coB072zbMdvmO19n1wFsbwCFtgqnwL7Q1ZBvczds5264NaW/COb8az7skY36qmdO5SGnBcMfF6kH1qgbmqujLDyp5sD73XconnWj71pKq+B7wnIkcCI0TkVBPXP2hn6/p2W2ia2ua42vTGiP0tAn6uqn9oxru/JSITzeC5uZlbYJg4uwG4pBnbaTeb9PAVm3QRE137G1dpq3F8QkT+DnzPuE/YpK7fiMgFwO1m9Kq0Y1HgF7Zl2taU9PWbZPRhNra7jjK81ZEO7KkBvtucKrqqepVt0w03yS+WaTGvD9zXZzSi0GT9I0wHnO6VFLLtiYjpw+2q5/qzo1obEwbmD0TkcGCYiIwAFnqToTX6fxNt8RaNHTQd9jnIxDGv/YXAS80Btu9522g6v3vSB+6E6Yr3N2ef3DwInwJ+ZnOk2q7vkYWhvBFXGrqPfa8xFeQlWyhrfUas51X1z9maUu1snznd9Ortto+eazsGc1twj//GxY+HrZ/C9YLbjFQJ4A373h2Xr7wfzm/6kQzLNx3FNdRnvPM49EfAR7ayDbMMpQtVdYkP5JEs5EjfYkauxmikAc7j3Ar8Txa6JeX7GzaAzmzB9W/7wBa1e8SyMHYbROTntl9dTjpg40Rrs7dIbbXtMLII7vYE+JH2N2rzYQfw1xb23csistiYRaoxa/lE4HUgJCLftFX6XeBBzxunA1ijm3rZygwV4RPgExE5GBhjlToXeWKPLVLShu+zmaaD84f5/o+ZjrU4G5JfxlbYOrOON5e2+dqYtE8oS+P2LxF5EPi2ATzm27rzbCc/r8c7Kxvgbq8Am36+xTcft/387m7cZ7qJ5pWZW3SRjEk3ABgPvOuP4xaRYhN7O0tWUj/I1WwDK0XkIGC4iAwD5tnWWluCfDOgItK9kXRGPXyDGgI+zFJ6qcxJWmNGl+aSt+cb8gE7m8UZf2Yqy5E+EdPbkvqrqt6d7WnTiL2irfXtElNDUr4+3l133/etvTmZB/zgXmjs/Trg7yISAlaYPl1GJyQfyAtNXF8FrBKR/mZ4G4orS/ymT1wPe2L+btAmG7BeJkbWRxHfxAmxq+NENknaYNJnc6w2WCXVQaSTJHii5pvsXRQ1HdvbmqSR+dIUVVk/JTLVppCvc3+D20O7G5gATAFeEJFbRWSE5Ziik4K8wmLHCyxIZbWq/hO3M3CYiPybiAw277kKEcmzBaGlz9liHd2YUc1zH4za4Hbv4N3XHqmCEJHvAF8nbZ2HdDaUW8y6nPWp0k596uVa81Jggdsl2B2KNDQ+kYzJuRZ4AHhARHoA55mY/n+4vNzTcB4781vB3ToCJ/cMgp8Cn1rJpNGmk79lgSu7y8lTOE+9hmgjaS+oFC6O/RBVXZ5lTq2tmOyhLAP7UJyXVsIn/nu2ggTOSPknEZmQxe1Mv84tWZ6HZSKyHrcb4PXtEbt5u8NJR8hpvZy7Pi6kqn9T1a/izPY34/Y97wZeFJG/iMg4i6zpbCCPZ3Dyz42TTwMOEpHvi8jxu8nJq2k8l9rCDD24GzC2HbiRtvL6bNJduH10zxiZY5xMjQFV4HYZfp7lfqovB1q2aBnpaL0KkyAH7sZ9JpLOkU6zwJ3J0VX1cQP6SQbwQlw006sicpeInGWGgk7Fya00b6GFn65R1ceAJ4FDReR7InKSD+S5zVBPNtH4dtgimzwxn879HyYpZYNzq2+cUy2c7OrjopoNDi4i1wFn2AQX49ZrgedIW+pzTFy/XkRGZmk6eH2TrOe3bNg63vFJKgmcofXfWth3pTifgOr6xia0G4DYrqoPq+qlwCjgV9aw24DZIvJXA3rXTqiT54tIkapuUNVHcQkrDhCRq0VkiKpWm3dcXiMg/7wJcL+Fq5ga9oH7YOCe5uaNE5HDReTOZpYvkjaYnFkRVS3K7yYzCoV9RqEbVPVs6ysvUULEzvlTFhZCD8jeroD3rtnMiTcNlxgjgtsKqwauEpEzm9l3Jbg4AI9JJGlBgsTmgGKTqj6jqt/EOR383gbgFmChiNwjIhd1Fo5u4nq5gbzQQP4E8C+gv3HyUuPk5Q2I66saA7ftPPzZN5nDuL3dC4BHmhLNRGQ8rlDEj+w+2Rbns7UdlAfcidvq8qy9xcA/TUUCF/UUNwDUGACOBH6bhSZ5PuEhn8p0fn1qZ1sk71TVdbjoyxxb3Dwbwz9F5KtN9N3+uJDZ40m75oa/pE5kKZCim+kC9+PC1pZYY86hkWCHjvaxFbXQ9723gfAqYGjGuT3t70Sci25zo8J22KT1Ag0+t8XxBHted1wKpHNwXlwVvusUuLeB+99POoi/Fhdo0rUF715KOqijwjjDhW3Yt9f73sOLdFuFLxrOzruGdIhrLek4829kYbwfJh2M4fXzI/gCZoDTzKhc2szAka818rzeuPRZnvXci5CrwXmrnYQvaQpuF+Zy3J64N7ZeWG6lb5H4clRYlgCSC5yPS0vzLi57xn24FDa9OgnICzJA3hUX0XQlMLyeAX6dJiLjgIMMcF5UkDdAlb4Jts7AvoH0FloV6Swtigv/y2sGuN8Huu0GuOM+cF/URv15HG5f11vUvDZObOD8R3zv4k3+z4GD23icz7R+3u4DWgoXIvuUGUO9yKtZrQW3XTPWnhO39/Mv9JXAx8YIXjVbhBe6643JVpsT1b62ndEu4K4n/dI4XLja28bVp+Ayg/TpJJzcv5L2NI56FTDCfhtAE+GYvusP9hnYPA7ppfbxQgC9OlBezHOFT4z9n0bufb8NvjdRlwJdWvCuXrRRmd2jti04ty32C+29dvoWqbsbuaavj8N5/ZOikXj2VrTvXtJx8F4IasJnXPTSLSlwaT3g9q7bbv1/cTOeeY7vnh7IPaAnfAbNct/9FVfs8To7x5szSWB8u4O7npeaYEaBd23w/mliR59OwMlLMr6PtZV/NM5f/LAW5PH6o2/A6nyrsDfIVb5BrjGxcGIT9/W4XbX9Xd5Czj3Crkv47vG1Nui7O3yT2CtWuJgmcvbZdmw1u+YYU+DGto7NB/7uk5S8cdhh4+AlyliKxZ1nSDteGiyvfd9o5nMH4SLhNENCq8b5+Zf7di52mNERXPiwZiwEExvKodaeBqwZwAzzAR9sovoPbGtoGS4t0AIvf3lH2kLLMK4U2sr7VeCnPqA2y6EB+KkFTlxqE6QPzoXVS6vkJcpbAjyuqi8049YrDTReCp51tKzKZ6WpF97ec9S4UWuMaCcad3uVdLbRFHB9UxF6qvqCiPw3zrGqmnTqo9Ei8qiXT68NxrYKl59sOi7O/Bgbi5SNw2ozaN5TTzrmuPWZt3+d09w+sziHsSJyPi6A5gh7bswk3s2ma79mz/ZKfW20bTUvQjNm0h1i6O9QZLnRxtr+ZwnOt3gO8Ix50e3JthXjnHlOsYEfgPMSKjMR+z1c5NmiVjxjgBlbuthArQM2dpbAnUbeK9cfh99J2nywjXES2NzCkr6teW4PXHKMIltY1zSUS76hyjwdEtwZDR+KS/801PbTl9nW1HyvWEGWn3+graKDDdADTWSqMlF3tnHUVZ2o9FFA+wB1eHBnAG0kzg1xogH9fWAWMNX8xFvNWcyKPcQWk4PM6JVjDhVLfZx5bTB9AgrAnR2gH4+LIhqKq9CxwrYr5jVX/xKR/YwrH4lz4xvkM1hsMFVgAbDay0ITUEABuNsX6ENwrrDnmZ66zIA51W+MszjuQcb9v4LbYulm4vUCM1i82R7ifkABBeBuOdCPxDmYDDeDxKc4x5lhOEviNpzl8R1cPPfyRrKmBBRQAO4OCvTjcPujXUxXfsefPiqggAJwBxRQQJ2OQkEXBNRRacpE6f3z05oXUXj9ICnoqO9x6QQpbo/n/OmrUiiTJ+cG4A6o44L6FDlm+ii5r2sZd/XbxklNnf/kBdJrSDGTZp0px3S0d7nvcCm6ZCeTXhwuJ2e1z34ieV1Wc/O8yd85OQB3QB2Svl8qXbvl8LuCMCu6F/KD77+pTRZS6L0BeuVxcH41HS6JZ/QAYvkx9i+JtX1BBz9tv+ME6V3IIZGcdMLNyJ5+ecsmEsG52MVwDiMxXPRQxD7eb15KWC9rpHddnu/aHPvulWjpioukeQ/nxvkZbt96YwCljkfnxDhIhMjIWXpLc69ZOoDUoeuIp7KbV323qHsNKQ1Tl0hk9zlX6uL4jNFSU1n+RVroL4PbtpIqSdeX8sDlASvHB5wCO6fQB8B8+0R9gPXK0YR9v/uPx3yAzvWB00ut05aLUA3wmYiswm2JrcB5nn0EbFHVDQHEGqanzpfurObcrsLUdUWMKxBG5NVSpl158vTnXNZYgAeGy8WFuXwa3klZQT4/WBtn0WVv6IMAT4yWC2sSnFiiRJPCy+fM0+cA7hsh3zwsyoRipfCl0XLrTqGsJs69lyzUjdNOk4k5MCJZQUFNiu01JTxx8UxXA65oOsnq40hFooSnjpELwilOjyrxSB3PjnlNZzf2PnNGSY/tNXw9WswRqWrKErVMuWCBvvXTw6Xo0AK+Fu/FM9fO2LVoxMPDZXh1DUXffUNnAMw4TcZSx/hQmMKaOMsSJTx2wfO6HqA2h1BOHZGKBEyS7sV9Ttl2eXQ495/7x10DZZ4bKeesLmfHNW/pKwCPD5HTcvM4LSnkpIRFF87Vh3cR94dJ//4RvpuM06W2J2t61PIIIRLdu6eLE9QHmvG4JAQHky7fGiNd18oDajZF+syMnUnqj7LyMlY2VApG6rlnFOcfPjDjWDlQLSKrSSeVWGOflZYWZ5+nFSspHtKNy2sinFGwlYWRHKbGijgmUcYt00bKbyfO1ZcBeocZUSz8eGseH9cKq1IRPgCYOlZuzUnQJT+PKTkhcitq+PaMMXLQhNl6N0nKa4UddXlEtZZtyTp2rFlO/L5S+dZ+Ub4mSV7MibA6LByXG+d3c0fKtSPn6rJthxLqFyNUneRHyTre6RbiuXiEfinlhpfGSq+xL+mj9eqpl0nfohR35EVZmYgyJaeKvuRw84wJ8oc/fqRzZ4yXCwtriJKRzqprLt+vDDEf4LlS+XpOhCuSKR6SFOuK8jkjXsHtz42V6896Sdfmh9FQglQsQqKWbcmiHC5MLmAlLgEkAIsmSHEszNUlUf4XYOYouS6vhJFdwjy4tZYteXDJ9OFy6Jmv6k0Aj58uh/SHu8hlaSTK85VlHLJVuKlLDn3Ly9nZILhV9U4RmQr8Jy70LIQLkvCfm6L5WTFlN45JE39bS6mMBcSr11SMC7M7MQP4K0VkDS7k7xNcoolluDDM7ftSwEihUBsGYlEWnf6W3m4/Pz99jOzITXIN8DJALEathCmrgV9dMMdxsZkjZHxEGHDmPL3Yu9/GS2TRknX86YlSmXbFfJ36r1NlnSQYOG62/s47568T5OWqfkw96x71Ju7Tc0bIPfEqhgHLtuSTJEVujvD+uHn6RX61l8bKJynlp08OktkXvKObMt8ldxXfSUX45MzZeoP328Lxsq08ziXAXAlxf3Utlzx4rTx06SRXdWf2GBkWTlFyUJwHXy2VrtEoV0SUm0975YvqnDOfHy23S4KrgBvXfA4DeqOJWiLXq1a+eLY8KxVc7Ad3VQUTNUrFpYt02tzz5YhUHaPzD+F7pX/7QnWcM3O0PPboeVL69ad1XlENV0fDvDNypv7Su8fsETJe4LbK2nQFm3rFXaut9R0ReRT4NS4aqtbH+do6aV59ubWzmRg+lPFsL3tk0icpeOeFcK6qX8m4h5cW6XMReRuXDmcDLhXOWlx8d3lnC3FsigqKiVVDXdU2V8d98uWSe/lkra6rYVokwrnTzpPBE5/Wt6WWkooQz13wiq6fM0pyR83R6qRwYkGYnZNK5YTcJDk1SiKvDg7MJz8aZQCwsksXemicmvtOlaIr5jvR9Xsz9HOA34yRw/rWcmCogsRBJRQToyvAUb2IxrdQ27WAabvouwfyxsbVVBV14xhcIoRdKD/McTlR5v15kBwXjZK/MUrVkTmE84SDHz5MenzjY338hZHy7f3eYRwu3TV1Cb6mEeacsFh3TiuVMyJC2ejZu5bdrROezxGuAqiIkkopIW/CFcSYEk9w2vTxcuqZM3U+QDLMeZLiCYD4ekZHCognV3LAnwdJn6oo0dxtVB/Sj3D+Ng4G5kmSgclu3LbLuPRj4fZ1fFpA2qjYqC5rAfJzcWmE/h2XqK+OdH7ptgai7IH5mvAtWl5tqpCvPV42Ei/1bYp0CZee9jnOd7+NuDRLy4FnRWR2Z4/D3oXb5ROTWqqiW10V0Msnu8UrlqAiHCNZu91NrpoISbFSOaPmuHMKYxQkEvQlTmkoTKo2QrIqRE0xTKvszzIASVCjCVI9PvaJz+fKkV03c93hUXaUVbO+ro5toRi98hPOAt3bGVLqdpaxS027p6eTOOkIkrk5X05RPOlSKR4SI7eshsGpMIlwmKKSFGWbK8jtnsvkb3ysWwAiBczQSi4CnlxwmhyTTHJQfj53AJSF6NM7lRaDPSoRdtRA9JpeUjjqSBIh0BxxSS+GPaGrZw2XeaEk3wbmzzhVxkfzyC2whakgRkzD9F2zjTPqlB2RPEJSQOUmWByKMe+ms6XHSVGkMGfXdz3pQS2bPk4qc0Jpo2KThirjPHeJyDPAL3FpkCIG8jC7Jr+XTgJqf9reSD1qhpeEzqs+UV9t6mozyH2Ii+f+3ET2D3CJFcrZC6lnFKmroaCkPz2Bz5+9SfLPvknjmwroeYCSX1jOeuvhVEx3LQYfT1IWgWXXvql3NnT/bTXUlYSR7Welry3cwtWJCGsvHs3vucktFC+NlMOqbfFY8C7VQ/oQ7ZnP/sCSN8+W/BOe1fi3x1KwbCN5G3ayMvM51z6oZbOHS2WokGnXzNEpDbVnTSFP9Ilz7owJcmw4yenhHJaOet6FF+dGWE+Kngt+Inmn3J4uc1RXw34SI/GnTVoxaaAUd+0Pdcn0+9QV8Qhx7n3jW3J0OMJZiVqmnzrLzZedETYVJ/j80sVab/rme4dIfjiP2vh6egNsuE0Kel+vlWu/Ld1zlB6VobS1vNlGMVX9VFWvxPlqv2KczquWkMz4256FzP2ATPmAmfIdT2b8xSd+e232uHM4Y4cghgsBXYLLQnk7LnlEKTBYVUeq6o9V9TZVnaqqy/dWYAMklNpolJwdLiUWZ9/k7A0HK1fUJVk16i1X8yyWICSW7ucLQ0eIF+pCnDBrnIzzflvwE8l75AQZc+8I2R9A6pB8JVXwUnqSRiOES3JIecB+bJQcnRtjdDTkShJ3KSSUG0K3JfjOU+dL9xOedW1auZVvppTKGa/zcb3bJlHmhGv55pxR6SIHL42Vvg+NkRHe98sf1w2hEC8W13JLCE5J5fCQd6zP/syvq6GmZimXeb99OE66p4TLaoWZAOvzCEeSqH8nbMIMXZEb43U2cncUeperE/kBVu/HnJoaur5WKhf52/rkCBlzw0HS/8rFGq+K8UooxGXrhkh+7+udVPjhKr5aGOLAcknP7xZvManqy8DLInINLvf0AONifg6cov0cZCSD24Z9HDfl++uvKBHKUC28fqgwIH9iFvOVuKiyD3B745Xs47R9O9GeeewIC3WPnSq/65Zga003jooqXSUvXcur3K2MuyTvnzBLl8wYIfcm4boZY+SMymo250Y4OpZDda88/hsgHCIUVyJ8Jc3ptlbzgMb47Quj5A+1ddTk1ZErxezc6fHKfuRv30KiWPg0tpb/erpU1uTl0i8nweEov57cgN2j9kT+Ka/TLxXi79PGyiJNEg2FOClWxQJjYABsXs5DvQ/h4lSKGRNmpNMsnfSglk0ZJTcXJ7hxTqkcvSPFZzkRhhLik4FH8TDA8GOgaj1SG9sVD5t28JAUcDZRplw8K73V9oNHdN0zw+QWjfGrmWNlRJWwKU84PBwit3cxvwTQIv5RVcah7+Yz+aMRsqQSutQmiEuKNcW+Pm9V4IiI9MUVTb/KOFwd6aJkoXYEuN8AlmxggclcyCoMxBtxe92LcZld1gdZVhqmx0fIQYUh7iyp4+pNdRSGIgyPdKWq7n1mnPdpOqHFb46XI4prqPzR+/pZ5j1mDZd+lfkMq6kmp2cBn4+eoV8Yu6ZMkJ5rN3PwjxfvmoPu2bOlX2ItQyRGdEsJL+ZUUVJRhVz9hq6cc5PkLp3CsT98X19/fowcVV7FCalcksXK3AlznDGuMXq5VE7ammJgNIzGYnwwYZYuyTznzokyuKiYTVc88uUt0ZnXS6/aNxhZVUVBJMrH58/XBf7jd5wix6/awvJJy3atcz+pVE7IrWL5lYv1S3r7kyNk/9h2Tg53oSAhbIoUsHDCjF2vf2acjMtNMbCsgKUXP6uv3jlAjqg6jk2/eMqFMLdJVJilP7oZF0PtpYPNIXsecJqxpZVqxJLvJfpfg0u0uAznpbYc+Djgxi2j1y6UwyvLuXsbXPe1mfpe0CMdl9oEfKo6FygVkauMkx+UISa3pU4tPqkgXA83Xm7Grc9w+9FvA+sCbtw2tPFT6jRGdSjvi5THAe3N4PaB/B7L9/wTXM7nAtIVGv2OKPXp5JlGMX8bvXM9MJcZkNfgEhcuw+0tLwNWWC7wgLJA/c5m/TvPcEPPY1kT9EbHpqwlaxCRYbjyrKcZYOtMbG6II4cyjuMD8grjxKtwfuBLgLWqX/Y6CiiggLIMbh/IvwPcgPNV92pc1acbx0nnN3vTQLwaZ7H+TPXLRoeAAgpoD4LbAN4H+CGuVFAhbrvpY9w20zr7/11cgEYQihlQQJ0F3D6Qn4xLJ7zagLwtGIKAAtoLwB1QQAG1H/1/kzXpzbE4gCkAAAAASUVORK5CYII=', f: SM_ARIAL, v: { bg: '#ffffff', bg2: '#f6f6f6', panel: '#ffffff', line: '#d9d9d9', ink: '#000000', mute: '#5c5c5c', accent: '#de6a2d', need: '#de6a2d', wait: '#eb9a6c', work: '#000000', idle: '#c4c4c4', glow: 'rgba(222,106,45,0)', grid: 'rgba(0,0,0,0)', glowc: 'rgba(222,106,45,.5)', glowc2: 'rgba(222,106,45,.22)', glowbg: 'rgba(222,106,45,.12)', glowink: '#b4450f' } },
      dark: { id: 'dark', label: 'ANDRÉ MANDEL', look: 'Tron', tag: 'TRON', brand: 'ANDRÉ MANDEL', f: SM_HUD, v: { bg: '#0a1520', bg2: '#112436', panel: 'rgba(13,29,45,.92)', line: '#2b4b68', ink: '#eaf3fb', mute: '#a2bccf', accent: '#5ad1ff', need: '#ffae36', wait: '#ffd98a', work: '#5ad1ff', idle: '#37536d', glow: 'rgba(90,209,255,.22)', grid: 'rgba(90,209,255,.06)', glowc: 'rgba(90,209,255,.9)', glowc2: 'rgba(90,209,255,.45)', glowbg: 'rgba(90,209,255,.15)', glowink: '#f2fdff' } },
      // 8.9.3: Retro futurism. Night sky going violet at the horizon, sunset coral for what needs you,
      // gold for your turn, electric blue for working, hot magenta for the accent
      retro: { id: 'retro', label: 'ANDRÉ MANDEL', look: 'Retro', tag: 'RETRO', brand: 'ANDRÉ MANDEL', f: SM_RETRO, v: { bg: '#0b0616', bg2: '#170d29', panel: 'rgba(16,9,31,.9)', line: '#3d2a63', ink: '#fbefff', mute: '#ab98cf', accent: '#ff3e9a', need: '#ff6a3d', wait: '#ffc35a', work: '#35d3ff', idle: '#3e3060', glow: 'rgba(255,62,154,.24)', grid: 'rgba(53,211,255,.06)', glowc: 'rgba(255,62,154,.9)', glowc2: 'rgba(255,62,154,.45)', glowbg: 'rgba(255,62,154,.16)', glowink: '#fff2fb' } },
      // 9.0: night drive, from the Chief of Staff board: ink sky, sunset rule, cyan grid. Magenta is urgent,
      // sun is waiting on you, cyan is working; the word being read glows like the setting sun.
      night: { id: 'night', label: 'NIGHT DRIVE', look: 'Night drive', tag: 'NIGHT', brand: 'NIGHT DRIVE', f: SM_NIGHT, v: { bg: '#0a0912', bg2: '#19143a', panel: 'rgba(16,14,28,.94)', line: '#2a2647', ink: '#ece8f6', mute: '#8f8aad', accent: '#52d9ff', need: '#ff4f9e', wait: '#ff9447', work: '#52d9ff', idle: '#3a3560', glow: 'rgba(143,116,255,.24)', grid: 'rgba(82,217,255,.05)', glowc: 'rgba(255,148,71,.9)', glowc2: 'rgba(255,79,158,.45)', glowbg: 'rgba(255,148,71,.16)', glowink: '#fff3e6' } }
    };
    // ---------- 9.0.1: FIFTY LOOKS ----------
    // A look is a palette, a font kit, a background and a panel shape. CHxTLD and Tron are drawn by hand
    // above; everything else comes from smLook, which works the glows, panels and gradients out of ten colors:
    // ground, second ground, lines, ink, muted ink, accent, needs you, your turn, working, idle.
    const SM_AM_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8.9 -9.9 375.8 539.8"> <g fill="currentColor"><path fill-rule="evenodd" d="M347 448.9 C346.5 448.8 346 448.6 345 448 C344.6 447.7 343.9 447.4 343.5 447.2 C342.5 446.9 340.2 445.7 339.1 445 C338.6 444.6 338 444.3 337.4 444.1 C336.3 443.7 336.1 443.6 335.2 443 C334.7 442.7 334.1 442.4 333.5 442.2 C332.9 442 332.2 441.6 331.8 441.4 C331.1 440.9 328.7 439.5 327.5 438.9 C327.1 438.7 326.5 438.3 326.1 438.1 C325.7 437.8 324.3 437 323 436.3 C321.6 435.6 320.3 434.8 320 434.7 C319.7 434.5 319.1 434.2 318.8 434 C318.4 433.8 317.7 433.4 317.3 433.1 C316.9 432.8 315.9 432.2 315 431.8 C314.1 431.3 313.1 430.7 312.5 430.4 C311.5 429.7 311.2 429.5 310 429 C309.5 428.8 308.8 428.4 308.4 428.1 C308 427.8 307.2 427.4 306.8 427.1 C306.3 426.9 305.6 426.4 305.1 426.1 C304.3 425.6 303.9 425.3 300.8 423.7 C298.6 422.6 297.1 421.6 296 420.8 C295.5 420.3 294.6 419.7 294.1 419.4 C293.6 419.1 292.9 418.7 292.6 418.4 C292.2 418.1 291.5 417.7 291 417.4 C290.6 417.1 289.6 416.4 288.8 415.9 C288.1 415.4 287 414.7 286.4 414.3 C285.8 413.9 284.6 413.1 283.7 412.6 C282.9 412.1 281.8 411.4 281.4 411.1 C280.9 410.8 280.2 410.3 279.9 410.1 C279.5 409.9 278.2 409 277 408.2 C275.7 407.4 273.9 406.2 272.9 405.6 C271.9 405 270.6 404.2 270.1 403.8 C269.7 403.4 268.9 402.9 268.5 402.6 C268.1 402.4 267.4 401.9 267 401.6 C265.9 400.9 264.7 400.1 264 399.6 C263.6 399.4 262.5 398.6 261.5 398 C260.5 397.3 258.8 396.2 257.8 395.6 C256.9 395.1 255.7 394.4 255.4 394.1 C255 393.8 254.3 393.4 253.9 393.1 C253.5 392.9 252.8 392.4 252.3 392.1 C251.9 391.8 251.3 391.4 251 391.2 C250.2 390.7 249.7 390.3 248.7 389.5 C248.2 389.1 247.3 388.4 246.8 388 C246.1 387.6 245.3 386.9 244.7 386.3 C241.7 383.4 240.1 382 239 381.3 C238 380.6 237.3 380 235.4 378.3 C234.5 377.4 233.3 376.4 232.8 376 C232.2 375.7 231.4 375 230.8 374.5 C228.9 372.7 227.8 371.8 226.8 371.1 C226.2 370.7 225.3 369.9 224.8 369.4 C222.3 367.1 221.6 366.6 220.8 366 C219.8 365.3 219.4 365 216.9 362.7 C214.7 360.6 213.9 360 212.6 359 C211.4 358.1 209.8 356.7 205.8 352.7 C203.3 350.2 202.6 349.6 201.8 349 C200.9 348.4 200.2 347.7 196.3 343.9 C193.9 341.5 191.7 339.3 191.4 338.9 C191.2 338.6 190.8 338.1 190.6 337.8 C190 337 188.9 335.8 184.7 331.5 C182.8 329.5 180.6 327.3 179.9 326.5 C179.1 325.8 178.2 324.6 177.7 324 C176.1 322 173.4 319.3 171.8 318.2 C170.9 317.5 170.6 317.2 168 314.8 C165.2 312.2 164.5 311.4 163.8 309.8 C163.6 309.3 163.3 308.6 163 308.2 C162.5 307.4 161.7 305.8 159.9 302.3 C158.6 299.8 158.4 299.4 157.2 298 C156.7 297.4 156.1 296.5 155.7 296 C155.1 295.1 154.5 294.4 153.1 292.8 C152.7 292.4 152.1 291.6 151.8 291.1 C150.6 289.4 149.5 288.4 148.2 287.9 C147.1 287.4 146.6 287.3 144.1 287.2 C142.8 287.1 141.5 287 141.1 286.9 C139.9 286.7 139.2 286.8 135.8 287.8 C134.8 288 133.8 288.1 133 287.9 C132.4 287.8 132 287.6 130.6 286.8 C129.4 286.2 129.2 286.2 125.1 286.1 C118.6 286 114.6 286.3 112.4 286.8 C111.2 287.1 110.4 287.3 109.2 287.4 C108.8 287.4 108 287.5 107.3 287.7 C106.2 287.9 105.9 287.9 103.7 288 C101 288.1 100.3 288.1 98.2 288.3 C96.2 288.5 85.4 288.5 83.2 288.3 C80.2 288.1 77.8 288 71 288 C64.2 288 62.7 288.1 61.7 288.3 C61 288.4 58.1 289.7 57.1 290.2 C56.8 290.4 56 290.8 55.5 291.1 C54.9 291.4 54.1 291.8 53.7 292.1 C52.8 292.7 52.6 292.8 51.3 293.1 C48.9 293.6 47.5 294.8 46.7 297.1 C46.3 298.2 46.2 298.5 46.2 303.3 C46.1 307.9 46.1 307.9 45.9 309 C45.5 310.5 45.5 312.5 45.8 313.8 C46.1 315.1 46.1 316.2 46.2 322.9 C46.3 332.4 46.4 344.9 46.5 349.2 C46.6 352.7 46.6 353.1 46.8 353.8 C47 354.6 47 354.6 47 370.7 C47 387.8 47 386.6 46.6 388.8 C46.5 389.3 46.5 391 46.4 395.1 C46.1 407.5 46.1 406.7 45.8 408.1 C45.5 409.5 45.4 413.2 45.2 423.3 C45.2 427.2 45.1 429.4 45.1 429.7 C44.8 430.9 44.1 431.7 42.3 432.6 C41 433.2 41.1 433.2 37.4 433.2 C33.1 433.3 32.8 433.2 30.8 432.4 C29.3 431.8 28.7 431.2 28.3 429.9 C28 429 28 428.7 27.9 424.3 C27.8 420.2 27.6 413.9 27.5 410.5 C27.4 408.6 27.4 408.2 27.2 407.2 C26.9 406 26.9 406 26.8 400.2 C26.6 381.6 26.6 381.4 26.8 348.1 C26.9 338 26.9 338 27.1 337 C27.5 335.3 27.5 332.7 27.5 307.8 C27.4 285.4 27.4 285.4 27.2 284.3 C26.9 283 26.8 281.9 26.7 277.4 C26.6 273.4 26.6 272.4 26.3 271.1 C26.1 270.5 25.9 269.3 25.9 268.5 C25.7 267 25.6 266.5 25.3 265 C25 264.2 25 263.8 24.9 262.7 C24.8 259.9 24.7 259.6 24.2 258 C24 257.5 23.8 256.5 23.6 255.8 C23.5 255.2 23.4 254.3 23.2 253.9 C23.1 253.4 23.1 252.7 23 251.4 C22.8 247.6 22.6 245.7 22.2 244.3 C21.9 243 21.9 242.8 21.7 239.5 C21.6 236.5 21.5 236.2 21.2 234.5 C21 233.6 20.9 229.2 20.8 220.2 C20.8 216 20.8 215.8 21.2 214 C21.5 213 21.6 212.3 21.8 210.3 C21.9 209.1 21.9 208.7 22.4 207.4 C22.6 206.9 22.9 206.2 23 205.8 C23.2 205.5 23.5 204.9 23.8 204.5 C24.6 203.2 24.9 202.4 26.4 197.5 C27.1 195.2 27.5 194.5 29.1 192.2 C29.4 191.9 29.7 191.3 29.9 190.9 C30.1 190.6 30.6 189.9 30.9 189.4 C31.2 188.9 31.6 188.3 31.8 188 C32.5 186.6 33.6 185.4 34.5 185 C35.9 184.4 37.5 184.5 38.8 185.3 C39.5 185.7 41 187.3 42 188.7 C42.5 189.3 43.3 190.3 43.8 190.8 C45.8 192.9 46 193.2 46.4 193.7 C46.9 194.4 48.2 196.8 48.5 197.5 C48.8 198.4 48.9 198.7 49.1 200.2 C49.2 201.3 49.3 201.8 49.7 202.8 C49.9 203.4 50.2 204.3 50.3 204.8 C50.4 205.2 50.8 206.1 51.1 206.7 C51.8 208.3 51.9 208.6 52.1 209.6 C52.2 210.1 52.5 211 52.7 211.6 C53.2 212.9 53.2 213.4 53.3 215.9 C53.4 218.5 53.3 218.8 52.5 220.8 C52.4 221.1 52.2 221.8 52.1 222.4 C52 222.9 51.8 223.8 51.6 224.3 C51.5 224.9 51.3 225.6 51.2 226 C51.1 226.4 51 227.3 50.8 228 C50.4 229.6 50.4 230.2 50.2 233.9 C50.1 237.4 50.1 238 49.8 239.4 C49.4 240.8 49.1 243.2 49 247 C48.9 249 48.9 249.1 48.5 250.6 C48.3 251.5 48 252.7 47.8 253.3 C47.3 254.8 47.2 255.6 47.1 257.7 C47 260.5 47.2 261.1 48.4 262.3 C49.1 263.1 49.7 263.5 50.6 263.8 C51.5 264.2 51.9 264.4 52.7 265 C53.6 265.5 53.7 265.6 55.1 266 C55.7 266.2 56.5 266.4 56.8 266.5 C57.2 266.6 58 266.8 58.6 266.9 C59.3 266.9 60.3 267.1 61 267.3 C62.1 267.5 62.1 267.5 70.9 267.5 C79.6 267.5 79.6 267.5 80.9 267.3 C81.9 267.1 82.6 267 83.9 266.9 C86.9 266.8 89 266.6 90 266.4 C91.2 266.2 91.9 266.2 92.8 266.4 C93.9 266.6 95.1 266.7 97 266.9 C98.2 267 99.2 267.1 100.1 267.3 C101.3 267.5 101.9 267.6 103.4 267.7 C105.6 267.8 106.1 267.8 107.5 268.2 C109.7 268.8 111.9 268.9 118.6 268.9 C124.9 269 124.8 269 125.8 268.2 C127.3 267.1 127.9 265.8 127.9 263.9 C127.9 262.3 127.7 261.6 126.5 260.2 C126.1 259.7 125.5 258.8 125.1 258.3 C124.7 257.7 124.2 257 123.9 256.7 C123.6 256.3 123.2 255.7 122.9 255.3 C122.1 254 121.2 252.9 119.5 251.1 C119 250.6 118.3 249.7 117.9 249.1 C117.5 248.5 116.8 247.6 116.4 247.1 C116 246.6 115.3 245.7 115 245.2 C114.6 244.6 113.9 243.7 113.5 243.3 C112.6 242.3 112.2 241.7 111.6 240.8 C111.1 240 110.8 239.7 109.6 238.4 C109.2 237.9 108.5 237 108.2 236.5 C107.8 235.9 107.2 235.2 107 234.8 C106.7 234.4 106.1 233.7 105.8 233.1 C105.5 232.6 104.8 231.7 104.4 231.1 C103.9 230.6 103.3 229.8 103 229.3 C102.7 228.8 102.2 228.1 102 227.8 C101.7 227.4 101.2 226.7 100.9 226.2 C100.7 225.8 100 224.8 99.5 224.2 C98.9 223.6 98.2 222.6 97.8 222 C96.7 220.2 95.6 218.7 94.8 217.6 C94.4 217.1 93.9 216.3 93.6 215.8 C93.3 215.4 92.8 214.6 92.3 214.1 C91.9 213.5 91.2 212.6 90.9 212.1 C90.6 211.6 90.1 210.9 89.8 210.6 C89.6 210.2 89.1 209.6 88.8 209.1 C88.6 208.6 88 207.8 87.7 207.4 C86.6 206.2 86.3 205.7 85.9 204.9 C85.6 203.9 85.4 203.6 84.9 202.8 C84.5 202.2 82.8 199 81.4 196.2 C80.9 195.3 80.3 194.2 80.1 193.9 C79.5 193.1 79.2 192.4 78.9 191.6 C78.6 190.8 77.4 188.5 76.8 187.6 C76.5 187.1 76.1 186.3 75.9 185.9 C75.5 184.9 75.2 184.3 74.8 183.7 C74.4 183.2 73.9 182.2 71.8 178.2 C71.1 176.7 70.3 175.2 70 174.8 C69.3 173.8 69.1 173.3 68.8 172.2 C68.7 171.6 68.4 170.7 68.1 170.1 C67.8 169.4 67.4 168.6 67.2 168 C67 167.5 66.7 166.7 66.5 166.2 C66.2 165.8 65.9 165 65.7 164.5 C65.5 164.1 65.1 163.2 64.8 162.7 C64.3 161.8 64.1 161.4 63.7 160.2 C63.6 159.9 63.3 159.3 63 158.9 C62.4 158 62.3 157.7 61.9 156.8 C61.6 155.9 60.3 153.2 59.6 152.2 C59.4 151.8 59.1 151.2 58.9 150.6 C58.7 150.1 58.3 149.3 58 148.7 C57.8 148.2 57.4 147.3 57.1 146.8 C56.9 146.3 56.6 145.7 56.4 145.3 C55.7 144 54.1 140.8 53.8 139.8 C53.6 139.2 53.2 138.4 52.8 137.8 C52.5 137.3 52.1 136.4 51.9 135.9 C51.7 135.3 51.3 134.5 51 134.1 C50.2 132.7 49.1 130.7 48.8 129.6 C48.6 129 48.2 128.3 47.9 127.7 C47.2 126.6 47 126.2 46.9 124.9 C46.7 123.6 46.5 122.9 45.8 121.8 C45.5 121.2 45.2 120.5 45 119.8 C44.8 119.2 44.2 117.9 43.4 116.2 C42.7 114.8 42 113.3 41.8 112.9 C41.5 112 41.4 111.7 40.9 110.9 C40.7 110.6 40.2 109.8 39.9 109.3 C39.4 108.3 38.7 107.1 37.3 104.8 C36.7 103.8 35.7 102.1 35.2 101.1 C35 100.6 34.4 99.5 33.9 98.8 C33.4 98.1 32.9 97.2 32.6 96.8 C32.4 96.4 31.8 95.7 31.4 95.1 C30.6 94.2 29.8 93.1 28 90.5 C27.5 89.8 26.7 88.7 26.2 88.1 C24.6 86.1 21.8 81.8 20.5 79.4 C20 78.5 19.3 77.3 19 76.8 C18.6 76.2 18.2 75.4 17.9 74.8 C17.6 73.9 17.3 73.5 16.8 72.7 C16.5 72.2 15.4 70.2 14.8 69.2 C14.7 68.8 14.2 68.1 13.9 67.6 C13.5 67 13.1 66.3 12.9 65.7 C12.6 65.1 12.2 64.3 11.8 63.7 C11 62.4 10.2 60.8 9.1 58.6 C8.3 56.9 8.1 56.4 7.8 54.8 C7.7 54.5 7.4 53.6 7.1 53 C6.3 51.3 6.1 50.4 6 48.8 C5.9 48.4 5.8 47.5 5.8 47 C5.5 45.3 5.6 36.5 5.8 35.3 C6 34 6.2 33.5 6.9 32.5 C8.3 30.5 8.6 29.5 8.7 26.8 C8.8 24.6 8.9 23.9 9.6 22.3 C10.4 20.5 11.1 19.4 12 18.2 C12.3 17.9 12.7 17.3 12.9 16.9 C13.2 16.5 13.6 15.8 13.9 15.3 C14.5 14.4 14.9 13.8 15.9 12 C16.7 10.4 18.4 7.9 19.1 7.1 C20.2 6.1 22 5 23.2 4.8 C23.7 4.7 24.1 4.7 25.6 4.7 C27.6 4.7 27.9 4.8 29.2 5.4 C29.7 5.6 30.4 5.9 31 6.1 C31.6 6.3 32.2 6.6 32.8 7 C33.5 7.4 34 7.6 34.8 7.9 C35.4 8.1 36.4 8.5 36.9 8.8 C38.2 9.4 38.9 9.6 40.2 9.8 C41.4 9.9 41.5 10 43.6 10.7 C46.4 11.8 47.2 12.3 48.5 14.3 C49.9 16.4 52 18.6 55.2 21.3 C57.2 22.9 60.1 26.1 60.7 27.2 C61 27.8 61.8 29.9 62 30.6 C62.2 31.6 62.1 32.9 61.6 34.2 C61.1 35.8 61.1 36.1 61.1 40.3 C61.1 44.3 61.2 44.8 61.7 46.7 C62 47.9 62.1 48.4 62.2 51.6 C62.3 53.2 62.4 53.7 62.8 55.1 C63 55.5 63.2 56.3 63.2 56.9 C63.3 57.4 63.5 58.3 63.7 58.9 C64 60.1 64 60.9 64.2 67.5 C64.3 74.6 64.3 74.3 65.1 76.4 C65.4 77.2 65.8 78.3 66 78.9 C66.1 79.5 66.4 80.3 66.6 80.8 C67 81.7 67 82 67.2 83.2 C67.4 84.1 67.6 84.7 68.2 86 C68.7 87 68.9 87.7 69.1 88.7 C69.3 90 69.3 90.1 70 91.4 C70.6 92.7 70.8 93.3 71 94.5 C71.3 95.9 71.3 96 73.1 99.7 C73.5 100.5 74 101.6 74.2 102.2 C74.4 102.8 74.7 103.4 75.1 104.1 C75.4 104.7 75.9 105.5 76.1 106.2 C76.6 107.4 77.7 109.7 78.2 110.5 C78.7 111.2 79 111.9 79.2 113 C79.4 113.7 79.7 114.4 80 115.1 C80.5 116.2 80.8 117.1 81.1 118.3 C81.2 118.8 81.6 119.7 82 120.4 C83.7 124 84 124.6 84.2 125.2 C84.5 125.9 84.8 126.6 85.2 127.3 C85.5 127.7 86.3 129.3 87.2 131 C88.1 132.8 89.1 134.9 89.3 135.4 C89.5 136 89.7 136.5 90.5 137.7 C90.7 138.1 90.9 138.6 91 139 C91.4 139.8 91.7 140.5 92 141 C92.2 141.2 92.6 141.9 92.9 142.6 C93.9 144.4 94.7 145.9 95.3 146.7 C95.6 147.1 96 147.9 96.2 148.4 C96.4 148.9 96.9 149.7 97.2 150.3 C97.6 150.8 98 151.5 98.1 151.7 C98.2 151.9 98.6 152.5 99 153 C99.6 154 100 154.6 101 156.5 C101.4 157.2 101.8 158 102.1 158.4 C102.6 159.2 102.8 159.5 103.1 160.5 C103.3 161 103.7 161.9 103.9 162.4 C104.2 162.9 104.6 163.7 104.8 164.2 C105.3 165.3 106.6 167.6 107.2 168.5 C107.4 168.8 107.8 169.4 108.1 169.8 C108.3 170.2 108.8 170.9 109.1 171.4 C109.4 171.8 109.8 172.5 110.1 172.9 C110.6 173.9 111.7 175.6 112.2 176.4 C112.4 176.8 112.9 177.4 113.1 177.9 C113.4 178.3 113.8 179 114.1 179.4 C114.6 180.1 114.8 180.4 115.2 181.4 C115.4 181.8 115.8 182.5 116.1 183 C116.8 184.3 117.8 186.2 118.2 187.3 C118.4 187.9 118.8 188.7 119.1 189.1 C119.6 190 119.9 190.5 120.2 191.5 C120.4 191.8 120.7 192.5 121 192.9 C121.5 193.7 121.8 194.2 122.8 196 C123.1 196.7 123.8 197.7 124.1 198.2 C124.5 198.8 125 199.5 125.1 199.8 C125.3 200.1 125.7 200.7 126 201.1 C126.6 202.1 126.8 202.4 127.1 203.4 C127.3 203.8 127.7 204.9 128.2 205.8 C130.1 209.8 130.5 210.6 131.2 211.5 C131.5 212 132.2 213.1 132.7 213.9 C133.2 214.7 133.9 215.9 134.4 216.6 C135.5 218.4 136.3 219.5 137 220.7 C137.3 221.2 137.8 222 138.1 222.4 C138.7 223.2 140 225.5 141.5 228.4 C142 229.5 142.8 230.8 143.1 231.4 C143.4 231.9 144.1 232.9 144.5 233.7 C145.5 235.2 147.3 238.1 148.2 239.3 C148.6 239.7 149 240.4 149.2 240.7 C149.4 241 150 241.9 150.6 242.6 C151.7 244.1 153.2 246.3 154 247.6 C154.3 248.1 154.8 248.8 155.1 249.2 C155.3 249.5 155.9 250.3 156.3 250.9 C156.7 251.5 157.4 252.5 157.8 253 C158.2 253.6 158.9 254.5 159.3 255.1 C159.7 255.7 160.3 256.6 160.6 257.1 C160.9 257.6 161.3 258.2 161.5 258.5 C161.7 258.8 162.2 259.4 162.6 259.9 C163 260.4 163.5 261 163.6 261.2 C163.8 261.4 164.2 262.1 164.6 262.7 C165 263.4 165.6 264.3 166 264.8 C166.3 265.3 166.8 266 167.2 266.4 C168.4 267.8 168.7 268.1 169.2 268.9 C170.1 270.2 171.2 271.4 174.1 274.6 C174.8 275.3 175.7 276.3 176 276.8 C176.8 278 177.6 278.8 179.4 280.7 C181.1 282.4 181.6 282.8 183.2 283.9 C183.8 284.3 184.7 284.9 185.1 285.3 C185.5 285.6 186.3 286.2 186.9 286.7 C187.9 287.3 191.1 289.9 192.2 291 C192.7 291.5 193.2 292.1 194.1 293.7 C195.8 296.5 198.3 300.2 199.5 301.7 C199.9 302.2 201.4 303.8 202.8 305.2 C208.6 311 209.3 311.8 210.1 312.8 C211 313.9 211.2 314.2 218 321.1 C235 338.4 242.2 345.6 246.8 350.1 C251.9 355 251.9 355 253.2 355.9 C254.1 356.6 255 357.4 257.3 359.7 C262.6 364.9 265.5 367.6 267 368.8 C267.4 369.2 268.1 369.8 268.4 370.2 C269.3 371.3 271.4 373.2 272.3 373.9 C272.9 374.3 274.3 375.7 276.8 378.1 C282.1 383.5 283.7 384.9 285.2 386 C285.8 386.4 286.8 387.3 288.1 388.5 C291.8 392 293.6 393.6 295.2 394.9 C295.9 395.3 296.8 396.1 297.3 396.6 C301.3 400.4 302.8 401.8 304.3 402.9 C305 403.4 306.1 404.3 306.8 405 C308.5 406.5 309.1 407 310.1 407.8 C310.6 408.2 312.1 409.4 313.4 410.6 C316.1 413.2 317.1 414.1 317.8 414.6 C319.1 415.5 319.6 415.9 320.7 417 C322.7 418.8 323.2 419.2 324.1 419.9 C325 420.5 325.5 420.9 327.1 422.4 C328.2 423.4 329.2 424.2 330.3 425 C330.8 425.3 331.9 426.1 332.6 426.8 C333.4 427.5 334.5 428.4 335.1 428.9 C336.1 429.6 336.6 430 338.9 432 C339.4 432.4 340.2 433.1 340.8 433.5 C341.4 434 342.3 434.6 342.7 435 C343.1 435.3 343.7 435.8 343.9 436.1 C344.2 436.3 344.8 436.7 345.2 437 C345.6 437.2 346.3 437.7 346.7 437.9 C347.1 438.2 347.8 438.8 348.3 439.1 C349.4 439.8 350.5 440.7 351.2 441.5 C352.2 442.7 352.4 443.3 352.3 444.8 C352.3 445.8 352.3 445.9 352 446.5 C351.6 447.2 350.7 448.1 350.1 448.5 C349.3 448.9 348.1 449.1 347 448.9 Z M45.2 71.7 L44.2 69.1 L44.1 69 L44.1 69 L44.2 68.9 L44.2 68.8 L44.2 68.8 L44.3 68.8 L44.4 68.8 L44.4 68.8 L44.5 68.8 L44.5 68.8 L44.6 68.9 L44.6 68.9 L45.6 71.6 L46.6 74.2 L47.7 76.9 L48.7 79.5 L49.7 82.2 L50.8 84.8 L51.8 87.5 L52.9 90.2 L53.9 92.8 L55 95.5 L56.1 98.1 L57.2 100.8 L58.3 103.4 L59.4 106.1 L60.6 108.7 L61.7 111.4 L62.9 114 L64 116.7 L65.2 119.4 L66.4 122 L67.6 124.7 L68.8 127.3 L70 130 L71.2 132.6 L72.4 135.3 L73.7 137.9 L74.9 140.6 L76.2 143.2 L77.5 145.9 L78.8 148.6 L80.1 151.2 L81.4 153.9 L82.8 156.5 L84.1 159.2 L85.5 161.8 L86.9 164.5 L88.3 167.1 L89.7 169.8 L91.1 172.4 L92.5 175.1 L94 177.8 L95.5 180.4 L96.9 183.1 L98.4 185.7 L100 188.4 L101.5 191 L103 193.7 L104.6 196.3 L106.2 199 L107.8 201.6 L109.4 204.3 L111 207 L112.6 209.6 L114.3 212.3 L116 214.9 L117.7 217.6 L119.4 220.2 L121.1 222.9 L122.9 225.5 L124.6 228.2 L126.4 230.8 L128.2 233.5 L130.1 236.2 L131.9 238.8 L133.8 241.5 L135.6 244.1 L137.5 246.8 L139.5 249.4 L141.4 252.1 L143.4 254.7 L145.3 257.4 L147.3 260 L149.4 262.7 L151.4 265.4 L153.5 268 L155.5 270.7 L157.7 273.3 L159.8 276 L161.9 278.6 L164.1 281.3 L166.3 283.9 L168.5 286.6 L170.7 289.2 L173 291.9 L175.3 294.6 L177.6 297.2 L179.9 299.9 L182.3 302.5 L184.6 305.2 L187 307.8 L189.5 310.5 L191.9 313.1 L194.4 315.8 L196.9 318.4 L199.4 321.1 L202 323.8 L204.5 326.4 L207.1 329.1 L209.7 331.7 L212.4 334.4 L215.1 337 L217.8 339.7 L220.5 342.3 L223.2 345 L226 347.6 L228.8 350.3 L231.6 353 L234.5 355.6 L237.4 358.3 L240.3 360.9 L243.2 363.6 L246.2 366.2 L249.2 368.9 L252.2 371.5 L255.3 374.2 L258.4 376.8 L261.5 379.5 L264.6 382.2 L267.8 384.8 L267.8 384.9 L267.8 384.9 L267.9 385 L267.9 385 L267.8 385.1 L267.8 385.2 L267.8 385.2 L267.7 385.2 L267.6 385.2 L267.6 385.2 L267.5 385.2 L267.5 385.2 L264.3 382.5 L264.3 382.5 L261.1 379.9 L261.1 379.9 L258 377.2 L258 377.2 L255 374.6 L255 374.6 L251.9 371.9 L251.9 371.9 L248.9 369.3 L248.9 369.3 L245.9 366.6 L245.9 366.6 L242.9 363.9 L242.9 363.9 L240 361.3 L240 361.3 L237.1 358.6 L237.1 358.6 L234.2 356 L234.2 356 L231.3 353.3 L231.3 353.3 L228.5 350.7 L228.5 350.7 L225.7 348 L225.7 348 L222.9 345.3 L222.9 345.3 L220.1 342.7 L220.1 342.7 L217.4 340 L217.4 340 L214.7 337.4 L214.7 337.4 L212 334.7 L212 334.7 L209.4 332.1 L209.4 332.1 L206.8 329.4 L206.8 329.4 L204.2 326.8 L204.2 326.8 L201.6 324.1 L201.6 324.1 L199 321.4 L199 321.4 L196.5 318.8 L196.5 318.8 L194 316.1 L194 316.1 L191.6 313.5 L191.6 313.5 L189.1 310.8 L189.1 310.8 L186.7 308.2 L186.7 308.2 L184.3 305.5 L184.3 305.5 L181.9 302.8 L181.9 302.8 L179.5 300.2 L179.5 300.2 L177.2 297.5 L177.2 297.5 L174.9 294.9 L174.9 294.9 L172.6 292.2 L172.6 292.2 L170.4 289.6 L170.4 289.6 L168.1 286.9 L168.1 286.9 L165.9 284.3 L165.9 284.3 L163.7 281.6 L163.7 281.6 L161.5 278.9 L161.5 278.9 L159.4 276.3 L159.4 276.3 L157.3 273.6 L157.3 273.6 L155.2 271 L155.2 271 L153.1 268.3 L153.1 268.3 L151 265.7 L151 265.7 L149 263 L149 263 L146.9 260.3 L146.9 260.3 L144.9 257.7 L144.9 257.7 L143 255 L143 255 L141 252.4 L141 252.4 L139.1 249.7 L139.1 249.7 L137.1 247.1 L137.1 247.1 L135.2 244.4 L135.2 244.4 L133.3 241.8 L133.3 241.7 L131.5 239.1 L131.5 239.1 L129.6 236.4 L129.6 236.4 L127.8 233.8 L127.8 233.8 L126 231.1 L126 231.1 L124.2 228.5 L124.2 228.5 L122.5 225.8 L122.5 225.8 L120.7 223.2 L120.7 223.2 L119 220.5 L119 220.5 L117.3 217.8 L117.3 217.8 L115.6 215.2 L115.6 215.2 L113.9 212.5 L113.9 212.5 L112.2 209.9 L112.2 209.9 L110.6 207.2 L110.6 207.2 L108.9 204.6 L108.9 204.6 L107.3 201.9 L107.3 201.9 L105.7 199.2 L105.7 199.2 L104.2 196.6 L104.2 196.6 L102.6 193.9 L102.6 193.9 L101.1 191.3 L101.1 191.3 L99.5 188.6 L99.5 188.6 L98 186 L98 186 L96.5 183.3 L96.5 183.3 L95 180.7 L95 180.7 L93.6 178 L93.6 178 L92.1 175.3 L92.1 175.3 L90.7 172.7 L90.7 172.7 L89.2 170 L89.2 170 L87.8 167.4 L87.8 167.4 L86.4 164.7 L86.4 164.7 L85.1 162.1 L85.1 162.1 L83.7 159.4 L83.7 159.4 L82.3 156.7 L82.3 156.7 L81 154.1 L81 154.1 L79.7 151.4 L79.7 151.4 L78.4 148.8 L78.4 148.8 L77.1 146.1 L77.1 146.1 L75.8 143.5 L75.8 143.5 L74.5 140.8 L74.5 140.8 L73.2 138.1 L73.2 138.1 L72 135.5 L72 135.5 L70.7 132.8 L70.7 132.8 L69.5 130.2 L69.5 130.2 L68.3 127.5 L68.3 127.5 L67.1 124.9 L67.1 124.9 L65.9 122.2 L65.9 122.2 L64.7 119.6 L64.7 119.6 L63.6 116.9 L63.6 116.9 L62.4 114.2 L62.4 114.2 L61.2 111.6 L61.2 111.6 L60.1 108.9 L60.1 108.9 L59 106.3 L59 106.3 L57.9 103.6 L57.9 103.6 L56.8 101 L56.8 101 L55.7 98.3 L55.7 98.3 L54.6 95.6 L54.6 95.6 L53.5 93 L53.5 93 L52.4 90.3 L52.4 90.3 L51.4 87.7 L51.4 87.7 L50.3 85 L50.3 85 L49.3 82.4 L49.3 82.4 L48.2 79.7 L48.2 79.7 L47.2 77.1 L47.2 77.1 L46.2 74.4 L46.2 74.4 L45.2 71.7 Z"/><path d="M31.1 471.9H26.9V515.1H29.6V479.8H29.8L48.9 515.9H50L69.6 480.1H69.8V515.1H75.5V471.9H71.2L51.2 509H50.9Z M125.7 502.4 131.6 515.1H137.6L117.5 471.9H114.4L96.1 515.1H98.9L104.4 502.4ZM124.4 499.6H105.5L114.4 478.8H114.7Z M193.1 471.9V504.9H192.9L158.6 471.1H158.3V515.1H161.1V482.1H161.3L195.7 515.9H196V471.9Z M216.6 515.1V471.9H230.8Q236 471.9 240.2 473.5Q244.5 475.1 247.6 478Q250.6 480.9 252.3 484.8Q254 488.8 254 493.4Q254 498.1 252.3 502.1Q250.5 506.1 247.4 509Q244.4 511.9 240.3 513.5Q236.2 515.1 231.6 515.1ZM222.2 512.4H229Q234.1 512.4 237.7 510.7Q241.2 509 243.5 506.3Q245.8 503.6 246.8 500.2Q247.9 496.8 247.9 493.5Q247.9 489.8 246.7 486.4Q245.4 482.9 243 480.3Q240.7 477.7 237.1 476.1Q233.6 474.6 229 474.6H222.2Z M274.6 471.9V515.1H302.6V511.7H280.3V493.6H299.4V490.8H280.3V475.3H302.6V471.9Z M323.2 515.1V471.9H328.8V511.7H351.1V515.1Z" stroke="#151412" stroke-width="1.7" stroke-linejoin="miter"/></g> </svg> ';   // 9.4: the ANDRÉ MANDEL brush A, for that Outbox's panel
    const SM_FONT_SPEC = {   // Google Fonts, asked for one family at a time the first time a look needs it
      'Tenor Sans': 'Tenor+Sans', 'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@1,400;1,500',   // 9.4: ANDRÉ MANDEL letterhead
      'Michroma': 'Michroma', 'Oswald': 'Oswald:wght@400;600;700', 'Bebas Neue': 'Bebas+Neue', 'Inter': 'Inter:wght@400;500;600;700',
      'Space Grotesk': 'Space+Grotesk:wght@400;500;600;700', 'Space Mono': 'Space+Mono:wght@400;700', 'Syne': 'Syne:wght@400;600;700;800',
      'DM Sans': 'DM+Sans:wght@400;500;600;700', 'DM Mono': 'DM+Mono:wght@400;500', 'Playfair Display': 'Playfair+Display:wght@400;600;700',
      'Lora': 'Lora:wght@400;500;600;700', 'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;600;700', 'IBM Plex Sans': 'IBM+Plex+Sans:wght@400;500;600;700',
      'Cinzel': 'Cinzel:wght@400;600;700', 'Poiret One': 'Poiret+One', 'Josefin Sans': 'Josefin+Sans:wght@400;600;700', 'VT323': 'VT323',
      'Silkscreen': 'Silkscreen:wght@400;700', 'Major Mono Display': 'Major+Mono+Display', 'Unbounded': 'Unbounded:wght@400;600;700',
      'Manrope': 'Manrope:wght@400;500;600;700', 'Bungee': 'Bungee', 'Work Sans': 'Work+Sans:wght@400;500;600;700',
      'Chakra Petch': 'Chakra+Petch:wght@400;500;600;700', 'Archivo Black': 'Archivo+Black', 'Big Shoulders Display': 'Big+Shoulders+Display:wght@500;700;800',
      'Architects Daughter': 'Architects+Daughter',   // 9.1: hand lettering for the sketch looks
      // 9.4: more hands and genres
      'Kalam': 'Kalam:wght@300;400;700', 'Gochi Hand': 'Gochi+Hand', 'Patrick Hand': 'Patrick+Hand', 'Permanent Marker': 'Permanent+Marker',
      'Bangers': 'Bangers', 'Comic Neue': 'Comic+Neue:wght@400;700', 'Cabin Sketch': 'Cabin+Sketch:wght@400;700', 'Oxanium': 'Oxanium:wght@400;600;700',
      'Racing Sans One': 'Racing+Sans+One', 'Alfa Slab One': 'Alfa+Slab+One', 'Rye': 'Rye', 'Special Elite': 'Special+Elite', 'Barlow': 'Barlow:wght@400;500;600;700'
    };
    const SM_KITS = {   // headings, body, numbers
      grid: ['Orbitron', 'Exo 2', 'Share Tech Mono'], arcade: ['Audiowide', 'Exo 2', 'Share Tech Mono'], wide: ['Michroma', 'Barlow', 'Share Tech Mono'],
      draft: ['Michroma', 'IBM Plex Sans', 'IBM Plex Mono'], cond: ['Oswald', 'Barlow', 'JetBrains Mono'], poster: ['Bebas Neue', 'Inter', 'JetBrains Mono'],
      grotesk: ['Space Grotesk', 'Space Grotesk', 'Space Mono'], gallery: ['Syne', 'DM Sans', 'DM Mono'], calm: ['DM Sans', 'DM Sans', 'DM Mono'],
      swiss: ['Inter', 'Inter', 'JetBrains Mono'], serif: ['Playfair Display', 'Lora', 'IBM Plex Mono'], classic: ['Cinzel', 'EB Garamond', 'IBM Plex Mono'],
      deco: ['Poiret One', 'Josefin Sans', 'DM Mono'], midcen: ['Josefin Sans', 'Josefin Sans', 'DM Mono'], crt: ['VT323', 'IBM Plex Mono', 'IBM Plex Mono'],
      pixel: ['Silkscreen', 'Space Mono', 'Space Mono'], round: ['Unbounded', 'Manrope', 'JetBrains Mono'], sign: ['Bungee', 'Work Sans', 'Space Mono'],
      mil: ['Chakra Petch', 'Chakra Petch', 'Share Tech Mono'], brut: ['Archivo Black', 'Inter', 'JetBrains Mono'],
      shoulders: ['Big Shoulders Display', 'Barlow', 'JetBrains Mono'], zen: ['Shippori Mincho', 'Shippori Mincho', 'DM Mono'],
      sketch: ['Architects Daughter', 'Architects Daughter', 'Architects Daughter'],   // 9.1
      pencil: ['Kalam', 'Kalam', 'Kalam'], charcoal: ['Gochi Hand', 'Gochi Hand', 'Patrick Hand'], marker: ['Permanent Marker', 'Patrick Hand', 'Patrick Hand'],   // 9.4
      funnies: ['Bangers', 'Comic Neue', 'Comic Neue'], chalk: ['Cabin Sketch', 'Patrick Hand', 'Patrick Hand'], opera: ['Oxanium', 'Exo 2', 'Share Tech Mono'],
      drive: ['Racing Sans One', 'Barlow', 'Share Tech Mono'], dime: ['Alfa Slab One', 'Lora', 'IBM Plex Mono'], saloon: ['Rye', 'Barlow', 'Share Tech Mono'],
      bunker: ['Special Elite', 'IBM Plex Mono', 'VT323']
    };
    const SM_WIDE = /^(arcade|wide|draft|round|sign|pixel|brut)$/;   // wide faces: the big HOLD word steps down a size
    const smStack = (n, kind) => '"' + n + '",' + (kind === 'm' ? '"SF Mono",Menlo,ui-monospace,monospace' : /Playfair|Lora|Cinzel|Garamond|Mincho/.test(n) ? 'Georgia,serif' : /Architects|Kalam|Hand|Marker|Comic|Cabin Sketch|Bangers/.test(n) ? '"Bradley Hand","Segoe Print","Comic Sans MS",cursive' : /Slab|Rye|Elite/.test(n) ? 'Georgia,serif' : 'Arial,sans-serif');
    function smKit(k, wf) {
      const a = SM_KITS[k] || SM_KITS.grid;
      return { hf: smStack(a[0]), bf: smStack(a[1]), mf: smStack(a[2], 'm'), wf: wf ? smStack(wf) : '', fams: a.concat(wf ? [wf] : []) };
    }
    const smRgb = (h) => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    const smA = (h, a) => 'rgba(' + smRgb(h).join(',') + ',' + a + ')';
    const smMix = (h1, h2, k) => { const a = smRgb(h1), b = smRgb(h2); return '#' + a.map((x, i) => Math.round(x + (b[i] - x) * k).toString(16).padStart(2, '0')).join(''); };
    const smLum = (h) => { const c = smRgb(h).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const smCon = (a, b) => { const x = smLum(a), y = smLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    function smLook(id, name, kit, cls, c, x) {
      x = x || {};
      const [bg, bg2, line, ink, mute, accent, need, wait, work, idle] = c;
      const lite = /\blite\b/.test(cls), floor = /\bfx-floor\b/.test(cls);
      const v = { bg, bg2, panel: lite ? smMix(bg, '#ffffff', 0.55) : smA(bg2, 0.9), line, ink, mute, accent, need, wait, work, idle,
        glow: smA(accent, lite ? 0 : 0.22), grid: lite ? smA(ink, 0.05) : smA(accent, 0.06),
        glowc: smA(accent, lite ? 0.5 : 0.9), glowc2: smA(accent, lite ? 0.22 : 0.45), glowbg: smA(accent, lite ? 0.12 : 0.15),
        glowink: lite ? smMix(accent, '#000000', 0.35) : smMix(ink, '#ffffff', 0.5),
        dot: lite ? smA(ink, 0.13) : smA(accent, 0.2), txbg: lite ? smMix(bg, '#ffffff', 0.55) : smA(bg, 0.95), tgbg: lite ? bg2 : smA(bg2, 0.85),
        knob: smCon('#ffffff', accent) >= smCon(bg, accent) ? '#ffffff' : bg,
        fl: smA(work, 0.55), flfade: 'linear-gradient(180deg,' + bg + ' 0%,' + smA(bg, 0.55) + ' 9%,' + smA(bg, 0) + ' 30%)',
        hz: 'linear-gradient(90deg,' + smA(accent, 0) + ',' + need + ' 34%,' + accent + ' 68%,' + smA(accent, 0) + ')', hzg: smA(accent, 0.4),
        sky: floor ?
          'radial-gradient(ellipse 30% 22% at 68% 56%,' + smA(need, 0.32) + ',' + smA(accent, 0.15) + ' 48%,transparent 74%),linear-gradient(180deg,' +
            smMix(bg, '#000000', 0.5) + ' 0%,' + smMix(bg2, accent, 0.12) + ' 34%,' + smMix(bg2, accent, 0.3) + ' 56%,' + bg + ' 56%,' + bg + ' 100%)' :
          'radial-gradient(ellipse 70% 55% at 68% 100%,' + smA(accent, 0.2) + ',transparent 70%),linear-gradient(180deg,' + smMix(bg, '#000000', 0.45) + ',' + bg + ' 70%)',
        au1: smA(accent, 0.3), au2: smA(work, 0.26),
        chrome: 'linear-gradient(180deg,#ffffff 0%,' + smMix(ink, '#ffffff', 0.3) + ' 40%,' + smMix(accent, '#ffffff', 0.35) + ' 52%,' + accent + ' 66%,' + smMix(accent, work, 0.6) + ' 100%)',
        chrome2: 'linear-gradient(180deg,' + smMix(wait, '#ffffff', 0.7) + ' 0%,' + wait + ' 42%,' + need + ' 60%,' + accent + ' 100%)',
        stripe: 'linear-gradient(90deg,' + wait + ',' + need + ' 30%,' + accent + ' 62%,' + work + ')', brc: ink, brg: smA(accent, 0.4) };
      Object.assign(v, x.v || {});
      const onSat = smCon(ink, need) >= 3 ? ink : smCon('#ffffff', need) >= smCon('#0a0a0a', need) ? '#ffffff' : '#0a0a0a';
      const fx = /\bfx-(floor|sky|stars|aurora)\b/.test(cls);
      return { id, name, look: name, tag: x.tag || name.toUpperCase(), label: 'ANDRÉ MANDEL', brand: 'ANDRÉ MANDEL', lite, onSat, f: smKit(kit, x.wf),
        cls: ('gen nb ' + cls + (x.wf ? ' wm' : '') + (fx ? ' fx' : '') + (SM_WIDE.test(kit) ? ' wide' : '') + (kit === 'deco' ? ' thin' : '')).replace(/\s+/g, ' ').trim(), v };
    }
    // the first four keep their places: CHxTLD, Tron, Retro (rebuilt from smLook with its 8.9.3 colors), Night drive
    SM_THEMES.light.name = 'CHxTLD'; SM_THEMES.light.onSat = '#ffffff';
    SM_THEMES.dark.name = 'Tron'; SM_THEMES.night.name = 'Night drive';
    SM_THEMES.retro = smLook('retro', 'Retro', 'arcade', 'fx-floor fx-stars fx-scan sh-neon sh-grad sh-stripe sh-chrome',
      ['#0b0616', '#170d29', '#3d2a63', '#fbefff', '#ab98cf', '#ff3e9a', '#ff6a3d', '#ffc35a', '#35d3ff', '#3e3060'], { wf: 'Monoton', v: {
        panel: 'rgba(16,9,31,.9)', glow: 'rgba(255,62,154,.24)', grid: 'rgba(53,211,255,.06)', glowbg: 'rgba(255,62,154,.16)', glowink: '#fff2fb',
        txbg: 'rgba(12,7,24,.95)', tgbg: 'rgba(23,13,41,.85)', fl: 'rgba(53,211,255,.55)', brc: '#ffc35a', brg: 'rgba(255,195,90,.4)',
        hz: 'linear-gradient(90deg,rgba(255,62,154,0),#ff6a3d 34%,#ff3e9a 68%,rgba(255,62,154,0))', hzg: 'rgba(255,62,154,.4)',
        flfade: 'linear-gradient(180deg,#0a0515 0%,rgba(10,5,21,.55) 9%,rgba(10,5,21,0) 30%)',
        sky: 'radial-gradient(ellipse 30% 22% at 68% 56%,rgba(255,106,61,.34),rgba(255,62,154,.16) 48%,transparent 74%),linear-gradient(180deg,#05030b 0%,#0d0620 30%,#1f0936 48%,#3a0c44 56%,#0a0515 56%,#0a0515 100%)',
        chrome: 'linear-gradient(180deg,#ffffff 0%,#ffe6f6 40%,#ff86c0 52%,#ff3e9a 66%,#9b4dff 100%)',
        chrome2: 'linear-gradient(180deg,#fff3d6 0%,#ffc35a 42%,#ff6a3d 60%,#ff3e9a 100%)' } });
    [
      // synthwave, screens and space
      smLook('vapor', 'Vapor', 'arcade', 'fx-floor fx-stars sh-neon sh-grad sh-stripe', ['#1a0b2e', '#25103f', '#4e2c7a', '#fdf3ff', '#bda6dd', '#ff71ce', '#ff5e7e', '#fffb96', '#01cdfe', '#3d2a5e']),
      smLook('terminal', 'Terminal', 'crt', 'fx-scan fx-crt', ['#020a04', '#05140a', '#114022', '#7dff9a', '#3e9c58', '#39ff6a', '#ffb000', '#d6ff5c', '#39ff6a', '#14482a']),
      smLook('amber', 'Amber CRT', 'crt', 'fx-scan fx-crt', ['#0b0600', '#170d00', '#4a2c00', '#ffb000', '#a87400', '#ffb000', '#ff5a1f', '#ffd27a', '#ffcf66', '#4a3000']),
      smLook('blueprint', 'Blueprint', 'draft', 'fx-blue sh-thick', ['#0b3a7e', '#0f4590', '#5585c8', '#f2f7ff', '#b3cbec', '#ffffff', '#ffd23f', '#9fe7ff', '#ffffff', '#3c6aa8'], { v: {
        grid: 'rgba(255,255,255,.08)', dot: 'rgba(255,255,255,.18)', panel: 'rgba(11,58,126,.88)' } }),
      smLook('sonar', 'Sonar', 'mil', 'fx-radar fx-dots sh-neon sh-cut', ['#00110d', '#011d16', '#0d4a39', '#c8fff0', '#62b8a0', '#2bffb8', '#ff4d4d', '#ffd166', '#2bffb8', '#0f4a3a']),
      smLook('deepspace', 'Deep Space', 'wide', 'fx-sky fx-stars', ['#03040b', '#0a0d1d', '#232a4d', '#e8ecff', '#8b93c2', '#9db2ff', '#ff7a59', '#ffd479', '#7ec8ff', '#2a3156']),
      smLook('missionred', 'Mission Red', 'poster', 'fx-scan sh-under', ['#070707', '#121212', '#2e2e2e', '#f4f4f4', '#9a9a9a', '#e10600', '#e10600', '#ffcc00', '#e8e8e8', '#333333']),
      smLook('tuxedo', 'Tuxedo', 'classic', 'sh-deco', ['#0c0b09', '#17150f', '#3a3326', '#f5efe1', '#a89f88', '#c9a24a', '#d4553a', '#e8c776', '#c9a24a', '#3a3326']),
      smLook('aurora', 'Aurora', 'grotesk', 'fx-aurora fx-stars sh-round', ['#050b1a', '#0b1630', '#213a66', '#eaf6ff', '#8fb0d6', '#5cf2b6', '#ff7b9c', '#ffd479', '#6ad7ff', '#23365c']),
      smLook('cyberpunk', 'Cyberpunk', 'mil', 'fx-scan sh-neon sh-cut', ['#0a0a12', '#13131f', '#2e2e4a', '#f0f0ff', '#8a8ab0', '#fcee0a', '#ff2a6d', '#fcee0a', '#05d9e8', '#2b2b45']),
      smLook('marsbase', 'Mars Base', 'round', 'fx-sky sh-round', ['#1a0d08', '#271410', '#5a2f20', '#ffe9dc', '#c49a85', '#ff7a3c', '#ff4f2e', '#ffc06b', '#8fd3ff', '#4a2a1e']),
      smLook('noir', 'Noir', 'poster', 'fx-scan', ['#0e0e10', '#18181b', '#303036', '#e9e9ea', '#8e8e94', '#f2c94c', '#e04e39', '#f2c94c', '#9fb4c7', '#2c2c31']),
      // design movements
      smLook('bauhaus', 'Bauhaus', 'grotesk', 'lite sh-thick sh-block', ['#f2ece0', '#e8e0d0', '#1a1a1a', '#111111', '#555048', '#d42a20', '#d42a20', '#f2b705', '#1d4e9e', '#c9bfae']),
      smLook('swiss', 'Swiss', 'swiss', 'lite sh-under', ['#ffffff', '#f3f3f3', '#e0e0e0', '#000000', '#666666', '#ff2a1a', '#ff2a1a', '#ff9f1a', '#000000', '#cfcfcf']),
      smLook('brutalist', 'Brutalist', 'brut', 'lite fx-dots sh-thick sh-block', ['#b8b6b0', '#c9c7c1', '#3d3c39', '#121212', '#3d3c39', '#121212', '#ff3b00', '#c78a00', '#1b4f8a', '#8f8d88']),
      smLook('artdeco', 'Art Deco', 'deco', 'sh-deco', ['#0f1a17', '#15241f', '#3c5a4c', '#f3ead3', '#b4a989', '#d4af63', '#e0674a', '#e8cf8e', '#7fc4a8', '#2c4239']),
      smLook('midcentury', 'Mid Century', 'midcen', 'lite sh-round', ['#f4ead5', '#ebdfc4', '#c9b48c', '#2b2118', '#6e5c45', '#e06c2b', '#c8432b', '#e9a93b', '#2e7d74', '#cdbb97']),
      smLook('desert', 'Desert Modern', 'gallery', 'lite sh-round', ['#f7e4d4', '#f2d6c1', '#dbb497', '#3a2418', '#8a6551', '#e2725b', '#c94c3a', '#e9a24f', '#3d8f8a', '#e0c0a8']),
      smLook('nordic', 'Nordic', 'calm', 'lite sh-round', ['#f5f4f0', '#ecebe6', '#d6d3ca', '#23262b', '#6b7078', '#4a6c8c', '#c0573e', '#d9a441', '#4a6c8c', '#cfccc2']),
      // places
      smLook('tahoe', 'Tahoe', 'grotesk', 'fx-sky sh-round', ['#0b1e2b', '#102a3b', '#24506b', '#eaf4fa', '#8fb2c7', '#3fb7d9', '#ff8a4c', '#ffd27a', '#7fe0c4', '#23445a']),
      smLook('granite', 'Sierra Granite', 'cond', 'fx-dots sh-thick', ['#2a2b2d', '#333538', '#55585e', '#f1efe9', '#a8a59c', '#c7b9a0', '#e0703f', '#e6c16c', '#8fb8c9', '#46484c']),
      smLook('redwood', 'Redwood', 'serif', 'sh-round', ['#1b0f0c', '#271612', '#4d2c22', '#f6e8de', '#b9917d', '#c4553a', '#e0563a', '#e8b46a', '#8bbf7a', '#3d241c']),
      smLook('fogcity', 'Fog City', 'swiss', 'lite sh-under', ['#e9ecef', '#dfe3e7', '#c3c9cf', '#1f2a33', '#5f6b75', '#c0362c', '#c0362c', '#d99a2b', '#2c6e91', '#bfc6cc']),
      // paper and print
      smLook('paper', 'Paper', 'serif', 'lite', ['#faf7f0', '#f2eee3', '#ddd6c4', '#1b1a17', '#6b6658', '#b0302a', '#b0302a', '#c98a1b', '#1f4f7a', '#d8d1bf']),
      smLook('kraft', 'Kraft', 'shoulders', 'lite sh-thick sh-block', ['#c9a77c', '#d4b48b', '#8b6b43', '#2a1b0c', '#5a4126', '#2a1b0c', '#9e2b1d', '#7a5410', '#1e3d59', '#a78a62']),
      smLook('sepia', 'Sepia', 'classic', 'fx-scan sh-round', ['#2b2218', '#362a1e', '#5c4a35', '#f2e3c8', '#b9a27f', '#d9a35b', '#e07a4f', '#e8c67d', '#9fc2a5', '#4f3f2c']),
      smLook('inkwash', 'Ink Wash', 'zen', 'lite', ['#f4f1ea', '#ebe6dc', '#cfc8b8', '#1a1a1a', '#6d675c', '#b33a2c', '#b33a2c', '#b7892b', '#2f4f4f', '#d3ccbd']),
      // soft color
      smLook('sakura', 'Sakura', 'midcen', 'lite sh-round', ['#fff4f6', '#ffe8ee', '#f3c6d3', '#3b1f2b', '#8a5d6e', '#d94f7f', '#d6455c', '#e7a23f', '#4f86b8', '#efd0da']),
      smLook('jade', 'Jade', 'calm', 'sh-round', ['#062019', '#0b2c23', '#1d5544', '#e6fff6', '#86bfab', '#3ddc97', '#ff7a6b', '#f6d36b', '#6fd0ff', '#1b4a3c']),
      smLook('lavender', 'Lavender Dusk', 'round', 'fx-sky sh-round', ['#1d1730', '#271f3e', '#463b6b', '#f2edff', '#a99fcf', '#b69cff', '#ff8fa3', '#ffd38a', '#8fd1ff', '#3c3460']),
      smLook('mint', 'Mint', 'calm', 'lite sh-round', ['#effaf5', '#e2f5ec', '#bfe5d3', '#13342a', '#4d7a6b', '#0f9a72', '#e0574b', '#d99a25', '#2a7fd4', '#c9e9da']),
      smLook('reef', 'Coral Reef', 'sign', 'fx-sky fx-stars sh-round', ['#062a33', '#0a3741', '#1d6170', '#e8fbff', '#8cc3cf', '#ff7f6a', '#ff5e5b', '#ffd166', '#2fe3d0', '#1d4c57']),
      smLook('espresso', 'Espresso', 'grotesk', 'sh-round', ['#1c140f', '#271c16', '#4a372b', '#f3e7dc', '#b29a86', '#d29b62', '#e56b4e', '#e9c27d', '#9fc6b0', '#3e2f26']),
      smLook('bordeaux', 'Bordeaux', 'serif', 'sh-deco', ['#1f0a10', '#2c1018', '#561e2e', '#fbe9ee', '#c693a2', '#e05a7a', '#ff6b5b', '#f2c46d', '#9ad0c4', '#4a1a28']),
      // metals and night
      smLook('midnight', 'Midnight', 'wide', 'fx-stars', ['#0b1020', '#131b34', '#2a375f', '#eef2ff', '#96a3c9', '#c7d2f0', '#ff7a7a', '#ffd27a', '#7cc4ff', '#26304f']),
      smLook('graphite', 'Graphite', 'swiss', '', ['#141414', '#1d1d1d', '#333333', '#f2f2f2', '#8c8c8c', '#ffffff', '#ff5c39', '#ffc94d', '#bdbdbd', '#3a3a3a']),
      smLook('titanium', 'Titanium', 'cond', 'sh-thick sh-cut', ['#1d2126', '#262b31', '#424a54', '#eef2f5', '#9aa5b1', '#7fd1e8', '#ff8655', '#f0cc6a', '#7fd1e8', '#39414a']),
      smLook('copper', 'Copper', 'shoulders', 'sh-thick', ['#1a1210', '#251a16', '#4d3127', '#fbeee6', '#c19c8a', '#d9825b', '#ff5f45', '#f0b86e', '#6ec7c0', '#43302a']),
      smLook('brass', 'Brass', 'classic', 'sh-deco fx-dots', ['#18140c', '#231d12', '#4c3d22', '#f3e6c4', '#b19e72', '#c9a14a', '#c8553a', '#e3c069', '#7fb3a0', '#3c321e']),
      smLook('solar', 'Solar Flare', 'round', 'fx-sky sh-neon sh-grad sh-chrome', ['#120900', '#1e1003', '#4d2a06', '#fff4e0', '#c9a172', '#ffb627', '#ff4e1a', '#ffd166', '#6fd3ff', '#3f2509']),
      // water and woods
      smLook('arctic', 'Arctic', 'grotesk', 'lite sh-round', ['#eef6fb', '#e1eff7', '#c3dbea', '#0f2a3d', '#4f7189', '#1a86c9', '#e2553f', '#d99a22', '#1a86c9', '#cbe0ec']),
      smLook('ocean', 'Ocean Deep', 'grotesk', 'fx-sky fx-stars sh-round', ['#021526', '#042137', '#0d3d5e', '#e3f4ff', '#7fa9c6', '#2ec4ff', '#ff8c42', '#ffd166', '#3df2c8', '#0f3653']),
      smLook('forest', 'Forest', 'calm', 'sh-round fx-dots', ['#0d1a12', '#14261a', '#2b4a34', '#eaf5ec', '#9dbca4', '#8fd16a', '#ff8a5b', '#f2d06b', '#6fc3d9', '#26412e']),
      // loud
      smLook('tokyo', 'Neon Tokyo', 'sign', 'fx-sky fx-scan sh-neon sh-grad', ['#0b0714', '#150d24', '#3a2456', '#fdf0ff', '#b39ad1', '#ff2fd6', '#ff3860', '#ffe14d', '#22e4ff', '#35244e']),
      smLook('pixel', 'Pixel Arcade', 'pixel', 'fx-scan fx-dots sh-thick', ['#101018', '#191927', '#33334d', '#f5f5ff', '#9a9ac2', '#7cff4f', '#ff4f6d', '#ffd84f', '#4fc3ff', '#2e2e45']),
      smLook('whiteroom', 'White Room', 'wide', 'lite', ['#f7f7f5', '#ededea', '#d6d6d2', '#111111', '#6a6a66', '#e2231a', '#e2231a', '#e0961a', '#2a5d9c', '#cfcfca']),
      // 9.1: architectural sketches. Hand lettering, vellum grid, lines that overshoot the corners and wobble like a pencil.
      // Graphite on trace, redline for what needs you, blue pencil for working; and the same on a blackline sheet
      smLook('sketch', 'Sketch', 'sketch', 'lite fx-sketch', ['#f7f5ef', '#efece4', '#57544d', '#1d1c1a', '#6d6a63', '#1d1c1a', '#c8342a', '#d98a1c', '#2a5d9c', '#c9c5ba'], { v: {
        grid: 'rgba(29,28,26,.05)', dot: 'rgba(29,28,26,.1)', panel: 'rgba(250,249,245,.92)' } }),
      smLook('sketchnight', 'Sketch Night', 'sketch', 'fx-sketch', ['#121314', '#1b1c1e', '#9a9a96', '#f3f1ea', '#a6a49d', '#f3f1ea', '#ff6b5a', '#ffcc66', '#7cc4ff', '#3d3e41'], { v: {
        grid: 'rgba(243,241,234,.045)', dot: 'rgba(243,241,234,.09)', panel: 'rgba(22,23,25,.92)' } }),
      // 9.4: the sketch family by how sketchy: Trace barely wobbles, Sketch is the middle, Marker is bold felt tip,
      // Charcoal smudges and shakes, Chalkboard is heavy chalk on a green board, Funnies is comic ink on newsprint
      smLook('trace', 'Trace', 'pencil', 'lite fx-sketch sk-1', ['#fcfcfa', '#f3f2ee', '#a3a19a', '#2b2a28', '#7a7872', '#2b2a28', '#d0443a', '#d9962a', '#3f6fa8', '#dcd9d1'], { v: {
        grid: 'rgba(43,42,40,.03)', dot: 'rgba(43,42,40,.07)', panel: 'rgba(252,252,250,.94)' } }),
      smLook('marker', 'Marker', 'marker', 'lite fx-sketch sk-2 sh-thick', ['#ffffff', '#f5f5f3', '#222222', '#111111', '#555555', '#111111', '#e8322a', '#f5a300', '#1f6fd1', '#cfcfcf'], { v: {
        grid: 'rgba(0,0,0,0)', dot: 'rgba(17,17,17,.06)', panel: 'rgba(255,255,255,.95)' } }),
      smLook('charcoal', 'Charcoal', 'charcoal', 'lite fx-sketch sk-3', ['#e9e6df', '#dedad1', '#3b3a37', '#121211', '#55534e', '#121211', '#a8241b', '#b97a12', '#23466e', '#b9b4a8'], { v: {
        grid: 'rgba(18,18,17,.04)', dot: 'rgba(18,18,17,.08)', panel: 'rgba(236,233,226,.93)' } }),
      smLook('chalk', 'Chalkboard', 'chalk', 'fx-sketch sk-3 sk-chalk', ['#1f3a2f', '#25443a', '#a9b8ae', '#f1f2ea', '#b5c2b8', '#f1f2ea', '#ff8f80', '#ffe08a', '#9ed4ff', '#3d5a4e'], { v: {
        grid: 'rgba(241,242,234,.03)', dot: 'rgba(241,242,234,.06)', panel: 'rgba(31,58,47,.93)' } }),
      smLook('funnies', 'Funnies', 'funnies', 'lite fx-comic sh-thick', ['#f6eed8', '#efe3c4', '#1a1a1a', '#151515', '#4a4438', '#e23b2e', '#e23b2e', '#f2b705', '#1f63c6', '#cbbf9f'], { v: {
        dot: 'rgba(226,59,46,.16)', panel: '#fffaf0' } }),
      // 9.4: genre looks, each an original take on a mood: space opera, 80s overdrive, a dime novel cover,
      // a desert bar's neon after dark, a dystopian bunker's terminal
      smLook('opera', 'Space Opera', 'opera', 'fx-stars sh-cut', ['#04050a', '#0b0e18', '#2a3550', '#e9eef8', '#8e9ab5', '#ffc94a', '#ff5a47', '#ffc94a', '#7fc8ff', '#26304a']),
      smLook('overdrive', 'Overdrive', 'drive', 'fx-floor sh-chrome sh-grad sh-stripe', ['#0c0604', '#1a0d07', '#4a2a18', '#fff3e8', '#c9a58c', '#ff7a1a', '#ff3b2f', '#ffc23d', '#4fd6ff', '#3a2418']),
      smLook('dime', 'Dime Novel', 'dime', 'lite sh-thick', ['#efe2c2', '#e6d5ad', '#5a4630', '#2a1d12', '#6e5a41', '#b8321f', '#b8321f', '#c98a12', '#2f5872', '#cdb98e']),
      smLook('desertneon', 'Desert Neon', 'saloon', 'fx-sky sh-neon', ['#120a14', '#1f1020', '#4a2840', '#ffeef6', '#c49bb4', '#ff3b6b', '#ff3b6b', '#ffb23d', '#34e0c8', '#3c2236']),
      smLook('bunker', 'Bunker', 'bunker', 'fx-scan fx-crt', ['#0d110c', '#151b13', '#2e3a28', '#d5e6c6', '#8ea381', '#9bdc5c', '#e0563a', '#e6b33e', '#9bdc5c', '#28331f'])
    ].forEach((t) => { SM_THEMES[t.id] = t; });
    // 9.3: RETRO SKY. Retro futurist, and its sky follows the clock: violet night, rosy dawn, a pale morning,
    // a bright blue noon, golden hour, then the sunset the Retro look is known for
    const SM_PHASES = [[0, 'night', 'Night'], [300, 'dawn', 'Dawn'], [450, 'morning', 'Morning'], [660, 'midday', 'Noon'], [960, 'golden', 'Golden hour'], [1110, 'dusk', 'Dusk'], [1260, 'night', 'Night']];
    function smPhase(d) {
      d = d || new Date();
      const m = d.getHours() * 60 + d.getMinutes();
      let p = SM_PHASES[0];
      for (const x of SM_PHASES) if (m >= x[0]) p = x;
      return p;
    }
    const SM_SKY = {
      night: ['fx-floor fx-stars fx-scan sh-neon sh-grad sh-stripe sh-chrome', ['#07051a', '#110c2c', '#2e2a5e', '#f2eeff', '#9a93c8', '#b26bff', '#ff4f7b', '#ffd36e', '#3ee8ff', '#2c2856']],
      dawn: ['fx-floor fx-stars sh-neon sh-grad sh-stripe sh-chrome', ['#1d1230', '#2a1a40', '#5b3f73', '#fff0f5', '#d1b0c8', '#ff8fab', '#ff5e62', '#ffd27a', '#7fd8ff', '#4a3560']],
      morning: ['lite fx-floor sh-grad sh-stripe', ['#fff3ea', '#ffe6d6', '#e8b9a0', '#2a1630', '#7a5a6e', '#ff5c8a', '#e8324f', '#d97a00', '#0089b8', '#e7cfc2'],
        'radial-gradient(ellipse 34% 26% at 30% 58%,rgba(255,196,140,.55),transparent 72%),linear-gradient(180deg,#ffd9c7 0%,#ffeadf 34%,#fff3ea 56%,#fff3ea 100%)'],
      midday: ['lite fx-floor sh-grad sh-stripe', ['#eaf7ff', '#d6efff', '#9fcde8', '#14193a', '#4f5f80', '#ff3e9a', '#e3264b', '#d27000', '#0088c8', '#c5dcea'],
        'radial-gradient(ellipse 22% 18% at 50% 30%,rgba(255,255,255,.95),transparent 70%),linear-gradient(180deg,#8fd3ff 0%,#c7ebff 38%,#eaf7ff 56%,#eaf7ff 100%)'],
      golden: ['fx-floor fx-sky sh-neon sh-grad sh-stripe sh-chrome', ['#1e0d07', '#2c140b', '#6b3420', '#fff1e2', '#d9ab8c', '#ff9a3c', '#ff4f3a', '#ffd166', '#39d5ff', '#4e2a1c']],
      dusk: ['fx-floor fx-stars fx-scan sh-neon sh-grad sh-stripe sh-chrome', ['#0b0616', '#170d29', '#3d2a63', '#fbefff', '#ab98cf', '#ff3e9a', '#ff6a3d', '#ffc35a', '#35d3ff', '#3e3060']]
    };
    function smRetroSky(p) {
      p = p || smPhase();
      const k = SM_SKY[p[1]] || SM_SKY.dusk, t = smLook('retrosky', 'Retro Sky', 'arcade', k[0], k[1], { wf: 'Monoton', tag: 'RETRO SKY', v: k[2] ? { sky: k[2] } : {} });
      t.look = 'Retro Sky · ' + p[2]; t.phase = p[1]; t.clock = true;
      return t;
    }
    SM_THEMES.retrosky = smRetroSky();
    // 9.3: every look in order from dark to light, so a step never jumps from black to white. The dark looks run in
    // bands, each band sweeping through the colors and the next one sweeping back, so neighbors stay close in color.
    // Retro Sky leads, since it follows the clock
    const smLab = (h) => {
      const [r, g, b] = smRgb(h).map((x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
      const f = (u) => (u > 0.008856 ? Math.cbrt(u) : 7.787 * u + 16 / 116);
      const X = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047), Y = f(r * 0.2126 + g * 0.7152 + b * 0.0722), Z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
      return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
    };
    function smOrderLooks(ids) {
      const hue = (v) => {
        const c = [v.accent, v.work, v.need, v.bg].map(smLab), ch = c.map((x) => Math.hypot(x[1], x[2]));
        const k = ch[0] > 20 ? 0 : ch.indexOf(Math.max(...ch));
        return (Math.atan2(c[k][2], c[k][1]) * 180 / Math.PI + 380) % 360;
      };
      const info = ids.map((id) => ({ id, L: smLab(SM_THEMES[id].v.bg)[0], h: hue(SM_THEMES[id].v) }));
      const dark = info.filter((x) => x.L < 50).sort((a, b) => a.L - b.L), lite = info.filter((x) => x.L >= 50).sort((a, b) => a.L - b.L || a.h - b.h);
      const out = [];
      for (let i = 0, band = 0; i < dark.length; i += 9, band++) out.push(...dark.slice(i, i + 9).sort((a, b) => (band % 2 ? b.h - a.h : a.h - b.h)));
      return out.concat(lite).map((x) => x.id);
    }
    const SM_LOOKS = ['retrosky'].concat(smOrderLooks(Object.keys(SM_THEMES).filter((id) => id !== 'retrosky')));   // 9.3: dark to light   // 9.0.1: the order Look steps through, CHxTLD, Tron, Retro, Night drive first
    // fonts a look needs, fetched the first time you land on it; the startup set is already in hand
    const smFontAsked = new Set(['Orbitron', 'Exo 2', 'Rajdhani', 'Barlow', 'Share Tech Mono', 'Shippori Mincho', 'EB Garamond', 'JetBrains Mono', 'Audiowide', 'Monoton', 'Syncopate', 'Barlow Condensed']);
    const smFontBuf = new Map();
    function smFontsFor(t, onload) {
      if (typeof GM_xmlhttpRequest !== 'function' || typeof FontFace !== 'function' || !t || !t.f || !t.f.fams) return;
      t.f.fams.forEach((fam) => {
        const spec = SM_FONT_SPEC[fam];
        if (!spec || smFontAsked.has(fam)) return;
        smFontAsked.add(fam);
        try {
          GM_xmlhttpRequest({
            method: 'GET', url: 'https://fonts.googleapis.com/css2?family=' + spec + '&display=swap', headers: { 'User-Agent': navigator.userAgent },
            onload(r) {
              const css = (r && r.responseText) || '', re = /\/\*\s*latin\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
              let m;
              while ((m = re.exec(css))) {
                const b = m[1], wt = (/font-weight:\s*(\d+)/.exec(b) || [])[1] || '400', u = (/url\((https:[^)]+)\)/.exec(b) || [])[1];
                if (!u) continue;
                if (!smFontBuf.has(u)) smFontBuf.set(u, new Promise((res) => {   // one download per file, however many weights share it
                  try { GM_xmlhttpRequest({ method: 'GET', url: u, responseType: 'arraybuffer', onload: (x) => res(x.response), onerror: () => res(null) }); } catch (e) { res(null); }
                }));
                smFontBuf.get(u).then((buf) => {
                  if (!buf) return;
                  try { new FontFace(fam, buf, { weight: wt }).load().then((f) => { document.fonts.add(f); if (onload) onload(); }).catch(() => {}); } catch (e) {}
                });
              }
            }
          });
        } catch (e) {}
      });
    }
    // 8.9.3: the floor grid's rays, from the vanishing point on the horizon out past both edges
    const SM_RAYS = (() => { let o = ''; for (let k = -26; k <= 26; k++) o += '<line x1="1306" y1="0" x2="' + (1306 + k * 165) + '" y2="100"></line>'; return o; })();
    const SM_SAT = { need: 1, question: 0.86, wait: 0.7, turn: 0.55, work: 0.45, idle: 0.16 };
    const SM_WT = { need: 5, question: 4, wait: 3, turn: 2.5, work: 2, idle: 1 };
    const SM_COLKEY = { need: 'need', question: 'need', wait: 'wait', turn: 'wait', work: 'work', idle: 'idle' };
    const smKind = (e) => {
      if (e && e.deck) return e.deckN > 0 ? 'question' : 'idle';   // 8.1: the Swipe Deck rides along as a wedge
      if (e && e.chief) return !e.closed && e.chiefN > 0 ? 'question' : 'idle';   // 9.0: and Chief of Staff
      if (e && e.outbox) return !e.closed && e.oxN > 0 ? 'question' : 'idle';   // 9.1: and the Outbox, lit while drafts are ready
      if (!e || e.on === false) return 'idle';
      if (e.state === 'red') return 'need';
      if (e.state === 'yellow') return e.ask ? 'question' : e.seen ? 'turn' : 'wait';
      if (e.state === 'green') return 'work';
      return 'idle';
    };
    const smCol = (t, k) => t.v[SM_COLKEY[k] || 'idle'];
    const smPad = (n) => String(n).padStart(2, '0');
    const smEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const smF1 = (x) => (Math.round(x * 10) / 10).toString();
    const smPol = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; };
    const smTrunc = (s, n) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; };
    function smClock(ms) {
      const s = Math.max(0, Math.floor(ms / 1000));
      if (s < 3600) return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      return Math.floor(s / 3600) + 'h' + String(Math.floor(s / 60) % 60).padStart(2, '0');
    }
    function smSector(r0, r1, a0, a1) {
      if (a1 - a0 >= 359.5) a1 = a0 + 359.5;
      const lg = a1 - a0 > 180 ? 1 : 0, p0 = smPol(r1, a0), p1 = smPol(r1, a1), p2 = smPol(r0, a1), p3 = smPol(r0, a0);
      return 'M' + smF1(p0[0]) + ',' + smF1(p0[1]) + ' A' + r1 + ',' + r1 + ' 0 ' + lg + ' 1 ' + smF1(p1[0]) + ',' + smF1(p1[1]) +
        ' L' + smF1(p2[0]) + ',' + smF1(p2[1]) + ' A' + r0 + ',' + r0 + ' 0 ' + lg + ' 0 ' + smF1(p3[0]) + ',' + smF1(p3[1]) + ' Z';
    }
    const smTxt = (x, y, s, size, fill, font, extra) => '<text x="' + smF1(x) + '" y="' + smF1(y) + '" font-size="' + size + '" fill="' + fill + '" font-family=\'' + font + '\' dominant-baseline="central"' + (extra == null ? ' text-anchor="middle"' : extra) + '>' + smEsc(s) + '</text>';
    function smTicks(t, r, n, len, every) {
      let o = '';
      for (let k = 0; k < n; k++) {
        const d = k * 360 / n, big = every && k % every === 0, a = smPol(r, d), b = smPol(r + (big ? len * 2 : len), d);
        o += '<line x1="' + smF1(a[0]) + '" y1="' + smF1(a[1]) + '" x2="' + smF1(b[0]) + '" y2="' + smF1(b[1]) + '" stroke="' + t.v.line + '" stroke-width="' + (big ? 2 : 1) + '"></line>';
      }
      return o;
    }
    function smStatus(e, k) {
      if (e && e.deck) return e.deckN ? (e.nVisual || 0) + ' visual · ' + (e.nAudio || 0) + ' audio' : 'Clear';
      if (e && e.chief) return e.closed ? 'Not open · click to open' : (e.nNeeds || 0) + ' need you' + (e.nBlocked ? ' · ' + e.nBlocked + ' blocked' : '') + ' · ' + (e.nRun || 0) + ' running';
      if (e && e.outbox) return e.closed ? 'Not open · click to open' : (e.oxN || 0) + ' ready · ' + (e.nHold || 0) + ' on hold';   // 9.1
      if (k === 'need') return e.folder ? 'Needs a folder' : e.reqKey ? 'Needs approval' : 'Urgent';
      if (k === 'question') return 'Question';
      if (k === 'wait') return 'Waiting';
      if (k === 'turn') return 'Your turn';
      if (k === 'work') return 'Working';
      return e && e.on === false ? 'Off' : 'Idle';
    }
    function smAction(e, k) {
      if (k === 'need') return e.folder ? 'ALLOW FOLDER' : e.reqKey ? 'APPROVE' : 'URGENT';
      if (k === 'question') return 'ANSWER';
      return 'YOUR TURN';
    }
    const smRank = (e, k) => (k === 'need' ? (e.reqKey || e.folder ? 0 : 1) : k === 'question' ? 2 : k === 'wait' ? 3 : 4);
    const smWaits = (k) => k === 'need' || k === 'question' || k === 'wait';
    // the chat a click on NEXT (or saying next) lands on: requests first, then the longest wait
    function smNext(tabs, fid) {
      return tabs.map((e, i) => ({ e, i, k: smKind(e) })).filter((x) => !x.e.deck && !x.e.chief && !x.e.outbox && x.e.id !== fid && (smWaits(x.k) || x.k === 'turn'))
        .sort((x, y) => smRank(x.e, x.k) - smRank(y.e, y.k) || (x.e.since || 0) - (y.e.since || 0))[0] || null;
    }
    // 8.0: the switches in the control panel: key, label, what it does
    // 9.1: the ways HQ can draw your chats. The View pill steps through them; its name opens them all
    const SM_VIEWS = [['pie', 'Pie', 'Wedges and load rails'], ['radar', 'Radar', 'Rings by need, a sweep'], ['puzzle', 'Puzzle', 'A piece per chat'],
      ['seismo', 'Seismograph', 'Traces that quake'], ['mixer', 'Mixer', 'Channel strips and meters'], ['orbit', 'Orbit', 'Close orbits need you'],
      ['lanes', 'Lanes', 'Four columns'], ['timeline', 'Timeline', 'Twenty minute bars'], ['board', 'Departures', 'Split flap, urgent first'],
      ['hive', 'Honeycomb', 'Hex cells round the hub'], ['treemap', 'Treemap', 'Ground by need']];
    const SM_VIEW_ICON = {   // 44 by 44 glyphs for the picker, drawn in the accent
      pie: '<circle cx="22" cy="22" r="17"/><path d="M22 22 L22 5 M22 22 L37 30 M22 22 L8 32"/>',
      radar: '<circle cx="22" cy="22" r="17"/><circle cx="22" cy="22" r="10"/><path d="M22 22 L34 10"/><circle cx="30" cy="27" r="2.5" fill="currentColor"/>',
      puzzle: '<path d="M8 12 h9 c0 -5 7 -5 7 0 h9 v9 c5 0 5 7 0 7 v9 h-9 c0 -5 -7 -5 -7 0 h-9 Z"/>',
      seismo: '<path d="M4 22 h7 l3 -10 l4 20 l4 -26 l4 30 l3 -14 h11"/>',
      mixer: '<path d="M11 6 v32 M22 6 v32 M33 6 v32"/><rect x="7" y="24" width="8" height="5"/><rect x="18" y="12" width="8" height="5"/><rect x="29" y="18" width="8" height="5"/>',
      orbit: '<ellipse cx="22" cy="22" rx="18" ry="8"/><circle cx="22" cy="22" r="5" fill="currentColor"/><circle cx="37" cy="25" r="3"/>',
      lanes: '<rect x="5" y="7" width="7" height="30"/><rect x="15" y="7" width="7" height="20"/><rect x="25" y="7" width="7" height="25"/><rect x="35" y="7" width="4" height="12"/>',
      timeline: '<path d="M6 11 h32 M14 22 h24 M24 33 h14"/><path d="M38 6 v32" stroke-dasharray="2 3"/>',
      board: '<rect x="5" y="8" width="34" height="9"/><rect x="5" y="20" width="34" height="9"/><rect x="5" y="32" width="34" height="5"/><path d="M5 12.5 h34 M5 24.5 h34"/>',
      hive: '<path d="M22 6 l7 4 v8 l-7 4 l-7 -4 v-8 Z M13 21 l7 4 v8 l-7 4 l-7 -4 v-8 Z M31 21 l7 4 v8 l-7 4 l-7 -4 v-8 Z"/>',
      treemap: '<rect x="5" y="6" width="34" height="32"/><path d="M24 6 v32 M5 24 h19 M24 17 h15 M32 17 v21"/>'
    };
    const SM_CTL = [
      ['read', 'Read aloud', 'New replies are read to you as they finish'],
      ['mic', 'Mic after', 'Your mic opens by itself when a reading or a Switcheroo line ends'],
      ['send', 'Auto send', 'Dictation sends itself after a pause'],
      ['chimes', 'Chimes', 'Switcheroo chimes and tells you who needs you'],
      ['others', 'Other tabs', 'Click to step through: videos pause while we talk, videos turn down, or other tabs are left alone. Live and sports always turn down'],   // 8.4: one switch, three ways
      ['voice', 'ElevenLabs', 'Replies read in the ElevenLabs voice; off uses Claude\'s own read aloud'],
      ['along', 'Read along', 'Updates Claude sends while it is still working are read as they land']   // 8.7
    ];
    const SM_HP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>';

    // the chat's own markup, minus anything that could run or navigate
    function smClean(html) {
      const tp = document.createElement('template');
      tp.innerHTML = html || '';
      tp.content.querySelectorAll('script,iframe,object,embed,link,meta,base,form,style,button,textarea,input,select').forEach((n) => n.remove());
      tp.content.querySelectorAll('*').forEach((el) => {
        for (const a of [...el.attributes]) {
          if (/^on/i.test(a.name)) el.removeAttribute(a.name);
          else if (/^(href|src|xlink:href|action|formaction)$/i.test(a.name) && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
        }
      });
      return tp.content;
    }

    function smCss() {
      return [
        '.smx{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;overflow:hidden;background:var(--bg);color:var(--ink);font-family:var(--bf);-webkit-font-smoothing:antialiased;text-align:left}',
        '.smx *{box-sizing:border-box}',
        '.smx [hidden]{display:none!important}',
        '.smx .gridbg{position:absolute;inset:0;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:48px 48px}',
        '.smx .tx{position:absolute;left:20px;top:20px;bottom:20px;width:760px;background:var(--panel);border:1px solid var(--line);display:flex;flex-direction:column;min-height:0}',
        '.smx .hd{padding:26px 34px 18px;border-bottom:1px solid var(--line)}',
        '.smx .kick{display:flex;align-items:center;gap:10px;font:18px var(--mf);letter-spacing:.2em;color:var(--mute);text-transform:uppercase}',
        '.smx .kick svg{width:22px;height:22px}',
        '.smx .ttl{margin-top:10px;font:700 46px/1.04 var(--hf);text-transform:uppercase;letter-spacing:.02em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}',
        '.smx .sts{margin-top:8px;font:22px var(--mf);color:var(--sc,var(--mute))}',
        '.smx .msgs{flex:1;min-height:0;overflow-y:auto;padding:24px 34px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}',
        '.smx .mz{display:flex;flex-direction:column;justify-content:flex-end;gap:26px;min-height:100%;font-size:var(--fs,26px);line-height:1.42}',
        '.smx .mw{color:var(--mute);font:22px var(--mf);letter-spacing:.08em;text-align:center;margin:auto 0}',
        '.smx .msg{min-width:0}',
        '.smx .msg.old{opacity:.5}',
        '.smx .msg .who{font:600 17px var(--mf);letter-spacing:.2em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}',
        '.smx .msg.c .who{color:var(--accent)}',
        '.smx .msg .body,.smx .msg .body *{color:inherit!important;background:transparent!important;border-color:var(--line)!important;box-shadow:none!important;font-family:inherit!important;font-size:1em!important;line-height:inherit!important;max-width:100%!important;pointer-events:none!important}',
        '.smx .msg.y .body{color:var(--mute)!important}',
        '.smx .msg.c .body{color:var(--ink)!important}',
        '.smx .msg .body :is(h1,h2,h3,h4,h5,h6){font-family:var(--hf)!important;font-weight:700!important;text-transform:uppercase;letter-spacing:.02em;margin:.6em 0 .25em!important}',
        '.smx .msg .body h1{font-size:1.35em!important}.smx .msg .body h2{font-size:1.2em!important}.smx .msg .body h3{font-size:1.08em!important}',
        '.smx .msg .body :is(p,li){margin:.3em 0!important}',
        '.smx .msg .body :is(ul,ol){padding-left:1.2em!important;margin:.3em 0!important}',
        '.smx .msg .body :is(pre,code,kbd){font-family:var(--mf)!important;font-size:.8em!important}',
        '.smx .msg .body pre{background:var(--bg2)!important;border:1px solid var(--line)!important;padding:14px 16px!important;white-space:pre-wrap!important;overflow:hidden!important;max-height:14em}',
        '.smx .msg .body :not(pre)>code{background:var(--bg2)!important;padding:0 6px!important}',
        '.smx .msg .body a{text-decoration:underline!important;text-decoration-color:var(--accent)!important}',
        '.smx .msg .body table{border-collapse:collapse!important}',
        '.smx .msg .body :is(td,th){border:1px solid var(--line)!important;padding:4px 10px!important}',
        '.smx .msg .body img{height:auto!important;border:1px solid var(--line)!important}',
        '.smx .msg .body blockquote{border-left:4px solid var(--accent)!important;padding-left:14px!important;margin:.4em 0!important}',
        '.smx .dock{position:relative;margin:0 34px 18px;background:var(--bg2);border:1px solid var(--line);padding:16px 18px;display:flex;flex-direction:column;gap:10px;height:300px;flex:none}',
        '.smx .dock .il{font:15px var(--mf);letter-spacing:.24em;color:var(--mute);text-transform:uppercase}',
        '.smx .dock .im{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}',
        '.smx .dock .im img{max-width:100%;max-height:100%;object-fit:contain;display:block}',
        '.smx .cn{position:absolute;width:18px;height:18px;border-color:var(--accent);border-style:solid;border-width:0}',
        '.smx .cn.a{left:-1px;top:-1px;border-left-width:3px;border-top-width:3px}',
        '.smx .cn.b{right:-1px;top:-1px;border-right-width:3px;border-top-width:3px}',
        '.smx .cn.c{left:-1px;bottom:-1px;border-left-width:3px;border-bottom-width:3px}',
        '.smx .cn.d{right:-1px;bottom:-1px;border-right-width:3px;border-bottom-width:3px}',
        '.smx .draft{display:flex;align-items:flex-start;gap:14px;padding:20px 34px;border-top:1px solid var(--line);font-size:27px;line-height:1.35;flex:none}',
        '.smx .draft .mic{width:14px;height:14px;border-radius:50%;background:var(--need);flex:none;margin-top:12px;animation:smblink 1.4s ease-in-out infinite}',
        '.smx .draft .dw{font:600 17px var(--mf);letter-spacing:.2em;text-transform:uppercase;color:var(--mute);margin-top:7px;flex:none}',
        '.smx .draft .dt{min-width:0;flex:1;white-space:pre-wrap;overflow-wrap:anywhere;max-height:4.1em;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}',
        '.smx .caret{display:inline-block;width:2px;height:30px;background:var(--ink);vertical-align:-6px;margin-left:3px;animation:smblink 1s steps(2) infinite}',
        '.smx .hint{padding:14px 34px 20px;font:15px var(--mf);letter-spacing:.34em;color:var(--mute);text-transform:lowercase;border-top:1px solid var(--line);flex:none}',
        '.smx .draft:not([hidden])+.hint{border-top:0;padding-top:0}',
        // 8.7: the composer under the transcript, and the drop banner over the pie
        '.smx .cmp{flex:none;border-top:1px solid var(--line);padding:16px 34px 16px;display:flex;flex-direction:column;gap:12px}',
        '.smx .cmp+.hint{border-top:0;padding-top:2px}',
        '.smx .cto{display:flex;align-items:center;gap:12px;flex-wrap:wrap;min-height:36px}',
        '.smx .ck2{font:600 15px var(--mf);letter-spacing:.3em;color:var(--mute);text-transform:uppercase}',
        '.smx .cdst{all:unset;cursor:pointer;font:700 17px var(--hf);letter-spacing:.12em;text-transform:uppercase;color:var(--ink);padding:6px 14px;border:1px solid var(--line);background:var(--bg2)}',
        '.smx .cdst.pinned{border-color:var(--accent);color:var(--accent)}',
        '.smx .cfl{display:contents}',
        '.smx .chip{display:inline-flex;align-items:center;gap:8px;font:15px var(--mf);color:var(--ink);padding:5px 10px;border:1px solid var(--line);max-width:320px;min-width:0}',
        '.smx .chip b{font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
        '.smx .chip i{font-style:normal;color:var(--mute);flex:none}',
        '.smx .chip.busy{opacity:.6;animation:smblink 1.4s ease-in-out infinite}',
        '.smx .chip.bad{border-color:var(--need);color:var(--need)}',
        '.smx .crow{display:flex;align-items:flex-end;gap:12px}',
        '.smx .cin{flex:1;min-width:0;resize:none;font:24px/1.35 var(--bf);color:var(--ink);background:var(--bg2);border:1px solid var(--line);padding:12px 16px;height:54px;max-height:170px;outline:none;border-radius:0}',
        '.smx .cin::placeholder{color:var(--mute)}',
        '.smx .cin:focus{border-color:var(--accent)}',
        '.smx .cclip,.smx .csend{all:unset;cursor:pointer;height:54px;display:flex;align-items:center;justify-content:center;font:700 17px var(--hf);letter-spacing:.14em;border:1px solid var(--line);background:var(--bg2);color:var(--ink);flex:none}',
        '.smx .cclip{width:54px;font-size:30px;font-weight:400}',
        '.smx .csend{padding:0 22px;background:var(--accent);border-color:var(--accent);color:var(--bg)}',
        '.smx.dragging .cmp{box-shadow:inset 0 0 0 2px var(--accent)}',
        '.smx .dropov{position:absolute;left:800px;top:100px;width:1100px;padding:18px 0;text-align:center;pointer-events:none;background:var(--panel);border:2px dashed var(--accent);z-index:5}',
        '.smx .dropov .dpt{font:700 30px var(--hf);letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}',
        '.smx .dropov .dps{font:17px var(--mf);letter-spacing:.08em;color:var(--mute);margin-top:6px}',
        '.smx .stage .dhot{filter:brightness(1.45)}',
        '.smx .stage g.dhot .hitbg{fill-opacity:.12}',
        '.smx .bar{position:absolute;left:800px;top:20px;width:1100px;height:62px;display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:center;gap:18px;margin:0;padding:0 20px;border:1px solid var(--line);background:var(--panel)}',
        '.smx .bar .br{font:700 20px var(--hf);letter-spacing:.16em;padding-right:18px;border-right:1px solid var(--line);white-space:nowrap;color:var(--ink)}',
        '.smx.light .bar .br{font-weight:500;letter-spacing:.08em}',
        '.smx .bar .sb{font:700 22px var(--hf);letter-spacing:.32em;text-transform:uppercase;white-space:nowrap}',
        '.smx .bar .dots{display:flex;gap:6px;flex:none}',
        '.smx .bar .dots i{width:12px;height:12px;border-radius:50%;display:block}',
        '.smx .bar .grow{flex:1}',
        '.smx .bar .nx{font:19px var(--mf);color:var(--need);letter-spacing:.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;max-width:520px}',
        '.smx .bar .nx.clear{color:var(--mute)}',
        '.smx .bar .pz{font:15px var(--mf);letter-spacing:.2em;border:1px solid var(--line);padding:6px 12px;color:var(--mute);white-space:nowrap;flex:none}',
        '.smx .bar .pz.on{color:var(--need);border-color:var(--need)}',
        '.smx .stage{position:absolute;left:800px;top:152px;width:1100px;bottom:248px}',   // 9.1: under the pill rail
        '.smx .stage svg{width:100%;height:100%;display:block;overflow:visible}',
        '.smx .pulse{animation:smpulse 1.6s ease-in-out infinite}',
        '@keyframes smpulse{50%{opacity:.5}}',
        '@keyframes smblink{50%{opacity:.35}}',
        '.smx .msg .body li::marker{color:var(--accent)!important}',
        '.smx .stage text{font-variant-numeric:tabular-nums}',
        '.smx .hit{cursor:pointer}',
        '.smx .hit:hover .hitbg{fill-opacity:.07}',
        '.smx path.hit{transition:stroke-width .12s}',
        '.smx path.hit:hover{stroke-width:5}',
        '.smx .bar .br,.smx .bar .nx,.smx .bar .pz{cursor:pointer}',
        '.smx .bar .nx:not(.clear):hover{text-decoration:underline;text-underline-offset:5px}',
        '.smx .bar .pz:hover{border-color:var(--ink);color:var(--ink)}',
        '.smx .bar .br:hover{opacity:.7}',
        '.smx .toast{position:absolute;left:800px;bottom:256px;width:1100px;text-align:center;font:600 22px var(--bf);color:var(--ink);pointer-events:none;opacity:0;transition:opacity .25s}',
        '.smx .toast.on{opacity:1}',
        '.smx .bar .br img{height:44px;width:auto;display:block}',
        '.smx.light .tx{border-top:4px solid var(--accent)}',
        '.smx.light .bar{border-bottom:2px solid var(--accent)}',
        '.smx.light .kick,.smx.light .msg .who,.smx.light .dock .il{font-weight:700;letter-spacing:.14em}',
        '.smx.light .ttl{letter-spacing:0}',
        '.smx.light .hint{color:var(--accent);letter-spacing:.42em}',
        '.smx.light .bar .sb{font-weight:700;letter-spacing:.22em}',
        '.smx.light .bar .nx,.smx.light .bar .pz{font-weight:700;letter-spacing:.08em}',
        // 8.0: the control panel under the pie, HOLD on the left and labeled switches on the right
        '.smx .ctl{position:absolute;left:800px;bottom:20px;width:1100px;height:212px;display:grid;grid-template-columns:300px 1fr;border:1px solid var(--line);background:var(--panel)}',
        '.smx :where(.ctl button){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .ctl button:focus-visible{outline:3px solid var(--ink);outline-offset:-3px}',
        '.smx .hold{display:flex;flex-direction:column;justify-content:center;gap:4px;padding:0 28px;border-right:1px solid var(--line);color:var(--need);box-shadow:inset 0 0 0 3px var(--need)}',
        '.smx .hold .hk{font:600 16px var(--mf);letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}',
        '.smx .hold .hv{font:700 56px/1 var(--hf);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}',
        '.smx .hold .hs{font:17px var(--bf);color:var(--mute)}',
        '.smx .hold:hover{background:var(--bg2)}',
        '.smx .hold.on{background:var(--need);color:var(--bg);box-shadow:none}',
        '.smx .hold.on .hk,.smx .hold.on .hs{color:var(--bg)}',
        '.smx .hold.on:hover{filter:brightness(1.08)}',
        '.smx .tgw{display:flex;flex-direction:column;gap:8px;padding:10px 18px;min-width:0}',
        '.smx .tgh{display:flex;align-items:center;justify-content:space-between;gap:16px;height:30px;min-width:0}',   // 9.4.3: the model pills ride the header, so nothing falls off the bottom
        '.smx .tgh>.ck{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.smx .tgw .ck{font:600 15px var(--mf);letter-spacing:.24em;text-transform:uppercase;color:var(--mute)}',
        '.smx .tgs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 14px}',
        '.smx .mdr{display:flex;flex:none;flex-wrap:nowrap;align-items:center;gap:6px}',
        '.smx .mdr .mk{margin-right:6px}',
        '.smx .mdr .md{padding:4px 12px;border:1.5px solid var(--mute);border-radius:999px;font:600 13px/1.2 var(--mf);letter-spacing:.1em;text-transform:uppercase;color:var(--ink)}',
        '.smx .mdr .md:hover{border-color:var(--ink)}',
        '.smx .ctl.held .mdr{opacity:.45}',
        '.smx .tg{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:12px;row-gap:8px;height:70px;padding:7px 16px;border:1px solid var(--line);background:var(--bg2);min-width:0}',
        '.smx .tg:hover{border-color:var(--ink)}',
        '.smx .tg .tl{grid-column:1/-1;min-width:0;font:600 19px/1.1 var(--bf);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.smx .tg .sw{position:relative;width:50px;height:26px;border-radius:13px;background:var(--line);transition:background .15s}',
        '.smx .tg .sw i{position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:var(--panel);transition:left .15s}',
        '.smx .tg .tv{font:700 16px var(--mf);letter-spacing:.12em;color:var(--mute);white-space:nowrap}',
        '.smx .tg.on .sw{background:var(--accent)}',
        '.smx .tg.on .sw i{left:27px;background:#ffffff}',
        '.smx .tg.on .tv{color:var(--accent)}',
        '.smx .ctl.held .tgs{opacity:.45}',
        '.smx .ctl.held .tgw .ck{color:var(--need)}',
        '.smx.light .ctl{border-top:2px solid var(--accent)}',
        '.smx.light .tg .tl{font-weight:700}',
        '.smx.light .tgw .ck,.smx.light .hold .hk{font-weight:700;letter-spacing:.14em}',
        '.smx.light .tg .sw i{box-shadow:0 1px 2px rgba(0,0,0,.25)}',
        '.smx .bar .pz.held{background:var(--need);color:var(--bg);border-color:var(--need)}',
        // 8.1: approvals and question cards, clickable
        '.smx .asks{position:absolute;left:800px;top:152px;width:1100px;height:300px;border:1px solid var(--line);background:var(--panel);padding:20px 26px;display:flex;flex-direction:column;gap:12px;overflow:hidden;box-shadow:inset 4px 0 0 var(--need)}',
        '.smx.asking .stage{top:468px}',   // 9.1: approvals sit under the pill rail
        '.smx :where(.asks button,.dkov button,.flw){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .asks button:focus-visible,.smx .dkov button:focus-visible,.smx .flw:focus-visible{outline:3px solid var(--ink);outline-offset:2px}',
        '.smx .asks .ak{font:600 17px var(--mf);letter-spacing:.18em;text-transform:uppercase;color:var(--need)}',
        '.smx .asks .arow{display:grid;grid-template-columns:1fr 300px;gap:24px;min-height:0;flex:1}',
        '.smx .asks .atx small{font:17px var(--mf);letter-spacing:.06em;color:var(--mute)}',
        '.smx .asks .atx{font:24px/1.38 var(--bf);color:var(--ink);overflow:hidden;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow-wrap:anywhere}',
        '.smx .asks .abt{display:flex;flex-direction:column;gap:10px}',
        '.smx .ab{display:flex;align-items:center;justify-content:center;height:62px;padding:0 18px;font:700 22px var(--hf);letter-spacing:.08em;text-transform:uppercase;border:2px solid var(--line);color:var(--ink);white-space:nowrap}',
        '.smx .ab:hover{border-color:var(--ink)}',
        '.smx .ab.once{background:var(--need);border-color:var(--need);color:var(--bg)}',
        '.smx .ab.once:hover{filter:brightness(1.08)}',
        '.smx .ab.always{border-color:var(--need);color:var(--need)}',
        '.smx .ab.always.armed{background:var(--ink);border-color:var(--ink);color:var(--bg)}',
        '.smx .ab.deny{color:var(--mute);height:48px;font-size:18px}',
        '.smx .asks .aq{font:600 28px/1.25 var(--bf);color:var(--ink);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
        '.smx .asks .aopts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;min-height:0;overflow:auto;align-content:start;scrollbar-width:thin}',
        '.smx .ao{display:flex;align-items:center;gap:12px;min-height:60px;padding:8px 14px;border:2px solid var(--line);background:var(--bg2);color:var(--ink);min-width:0}',
        '.smx .ao:hover{border-color:var(--ink)}',
        '.smx .ao b{font:700 26px var(--hf);color:var(--accent);flex:none;min-width:24px;text-align:center}',
        '.smx .ao span{font:500 19px/1.2 var(--bf);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
        '.smx .ao em{font:600 13px var(--mf);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--need)}',
        '.smx .ao.rec{border-color:var(--need)}',
        '.smx .ao.on{background:var(--accent);border-color:var(--accent);color:var(--bg)}',
        '.smx .ao.on b{color:var(--bg)}',
        '.smx .asks .aend{display:flex;gap:12px;justify-content:flex-end}',
        '.smx .asks .aend .ab{min-width:180px;height:52px}',
        // 8.1: the transcript follows the voice
        '.smx .msg .body .rdblk{box-shadow:-16px 0 0 -12px var(--accent)!important;transition:box-shadow .4s}',
        // the word being said is a small travelling light; behind it the glow fades off like a comet tail
        '.smx .msg .body .w{border-radius:.22em;transition:opacity .9s cubic-bezier(.2,.7,.3,1),color 1.2s cubic-bezier(.2,.7,.3,1),text-shadow 1.5s cubic-bezier(.2,.7,.3,1),background-color 1s ease,box-shadow 1s ease}',
        '.smx .msg .body.rd .w{opacity:.36}',
        '.smx .msg .body.rd .w.ah{opacity:.7}',
        '.smx .msg .body.rd .w.sd{opacity:1}',
        '.smx .msg .body.rd .w.nw{opacity:1;color:var(--glowink)!important;text-shadow:0 0 .45em var(--glowc),0 0 1.2em var(--glowc2);background-color:var(--glowbg)!important;box-shadow:0 0 0 .14em var(--glowbg)!important;transition:opacity .12s ease,color .12s ease,text-shadow .16s ease,background-color .16s ease,box-shadow .16s ease}',
        '.smx.rdinst .msg .body .w{transition:none!important}',
        '.smx .flw{position:absolute;right:24px;top:24px;font:700 15px var(--mf);letter-spacing:.2em;padding:8px 14px;border:2px solid var(--accent);color:var(--accent);background:var(--panel)}',
        '.smx .flw:hover{background:var(--accent);color:var(--bg)}',
        // 8.1: the pie's center is play and pause
        '.smx .ctr:hover circle.cb{stroke:var(--ink)}',
        // 8.1: Swipe Deck over the pie
        '.smx .stage{transition:opacity .35s,filter .35s}',
        '.smx.decking .stage{opacity:.14;filter:blur(2px)}',
        '.smx.decking.asking .stage{opacity:.14}',
        '.smx .dkov{position:absolute;left:800px;top:100px;width:1100px;bottom:248px;display:flex;flex-direction:column;gap:14px;padding:0 0 46px}',
        '.smx.decking .asks{display:none}',
        '.smx .dkh .dw{border-color:var(--need);color:var(--bg);background:var(--need)}',
        '.smx .dkh{display:flex;align-items:center;gap:12px;height:54px;flex:none}',
        '.smx .dkh .dt{font:700 24px var(--hf);letter-spacing:.24em;text-transform:uppercase;color:var(--ink);margin-right:8px}',
        '.smx .dkh .dd{height:40px;padding:0 14px;display:flex;align-items:center;gap:8px;font:700 16px var(--mf);letter-spacing:.14em;border:1px solid var(--line);color:var(--mute);text-transform:uppercase;background:var(--panel)}',
        '.smx .dkh .dd.on{border-color:var(--accent);color:var(--accent);box-shadow:inset 0 -3px var(--accent)}',
        '.smx .dkh .gr{flex:1}',
        '.smx .dkh .dn{font:18px var(--mf);letter-spacing:.1em;color:var(--mute)}',
        '.smx .dkh .dv.on{background:var(--accent);color:var(--bg);border-color:var(--accent)}',
        '.smx .dkh .dx{width:40px;justify-content:center;font-size:20px}',
        '.smx .dks{position:relative;flex:1;min-height:0}',
        '.smx .dkg{position:absolute;left:50%;top:0;bottom:0;width:780px;border:1px solid var(--line);background:var(--panel)}',
        '.smx .dkg.g1{transform:translate(-50%,16px) scale(.96);opacity:.55}',
        '.smx .dkg.g2{transform:translate(-50%,30px) scale(.92);opacity:.3}',
        '.smx .dkc{--cbg:var(--panel);--cink:var(--ink);--cmu:var(--mute);--cln:var(--line);--cac:var(--accent);--cq:var(--hf);--cb:var(--bf);--cm:var(--mf);position:absolute;left:50%;top:0;bottom:22px;width:780px;transform:translateX(-50%);background:var(--cbg);color:var(--cink);border:1px solid var(--cln);display:flex;flex-direction:column;padding:28px 36px 24px;gap:16px;box-shadow:0 18px 40px rgba(0,0,0,.18);transition:transform .5s cubic-bezier(.2,.7,.3,1),opacity .5s}',
        '.smx .dkc[data-biz="CHxTLD"]{--cbg:#ffffff;--cink:#111111;--cmu:#5c5c5c;--cln:#d9d9d9;--cac:#de6a2d;--cq:Arial,"Helvetica Neue",Helvetica,sans-serif;--cb:Arial,"Helvetica Neue",Helvetica,sans-serif;--cm:Arial,"Helvetica Neue",Helvetica,sans-serif;border-top:4px solid #de6a2d}',
        '.smx .dkc[data-biz="ANDRE MANDEL"]{--cbg:#f3efe6;--cink:#151412;--cmu:#6f695f;--cln:rgba(21,20,18,.22);--cac:#c63a22;--cq:"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif;--cb:"EB Garamond",Garamond,"Times New Roman",serif;--cm:"JetBrains Mono","SF Mono",Menlo,monospace;box-shadow:inset 0 -4px #c63a22,0 18px 40px rgba(0,0,0,.18)}',
        '.smx .dkc .ch{display:flex;align-items:baseline;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--cln)}',
        '.smx .dkc .cw{font:700 16px var(--cm);letter-spacing:.2em;text-transform:uppercase;color:var(--cmu)}',
        '.smx .dkc[data-biz="ANDRE MANDEL"] .cw{font:500 17px var(--cq);letter-spacing:.24em;color:var(--cink)}',
        '.smx .dkc .cp{font:700 22px var(--cq);text-transform:uppercase;letter-spacing:.06em;color:var(--cac)}',
        '.smx .dkc[data-biz="ANDRE MANDEL"] .cp{text-transform:none;letter-spacing:.02em;font-weight:600}',
        '.smx .dkc .cg{flex:1}',
        '.smx .dkc .pr{font:700 14px var(--cm);letter-spacing:.14em;padding:4px 10px;border:1px solid var(--cac);color:var(--cac)}',
        '.smx .dkc .pr.p1{background:var(--cac);color:var(--cbg)}',
        '.smx .dkc .cq{font:700 40px/1.18 var(--cq);color:var(--cink);overflow-wrap:anywhere;overflow:hidden;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical}',
        '.smx .dkc[data-biz="ANDRE MANDEL"] .cq{font-weight:600;font-size:42px;line-height:1.24}',
        '.smx .dkc .cx{font:24px/1.4 var(--cb);color:var(--cmu);overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical}',
        '.smx .dkc .cf{margin-top:auto;display:flex;flex-wrap:wrap;gap:6px 18px;padding-top:14px;border-top:1px solid var(--cln);font:16px var(--cm);letter-spacing:.06em;color:var(--cmu)}',
        '.smx .dkc .cf b{color:var(--cink);font-weight:700}',
        '.smx .dkc .md{position:absolute;right:36px;top:30px}',
        '.smx .dkc.go-yes{transform:translate(70%,-4%) rotate(14deg);opacity:0}',
        '.smx .dkc.go-no{transform:translate(-170%,-4%) rotate(-14deg);opacity:0}',
        '.smx .dkc.go-tbd{transform:translate(-50%,-90%) rotate(-2deg);opacity:0}',
        '.smx .dkc.go-fade{transform:translate(-50%,0) scale(.94);opacity:0}',
        '.smx .dkc.in-rise{animation:smrise .45s cubic-bezier(.2,.7,.3,1)}',
        '.smx .dkc.in-drop{animation:smdrop .5s cubic-bezier(.2,.7,.3,1)}',
        '@keyframes smrise{from{transform:translate(-50%,30px) scale(.94);opacity:.3}}',
        '@keyframes smdrop{from{transform:translate(-50%,-110%) rotate(3deg);opacity:0}}',
        '.smx .dkc .stamp{position:absolute;top:28%;left:50%;transform:translate(-50%,-50%) rotate(-12deg);font:700 64px var(--hf);letter-spacing:.12em;padding:6px 22px;border:5px solid currentColor;opacity:0;transition:opacity .15s;pointer-events:none}',
        '.smx .dkc.go-yes .stamp.y,.smx .dkc.go-no .stamp.n,.smx .dkc.go-tbd .stamp.t{opacity:.9}',
        '.smx .dkc .stamp.y{color:#2f8f5b}.smx .dkc .stamp.n{color:#c0392b}.smx .dkc .stamp.t{color:var(--cac)}',
        '.smx .dke{position:absolute;inset:0 0 22px;display:flex;align-items:center;justify-content:center;font:700 34px var(--hf);letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}',
        '.smx .dkb{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;width:780px;margin:0 auto;flex:none}',
        '.smx .dkb button{display:flex;align-items:center;justify-content:center;gap:10px;height:66px;font:700 24px var(--hf);letter-spacing:.1em;text-transform:uppercase;border:2px solid var(--line);background:var(--panel);color:var(--ink)}',
        '.smx .dkb button:hover{border-color:var(--ink)}',
        '.smx .dkb button i{font-style:normal;font-family:var(--mf);font-size:26px}',
        '.smx .dkb .by{background:var(--accent);border-color:var(--accent);color:var(--bg)}',
        '.smx .dkb .bn{border-color:var(--ink)}',
        '.smx .dkb button[disabled]{opacity:.35;cursor:default}',
        '.smx .dkt{text-align:center;font:15px var(--mf);letter-spacing:.3em;text-transform:lowercase;color:var(--mute);flex:none}',
        // 8.2: the Links pill, the links panel, and the page viewer on the right
        '.smx .bar .lk{font:700 15px var(--mf);letter-spacing:.2em;border:1px solid var(--accent);padding:6px 12px;color:var(--accent);white-space:nowrap;flex:none;cursor:pointer}',
        '.smx .bar .lk.zero{border-color:var(--line);color:var(--mute)}',
        '.smx .bar .lk.on,.smx .bar .lk:hover{background:var(--accent);color:var(--bg);border-color:var(--accent)}',
        // 8.9: the Boot pill
        '.smx .bar .bt{font:700 15px var(--mf);letter-spacing:.2em;border:1px solid var(--line);padding:6px 12px;color:var(--mute);white-space:nowrap;flex:none;cursor:pointer}',
        '.smx .bar .bt.on,.smx .bar .bt:hover{background:var(--accent);color:var(--bg);border-color:var(--accent)}',
        '.smx :where(.lnk button,.pgv button){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .lnk button:focus-visible,.smx .pgv button:focus-visible{outline:3px solid var(--ink);outline-offset:2px}',
        '.smx .lnk{position:absolute;left:800px;top:100px;width:1100px;bottom:248px;z-index:4;border:1px solid var(--line);background:linear-gradient(var(--panel),var(--panel)),var(--bg);display:flex;flex-direction:column;min-height:0;box-shadow:0 18px 40px rgba(0,0,0,.25)}',
        '.smx .lnk .lh{display:flex;align-items:center;gap:10px;padding:16px 22px;border-bottom:1px solid var(--line);flex:none}',
        '.smx .lnk .lt{font:700 24px var(--hf);letter-spacing:.24em;text-transform:uppercase;margin-right:10px}',
        '.smx .lnk .lb{height:40px;padding:0 14px;display:flex;align-items:center;font:700 15px var(--mf);letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--line);color:var(--mute)}',
        '.smx .lnk .lb.on{border-color:var(--accent);color:var(--accent);box-shadow:inset 0 -3px var(--accent)}',
        '.smx .lnk .lg{flex:1}',
        '.smx .lnk .lx{width:40px;justify-content:center;font-size:20px}',
        '.smx .lnk .ll{flex:1;min-height:0;overflow:auto;padding:8px 22px 18px;scrollbar-width:thin}',
        '.smx .lnk .lc{display:flex;align-items:baseline;gap:12px;margin:16px 0 8px;font:600 15px var(--mf);letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}',
        '.smx .lnk .lc b{color:var(--ink)}',
        '.smx .lnk .lc button{font:700 13px var(--mf);letter-spacing:.14em;padding:3px 8px;border:1px dashed var(--line);color:var(--mute)}',
        '.smx .lnk .lc button:hover{border-color:var(--ink);color:var(--ink)}',
        '.smx .lnk .li{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:14px;width:100%;padding:10px 12px;border:1px solid transparent;min-width:0}',
        '.smx .lnk .li:hover{border-color:var(--line);background:var(--bg2)}',
        '.smx .lnk .li .n{font:700 26px var(--hf);color:var(--accent);text-align:center}',
        '.smx .lnk .li .lbl{font:600 21px/1.25 var(--bf);color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}',
        '.smx .lnk .li .hs{font:15px var(--mf);color:var(--mute);letter-spacing:.06em;white-space:nowrap}',
        '.smx .lnk .le{padding:40px 0;text-align:center;font:600 20px var(--mf);letter-spacing:.14em;color:var(--mute);text-transform:uppercase}',
        '.smx .pgv{position:absolute;left:800px;top:100px;width:1100px;bottom:20px;z-index:5;border:1px solid var(--line);background:linear-gradient(var(--panel),var(--panel)),var(--bg);display:flex;flex-direction:column;min-height:0;box-shadow:0 18px 40px rgba(0,0,0,.25)}',
        '.smx.light .pgv{border-top:4px solid var(--accent)}',
        '.smx .pgv .ph{display:flex;align-items:center;gap:14px;padding:12px 18px;border-bottom:1px solid var(--line);flex:none;min-width:0}',
        '.smx .pgv .pn{font:700 30px var(--hf);color:var(--accent);flex:none}',
        '.smx .pgv .pl{font:700 22px var(--hf);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
        '.smx .pgv .pu{font:15px var(--mf);color:var(--mute);letter-spacing:.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}',
        '.smx .pgv .pb{height:40px;padding:0 14px;display:flex;align-items:center;font:700 15px var(--mf);letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--line);color:var(--ink);flex:none}',
        '.smx .pgv .pb:hover{border-color:var(--ink)}',
        '.smx .pgv .pf{flex:1;min-height:0;position:relative;background:#ffffff}',
        '.smx .pgv iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#ffffff}',
        '.smx .pgv .pw{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--bg2);font:600 22px var(--bf);color:var(--mute);text-align:center;padding:40px}',
        '.smx .pgv .pw b{font:700 30px var(--hf);letter-spacing:.08em;text-transform:uppercase;color:var(--ink)}',
        // 9.0.1: the Look tile: four of the look's colors on top, its number and name under them
        '.smx .tg.lk3{grid-template-columns:1fr auto;padding:7px 12px}',
        '.smx .tg.lk3 .tl{grid-column:1;grid-row:1}',
        '.smx .tg.lk3 .lsw{grid-column:2;grid-row:1;display:flex;gap:4px}',
        '.smx .tg.lk3 .lsw i{display:block;width:13px;height:13px;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(127,127,127,.35)}',
        '.smx .tg.lk3 .tv{grid-column:1/-1;grid-row:2;color:var(--accent);font-size:15px;letter-spacing:.03em;overflow:hidden;text-overflow:ellipsis}',
        // 9.0.1: LOOKS. The background layers. Each look turns on the ones it uses, colored from its own palette.
        '.smx .rtsky,.smx .rtsky>*,.smx .rdr{display:none}',
        '.smx.fx .rtsky{display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none}',
        '.smx:is(.fx-sky,.fx-floor) .rtsky{background:var(--sky)}',
        '.smx:is(.fx-sky,.fx-floor) .gridbg{display:none}',
        '.smx.fx-stars .rtst{display:block;position:absolute;left:0;right:0;top:0;height:60%;background:' +
          'radial-gradient(1.6px 1.6px at 6% 15%,rgba(255,255,255,.8),transparent),radial-gradient(1.2px 1.2px at 19% 45%,rgba(255,255,255,.55),transparent),' +
          'radial-gradient(1.4px 1.4px at 33% 10%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 47% 32%,rgba(255,255,255,.5),transparent),' +
          'radial-gradient(1.6px 1.6px at 58% 7%,rgba(255,255,255,.75),transparent),radial-gradient(1.2px 1.2px at 71% 23%,rgba(255,255,255,.55),transparent),' +
          'radial-gradient(1.5px 1.5px at 84% 13%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 93% 38%,rgba(255,255,255,.5),transparent),' +
          'radial-gradient(1.2px 1.2px at 77% 55%,rgba(255,255,255,.45),transparent),radial-gradient(1px 1px at 52% 63%,rgba(255,255,255,.4),transparent),' +
          'radial-gradient(1.3px 1.3px at 12% 70%,rgba(255,255,255,.45),transparent),radial-gradient(1px 1px at 27% 82%,rgba(255,255,255,.35),transparent)}',
        // the floor: a horizon line, rays drawn once, and lines that each slide down on the graphics chip
        '.smx.fx-floor .rthz{display:block;position:absolute;left:0;right:0;top:56%;height:2px;margin-top:-1px;background:var(--hz);box-shadow:0 0 26px 5px var(--hzg)}',
        '.smx.fx-floor .rtfl{display:block;position:absolute;left:0;right:0;top:56%;bottom:0;overflow:hidden}',
        '.smx.fx-floor .rtfl::after{content:"";position:absolute;inset:0;background:var(--flfade)}',
        '.smx.fx-floor .rtry{position:absolute;inset:0;width:100%;height:100%}',
        '.smx.fx-floor .rtry line{stroke:var(--fl);stroke-opacity:.72;stroke-width:1.5;vector-effect:non-scaling-stroke}',
        '.smx.fx-floor .rtfl i{position:absolute;left:0;top:0;width:100%;height:100%;border-top:2px solid var(--fl);opacity:0;will-change:transform;animation:smfloor 16s linear infinite}',
        Array.from({ length: 14 }, (_, k) => '.smx.fx-floor .rtfl i:nth-of-type(' + (k + 1) + '){animation-delay:-' + (k * 16 / 14).toFixed(3) + 's}').join(''),
        '@keyframes smfloor{0%{transform:translateY(7.7%);opacity:0}10%{transform:translateY(8.5%)}20%{transform:translateY(9.4%);opacity:.35}30%{transform:translateY(10.6%)}40%{transform:translateY(12.2%)}' +
          '50%{transform:translateY(14.3%)}60%{transform:translateY(17.2%);opacity:.8}70%{transform:translateY(21.7%)}75%{transform:translateY(25%)}80%{transform:translateY(29.4%)}' +
          '85%{transform:translateY(35.7%);opacity:1}90%{transform:translateY(45.5%)}95%{transform:translateY(62.5%)}100%{transform:translateY(100%);opacity:1}}',
        // aurora: two soft lights drifting slowly
        '.smx.fx-aurora .rtau{display:block;position:absolute;inset:-20%;background:radial-gradient(ellipse 40% 26% at 30% 30%,var(--au1),transparent 70%),radial-gradient(ellipse 36% 24% at 70% 22%,var(--au2),transparent 70%);will-change:transform;animation:smau 40s ease-in-out infinite alternate}',
        '@keyframes smau{0%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(4%,3%) rotate(4deg)}100%{transform:translate(-3%,5%) rotate(-3deg)}}',
        // sonar: rings and a sweep turning behind the pie
        '.smx.fx-radar .rdr{display:block;position:absolute;left:39.09%;top:50%;width:780px;height:780px;margin:-390px 0 0 -390px;border-radius:50%;pointer-events:none;' +
          'background:repeating-radial-gradient(circle,transparent 0 77px,var(--dot) 78px 79px),conic-gradient(from 0deg,transparent 0 70%,var(--glowbg) 92%,var(--glowc2) 99.6%,transparent 100%);will-change:transform;animation:smsweep 6s linear infinite}',
        '@keyframes smsweep{to{transform:rotate(1turn)}}',
        // flat grounds: dots, blueprint grid
        '.smx.fx-dots .gridbg{background-image:radial-gradient(var(--dot) 1.4px,transparent 1.7px);background-size:28px 28px}',
        '.smx.fx-blue .gridbg{background-image:linear-gradient(var(--dot) 1px,transparent 1px),linear-gradient(90deg,var(--dot) 1px,transparent 1px),linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:192px 192px,192px 192px,24px 24px,24px 24px}',
        // screens: scan lines, and a glowing, vignetted tube
        '.smx.fx-scan::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:40;background:repeating-linear-gradient(180deg,rgba(0,0,0,.16) 0 1px,rgba(0,0,0,0) 1px 4px)}',
        '.smx.fx-crt{text-shadow:0 0 7px var(--glowc2)}',
        '.smx.fx-crt::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:39;background:radial-gradient(ellipse at 50% 50%,transparent 58%,rgba(0,0,0,.55) 100%)}',
        // type: no faked bold, the wordmark face, wide faces step down
        '.smx.nb{font-synthesis:none}',
        '.smx.wide .bar .br{font-size:17px;letter-spacing:.06em}',
        '.smx.wide .bar .sb{font-size:19px;letter-spacing:.14em}',
        '.smx.wm .bar .sb{font-family:var(--wf);font-weight:400;font-size:26px;letter-spacing:.14em}',
        '.smx.thin :is(.ab,.csend,.cdst,.hold .hv,.dkb button){font-family:var(--bf);font-weight:700}',
        '.smx.wide .hold .hv{font-size:46px;letter-spacing:0}',
        '.smx.wide .ttl{font-size:40px}',
        '.smx.fx .tx{background:var(--txbg)}',
        '.smx.gen .tg{background:var(--tgbg)}',
        '.smx.gen .tg.on .sw i{background:var(--knob)}',
        '.smx.lite .tg .sw i{box-shadow:0 1px 2px rgba(0,0,0,.25)}',
        // panel shapes
        '.smx.sh-neon :is(.tx,.bar,.ctl){box-shadow:0 0 0 1px var(--glowbg),0 0 30px -8px var(--glowc2)}',
        '.smx.sh-neon .asks{box-shadow:inset 4px 0 0 var(--need),0 0 30px -8px var(--glowc2)}',
        '.smx.sh-neon .bar .sb{color:var(--accent);text-shadow:0 0 6px var(--glowc),0 0 22px var(--glowc2)}',
        '.smx.sh-neon .bar .br{letter-spacing:.12em;color:var(--brc);text-shadow:0 0 12px var(--brg)}',
        '.smx.sh-neon :is(.msg.c .who,.kick){text-shadow:0 0 10px currentColor}',
        '.smx.sh-neon .hint{color:var(--accent);opacity:.85}',
        '.smx.sh-neon :is(.tg:hover,.mdr .md:hover){border-color:var(--accent)}',
        '.smx.sh-neon .mdr .md:hover{color:var(--accent)}',
        '.smx.sh-stripe :is(.tx,.ctl)::before{content:"";position:absolute;left:-1px;right:-1px;top:-1px;height:3px;z-index:1;background:var(--stripe)}',
        '.smx.sh-chrome .ttl{background:var(--chrome) 0 0/100% 1.04em repeat-y;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 16px var(--glowc2))}',
        '.smx.sh-chrome .hold:not(.on) .hv{background:var(--chrome2);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 14px var(--glowc2))}',
        '.smx.sh-grad .tg.on .sw{background:linear-gradient(90deg,var(--need),var(--accent));box-shadow:0 0 12px var(--glowc2)}',
        '.smx.sh-grad .csend{background:linear-gradient(90deg,var(--need),var(--accent));border-color:transparent;box-shadow:0 0 18px -2px var(--glowc2)}',
        '.smx.sh-round :is(.tx,.bar,.ctl,.asks,.lnk,.dkov,.pgv){border-radius:18px}',
        '.smx.sh-round :is(.tx,.bar,.ctl){overflow:hidden}',
        '.smx.sh-round :is(.tg,.cin,.cdst,.dock,.chip,.ab){border-radius:12px}',
        '.smx.sh-round :is(.cclip,.csend,.bar .pz,.bar .bt,.bar .lk){border-radius:999px}',
        '.smx.sh-thick :is(.tx,.bar,.ctl,.asks,.tg,.cin,.cdst,.cclip,.csend){border-width:2px}',
        '.smx.sh-block :is(.tx,.bar,.ctl){box-shadow:8px 8px 0 var(--line)}',
        '.smx.sh-block :is(.tg,.csend,.cdst){box-shadow:4px 4px 0 var(--line)}',
        '.smx.sh-under .tx{border-top:4px solid var(--accent)}',
        '.smx.sh-under .bar{border-bottom:2px solid var(--accent)}',
        '.smx.sh-under .ctl{border-top:2px solid var(--accent)}',
        '.smx.sh-under .hint{color:var(--accent)}',
        '.smx.sh-cut :is(.tx,.bar,.ctl,.asks){clip-path:polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,26px 100%,0 calc(100% - 26px))}',
        '.smx.sh-cut :is(.tg,.csend,.cdst){clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}',
        '.smx.sh-deco :is(.tx,.ctl){outline:1px solid var(--accent);outline-offset:-8px}',
        '.smx.sh-deco .bar{border-color:var(--accent)}',
        '.smx.sh-deco :is(.ttl,.bar .sb){letter-spacing:.12em}',
        // 9.0: Chief of Staff over the pie, in the board's night drive look (9.4.1: on Night drive; other looks lend it theirs, below)
        '.smx.cosing .stage{opacity:.14;filter:blur(2px)}',
        '.smx.cosing .asks,.smx.cosing .dkov{display:none}',
        // 9.1: the pill rail over the stage: Chief on the left, View and Look on the right
        '.smx .prl{position:absolute;left:800px;top:100px;width:1100px;height:44px;display:flex;align-items:center;gap:12px}',
        '.smx :where(.prl button,.pik button){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .prl button:focus-visible,.smx .pik button:focus-visible{outline:3px solid var(--ink);outline-offset:2px}',
        '.smx .prl .gr{flex:1}',
        '.smx .pil{display:flex;align-items:stretch;height:42px;border:1px solid var(--line);background:var(--panel);border-radius:999px;overflow:hidden}',
        '.smx .pil>button{display:flex;align-items:center;justify-content:center;padding:0 15px;font:700 22px/1 var(--mf);color:var(--mute)}',
        '.smx .pil>button:hover{color:var(--accent);background:var(--bg2)}',
        '.smx .pil .pn{gap:10px;padding:0 18px;border-left:1px solid var(--line);border-right:1px solid var(--line);min-width:150px}',
        '.smx .pil .pn i{font:600 13px var(--mf);font-style:normal;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}',
        '.smx .pil .pn b{font:700 16px var(--mf);letter-spacing:.12em;text-transform:uppercase;color:var(--ink);white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}',
        '.smx .pil .pn.on{background:var(--bg2);box-shadow:inset 0 -3px var(--accent)}',
        '.smx .chp{display:flex;align-items:center;gap:10px;height:42px;padding:0 20px;border-radius:999px;border:1px solid var(--accent);color:var(--accent);font:700 15px var(--mf);letter-spacing:.2em;text-transform:uppercase;background:var(--panel)}',
        '.smx .chp i{width:10px;height:10px;border-radius:50%;background:var(--line)}',
        '.smx .chp.hot i{background:var(--need);animation:smpulse 1.6s ease-in-out infinite}',
        '.smx .chp:hover,.smx .chp.on{background:var(--accent);color:var(--bg)}',
        '.smx .oxq{display:flex;align-items:center;gap:9px;height:42px;padding:0 16px;border-radius:999px;border:1px solid var(--line);color:var(--ink);font:700 14px var(--mf);letter-spacing:.16em;text-transform:uppercase;background:var(--panel);white-space:nowrap}',   // 9.4
        '.smx .oxq i{width:9px;height:9px;border-radius:50%;background:var(--line)}',
        '.smx .oxq.hot i{background:var(--wait)}',
        '.smx .oxq:hover,.smx .oxq.on{border-color:var(--ink);background:var(--ink);color:var(--bg)}',
        '.smx .ctr:hover .cb{stroke:var(--ink)}',
        // 9.1: the pickers
        '.smx .pik{position:absolute;left:800px;top:148px;width:1100px;bottom:20px;z-index:7;border:1px solid var(--line);background:linear-gradient(var(--panel),var(--panel)),var(--bg);display:flex;flex-direction:column;box-shadow:0 18px 40px rgba(0,0,0,.3);color:var(--ink)}',
        '.smx .pik .pkh{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--line);flex:none}',
        '.smx .pik .pkt{font:700 22px var(--hf);letter-spacing:.16em;text-transform:uppercase;margin-right:12px}',
        '.smx .pik .pks{font:600 14px var(--mf);letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}',
        '.smx .pik .pkb{height:36px;padding:0 14px;display:flex;align-items:center;border:1px solid var(--line);font:700 14px var(--mf);letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}',
        '.smx .pik .pkb.on{border-color:var(--accent);color:var(--accent);box-shadow:inset 0 -3px var(--accent)}',
        '.smx .pik .pkb[disabled]{opacity:.4;cursor:default}',
        '.smx .pik .pkb.x{width:36px;justify-content:center;font-size:20px;padding:0}',
        '.smx .pik .cg{flex:1}',
        '.smx .pik .pkl{flex:1;min-height:0;overflow:auto;padding:4px 20px 22px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}',
        '.smx .pik .pkc{margin:16px 0 10px;font:600 14px var(--mf);letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}',
        '.smx .pik .pkg{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}',
        '.smx .pik .lt{position:relative;border:1px solid;min-width:0}',
        '.smx .pik .lt.on{outline:3px solid var(--accent);outline-offset:2px}',
        '.smx .pik .lta{display:flex;flex-direction:column;gap:6px;width:100%;padding:12px 14px;min-width:0}',
        '.smx .pik .lta:hover{filter:brightness(1.08)}',
        '.smx .pik .lsw2{display:flex;gap:4px}',
        '.smx .pik .lsw2 i{width:22px;height:10px;display:block}',
        '.smx .pik .ltn{font:700 13px var(--mf);letter-spacing:.14em;opacity:.7}',
        '.smx .pik .ltl{font-size:19px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.smx .pik .ltf{position:absolute;right:6px;top:4px;padding:4px 6px;font-size:21px;line-height:1;opacity:.3;text-shadow:0 0 2px rgba(0,0,0,.6)}',
        '.smx .pik .ltf:hover{opacity:.8}',
        '.smx .pik .ltf.on{opacity:1;color:#ffc83d}',
        '.smx .pik .vg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}',
        '.smx .pik .vt{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--line);min-width:0;background:var(--bg2)}',
        '.smx .pik .vt:hover{border-color:var(--ink)}',
        '.smx .pik .vt.on{border-color:var(--accent);box-shadow:inset 0 -3px var(--accent)}',
        '.smx .pik .vt svg{width:44px;height:44px;flex:none;color:var(--accent)}',
        '.smx .pik .vt span{min-width:0}',
        '.smx .pik .vt b{display:block;font:700 18px var(--hf);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.smx .pik .vt small{display:block;font:14px var(--mf);color:var(--mute);letter-spacing:.06em;margin-top:4px}',
        // 9.1: the views' moving parts
        '.smx .lkfade{position:absolute;inset:0;z-index:60;pointer-events:none;opacity:1;transition:opacity .6s ease}',   // 9.3
        '.smx .pik .pkb.clk.on{border-color:var(--wait);color:var(--wait);box-shadow:inset 0 -3px var(--wait)}',
        '.smx .pik .lt .ltc{font:600 11px var(--mf);letter-spacing:.14em;text-transform:uppercase;opacity:.7}',
        '.smx .pil .pn b .ck{color:var(--wait);margin-left:8px}',
        '.smx .stage .vsweep{animation:smspin 5s linear infinite}',
        '@keyframes smspin{to{transform:rotate(360deg)}}',
        '.smx .stage .vscroll{animation:smscroll 8s linear infinite}',
        '@keyframes smscroll{to{transform:translateX(-740px)}}',
        '.smx .stage .vflick{animation:smflick 1.1s steps(2) infinite}',
        '@keyframes smflick{50%{opacity:.45}}',
        '.smx .stage .vflap{transform-box:fill-box;transform-origin:center;animation:smflap .5s cubic-bezier(.2,.7,.3,1) both}',
        '@keyframes smflap{from{transform:scaleY(0)}}',
        // 9.1: the sketch looks. Vellum grid, a pencil wobble on the drawing, construction lines that run past the corners
        '.smx.fx-sketch .gridbg{background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px),linear-gradient(var(--dot) 1px,transparent 1px),linear-gradient(90deg,var(--dot) 1px,transparent 1px);background-size:12px 12px,12px 12px,60px 60px,60px 60px}',
        '.smx.fx-sketch .stage svg{filter:url(#smwob)}',
        '.smx.fx-sketch :is(.tx,.bar,.ctl,.asks){border-color:transparent;box-shadow:none}',
        '.smx.fx-sketch :is(.tx,.bar,.ctl,.asks)::after{content:"";position:absolute;inset:-10px;pointer-events:none;z-index:1;background:linear-gradient(var(--line),var(--line)) 0 10px/100% 1.5px no-repeat,linear-gradient(var(--line),var(--line)) 0 calc(100% - 10px)/100% 1.5px no-repeat,linear-gradient(var(--line),var(--line)) 10px 0/1.5px 100% no-repeat,linear-gradient(var(--line),var(--line)) calc(100% - 10px) 0/1.5px 100% no-repeat}',
        '.smx.fx-sketch :is(.tg,.pil,.chp,.oxq,.cin,.cdst,.cclip,.ab,.dkb button,.md){border-style:dashed}',
        '.smx.fx-sketch .ttl{letter-spacing:.02em}',
        // 9.4: how sketchy. sk-1 barely wobbles and draws hairlines; sk-2 is felt tip; sk-3 shakes, doubles its lines and smudges
        '.smx.fx-sketch.sk-1 .stage svg{filter:url(#smwob1)}',
        '.smx.fx-sketch.sk-1 :is(.tx,.bar,.ctl,.asks)::after{opacity:.55}',
        '.smx.fx-sketch.sk-2 .stage svg{filter:none}',
        '.smx.fx-sketch.sk-2 :is(.tx,.bar,.ctl,.asks)::after{inset:-4px;background:linear-gradient(var(--line),var(--line)) 0 4px/100% 3px no-repeat,linear-gradient(var(--line),var(--line)) 0 calc(100% - 4px)/100% 3px no-repeat,linear-gradient(var(--line),var(--line)) 4px 0/3px 100% no-repeat,linear-gradient(var(--line),var(--line)) calc(100% - 4px) 0/3px 100% no-repeat}',
        '.smx.fx-sketch.sk-2 :is(.tg,.pil,.chp,.oxq,.cin,.cdst,.cclip,.ab,.dkb button,.md){border-style:solid;border-width:2px}',
        '.smx.fx-sketch.sk-3 .stage svg{filter:url(#smwob3)}',
        '.smx.fx-sketch.sk-3 :is(.tx,.bar,.ctl,.asks)::before{content:"";position:absolute;inset:-14px -6px -6px -14px;pointer-events:none;z-index:1;background:linear-gradient(var(--line),var(--line)) 0 14px/100% 1px no-repeat,linear-gradient(var(--line),var(--line)) 14px 0/1px 100% no-repeat;opacity:.5;transform:rotate(-.25deg)}',
        '.smx.fx-sketch.sk-3 :is(.tx,.bar,.ctl,.asks)::after{transform:rotate(.2deg)}',
        '.smx.fx-sketch.sk-3 .gridbg{background-image:radial-gradient(ellipse 40% 30% at 22% 30%,var(--dot),transparent 70%),radial-gradient(ellipse 35% 25% at 78% 72%,var(--dot),transparent 70%),linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:auto,auto,24px 24px,24px 24px}',
        '.smx.sk-chalk .gridbg{background-image:radial-gradient(ellipse 50% 30% at 30% 40%,rgba(241,242,234,.05),transparent 70%),radial-gradient(ellipse 40% 26% at 70% 70%,rgba(241,242,234,.04),transparent 70%)}',
        // 9.4: Funnies. Comic ink: halftone dots, heavy black outlines, panels that cast a hard offset shadow
        '.smx.fx-comic .gridbg{background-image:radial-gradient(var(--dot) 1.6px,transparent 1.9px);background-size:11px 11px}',
        '.smx.fx-comic :is(.tx,.bar,.ctl,.asks){border:3px solid var(--ink);box-shadow:7px 7px 0 var(--ink)}',
        '.smx.fx-comic :is(.tg,.pil,.chp,.oxq,.cin,.cdst,.cclip,.ab,.dkb button,.md){border-width:2px;border-color:var(--ink)}',
        '.smx.fx-comic .ttl{letter-spacing:.04em}',
        '.smx.fx-comic .stage svg :is(path,circle){paint-order:stroke}',
        '.smx .cos{--k-bg:#0a0912;--k-panel:#100e1c;--k-panel2:#19143a;--k-line:#2a2647;--k-fg:#ece8f6;--k-dim:#8f8aad;--k-cyan:#52d9ff;--k-violet:#8f74ff;--k-mag:#ff4f9e;--k-sun:#ff9447;--k-gold:#ffd36e;--k-chx:#ffcf6a;--k-per:#b49bff;--k-d:"Syncopate","Orbitron",Arial,sans-serif;--k-b:"Barlow","Exo 2",Arial,sans-serif;--k-l:"Barlow Condensed","Rajdhani","Arial Narrow",sans-serif;position:absolute;left:800px;top:100px;width:1100px;bottom:20px;z-index:3;display:flex;flex-direction:column;gap:14px;padding:20px 24px 14px;background:radial-gradient(900px 380px at 50% -14%,rgba(143,116,255,.22),transparent 70%),var(--k-bg);border:1px solid var(--k-line);color:var(--k-fg);font-family:var(--k-b);box-shadow:0 18px 40px rgba(0,0,0,.35);overflow:hidden}',
        '.smx .cos::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--k-cyan),var(--k-violet) 35%,var(--k-mag) 68%,var(--k-sun))}',
        '.smx :where(.cos button){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .cos button:focus-visible{outline:2px solid var(--k-cyan);outline-offset:2px}',
        '.smx .cos .chh{display:flex;align-items:center;gap:14px;flex:none;padding-bottom:12px;border-bottom:1px solid var(--k-line)}',
        '.smx .cos .cmk{font:700 30px/1 var(--k-d);letter-spacing:.1em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1.2px var(--k-fg);white-space:nowrap}',
        '.smx .cos .cmk span{background:linear-gradient(180deg,var(--k-gold),var(--k-sun) 45%,var(--k-mag));-webkit-background-clip:text;background-clip:text;-webkit-text-stroke:0;color:transparent}',
        '.smx .cos .cdt{font:600 16px var(--k-l);letter-spacing:.3em;color:var(--k-cyan);white-space:nowrap}',
        '.smx .cos .cg{flex:1}',
        '.smx .cos .cbn{height:40px;padding:0 16px;display:flex;align-items:center;justify-content:center;font:600 16px var(--k-l);letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--k-line);color:var(--k-fg);white-space:nowrap;transition:border-color .2s,color .2s,box-shadow .2s}',
        '.smx .cos .cbn:hover{border-color:var(--k-cyan);color:var(--k-cyan);box-shadow:0 0 14px -5px var(--k-cyan)}',
        '.smx .cos .cbn[disabled]{opacity:.4;cursor:default;box-shadow:none;border-color:var(--k-line);color:var(--k-fg)}',
        '.smx .cos .cbn.cx{width:40px;padding:0;font-size:22px;letter-spacing:0}',
        '.smx .cos .cbn.wt{border-color:var(--k-mag);color:var(--k-bg);background:var(--k-mag)}',
        '.smx .cos .cbn.sm{height:32px;padding:0 12px;font-size:14px}',
        '.smx .cos .cbr{position:relative;isolation:isolate;overflow:hidden;flex:none;display:flex;flex-direction:column;gap:10px;padding:20px 24px 18px;border:1px solid var(--k-line);background:var(--k-panel);min-height:210px}',
        '.smx .cos .cbr.wait{flex:1;justify-content:center}',
        '.smx .cos .sc{position:absolute;top:0;right:0;bottom:0;width:460px;z-index:-1;pointer-events:none;-webkit-mask:linear-gradient(90deg,transparent,#000 38%);mask:linear-gradient(90deg,transparent,#000 38%);background:radial-gradient(1px 1px at 14% 20%,#ffffffa8,transparent),radial-gradient(1.5px 1.5px at 62% 18%,#ffffffa8,transparent),radial-gradient(1px 1px at 84% 10%,#ffffffa8,transparent),radial-gradient(1px 1px at 40% 34%,#ffffffa8,transparent),radial-gradient(1px 1px at 92% 36%,#ffffffa8,transparent),linear-gradient(180deg,var(--k-panel) 0%,var(--k-panel2) 60%)}',
        '.smx .cos .gl{position:absolute;left:56%;bottom:40%;width:170px;height:170px;transform:translate(-50%,34%);filter:drop-shadow(0 0 24px rgba(255,79,158,.55))}',
        '.smx .cos .sun{width:100%;height:100%;border-radius:50%;background:linear-gradient(180deg,var(--k-gold) 0%,var(--k-sun) 42%,var(--k-mag) 100%);-webkit-mask:linear-gradient(180deg,#000 50%,transparent 50% 54%,#000 54% 62%,transparent 62% 67%,#000 67% 74%,transparent 74% 80%,#000 80%);mask:linear-gradient(180deg,#000 50%,transparent 50% 54%,#000 54% 62%,transparent 62% 67%,#000 67% 74%,transparent 74% 80%,#000 80%)}',
        '.smx .cos .fl{position:absolute;left:0;right:0;bottom:0;height:40%;overflow:hidden;perspective:170px;perspective-origin:50% 0;background:linear-gradient(180deg,rgba(255,79,158,.2),var(--k-panel) 75%);border-top:1px solid var(--k-mag);box-shadow:0 -6px 22px -6px rgba(255,79,158,.6)}',
        '.smx .cos .fl::before{content:"";position:absolute;left:-100%;right:-100%;top:0;height:300%;transform-origin:50% 0;transform:rotateX(70deg);background-image:linear-gradient(var(--k-cyan) 1.5px,transparent 1.5px),linear-gradient(90deg,var(--k-cyan) 1.5px,transparent 1.5px);background-size:32px 32px;opacity:.85;-webkit-mask:linear-gradient(180deg,transparent,#000 22%);mask:linear-gradient(180deg,transparent,#000 22%);animation:smdrive 2.6s linear infinite}',
        '@keyframes smdrive{to{background-position:0 32px,0 0}}',
        '.smx .cos .ce{font:600 15px var(--k-l);letter-spacing:.32em;text-transform:uppercase;color:var(--k-cyan)}',
        '.smx .cos .chd{font:600 28px/1.25 var(--k-b);max-width:30ch;text-wrap:balance;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
        '.smx .cos ul{margin:0;padding-left:22px;display:grid;gap:3px;max-width:56ch;font:19px/1.35 var(--k-b)}',
        '.smx .cos li span{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
        '.smx .cos li::marker{color:var(--k-mag)}',
        '.smx .cos .cct{display:flex;align-items:baseline;gap:8px 26px;font:600 15px var(--k-l);letter-spacing:.16em;text-transform:uppercase;color:var(--k-dim);padding-top:2px}',
        '.smx .cos .cct b{font:700 26px/1 var(--k-d);margin-right:9px;letter-spacing:0;color:var(--k-fg);font-variant-numeric:tabular-nums}',
        '.smx .cos .cct .n b{color:var(--k-sun)}.smx .cos .cct .s b{color:var(--k-mag)}.smx .cos .cct .r b{color:var(--k-cyan)}',
        '.smx .cos .cwn{font:500 14px var(--k-l);letter-spacing:.16em;text-transform:uppercase;color:var(--k-dim)}',
        '.smx .cos .csh{flex:none;font:700 14px var(--k-d);letter-spacing:.2em;text-transform:uppercase;display:flex;gap:14px;align-items:baseline}',
        '.smx .cos .csh small{font:500 15px var(--k-l);letter-spacing:.14em;color:var(--k-dim)}',
        '.smx .cos .crs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:var(--k-line) transparent}',
        '.smx .cos .cr{flex:none;display:grid;grid-template-columns:40px 1fr auto;column-gap:12px;align-items:start;padding:12px 16px;border:1px solid var(--k-line);background:var(--k-panel)}',
        '.smx .cos .cr.hot{border-color:rgba(255,148,71,.5);box-shadow:0 0 28px -14px var(--k-mag)}',
        '.smx .cos .ci{font:700 26px/1.2 var(--k-d);color:var(--k-sun);text-align:center}',
        '.smx .cos .cbd{min-width:0;display:flex;flex-direction:column;gap:4px}',
        '.smx .cos .ctp{display:flex;align-items:center;gap:6px 12px;min-width:0}',
        '.smx .cos .cst{font:600 14px/1 var(--k-l);letter-spacing:.16em;text-transform:uppercase;padding:5px 9px 4px;border:1px solid;white-space:nowrap}',
        '.smx .cos .cst.needs{color:var(--k-bg);background:linear-gradient(90deg,var(--k-sun),var(--k-mag));border-color:transparent}',
        '.smx .cos .cst.blocked{color:var(--k-mag);border-color:rgba(255,79,158,.55);background:rgba(255,79,158,.1)}',
        '.smx .cos .cbz{font:600 15px var(--k-l);letter-spacing:.14em;white-space:nowrap}',
        '.smx .cos .cbz.chx{color:var(--k-chx)}.smx .cos .cbz.am{color:var(--k-fg)}.smx .cos .cbz.per{color:var(--k-per)}',
        '.smx .cos .cpj{font:500 16px var(--k-l);letter-spacing:.08em;color:var(--k-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
        '.smx .cos .cdu{font:500 16px var(--k-b);color:var(--k-sun);white-space:nowrap}',
        '.smx .cos .csl{font:600 13px var(--k-l);letter-spacing:.18em;text-transform:uppercase;color:var(--k-mag)}',
        '.smx .cos .ctt{font:600 22px/1.25 var(--k-b);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
        '.smx .cos .cnx{font:18px/1.3 var(--k-b);color:var(--k-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
        '.smx .cos .cem{padding:16px 18px;border:1px dashed var(--k-line);color:var(--k-dim);font:19px var(--k-b)}',
        // 9.1: two columns, so Start Here gets the full height: the brief on the left, the threads on the right
        '.smx .cos .cbody{flex:1;min-height:0;display:grid;grid-template-columns:400px 1fr;gap:18px}',
        '.smx .cos .cbody .cbr{min-height:0;padding-bottom:200px;justify-content:flex-start}',
        '.smx .cos .cbody .sc{top:auto;height:186px;width:100%;-webkit-mask:none;mask:none}',
        '.smx .cos .cbody .gl{left:50%;width:150px;height:150px}',
        '.smx .cos .cbody .chd{-webkit-line-clamp:4;font-size:26px}',
        '.smx .cos .cbody li span{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
        '.smx .cos .cbody .cct{flex-wrap:wrap;gap:6px 18px}',
        '.smx .cos .ccol{min-height:0;min-width:0;display:flex;flex-direction:column;gap:10px}',
        '.smx .cos .cr{grid-template-columns:40px 1fr auto}',
        '.smx .cos .cac{display:flex;flex-direction:column;gap:6px;align-self:center}',
        '.smx .cos .cbn.hi{border-color:var(--k-cyan);color:var(--k-cyan)}',
        '.smx .cos .chn{flex:none;text-align:center;font:500 15px var(--k-l);letter-spacing:.3em;text-transform:lowercase;color:var(--k-dim)}',
        // 9.4.1: Chief of Staff wears HQ's look. Night drive keeps the board's own; every other look lends the
        // panel its colors, faces, ground and panel shape. The sunset scene stays only on the looks with a floor.
        '.smx:not(.night) .cos{--k-bg:var(--bg);--k-panel:var(--bg2);--k-panel2:var(--bg2);--k-line:var(--line);--k-fg:var(--ink);--k-dim:var(--mute);--k-cyan:var(--work);--k-violet:var(--accent);--k-mag:var(--accent);--k-sun:var(--need);--k-gold:var(--wait);--k-d:var(--hf);--k-b:var(--bf);--k-l:var(--mf);background:radial-gradient(900px 380px at 50% -14%,var(--glowbg),transparent 70%),var(--bg);box-shadow:0 18px 40px rgba(0,0,0,.25)}',
        '.smx:not(.night) .cos::before{background:var(--stripe,linear-gradient(90deg,var(--work),var(--accent) 50%,var(--need)))}',
        '.smx:not(.night) .cos .cmk{color:var(--k-fg);-webkit-text-stroke:0}',
        '.smx:not(.night) .cos .cbn:hover{box-shadow:none}',
        '.smx:not(.night) .cos .cr.hot{border-color:var(--k-sun);box-shadow:inset 3px 0 0 var(--k-sun)}',
        '.smx:not(.night) .cos .cst.blocked{border-color:var(--k-mag);background:transparent}',
        '.smx:not(.night) .cos .gl{filter:drop-shadow(0 0 24px var(--glowc2))}',
        '.smx:not(.night) .cos .fl{background:linear-gradient(180deg,var(--glowbg),var(--k-panel) 75%);box-shadow:0 -6px 22px -6px var(--glowc2)}',
        '.smx:not(.night):not(.fx-floor) .cos :is(.sc,.gl,.fl){display:none}',
        '.smx:not(.night):not(.fx-floor) .cos .cbody .cbr{padding-bottom:18px}',
        '.smx.lt:not(.night) .cos{--k-chx:#a4520f;--k-per:#5a45c0;box-shadow:0 18px 40px rgba(0,0,0,.12)}',
        // the look's ground shows through: blueprint grid, dots, scan lines already lie over everything
        '.smx.fx-blue .cos{background:linear-gradient(var(--dot) 1px,transparent 1px) 0 0/192px 192px,linear-gradient(90deg,var(--dot) 1px,transparent 1px) 0 0/192px 192px,linear-gradient(var(--grid) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/24px 24px,var(--bg)}',
        '.smx.fx-blue .cos :is(.cbr,.cr){background:var(--panel)}',
        '.smx.fx-dots .cos{background:radial-gradient(var(--dot) 1.4px,transparent 1.7px) 0 0/28px 28px,var(--bg)}',
        '.smx.fx-sketch .cos{background:linear-gradient(var(--grid) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/24px 24px,var(--bg);border-style:dashed;box-shadow:none}',
        '.smx.fx-sketch .cos :is(.cbr,.cr,.cbn,.cem,.cst){border-style:dashed}',
        '.smx.fx-sketch.sk-2 .cos,.smx.fx-sketch.sk-2 .cos :is(.cbr,.cr,.cbn,.cem,.cst){border-style:solid;border-width:2px}',
        // panel shapes carry over
        '.smx.sh-round .cos{border-radius:18px}',
        '.smx.sh-round .cos :is(.cbr,.cr,.cem){border-radius:12px}',
        '.smx.sh-round .cos :is(.cbn,.cst){border-radius:999px}',
        '.smx.sh-thick .cos,.smx.sh-thick .cos :is(.cbr,.cr,.cbn){border-width:2px}',
        '.smx.sh-block .cos :is(.cbr,.cr){box-shadow:5px 5px 0 var(--line)}',
        '.smx.sh-under .cos{border-top:4px solid var(--accent)}',
        '.smx.sh-cut .cos{clip-path:polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,26px 100%,0 calc(100% - 26px))}',
        '.smx.sh-cut .cos :is(.cr,.cbn){clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}',
        '.smx.sh-deco .cos{outline:1px solid var(--accent);outline-offset:-8px}',
        '.smx.sh-neon .cos{box-shadow:0 0 0 1px var(--glowbg),0 0 30px -8px var(--glowc2)}',
        // 9.1: the CHxTLD Outbox over the pie. It always wears the Outbox's white mail look, whatever the HQ look
        '.smx.oxing .stage{opacity:.14;filter:blur(2px)}',
        '.smx.oxing .asks,.smx.oxing .dkov{display:none}',
        '.smx .oxp{--o-ink:#1f1f1f;--o-text:#222;--o-mute:#5f6368;--o-hair:#e3e3e3;--o-panel:#f6f8fc;--o-or:#f96819;--o-hold:#8a5a00;--o-holds:#fff4dc;--o-rdy:#1e6b3a;--o-rdys:#e6f4ea;--o-sent:#174ea6;--o-sents:#e8f0fe;--o-err:#b3261e;--o-f:Helvetica,Arial,"Liberation Sans",sans-serif;position:absolute;left:800px;top:100px;width:1100px;bottom:248px;z-index:3;display:flex;flex-direction:column;background:#fff;color:var(--o-text);font-family:var(--o-f);text-transform:none;letter-spacing:0;border:1px solid var(--o-hair);box-shadow:0 18px 40px rgba(0,0,0,.35);overflow:hidden}',
        '.smx .oxp::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--o-or)}',
        '.smx .oxp [hidden]{display:none!important}',
        '.smx :where(.oxp button){all:unset;box-sizing:border-box;cursor:pointer}',
        '.smx .oxp button:focus-visible{outline:2px solid var(--o-or);outline-offset:2px}',
        '.smx .oxp .g{flex:1}',
        '.smx .oxp .oxh{flex:none;display:flex;align-items:center;gap:14px;padding:24px 28px 16px;border-bottom:1px solid var(--o-hair)}',
        '.smx .oxp .oxbr{font:700 24px var(--o-f);letter-spacing:6px;color:var(--o-ink);white-space:nowrap}',
        '.smx .oxp .oxbr span{color:var(--o-or)}',
        '.smx .oxp .oxbr small{font:400 20px var(--o-f);letter-spacing:.5px;color:var(--o-mute);margin-left:14px}',
        '.smx .oxp .oxct{font:18px var(--o-f);color:var(--o-mute);white-space:nowrap}',
        '.smx .oxp .oxwt{display:flex}',
        '.smx .oxp .oxbn{height:42px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;font:600 18px var(--o-f);color:var(--o-ink);border:1px solid #dadce0;border-radius:21px;background:#fff;white-space:nowrap}',
        '.smx .oxp .oxbn:hover{background:var(--o-panel)}',
        '.smx .oxp .oxbn.pri{background:var(--o-or);border-color:var(--o-or);color:#fff}',
        '.smx .oxp .oxbn.pri:hover{background:#e55c10}',
        '.smx .oxp .oxbn.cx{width:42px;padding:0;font-size:26px;font-weight:400}',
        '.smx .oxp .oxbn.wt{background:#fce8e6;border-color:#f6aea9;color:var(--o-err)}',
        '.smx .oxp .oxb{flex:1;min-height:0;overflow:auto;padding:6px 28px 22px;scrollbar-width:thin}',
        '.smx .oxp .oxr{display:grid;grid-template-columns:44px 1fr;column-gap:14px;width:100%;padding:18px 8px;border-bottom:1px solid var(--o-hair)}',
        '.smx .oxp .oxr:hover{background:var(--o-panel)}',
        '.smx .oxp .oxn{font:700 26px/1.25 var(--o-f);color:var(--o-or);text-align:center}',
        '.smx .oxp .oxm{min-width:0;display:flex;flex-direction:column;gap:6px}',
        '.smx .oxp .oxt{display:flex;align-items:center;gap:12px;min-width:0}',
        '.smx .oxp .oxc{font:16px var(--o-f);padding:4px 10px;border-radius:5px;background:#f1f3f4;color:var(--o-mute);white-space:nowrap}',
        '.smx .oxp .oxc.ready{background:var(--o-rdys);color:var(--o-rdy)}.smx .oxp .oxc.hold{background:var(--o-holds);color:var(--o-hold)}.smx .oxp .oxc.sent{background:var(--o-sents);color:var(--o-sent)}',
        '.smx .oxp .oxto{font:18px var(--o-f);color:var(--o-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
        '.smx .oxp .oxw{font:16px var(--o-f);color:var(--o-mute);white-space:nowrap}',
        '.smx .oxp .oxs{display:block;font:600 24px/1.3 var(--o-f);color:var(--o-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.smx .oxp .oxx{font:19px/1.4 var(--o-f);color:var(--o-mute);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
        '.smx .oxp .oxem{padding:60px 0;text-align:center;font:20px var(--o-f);color:var(--o-mute)}',
        '.smx .oxp .oxwait{padding:90px 20px;text-align:center;display:flex;flex-direction:column;gap:12px;font:24px var(--o-f);color:var(--o-ink)}',
        '.smx .oxp .oxwait small{font:18px var(--o-f);color:var(--o-mute)}',
        '.smx .oxp .oxtb{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 0 4px}',
        '.smx .oxp .oxth{font:16px var(--o-f);color:var(--o-mute)}',
        '.smx .oxp .oxsub{display:block;width:100%;font:400 30px/1.3 var(--o-f);color:var(--o-ink);border:0;outline:0;background:transparent;padding:8px 0;margin:6px 0 10px;border-radius:0}',
        '.smx .oxp .oxsub:focus{box-shadow:inset 0 -2px 0 var(--o-or)}',
        '.smx .oxp .oxfr{display:flex;gap:14px;align-items:flex-start;margin-bottom:8px}',
        '.smx .oxp .oxav{flex:0 0 48px;height:48px;border-radius:50%;background:var(--o-or);color:#fff;display:grid;place-items:center;font:700 18px var(--o-f)}',
        '.smx .oxp .oxwho{min-width:0;font:18px/1.45 var(--o-f);color:var(--o-mute);overflow-wrap:anywhere}',
        '.smx .oxp .oxwho b{color:var(--o-ink)}',
        '.smx .oxp .oxnew{display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:var(--o-panel);border:1px solid #d3e3fd;border-radius:10px;padding:12px 16px;margin:8px 0;font:18px var(--o-f);color:var(--o-ink)}',
        '.smx .oxp .oxbody{display:block;width:100%;min-height:240px;font:20px/1.5 var(--o-f);color:#000;border:0;outline:0;background:transparent;resize:none;overflow:hidden;white-space:pre-wrap;padding:8px 0;border-radius:0}',
        '.smx .oxp .oxbody:focus{box-shadow:inset 3px 0 0 var(--o-or);padding-left:14px}',
        '.smx .oxp .oxsig{font:16px/1.45 Arial,Helvetica,sans-serif;color:#000;padding:6px 0 4px}',
        '.smx .oxp .oxsig div{min-height:1.45em}',
        '.smx .oxp .oxsig .o{color:var(--o-or);font-weight:700}.smx .oxp .oxsig .m{letter-spacing:5px;font-weight:700}.smx .oxp .oxsig .m i{font-style:normal;color:var(--o-or)}.smx .oxp .oxsig .d{color:#787878}',
        '.smx .oxp .oxst{flex:none;min-height:50px;padding:12px 28px;border-top:1px solid var(--o-hair);font:18px var(--o-f);color:var(--o-mute)}',
        '.smx .oxp .oxst.err{color:var(--o-err)}',
        '.smx .oxp.am{--o-ink:#151412;--o-text:#222;--o-mute:#5b5a57;--o-hair:#d9d8d4;--o-panel:#f2f1ee;--o-or:#151412;--o-rdy:#2f5d46;--o-rdys:#e3ece6;--o-hold:#7a5a14;--o-holds:#f3ecdc;--o-sent:#3d4f6b;--o-sents:#e4e8ef;--o-d:"Tenor Sans","Helvetica Neue",Arial,sans-serif;--o-s:"Cormorant Garamond",Garamond,"Times New Roman",serif;background:#f7f7f5}',   // 9.4
        '.smx .oxp.am::before{height:1px}',
        '.smx .oxp.am .oxh{border-bottom-color:var(--o-ink)}',
        '.smx .oxp.am .oxbr{display:flex;align-items:flex-end;gap:16px;font:400 22px var(--o-d);letter-spacing:.32em;text-transform:uppercase}',
        '.smx .oxp.am .oxbr small{font:italic 400 26px var(--o-s);letter-spacing:0;text-transform:none;margin-left:2px}',
        '.smx .oxp.am .aml{display:block;width:40px;height:58px;color:var(--o-ink)}.smx .oxp.am .aml svg{display:block;width:100%;height:100%}',
        '.smx .oxp.am .oxbn{border-radius:0;border-color:var(--o-ink);font:400 15px var(--o-d);letter-spacing:.16em;text-transform:uppercase;background:#fff}',
        '.smx .oxp.am .oxbn:hover{background:var(--o-panel)}',
        '.smx .oxp.am .oxbn.pri{background:var(--o-ink);color:#f7f7f5}.smx .oxp.am .oxbn.pri:hover{background:#3a3936}',
        '.smx .oxp.am .oxbn.cx{font:400 26px var(--o-d)}',
        '.smx .oxp.am .oxr{background:#fff;border:1px solid var(--o-hair);margin-top:12px;padding:18px 12px}',
        '.smx .oxp.am .oxn{font:400 26px/1.25 var(--o-d)}',
        '.smx .oxp.am .oxs,.smx .oxp.am .oxsub{font-family:var(--o-d);font-weight:400;letter-spacing:.02em}',
        '.smx .oxp.am .oxc{border-radius:0;font:400 13px var(--o-d);letter-spacing:.14em;text-transform:uppercase;padding:6px 10px}',
        '.smx .oxp.am .oxav{border-radius:0;background:transparent;border:1px solid var(--o-ink);color:var(--o-ink);padding:6px}.smx .oxp.am .oxav svg{width:100%;height:100%}',
        '.smx .oxp.am .oxwait,.smx .oxp.am .oxem{font:italic 400 28px var(--o-s);color:var(--o-mute)}',
        '.smx .oxp.am .oxhn{font:400 13px var(--o-d);letter-spacing:.2em;text-transform:uppercase}',
        '.smx .oxp.am .oxsig .o{color:var(--o-ink);font-weight:400}',
        '.smx .cos,.smx .oxp{top:152px}',   // 9.4: the pill rail stays in view, so Chief and both Outboxes are one tap apart
        '.smx .oxp .oxhn{flex:none;text-align:center;padding:12px;font:16px var(--o-f);letter-spacing:.06em;color:var(--o-mute);border-top:1px solid var(--o-hair)}',
        // 9.0: the night drive look for all of HQ: sunset rules over the panels, the outlined wordmark, Chief's faces
        '.smx.night .gridbg{background:radial-gradient(1400px 600px at 50% -12%,rgba(143,116,255,.2),transparent 70%),linear-gradient(var(--grid) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/48px 48px}',
        '.smx.night :is(.tx,.bar,.ctl)::before{content:"";position:absolute;left:-1px;right:-1px;top:-1px;height:3px;background:linear-gradient(90deg,#52d9ff,#8f74ff 35%,#ff4f9e 68%,#ff9447);pointer-events:none}',
        '.smx .bar .sb b{font-weight:inherit}',
        '.smx.night .bar .sb{font-size:19px;letter-spacing:.14em;color:transparent;-webkit-text-stroke:1.1px var(--ink)}',
        '.smx.night .bar .sb b{background:linear-gradient(180deg,#ffd36e,#ff9447 45%,#ff4f9e);-webkit-background-clip:text;background-clip:text;-webkit-text-stroke:0;color:transparent}',
        '.smx.night .bar .br{font:600 16px var(--mf);letter-spacing:.3em;color:var(--accent)}',
        '.smx.night .ttl{font-size:34px;line-height:1.16;letter-spacing:.06em}',
        '.smx.night :is(.kick,.msg .who,.dock .il,.tgw .ck,.hold .hk,.ck2){font-weight:600;letter-spacing:.24em}',
        '.smx.night .hint{letter-spacing:.3em;color:var(--mute)}',
        '.smx.night .msg .body :is(h1,h2,h3,h4,h5,h6){font-family:var(--bf)!important;font-weight:600!important;text-transform:none;letter-spacing:0}',
        '.smx.night .msg .body li::marker{color:#ff4f9e!important}',
        '.smx.night .hold{box-shadow:inset 0 0 0 2px var(--need)}',
        '.smx.night .hold .hv{font-size:38px;letter-spacing:.06em}',
        '.smx.night .tg .tl{font-weight:500}',
        '.smx.night .tg.on .sw{background:linear-gradient(90deg,#52d9ff,#8f74ff)}',
        '.smx.night :is(.ab,.dkb button){font-size:18px;letter-spacing:.08em}',
        '.smx.night .dkh .dt{font-size:20px;letter-spacing:.16em}',
        '.smx.night :is(.cdst,.cclip,.csend){font-size:15px}',
        '.smx.night .csend{background:linear-gradient(90deg,#ff9447,#ff4f9e);border-color:transparent;color:#0a0912}',
        '.smx.night .lnk .lt{font-size:20px;letter-spacing:.16em}',
        '.smx.night .pgv .pl{font-size:18px}',
        '@media (prefers-reduced-motion:reduce){.smx *{animation:none!important;transition:none!important}.smx.fx-floor .rtfl i{opacity:.5}}'
      ].join('\n');
    }

    // one screen, drawn into any box. The frame is laid out at 1920 wide and scaled to fit;
    // its height follows the box, so a 16:10 display gets a taller stage instead of bars.
    function smMake(host, onAction) {
      const fx = document.createElement('div');
      fx.className = 'smx';
      fx.innerHTML =
        '<div class="gridbg"></div>' +
        '<div class="rtsky" aria-hidden="true"><div class="rtst"></div><div class="rtau"></div><div class="rthz"></div><div class="rtfl"><svg class="rtry" viewBox="0 0 1920 100" preserveAspectRatio="none">' + SM_RAYS + '</svg>' + '<i></i>'.repeat(14) + '</div></div>' +   // 8.9.3, 9.0.1
        '<div class="tx"><div class="hd"><div class="kick">' + SM_HP + '<span class="fl">Screen mode</span></div><div class="ttl">Screen mode</div><div class="sts">Waiting for the chat you&#39;re talking to</div></div>' +
        '<div class="msgs"><div class="mz"><div class="mw">Waiting for the chat you&#39;re talking to</div></div></div>' +
        '<div class="dock" hidden><span class="cn a"></span><span class="cn b"></span><span class="cn c"></span><span class="cn d"></span><div class="il">Image · from this reply</div><div class="im"></div></div>' +
        '<div class="draft" hidden><span class="mic"></span><span class="dw">You</span><span class="dt"></span></div>' +
        '<div class="cmp"><div class="cto"><span class="ck2">To</span><button type="button" class="cdst" title="Follows the chat you are talking to">FLOOR</button><span class="cfl"></span></div>' +
        '<div class="crow"><button type="button" class="cclip" title="Attach files">+</button><textarea class="cin" rows="1" placeholder="Type, paste or drop files" spellcheck="true"></textarea><button type="button" class="csend">SEND</button></div>' +
        '<input type="file" class="cfile" multiple hidden></div>' +
        '<div class="hint">say next · take me to · chief · allow · resume</div><button type="button" class="flw" hidden title="Follow the voice again">FOLLOW</button></div>' +
        '<div class="bar"><span class="br" title="Next look (Option Shift D)"></span><span class="sb">Switche<b>roo</b></span><span class="dots"></span><span class="grow"></span><span class="nx" title="Go to the next chat (Option Shift N)"></span><span class="bt" title="Boot: open your 10 most recent chats behind HQ">BOOT</span><span class="lk zero" title="Links from your chats. Say open, or open two">LINKS</span><span class="pz" title="Pause the Switchboard for two turns, or resume it">LIVE</span></div>' +
        '<div class="prl"><button type="button" class="chp" title="Chief of Staff, any time. Or say chief (Option Shift C)"><i></i><span>Chief</span></button>' +
          '<button type="button" class="oxq" data-oxq="ch" title="CHxTLD Outbox"><i></i><span>CHxTLD</span></button><button type="button" class="oxq am" data-oxq="am" title="ANDRÉ MANDEL Outbox"><i></i><span>Mandel</span></button><span class="gr"></span>' +   // 9.1
        '<span class="pil vwp"><button type="button" data-vw="-1" title="Previous view">‹</button><button type="button" class="pn" data-vw="pick" title="Every view (Option Shift V steps)"><i>View</i><b>Pie</b></button><button type="button" data-vw="1" title="Next view">›</button></span>' +
        '<span class="pil lkp"><button type="button" data-lk="-1" title="Previous look">‹</button><button type="button" class="pn" data-lk="pick" title="Every look, favorites first (Option Shift D steps)"><i>Look</i><b></b></button><button type="button" data-lk="1" title="Next look">›</button></span></div>' +
        '<svg class="smdefs" width="0" height="0" aria-hidden="true" style="position:absolute"><filter id="smwob" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7" result="n"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter><filter id="smwob1" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="1" seed="3" result="n"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter><filter id="smwob3" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".028" numOctaves="3" seed="11" result="n"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="6.5" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter></svg>' +
        '<div class="stage"></div>' +
        '<div class="asks" hidden></div><div class="dkov" hidden></div><div class="cos" hidden></div><div class="oxp" hidden></div><div class="pik" hidden></div><div class="lnk" hidden></div><div class="pgv" hidden></div>' +
        '<div class="ctl" hidden><button type="button" class="hold" data-ctl="hold"><span class="hk">Responses · live</span><span class="hv">Hold</span><span class="hs">Stops every tab until you resume</span></button>' +
        '<div class="tgw"><div class="tgh"><div class="ck">Controls · every tab</div><div class="mdr"><span class="ck mk">Model</span>' +
        ['Sonnet', 'Opus', 'Haiku', 'Fable'].map((n) => '<button type="button" class="md" data-model="' + n.toLowerCase() + '" title="Set every open chat to ' + n + '">' + n + '</button>').join('') +
        '</div></div><div class="tgs">' +
        SM_CTL.map((c) => '<button type="button" class="tg" data-ctl="' + c[0] + '" title="' + smEsc(c[2]) + '" aria-pressed="false"><span class="tl">' + smEsc(c[1]) + '</span><span class="sw"><i></i></span><span class="tv">OFF</span></button>').join('') +
        '<button type="button" class="tg lk3" data-look title="Click for the next look, right click to go back. Or say next look, or a look by name"><span class="tl">Look</span><span class="lsw">' +   // 8.9.3, 9.0.1
        '<i></i>'.repeat(4) + '</span><span class="tv"></span></button>' +
        '</div></div></div>' +
        '<div class="dropov" hidden><div class="dpt">Drop on a chat</div><div class="dps">The center, or anywhere else, goes to the chat you are talking to</div></div>' +
        '<div class="toast" role="status"></div>';
      host.appendChild(fx);
      const q = (s) => fx.querySelector(s);
      let theme = SM_THEMES.dark, stageSig = '', lastHtml = null, lastPath = '', model = null, H = 1080, fontT = null;
      // 8.1: approvals and question cards, the deck overlay, the reading glow
      let askSig = '', armAlways = '', armT = null, multiSel = new Set(), multiKey = '';
      let dkSig = '', dkOpen = false, lpT = null, lpFired = false;
      let cosSig = '', cosOpen = false;   // 9.0
      let pickOpen = '', pickSig = '';    // 9.1: '' or view or look
      let oxSig = '', oxOpen = false, oxEd = null, oxLaneP = 'ch';   // 9.1; 9.4: which Outbox is open
      let lnkOpen = false, lnkSig = '', lnkBiz = '';   // 8.2
      let msgScrollAt = 0, lastTextSig = '';

      function fit() {
        const w = host.clientWidth || window.innerWidth || 1920, h = host.clientHeight || window.innerHeight || 1080;
        const s = Math.min(w / 1920, h / 760);   // 9.4.3: a short window scales the frame down rather than cropping its bottom
        H = Math.max(760, Math.round(h / s));
        fx.style.height = H + 'px';
        fx.style.left = Math.max(0, Math.round((w - 1920 * s) / 2)) + 'px';
        fx.style.transform = 'scale(' + s + ')';
        if (model) { stageSig = ''; paint(model); }
        fitNames();
      }
      function setTheme(t) {
        const was = theme;
        theme = t;
        if (was && was !== t && was.v && t.v && was.v.bg !== t.v.bg) lookFade(was.v.bg);   // 9.3
        const v = t.v;
        const vars = Object.keys(v).map((k) => '--' + k + ':' + v[k]).join(';') + ';--hf:' + t.f.hf + ';--bf:' + t.f.bf + ';--mf:' + t.f.mf + (t.f.wf ? ';--wf:' + t.f.wf : '');
        const fs = fx.style.getPropertyValue('--fs');
        fx.setAttribute('style', vars + (fs ? ';--fs:' + fs : ''));
        fx.className = 'smx ' + t.id + (t.cls ? ' ' + t.cls : '') + (smLab(v.bg)[0] > 60 ? ' lt' : '') + (askSig ? ' asking' : '') + (dkOpen ? ' decking' : '') + (cosOpen ? ' cosing' : '') + (oxOpen ? ' oxing' : '');
        cosSig = '';
        const lk = q('.tg.lk3');   // 9.0.1: four of the look's colors, its number and name
        if (lk) {
          lk.querySelector('.tl').textContent = 'Look';
          lk.querySelector('.tv').textContent = smPad(SM_LOOKS.indexOf(t.id) + 1) + ' ' + (t.tag || t.id);
          const c4 = [v.accent, v.need, v.wait, v.work];
          lk.querySelectorAll('.lsw i').forEach((i, k) => { i.style.background = c4[k]; });
        }
        smFontsFor(t, () => { clearTimeout(fontT); fontT = setTimeout(() => { if (theme === t) fit(); }, 150); });
        const br = q('.br');
        br.textContent = t.brand;
        if (t.logo) {
          const im = new Image();
          im.alt = t.brand;
          im.onload = () => { if (theme === t) br.replaceChildren(im); };
          im.src = t.logo;
        }
        fit();
      }
      // clicks: a rail or wedge jumps to that chat, NEXT jumps to the next one,
      // the pill pauses or resumes the Switchboard, the brand flips light and dark
      fx.addEventListener('click', (ev) => {
        if (!onAction) return;
        // 8.1: the pie's center: a click is play or pause, a long press is meeting mode
        if (ev.target.closest('[data-center]')) { if (lpFired) { lpFired = false; return; } onAction({ t: 'center' }); return; }
        if (ev.target.closest('.flw')) { follow(); return; }
        // 9.1: the pill rail and the pickers
        if (ev.target.closest('.prl .chp')) { onAction({ t: cosOpen ? 'cos' : 'jump', cmd: 'close', id: '__chief' }); return; }
        const oq = ev.target.closest('.prl [data-oxq]');   // 9.4: either Outbox, one tap
        if (oq) { const l = oq.getAttribute('data-oxq'); onAction(oxOpen && oxLaneP === l ? { t: 'ox', cmd: 'close', lane: l } : { t: 'jump', id: l === 'am' ? '__amoutbox' : '__outbox' }); return; }
        const vw = ev.target.closest('[data-vw]');
        if (vw) { const a = vw.getAttribute('data-vw'); if (a === 'pick') togglePick('view'); else onAction({ t: 'view', step: +a }); return; }
        const lp = ev.target.closest('[data-lk]');
        if (lp) { const a = lp.getAttribute('data-lk'); if (a === 'pick') togglePick('look'); else onAction({ t: 'theme', dir: +a }); return; }
        const fv = ev.target.closest('[data-fav]');
        if (fv) { onAction({ t: 'fav', id: fv.getAttribute('data-fav') }); return; }
        const pl = ev.target.closest('[data-pl]');
        if (pl) { onAction({ t: 'lookset', id: pl.getAttribute('data-pl') }); return; }
        const pv = ev.target.closest('[data-pv]');
        if (pv) { togglePick(''); onAction({ t: 'view', id: pv.getAttribute('data-pv') }); return; }
        const pc2 = ev.target.closest('[data-clock]');   // 9.3
        if (pc2) { onAction({ t: 'clock', on: pc2.getAttribute('data-clock') === 'on' }); return; }
        const ps = ev.target.closest('[data-step]');
        if (ps) { onAction({ t: 'lkstep', mode: ps.getAttribute('data-step') }); return; }
        if (ev.target.closest('[data-pik="close"]')) { togglePick(''); return; }
        const ap = ev.target.closest('[data-appr]');
        if (ap) {
          const k = ap.getAttribute('data-appr'), id = ap.getAttribute('data-id');
          if (k === 'always') {   // Always allow takes a second click, since it sticks
            const e = ((model && model.tabs) || []).find((x) => x.id === id);
            const tag = id + '|' + (e ? (e.reqKey || e.folder) : '');
            if (armAlways !== tag) {
              armAlways = tag; askSig = ''; renderAsks(model);
              clearTimeout(armT); armT = setTimeout(() => { armAlways = ''; askSig = ''; if (model) renderAsks(model); }, 4000);
              return;
            }
            armAlways = ''; clearTimeout(armT);
          }
          onAction({ t: 'appr', k, id });
          return;
        }
        const pk = ev.target.closest('[data-pick]');
        if (pk) {
          const v = pk.getAttribute('data-pick'), ask = model && model.floor && model.floor.ask;
          if (!ask) return;
          if (v === 'skip') { onAction({ t: 'pick', key: ask.key, n: 'skip' }); return; }
          if (v === 'submit') { if (!multiSel.size) { flash('Pick one or more first'); return; } onAction({ t: 'pick', key: ask.key, n: [...multiSel].sort((a, b) => a - b) }); return; }
          const n = +v;
          if (ask.multi) { if (multiSel.has(n)) multiSel.delete(n); else multiSel.add(n); askSig = ''; renderAsks(model); return; }
          onAction({ t: 'pick', key: ask.key, n });
          return;
        }
        const cc = ev.target.closest('[data-cos]');   // 9.0
        if (cc) { if (!cc.disabled) onAction({ t: 'cos', cmd: cc.getAttribute('data-cos'), id: cc.getAttribute('data-id') || '', n: +cc.getAttribute('data-n') || 0 }); return; }
        const oc = ev.target.closest('[data-ox]');   // 9.1
        if (oc) { if (!oc.disabled) oxClick(oc.getAttribute('data-ox'), oc.getAttribute('data-id') || ''); return; }
        const dc = ev.target.closest('[data-dk]');
        if (dc) { if (!dc.disabled) onAction({ t: 'deck', cmd: dc.getAttribute('data-dk'), deck: dc.getAttribute('data-deck') || '' }); return; }
        const md = ev.target.closest('[data-model]');
        if (md) { onAction({ t: 'model', name: md.getAttribute('data-model') }); return; }   // 8.8
        if (ev.target.closest('[data-look]')) { onAction({ t: 'theme' }); return; }   // 8.9.3
        const c = ev.target.closest('[data-ctl]');
        if (c) { onAction({ t: 'ctl', k: c.getAttribute('data-ctl') }); return; }   // 8.0
        const j = ev.target.closest('[data-jump]');
        if (j) { onAction({ t: 'jump', id: j.getAttribute('data-jump') }); return; }
        if (ev.target.closest('.nx')) { onAction({ t: 'next' }); return; }
        if (ev.target.closest('.pz')) { onAction({ t: 'pause' }); return; }
        if (ev.target.closest('.bar .bt')) { onAction({ t: 'boot' }); return; }   // 8.9
        // 8.2: links and pages
        if (ev.target.closest('.bar .lk')) { lnkOpen = !lnkOpen; lnkSig = ''; if (model) renderLinks(model); return; }
        const lc = ev.target.closest('[data-lnk]');
        if (lc) {
          const k = lc.getAttribute('data-lnk');
          if (k === 'close') { lnkOpen = false; lnkSig = ''; renderLinks(model); return; }
          if (k === 'tab') { lnkBiz = lc.getAttribute('data-biz'); lnkSig = ''; renderLinks(model); return; }
          if (k === 'biz') { onAction({ t: 'biz', path: lc.getAttribute('data-path'), biz: lc.getAttribute('data-biz') }); return; }
          if (k === 'open') { lnkOpen = false; lnkSig = ''; renderLinks(model); onAction({ t: 'page', url: lc.getAttribute('data-url'), label: lc.getAttribute('data-label'), n: +lc.getAttribute('data-n') || 0 }); return; }
          return;
        }
        const pc = ev.target.closest('[data-pg]');
        if (pc) { onAction({ t: 'pageAct', k: pc.getAttribute('data-pg') }); return; }
        if (ev.target.closest('.br')) onAction({ t: 'theme' });
      });
      fx.addEventListener('contextmenu', (ev) => {   // 9.0.1
        if (!ev.target.closest('[data-look]') || !onAction) return;
        ev.preventDefault(); onAction({ t: 'theme', dir: -1 });
      });
      fx.addEventListener('pointerdown', (ev) => {
        if (!ev.target.closest('[data-center]') || !onAction) return;
        lpFired = false; clearTimeout(lpT);
        lpT = setTimeout(() => { lpFired = true; onAction({ t: 'meeting' }); }, 650);
      });
      const lpEnd = () => clearTimeout(lpT);
      fx.addEventListener('pointerup', lpEnd); fx.addEventListener('pointerleave', lpEnd); fx.addEventListener('pointercancel', lpEnd);
      let flashT = null;
      function flash(text) {
        const el = q('.toast');
        el.textContent = text; el.classList.add('on');
        clearTimeout(flashT); flashT = setTimeout(() => el.classList.remove('on'), 2600);
      }
      function setZoom(z) { fx.style.setProperty('--fs', Math.round(26 * z) + 'px'); }

      // ---------- 9.1: VIEWS. The same chats drawn eleven ways; the View pill steps through them ----------
      // Every view gets the same list, colors and clicks as the pie: a click on a chat jumps there, the hub
      // pauses or plays everything (hold it for meeting mode), and the clocks tick once a second.
      let viewId = 'pie';
      const vSide = (e) => !!(e.deck || e.chief || e.outbox);   // the wedges that aren't chats
      const vTitle = (e) => e.deck ? 'Swipe Deck' : e.chief ? 'Chief of Staff' : e.outbox ? (e.lane === 'am' ? 'ANDRÉ MANDEL Outbox' : 'CHxTLD Outbox') : String(e.title || e.name || 'Claude');
      const vShort = (e, i) => e.deck ? 'SD' : e.chief ? 'COS' : e.outbox ? (e.lane === 'am' ? 'AMO' : 'OUT') : smPad(i + 1);
      const vName = (e, i) => vShort(e, i) + ' ' + vTitle(e);
      function vRight(e, k) {
        const timed = !vSide(e) && (smWaits(k) || k === 'turn');
        const txt = e.deck ? (e.deckN || 0) + ' OPEN' : e.chief ? (e.closed ? 'OPEN IT' : e.chiefN ? e.chiefN + ' NEED YOU' : 'CLEAR') :
          e.outbox ? (e.closed ? 'OPEN IT' : e.oxN ? e.oxN + ' READY' : 'CLEAR') :
          timed ? smClock(Date.now() - (e.since || Date.now())) : k === 'work' ? 'LIVE' : '';
        return { txt, attr: timed ? ' data-since="' + (e.since || 0) + '"' : '' };
      }
      // text that trims itself to a width once the font is in (fitNames)
      const vFit = (x, y, s, w, size, fill, font, extra) => '<text class="fit" data-w="' + Math.round(w) + '" data-full="' + smEsc(s) + '" x="' + smF1(x) + '" y="' + smF1(y) +
        '" font-size="' + size + '" fill="' + fill + '" font-family=\'' + font + '\' dominant-baseline="central"' + (extra == null ? '' : extra) + '>' + smEsc(s) + '</text>';
      const vHitBg = (x, y, w, h, v) => '<rect class="hitbg" x="' + smF1(x) + '" y="' + smF1(y) + '" width="' + smF1(w) + '" height="' + smF1(h) + '" fill="' + v.ink + '" fill-opacity="0"></rect>';
      const vFloor = (x, y, w, h, v) => '<rect x="' + smF1(x) + '" y="' + smF1(y) + '" width="' + smF1(w) + '" height="' + smF1(h) + '" fill="none" stroke="' + v.ink + '" stroke-width="2"></rect>';
      // the hub: the pie's center, as a button any view can carry. Drawn at radius 74, scaled by the view
      function vHub(c) {
        const { t, v, ex, waiting } = c;
        let o = '<g class="hit ctr" data-center="1"><title>' + (ex.held ? 'Play: everything comes back' : 'Pause everything. Hold down for meeting mode') + '</title>' +
          '<circle class="cb" r="74" fill="' + (ex.held ? v.need : v.bg2) + '" stroke="' + (ex.held ? v.need : v.line) + '" stroke-width="' + (ex.held ? 4 : 2) + '"></circle>';
        if (ex.held) o += '<path d="M-14,-34 L22,-14 L-14,6 Z" fill="' + v.bg + '"></path>' + smTxt(0, 30, ex.meeting ? 'MEETING' : 'PAUSED', 16, v.bg, t.f.mf, ' text-anchor="middle" letter-spacing="3" font-weight="700"');
        else o += '<rect x="-13" y="-46" width="9" height="24" fill="' + v.ink + '"></rect><rect x="4" y="-46" width="9" height="24" fill="' + v.ink + '"></rect>' +
          smTxt(0, 2, smPad(waiting), 42, waiting ? v.need : v.mute, t.f.hf, ' text-anchor="middle" font-weight="700"') + smTxt(0, 38, 'NEED YOU', 14, v.mute, t.f.mf, ' text-anchor="middle" letter-spacing="3"');
        return o + '</g>';
      }
      // a header band for the views that read top to bottom: the hub, the view's name, and the color key
      function vHead(c, title, sub) {
        const { t, v } = c;
        let o = '<g transform="translate(38,38) scale(.42)">' + vHub(c) + '</g>' +
          smTxt(86, 26, title.toUpperCase(), 21, v.ink, t.f.hf, ' font-weight="700" letter-spacing="2"') + smTxt(86, 52, sub, 14, v.mute, t.f.mf, ' letter-spacing="1"');
        [['need', 'NEEDS YOU'], ['wait', 'YOUR TURN'], ['work', 'WORKING'], ['idle', 'IDLE']].forEach(([k, l], j) => {
          const x = 610 + j * 120;
          o += '<circle cx="' + x + '" cy="38" r="7" fill="' + v[k] + '"></circle>' + smTxt(x + 14, 38, l, 13, v.mute, t.f.mf, ' letter-spacing="1"');
        });
        return o;
      }
      const vEmpty = (c, y) => smTxt(550, y, 'No chats yet. Open one and it lands here', 22, c.v.mute, c.t.f.mf, ' text-anchor="middle" letter-spacing="1"');
      const vRing = (k) => (k === 'need' || k === 'question' ? 0 : k === 'wait' || k === 'turn' ? 1 : k === 'work' ? 2 : 3);
      const vSat = (k) => SM_SAT[k] || 0.2;
      const vFillOp = (k) => smF1(0.12 + 0.44 * vSat(k));
      function vHash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
      function vRand(seed) { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

      // RADAR: rings by what each chat needs, needs you at the center; a sweep goes round, the list sits right
      function vRadar(c) {
        const { t, v, list, fid, H } = c;
        const R = Math.min(H / 2 - 24, 300), cx = R + 34, cy = H / 2;
        const bands = [0.44, 0.66, 0.86, 1], spots = [0.33, 0.55, 0.76, 0.93], names = ['NEEDS YOU', 'YOUR TURN', 'WORKING', 'IDLE'];
        let o = '<circle cx="' + cx + '" cy="' + cy + '" r="' + smF1(R * 1.2) + '" fill="url(#' + c.P + 'g)"></circle><g transform="translate(' + smF1(cx) + ',' + smF1(cy) + ')">';
        bands.forEach((b, j) => {
          o += '<circle r="' + smF1(R * b) + '" fill="none" stroke="' + v.line + '" stroke-width="' + (j === 3 ? 2 : 1.2) + '"' + (j === 3 ? '' : ' stroke-dasharray="4 7"') + '></circle>' +
            smTxt(0, -R * b + 13, names[j], 12, v.mute, t.f.mf, ' text-anchor="middle" letter-spacing="2"');
        });
        o += '<line x1="' + smF1(-R) + '" y1="0" x2="' + smF1(R) + '" y2="0" stroke="' + v.line + '" stroke-opacity=".6"></line><line x1="0" y1="' + smF1(-R) + '" x2="0" y2="' + smF1(R) + '" stroke="' + v.line + '" stroke-opacity=".6"></line>' + smTicks(t, R, 72, 6, 6);
        o += '<g class="vsweep">' + [[-42, -28, 0.05], [-28, -14, 0.1], [-14, 0, 0.2]].map(([a0, a1, op]) => '<path d="' + smSector(0, Math.round(R), a0, a1) + '" fill="' + v.accent + '" fill-opacity="' + op + '"></path>').join('') +
          '<line x1="0" y1="0" x2="0" y2="' + smF1(-R) + '" stroke="' + v.accent + '" stroke-width="2" stroke-opacity=".8"></line></g>';
        const byRing = [[], [], [], []];
        list.forEach((e, i) => byRing[vRing(smKind(e))].push(i));
        const pos = {};
        byRing.forEach((ids, j) => ids.forEach((i, n) => { pos[i] = smPol(R * spots[j], (n / ids.length) * 360 + j * 37 + 18); }));
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), p = pos[i], r = 9 + 11 * vSat(k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><circle cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r + 12) + '" fill="' + v.ink + '" fill-opacity="0" class="hitbg"></circle>' +
            (k === 'need' ? '<circle class="pulse" cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r + 9) + '" fill="' + col + '" fill-opacity=".25"></circle>' : '') +
            '<circle cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r) + '" fill="' + col + '" fill-opacity="' + smF1(0.35 + 0.6 * vSat(k)) + '" stroke="' + col + '" stroke-width="2"></circle>' +
            (e.id === fid ? '<circle cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r + 6) + '" fill="none" stroke="' + v.ink + '" stroke-width="2"></circle>' : '') +
            smTxt(p[0] + r + 7, p[1], vShort(e, i), 17, v.ink, t.f.mf, ' font-weight="700"') + '</g>';
        });
        o += '<g transform="scale(' + smF1(Math.max(0.3, R * 0.2 / 74)) + ')">' + vHub(c) + '</g></g>';
        // the list on the right
        const x0 = cx + R + 56, W = 1080 - x0, n = list.length, rh = n ? Math.min(58, (H - 30) / n) : 58, y0 = Math.max(16, H / 2 - rh * n / 2);
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), y = y0 + i * rh, rt = vRight(e, k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '">' + vHitBg(x0 - 10, y, W + 14, rh - 4, v) + (e.id === fid ? vFloor(x0 - 10, y, W + 14, rh - 4, v) : '') +
            '<circle cx="' + smF1(x0 + 6) + '" cy="' + smF1(y + rh / 2 - 2) + '" r="7" fill="' + col + '"' + (k === 'need' ? ' class="pulse"' : '') + '></circle>' +
            vFit(x0 + 22, y + rh / 2 - 2, vName(e, i).toUpperCase(), W - 110, 17, k === 'idle' ? v.mute : v.ink, t.f.rf || t.f.mf, ' font-weight="700"') +
            '<text x="' + smF1(x0 + W) + '" y="' + smF1(y + rh / 2 - 2) + '" font-size="15" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + rt.attr + '>' + smEsc(rt.txt) + '</text></g>';
        });
        return o;
      }

      // PUZZLE: every chat a jigsaw piece; the pieces lock together, brighter the more a chat needs you
      function vPuzzleEdge(ax, ay, bx, by, nx, ny, d, s) {
        if (!d) return ' L' + smF1(bx) + ',' + smF1(by);
        const p = (u, h) => smF1(ax + (bx - ax) * u + nx * h * d * s) + ',' + smF1(ay + (by - ay) * u + ny * h * d * s);
        return ' L' + p(0.37, 0) + ' C' + p(0.41, 0.35) + ' ' + p(0.29, 1) + ' ' + p(0.5, 1) + ' C' + p(0.71, 1) + ' ' + p(0.59, 0.35) + ' ' + p(0.63, 0) + ' L' + smF1(bx) + ',' + smF1(by);
      }
      function vPuzzle(c) {
        const { t, v, list, fid, H } = c, n = list.length;
        let o = vHead(c, 'Puzzle', 'one piece per chat · brighter needs you more');
        if (!n) return o + vEmpty(c, H / 2);
        const cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.8))), rows = Math.ceil(n / cols);
        const top = 92, aw = 1100 - 90, ah = H - top - 34;
        const w = Math.min(230, aw / cols), h = Math.min(176, ah / rows), s = Math.min(w, h) * 0.19;
        const gx = (1100 - cols * w) / 2, gy = top + (ah - rows * h) / 2 + 10;
        const dirH = (r, q) => ((r + q) % 2 ? 1 : -1), dirV = (r, q) => ((r + q) % 2 ? -1 : 1);
        list.forEach((e, i) => {
          const r = Math.floor(i / cols), q = i % cols, x = gx + q * w, y = gy + r * h;
          const eT = r === 0 ? 0 : -dirH(r - 1, q), eB = (r === rows - 1 || i + cols >= n) ? 0 : dirH(r, q);
          const eL = q === 0 ? 0 : -dirV(r, q - 1), eR = (q === cols - 1 || i + 1 >= n) ? 0 : dirV(r, q);
          const d = 'M' + smF1(x) + ',' + smF1(y) + vPuzzleEdge(x, y, x + w, y, 0, -1, eT, s) + vPuzzleEdge(x + w, y, x + w, y + h, 1, 0, eR, s) +
            vPuzzleEdge(x + w, y + h, x, y + h, 0, 1, eB, s) + vPuzzleEdge(x, y + h, x, y, -1, 0, eL, s) + ' Z';
          const k = smKind(e), col = smCol(t, k), rt = vRight(e, k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><path d="' + d + '" fill="' + col + '" fill-opacity="' + vFillOp(k) + '" stroke="' + (e.id === fid ? v.ink : col) + '" stroke-width="' + (e.id === fid ? 3.5 : 2) + '"' + (k === 'need' ? ' class="pulse"' : '') + '></path>' +
            smTxt(x + w / 2, y + h * 0.33, vShort(e, i), Math.round(Math.min(34, h * 0.24)), v.ink, t.f.hf, ' text-anchor="middle" font-weight="700"') +
            vFit(x + w / 2, y + h * 0.56, vTitle(e), w - 40, Math.round(Math.min(18, h * 0.13)), v.ink, t.f.bf, ' text-anchor="middle"') +
            '<text x="' + smF1(x + w / 2) + '" y="' + smF1(y + h * 0.76) + '" font-size="' + Math.round(Math.min(14, h * 0.1)) + '" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="middle"' + rt.attr + '>' + smEsc(rt.txt || smStatus(e, k)) + '</text></g>';
        });
        return o;
      }

      // SEISMOGRAPH: one trace per chat, rolling left. The more a chat needs you, the bigger the quake
      function vSeismo(c) {
        const { t, v, list, fid, H } = c, n = list.length;
        let o = vHead(c, 'Seismograph', 'one trace per chat · the bigger the quake, the more it needs you');
        if (!n) return o + vEmpty(c, H / 2);
        const top = 86, X0 = 330, TW = 740, rh = Math.min(92, (H - top - 16) / n);
        const AMP = { need: 1, question: 0.8, wait: 0.56, turn: 0.36, work: 0.22, idle: 0.04 }, DUR = { need: 4, question: 5, wait: 7, turn: 9, work: 8, idle: 22 };
        for (let m = 0; m <= 10; m++) o += '<line x1="' + (X0 + m * TW / 10) + '" y1="' + top + '" x2="' + (X0 + m * TW / 10) + '" y2="' + smF1(top + rh * n) + '" stroke="' + v.line + '" stroke-opacity=".45" stroke-dasharray="2 6"></line>';
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), y = top + i * rh, cy = y + rh / 2, A = rh * 0.42 * (AMP[k] || 0.1), rnd = vRand(vHash(e.id) || 7), rt = vRight(e, k);
          let pts = '', yv = 0;
          for (let x = 0; x <= TW; x += 5) {
            const ph = x / TW * Math.PI * 2;
            if (k === 'work') yv = Math.sin(ph * 9) * 0.35 + (x % 148 < 10 ? (rnd() - 0.5) * 2 : 0);
            else if (k === 'idle') yv = (rnd() - 0.5) * 0.4;
            else { const burst = (Math.sin(ph * 3 + (vHash(e.id) % 7)) + 1) / 2; yv = (rnd() - 0.5) * 2 * (0.25 + 0.75 * burst * burst); }
            if (x === 0 || x >= TW) yv = 0;
            pts += (pts ? ' ' : '') + smF1(x) + ',' + smF1(-yv * A);
          }
          const pts2 = pts.split(' ').map((pp) => { const [a, b] = pp.split(','); return smF1(+a + TW) + ',' + b; }).join(' ');
          o += '<clipPath id="' + c.P + 'sc' + i + '"><rect x="' + X0 + '" y="' + smF1(y) + '" width="' + TW + '" height="' + smF1(rh) + '"></rect></clipPath>';
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '">' + vHitBg(10, y + 1, 1080, rh - 2, v) + (e.id === fid ? vFloor(10, y + 1, 1080, rh - 2, v) : '') +
            '<line x1="' + X0 + '" y1="' + smF1(cy) + '" x2="' + (X0 + TW) + '" y2="' + smF1(cy) + '" stroke="' + v.line + '"></line>' +
            '<g clip-path="url(#' + c.P + 'sc' + i + ')"><g transform="translate(' + X0 + ',' + smF1(cy) + ')"><g class="vscroll" style="animation-duration:' + (DUR[k] || 9) + 's"><polyline points="' + pts + ' ' + pts2 + '" fill="none" stroke="' + col + '" stroke-width="' + (k === 'need' ? 2.4 : 1.8) + '" stroke-linejoin="round"></polyline></g></g></g>' +
            '<circle cx="' + (X0 + TW) + '" cy="' + smF1(cy) + '" r="5" fill="' + col + '"' + (k === 'need' ? ' class="pulse"' : '') + '></circle>' +
            vFit(24, y + rh * 0.36, vName(e, i).toUpperCase(), 280, Math.round(Math.min(18, rh * 0.26)), k === 'idle' ? v.mute : v.ink, t.f.rf || t.f.mf, ' font-weight="700"') +
            '<text x="24" y="' + smF1(y + rh * 0.7) + '" font-size="' + Math.round(Math.min(14, rh * 0.2)) + '" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central"' + rt.attr + '>' + smEsc(rt.txt || smStatus(e, k)) + '</text></g>';
        });
        return o;
      }

      // MIXER: a channel strip per chat, like a desk. The meter climbs the more a chat needs you; the peak lamp is an approval
      function vMixer(c) {
        const { t, v, list, fid, H } = c, n = list.length;
        let o = vHead(c, 'Mixer', 'one channel per chat · the hotter the meter, the more it needs you');
        if (!n) return o + vEmpty(c, H / 2);
        const top = 86, cw = Math.min(124, 1060 / n), x0 = (1100 - n * cw) / 2, sh = H - top - 14, S = 18, mt = top + 34, mh = sh - 140, seg = mh / S;
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), x = x0 + i * cw, lit = Math.max(1, Math.round(S * vSat(k))), rt = vRight(e, k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><rect x="' + smF1(x + 5) + '" y="' + top + '" width="' + smF1(cw - 10) + '" height="' + smF1(sh) + '" fill="' + v.bg2 + '" fill-opacity=".55" stroke="' + (e.id === fid ? v.ink : v.line) + '" stroke-width="' + (e.id === fid ? 2.5 : 1) + '"></rect>' +
            '<circle cx="' + smF1(x + cw / 2) + '" cy="' + (top + 16) + '" r="6" fill="' + (k === 'need' ? v.need : v.line) + '"' + (k === 'need' ? ' class="pulse"' : '') + '></circle>';
          const mx = x + cw / 2 - 20;
          for (let s2 = 0; s2 < S; s2++) {
            const on = s2 < lit, fr = s2 / S, sc = fr < 0.55 ? v.work : fr < 0.8 ? v.wait : v.need;
            o += '<rect x="' + smF1(mx) + '" y="' + smF1(mt + mh - (s2 + 1) * seg + 1.5) + '" width="20" height="' + smF1(Math.max(2, seg - 3)) + '" fill="' + (on ? sc : v.line) + '" fill-opacity="' + (on ? 0.95 : 0.3) + '"' + (on && s2 === lit - 1 && k !== 'idle' ? ' class="vflick"' : '') + '></rect>';
          }
          const fy = mt + mh - mh * vSat(k);
          o += '<line x1="' + smF1(mx + 34) + '" y1="' + smF1(mt) + '" x2="' + smF1(mx + 34) + '" y2="' + smF1(mt + mh) + '" stroke="' + v.line + '" stroke-width="3"></line>' +
            '<rect x="' + smF1(mx + 26) + '" y="' + smF1(fy - 7) + '" width="16" height="14" fill="' + v.ink + '"></rect>' +
            smTxt(x + cw / 2, mt + mh + 32, vShort(e, i), Math.round(Math.min(26, cw * 0.24)), col, t.f.hf, ' text-anchor="middle" font-weight="700"') +
            vFit(x + cw / 2, mt + mh + 64, vTitle(e), cw - 18, 14, v.ink, t.f.bf, ' text-anchor="middle"') +
            '<text x="' + smF1(x + cw / 2) + '" y="' + smF1(mt + mh + 90) + '" font-size="12" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="middle"' + rt.attr + '>' + smEsc(rt.txt || (k === 'idle' ? 'IDLE' : '')) + '</text></g>';
        });
        return o;
      }

      // ORBIT: the hub is the sun. Chats that need you circle close; working and idle ones drift far out
      function vOrbit(c) {
        const { t, v, list, fid, H } = c;
        const cx = 550, cy = H / 2 + 6, RX = [215, 350, 482], k2 = Math.min(0.5, (H / 2 - 50) / 482), RY = RX.map((r) => r * k2);
        let o = '<circle cx="' + cx + '" cy="' + smF1(cy) + '" r="260" fill="url(#' + c.P + 'g)"></circle>';
        RX.forEach((rx, j) => { o += '<ellipse cx="' + cx + '" cy="' + smF1(cy) + '" rx="' + rx + '" ry="' + smF1(RY[j]) + '" fill="none" stroke="' + v.line + '" stroke-dasharray="' + (j === 0 ? '0' : '5 8') + '"></ellipse>'; });
        o += smTxt(cx + RX[0] + 8, cy, 'NEEDS YOU', 11, v.mute, t.f.mf, ' letter-spacing="2"') + smTxt(cx + RX[1] + 8, cy, 'YOUR TURN', 11, v.mute, t.f.mf, ' letter-spacing="2"') + smTxt(cx + RX[2] - 70, cy - RY[2] - 12, 'WORKING · IDLE', 11, v.mute, t.f.mf, ' letter-spacing="2"');
        const ring = (k) => Math.min(2, vRing(k)), by = [[], [], []];
        list.forEach((e, i) => by[ring(smKind(e))].push(i));
        const pos = {};
        by.forEach((ids, j) => ids.forEach((i, m) => { const a = ((m / ids.length) * 360 + j * 50 + 205) * Math.PI / 180; pos[i] = [cx + RX[j] * Math.cos(a), cy + RY[j] * Math.sin(a)]; }));
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), p = pos[i], r = 15 + 17 * vSat(k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><circle class="hitbg" cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r + 14) + '" fill="' + v.ink + '" fill-opacity="0"></circle>' +
            '<circle cx="' + smF1(p[0]) + '" cy="' + smF1(p[1]) + '" r="' + smF1(r) + '" fill="' + col + '" fill-opacity="' + smF1(0.3 + 0.6 * vSat(k)) + '" stroke="' + (e.id === fid ? v.ink : col) + '" stroke-width="' + (e.id === fid ? 3 : 2) + '"' + (k === 'need' ? ' class="pulse"' : '') + '></circle>' +
            smTxt(p[0], p[1], vShort(e, i), 15, vSat(k) > 0.8 && t.onSat ? t.onSat : v.ink, t.f.mf, ' text-anchor="middle" font-weight="700"') +
            vFit(p[0], p[1] + r + 15, vTitle(e), 150, 14, k === 'idle' ? v.mute : v.ink, t.f.bf, ' text-anchor="middle"') + '</g>';
        });
        o += '<g transform="translate(' + cx + ',' + smF1(cy) + ') scale(.6)">' + vHub(c) + '</g>';
        return o;
      }

      // LANES: four columns, like a pin board. Needs you, your turn, working, idle
      function vLanes(c) {
        const { t, v, list, fid, H } = c;
        let o = vHead(c, 'Lanes', 'every chat in the column it belongs to');
        const L = [['Needs you', ['need', 'question'], 'need'], ['Your turn', ['wait', 'turn'], 'wait'], ['Working', ['work'], 'work'], ['Idle', ['idle'], 'idle']];
        const cw = (1100 - 40 - 3 * 16) / 4, top = 92;
        const groups = L.map((l) => list.map((e, i) => ({ e, i, k: smKind(e) })).filter((x) => l[1].includes(x.k)));
        const most = Math.max(1, ...groups.map((g) => g.length)), ch = Math.max(44, Math.min(96, (H - top - 56) / most - 10));
        L.forEach((l, j) => {
          const x = 20 + j * (cw + 16), col = v[l[2]], g = groups[j];
          o += smTxt(x, top + 10, l[0].toUpperCase(), 17, v.ink, t.f.hf, ' font-weight="700" letter-spacing="1.5"') +
            smTxt(x + cw, top + 10, String(g.length), 17, col, t.f.mf, ' text-anchor="end" font-weight="700"') +
            '<rect x="' + smF1(x) + '" y="' + (top + 26) + '" width="' + smF1(cw) + '" height="3" fill="' + col + '"></rect>';
          g.forEach((it, m) => {
            const y = top + 40 + m * (ch + 10), rt = vRight(it.e, it.k);
            o += '<g class="hit" data-jump="' + smEsc(it.e.id) + '"><rect x="' + smF1(x) + '" y="' + smF1(y) + '" width="' + smF1(cw) + '" height="' + smF1(ch) + '" fill="' + v.bg2 + '" fill-opacity=".7" stroke="' + (it.e.id === fid ? v.ink : v.line) + '" stroke-width="' + (it.e.id === fid ? 2.5 : 1) + '"></rect>' +
              '<rect x="' + smF1(x) + '" y="' + smF1(y) + '" width="6" height="' + smF1(ch) + '" fill="' + col + '"' + (it.k === 'need' ? ' class="pulse"' : '') + '></rect>' +
              vFit(x + 18, y + (ch >= 64 ? ch * 0.36 : ch / 2), vName(it.e, it.i), cw - 30 - (ch >= 64 ? 0 : 70), 17, v.ink, t.f.bf, ' font-weight="600"') +
              (ch >= 64 ? '<text x="' + smF1(x + 18) + '" y="' + smF1(y + ch * 0.72) + '" font-size="14" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central"' + rt.attr + '>' + smEsc(rt.txt || smStatus(it.e, it.k)) + '</text>' :
                '<text x="' + smF1(x + cw - 10) + '" y="' + smF1(y + ch / 2) + '" font-size="13" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + rt.attr + '>' + smEsc(rt.txt) + '</text>') + '</g>';
          });
        });
        return o;
      }

      // TIMELINE: how long each chat has sat where it is, over the last twenty minutes, now at the right
      function vTimeline(c) {
        const { t, v, P, list, fid, H } = c, n = list.length;
        let o = vHead(c, 'Timeline', 'how long each chat has waited, the last twenty minutes');
        if (!n) return o + vEmpty(c, H / 2);
        const top = 96, X0 = 330, X1 = 1066, span = 1200000, k1 = (X1 - X0) / span, rh = Math.min(64, (H - top - 20) / n), now = Date.now();
        [20, 15, 10, 5, 0].forEach((m) => {
          const x = X1 - m * 60000 * k1;
          o += '<line x1="' + smF1(x) + '" y1="' + top + '" x2="' + smF1(x) + '" y2="' + smF1(top + rh * n) + '" stroke="' + v.line + '" stroke-dasharray="' + (m ? '3 6' : '0') + '"></line>' +
            smTxt(x, top - 10, m ? m + 'M' : 'NOW', 12, m ? v.mute : v.ink, t.f.mf, ' text-anchor="middle" letter-spacing="1.5"');
        });
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), y = top + i * rh, rt = vRight(e, k), bh = rh * 0.42, by = y + (rh - bh) / 2;
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '">' + vHitBg(10, y + 1, 1080, rh - 2, v) + (e.id === fid ? vFloor(10, y + 1, 1080, rh - 2, v) : '') +
            vFit(24, y + rh / 2, vName(e, i).toUpperCase(), 210, Math.round(Math.min(17, rh * 0.3)), k === 'idle' ? v.mute : v.ink, t.f.rf || t.f.mf, ' font-weight="700"') +
            '<text x="' + (X0 - 14) + '" y="' + smF1(y + rh / 2) + '" font-size="14" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + rt.attr + '>' + smEsc(rt.txt) + '</text>';
          if (vSide(e)) o += '<path d="M' + smF1(X1) + ',' + smF1(by) + ' l' + smF1(bh / 2) + ',' + smF1(bh / 2) + ' l' + smF1(-bh / 2) + ',' + smF1(bh / 2) + ' l' + smF1(-bh / 2) + ',' + smF1(-bh / 2) + ' Z" fill="' + col + '"></path>';
          else {
            const since = e.since || now, w = Math.max(6, Math.min(now - since, span) * k1);
            const fill = k === 'work' ? 'url(#' + P + 'work)' : k === 'idle' ? v.line : col;
            o += '<rect x="' + smF1(X1 - w) + '" y="' + smF1(by) + '" width="' + smF1(w) + '" height="' + smF1(bh) + '" fill="' + fill + '"' + (k === 'need' ? ' class="pulse"' : '') +
              ' data-tl="' + since + '" data-x1="' + X1 + '" data-k="' + k1 + '"></rect>';
          }
          o += '</g>';
        });
        return o;
      }

      // DEPARTURES: a split flap board, most urgent first. The rows flip when the board changes
      function vBoard(c) {
        const { t, v, list, fid, H } = c;
        let o = vHead(c, 'Departures', 'most urgent first · the board flips when something changes');
        if (!list.length) return o + vEmpty(c, H / 2);
        const order = list.map((e, i) => ({ e, i, k: smKind(e) })).sort((a, b) => smRank(a.e, a.k) - smRank(b.e, b.k) || (b.k === 'work') - (a.k === 'work') || (a.e.since || 0) - (b.e.since || 0));
        const top = 104, rh = Math.min(58, (H - top - 16) / order.length), cols = [[30, 'NO.'], [118, 'CHAT'], [690, 'STATUS'], [1066, 'WAITING']];
        cols.forEach(([x, l], j) => { o += smTxt(x, top - 14, l, 13, v.mute, t.f.mf, (j === 3 ? ' text-anchor="end"' : '') + ' letter-spacing="2"'); });
        const tile = t.lite ? v.bg2 : 'rgba(0,0,0,.32)';
        order.forEach((it, m) => {
          const e = it.e, k = it.k, col = smCol(t, k), y = top + m * rh, rt = vRight(e, k), cy = y + (rh - 6) / 2;
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><rect x="18" y="' + smF1(y) + '" width="1062" height="' + smF1(rh - 6) + '" fill="' + tile + '" stroke="' + (e.id === fid ? v.ink : v.line) + '" stroke-width="' + (e.id === fid ? 2.5 : 1) + '"></rect>' +
            '<line x1="18" y1="' + smF1(cy) + '" x2="1080" y2="' + smF1(cy) + '" stroke="' + v.bg + '" stroke-width="1.5" stroke-opacity=".7"></line>' +
            '<g class="vflap" style="animation-delay:' + (m * 70) + 'ms">' + smTxt(30, cy, vShort(e, it.i), Math.round(Math.min(24, rh * 0.42)), v.ink, t.f.hf, ' font-weight="700"') +
            vFit(118, cy, vTitle(e).toUpperCase(), 550, Math.round(Math.min(21, rh * 0.38)), v.ink, t.f.mf, ' font-weight="700" letter-spacing="1"') +
            vFit(690, cy, smStatus(e, k).toUpperCase(), 250, Math.round(Math.min(17, rh * 0.32)), col, t.f.mf, ' font-weight="700" letter-spacing="1"') +
            '<text x="1066" y="' + smF1(cy) + '" font-size="' + Math.round(Math.min(19, rh * 0.34)) + '" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + rt.attr + '>' + smEsc(rt.txt) + '</text></g></g>';
        });
        return o;
      }

      // HONEYCOMB: the hub in the middle cell, chats spiralling out around it
      function vHive(c) {
        const { t, v, list, fid, H } = c, n = list.length;
        let K = 1; while (1 + 3 * K * (K + 1) < n + 1) K++;
        const r = Math.min(112, (1100 - 60) / (Math.sqrt(3) * (2 * K + 1)), (H - 30) / (3 * K + 2)), cx = 550, cy = H / 2;
        const hex = (x, y, rr) => 'M' + [0, 1, 2, 3, 4, 5].map((j) => { const a = (60 * j - 30) * Math.PI / 180; return smF1(x + rr * Math.cos(a)) + ',' + smF1(y + rr * Math.sin(a)); }).join(' L') + ' Z';
        const DIR = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]], cells = [];
        for (let k = 1; k <= K && cells.length < n; k++) {
          let q = DIR[4][0] * k, s = DIR[4][1] * k;
          for (let d = 0; d < 6; d++) for (let st = 0; st < k; st++) { cells.push([q, s]); q += DIR[d][0]; s += DIR[d][1]; }
        }
        let o = '<circle cx="' + cx + '" cy="' + smF1(cy) + '" r="' + smF1(r * 3.2) + '" fill="url(#' + c.P + 'g)"></circle>' +
          '<path d="' + hex(cx, cy, r - 3) + '" fill="' + v.bg2 + '" stroke="' + v.line + '" stroke-width="2"></path><g transform="translate(' + cx + ',' + smF1(cy) + ') scale(' + smF1(r * 0.62 / 74) + ')">' + vHub(c) + '</g>';
        list.forEach((e, i) => {
          const [q, s] = cells[i], x = cx + r * Math.sqrt(3) * (q + s / 2), y = cy + r * 1.5 * s, k = smKind(e), col = smCol(t, k), rt = vRight(e, k);
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><path d="' + hex(x, y, r - 3) + '" fill="' + col + '" fill-opacity="' + vFillOp(k) + '" stroke="' + (e.id === fid ? v.ink : col) + '" stroke-width="' + (e.id === fid ? 3.5 : 2) + '"' + (k === 'need' ? ' class="pulse"' : '') + '></path>' +
            smTxt(x, y - r * 0.34, vShort(e, i), Math.round(r * 0.3), v.ink, t.f.hf, ' text-anchor="middle" font-weight="700"') +
            vFit(x, y + r * 0.04, vTitle(e), r * 1.42, Math.round(Math.max(11, r * 0.15)), v.ink, t.f.bf, ' text-anchor="middle"') +
            '<text x="' + smF1(x) + '" y="' + smF1(y + r * 0.36) + '" font-size="' + Math.round(Math.max(10, r * 0.12)) + '" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="middle"' + rt.attr + '>' + smEsc(rt.txt || smStatus(e, k)) + '</text></g>';
        });
        return o;
      }

      // TREEMAP: each chat gets ground in proportion to how much it needs you
      function vSquarify(items, x, y, w, h) {
        const out = [], total = items.reduce((s, a) => s + a.v, 0) || 1, sc = w * h / total;
        let rest = items.map((a) => Object.assign({}, a, { a: a.v * sc })), row = [];
        const worst = (rw, side) => { const s = rw.reduce((tt, a) => tt + a.a, 0), mx = Math.max(...rw.map((a) => a.a)), mn = Math.min(...rw.map((a) => a.a)); return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)); };
        const lay = (rw) => {
          const s = rw.reduce((tt, a) => tt + a.a, 0);
          if (w >= h) { const cw = s / h; let yy = y; rw.forEach((a) => { out.push(Object.assign(a, { x, y: yy, w: cw, h: a.a / cw })); yy += a.a / cw; }); x += cw; w -= cw; }
          else { const chh = s / w; let xx = x; rw.forEach((a) => { out.push(Object.assign(a, { x: xx, y, w: a.a / chh, h: chh })); xx += a.a / chh; }); y += chh; h -= chh; }
        };
        while (rest.length) {
          const side = Math.min(w, h), cnd = rest[0];
          if (!row.length || worst(row.concat([cnd]), side) <= worst(row, side)) { row.push(cnd); rest = rest.slice(1); } else { lay(row); row = []; }
        }
        if (row.length) lay(row);
        return out;
      }
      function vTreemap(c) {
        const { t, v, list, fid, H } = c;
        let o = vHead(c, 'Treemap', 'more ground, more it needs you');
        if (!list.length) return o + vEmpty(c, H / 2);
        const items = list.map((e, i) => ({ e, i, k: smKind(e), v: SM_WT[smKind(e)] || 1 })).sort((a, b) => b.v - a.v);
        vSquarify(items, 20, 88, 1060, H - 104).forEach((it) => {
          const e = it.e, k = it.k, col = smCol(t, k), rt = vRight(e, k), big = it.w > 150 && it.h > 90;
          o += '<g class="hit" data-jump="' + smEsc(e.id) + '"><rect x="' + smF1(it.x + 3) + '" y="' + smF1(it.y + 3) + '" width="' + smF1(Math.max(1, it.w - 6)) + '" height="' + smF1(Math.max(1, it.h - 6)) + '" fill="' + col + '" fill-opacity="' + vFillOp(k) + '" stroke="' + (e.id === fid ? v.ink : col) + '" stroke-width="' + (e.id === fid ? 3 : 1.5) + '"' + (k === 'need' ? ' class="pulse"' : '') + '></rect>' +
            smTxt(it.x + 16, it.y + 26, vShort(e, it.i), Math.round(Math.min(30, Math.max(14, it.h * 0.2))), v.ink, t.f.hf, ' font-weight="700"') +
            (it.h > 60 ? vFit(it.x + 16, it.y + Math.min(it.h - 22, 26 + Math.min(34, it.h * 0.28)), vTitle(e), it.w - 32, Math.round(Math.min(19, Math.max(12, it.w * 0.07))), v.ink, t.f.bf, ' font-weight="600"') : '') +
            (big ? '<text x="' + smF1(it.x + 16) + '" y="' + smF1(it.y + it.h - 20) + '" font-size="14" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central"' + rt.attr + '>' + smEsc(rt.txt || smStatus(e, k)) + '</text>' : '') + '</g>';
        });
        return o;
      }
      const SM_VIEW_FN = { radar: vRadar, puzzle: vPuzzle, seismo: vSeismo, mixer: vMixer, orbit: vOrbit, lanes: vLanes, timeline: vTimeline, board: vBoard, hive: vHive, treemap: vTreemap };
      function setView(id) {
        if (!SM_VIEWS.some((x) => x[0] === id) || id === viewId) return;
        viewId = id; stageSig = '';
        if (model) paint(model);
      }

      // ---------- the stage: pie wedges, load rails, leader lines ----------
      function stage(tabs, floorId, ex) {
        ex = ex || {};
        const t = theme, v = t.v, P = 'sm' + t.id;
        const vbH = Math.max(600, H - 400);   // 8.0: the control panel takes the bottom 230 (9.1: and the pill rail 52 up top)
        const cx = 430, cy = Math.round(vbH / 2), R = 275;
        const list = tabs.slice(0, 12);
        let o = '<svg viewBox="0 0 1100 ' + vbH + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>' +
          '<radialGradient id="' + P + 'g"><stop offset="0" stop-color="' + v.glow + '"></stop><stop offset=".65" stop-color="' + v.glow + '" stop-opacity="0"></stop></radialGradient>';
        for (const k of ['need', 'wait', 'work']) {
          o += '<pattern id="' + P + k + '" width="13" height="16" patternUnits="userSpaceOnUse"><rect width="10" height="16" fill="' + v[k] + '"></rect>' +
            (k === 'work' ? '<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="13 0" dur=".9s" repeatCount="indefinite"></animateTransform>' : '') + '</pattern>';
        }
        o += '</defs>';
        if (viewId !== 'pie' && SM_VIEW_FN[viewId]) {   // 9.1: another view draws the same list
          const waiting0 = list.filter((e) => !vSide(e) && e.id !== floorId && smWaits(smKind(e))).length;
          return o + SM_VIEW_FN[viewId]({ t, v, P, list, fid: floorId, ex, H: vbH, waiting: waiting0 }) + '</svg>';
        }
        o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Math.round(R * 1.5) + '" fill="url(#' + P + 'g)"></circle>';

        // leader lines and rails
        const n = list.length, x0 = 790, W = 300;
        const sp = n ? Math.min(155, (vbH - 40) / n) : 155, hb = Math.min(92, sp - 10);
        const y0 = Math.max(20, cy - (sp * (n - 1) + hb) / 2);
        let lines = '', rails = '';
        list.forEach((e, i) => {
          const k = smKind(e), col = smCol(t, k), hot = SM_SAT[k] > 0.6, y = y0 + i * sp;
          const ay = y + (hb >= 84 ? 40 : Math.min(hb - 8, 32)), el = x0 - 26;
          const dx = el - cx, dy = ay - cy, d = Math.hypot(dx, dy) || 1, ex = cx + dx / d * (R + 22), ey = cy + dy / d * (R + 22);
          lines += '<polyline points="' + x0 + ',' + smF1(ay) + ' ' + el + ',' + smF1(ay) + ' ' + smF1(ex) + ',' + smF1(ey) + '" fill="none" stroke="' + (hot ? col : v.line) + '" stroke-width="' + (hot ? 2.5 : 1.5) + '" stroke-opacity="' + (hot ? 0.9 : 0.8) + '"></polyline>' +
            '<circle cx="' + smF1(ex) + '" cy="' + smF1(ey) + '" r="5" fill="' + col + '"></circle>';
          const name = e.deck ? 'SD SWIPE DECK' : e.chief ? 'COS CHIEF OF STAFF' : e.outbox ? (e.lane === 'am' ? 'AMO ANDRÉ MANDEL OUTBOX' : 'OUT CHxTLD OUTBOX') : smPad(i + 1) + ' ' + smTrunc(e.title || e.name || 'Claude', 40);
          const barY = ay - 8, fill = k === 'work' ? 'url(#' + P + 'work)' : k === 'idle' ? 'none' : 'url(#' + P + (SM_COLKEY[k]) + ')';
          const w0 = e.deck ? Math.round(W * Math.min(1, (e.deckN || 0) / 12)) : e.chief ? Math.round(W * Math.min(1, (e.chiefN || 0) / 8)) : e.outbox ? Math.round(W * Math.min(1, (e.oxN || 0) / 6)) : k === 'need' ? W : k === 'work' ? W : k === 'idle' ? 0 : Math.round(W * Math.min(1, Math.max(0.06, (Date.now() - (e.since || Date.now())) / 600000)));
          rails += '<g class="hit" data-jump="' + smEsc(e.id) + '"><rect class="hitbg" x="' + (x0 - 12) + '" y="' + smF1(y - 10) + '" width="' + (W + 24) + '" height="' + smF1(hb + 20) + '" fill="' + v.ink + '" fill-opacity="0"></rect>';
          if (e.id === floorId) rails += '<rect x="' + (x0 - 12) + '" y="' + smF1(y - 10) + '" width="' + (W + 24) + '" height="' + smF1(hb + 20) + '" fill="none" stroke="' + v.ink + '" stroke-width="2"></rect>';
          rails += '<text class="rn" data-i="' + i + '" data-full="' + smEsc(name.toUpperCase()) + '" x="' + x0 + '" y="' + smF1(barY - 18) + '" font-size="' + (t.f.rs || 21) + '" font-weight="' + (t.f.rf ? 600 : 700) + '" fill="' + (k === 'idle' ? v.mute : v.ink) + '" font-family=\'' + (t.f.rf || t.f.hf) + '\' dominant-baseline="central" letter-spacing="' + (t.f.rl || 0.4) + '">' + smEsc(name.toUpperCase()) + '</text>';
          const timed = !e.deck && !e.chief && !e.outbox && (smWaits(k) || k === 'turn');
          const right = e.deck ? (e.deckN || 0) + ' OPEN' : e.chief ? (e.closed ? 'OPEN IT' : e.chiefN ? e.chiefN + ' NEED YOU' : 'CLEAR') : e.outbox ? (e.closed ? 'OPEN IT' : e.oxN ? e.oxN + ' READY' : 'CLEAR') : timed ? smClock(Date.now() - (e.since || Date.now())) : k === 'work' ? 'LIVE' : '';
          rails += '<text class="rr" data-i="' + i + '" x="' + (x0 + W) + '" y="' + smF1(barY - 18) + '" font-size="18" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + (timed ? ' data-since="' + (e.since || 0) + '"' : '') + '>' + right + '</text>';
          rails += '<rect x="' + x0 + '" y="' + smF1(barY) + '" width="' + W + '" height="16" fill="' + v.line + '"></rect>';
          if (w0) rails += '<rect x="' + x0 + '" y="' + smF1(barY) + '" width="' + w0 + '" height="16" fill="' + fill + '"' + (k === 'need' ? ' class="pulse"' : '') + (!e.deck && !e.chief && !e.outbox && (k === 'question' || k === 'wait' || k === 'turn') ? ' data-grow="' + (e.since || 0) + '"' : '') + '></rect>';
          if (hb >= 84) rails += smTxt(x0, barY + 40, smStatus(e, k) + (e.id === floorId ? ' · floor' : ''), 18, col, t.f.mf, '');
          rails += '</g>';
        });

        // the pie: a wedge per chat, wider and longer the more it needs you
        let pie = smTicks(t, R + 16, 72, 7, 6);
        const tot = list.reduce((s, e) => s + SM_WT[smKind(e)], 0);
        if (!list.length) pie += '<circle r="' + R + '" fill="none" stroke="' + v.line + '" stroke-width="2" stroke-dasharray="6 10"></circle>';
        let a = 0;
        for (let i = 0; i < list.length; i++) {
          const e = list[i], k = smKind(e), span = SM_WT[k] / tot * 360, r = R * (0.36 + 0.64 * SM_SAT[k]), col = smCol(t, k);
          const gap = list.length > 1 ? 1.2 : 0;
          pie += '<path class="hit" data-jump="' + smEsc(e.id) + '" d="' + smSector(Math.round(R * 0.3), Math.round(r), a + gap, a + span - gap) + '" fill="' + col + '" fill-opacity="' + smF1(0.18 + 0.72 * SM_SAT[k]) + '" stroke="' + col + '" stroke-width="2"' + (k === 'need' ? ' class="pulse"' : '') + '></path>';
          const lp = smPol(R * 0.3 + (r - R * 0.3) * 0.55, a + span / 2);
          if (span > 9) pie += smTxt(lp[0], lp[1], e.deck ? 'SD' : e.chief ? 'COS' : e.outbox ? (e.lane === 'am' ? 'AMO' : 'OUT') : smPad(i + 1), e.chief || e.outbox ? 22 : 26, SM_SAT[k] > 0.8 && t.onSat ? t.onSat : v.ink, t.f.mf, ' text-anchor="middle" pointer-events="none"');
          a += span;
        }
        const waiting = list.filter((e) => !e.deck && !e.chief && !e.outbox && e.id !== floorId && smWaits(smKind(e))).length;
        // 8.1: the center is a button. Click to pause everything (or play again), hold it down for meeting mode
        const rc = R * 0.27;
        pie += '<g class="hit ctr" data-center="1"><title>' + (ex.held ? 'Play: everything comes back' : 'Pause everything. Hold down for meeting mode') + '</title>' +
          '<circle class="cb" r="' + smF1(rc) + '" fill="' + (ex.held ? v.need : v.bg2) + '" stroke="' + (ex.held ? v.need : v.line) + '" stroke-width="' + (ex.held ? 4 : 2) + '"></circle>';
        if (ex.held) {
          pie += '<path d="M-14,-34 L22,-14 L-14,6 Z" fill="' + v.bg + '"></path>' +
            smTxt(0, 30, ex.meeting ? 'MEETING' : 'PAUSED', 16, v.bg, t.f.mf, ' text-anchor="middle" letter-spacing="3" font-weight="700"');
        } else {
          pie += '<rect x="-13" y="-46" width="9" height="24" fill="' + v.ink + '"></rect><rect x="4" y="-46" width="9" height="24" fill="' + v.ink + '"></rect>' +
            smTxt(0, 2, smPad(waiting), 42, waiting ? v.need : v.mute, t.f.hf, ' text-anchor="middle" font-weight="700"') +
            smTxt(0, 38, 'NEED YOU', 14, v.mute, t.f.mf, ' text-anchor="middle" letter-spacing="3"');
        }
        pie += '</g>';
        o += lines + '<g transform="translate(' + cx + ',' + cy + ')">' + pie + '</g>' + rails + '</svg>';
        return (/\bfx-radar\b/.test(t.cls || '') ? '<div class="rdr"></div>' : '') + o;   // 9.0.1: the sonar sweep sits behind the pie
      }

      function paint(m) {
        model = m;
        const t = theme, tabs = m.tabs || [], fid = m.floorId || '', p = m.floor;
        const fe = tabs.find((e) => e.id === fid) || null;
        const fno = fe ? tabs.indexOf(fe) + 1 : 0;
        // transcript header
        if (p) {
          const k = fe ? smKind(fe) : smKind(Object.assign({ on: true, seen: true }, p));
          const src = fe || p;
          q('.fl').textContent = 'Floor · ' + (fno ? smPad(fno) : 'here');
          q('.ttl').textContent = p.title || 'Claude';
          const st = k === 'need' ? (src.folder ? 'Needs your ' + src.folder + ' folder' : src.reqKey ? 'Needs approval' : 'Urgent') :
            k === 'question' ? 'Question for you' : k === 'wait' || k === 'turn' ? 'Your turn' : k === 'work' ? 'Claude is working' : 'Idle';
          q('.sts').textContent = st;
          q('.sts').style.setProperty('--sc', k === 'idle' ? t.v.mute : smCol(t, k));
          const d = q('.draft');
          if (p.draft) {
            d.hidden = false;
            const dx = document.createElement('span');
            dx.textContent = String(p.draft).slice(-260);
            const c = document.createElement('span'); c.className = 'caret'; dx.appendChild(c);
            q('.dt').replaceChildren(dx);
          } else d.hidden = true;
        } else {
          q('.fl').textContent = 'Screen mode';
          q('.ttl').textContent = 'Screen mode';
          q('.sts').textContent = 'Waiting for the chat you\'re talking to';
          q('.sts').style.removeProperty('--sc');
          q('.draft').hidden = true;
        }
        // the bar
        q('.dots').innerHTML = tabs.map((e) => { const k = smKind(e); return '<i style="background:' + smCol(t, k) + ';opacity:' + smF1(0.35 + 0.65 * SM_SAT[k]) + '"></i>'; }).join('');
        const nxt = smNext(tabs, fid);
        const nx = q('.nx');
        if (nxt) { nx.className = 'nx'; nx.style.color = smCol(t, nxt.k); nx.textContent = 'NEXT › ' + smPad(nxt.i + 1) + ' ' + String(nxt.e.title || nxt.e.name || 'Claude').toUpperCase() + ' · ' + smAction(nxt.e, nxt.k); }
        else { nx.className = 'nx clear'; nx.style.color = ''; nx.textContent = 'ALL CLEAR'; }
        const qt = m.quiet || {}, now = Date.now();
        const turns = (qt.turns > 0 || qt.turnsDone) && now < (qt.turnsUntil || 0);
        const pz = q('.pz');
        pz.textContent = turns ? 'PAUSED' + (qt.turns > 0 ? ' ' + qt.turns : '') : qt.quiet ? 'QUIET' : now < (qt.until || 0) ? 'SNOOZED ' + Math.ceil((qt.until - now) / 60000) + 'M' : 'LIVE';
        pz.className = 'pz' + (turns || qt.quiet || now < (qt.until || 0) ? ' on' : '');
        // 8.0: the control panel
        const ct = m.ctl, cp = q('.ctl');
        cp.hidden = !ct;
        if (ct) {
          if (ct.held) { pz.textContent = 'ON HOLD'; pz.className = 'pz held'; }
          cp.classList.toggle('held', !!ct.held);
          const hb = q('.hold');
          hb.classList.toggle('on', !!ct.held);
          hb.setAttribute('aria-pressed', ct.held ? 'true' : 'false');
          hb.title = ct.held ? 'Resume: replies, Switcheroo and the mic come back in every tab' : 'Hold: nothing reads, talks, chimes or opens the mic, in any tab, until you resume';
          q('.hold .hk').textContent = ct.held ? 'Responses · on hold' : 'Responses · live';
          q('.hold .hv').textContent = ct.held ? 'Resume' : 'Hold';
          q('.hold .hs').textContent = ct.held ? 'Click, or say resume' : 'Stops every tab until you resume';
          q('.tgw .ck').textContent = ct.held ? 'On hold till you resume' : 'Controls · every tab';
          fx.querySelectorAll('.tg[data-ctl]').forEach((b) => {   // 8.9.3: not the Look tile
            const k2 = b.getAttribute('data-ctl');
            const on = k2 === 'others' ? ct.others !== 'off' : !!ct[k2];
            b.classList.toggle('on', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            // 8.4: Other tabs reads PAUSE, TURN DOWN or OFF, and how many video tabs are connected
            b.querySelector('.tv').textContent = k2 === 'others' ? ({ pause: 'PAUSE', lower: 'TURN DOWN', off: 'OFF' }[ct.others] || 'PAUSE') : (on ? 'ON' : 'OFF');
            if (k2 === 'others') b.querySelector('.tl').textContent = 'Other tabs' + (ct.others === 'off' ? '' : ct.vidTabs ? ' · ' + ct.vidTabs + (ct.vidTabs === 1 ? ' video' : ' videos') : ' · none heard');
            if (k2 === 'others') b.title = (b.title.split(' · ')[0]) + ' · ' + (ct.vidTabs ? ct.vidTabs + ' video ' + (ct.vidTabs === 1 ? 'tab' : 'tabs') + ' connected' : 'No video tabs connected. Say video check');
          });
        }
        // the stage, redrawn only when something on it changed so the animations keep running
        const ex = { held: !!(ct && ct.held), meeting: !!(ct && ct.held && ct.meeting) };
        const sig = t.id + H + '|' + fid + '|' + ex.held + ex.meeting + '|' + tabs.map((e) => [e.id, e.title, e.state, e.seen, e.ask, e.on, e.reqKey, e.folder, e.since, e.deckN, e.nVisual, e.chiefN, e.nRun, e.closed, e.oxN, e.nHold].join('~')).join('|') + '|' + viewId;   // 9.2: the view too
        if (sig !== stageSig) { stageSig = sig; q('.stage').innerHTML = stage(tabs, fid, ex); fitNames(); }
        renderAsks(m);   // 8.1
        renderDeck(m);   // 8.1
        renderCos(m);    // 9.0
        renderOx(m);     // 9.1
        renderRail(m);   // 9.1
        renderPick(m);
        renderLinks(m);  // 8.2
      }

      // ---------- 8.2: links caught from every chat, kept apart by practice ----------
      const BIZ_LABEL = { 'CHxTLD': 'CHxTLD', 'ANDRE MANDEL': 'ANDRÉ MANDEL', '': 'Unsorted' };
      const hostOf = (u) => { try { const x = new URL(u); return /claude\.ai$/.test(x.hostname) && /\/artifact\//.test(x.pathname) ? 'claude.ai page' : x.hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
      function renderLinks(m) {
        const L = (m && m.links) || [];
        const total = L.reduce((t, c) => t + c.links.length, 0);
        const pill = q('.bar .lk');
        pill.textContent = 'LINKS' + (total ? ' ' + total : '');
        pill.className = 'lk' + (total ? '' : ' zero') + (lnkOpen ? ' on' : '');
        const box = q('.lnk');
        if (!lnkOpen) { if (!box.hidden) { box.hidden = true; box.replaceChildren(); } lnkSig = ''; return; }
        const fl = L.find((c) => c.id === m.floorId);
        if (lnkBiz === '' && fl && fl.biz && !lnkSig) lnkBiz = fl.biz;
        const sig = JSON.stringify([lnkBiz, m.floorId, L.map((c) => [c.id, c.biz, c.title, c.links.map((x) => x.url)])]);
        if (sig === lnkSig) return;
        lnkSig = sig;
        const count = (b) => L.filter((c) => (c.biz || '') === b).reduce((t, c) => t + c.links.length, 0);
        const chats = L.filter((c) => (c.biz || '') === lnkBiz && c.links.length).sort((a, b) => (b.id === m.floorId) - (a.id === m.floorId) || (b.at || 0) - (a.at || 0));
        const nextBiz = (b) => (b === 'CHxTLD' ? 'ANDRE MANDEL' : b === 'ANDRE MANDEL' ? '' : 'CHxTLD');
        box.innerHTML = '<div class="lh"><span class="lt">Links</span>' +
          ['CHxTLD', 'ANDRE MANDEL', ''].map((b) => '<button type="button" class="lb' + (lnkBiz === b ? ' on' : '') + '" data-lnk="tab" data-biz="' + b + '">' + smEsc(BIZ_LABEL[b]) + ' ' + count(b) + '</button>').join('') +
          '<span class="lg"></span><button type="button" class="lb lx" data-lnk="close" title="Close">×</button></div><div class="ll">' +
          (chats.length ? chats.map((c) => '<div class="lc"><b>' + smEsc(String(c.name || c.title || 'Claude').toUpperCase()) + '</b>' + (c.id === m.floorId ? '<span>· floor · say open, or open two</span>' : '') +
            '<button type="button" data-lnk="biz" data-path="' + smEsc(c.path) + '" data-biz="' + nextBiz(c.biz || '') + '" title="Move this chat to ' + smEsc(BIZ_LABEL[nextBiz(c.biz || '')]) + '">' + smEsc(BIZ_LABEL[c.biz || '']) + ' ›</button></div>' +
            c.links.map((x) => '<button type="button" class="li" data-lnk="open" data-url="' + smEsc(x.url) + '" data-label="' + smEsc(x.label) + '" data-n="' + x.n + '" title="' + smEsc(x.url) + '"><span class="n">' + x.n + '</span><span class="lbl">' + smEsc(x.label) + '</span><span class="hs">' + smEsc(hostOf(x.url)) + '</span></button>').join('')).join('')
            : '<div class="le">No ' + smEsc(BIZ_LABEL[lnkBiz]) + ' links yet</div>') + '</div>';
        box.hidden = false;
      }
      // ---------- 8.2: the page viewer. Transcript stays left; the page takes the right ----------
      function showPage(pg) {
        const v = q('.pgv');
        if (!pg) { v.hidden = true; v.replaceChildren(); return; }
        v.hidden = false;
        v.innerHTML = '<div class="ph"><span class="pn">' + (pg.n ? pg.n : '·') + '</span><span class="pl">' + smEsc(pg.label || hostOf(pg.url)) + '</span><span class="pu">' + smEsc(pg.url) + '</span>' +
          '<button type="button" class="pb" data-pg="window" title="Open in its own window, docked right">Window</button><button type="button" class="pb" data-pg="close" title="Close the page (say close page)">Close</button></div><div class="pf"></div>';
        const f = q('.pgv .pf');
        if (pg.mode === 'frame') {
          const fr = document.createElement('iframe');
          fr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads');
          fr.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          fr.src = pg.url;
          f.appendChild(fr);
        } else {
          f.innerHTML = '<div class="pw"><b>' + (pg.mode === 'checking' ? 'Opening' : pg.mode === 'blocked' ? 'Pop-ups blocked' : 'In its own window') + '</b><span>' +
            (pg.mode === 'checking' ? 'Checking whether this page can show here.' : pg.mode === 'blocked' ? 'This site won&#39;t show inside screen mode, and Chrome blocked its window. Allow pop-ups for claude.ai once (the icon at the end of the address bar), then say open again, or click Window.' : 'This site won&#39;t show inside screen mode, so it opened in a window docked to the right. Say close page to close it.') + '</span></div>';
        }
      }

      // ---------- 8.1: approvals and question cards, answered with a click ----------
      function renderAsks(m) {
        if (!m) return;
        const box = q('.asks'), tabs = (m.tabs || []).filter((e) => !e.deck && !e.chief && !e.outbox);
        const reqs = tabs.map((e, i) => ({ e, i })).filter((x) => x.e.on !== false && x.e.state === 'red' && (x.e.reqKey || x.e.folder))
          .sort((a, b) => (b.e.id === m.floorId) - (a.e.id === m.floorId) || (a.e.since || 0) - (b.e.since || 0));
        const ask = !reqs.length && m.floor && m.floor.ask && m.floor.ask.opts && m.floor.ask.opts.length ? m.floor.ask : null;
        let html = '', sig = '';
        if (reqs.length) {
          const r = reqs[0], e = r.e, more = reqs.length - 1, tag = e.id + '|' + (e.reqKey || e.folder), armed = armAlways === tag;
          sig = 'r|' + tag + '|' + more + '|' + armed + '|' + (e.request || '');
          const where = e.folder === 'a' ? 'a folder' : 'your ' + e.folder + ' folder';
          const comp = Array.isArray(e.comp);
          const apps = comp ? (e.comp.length ? e.comp.join(', ') : 'your computer') : '';
          html = '<div class="ak">' + smPad(r.i + 1) + ' ' + smEsc(String(e.name || e.title || 'Claude').toUpperCase()) + ' · ' + (comp ? 'WANTS YOUR COMPUTER' : e.folder ? 'NEEDS A FOLDER' : 'NEEDS APPROVAL') + (more ? ' · +' + more + ' MORE WAITING' : '') + '</div>' +
            '<div class="arow"><div class="atx">' + smEsc(comp ? (e.name || 'Claude') + ' wants control of ' + apps + '.' : e.folder ? (e.name || 'Claude') + ' wants to use ' + where + ' on your computer.' : (e.request || 'Claude is asking for permission.')) + (comp ? '<br><small>By voice: squeeze, then say allow and the app name.</small>' : '') + '</div>' +
            '<div class="abt"><button type="button" class="ab once" data-appr="once" data-id="' + smEsc(e.id) + '">' + (comp ? 'Allow this session' : 'Allow once') + '</button>' +
            '<button type="button" class="ab always' + (armed ? ' armed' : '') + '" data-appr="always" data-id="' + smEsc(e.id) + '" title="Sticks for this tool. Takes a second click.">' + (armed ? 'Click again to confirm' : 'Always allow') + '</button>' +
            '<button type="button" class="ab deny" data-appr="deny" data-id="' + smEsc(e.id) + '">Deny</button></div></div>';
        } else if (ask) {
          if (multiKey !== ask.key) { multiKey = ask.key; multiSel = new Set(ask.opts.filter((o) => o.on).map((o) => o.n)); }
          const fe = tabs.find((e) => e.id === m.floorId), fno = fe ? tabs.indexOf(fe) + 1 : 0;
          sig = 'q|' + ask.key + '|' + [...multiSel].join(',');
          html = '<div class="ak">' + (fno ? smPad(fno) + ' ' : '') + smEsc(String((fe && (fe.name || fe.title)) || (m.floor && m.floor.title) || 'Claude').toUpperCase()) + ' · QUESTION' + (ask.multi ? ' · PICK ANY, THEN SUBMIT' : '') + '</div>' +
            '<div class="aq">' + smEsc(ask.q) + '</div><div class="aopts">' +
            ask.opts.map((o) => '<button type="button" class="ao' + (multiSel.has(o.n) ? ' on' : '') + (o.rec ? ' rec' : '') + '" data-pick="' + o.n + '" title="' + smEsc(o.desc || o.label) + '"><b>' + o.n + '</b><span>' + smEsc(o.label) + (o.rec ? ' <em>recommended</em>' : '') + '</span></button>').join('') +
            '</div>' + (ask.multi || ask.skip ? '<div class="aend">' + (ask.skip ? '<button type="button" class="ab deny" data-pick="skip">Skip</button>' : '') +
            (ask.multi ? '<button type="button" class="ab once" data-pick="submit">Submit' + (multiSel.size ? ' ' + multiSel.size : '') + '</button>' : '') + '</div>' : '');
        }
        if (sig === askSig) return;
        askSig = sig;
        fx.classList.toggle('asking', !!sig);
        if (!sig) { box.hidden = true; box.replaceChildren(); return; }
        box.innerHTML = html; box.hidden = false;
      }

      // ---------- 8.1: Swipe Deck over the pie ----------
      const BIZ_WORD = { 'CHxTLD': 'Clever Homes × TLD', 'ANDRE MANDEL': 'André Mandel' };
      function cardEl(c) {
        const el = document.createElement('div');
        el.className = 'dkc';
        el.setAttribute('data-id', c.id || '');
        if (BIZ_WORD[c.business]) el.setAttribute('data-biz', c.business);
        const pri = +c.priority || 0;
        let when = '';
        try { if (c.created_at) { const d = new Date(c.created_at); when = (d.getMonth() + 1) + '/' + d.getDate() + '/' + String(d.getFullYear()).slice(2); } } catch (e) {}
        el.innerHTML = '<div class="ch"><span class="cw">' + smEsc(BIZ_WORD[c.business] || 'No business tag') + '</span><span class="cp">' + smEsc(c.project || 'General') + '</span><span class="cg"></span>' +
          (pri ? '<span class="pr' + (pri === 1 ? ' p1' : '') + '">P' + pri + '</span>' : '') + '</div>' +
          '<div class="cq">' + smEsc(c.question || 'No question text') + '</div>' +
          (c.context ? '<div class="cx">' + smEsc(c.context) + '</div>' : '') +
          '<div class="cf">' + (c.source ? '<span><b>Look at</b> ' + smEsc(c.source) + '</span>' : '') + (c.agent ? '<span><b>Asked by</b> ' + smEsc(c.agent) + '</span>' : '') + (when ? '<span>' + when + '</span>' : '') + '</div>' +
          '<span class="stamp y">YES</span><span class="stamp n">NO</span><span class="stamp t">TBD</span>';
        return el;
      }
      function renderDeck(m) {
        const d = m && m.deck, ov = q('.dkov');
        const open = !!(d && d.open);
        if (open !== dkOpen) { dkOpen = open; fx.classList.toggle('decking', open); }
        if (!open) { if (!ov.hidden) { ov.hidden = true; ov.replaceChildren(); dkSig = ''; } return; }
        const st = d.st || {}, c = st.card || null;
        const waitReq = (m.tabs || []).filter((e) => !e.deck && !e.chief && !e.outbox && e.on !== false && e.state === 'red' && (e.reqKey || e.folder)).length;
        const sig = JSON.stringify([st.deck, st.remaining, st.nAudio, st.nVisual, st.canBack, d.on, d.alive, c && c.id, st.loaded, waitReq]);
        if (sig === dkSig) return;
        dkSig = sig;
        if (ov.hidden || !ov.firstChild) {
          ov.innerHTML = '<div class="dkh"></div><div class="dks"><div class="dkg g2"></div><div class="dkg g1"></div></div><div class="dkb"></div>';
          ov.hidden = false;
        }
        const vis = st.deck !== 'audio';
        q('.dkh').innerHTML = '<span class="dt">Swipe Deck</span>' +
          '<button type="button" class="dd' + (vis ? ' on' : '') + '" data-dk="deck" data-deck="visual">Visual ' + (st.nVisual || 0) + '</button>' +
          '<button type="button" class="dd' + (!vis ? ' on' : '') + '" data-dk="deck" data-deck="audio">Audio ' + (st.nAudio || 0) + '</button>' +
          '<span class="gr"></span>' + (waitReq ? '<button type="button" class="dd dw" data-dk="close" title="Close the deck to answer it">' + waitReq + (waitReq === 1 ? ' approval waits' : ' approvals wait') + '</button>' : '') + '<span class="dn">' + (!d.alive ? 'OPENING THE DECK' : !st.loaded ? 'LOADING' : c ? (st.remaining || 1) + ' TO GO' : 'CLEAR') + '</span>' +
          '<button type="button" class="dd dv' + (d.on ? ' on' : '') + '" data-dk="voice" title="Read the cards aloud and answer by voice">' + (d.on ? 'Voice on' : 'Voice off') + '</button>' +
          '<button type="button" class="dd dx" data-dk="close" title="Close the deck">×</button>';
        q('.dkb').innerHTML = '<button type="button" class="bn" data-dk="no"' + (c ? '' : ' disabled') + '><i>←</i>No</button>' +
          '<button type="button" data-dk="tbd"' + (c ? '' : ' disabled') + '><i>↑</i>TBD</button>' +
          '<button type="button" data-dk="back"' + (st.canBack ? '' : ' disabled') + '><i>↓</i>Back</button>' +
          '<button type="button" class="by" data-dk="yes"' + (c ? '' : ' disabled') + '>Yes<i>→</i></button>';
        const stack = q('.dks');
        const prev = [...stack.querySelectorAll('.dkc:not(.out)')].pop() || null;
        const empty = stack.querySelector('.dke');
        const id = c ? c.id : '';
        if (prev && prev.getAttribute('data-id') === id) return;
        const how = d.last && Date.now() - d.last.at < 8000 ? d.last.cmd : '';
        if (prev) {
          prev.classList.add('out', 'go-' + ({ yes: 'yes', no: 'no', tbd: 'tbd', move: 'tbd' }[how] || 'fade'));
          setTimeout(() => prev.remove(), 560);
        }
        if (empty) empty.remove();
        if (c) {
          const el = cardEl(c);
          el.classList.add(how === 'back' ? 'in-drop' : 'in-rise');
          stack.appendChild(el);
        } else {
          const e = document.createElement('div');
          e.className = 'dke';
          e.textContent = !d.alive ? 'Opening Swipe Deck' : !st.loaded ? 'Loading cards' : (vis ? 'Visual' : 'Audio') + ' deck clear';
          stack.appendChild(e);
        }
      }

      // ---------- 9.0: Chief of Staff over the pie, in the board's own night drive look ----------
      const CHAT_RE = /^https:\/\/claude\.ai\/chat\/[0-9a-f-]{36}/;   // 9.1: a thread whose link is a chat opens that chat
      const CHIEF_BIZ = { 'CHxTLD': ['CHxTLD', 'chx'], 'ANDRE MANDEL': ['ANDRÉ MANDEL', 'am'], 'PERSONAL': ['PERSONAL', 'per'] };
      const cosDate = (d) => (d.getMonth() + 1) + '/' + d.getDate() + '/' + String(d.getFullYear()).slice(2);
      function cosDue(t) {
        if (!t.due) return '';
        const d = new Date(t.due + 'T12:00:00'), t0 = new Date();
        if (isNaN(d)) return '';
        t0.setHours(12, 0, 0, 0);
        const days = Math.round((d - t0) / 864e5);   // calendar days, so today reads today all day
        return 'Due ' + cosDate(d) + ', ' + (days < 0 ? 'overdue' : days === 0 ? 'today' : days + 'd');
      }
      function renderCos(m) {
        const c = m && m.cos, ov = q('.cos');
        const open = !!(c && c.open);
        if (open !== cosOpen) { cosOpen = open; fx.classList.toggle('cosing', open); }
        if (!open) { if (!ov.hidden) { ov.hidden = true; ov.replaceChildren(); cosSig = ''; } return; }
        const st = c.alive ? c.st : null;
        const waitReq = (m.tabs || []).filter((e) => !e.deck && !e.chief && !e.outbox && e.on !== false && e.state === 'red' && (e.reqKey || e.folder)).length;
        const now = new Date();
        const sig = JSON.stringify([st, c.alive, c.opening, waitReq, cosDate(now)]);
        if (sig === cosSig) return;
        cosSig = sig;
        const day = now.toLocaleDateString([], { weekday: 'long' }).toUpperCase() + '  ' + cosDate(now);
        const scene = '<div class="sc" aria-hidden="true"><div class="gl"><div class="sun"></div></div><div class="fl"></div></div>';
        let h = '<div class="chh"><div class="cmk">Chief <span>of</span> Staff</div><div class="cdt">' + smEsc(day) + '</div><span class="cg"></span>' +
          (waitReq ? '<button type="button" class="cbn wt" data-cos="close" title="Close Chief to answer it">' + waitReq + (waitReq === 1 ? ' approval waits' : ' approvals wait') + '</button>' : '') +
          '<button type="button" class="cbn" data-cos="read" title="The chat you are talking to reads the brief aloud"' + (st ? '' : ' disabled') + '>Read it</button>' +
          '<button type="button" class="cbn" data-cos="board" title="Bring the Chief of Staff tab forward">Open board</button>' +
          '<button type="button" class="cbn cx" data-cos="close" title="Close">×</button></div>';
        if (!st || !st.loaded) {
          h += '<div class="cbr wait">' + scene + '<div class="ce">Chief of Staff</div><div class="chd">' +
            (c.opening ? 'Opening the board in a tab behind this one.' : st ? 'Loading the board.' : 'The board isn\'t open.') + '</div>' +
            '<div class="cwn">' + (c.opening || st ? 'It lands here in a few seconds.' : 'Click Open board, or say chief.') + '</div></div>';
          ov.innerHTML = h; ov.hidden = false; return;
        }
        const b = st.brief, k = st.counts || {};
        const items = b && Array.isArray(b.items) ? b.items.slice(0, 6) : [];
        let when = '';
        try { if (b && b.written_at) { const w = new Date(b.written_at); if (!isNaN(w)) when = 'Briefed ' + cosDate(w) + ' at ' + w.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } } catch (e) {}
        h += '<div class="cbody"><div class="cbr">' + scene + '<div class="ce">Morning brief</div>' +
          '<div class="chd">' + smEsc(b && b.headline ? b.headline : 'No brief yet today. The Chief writes one every morning.') + '</div>' +
          (items.length ? '<ul>' + items.map((x) => '<li><span>' + smEsc(x) + '</span></li>').join('') + '</ul>' : '') +
          '<div class="cct"><span class="n"><b>' + (k.needs || 0) + '</b>need you</span><span class="s"><b>' + (k.blocked || 0) + '</b>blocked</span><span class="r"><b>' + (k.running || 0) + '</b>running</span><span><b>' + (k.open || 0) + '</b>open</span></div>' +
          (when ? '<div class="cwn">' + smEsc(when) + '</div>' : '') + '</div><div class="ccol">';
        const rows = (st.start || []).slice(0, 8);
        h += '<div class="csh">Start here <small>' + (rows.length ? 'say done and the number to close one' : 'nothing is waiting on you') + '</small></div><div class="crs">';
        rows.forEach((t, i) => {
          const bz = CHIEF_BIZ[t.business] || ['', 'per'], due = cosDue(t), needs = t.status === 'needs';
          h += '<div class="cr' + (needs ? ' hot' : '') + '"><span class="ci">' + (i + 1) + '</span><div class="cbd"><div class="ctp">' +
            '<span class="cst ' + (needs ? 'needs' : 'blocked') + '">' + (needs ? 'Needs you' : 'Blocked') + '</span>' +
            (bz[0] ? '<span class="cbz ' + bz[1] + '">' + smEsc(bz[0]) + '</span>' : '') + (t.project ? '<span class="cpj">' + smEsc(t.project) + '</span>' : '') +
            '<span class="cg"></span>' + (due ? '<span class="cdu">' + smEsc(due) + '</span>' : '') + (t.stale ? '<span class="csl">Stale</span>' : '') + '</div>' +
            '<div class="ctt">' + smEsc(t.title || 'Untitled thread') + '</div>' + (t.next ? '<div class="cnx">' + smEsc(t.next) + '</div>' : '') + '</div>' +
            '<div class="cac"><button type="button" class="cbn sm hi" data-cos="chat" data-id="' + smEsc(t.id) + '" title="' + (CHAT_RE.test(t.link || '') ? 'Go to the chat working this thread' : 'Start a chat with this thread typed in, not sent') + '">' + (CHAT_RE.test(t.link || '') ? 'Open chat' : 'New chat') + '</button>' +
            (t.link && !CHAT_RE.test(t.link) ? '<button type="button" class="cbn sm" data-cos="link" data-id="' + smEsc(t.id) + '" title="' + smEsc(t.link) + '">Open link</button>' : '') +
            '<button type="button" class="cbn sm" data-cos="done" data-id="' + smEsc(t.id) + '" data-n="' + (i + 1) + '"' + (st.canWrite ? '' : ' disabled title="Read only here"') + '>Mark done</button></div></div>';
        });
        if (!rows.length) h += '<div class="cem">Nothing is waiting on you. Agents add threads here when they need a call from you.</div>';
        const more = (k.needs || 0) + (k.blocked || 0) - rows.length;
        h += '</div><div class="chn">' + (more > 0 ? '+' + more + ' more on the board · ' : '') + 'say chief · what needs me · done two · undo</div></div></div>';
        ov.innerHTML = h; ov.hidden = false;
      }

      // 9.3: the old look's ground fades away over the new one instead of cutting
      function lookFade(c) {
        try { if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
        const d = document.createElement('div');
        d.className = 'lkfade'; d.style.background = c;
        fx.appendChild(d);
        requestAnimationFrame(() => requestAnimationFrame(() => { d.style.opacity = '0'; }));
        setTimeout(() => d.remove(), 800);
      }
      // ---------- 9.1: the pill rail and the pickers ----------
      function renderRail(m) {
        const vw = SM_VIEWS.find((x) => x[0] === viewId) || SM_VIEWS[0];
        q('.vwp .pn b').textContent = vw[1];
        const lb = q('.lkp .pn b');
        lb.textContent = smPad(SM_LOOKS.indexOf(theme.id) + 1) + ' ' + (theme.look || theme.name || theme.id);
        if (m && m.looks && m.looks.clock) { const ck = document.createElement('span'); ck.className = 'ck'; ck.textContent = 'CLOCK'; lb.appendChild(ck); }   // 9.3
        const ce = ((m && m.apps) || []).find((e) => e.chief), n = ce && !ce.closed ? ce.chiefN || 0 : 0;
        const cp = q('.prl .chp');
        cp.querySelector('span').textContent = 'Chief' + (n ? ' · ' + n : '');
        cp.classList.toggle('hot', n > 0); cp.classList.toggle('on', cosOpen);
        q('.prl').querySelectorAll('[data-oxq]').forEach((b) => {   // 9.4
          const l = b.getAttribute('data-oxq'), oe = ((m && m.apps) || []).find((e) => e.outbox && (e.lane || 'ch') === l), k = oe && !oe.closed ? oe.oxN || 0 : 0;
          b.querySelector('span').textContent = (l === 'am' ? 'Mandel' : 'CHxTLD') + (k ? ' · ' + k : '');
          b.classList.toggle('hot', k > 0); b.classList.toggle('on', oxOpen && oxLaneP === l);
        });
        q('.vwp .pn').classList.toggle('on', pickOpen === 'view'); q('.lkp .pn').classList.toggle('on', pickOpen === 'look');
      }
      function togglePick(w) { pickOpen = pickOpen === w ? '' : w; pickSig = ''; if (model) { renderPick(model); renderRail(model); } }
      function renderPick(m) {
        const box = q('.pik');
        if (!pickOpen) { if (!box.hidden) { box.hidden = true; box.replaceChildren(); } pickSig = ''; return; }
        const L = (m && m.looks) || {}, favs = SM_LOOKS.filter((id) => (L.favs || []).includes(id)), step = L.step === 'fav' && favs.length ? 'fav' : 'all';
        const clock = !!L.clock;
        const sig = JSON.stringify([pickOpen, viewId, theme.id, theme.look, favs, step, clock]);
        if (sig === pickSig) return;
        pickSig = sig;
        let h = '';
        if (pickOpen === 'view') {
          h = '<div class="pkh"><span class="pkt">Views</span><span class="pks">How HQ draws your chats</span><span class="cg"></span><button type="button" class="pkb x" data-pik="close" title="Close">×</button></div><div class="pkl"><div class="vg">' +
            SM_VIEWS.map((x, i) => '<button type="button" class="vt' + (x[0] === viewId ? ' on' : '') + '" data-pv="' + x[0] + '"><svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + SM_VIEW_ICON[x[0]] + '</svg>' +
              '<span><b>' + smPad(i + 1) + ' ' + smEsc(x[1]) + '</b><small>' + smEsc(x[2]) + '</small></span></button>').join('') + '</div></div>';
        } else {
          const tile = (id) => {
            const th = SM_THEMES[id], v = th.v, n = SM_LOOKS.indexOf(id) + 1;
            return '<div class="lt' + (id === theme.id ? ' on' : '') + '" style="background:' + v.bg + ';color:' + v.ink + ';border-color:' + v.line + '">' +
              '<button type="button" class="lta" data-pl="' + id + '" title="' + smEsc(th.look || th.name) + '"><span class="lsw2">' + [v.accent, v.need, v.wait, v.work].map((c2) => '<i style="background:' + c2 + '"></i>').join('') + '</span>' +
              '<span class="ltn">' + smPad(n) + '</span><span class="ltl" style="font-family:' + smEsc(th.f.hf) + '">' + smEsc(th.look || th.name || id) + '</span>' + (th.clock ? '<span class="ltc">follows the clock</span>' : '') + '</button>' +
              '<button type="button" class="ltf' + (favs.includes(id) ? ' on' : '') + '" data-fav="' + id + '" title="' + (favs.includes(id) ? 'Take out of favorites' : 'Add to favorites') + '">★</button></div>';
          };
          h = '<div class="pkh"><span class="pkt">Looks</span><span class="pks">Arrows step through</span>' +
            '<button type="button" class="pkb' + (step === 'all' ? ' on' : '') + '" data-step="all">All ' + SM_LOOKS.length + '</button>' +
            '<button type="button" class="pkb' + (step === 'fav' ? ' on' : '') + '" data-step="fav"' + (favs.length ? '' : ' disabled') + '>Favorites ' + favs.length + '</button>' +
            '<button type="button" class="pkb clk' + (clock ? ' on' : '') + '" data-clock="' + (clock ? 'off' : 'on') + '" title="Picks from your favorites by the time of day: dark at night, bright at noon">Follow the clock ' + (clock ? 'on' : 'off') + '</button>' +
            '<span class="cg"></span><button type="button" class="pkb x" data-pik="close" title="Close">×</button></div><div class="pkl">' +
            (favs.length ? '<div class="pkc">Favorites</div><div class="pkg">' + favs.map(tile).join('') + '</div>' : '') +
            '<div class="pkc">All looks · dark to light · tap the star to keep one in favorites</div><div class="pkg">' + SM_LOOKS.map(tile).join('') + '</div></div>';
          SM_LOOKS.forEach((id) => smFontsFor(SM_THEMES[id]));   // each tile in its own type, fetched once
        }
        const sc = box.querySelector('.pkl'), keep = sc ? sc.scrollTop : 0;
        box.innerHTML = h; box.hidden = false;
        const sc2 = box.querySelector('.pkl'); if (sc2 && keep) sc2.scrollTop = keep;
      }
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pickOpen) togglePick(''); }, true);
      // ---------- 9.1: the CHxTLD Outbox over the pie, in the Outbox's own white mail look ----------
      // A list of drafts; a click opens one to edit. Edits save back to the Outbox tab a moment after you stop
      // typing, or on Save or Cmd S. A newer version saved elsewhere never lands on top of your typing: a bar
      // offers Load it or Keep mine. Nothing here sends mail; Copy for Gmail puts the body and signature on the clipboard.
      const oxPT = (iso) => {
        if (!iso) return '';
        try {
          const p = {};
          new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' }).formatToParts(new Date(iso)).forEach((x) => { p[x.type] = x.value; });
          return p.month + '/' + p.day + '/' + p.year + ' ' + p.hour + ':' + p.minute + ' ' + (p.dayPeriod || '');
        } catch (e) { return ''; }
      };
      const oxWho = (s) => String(s || '').split(',').map((x) => { x = x.trim(); const mm = x.match(/^"?([^"<]+?)"?\s*</); return mm ? mm[1].trim() : x; }).filter(Boolean).join(', ');
      const oxSame = (a, b) => !!a && !!b && a.subject === b.subject && a.body === b.body;
      const oxChip = (d, long) => d.status === 'sent' ? 'Sent ' + oxPT(d.sent_at) : d.status === 'hold' ? 'On hold' : long ? 'Ready, waiting on authorize send' : 'Ready';
      // 9.5.1: sent drafts leave the stack. The chat you're on comes first, then the newest edit
      const oxOrder = (ds, path) => (ds || []).filter((d) => d.status !== 'sent')
        .sort((a, b) => ((path && b.chat === path) - (path && a.chat === path)) || String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
      const oxCounts = (st) => { const k = (st && st.counts) || {}; return st && st.loaded ? (k.ready || 0) + ' ready · ' + (k.hold || 0) + ' on hold' + (k.sent ? ' · ' + k.sent + ' sent' : '') : ''; };
      const oxHead = () => '<div class="oxh">' + (oxLaneP === 'am' ? '<div class="oxbr"><span class="aml">' + SM_AM_LOGO + '</span>André Mandel<small>Outbox</small></div>' : '<div class="oxbr">ch <span>x</span> tld<small>Outbox</small></div>') + '<div class="oxct"></div><span class="g"></span><span class="oxwt"></span>' +
        '<button type="button" class="oxbn" data-ox="tab" title="Bring the Outbox tab forward">Open outbox</button><button type="button" class="oxbn cx" data-ox="close" title="Close">×</button></div>';
      function oxHeadFill(ov, st, waitReq) {
        const ct = ov.querySelector('.oxct'); if (ct) ct.textContent = oxCounts(st);
        const w = ov.querySelector('.oxwt'), k = String(waitReq);
        if (w && w.getAttribute('data-k') !== k) {
          w.setAttribute('data-k', k);
          w.innerHTML = waitReq ? '<button type="button" class="oxbn wt" data-ox="close" title="Close the Outbox to answer it">' + waitReq + (waitReq === 1 ? ' approval waits' : ' approvals wait') + '</button>' : '';
        }
      }
      // the signature, drawn from the Outbox's plain text copy, escaped line by line
      function oxSigHtml(t) {
        return String(t || '').split('\n').map((ln) => {
          const x = smEsc(ln);
          if (/^_{6,}$/.test(ln.trim())) return '<div class="o">' + x + '</div>';
          if (/^ch x tld$/i.test(ln.trim())) return '<div class="m">ch <i>x</i> tld</div>';
          if (/^andr[eé] mandel$/i.test(ln.trim())) return '<div class="m">' + x + '</div>';   // 9.4
          if (/cleverhomes by|\d{3}\.\d{3}\.\d{4}|\bave\b|\bst\b|residential design|northern california|@/i.test(ln)) return '<div class="d">' + x + '</div>';
          return '<div>' + x + '</div>';
        }).join('');
      }
      function oxSay(msg, err) {
        const e = oxEd; if (!e || !e.stEl) return;
        e.stEl.className = 'oxst' + (err ? ' err' : '');
        e.stEl.textContent = msg;
      }
      function oxGrow(t) {
        const b = t.closest('.oxb'), y = b ? b.scrollTop : 0;
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + 4) + 'px';
        if (b && b.scrollTop !== y) b.scrollTop = y;
      }
      const oxLocal = (e) => ({ subject: e.sub.value, body: e.body.value });
      function oxApply(e, v) {
        e.sub.value = v.subject; e.body.value = v.body;
        e.server = { subject: v.subject, body: v.body }; e.pending = null; e.newer.hidden = true; e.dirty = false;
        oxGrow(e.body);
      }
      function oxFill(e, d, st) {
        e.chip.className = 'oxc ' + d.status;
        e.chip.textContent = oxChip(d, true);
        e.th.textContent = d.thread ? 'Reply in ' + d.thread : 'New message';
        e.to.textContent = 'to ' + (d.to || '') + (d.cc ? '  ·  cc ' + d.cc : '');
        const sg = (st && st.sigText) || '';
        if (e.sigText !== sg) { e.sigText = sg; e.sig.innerHTML = oxSigHtml(sg); const nm = sg.split('\n').map((x) => x.trim()).find((x) => x && !/^_+$/.test(x)); e.who.textContent = nm ? nm.replace(/,.*$/, '') : 'You'; }
      }
      function oxEdit(id) {
        const st = model && model.ox && model.ox.st;
        const d = st && (st.drafts || []).find((x) => x.id === id);
        if (!d) { flash('That draft changed. Look again'); return; }
        const ov = q('.oxp');
        ov.innerHTML = oxHead() + '<div class="oxb"><div class="oxtb"><button type="button" class="oxbn" data-ox="back">‹ All drafts</button><span class="oxc st"></span><span class="oxth"></span><span class="g"></span>' +
          '<button type="button" class="oxbn" data-ox="copy" title="Copies the body and your signature, ready to paste into Gmail">Copy for Gmail</button>' +
          '<button type="button" class="oxbn pri" data-ox="save" title="Save to the Outbox (Cmd S)">Save</button></div>' +
          '<input class="oxsub" aria-label="Subject" spellcheck="true">' +
          '<div class="oxfr"><div class="oxav">' + (oxLaneP === 'am' ? SM_AM_LOGO : 'AM') + '</div><div class="oxwho"><b class="oxme">You</b><div class="oxto2"></div></div></div>' +
          '<div class="oxnew" hidden><span>A newer version was saved in the Outbox.</span><button type="button" class="oxbn" data-ox="load">Load it</button><button type="button" class="oxbn" data-ox="keep">Keep mine</button></div>' +
          '<textarea class="oxbody" aria-label="Message" spellcheck="true"></textarea><div class="oxsig"></div></div>' +
          '<div class="oxst" aria-live="polite"></div>';
        const qq = (s) => ov.querySelector(s);
        const e = { id, lane: oxLaneP, sub: qq('.oxsub'), body: qq('.oxbody'), chip: qq('.oxc.st'), th: qq('.oxth'), to: qq('.oxto2'), who: qq('.oxme'), newer: qq('.oxnew'), sig: qq('.oxsig'), stEl: qq('.oxst'),
          sigText: null, server: null, saving: null, pending: null, dirty: false, timer: null, tok: '', again: false, forceNext: false, retry: false, leaving: false, savedAt: '' };
        oxEd = e;
        oxFill(e, d, st);
        oxApply(e, { subject: d.subject || '', body: d.body || '' });
        oxSay(d.edited_by ? 'Last edit by ' + d.edited_by + ', ' + oxPT(d.updated_at) : 'Type straight in. Edits save to the Outbox on their own.');
        const onEdit = () => {
          e.dirty = true; oxSay('Editing…'); oxGrow(e.body);
          clearTimeout(e.timer); e.timer = setTimeout(() => { e.timer = null; oxSave(false); }, 1500);
        };
        e.body.addEventListener('input', onEdit);
        e.sub.addEventListener('input', onEdit);
        oxHeadFill(ov, st, ((model && model.tabs) || []).filter((x) => !x.deck && !x.chief && !x.outbox && x.on !== false && x.state === 'red' && (x.reqKey || x.folder)).length);
        requestAnimationFrame(() => oxGrow(e.body));
      }
      function oxSave(force) {
        const e = oxEd; if (!e) return;
        clearTimeout(e.timer); e.timer = null;
        if (e.tok) { e.again = true; if (force) e.forceNext = true; return; }   // one save at a time; the next follows the answer
        const v = oxLocal(e);
        if (!force && oxSame(v, e.server)) { e.dirty = false; oxSay(e.savedAt ? 'Saved to the Outbox at ' + e.savedAt : 'No changes to save'); oxDone(e); return; }
        const token = Math.random().toString(36).slice(2, 10);
        e.tok = token; e.saving = v;
        oxSay('Saving…');
        onAction({ t: 'ox', cmd: 'save', lane: e.lane || oxLaneP, id: e.id, subject: v.subject, body: v.body, base: e.server, force: !!force, token });
      }
      function oxDone(e) { if (e.leaving && !e.dirty && !e.tok) { e.leaving = false; if (oxEd === e) oxLeave(); } }
      function oxLeave() { if (oxEd) clearTimeout(oxEd.timer); oxEd = null; oxSig = ''; if (model) renderOx(model); }
      function oxAck(m) {
        const e = oxEd;
        if (!e || !m || m.token !== e.tok) return;   // an older save, or a draft no longer open
        e.tok = '';
        const v = e.saving; e.saving = null;
        if (m.ok) {
          e.server = v; e.retry = false;
          if (oxSame(oxLocal(e), v)) e.dirty = false;
          e.pending = null; e.newer.hidden = true;
          e.savedAt = (oxPT(m.at || new Date().toISOString()).split(' ').slice(1).join(' ')) || 'just now';
          oxSay('Saved to the Outbox at ' + e.savedAt);
          if (e.again) { e.again = false; const f = e.forceNext; e.forceNext = false; oxSave(f); return; }
          oxDone(e);
          return;
        }
        e.again = false; e.forceNext = false; e.leaving = false;
        if (m.why === 'changed') {
          if (m.current) e.pending = { subject: String(m.current.subject || ''), body: String(m.current.body || '') };
          e.newer.hidden = false;
          oxSay('Not saved yet. The Outbox has a newer version: Load it, or Keep mine to save yours over it.', true);
        } else {
          e.retry = m.why === 'closed' || m.why === 'timeout';
          oxSay(m.why === 'closed' ? "Not saved. The Outbox isn't open; it saves as soon as the Outbox is back. Click Open outbox." :
            m.why === 'timeout' ? "Not saved. The Outbox didn't answer; it tries again when it hears from it." :
            m.why === 'gone' ? 'Not saved. That draft is gone from the Outbox. Copy your text if you need it.' :
            m.why === 'readonly' ? 'Not saved. The Outbox is read only in that tab.' : 'Not saved. Click Save to try again.', true);
        }
        if (q('.oxp').hidden) flash('An Outbox draft did not save. Open the OUT wedge to see it');
      }
      // what the Outbox says now, laid against what you're typing
      function oxSync(st) {
        const e = oxEd, d = (st.drafts || []).find((x) => x.id === e.id);
        if (!d) { if (!e.goneSaid) { e.goneSaid = true; oxSay('This draft is gone from the Outbox. Copy your text if you need it.', true); } return; }
        e.goneSaid = false;
        oxFill(e, d, st);
        const remote = { subject: String(d.subject || ''), body: String(d.body || '') };
        if (e.retry && e.dirty && !e.tok) { e.retry = false; oxSave(false); return; }
        if (oxSame(remote, e.server)) return;                                                   // nothing new
        if (oxSame(remote, e.saving) || oxSame(remote, oxLocal(e))) { e.server = remote; return; }  // our own save, echoing back
        if (e.dirty || e.tok) { e.pending = remote; e.newer.hidden = false; return; }             // never on top of your typing
        oxApply(e, remote);                                                                       // idle: take the newer version
        oxSay('Updated from the Outbox, ' + oxPT(d.updated_at) + (d.edited_by ? ', by ' + d.edited_by : ''));
      }
      async function oxCopy() {
        const e = oxEd; if (!e) return;
        const st = model && model.ox && model.ox.st;
        const sigHtml = (st && st.sigHtml) || '', sigText = (st && st.sigText) || '';
        const paras = e.body.value.split(/\n\s*\n/).map((p) => '<p style="margin:0 0 14px">' + smEsc(p).replace(/\n/g, '<br>') + '</p>');
        const html = '<div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:#000;">' + paras.join('') + '</div>' + sigHtml;
        const text = e.body.value + (sigText ? '\n\n' + sigText : '');
        try {
          if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]);
          } else await navigator.clipboard.writeText(text);
          oxSay('Copied with your signature. Paste into Gmail.');
        } catch (x) { e.body.focus(); e.body.select(); oxSay('Copy was blocked here. The text is selected: press Cmd C.', true); }
      }
      function oxClick(k, id) {
        if (k === 'edit') { oxEdit(id); return; }
        if (k === 'tab') { onAction({ t: 'ox', cmd: 'tab', lane: oxLaneP }); return; }
        if (k === 'close') { if (oxEd && (oxEd.dirty || oxEd.timer)) oxSave(false); onAction({ t: 'ox', cmd: 'close', lane: oxLaneP }); return; }
        const e = oxEd; if (!e) return;
        if (k === 'back') {
          if (e.dirty || e.tok || e.timer) { e.leaving = true; oxSave(false); if (oxEd === e && e.leaving) oxSay('Saving, then back to all drafts…'); return; }
          oxLeave(); return;
        }
        if (k === 'save') { oxSave(false); return; }
        if (k === 'copy') { oxCopy(); return; }
        if (k === 'load') { if (e.pending) { clearTimeout(e.timer); e.timer = null; oxApply(e, e.pending); oxSay('Loaded the Outbox version.'); } return; }
        if (k === 'keep') { e.pending = null; e.newer.hidden = true; oxSave(true); }
      }
      function renderOx(m) {
        const c = m && m.ox, ov = q('.oxp');
        const open = !!(c && c.open);
        if (open !== oxOpen) { oxOpen = open; fx.classList.toggle('oxing', open); }
        const lane = c && c.lane === 'am' ? 'am' : 'ch';   // 9.4: the other Outbox: save what's typed, then switch letterheads
        if (open && lane !== oxLaneP) {
          if (oxEd) { if (oxEd.dirty || oxEd.timer) oxSave(false); clearTimeout(oxEd.timer); oxEd = null; }
          oxLaneP = lane; oxSig = ''; ov.innerHTML = '';
        }
        ov.classList.toggle('am', oxLaneP === 'am');
        if (open && oxLaneP === 'am') smFontsFor({ f: { fams: ['Tenor Sans', 'Cormorant Garamond'] } });
        if (!open) {   // hidden, not thrown away: a draft you were editing is still there when you come back
          if (!ov.hidden) { ov.hidden = true; if (oxEd && (oxEd.dirty || oxEd.timer)) oxSave(false); }
          return;
        }
        const st = c.alive ? c.st : null;
        const waitReq = (m.tabs || []).filter((e) => !e.deck && !e.chief && !e.outbox && e.on !== false && e.state === 'red' && (e.reqKey || e.folder)).length;
        if (oxEd && !ov.contains(oxEd.body)) oxEd = null;
        if (oxEd) {
          ov.hidden = false;
          oxHeadFill(ov, st, waitReq);
          if (st && st.loaded) oxSync(st);
          else if (!oxEd.tok && !oxEd.closedSaid) { oxEd.closedSaid = true; oxSay("The Outbox tab isn't open. Your text stays here; it saves when the Outbox is back.", true); }
          if (st && st.loaded) oxEd.closedSaid = false;
          return;
        }
        if (!st || !st.loaded) {
          const sig = 'w|' + oxLaneP + '|' + !!c.opening + '|' + !!st;
          if (sig !== oxSig || ov.hidden) {
            oxSig = sig;
            ov.innerHTML = oxHead() + '<div class="oxb"><div class="oxwait">' + (c.opening ? 'Opening the Outbox in a tab behind this one.' : st ? 'Loading the Outbox.' : 'The Outbox isn\'t open.') +
              '<small>' + (c.opening || st ? 'Your drafts land here in a few seconds.' : 'Click Open outbox, or say ' + (oxLaneP === 'am' ? 'mandel outbox' : 'outbox') + '.') + '</small></div></div><div class="oxhn">say ' + (oxLaneP === 'am' ? 'mandel outbox' : 'outbox') + ' · read draft one · nothing sends from here</div>';
          }
          oxHeadFill(ov, st, waitReq);
          ov.hidden = false;
          return;
        }
        const ds = oxOrder(st.drafts, m.floor && m.floor.path);
        const sig = JSON.stringify([oxLaneP, ds.map((d) => [d.id, d.subject, String(d.body || '').slice(0, 300), d.to, d.cc, d.status, d.updated_at, d.sent_at])]);
        if (sig !== oxSig || ov.hidden) {
          oxSig = sig;
          let h = oxHead() + '<div class="oxb">';
          if (!ds.length) h += '<div class="oxem">No drafts yet. Claude drops new ones here.</div>';
          ds.forEach((d, i) => {
            h += '<button type="button" class="oxr" data-ox="edit" data-id="' + smEsc(d.id) + '"><span class="oxn">' + (i + 1) + '</span><span class="oxm"><span class="oxt">' +
              '<span class="oxc ' + smEsc(d.status) + '">' + smEsc(oxChip(d)) + '</span><span class="oxto">to ' + smEsc(oxWho(d.to)) + (d.cc ? ' · cc ' + smEsc(oxWho(d.cc)) : '') + '</span>' +
              '<span class="g"></span><span class="oxw">' + smEsc(oxPT(d.updated_at)) + '</span></span>' +
              '<span class="oxs">' + smEsc(d.subject || '(no subject)') + '</span><span class="oxx">' + smEsc(String(d.body || '').replace(/\s+/g, ' ').slice(0, 260)) + '</span></span></button>';
          });
          h += '</div><div class="oxhn">click a draft to edit · say ' + (oxLaneP === 'am' ? 'mandel outbox' : 'outbox') + ' · read draft one · nothing sends from here</div>';
          ov.innerHTML = h;
        }
        oxHeadFill(ov, st, waitReq);
        ov.hidden = false;
      }
      // 9.1: keys typed in the Outbox editor stay there, so claude.ai underneath never takes them. Cmd S saves
      for (const ty of ['keydown', 'keyup', 'keypress', 'paste']) {
        window.addEventListener(ty, (ev) => {
          const tg = ev.target;
          if (!(tg && tg.closest && tg.closest('.oxp') && fx.contains(tg))) return;
          if (ty === 'keydown' && (ev.metaKey || ev.ctrlKey) && !ev.altKey && /^s$/i.test(ev.key || '')) { ev.preventDefault(); oxSave(false); }
          ev.stopPropagation(); if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        }, true);
      }

      // ---------- 8.1: the transcript follows the voice, word by word ----------
      // Every word of the reply being read is wrapped once, here in screen mode's own copy (the chat itself
      // is never touched). As the voice moves, the word being spoken lights up and glows, words already
      // spoken settle to full ink with the glow trailing off behind them, the rest of the sentence waits
      // half lit, and everything after it rests dim. The panel glides to keep the spoken line in view.
      const BLOCKS = 'p,li,h1,h2,h3,h4,h5,h6,blockquote,td,th';
      const TOK = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
      const tokNorm = (x) => x.toLowerCase().replace(/['’]/g, '');
      function tokens(t) { const out = []; TOK.lastIndex = 0; let m; while ((m = TOK.exec(t))) out.push({ k: tokNorm(m[0]), at: m.index }); return out; }
      let rd = null;          // { part, at, P, al, body }
      let rdLineTop = null;
      function readBody() { const b = fx.querySelectorAll('.msg.c .body'); return b[b.length - 1] || null; }
      function wrapWords(body) {
        if (body.__w) return body.__w;
        const out = [], nodes = [];
        const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest('pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
        for (let n = tw.nextNode(); n; n = tw.nextNode()) nodes.push(n);
        for (const n of nodes) {
          const t = n.nodeValue;
          TOK.lastIndex = 0;
          let m, lastI = 0, any = false;
          const frag = document.createDocumentFragment();
          while ((m = TOK.exec(t))) {
            any = true;
            if (m.index > lastI) frag.appendChild(document.createTextNode(t.slice(lastI, m.index)));
            // the punctuation right after a word rides with it, so it dims and lights with the word
            const tail = (/^[^\s\p{L}\p{N}]+/u.exec(t.slice(m.index + m[0].length)) || [''])[0];
            const sp = document.createElement('span');
            sp.className = 'w'; sp.textContent = m[0] + tail;
            frag.appendChild(sp);
            out.push({ el: sp, k: tokNorm(m[0]), c: '' });
            lastI = m.index + m[0].length + tail.length;
            TOK.lastIndex = lastI;
          }
          if (!any) continue;
          if (lastI < t.length) frag.appendChild(document.createTextNode(t.slice(lastI)));
          n.parentNode.replaceChild(frag, n);
        }
        body.__w = out;
        return out;
      }
      // where this stretch of the reading sits among the words on screen
      function alignPart(W, P, from) {
        const find = (k, s0) => {
          for (let s = Math.max(0, s0); s <= W.length - k; s++) {
            let ok = true;
            for (let j = 0; j < k; j++) if (W[s + j].k !== P[j].k) { ok = false; break; }
            if (ok) return s;
          }
          return -1;
        };
        if (!P.length || !W.length) return null;
        const k = Math.min(4, P.length);
        let st = find(k, from);
        if (st < 0) st = find(k, 0);
        if (st < 0 && k > 2) { st = find(2, from); if (st < 0) st = find(2, 0); }
        if (st < 0) return null;
        const map = new Array(P.length).fill(-1);
        let wi = st;
        for (let j = 0; j < P.length; j++) {
          for (let d = 0; d < 6 && wi + d < W.length; d++) if (W[wi + d].k === P[j].k) { map[j] = wi + d; wi += d + 1; break; }
        }
        return { st, map, end: wi };
      }
      function clearGlow() {
        fx.querySelectorAll('.body.rd').forEach((b) => b.classList.remove('rd'));
        fx.querySelectorAll('.rdblk').forEach((b) => b.classList.remove('rdblk'));
        q('.flw').hidden = true;
        rdLineTop = null;
      }
      function paintWords(scrollNow) {
        if (!rd) { clearGlow(); return; }
        const body = readBody();
        if (!body) return;
        const fresh = rd.body !== body || !body.__w;
        const W = wrapWords(body);
        if (fresh || !rd.al) {
          rd.body = body;
          rd.al = alignPart(W, rd.P, rd.al ? rd.al.st : 0);
          if (fresh) { fx.classList.add('rdinst'); requestAnimationFrame(() => requestAnimationFrame(() => fx.classList.remove('rdinst'))); }
        }
        const al = rd.al;
        if (!al) return;
        body.classList.add('rd');
        // the word being spoken, and the end of its sentence in the reading
        let pj = 0;
        while (pj + 1 < rd.P.length && rd.P[pj + 1].at <= rd.at) pj++;
        let now = -1;
        for (let j = pj; j >= 0; j--) if (al.map[j] >= 0) { now = al.map[j]; break; }
        if (now < 0) now = al.st;
        const rest = rd.part.slice(rd.at);
        const sm = rest.search(/[.!?](?:["')\]]*)(?:\s|$)/);
        const sEnd = sm < 0 ? rd.part.length : rd.at + sm;
        let ahead = now;
        for (let j = pj + 1; j < rd.P.length && rd.P[j].at <= sEnd; j++) if (al.map[j] > ahead) ahead = al.map[j];
        for (let i2 = 0; i2 < W.length; i2++) {
          const c = i2 < now ? 'w sd' : i2 === now ? 'w nw' : i2 <= ahead ? 'w ah' : 'w';
          if (W[i2].c !== c) { W[i2].c = c; W[i2].el.className = c; }
        }
        const nowEl = W[now] && W[now].el;
        if (!nowEl) return;
        const blk = nowEl.closest(BLOCKS);
        fx.querySelectorAll('.rdblk').forEach((b) => { if (b !== blk) b.classList.remove('rdblk'); });
        if (blk && body.contains(blk)) blk.classList.add('rdblk');
        // glide to keep the spoken line about a third of the way down, unless you scrolled in the last 8 seconds
        if (!scrollNow && Date.now() - msgScrollAt < 8000) { q('.flw').hidden = false; return; }
        q('.flw').hidden = true;
        try {
          const sc = q('.msgs'), r = nowEl.getBoundingClientRect(), box = sc.getBoundingClientRect();
          const sk = box.height / sc.clientHeight || 1;   // the frame is scaled
          const top = sc.scrollTop + (r.top - box.top) / sk;
          if (!scrollNow && rdLineTop !== null && Math.abs(top - rdLineTop) < 6) return;   // same line: stay still
          rdLineTop = top;
          const want = Math.max(0, top - sc.clientHeight * 0.38);
          if (scrollNow || Math.abs(want - sc.scrollTop) > 4) sc.scrollTo({ top: want, behavior: 'smooth' });
        } catch (e) {}
      }
      // r: { part, at } from the reading tab (at is the character the voice is on), or a bare sentence
      function setReading(r) {
        if (!r) { if (rd) { rd = null; clearGlow(); } return; }
        if (typeof r === 'string') r = r ? { part: r, at: r.length } : null;
        if (!r || !r.part) { if (rd) { rd = null; clearGlow(); } return; }
        if (!rd || rd.part !== r.part) rd = { part: r.part, at: +r.at || 0, P: tokens(r.part), al: null, body: rd ? rd.body : null, prevSt: rd && rd.al ? rd.al.st : 0 };
        else rd.at = +r.at || 0;
        if (rd.al === null && rd.prevSt) rd.al = null;
        paintWords(false);
      }
      function follow() { msgScrollAt = 0; rdLineTop = null; q('.flw').hidden = true; paintWords(true); }
      q('.msgs').addEventListener('wheel', () => { if (rd) { msgScrollAt = Date.now(); q('.flw').hidden = false; } }, { passive: true });

      // names on the rails stop short of the timer, measured in whatever font actually loaded
      function fitNames() {
        fx.querySelectorAll('.stage text.fit').forEach((el) => {   // 9.1: the views' labels
          const full = el.getAttribute('data-full') || '', max = +el.getAttribute('data-w') || 200;
          el.textContent = full;
          let len = 0;
          try { len = el.getComputedTextLength(); } catch (e) { return; }
          let n = full.length;
          while (len > max && n > 2) { n--; el.textContent = full.slice(0, n).trim() + '…'; len = el.getComputedTextLength(); }
        });
        fx.querySelectorAll('.stage text.rn').forEach((el) => {
          const full = el.getAttribute('data-full') || '';
          const rr = fx.querySelector('.stage text.rr[data-i="' + el.getAttribute('data-i') + '"]');
          let rw = 0;
          try { rw = rr && rr.textContent ? rr.getComputedTextLength() : 0; } catch (e) {}
          const max = 300 - rw - (rw ? 16 : 0);
          el.textContent = full;
          let len = 0;
          try { len = el.getComputedTextLength(); } catch (e) { return; }
          let n = full.length;
          while (len > max && n > 5) { n--; el.textContent = full.slice(0, n).trim() + '…'; len = el.getComputedTextLength(); }
        });
      }

      // the timers on the rails, once a second
      function tick() {
        const now = Date.now();
        fx.querySelectorAll('.stage [data-since]').forEach((el) => { el.textContent = smClock(now - (+el.getAttribute('data-since') || now)); });
        fx.querySelectorAll('.stage [data-tl]').forEach((el) => {   // 9.1: timeline bars
          const w = Math.max(6, Math.min(now - (+el.getAttribute('data-tl') || now), 1200000) * (+el.getAttribute('data-k') || 0));
          el.setAttribute('width', w.toFixed(1)); el.setAttribute('x', ((+el.getAttribute('data-x1') || 0) - w).toFixed(1));
        });
        fx.querySelectorAll('.stage [data-grow]').forEach((el) => { el.setAttribute('width', Math.round(300 * Math.min(1, Math.max(0.06, (now - (+el.getAttribute('data-grow') || now)) / 600000)))); });
      }

      // messages: labeled You and Claude, older ones dimmed, the latest image docked
      function setHtml(html, path) {
        if (html === lastHtml && path === lastPath) return;
        const sc = q('.msgs'), mz = q('.mz');
        const jumped = path !== lastPath;
        const nearBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 160;
        lastHtml = html; lastPath = path;
        const frag = smClean(html);
        const tsig = path + '|' + frag.textContent.replace(/\s+/g, ' ') + '|' + frag.querySelectorAll('img').length;   // 8.1
        if (!jumped && tsig === lastTextSig) return;
        lastTextSig = tsig;
        const nodes = [...frag.children];
        const out = document.createDocumentFragment();
        let lastClaude = null;
        nodes.forEach((n, i) => {
          const you = n.matches('[data-testid="user-message"]') || !!n.querySelector('[data-testid="user-message"]');
          const w = document.createElement('div');
          w.className = 'msg ' + (you ? 'y' : 'c') + (i < nodes.length - 2 ? ' old' : '');
          const who = document.createElement('div'); who.className = 'who'; who.textContent = you ? 'You' : 'Claude';
          const body = document.createElement('div'); body.className = 'body'; body.appendChild(n);
          w.appendChild(who); w.appendChild(body);
          out.appendChild(w);
          if (!you) lastClaude = body;
        });
        // the dock takes the newest real picture from the latest reply, not icons or favicons
        const dock = q('.dock'), im = q('.im');
        im.replaceChildren();
        let pic = null;
        if (lastClaude) {
          const imgs = [...lastClaude.querySelectorAll('img')].filter((g) => {
            const src = g.getAttribute('src') || '', cls = g.getAttribute('class') || '';
            const wa = +(g.getAttribute('width') || 0), ha = +(g.getAttribute('height') || 0);
            if (/favicon|s2\/favicons|icon/i.test(src)) return false;
            if (/(^|\s)(size|w|h)-(2|3|4|5|6|7|8|10|12)(\s|$)/.test(cls)) return false;
            if ((wa && wa < 80) || (ha && ha < 80)) return false;
            return !!src;
          });
          pic = imgs[imgs.length - 1] || null;
        }
        if (pic) { im.appendChild(pic); pic.removeAttribute('width'); pic.removeAttribute('height'); pic.removeAttribute('class'); pic.removeAttribute('style'); dock.hidden = false; }
        else dock.hidden = true;
        if (!nodes.length) { const e = document.createElement('div'); e.className = 'mw'; e.textContent = 'No messages yet'; out.appendChild(e); }
        mz.replaceChildren(out);
        if (rd) paintWords(false);                                 // 8.1: the voice decides where we look
        else if (jumped || nearBottom) sc.scrollTop = sc.scrollHeight;
      }
      function clearHtml() {
        lastHtml = null; lastPath = ''; lastTextSig = '';
        q('.mz').innerHTML = '<div class="mw">Waiting for the chat you&#39;re talking to</div>';
        q('.dock').hidden = true;
      }

      setTheme(theme);
      return { el: fx, fit, setTheme, setZoom, paint, tick, setHtml, clearHtml, flash, setReading, follow, showPage, oxAck, setView, scale: () => (fx.getBoundingClientRect().width / 1920) || 1 };
    }

    // Rajdhani, Barlow and Share Tech Mono for the dark look. Claude's page blocks outside font
    // links, so the files come in through Tampermonkey and load as fonts in memory. Without them
    // the Mac's DIN Alternate and Avenir Next stand in.
    function smFonts(onload) {
      if (typeof GM_xmlhttpRequest !== 'function' || typeof FontFace !== 'function') return;
      const url = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Exo+2:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&family=Barlow:wght@400;500;600&family=Share+Tech+Mono&family=Audiowide&family=Monoton&family=Shippori+Mincho:wght@500;600;700&family=EB+Garamond:wght@400;500&family=JetBrains+Mono:wght@400;700&family=Syncopate:wght@700&family=Barlow+Condensed:wght@500;600;700&display=swap';   // 8.1: plus the living set faces for ANDRÉ MANDEL cards (9.0: and Chief of Staff's)
      try {
        GM_xmlhttpRequest({
          method: 'GET', url, headers: { 'User-Agent': navigator.userAgent },
          onload(r) {
            const css = (r && r.responseText) || '';
            const re = /\/\*\s*latin\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
            let m;
            while ((m = re.exec(css))) {
              const b = m[1];
              const fam = (/font-family:\s*'([^']+)'/.exec(b) || [])[1];
              const wt = (/font-weight:\s*(\d+)/.exec(b) || [])[1] || '400';
              const u = (/url\((https:[^)]+)\)/.exec(b) || [])[1];
              if (!fam || !u) continue;
              GM_xmlhttpRequest({
                method: 'GET', url: u, responseType: 'arraybuffer',
                onload(x) {
                  try { new FontFace(fam, x.response, { weight: wt }).load().then((f) => { document.fonts.add(f); if (onload) onload(); }).catch(() => {}); } catch (e) {}
                }
              });
            }
          }
        });
      } catch (e) {}
    }
    // @@SCREEN-END
    let chan = null;
    try { chan = new BroadcastChannel('chf-switchboard-v25'); } catch (e) {}
    const send = (m) => { try { if (chan) chan.postMessage(m); } catch (e) {} };
    const HQ_ID = Math.random().toString(36).slice(2, 10);   // 8.9: which HQ is which, for boot
    // 9.5: HQ HOLDS THE AIRPODS. Chrome sends a headphone press to the tab playing media, and a minimized
    // chat window couldn't keep it. HQ now plays the silent loop and owns the press, counts the taps itself,
    // and hands the result to whichever chat holds the floor. It says so every few seconds in chf_hq_keys;
    // while it does, chat tabs leave the press alone. If HQ can't play yet (no click since it opened),
    // nothing changes: the floor chat keeps the press the old way until HQ gets one click.
    const HQ_KEYS = 'chf_hq_keys';
    let hqLoop = null, hqTap = null, hqReadAt = 0, hqReclaimAt = 0;
    const hqOn = () => !!hqLoop && !hqLoop.paused;
    const hqBeat = () => { if (!hqOn()) return; try { localStorage.setItem(HQ_KEYS, JSON.stringify({ id: HQ_ID, ts: Date.now() })); } catch (e) {} };
    function hqPress(kind) {
      try { hqLoop.play().catch(() => {}); navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
      send({ t: 'hq-press', kind, ts: Date.now() });
    }
    function hqHandlers() {
      try { navigator.mediaSession.metadata = new MediaMetadata({ title: 'Switcheroo HQ' }); } catch (e) {}
      const tap = () => {   // one tap, or two within 450 ms, same as the chats counted it
        if (hqTap) { clearTimeout(hqTap); hqTap = null; hqPress('double'); return; }
        hqTap = setTimeout(() => { hqTap = null; hqPress('single'); }, 450);
      };
      ['play', 'pause', 'stop'].forEach((a) => { try { navigator.mediaSession.setActionHandler(a, tap); } catch (e) {} });
      // 9.6: AirPods double press arrives as next track, triple as previous track; each gets its own job
      const trackKind = { nexttrack: 'next', previoustrack: 'prev', seekforward: 'track', seekbackward: 'track' };
      Object.keys(trackKind).forEach((a) => {
        try { navigator.mediaSession.setActionHandler(a, () => hqPress(trackKind[a])); } catch (e) {}
      });
      try { navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
    }
    function hqArm() {
      if (!('mediaSession' in navigator)) return;
      try {
        if (!hqLoop) { hqLoop = new Audio(silentWav()); hqLoop.loop = true; hqLoop.volume = 1; }
        if (hqOn()) return;
        hqLoop.play().then(() => { hqHandlers(); hqBeat(); }).catch(() => {});
      } catch (e) {}
    }
    // a reading, a video or another tab took the press: take it back (pause and play makes HQ the newest player)
    function hqReclaim() {
      if (!hqOn() || Date.now() - hqReclaimAt < 1500) return;
      hqReclaimAt = Date.now();
      try { hqLoop.pause(); hqLoop.play().then(hqHandlers).catch(() => {}); } catch (e) {}
    }
    try {
      hqArm();
      ['pointerdown', 'keydown'].forEach((t) => document.addEventListener(t, (e) => { if (e.isTrusted && !hqOn()) hqArm(); }, true));
      setInterval(() => { if (hqOn()) hqBeat(); else hqArm(); }, 4000);
      if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener('chf_media', (n, o, v, remote) => { if (remote) setTimeout(hqReclaim, 400); });
      }
      window.addEventListener('pagehide', () => { try { localStorage.removeItem(HQ_KEYS); } catch (e) {} });
    } catch (e) {}
    const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
    let zoom = 1;
    try { zoom = +localStorage.getItem('chf_mirror_zoom2') || 1; } catch (e) {}
    let themeId = 'dark';
    try {
      const sv = localStorage.getItem('chf_mirror_theme');
      themeId = SM_THEMES[sv] ? sv : 'dark';   // 8.9.3: retro too
      if (!localStorage.getItem('chf_mirror_night9')) {   // 9.0: HQ takes the Chief of Staff look once, unless Retro is already your pick
        localStorage.setItem('chf_mirror_night9', '1');
        if (themeId !== 'retro') { themeId = 'night'; localStorage.setItem('chf_mirror_theme', 'night'); }
      }
      if (!localStorage.getItem('chf_mirror_sky93')) {   // 9.3: Retro Sky once, the look that follows the time of day
        localStorage.setItem('chf_mirror_sky93', '1');
        themeId = 'retrosky'; localStorage.setItem('chf_mirror_theme', 'retrosky');
      }
    } catch (e) {}

    try { localStorage.setItem('chf_looks', JSON.stringify(SM_LOOKS.map((id) => [id, SM_THEMES[id].name || SM_THEMES[id].look]))); } catch (e) {}   // 9.0.1: voice finds looks by name
    const css = document.createElement('style');
    css.textContent = '#chf-mirror{position:fixed;inset:0;z-index:2147483000;overflow:hidden}\n' + smCss();
    const root = document.createElement('div');
    root.id = 'chf-mirror';
    const scr = smMake(root, act);
    scr.setZoom(zoom);
    // 9.1: the view (how the chats are drawn), favorite looks, and whether the arrows step all looks or just favorites
    let viewIdHQ = 'pie';
    try { const sv = localStorage.getItem('chf_mirror_view'); if (SM_VIEWS.some((x) => x[0] === sv)) viewIdHQ = sv; } catch (e) {}
    scr.setView(viewIdHQ);
    let favs = ['retro', 'vapor', 'blueprint', 'sonar', 'deepspace', 'cyberpunk', 'artdeco', 'midcentury', 'tahoe'];   // André's picks, 10/6/26
    try { const f = JSON.parse(localStorage.getItem('chf_look_favs')); if (Array.isArray(f)) favs = f; else localStorage.setItem('chf_look_favs', JSON.stringify(favs)); } catch (e) {}
    let lkStep = 'all';
    try { lkStep = localStorage.getItem('chf_look_step') === 'fav' ? 'fav' : 'all'; } catch (e) {}
    function setViewHQ(id, quiet) {
      if (!SM_VIEWS.some((x) => x[0] === id)) return;
      viewIdHQ = id;
      try { localStorage.setItem('chf_mirror_view', id); } catch (x) {}
      scr.setView(id);
      scr.paint(model());
      if (!quiet) { const i = SM_VIEWS.findIndex((x) => x[0] === id); scr.flash(SM_VIEWS[i][1] + ' view · ' + (i + 1) + ' of ' + SM_VIEWS.length); }
    }
    function stepView(d) {
      const n = SM_VIEWS.length, i = SM_VIEWS.findIndex((x) => x[0] === viewIdHQ);
      setViewHQ(SM_VIEWS[((i < 0 ? 0 : i) + (d === -1 ? -1 : 1) + n) % n][0]);
    }
    function toggleFav(id) {
      if (!SM_THEMES[id]) return;
      favs = favs.includes(id) ? favs.filter((x) => x !== id) : favs.concat([id]);
      try { localStorage.setItem('chf_look_favs', JSON.stringify(favs)); } catch (x) {}
      if (!favs.length && lkStep === 'fav') lkStep = 'all';
      scr.paint(model());
      scr.flash((favs.includes(id) ? 'Favorite: ' : 'Out of favorites: ') + (SM_THEMES[id].look || id));
    }
    function setLkStep(mode) {
      lkStep = mode === 'fav' && favs.some((id) => SM_THEMES[id]) ? 'fav' : 'all';
      try { localStorage.setItem('chf_look_step', lkStep); } catch (x) {}
      scr.paint(model());
      scr.flash(lkStep === 'fav' ? 'Arrows step through your favorites' : 'Arrows step through all ' + SM_LOOKS.length + ' looks');
    }

    // the board, as every Claude tab reports it
    const reg = new Map();
    let floorId = '', floorP = null, lastAt = 0;
    function tabs() {
      const now = Date.now();
      for (const [id, e] of reg) if (now - e.ts > 150000) reg.delete(id);
      return [...reg.values()].filter((e) => e.chat).sort((a, b) => a.born - b.born || (a.id < b.id ? -1 : 1));
    }
    // 8.4: video tabs that report in, so the Pause videos switch can say how many are connected
    const hqMedia = new Map();
    try { if (typeof GM_addValueChangeListener === 'function') GM_addValueChangeListener('chf_media_beat', (n, o, b) => { if (b && b.id) { hqMedia.set(b.id, b); scr.paint(model()); } }); } catch (e) {}
    function hqMediaTabs() {
      const now = Date.now();
      for (const [id, b] of hqMedia) if (now - (b.ts || 0) > 30000) hqMedia.delete(id);
      return new Set([...hqMedia.values()].map((b) => b.site)).size;
    }
    // 8.0: the control panel reads the same store every Claude tab uses
    const CFG_KEY = 'chf_config_v1';
    function ctlModel() {
      const c = lsGet(CFG_KEY, {}), qt = lsGet('chf_sb_quiet', {}), h = lsGet('chf_hold', {});
      return { held: !!h.on, meeting: !!(h.on && h.meeting), read: c.autoRead !== false, mic: c.autoListen !== false, send: c.autoSend !== false,
        chimes: !qt.quiet, others: c.duck === false ? 'off' : c.duckMode === 'lower' ? 'lower' : 'pause', voice: c.el !== false, along: c.readAlong !== false, vidTabs: hqMediaTabs() };
    }
    // 8.1: the Swipe Deck, as the tab holding it reports it
    const DECK_URL = 'https://claude.ai/artifact/CbVwPd6sZh5MH2A7NUeMGP';
    let dk = null, dkManual = false, dkLast = null, dkOpening = 0;
    const dkAlive = () => !!dk && Date.now() - dk.at < 20000;
    function deckModel() {
      const alive = dkAlive(), st = alive ? dk.st || {} : {};
      const open = (alive && dk.on) || dkManual;
      if (!open && !alive) return null;
      return { st, on: alive && !!dk.on, alive, open, last: dkLast };
    }
    function deckEntry() {
      if (!dkAlive() || !dk.st || !dk.st.loaded) return null;
      const st = dk.st, n = (st.nAudio || 0) + (st.nVisual || 0);
      return { id: '__deck', deck: true, title: 'Swipe Deck', name: 'Swipe Deck', deckN: n, nAudio: st.nAudio || 0, nVisual: st.nVisual || 0, on: true, born: 0 };
    }
    // 9.0: Chief of Staff, as the tab holding the board reports it. The COS wedge is always on the pie;
    // when the board isn't open anywhere, a click opens it in a tab behind HQ.
    const CHIEF_URL = 'https://claude.ai/artifact/JJjN3PuusV1pH3UF9D6ndX';
    let ch = null, chManual = false, chOpening = 0;
    const chAlive = () => !!ch && Date.now() - ch.at < 20000;
    function chiefModel() {
      if (!chManual) return null;
      const alive = chAlive();
      return { open: true, alive, st: alive ? ch.st : null, opening: !alive && Date.now() - chOpening < 30000 };
    }
    function chiefEntry() {
      const base = { id: '__chief', chief: true, title: 'Chief of Staff', name: 'Chief of Staff', on: true, born: 0 };
      if (!chAlive() || !ch.st || !ch.st.loaded) return Object.assign(base, { closed: true, chiefN: 0 });
      const c = ch.st.counts || {};
      return Object.assign(base, { closed: false, chiefN: (c.needs || 0) + (c.blocked || 0), nNeeds: c.needs || 0, nBlocked: c.blocked || 0, nRun: c.running || 0 });
    }
    // 9.1: the CHxTLD Outbox, as the tab holding it reports it. The OUT wedge is always on the pie, lit while
    // drafts are ready; a click opens them over the pie to read and edit. Nothing here sends mail or touches Gmail.
    // 9.4: and the ANDRÉ MANDEL Outbox, its own lane, its own tab, its own letterhead. The two never share a draft
    const OUTBOX_URLS = { ch: 'https://claude.ai/artifact/S1cg22eqDYW7qKScqj3gRn', am: 'https://claude.ai/artifact/NZ5VthFKGWUwMEWSoXKxCy' };
    const OX_ID = { ch: '__outbox', am: '__amoutbox' }, OX_NAME = { ch: 'the CHxTLD Outbox', am: 'the ANDRÉ MANDEL Outbox' };
    const oxL = (l) => (l === 'am' ? 'am' : 'ch');
    const oxs = { ch: null, am: null }, oxOpening = { ch: 0, am: 0 };
    let oxManual = false;   // false, or the lane open over the pie
    const oxAlive = (l) => !!oxs[l] && Date.now() - oxs[l].at < 20000;
    function outboxModel() {
      if (!oxManual) return null;
      const l = oxL(oxManual), alive = oxAlive(l);
      return { open: true, lane: l, alive, st: alive ? oxs[l].st : null, opening: !alive && Date.now() - oxOpening[l] < 30000 };
    }
    function outboxEntry(l) {
      const base = { id: OX_ID[l], outbox: true, lane: l, title: l === 'am' ? 'ANDRÉ MANDEL Outbox' : 'CHxTLD Outbox', name: l === 'am' ? 'ANDRÉ MANDEL Outbox' : 'CHxTLD Outbox', on: true, born: 0 };
      if (!oxAlive(l) || !oxs[l].st || !oxs[l].st.loaded) return Object.assign(base, { closed: true, oxN: 0, nHold: 0 });
      const c = oxs[l].st.counts || {};
      return Object.assign(base, { closed: false, oxN: c.ready || 0, nHold: c.hold || 0 });
    }
    // 8.2: links every chat reported, by tab
    const linkReg = new Map();
    function linkList() {
      const now = Date.now(), live = new Set(tabs().map((e) => e.id));
      for (const [id, c] of linkReg) if (!live.has(id) && now - c.at > 150000) linkReg.delete(id);
      return [...linkReg.values()];
    }
    function model() {
      const f = lsGet('chf_sb_floor', null), list = tabs(), de = deckEntry();
      if (de) list.push(de);
      // 9.5.1: Chief and both Outboxes live on the pill rail only, not as cards in the views
      const apps = [chiefEntry(), outboxEntry('ch'), outboxEntry('am')];
      return { tabs: list, apps, floorId: floorId || (f && f.id) || '', floor: floorP, quiet: lsGet('chf_sb_quiet', {}), ctl: ctlModel(), deck: deckModel(), cos: chiefModel(), ox: outboxModel(), links: linkList(), looks: { favs, step: lkStep, view: viewIdHQ, clock: lookClock } };
    }
    // 9.5.1: the three pills only work when their pages are open somewhere. HQ opens any that haven't
    // reported in, once, behind it, a few seconds after it loads, so Chief, CHxTLD and Mandel are ready to tap.
    setTimeout(() => {
      const want = [];
      if (!chAlive()) want.push(['chief', CHIEF_URL]);
      // 9.9.5: the Outboxes no longer open themselves; a tap on their pill or "outbox" opens them
      want.forEach(([k, url], i) => setTimeout(() => {
        if (k === 'chief' ? chAlive() : oxAlive(k)) return;
        if (k === 'chief') chOpening = Date.now(); else oxOpening[k] = Date.now();
        try { GM_openInTab(url, { active: false, insert: true }); } catch (e) {}
      }, i * 1500));
    }, 9000);
    // 8.2: a page opens on the right of HQ when the site allows it; otherwise in a window docked there
    let page = null, pageWin = null, pageGen = 0;
    function headersSayNoFrame(url) {
      return new Promise((resolve) => {
        let done = false;
        const fin = (v) => { if (!done) { done = true; resolve(v); } };
        setTimeout(() => fin(null), 4000);
        try {
          const rq = GM_xmlhttpRequest({ method: 'GET', url, timeout: 6000,
            onreadystatechange: (r) => {
              if (r.readyState < 2 || done) return;
              const h = String(r.responseHeaders || '').toLowerCase();
              const xfo = (/^x-frame-options:\s*(.+)$/m.exec(h) || [])[1] || '';
              const fa = (/frame-ancestors\s+([^;\n]+)/.exec(h) || [])[1] || '';
              let same = false; try { same = new URL(url).origin === location.origin; } catch (e) {}
              let no = false;
              if (/deny/.test(xfo) || (/sameorigin/.test(xfo) && !same)) no = true;
              if (fa && !/\*|https:\/\/claude\.ai/.test(fa) && !(/'self'/.test(fa) && same)) no = true;
              fin(no);
              try { rq && rq.abort && rq.abort(); } catch (e) {}
            },
            onerror: () => fin(null), ontimeout: () => fin(null) });
        } catch (e) { fin(null); }
      });
    }
    function dockWindow(url) {
      try { if (pageWin && !pageWin.closed) pageWin.close(); } catch (e) {}
      const s = scr.scale(), x0 = scr.el.getBoundingClientRect().left || 0, left = Math.round(window.screenX + x0 + 800 * s), top = Math.round(window.screenY);
      const width = Math.max(480, Math.round(window.outerWidth - x0 - 800 * s)), height = Math.max(400, Math.round(window.outerHeight));
      let w = null;
      try { w = window.open(url, 'switcheroo-page', 'popup=yes,left=' + left + ',top=' + top + ',width=' + width + ',height=' + height); } catch (e) {}
      if (w) { pageWin = w; try { w.moveTo(left, top); w.resizeTo(width, height); } catch (e) {} }
      return !!w;
    }
    async function openPage(url, label, n, from) {
      if (!/^https?:/i.test(String(url || ''))) return false;
      const gen = ++pageGen;
      page = { url, label: label || '', n: n || 0, mode: 'checking' };
      scr.showPage(page);
      const no = await headersSayNoFrame(url);
      if (gen !== pageGen) return true;
      if (no) { page.mode = dockWindow(url) ? 'window' : 'blocked'; scr.showPage(page); return true; }
      page.mode = 'frame';
      scr.showPage(page);
      return true;
    }
    // claude.ai itself may refuse to frame a site; then the window takes over
    document.addEventListener('securitypolicyviolation', (e) => {
      if (!page || page.mode !== 'frame' || !/frame-src|child-src/.test(e.violatedDirective || e.effectiveDirective || '')) return;
      let o = ''; try { o = new URL(page.url).origin; } catch (x) {}
      if (o && String(e.blockedURI || '').indexOf(o) !== 0) return;
      page.mode = dockWindow(page.url) ? 'window' : 'blocked';
      scr.showPage(page);
    });
    function closePage() {
      pageGen++;
      try { if (pageWin && !pageWin.closed) pageWin.close(); } catch (e) {}
      pageWin = null; page = null;
      scr.showPage(null);
    }
    function applyTheme() {
      const t = SM_THEMES[themeId];
      root.style.background = t.v.bg;
      scr.setTheme(t);
      scr.paint(model());
    }
    function mount() {
      if (!document.body) return;
      if (!document.head.contains(css)) document.head.appendChild(css);
      if (!document.body.contains(root)) { document.body.appendChild(root); scr.fit(); }
    }

    function render(p, from) {
      lastAt = Date.now();
      if (from) floorId = from;
      floorP = p;
      mount();
      scr.paint(model());
      scr.setHtml(p.html || '', p.path || '');
      scr.setReading(p.reading && p.reading.path === p.path ? p.reading : null);   // 8.1
      try { document.title = 'Screen · ' + (p.title || 'Claude'); } catch (e) {}
    }
    function waiting() {
      mount();
      if (floorP) { floorP = null; scr.clearHtml(); }
      scr.paint(model());
      try { document.title = 'Screen mode'; } catch (e) {}
    }

    if (chan) chan.onmessage = (ev) => {
      const m = ev.data || {};
      if (m.t === 'mirror' && m.p) render(m.p, m.from);
      else if (m.t === 'state' && m.e) { reg.set(m.e.id, Object.assign({}, m.e, { ts: Date.now() })); scr.paint(model()); }
      else if (m.t === 'bye') { reg.delete(m.id); scr.paint(model()); }
      else if (m.t === 'floor' && m.to) { floorId = m.to; scr.paint(model()); }
      else if (m.t === 'quiet' || m.t === 'hold' || m.t === 'cfg') scr.paint(model());
      // 8.1: where the voice is, approvals answered, the deck
      else if (m.t === 'reading') { if (!m.from || m.from === floorId) scr.setReading(m.r && floorP && m.r.path === floorP.path ? m.r : null); }
      else if (m.t === 'hq-reclaim') hqReclaim();   // 9.5: a chat started playing a reading
      else if (m.t === 'follow') scr.follow();
      else if (m.t === 'model-ack' && m.to === 'mirror' && mdq && m.token === mdq.token) mdq.acks.push(m);   // 8.8
      // 8.2: links and pages
      else if (m.t === 'links' && m.from) { linkReg.set(m.from, { id: m.from, title: m.title, name: m.name, path: m.path, biz: m.biz || '', links: m.links || [], at: Date.now() }); scr.paint(model()); }
      else if (m.t === 'page-open' && m.url) { send({ t: 'page-opened', to: m.from, ok: true }); openPage(m.url, m.label, m.n, m.from); }   // HQ has it
      else if (m.t === 'page-close') { closePage(); send({ t: 'page-closed', to: m.from }); }
      else if ((m.t === 'approved' || m.t === 'denied') && m.to === 'mirror') scr.flash(m.ok ? (m.t === 'denied' ? 'Denied' : m.always ? 'Always allowed' : 'Allowed once') : 'That request changed, so it was left alone');
      else if (m.t === 'askpicked' && m.to === 'mirror') scr.flash(m.ok ? 'Answered' : 'That question changed, so nothing was picked');
      else if (m.t === 'deck' && m.st) {
        const wasOn = !!(dk && dk.on);
        dk = { from: m.from, st: m.st, on: !!m.on, at: Date.now() };
        if (wasOn && !dk.on) dkManual = false;   // the voice review ended: the deck steps aside
        scr.paint(model());
      }
      else if (m.t === 'deck-act' && m.cmd) { dkLast = { cmd: m.cmd, at: Date.now() }; }
      else if (m.t === 'chief' && m.st) { ch = { from: m.from, st: m.st, at: Date.now() }; scr.paint(model()); }   // 9.0
      else if (m.t === 'chief-ack' && m.to === 'mirror') chiefAckHQ(m);
      else if (m.t === 'chief-launch' && m.th) { send({ t: 'chief-launch-ack', to: m.from, token: m.token }); chiefLaunch(m.th); }   // 9.1: Open chat on the board
      else if (m.t === 'view') { if (m.id) setViewHQ(m.id); else if (m.step) stepView(m.step); }   // 9.1: "radar view"
      else if (m.t === 'look-step' && m.dir) flipTheme(m.dir);
      else if (m.t === 'look-clock') setClock(!!m.on);   // 9.3: "follow the clock"
      else if (m.t === 'outbox' && m.st) { oxs[oxL(m.lane)] = { from: m.from, st: m.st, at: Date.now() }; scr.paint(model()); }   // 9.1, 9.4
      else if (m.t === 'outbox-ack' && m.to === 'mirror') outboxAckHQ(m);
      else if (m.t === 'ox-show') outboxOpenHQ(m.lane);
      else if (m.t === 'delivered' && m.to === 'mirror') gotDelivered(m);   // 8.7
      else if (m.t === 'boot' && m.from) { send({ t: 'boot-ack', to: m.from }); bootRun('voice'); }   // 8.9: "boot up" in a chat
      else if (m.t === 'hq-boot' && m.id && m.id !== HQ_ID) stepAside();                              // 8.9: a boot HQ replaces this one
      else if (m.t === 'look' && SM_THEMES[m.id] && m.id !== themeId) setLook(m.id);                    // 8.9.3: "retro look"
    };
    // another tab changed a setting, the hold, or quiet mode
    window.addEventListener('storage', (e) => { if (/^chf_(config_v1|hold|sb_quiet)$/.test(e.key || '')) scr.paint(model()); });
    window.addEventListener('storage', (e) => { if (e.key === 'chf_mirror_theme' && SM_THEMES[e.newValue] && e.newValue !== themeId) setLook(e.newValue); });   // 8.9.3
    window.addEventListener('storage', (e) => { if (e.key === 'chf_mirror_view' && e.newValue !== viewIdHQ) setViewHQ(e.newValue, true); });   // 9.1

    // 7.8: the mirror's buttons send the same signals as your voice commands
    function jump(id) {
      if (id === '__deck') { deckOpen(); return; }   // 8.1
      if (id === '__chief') { chiefOpenHQ(); return; }   // 9.0
      if (id === '__outbox' || id === '__amoutbox') { outboxOpenHQ(id === '__amoutbox' ? 'am' : 'ch'); return; }   // 9.1, 9.4
      const e = reg.get(id);
      if (!e) return;
      if (id === floorId) { scr.flash('Already here'); return; }
      if (!e.armed) { send({ t: 'front', to: id }); scr.flash('Click once in ' + (e.name || e.title || 'that chat') + ' so it can talk'); return; }
      try { localStorage.setItem('chf_sb_floor', JSON.stringify({ id, ts: Date.now() })); } catch (x) {}
      send({ t: 'floor', to: id, from: 'mirror', why: 'switch', front: true, token: Math.random().toString(36).slice(2) });
      floorId = id;
      scr.paint(model());
    }
    function goNext() {
      const n = smNext(tabs(), floorId);
      if (!n) { scr.flash('Nothing waiting'); return; }
      jump(n.e.id);
    }
    // 8.0: the control panel. Hold goes to every tab; the switches write the shared settings
    const CTL_NAMES = { read: 'Read aloud', mic: 'Mic after reading', send: 'Auto send', chimes: 'Chimes and alerts', others: 'Other tabs', voice: 'ElevenLabs voice', along: 'Read while working' };
    function toggleCtl(k) {
      const cur = ctlModel();
      if (k === 'hold') {
        const on = !cur.held;
        try { localStorage.setItem('chf_hold', JSON.stringify({ on, ts: Date.now() })); } catch (x) {}
        send({ t: 'hold', on });
        scr.paint(model());
        scr.flash(on ? 'On hold. Nothing reads, talks or opens the mic' : 'Back on');
        return;
      }
      if (!(k in CTL_NAMES)) return;
      if (k === 'others') {   // 8.4: pause, then turn down, then off, then pause again
        const nx = { pause: 'lower', lower: 'off', off: 'pause' }[cur.others] || 'pause';
        const c = lsGet(CFG_KEY, {});
        c.duck = nx !== 'off';
        if (nx !== 'off') c.duckMode = nx;
        try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (x) {}
        send({ t: 'cfg' });
        scr.paint(model());
        scr.flash({ pause: 'Videos pause while we talk. Live and sports turn down', lower: 'Other tabs turn down while we talk', off: 'Other tabs are left alone' }[nx]);
        return;
      }
      const on = !cur[k];
      if (k === 'chimes') {
        const q2 = { quiet: !on, until: 0 };
        try { localStorage.setItem('chf_sb_quiet', JSON.stringify(q2)); } catch (x) {}
        send({ t: 'quiet', q: q2 });
      } else {
        const c = lsGet(CFG_KEY, {});
        if (k === 'read') c.autoRead = on;
        else if (k === 'send') c.autoSend = on;
        else if (k === 'mic') { c.autoListen = on; if (on) delete c.listenOff; else c.listenOff = true; }
        else if (k === 'voice') c.el = on;
        else if (k === 'along') c.readAlong = on;   // 8.7
        try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (x) {}
        send({ t: 'cfg' });
      }
      scr.paint(model());
      scr.flash(CTL_NAMES[k] + (on ? ' on' : ' off'));
    }
    function togglePause() {
      if (ctlModel().held) { toggleCtl('hold'); return; }   // 8.0: the pill reads ON HOLD; a click resumes
      const qt = lsGet('chf_sb_quiet', {}), now = Date.now();
      const on = !!qt.quiet || now < (qt.until || 0) || ((qt.turns > 0 || qt.turnsDone) && now < (qt.turnsUntil || 0));
      const q2 = on ? { quiet: false, until: 0 } : { quiet: false, until: 0, turns: 2, turnsDone: false, turnsUntil: now + 30 * 60000 };
      try { localStorage.setItem('chf_sb_quiet', JSON.stringify(q2)); } catch (x) {}
      send({ t: 'quiet', q: q2 });
      scr.paint(model());
      scr.flash(on ? 'Switcheroo back on' : 'Switcheroo paused for two turns');
    }
    // 8.1: approvals from the screen. Always allow only ever leaves from here, after a second click
    function approveFrom(k, id) {
      const e = reg.get(id);
      if (!e || !(e.reqKey || e.folder)) { scr.flash('That request is gone'); return; }
      if (k === 'deny') send({ t: 'deny', to: id, from: 'mirror', key: e.reqKey || '', folder: e.folder || '' });
      else send({ t: 'approve', to: id, from: 'mirror', key: e.reqKey || '', folder: e.folder || '', always: k === 'always' });
    }
    function pickFrom(key, n) {
      if (!floorId) return;
      send({ t: 'askpick', to: floorId, from: 'mirror', key, n });
      scr.flash(Array.isArray(n) ? 'Picked ' + n.join(', ') : n === 'skip' ? 'Skipped' : 'Picked ' + n);
    }
    // 8.1: the deck. Buttons answer the card on screen; Voice starts or stops the read aloud review
    function deckOpen() {
      dkManual = true; chManual = false; oxManual = false;   // 9.0: one panel over the pie at a time
      if (!dkAlive()) {
        if (Date.now() - dkOpening > 15000) {
          dkOpening = Date.now();
          try { GM_openInTab(DECK_URL, { active: false, insert: true }); } catch (e) { window.open(DECK_URL, '_blank'); }
          scr.flash('Opening Swipe Deck in a tab behind this one');
        }
      } else if (dk.st && dk.st.deck !== 'visual' && dk.st.nVisual) send({ t: 'deck-cmd', to: dk.from, cmd: 'deck', deck: 'visual' });
      scr.paint(model());
    }
    function deckCmd(cmd, deck) {
      if (cmd === 'close') {
        if (dkAlive() && dk.on) send({ t: 'deck-cmd', to: dk.from, cmd: 'stop' });
        dkManual = false; scr.paint(model()); return;
      }
      if (!dkAlive()) { deckOpen(); return; }
      if (cmd === 'voice') { send({ t: 'deck-cmd', to: dk.from, cmd: dk.on ? 'stop' : 'start' }); dkManual = true; return; }
      const c = dk.st && dk.st.card;
      if ((cmd === 'yes' || cmd === 'no' || cmd === 'tbd') && !c) return;
      dkLast = { cmd, at: Date.now() };
      send({ t: 'deck-cmd', to: dk.from, cmd, id: c ? c.id : '', deck });
    }
    // 9.0: Chief of Staff over the pie. Mark done goes to the board's tab; Read it hands the brief to the chat you're talking to
    function chiefOpenHQ() {
      chManual = true; dkManual = false; oxManual = false;
      if (!chAlive() && Date.now() - chOpening > 15000) {
        chOpening = Date.now();
        try { GM_openInTab(CHIEF_URL, { active: false, insert: true }); } catch (e) { window.open(CHIEF_URL, '_blank'); }
        scr.flash('Opening Chief of Staff in a tab behind this one');
      }
      scr.paint(model());
    }
    const chPend = new Map();   // token -> what HQ asked for
    function chiefAct(cmd, id, n) {
      if (cmd === 'close') { chManual = false; scr.paint(model()); return; }
      if (cmd === 'board') {
        if (chAlive()) { send({ t: 'front', to: ch.from }); scr.flash('Chief of Staff is in its own tab'); return; }
        try { GM_openInTab(CHIEF_URL, { active: true, insert: true }); } catch (e) { window.open(CHIEF_URL, '_blank'); }
        return;
      }
      if (cmd === 'chat' || cmd === 'link') {   // 9.1
        const t = chAlive() && ((ch.st && ch.st.start) || []).find((x) => x.id === id);
        if (!t) { scr.flash('That thread changed. Look again'); return; }
        if (cmd === 'link') { if (t.link) openPage(t.link, t.title || 'Link', 0, 'mirror'); return; }
        chiefLaunch(t);
        return;
      }
      if (cmd === 'read' || cmd === 'needs') {
        const f = floorId && reg.get(floorId);
        if (!f || !f.armed) { scr.flash('Click once in a chat so it can read the brief'); return; }
        send({ t: 'chief-say', to: floorId, what: cmd === 'needs' ? 'needs' : 'brief' });
        scr.flash((f.name || f.title || 'Your chat') + ' is reading the brief');
        return;
      }
      if (cmd === 'done' || cmd === 'undo') {
        if (!chAlive()) { scr.flash("Chief of Staff isn't open"); return; }
        const t = ((ch.st && ch.st.start) || []).find((x) => x.id === id) || (cmd === 'undo' && chPend.get('undo:' + id)) || null;
        if (!t) { scr.flash('That thread changed. Look again'); return; }
        const token = Math.random().toString(36).slice(2, 10);
        chPend.set(token, { cmd, t, n });
        if (cmd === 'done') chPend.set('undo:' + id, t);
        send({ t: 'chief-cmd', to: ch.from, from: 'mirror', cmd, id, status: t.status || '', token });
        scr.flash(cmd === 'done' ? 'Closing ' + (n ? 'number ' + n : 'it') : 'Reopening');
        setTimeout(() => { if (chPend.delete(token)) scr.flash("Chief didn't answer. Check the board"); }, 9000);
      }
    }
    // 9.1: a thread's chat. Already open: it takes the floor. A chat link: it opens behind HQ and takes the floor.
    // No chat yet: a new chat opens with the thread typed in, not sent, so you can add to it or send it as is
    const CHAT_LINK = /^https:\/\/claude\.ai\/chat\/([0-9a-f-]{36})/;
    const chiefSeed = (t) => {
      const lane = { 'CHxTLD': 'CHxTLD', 'ANDRE MANDEL': 'ANDRÉ MANDEL', 'PERSONAL': 'Personal' }[t.business] || '';
      return 'Chief of Staff thread' + (lane ? ', ' + lane : '') + (t.project ? ', ' + t.project : '') + ': ' + (t.title || 'Untitled') + '.' +
        (t.next ? ' Next: ' + t.next : '') + (t.link ? ' Link: ' + t.link : '');
    };
    function floorTo(e, why) {
      try { localStorage.setItem('chf_sb_floor', JSON.stringify({ id: e.id, ts: Date.now() })); } catch (x) {}
      send({ t: 'floor', to: e.id, from: 'mirror', why: why || 'switch', front: true, token: Math.random().toString(36).slice(2) });
      floorId = e.id;
      scr.paint(model());
    }
    let launching = false;
    async function chiefLaunch(t) {
      if (launching) { scr.flash('Still opening the last one'); return; }
      launching = true;
      try {
        const name = smTrunc(t.title || 'that thread', 40), m = CHAT_LINK.exec(String(t.link || ''));
        if (m) {
          const path = '/chat/' + m[1];
          let e = tabs().find((x) => x.path === path);
          if (e) { floorTo(e); scr.flash((e.name || name) + ' has the floor'); return; }
          try { GM_openInTab(t.link, { active: false, insert: true, setParent: true }); } catch (x) { window.open(t.link, '_blank', 'noopener'); }
          scr.flash('Opening the chat for ' + name);
          for (let i = 0; i < 100 && !(e = tabs().find((x) => x.path === path)); i++) await hqSleep(300);
          if (e) { floorTo(e); scr.flash((e.name || name) + ' has the floor'); } else scr.flash('The chat opened in a tab behind HQ');
          return;
        }
        const at = Date.now();
        try { GM_openInTab('https://claude.ai/new', { active: false, insert: true, setParent: true }); } catch (x) { window.open('https://claude.ai/new', '_blank', 'noopener'); }
        scr.flash('Starting a chat for ' + name);
        let e = null;
        for (let i = 0; i < 100 && !(e = tabs().find((x) => x.path === '/new' && (x.born || 0) >= at - 1500)); i++) await hqSleep(300);
        if (!e) { scr.flash('The new chat opened in a tab behind HQ'); return; }
        await hqSleep(600);
        deliver(e.id, [], chiefSeed(t), false);
        floorTo(e, 'chief');
        scr.flash('New chat for ' + name + '. The thread is typed in, not sent');
      } finally { launching = false; }
    }
    // 9.1: the Outbox over the pie. Save goes to the Outbox's tab, which writes the draft; Open outbox brings that tab forward
    function outboxOpenHQ(lane) {
      const l = oxL(lane);
      oxManual = l; dkManual = false; chManual = false;
      if (!oxAlive(l) && Date.now() - oxOpening[l] > 15000) {
        oxOpening[l] = Date.now();
        try { GM_openInTab(OUTBOX_URLS[l], { active: false, insert: true }); } catch (e) { window.open(OUTBOX_URLS[l], '_blank'); }
        scr.flash('Opening ' + OX_NAME[l] + ' in a tab behind this one');
      }
      scr.paint(model());
    }
    const oxPend = new Set();   // saves waiting on the Outbox's answer
    function outboxAct(a) {
      const l = oxL(a.lane || oxManual);
      if (a.cmd === 'close') { oxManual = false; scr.paint(model()); return; }
      if (a.cmd === 'tab') {
        if (oxAlive(l)) { send({ t: 'front', to: oxs[l].from }); scr.flash(OX_NAME[l].replace(/^the/, 'The') + ' is in its own tab'); return; }
        oxOpening[l] = Date.now();
        try { GM_openInTab(OUTBOX_URLS[l], { active: true, insert: true }); } catch (e) { window.open(OUTBOX_URLS[l], '_blank'); }
        return;
      }
      if (a.cmd !== 'save') return;
      if (!oxAlive(l)) {
        if (Date.now() - oxOpening[l] > 15000) { oxOpening[l] = Date.now(); try { GM_openInTab(OUTBOX_URLS[l], { active: false, insert: true }); } catch (e) {} }
        scr.oxAck({ token: a.token, ok: false, why: 'closed' });
        return;
      }
      oxPend.add(a.token);
      send({ t: 'outbox-cmd', lane: l, to: oxs[l].from, from: 'mirror', cmd: 'save', id: a.id, subject: a.subject, body: a.body, base: a.base || null, force: !!a.force, token: a.token });
      setTimeout(() => { if (oxPend.delete(a.token)) scr.oxAck({ token: a.token, ok: false, why: 'timeout' }); }, 9000);
    }
    function outboxAckHQ(m) { if (oxPend.delete(m.token)) scr.oxAck(m); }
    function chiefAckHQ(m) {
      const p = chPend.get(m.token);
      if (!p) return;
      chPend.delete(m.token);
      const nm = smTrunc(m.title || p.t.title || 'that thread', 44);
      if (m.ok) scr.flash(p.cmd === 'done' ? 'Closed: ' + nm : 'Reopened: ' + nm);
      else scr.flash(m.why === 'readonly' ? 'Chief is read only in that tab' : m.why === 'gone' ? 'That thread is gone from the board' : "Couldn't change it. Try the board");
    }
    // 8.1: the pie's center. A click pauses or plays everything; a long press is meeting mode
    function setHoldFrom(on, meeting) {
      try { localStorage.setItem('chf_hold', JSON.stringify({ on, meeting: !!(on && meeting), ts: Date.now() })); } catch (x) {}
      send({ t: 'hold', on, meeting: !!(on && meeting) });
      scr.paint(model());
      scr.flash(!on ? 'Playing. Everything is back on' : meeting ? 'Meeting mode. Nothing talks, replies land here as text' : 'Paused. Nothing reads, talks or opens the mic');
    }
    // 8.8: every open chat to one model; the chats answer, HQ tells you the tally
    let mdq = null;
    function modelFromHQ(name) {
      if (mdq) { scr.flash('Still setting the last one'); return; }
      const token = Math.random().toString(36).slice(2, 8), cap = name.charAt(0).toUpperCase() + name.slice(1);
      mdq = { token, acks: [], t: setTimeout(() => modelDone(cap), 9000) };
      send({ t: 'model', name, from: 'mirror', token });
      scr.flash('Setting every chat to ' + cap + '…');
    }
    function modelDone(cap) {
      const r = mdq; if (!r) return; mdq = null; clearTimeout(r.t);
      const ok = r.acks.filter((a) => a.ok).length, bad = r.acks.filter((a) => !a.ok);
      scr.flash(cap + ' set in ' + ok + (ok === 1 ? ' chat' : ' chats') + (bad.length ? ' · skipped ' + bad.slice(0, 3).map((a) => (a.name || 'a chat') + ' (' + (a.why || 'failed') + ')').join(', ') : ''));
    }
    function act(a) {
      if (a.t === 'model') modelFromHQ(a.name);
      else if (a.t === 'center') setHoldFrom(!ctlModel().held, false);
      else if (a.t === 'meeting') { const c = ctlModel(); setHoldFrom(!(c.held && c.meeting), true); }
      else if (a.t === 'appr') approveFrom(a.k, a.id);
      else if (a.t === 'pick') pickFrom(a.key, a.n);
      else if (a.t === 'deck') deckCmd(a.cmd, a.deck);
      else if (a.t === 'cos') chiefAct(a.cmd, a.id, a.n);   // 9.0
      else if (a.t === 'view') { if (a.id) setViewHQ(a.id); else stepView(a.step); }   // 9.1
      else if (a.t === 'lookset') setLook(a.id);
      else if (a.t === 'fav') toggleFav(a.id);
      else if (a.t === 'lkstep') setLkStep(a.mode);
      else if (a.t === 'clock') setClock(a.on);   // 9.3
      else if (a.t === 'ox') outboxAct(a);                  // 9.1
      else if (a.t === 'page') openPage(a.url, a.label, a.n, 'mirror');   // 8.2
      else if (a.t === 'pageAct') { if (a.k === 'close') closePage(); else if (a.k === 'window' && page) { page.mode = dockWindow(page.url) ? 'window' : 'blocked'; scr.showPage(page); } }
      else if (a.t === 'biz') {   // 8.2: this chat belongs to that practice, remembered in this browser
        const pins = lsGet('chf_biz_chat', {}) || {};
        if (a.biz) pins[a.path] = a.biz; else pins[a.path] = 'none';
        try { localStorage.setItem('chf_biz_chat', JSON.stringify(pins)); } catch (x) {}
        send({ t: 'biz', path: a.path });
        for (const c of linkReg.values()) if (c.path === a.path) c.biz = a.biz || '';
        scr.paint(model());
      }
      else if (a.t === 'jump') jump(a.id);
      else if (a.t === 'next') goNext();
      else if (a.t === 'pause') togglePause();
      else if (a.t === 'theme') flipTheme(a.dir);
      else if (a.t === 'ctl') toggleCtl(a.k);   // 8.0
      else if (a.t === 'boot') bootRun('pill');  // 8.9
    }

    // 8.7: HQ takes files and typing. A file dropped on a wedge or a rail lands in that chat's message
    // box; the center, or anywhere else, goes to the chat you're talking to. Words typed below go out on Send.
    const cx = {
      fx: root.querySelector('.smx'), inp: root.querySelector('.cmp .cin'), dst: root.querySelector('.cmp .cdst'),
      fl: root.querySelector('.cmp .cfl'), pick: root.querySelector('.cmp .cfile'), ov: root.querySelector('.dropov'), ovt: root.querySelector('.dropov .dpt')
    };
    let cTo = '';                 // '' follows the floor; otherwise the chat you last dropped on
    const cWait = new Map();      // token -> what went out
    let cChips = [];              // { token, to, name, st: busy | ok | bad }
    const cName = (id) => { const e = reg.get(id); return e ? (e.name || e.title || 'that chat') : 'that chat'; };
    function cTarget() {
      if (cTo && reg.has(cTo)) return cTo;
      if (cTo && !reg.has(cTo)) cTo = '';
      return floorId && reg.has(floorId) ? floorId : '';
    }
    function paintCmp() {
      if (!cx.dst) return;
      const id = cTarget(), pinned = !!cTo && cTo !== floorId;
      cx.dst.textContent = id ? smTrunc(cName(id), 30).toUpperCase() : 'NO CHAT YET';
      cx.dst.classList.toggle('pinned', pinned);
      cx.dst.title = pinned ? 'Click to send to the chat you are talking to instead' : 'Follows the chat you are talking to. Drop a file on a wedge to send there';
      const now = Date.now();
      cChips = cChips.filter((c) => !(c.st === 'bad' && now - c.at > 9000));
      cx.fl.innerHTML = cChips.map((c) => '<span class="chip ' + c.st + '" title="' + smEsc(c.name + ' · ' + cName(c.to)) + '">' +
        (c.to !== id ? '<i>' + smEsc(smTrunc(cName(c.to), 12)) + '</i>' : '') + '<b>' + smEsc(c.name) + '</b>' +
        '<i>' + (c.st === 'busy' ? '…' : c.st === 'bad' ? '✕' : '✓') + '</i></span>').join('');
    }
    function cAutosize() {
      if (!cx.inp) return;
      cx.inp.style.height = '54px';
      cx.inp.style.height = Math.min(170, Math.max(54, cx.inp.scrollHeight + 2)) + 'px';
    }
    function deliver(id, files, text, doSend) {
      if (!id) { scr.flash('No chat to send to yet. Click into a chat once'); return ''; }
      if (id === '__deck') { scr.flash('Swipe Deck does not take files'); return ''; }
      if (id === '__chief') { scr.flash('Chief of Staff does not take files'); return ''; }   // 9.0
      if (id === '__outbox' || id === '__amoutbox') { scr.flash('The Outbox does not take files'); return ''; }       // 9.1
      if (!reg.has(id)) { scr.flash('That chat closed. Pick another'); return ''; }
      const token = Math.random().toString(36).slice(2);
      const list = [...(files || [])];
      list.forEach((f) => cChips.push({ token, to: id, name: f.name || 'pasted image', st: 'busy', at: Date.now() }));
      cWait.set(token, { id, n: list.length, send: !!doSend, at: Date.now() });
      send({ t: 'deliver', to: id, from: 'mirror', token, files: list, text: text || '', send: !!doSend });
      setTimeout(() => {
        if (!cWait.has(token)) return;
        cWait.delete(token);
        cChips.forEach((c) => { if (c.token === token) { c.st = 'bad'; c.at = Date.now(); } });
        scr.flash(cName(id) + ' did not answer. Reload that tab once so it runs 8.7');
        paintCmp();
      }, doSend ? 120000 : 45000);
      paintCmp();
      return token;
    }
    function gotDelivered(m) {
      const w = cWait.get(m.token);
      if (!w) return;
      cWait.delete(m.token);
      const nm = cName(w.id);
      if (!m.ok) {
        cChips.forEach((c) => { if (c.token === m.token) { c.st = 'bad'; c.at = Date.now(); } });
        scr.flash(nm + ': ' + (m.why || 'that did not go through'));
      } else if (m.sent) {
        cChips = cChips.filter((c) => c.to !== w.id);
        scr.flash('Sent to ' + nm);
      } else {
        cChips.forEach((c) => { if (c.token === m.token) c.st = 'ok'; });
        const n = m.n || 0;
        scr.flash((n === 1 ? 'Attached to ' : 'Attached ' + n + ' files to ') + nm + (w.id === floorId ? '. Say it, or type below' : '. Type below to send it there'));
      }
      paintCmp();
    }
    function sendTyped() {
      const id = cTarget(), text = (cx.inp.value || '').trim();
      const waiting = cChips.some((c) => c.to === id && c.st !== 'bad');
      if (!id) { scr.flash('No chat to send to yet. Click into a chat once'); return; }
      if (!text && !waiting) { scr.flash('Type something, or drop a file first'); return; }
      if (deliver(id, [], text, true)) { cx.inp.value = ''; cAutosize(); }
    }
    if (cx.inp) {
      cx.inp.addEventListener('input', cAutosize);
      cx.dst.addEventListener('click', () => { cTo = ''; paintCmp(); });
      root.querySelector('.cmp .csend').addEventListener('click', sendTyped);
      root.querySelector('.cmp .cclip').addEventListener('click', () => cx.pick.click());
      cx.pick.addEventListener('change', () => {
        const fs = [...(cx.pick.files || [])];
        cx.pick.value = '';
        if (fs.length) deliver(cTarget(), fs, '', false);
      });
      // claude.ai underneath listens for keys, pastes and drops; HQ keeps its own
      window.addEventListener('keydown', (e) => {
        if (e.target !== cx.inp) return;
        e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendTyped(); }
      }, true);
      for (const ty of ['keyup', 'keypress']) window.addEventListener(ty, (e) => { if (e.target === cx.inp) { e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); } }, true);
      window.addEventListener('paste', (e) => {
        const fs = [...((e.clipboardData && e.clipboardData.files) || [])];
        if (fs.length) {
          e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          deliver(cTarget(), fs, '', false);
          return;
        }
        if (e.target === cx.inp) { e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); }
        else if (!(e.target && e.target.closest && e.target.closest('input, textarea, [contenteditable="true"]'))) {
          // words pasted anywhere on HQ go in the box
          const tx = e.clipboardData && e.clipboardData.getData('text/plain');
          if (tx) { e.preventDefault(); e.stopPropagation(); cx.inp.focus(); cx.inp.value += (cx.inp.value ? ' ' : '') + tx; cAutosize(); }
        }
      }, true);
      const hasFiles = (e) => { try { return [...(e.dataTransfer && e.dataTransfer.types || [])].includes('Files'); } catch (x) { return false; } };
      const dropId = (el) => { const j = el && el.closest && el.closest('[data-jump]'); return j ? j.getAttribute('data-jump') : ''; };
      let dHot = null, dOffT = null;
      const dragEnd = () => {
        clearTimeout(dOffT);
        if (dHot) { dHot.classList.remove('dhot'); dHot = null; }
        cx.ov.hidden = true; cx.fx.classList.remove('dragging');
      };
      const onDrag = (e) => {
        if (!hasFiles(e)) return;
        e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        try { e.dataTransfer.dropEffect = 'copy'; } catch (x) {}
        const id = dropId(e.target);
        const el = id ? e.target.closest('[data-jump]') : null;
        if (el !== dHot) { if (dHot) dHot.classList.remove('dhot'); dHot = el; if (el) el.classList.add('dhot'); }
        const to = id || cTarget();
        cx.ovt.textContent = id === '__deck' ? 'Swipe Deck does not take files' : id === '__chief' ? 'Chief of Staff does not take files' : (id === '__outbox' || id === '__amoutbox') ? 'The Outbox does not take files' : to ? 'Drop to send to ' + cName(to) : 'Drop on a chat';
        cx.ov.hidden = false; cx.fx.classList.add('dragging');
        clearTimeout(dOffT); dOffT = setTimeout(dragEnd, 400);
      };
      window.addEventListener('dragenter', onDrag, true);
      window.addEventListener('dragover', onDrag, true);
      window.addEventListener('drop', (e) => {
        if (!hasFiles(e)) return;
        e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        const id = dropId(e.target);
        dragEnd();
        const fs = [...(e.dataTransfer.files || [])];
        if (!fs.length) return;
        if (id && id !== '__deck' && id !== '__chief' && id !== '__outbox' && id !== '__amoutbox') cTo = id === floorId ? '' : id;
        deliver(id || cTarget(), fs, '', false);
      }, true);
      setInterval(paintCmp, 1000);
      paintCmp();
    }

    // 8.9.3: three looks now. A click, Option Shift D or the menu steps CHxTLD, Tron, Retro
    // 9.3: Follow the clock picks from your favorites by daylight; Retro Sky changes its own sky. A minute tick keeps both current
    let lookClock = false;
    try { lookClock = localStorage.getItem('chf_look_clock') === 'on'; } catch (e) {}
    function daylight(d) {   // 0 at night, 1 from mid morning to mid afternoon, ramps at dawn and dusk
      d = d || new Date();
      const h = d.getHours() + d.getMinutes() / 60;
      return h < 5 || h >= 21 ? 0 : h < 9 ? (h - 5) / 4 : h < 16 ? 1 : (21 - h) / 5;
    }
    function clockPick() {
      const fv = SM_LOOKS.filter((id) => favs.includes(id) && id !== 'retrosky').sort((x, y) => smLab(SM_THEMES[x].v.bg)[0] - smLab(SM_THEMES[y].v.bg)[0]);   // darkest first
      if (!fv.length) return 'retrosky';
      return fv[Math.round(daylight() * (fv.length - 1))];
    }
    function setClock(on, quiet) {
      lookClock = !!on;
      try { localStorage.setItem('chf_look_clock', lookClock ? 'on' : 'off'); } catch (x) {}
      if (lookClock) { const id = clockPick(); if (id !== themeId) { themeId = id; try { localStorage.setItem('chf_mirror_theme', id); } catch (x) {} applyTheme(); } }
      scr.paint(model());
      if (!quiet) scr.flash(lookClock ? 'Following the clock: ' + SM_THEMES[themeId].look : 'Not following the clock');
    }
    function clockTick() {
      const p = smPhase();
      if (themeId === 'retrosky' && SM_THEMES.retrosky.phase !== p[1]) { SM_THEMES.retrosky = smRetroSky(p); applyTheme(); }
      else if (SM_THEMES.retrosky.phase !== p[1]) SM_THEMES.retrosky = smRetroSky(p);
      if (lookClock) { const id = clockPick(); if (id !== themeId) { themeId = id; try { localStorage.setItem('chf_mirror_theme', id); } catch (x) {} applyTheme(); scr.flash(SM_THEMES[id].look + ' for the time of day'); } }
    }
    setInterval(clockTick, 60000);
    setTimeout(clockTick, 1200);   // catch up right after HQ opens
    function setLook(id, keepClock) {
      if (!SM_THEMES[id]) return;
      if (lookClock && !keepClock) setClock(false, true);   // a look you pick yourself wins over the clock
      themeId = id;
      try { localStorage.setItem('chf_mirror_theme', themeId); } catch (x) {}
      applyTheme();
      scr.flash(SM_THEMES[id].look + ' · ' + (SM_LOOKS.indexOf(id) + 1) + ' of ' + SM_LOOKS.length);
    }
    function flipTheme(dir) {   // 9.0.1: forward, or back one on a right click (9.1: just your favorites, when that's how the arrows step)
      const d = dir === -1 ? -1 : 1, fv = SM_LOOKS.filter((id) => favs.includes(id));   // 9.3: favorites in the same dark to light order
      const ring = lkStep === 'fav' && fv.length ? fv : SM_LOOKS, n = ring.length, i = ring.indexOf(themeId);
      setLook(i < 0 ? ring[d === 1 ? 0 : n - 1] : ring[(i + d + n) % n]);
    }
    document.addEventListener('keydown', (e) => {
      if (!e.altKey || !e.shiftKey) return;
      if (e.code === 'KeyM') {
        e.preventDefault(); e.stopPropagation();
        try { sessionStorage.removeItem(MIRROR_KEY); } catch (x) {}
        location.reload();
      } else if (e.code === 'KeyN') {
        e.preventDefault(); e.stopPropagation();
        goNext();
      } else if (e.code === 'KeyV') {   // 9.1: next view
        e.preventDefault(); e.stopPropagation();
        stepView(1);
      } else if (e.code === 'KeyC') {   // 9.1: Chief of Staff, open or closed
        e.preventDefault(); e.stopPropagation();
        if (chManual) chiefAct('close'); else chiefOpenHQ();
      } else if (e.code === 'KeyD') {
        e.preventDefault(); e.stopPropagation();
        flipTheme();
      } else if (e.code === 'Equal' || e.code === 'Minus') {
        e.preventDefault(); e.stopPropagation();
        zoom = Math.min(2, Math.max(0.6, Math.round((zoom + (e.code === 'Equal' ? 0.1 : -0.1)) * 10) / 10));
        try { localStorage.setItem('chf_mirror_zoom2', String(zoom)); } catch (x) {}
        scr.setZoom(zoom);
      }
    }, true);
    window.addEventListener('resize', () => scr.fit());

    try {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Leave screen mode', () => {
          try { sessionStorage.removeItem(MIRROR_KEY); } catch (x) {}
          location.reload();
        });
        GM_registerMenuCommand('Screen mode: next look', () => flipTheme(1));   // 8.9.3, 9.0.1
        GM_registerMenuCommand('Screen mode: previous look', () => flipTheme(-1));
        GM_registerMenuCommand('Screen mode: next view', () => stepView(1));   // 9.1
        GM_registerMenuCommand('Boot: open my 10 most recent chats', () => bootRun('menu'));   // 8.9
      }
    } catch (e) {}

    // ---------- 8.9: BOOT ----------
    // Opens your most recent chats as tabs behind HQ, skips any already open, and hands the floor to the
    // newest one, which says Switcheroo is up and opens the mic.
    const BOOT_N = 10;
    let booting = false;
    const hqSleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // your most recent chats, newest first: Claude's own list, else the sidebar's Recents
    async function recentChats(n) {
      const out = [], seen = new Set();
      const push = (uuid, name) => { if (uuid && !seen.has(uuid)) { seen.add(uuid); out.push({ uuid, name: name || '' }); } };
      const getJson = async (url) => { const r = await fetch(url, { credentials: 'include', headers: { accept: 'application/json' } }); return r.ok ? r.json() : null; };
      try {
        let org = (/(?:^|;\s*)lastActiveOrg=([0-9a-f-]{36})/.exec(document.cookie) || [])[1] || '';
        if (!org) {
          const orgs = await getJson('/api/organizations');
          const list = Array.isArray(orgs) ? orgs : [];
          const o = list.find((x) => x && Array.isArray(x.capabilities) && x.capabilities.includes('chat')) || list[0];
          org = (o && o.uuid) || '';
        }
        if (org) {
          let list = await getJson('/api/organizations/' + org + '/chat_conversations?limit=' + (n + 10));
          if (!list) list = await getJson('/api/organizations/' + org + '/chat_conversations');
          if (list && !Array.isArray(list)) list = list.data || list.conversations || list.chat_conversations || [];
          (list || []).filter((c) => c && c.uuid)
            .sort((a, b) => (Date.parse(b.updated_at || 0) || 0) - (Date.parse(a.updated_at || 0) || 0))
            .forEach((c) => push(c.uuid, c.name));
        }
      } catch (e) {}
      if (out.length < n) {
        document.querySelectorAll('a[href*="/chat/"]').forEach((a) => {
          if (a.closest('#chf-mirror')) return;
          const m = /\/chat\/([0-9a-f-]{36})/.exec(a.getAttribute('href') || '');
          if (m) push(m[1], (a.innerText || '').trim());
        });
      }
      return out.slice(0, n);
    }
    function bootPill(on) { try { const b = root.querySelector('.bar .bt'); if (b) b.classList.toggle('on', !!on); } catch (e) {} }
    async function bootRun(why) {
      if (booting) { scr.flash('Already booting'); return; }
      booting = true; bootPill(true);
      try {
        scr.flash('Boot: finding your ' + BOOT_N + ' most recent chats');
        send({ t: 'hello' });
        // chats already open report in first, so they aren't opened twice. After a restart Chrome may still be
        // bringing tabs back, so wait until the count holds still (up to 8 seconds)
        const recentP = recentChats(BOOT_N);
        let n0 = -1, still = 0;
        for (let i = 0; i < (why === 'launch' ? 32 : 12); i++) {
          await hqSleep(250);
          const n1 = tabs().length;
          still = n1 === n0 ? still + 1 : 0; n0 = n1;
          if (i >= 9 && still >= 6) break;
        }
        const recent = await recentP;
        if (!recent.length) { scr.flash("Boot couldn't find your recent chats. Open one and it lands here"); return; }
        const openPaths = new Set(tabs().map((e) => e.path));
        const fresh = recent.filter((c) => !openPaths.has('/chat/' + c.uuid));
        for (const c of fresh) {
          if (tabs().some((e) => e.path === '/chat/' + c.uuid)) continue;   // it just reported in
          const url = 'https://claude.ai/chat/' + c.uuid;
          try { GM_openInTab(url, { active: false, insert: true, setParent: true }); } catch (e) { try { window.open(url, '_blank', 'noopener'); } catch (x) {} }   // noopener: it mustn't inherit HQ
          await hqSleep(350);
        }
        const had = recent.length - fresh.length;
        scr.flash('Boot: opening ' + fresh.length + (fresh.length === 1 ? ' chat' : ' chats') + (had ? ', ' + had + ' already open' : ''));
        // the newest chat takes the floor once it reports in, unless you're already talking in one
        const f = lsGet('chf_sb_floor', null), cur = f && f.id ? reg.get(f.id) : null;
        if (why !== 'launch' && cur && cur.on && cur.armed) { scr.flash('Boot done. ' + (cur.name || 'Your chat') + ' keeps the floor'); return; }
        const path = '/chat/' + recent[0].uuid;
        let e = null;
        for (let i = 0; i < 100 && !(e = tabs().find((x) => x.path === path && x.on)); i++) await hqSleep(300);
        if (!e) { scr.flash('Boot done. Click a chat to start talking'); return; }
        await hqSleep(1200);   // let it finish drawing and sort out its sound
        e = reg.get(e.id) || e;
        try { localStorage.setItem('chf_sb_floor', JSON.stringify({ id: e.id, ts: Date.now() })); } catch (x) {}
        send({ t: 'floor', to: e.id, from: 'mirror', why: 'boot', front: false, token: Math.random().toString(36).slice(2) });
        floorId = e.id;
        scr.paint(model());
        const nm = e.name || 'your newest chat';
        scr.flash(e.armed ? 'Boot done. ' + nm + ' has the floor. Go ahead' : 'Boot done. Click once in ' + nm + ' so it can talk');
      } finally { booting = false; bootPill(false); }
    }
    // an older HQ steps aside for the one that just booted
    function stepAside() {
      try { sessionStorage.removeItem(MIRROR_KEY); } catch (x) {}
      try { window.close(); } catch (x) {}
      setTimeout(() => location.reload(), 400);
    }
    let bootAt = 0;
    try { bootAt = +(sessionStorage.getItem(BOOT_KEY) || 0); sessionStorage.removeItem(BOOT_KEY); } catch (x) {}
    if (bootAt && Date.now() - bootAt < 120000) { send({ t: 'hq-boot', id: HQ_ID }); setTimeout(() => bootRun('launch'), 1500); }

    mount();
    applyTheme();
    smFonts(() => { scr.fit(); });
    send({ t: 'hello' });
    send({ t: 'mirror-hello' });
    setInterval(() => scr.tick(), 1000);
    setInterval(() => {
      mount();                                   // the app can rebuild the page under us
      scr.paint(model());
      if (Date.now() - lastAt > 20000) { waiting(); send({ t: 'mirror-hello' }); send({ t: 'hello' }); }
    }, 2000);
  }

  const PAUSE_MS = 3500;
  // 8.1.1: Switcheroo updates itself from GitHub; "update Switcheroo" checks right away
  const SW_URL = 'https://raw.githubusercontent.com/a-mandel/switcheroo/main/switcheroo.user.js';
  const SW_VER = (() => { try { return GM_info.script.version; } catch (e) { return '8.1.1'; } })();
  const verNewer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0; } return false; };
  function latestVersion() {
    return new Promise((resolve) => {
      try {
        GM_xmlhttpRequest({ method: 'GET', url: SW_URL + '?t=' + Date.now(), timeout: 15000,
          onload: (r) => resolve(r.status === 200 ? ((/@version\s+([\d.]+)/.exec(r.responseText || '') || [])[1] || '') : ''),
          onerror: () => resolve(''), ontimeout: () => resolve('') });
      } catch (e) { resolve(''); }
    });
  }
  const YELLOW_EVERY = 3 * 60 * 1000;   // "name needs you" repeats
  const RED_EVERY = 60 * 1000;          // approval or urgent repeats
  const APPROVE_MS = 30000;             // squeeze window after a request is read (6.8: 30s)
  const VOICE_APPROVE_MS = 10 * 60000;  // 6.8: "allow" by voice while the request you heard still waits
  const SETTLE_MS = 1500;               // Claude must stay stopped this long before a chat turns yellow
  const GROW_MS = 2500;                 // a reply that grew this recently counts as still streaming
  const STALE_MS = 150000;              // a tab that stops reporting drops off the board

  const STORE = 'chf_config_v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } };
  const save = (c) => { try { localStorage.setItem(STORE, JSON.stringify(c)); } catch (e) {} };
  let cfg = Object.assign({ autoRead: true, autoSend: true, autoListen: true }, load());
  if (!cfg.v64) { cfg.autoListen = true; cfg.v64 = true; save(cfg); }   // 6.4: your turn mode on, once
  if (!cfg.v75) { cfg.readCap = false; cfg.v75 = true; save(cfg); }     // 7.5: replies read start to finish
  if (!cfg.autoListen && !cfg.listenOff) { cfg.autoListen = true; save(cfg); }   // 7.8: your turn mode comes on with hands free, every load (8.0: unless the panel turned it off)

  // per tab master switch, kept in sessionStorage so it survives a reload of this tab only
  const TAB_KEY = 'chf_tab_off';
  let tabOff = false;
  try { tabOff = sessionStorage.getItem(TAB_KEY) === '1'; } catch (e) {}

  const GUESSES = {
    mic:   ['dictate'],                 // 'Microphone' and 'Use voice mode' are voice mode, never click them
    stop:  ['finish dictation'],
    cancel: ['cancel dictation'],
    send:  ['send message'],
    speak: ['read aloud', 'listen', 'play audio', 'speak', 'read'],
    pause:  ['pause'],   // exact labels, matched below
    resume: ['resume'],
    halt:  ['stop response', 'stop generating', 'stop claude']
  };

  // ---------- helpers ----------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const labelOf = (b) => ((b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '')).toLowerCase().trim();
  const textOf = (b) => (b.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const wordsOf = (b) => (textOf(b) || labelOf(b)).replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
  const sigOf = (b) => ({ label: b.getAttribute('aria-label') || '', testid: b.getAttribute('data-testid') || '', text: wordsOf(b).slice(0, 40) });
  const sigMatch = (b, s) =>
    (s.testid && b.getAttribute('data-testid') === s.testid) ||
    (s.label && (b.getAttribute('aria-label') || '') === s.label) ||
    (!s.testid && !s.label && s.text && wordsOf(b) === s.text);

  const OURS = '#chf-pill, #chf-agenda, #chf-board';
  const ours = (el) => !!(el && el.closest && el.closest(OURS));
  function buttons(kind) {
    // Claude's Pause and Resume sit in a hover-only bar, so don't require them to be visible
    const hidden = kind === 'pause' || kind === 'resume';
    const all = [...document.querySelectorAll('button, [role="button"]')]
      .filter((b) => !ours(b) && (hidden || visible(b)));
    if (cfg[kind]) {
      const taught = all.filter((b) => sigMatch(b, cfg[kind]));
      if (taught.length) return taught;
    }
    if (hidden) return all.filter((b) => GUESSES[kind].includes((b.getAttribute('aria-label') || '').toLowerCase()));
    // 5.5: Claude's own tag for a button beats any label guess
    if (TESTIDS[kind]) {
      const tagged = all.filter((b) => TESTIDS[kind].includes(b.getAttribute('data-testid') || '') &&
        !/^(pause|resume|stop)\b/i.test((b.getAttribute('aria-label') || '').trim()));   // 5.6: not while it's playing
      if (tagged.length || all.some((b) => TESTIDS[kind].includes(b.getAttribute('data-testid') || ''))) return tagged;
    }
    // 5.5: skip screen reader summaries of messages (they quote your words) and long labels
    const fair = all.filter((b) => {
      const l = labelOf(b);
      return l && l.length <= 40 && !l.startsWith('show message actions') && !String(b.className || '').includes('sr-only');
    });
    // 5.5: tool chips say things like "memory: read", so Read aloud has to START with its word
    if (kind === 'speak') return fair.filter((b) => GUESSES.speak.some((g) => labelOf(b).startsWith(g)));
    return fair.filter((b) => GUESSES[kind].some((g) => labelOf(b).includes(g)));
  }
  const TESTIDS = { speak: ['action-bar-read-aloud'] };
  const last = (arr) => arr[arr.length - 1];
  // 5.9: trouble log, kept in this browser only (localStorage chf_log)
  function dlog(ev, extra) {
    try {
      const a = JSON.parse(localStorage.getItem('chf_log') || '[]');
      let who = ''; try { who = ME; } catch (x) {}
      let fl = ''; try { fl = isFloor() ? 'F' : '-'; } catch (x) {}
      a.push([new Date().toTimeString().slice(0, 8), who, fl, (document.title || '').slice(0, 24), ev, extra === undefined ? '' : String(extra).slice(0, 90)]);
      while (a.length > 80) a.shift();
      localStorage.setItem('chf_log', JSON.stringify(a));
    } catch (e) {}
  }
  const composer = () =>
    document.querySelector('[data-testid="chat-input"]') ||
    document.querySelector('div.ProseMirror[contenteditable="true"]');
  const composerText = () => {
    const c = composer();
    return c ? c.innerText.trim() : '';
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
      background: '#222', color: '#fff', padding: '8px 14px', borderRadius: '8px',
      font: '13px system-ui', zIndex: 999999, opacity: '0.92', pointerEvents: 'none',
      maxWidth: '80vw', textAlign: 'center'
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), Math.min(6000, 1800 + msg.length * 25));
  }

  // ---------- teach mode ----------
  const TEACH_NAMES = { mic: 'mic', stop: 'finish', speak: 'speaker', allow: 'Allow once', halt: 'Stop response' };
  let teaching = null;
  document.addEventListener('click', (e) => {
    if (!teaching) return;
    const b = e.target.closest('button, [role="button"]');
    if (!b || ours(b)) return;
    // 4.5: never learn the attach, model or send button as the mic
    const said = (labelOf(b) + ' ' + textOf(b)).trim();
    if (teaching === 'mic' && (/\b(add|attach|upload|file|photo|plus|tool|menu|model|send|voice mode)\b/.test(said) || /^\+$/.test(textOf(b)))) {
      e.preventDefault(); e.stopPropagation();
      toast("That's not the mic (" + (said || 'unnamed button') + '). Press Option Shift 1 and click the mic.');
      teaching = null;
      return;
    }
    cfg[teaching] = sigOf(b);
    save(cfg);
    toast('Learned the ' + TEACH_NAMES[teaching] + ' button');
    if (teaching === 'halt') { e.preventDefault(); e.stopPropagation(); } // teaching Stop never stops Claude
    teaching = null;
  }, true);

  // ---------- agenda review player ----------
  const ag = {
    audio: null, url: '', take: '', sections: [], notes: 0,
    noteOpen: false, ended: false, loadedKey: '', fellBack: false
  };
  const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const agActive = () => !!ag.audio && !ag.ended;
  const agPlaying = () => !!ag.audio && !ag.audio.paused && !ag.audio.ended;

  function sectionAt(t) {
    const a = ag.audio;
    if (!a || !ag.sections.length || !isFinite(a.duration) || a.duration <= 0) return '';
    const total = ag.sections.reduce((s, x) => s + x.w, 0);
    let acc = 0;
    const frac = t / a.duration;
    for (const s of ag.sections) {
      acc += s.w / total;
      if (frac <= acc) return s.label;
    }
    return ag.sections[ag.sections.length - 1].label;
  }

  // parse a take out of a reply: "AGENDA TAKE 2: <url>" and an optional "SECTIONS: Label 30 | Label 40"
  function parseTake(msg) {
    const text = msg.innerText || '';
    const m = text.match(/AGENDA TAKE\s*(\d+)?\s*:\s*(https?:\/\/\S+)/i);
    if (!m) return null;
    let url = m[2];
    // prefer the real href if the link text was shortened by the renderer
    const a = [...msg.querySelectorAll('a[href]')].find((x) => /googleapis|dropbox|\.mp3|\.m4a|\.mp4/i.test(x.href));
    if (a) url = a.href;
    const sm = text.match(/SECTIONS\s*:\s*([^\n]+)/i);
    const sections = sm ? sm[1].split('|').map((p) => p.trim()).map((p) => {
      const k = p.match(/^(.*?)\s+(\d+)$/);
      return k ? { label: k[1].trim(), w: +k[2] } : null;
    }).filter(Boolean) : [];
    return { take: m[1] || '', url, sections };
  }

  function gmBlob(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error('no GM_xmlhttpRequest'));
      GM_xmlhttpRequest({
        method: 'GET', url, responseType: 'blob',
        onload: (r) => (r.status >= 200 && r.status < 300 ? resolve(r.response) : reject(new Error('HTTP ' + r.status))),
        onerror: () => reject(new Error('network')), ontimeout: () => reject(new Error('timeout'))
      });
    });
  }

  function loadTake(t) {
    if (ag.audio) { try { ag.audio.pause(); } catch (e) {} }
    const a = new Audio();
    a.preload = 'auto';
    ag.audio = a; ag.url = t.url; ag.take = t.take; ag.sections = t.sections;
    ag.notes = 0; ag.noteOpen = false; ag.ended = false; ag.fellBack = false;
    a.addEventListener('error', async () => {
      if (ag.audio !== a || ag.fellBack) return;
      ag.fellBack = true; // claude.ai may block outside audio, so fetch the file ourselves and play it locally
      try {
        const blob = await gmBlob(t.url);
        if (ag.audio !== a) return;
        a.src = URL.createObjectURL(blob);
        a.load();
        paintAgenda();
      } catch (e) {
        toast('Could not load the agenda audio (' + e.message + ')');
      }
    });
    a.addEventListener('ended', onTakeEnded);
    ['play', 'pause', 'timeupdate', 'loadedmetadata'].forEach((ev) => a.addEventListener(ev, paintAgenda));
    a.src = t.url;
    showAgenda();
    paintAgenda();
    toast('Agenda take ' + (t.take || '') + ' loaded. Squeeze or F8 to play.');
  }

  async function onTakeEnded() {
    ag.ended = true;
    paintAgenda();
    if (ag.noteOpen) return; // the note in progress will send when it finishes
    if (ag.notes > 0) {
      toast('Take done, sending your notes');
      await sendWhenReady();
    } else {
      toast('Take done, no notes');
    }
  }

  function agPlay() {
    if (!ag.audio) return;
    if (ag.audio.ended) { ag.audio.currentTime = 0; ag.ended = false; }
    ag.audio.play().catch((e) => toast('Play blocked: ' + e.message));
    hqTakeBack();   // 9.5
    try { navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
  }
  function agPause() { if (ag.audio) ag.audio.pause(); }

  function caretToEnd(c) {
    c.focus();
    const sel = window.getSelection();
    const r = document.createRange();
    r.selectNodeContents(c);
    r.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  function insertIntoComposer(text) {
    const c = composer();
    if (!c) return false;
    caretToEnd(c);
    return document.execCommand('insertText', false, text);
  }

  // squeeze while the take plays: pause it, stamp the note, open dictation
  async function agStartNote() {
    const t = ag.audio.currentTime;
    agPause();
    ag.noteOpen = true;
    const head = ag.notes === 0 ? 'Agenda notes, take ' + (ag.take || '?') + ':\n' : '\n';
    const sec = sectionAt(t);
    insertIntoComposer(head + '[' + (sec ? sec + ', ' : '') + fmt(t) + '] ');
    ag.notes += 1;
    paintAgenda();
    await sleep(150);
    const mic = last(buttons('mic'));
    if (!mic) { toast('Mic not found. Press Option Shift 1, then click the mic.'); return; }
    armListener();   // 8.7.1
    mic.click();
    toast('Note');
  }

  async function agFinishNote() {
    ag.noteOpen = false;
    await sleep(1200); // let the note land in the box
    if (ag.ended) {
      toast('Take done, sending your notes');
      await sendWhenReady();
      return;
    }
    toast('Note saved, resuming');
    agPlay();
  }

  // player bar above the pill
  const bar = document.createElement('div');
  bar.id = 'chf-agenda';
  Object.assign(bar.style, {
    position: 'fixed', zIndex: 999998, display: 'none', alignItems: 'center', gap: '8px',
    font: '600 12px system-ui, -apple-system, sans-serif', color: '#fff', background: '#1f2a26',
    borderRadius: '999px', padding: '5px 8px 5px 5px', boxShadow: '0 1px 4px rgba(0,0,0,.3)', opacity: '0.96',
    maxWidth: '520px'
  });
  bar.innerHTML =
    '<button id="chf-ag-play" type="button" title="Play or pause (Option Shift P)" style="all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;background:#DE6A2D;display:flex;align-items:center;justify-content:center;font-size:11px">&#9654;&#xFE0E;</button>' +
    '<span id="chf-ag-label" style="white-space:nowrap">Agenda</span>' +
    '<span id="chf-ag-track" title="Jump" style="position:relative;display:block;width:150px;height:6px;border-radius:3px;background:#46524d;cursor:pointer"><i id="chf-ag-fill" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:3px;background:#DE6A2D"></i></span>' +
    '<span id="chf-ag-time" style="font-weight:500;white-space:nowrap;opacity:.85">0:00</span>' +
    '<span id="chf-ag-sec" style="font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;opacity:.85"></span>' +
    '<span id="chf-ag-notes" style="font-weight:500;white-space:nowrap;opacity:.85"></span>' +
    '<button id="chf-ag-close" type="button" title="Close (Option Shift X)" style="all:unset;cursor:pointer;padding:0 4px;opacity:.7">&#x2715;</button>';
  bar.querySelector('#chf-ag-play').addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    if (agPlaying()) agPause(); else agPlay();
  });
  bar.querySelector('#chf-ag-close').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeAgenda(); });
  bar.querySelector('#chf-ag-track').addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    const a = ag.audio; if (!a || !isFinite(a.duration)) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration;
    if (a.currentTime < a.duration) ag.ended = false;
    paintAgenda();
  });

  function showAgenda() { if (!document.body.contains(bar)) document.body.appendChild(bar); bar.style.display = 'flex'; placeBars(); }
  function closeAgenda() {
    if (ag.audio) { try { ag.audio.pause(); } catch (e) {} }
    ag.audio = null; ag.ended = false; ag.noteOpen = false;
    bar.style.display = 'none';
    toast('Agenda player closed');
  }
  function paintAgenda() {
    const a = ag.audio; if (!a) return;
    const d = isFinite(a.duration) ? a.duration : 0;
    bar.querySelector('#chf-ag-play').innerHTML = agPlaying() ? '&#10074;&#10074;' : '&#9654;&#xFE0E;';
    bar.querySelector('#chf-ag-label').textContent = 'Take ' + (ag.take || '');
    bar.querySelector('#chf-ag-fill').style.width = (d ? (a.currentTime / d) * 100 : 0) + '%';
    bar.querySelector('#chf-ag-time').textContent = fmt(a.currentTime) + (d ? ' / ' + fmt(d) : '');
    bar.querySelector('#chf-ag-sec').textContent = sectionAt(a.currentTime);
    bar.querySelector('#chf-ag-notes').textContent = ag.notes ? ag.notes + (ag.notes === 1 ? ' note' : ' notes') : '';
  }

  // ---------- voice and chimes (2.5) ----------
  // Only the tab holding the floor ever chimes or talks, so tabs never talk over each other.
  let voice = null;
  function pickVoice() {
    if (voice) return voice;
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    voice = vs.find((v) => v.localService && /^en[-_]US/i.test(v.lang) && /samantha|ava|allison|susan|zoe|evan|nathan/i.test(v.name)) ||
      vs.find((v) => v.localService && /^en/i.test(v.lang)) || null;
    return voice;
  }
  try { speechSynthesis.addEventListener('voiceschanged', () => { voice = null; }); } catch (e) {}

  let speaking = 0;
  let hushGen = 0;
  let speakChain = Promise.resolve();
  function say(text) {
    const job = speakChain.then(() => speakNow(text));
    speakChain = job.catch(() => {});
    job.then((ok) => { if (ok) micAfterLine(); }).catch(() => {});   // 6.4: then the mic opens
    return job;
  }
  // resolves true only when the whole line was spoken
  async function speakNow(text) {
    toast(text);
    if (held) { dlog('line held', text); return false; }   // 8.0: on hold, lines show but aren't spoken
    if (!ownsFloor()) { dlog('line skipped, not the floor', text); return false; }   // 6.0
    if (elReady()) {                      // 5.4: the Switchboard talks in the ElevenLabs voice
      const r = await speakEl(text);
      if (r !== null) return r;           // null means ElevenLabs couldn't make it
    }
    return speakMac(text);
  }
  // 5.4: one Switchboard line in ElevenLabs; lines like "Alder needs you" are kept for reuse
  const elLines = new Map();
  let lineAudio = null;
  async function speakEl(text) {
    const gen = hushGen;
    let blob = elLines.get(text);
    if (!blob) {
      try { blob = await elFetch(text); } catch (e) { elFailed(e); return null; }
      if (text.length <= 160) { if (elLines.size > 80) elLines.clear(); elLines.set(text, blob); }
    }
    if (gen !== hushGen) return false;
    return new Promise((resolve) => {
      const a = rateOn(new Audio(URL.createObjectURL(blob)));
      lineAudio = a;
      let done = false;
      speaking += 1;
      readHold = Date.now() + 1500; try { syncDuck(); } catch (e) {}
      const finish = (ok) => {
        if (done) return;
        done = true;
        speaking = Math.max(0, speaking - 1);
        if (lineAudio === a) lineAudio = null;
        resolve(ok);
      };
      a.onended = () => finish(gen === hushGen);
      a.onerror = () => finish(false);
      a.onpause = () => { if (!a.ended) finish(false); };
      a.play().catch(() => finish(false));
      hqTakeBack();   // 9.5
      setTimeout(() => { if (!done) { try { a.pause(); } catch (x) {} finish(false); } }, 45000);
    });
  }
  function speakMac(text) {
    return new Promise((resolve) => {
      const ss = window.speechSynthesis;
      if (!ss || typeof SpeechSynthesisUtterance === 'undefined') return resolve(false);
      if (!ss.speaking) { try { ss.cancel(); } catch (e) {} } // clears a stuck queue
      const gen = hushGen;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = Math.min(2, 1.05 * voiceSpeed()); u.lang = 'en-US';
      const v = pickVoice(); if (v) u.voice = v;
      let started = false, done = false;
      speaking += 1;
      readHold = Date.now() + 1500; try { syncDuck(); } catch (e) {}
      const finish = (ok) => { if (done) return; done = true; speaking = Math.max(0, speaking - 1); resolve(ok); };
      u.onstart = () => { started = true; };
      u.onend = () => finish(gen === hushGen);
      u.onerror = () => finish(false);
      try { ss.speak(u); } catch (e) { finish(false); return; }
      setTimeout(() => finish(started && gen === hushGen), 3000 + text.split(/\s+/).length * 480);
    });
  }
  function hush() {
    hushGen += 1;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (lineAudio) { try { lineAudio.pause(); } catch (e) {} }   // 5.4: an ElevenLabs line too
  }

  let actx = null;
  function chime(kind) {
    if (!ownsFloor() || held) return Promise.resolve();   // 6.0: only the floor tab makes sound (8.0: and never on hold)
    readHold = Date.now() + 2500; try { syncDuck(); } catch (e) {}
    return new Promise((resolve) => {
      try {
        if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume().catch(() => {});
        const red = kind === 'red';
        // yellow: soft two note sine. red: three quick bright pulses.
        const notes = red
          ? [[1318.5, 0, 0.09], [1318.5, 0.14, 0.09], [1760, 0.28, 0.18]]
          : [[659.3, 0, 0.4], [987.8, 0.2, 0.6]];
        const t0 = actx.currentTime + 0.03;
        for (const [f, at, dur] of notes) {
          const o = actx.createOscillator();
          const g = actx.createGain();
          o.type = red ? 'square' : 'sine';
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t0 + at);
          g.gain.exponentialRampToValueAtTime(red ? 0.07 : 0.2, t0 + at + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
          o.connect(g); g.connect(actx.destination);
          o.start(t0 + at); o.stop(t0 + at + dur + 0.05);
        }
        setTimeout(resolve, Math.max(...notes.map((n) => n[1] + n[2])) * 1000 + 120);
      } catch (e) { resolve(); }
    });
  }

  // ---------- mic live sounds (7.0) ----------
  // Twenty short cues, all drawn live with Web Audio. Kept between about 300 and 3500 Hz, where
  // AirPods still play clearly while the mic is on (headset mode drops the highs and the deep lows).
  function chfCues() {
    const env = (g, t, a, peak, d) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    };
    // one note: o = { type, v, a, to, glide, lp }
    function tone(ctx, out, t, f, dur, o) {
      o = o || {};
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(f, t);
      if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur));
      env(g, t, o.a || 0.004, o.v || 0.4, dur);
      let node = osc;
      if (o.lp) {
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.setValueAtTime(o.lp, t); lp.Q.value = o.q || 0.7;
        if (o.lpTo) lp.frequency.exponentialRampToValueAtTime(o.lpTo, t + (o.lpGlide || dur));
        node.connect(lp); node = lp;
      }
      node.connect(g); g.connect(out);
      osc.start(t); osc.stop(t + (o.a || 0.004) + dur + 0.05);
    }
    // a burst of filtered noise: o = { f, q, v, a, type }
    let noiseBuf = null;
    function noise(ctx, out, t, dur, o) {
      o = o || {};
      if (!noiseBuf || noiseBuf.sampleRate !== ctx.sampleRate) {
        noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        let seed = 7;
        for (let i = 0; i < d.length; i++) { seed = (seed * 16807) % 2147483647; d[i] = seed / 1073741823.5 - 1; }
      }
      const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = noiseBuf;
      bp.type = o.type || 'bandpass'; bp.frequency.value = o.f || 1000; bp.Q.value = o.q || 1;
      env(g, t, o.a || 0.002, o.v || 0.5, dur);
      src.connect(bp); bp.connect(g); g.connect(out);
      src.start(t); src.stop(t + dur + 0.05);
    }
    // 7.0: each cue's level, measured so they all land about as loud as each other
    const LEVEL = [1.35, 1.04, 1.48, 0.84, 0.75, 0.99, 3.13, 3.76, 1.6, 1.45, 1.62, 1.01, 0.8, 1.49, 0.98, 2.34, 0.93, 2.09, 1.72, 1.53, 0.55];   // 8.9.2: 21, Long bell
    const cues = [
      { name: 'Tick', note: 'The old tick, louder.', len: 0.2,
        play: (c, o, t) => tone(c, o, t, 1046.5, 0.14, { v: 0.5, a: 0.005 }) },
      { name: 'Two tone', note: 'Low, then high. Clear and friendly.', len: 0.4,
        play: (c, o, t) => { tone(c, o, t, 659.3, 0.14, { v: 0.4 }); tone(c, o, t + 0.12, 987.8, 0.22, { v: 0.4 }); } },
      { name: 'Chirp', note: 'A quick rising whistle.', len: 0.25,
        play: (c, o, t) => tone(c, o, t, 520, 0.16, { v: 0.4, to: 1700, glide: 0.12 }) },
      { name: 'Marimba', note: 'One warm wooden note.', len: 0.4,
        play: (c, o, t) => { tone(c, o, t, 587.3, 0.32, { v: 0.5, a: 0.002 }); tone(c, o, t, 2349, 0.06, { v: 0.18, a: 0.002 }); } },
      { name: 'Desk bell', note: 'A small bell, rings a moment.', len: 0.9,
        play: (c, o, t) => { tone(c, o, t, 880, 0.8, { v: 0.35, a: 0.002 }); tone(c, o, t, 2429, 0.45, { v: 0.14, a: 0.002 }); tone(c, o, t, 3520, 0.2, { v: 0.06, a: 0.002 }); } },
      { name: 'Arpeggio', note: 'Three quick notes up, C E G.', len: 0.45,
        play: (c, o, t) => [523.3, 659.3, 784].forEach((f, i) => tone(c, o, t + i * 0.075, f, i === 2 ? 0.25 : 0.1, { type: 'triangle', v: 0.45 })) },
      { name: 'Radio beep', note: 'A walkie-talkie beep.', len: 0.25,
        play: (c, o, t) => tone(c, o, t, 1000, 0.15, { type: 'square', v: 0.16, a: 0.003, lp: 3200 }) },
      { name: 'Double beep', note: 'Two short beeps.', len: 0.3,
        play: (c, o, t) => { tone(c, o, t, 1200, 0.06, { type: 'square', v: 0.14, lp: 3400 }); tone(c, o, t + 0.11, 1200, 0.07, { type: 'square', v: 0.14, lp: 3400 }); } },
      { name: 'Wood block', note: 'A hollow knock.', len: 0.15,
        play: (c, o, t) => { tone(c, o, t, 820, 0.07, { v: 0.55, a: 0.001, to: 760 }); noise(c, o, t, 0.03, { f: 1400, q: 6, v: 0.5, a: 0.001 }); } },
      { name: 'Water drop', note: 'A single bloop.', len: 0.2,
        play: (c, o, t) => tone(c, o, t, 1500, 0.12, { v: 0.5, to: 420, glide: 0.09, a: 0.003 }) },
      { name: 'Bass pluck', note: 'A plucked bass note, open A.', len: 0.55,
        play: (c, o, t) => { tone(c, o, t, 110, 0.45, { type: 'sawtooth', v: 0.5, a: 0.003, lp: 2400, lpTo: 300, lpGlide: 0.3, q: 4 }); tone(c, o, t, 440, 0.2, { v: 0.2, a: 0.003 }); } },
      { name: 'Sonar', note: 'One ping with a short echo.', len: 0.75,
        play: (c, o, t) => { tone(c, o, t, 1175, 0.35, { v: 0.4, a: 0.003 }); tone(c, o, t + 0.2, 1175, 0.3, { v: 0.13, a: 0.003 }); } },
      { name: 'Kalimba', note: 'Two thumb piano notes.', len: 0.5,
        play: (c, o, t) => { [784, 1046.5].forEach((f, i) => { tone(c, o, t + i * 0.11, f, 0.3, { v: 0.4, a: 0.002 }); tone(c, o, t + i * 0.11, f * 3.1, 0.05, { v: 0.12, a: 0.002 }); }); } },
      { name: 'Pop', note: 'A cork pop.', len: 0.12,
        play: (c, o, t) => { tone(c, o, t, 420, 0.05, { v: 0.6, a: 0.001, to: 180, glide: 0.04 }); noise(c, o, t, 0.02, { f: 900, q: 1.5, v: 0.5, a: 0.001 }); } },
      { name: 'Glass', note: 'A tap on a wine glass.', len: 0.65,
        play: (c, o, t) => { tone(c, o, t, 1760, 0.55, { v: 0.3, a: 0.002 }); tone(c, o, t, 2637, 0.35, { v: 0.14, a: 0.002 }); } },
      { name: 'Coin', note: 'An 8 bit coin.', len: 0.4,
        play: (c, o, t) => { tone(c, o, t, 987.8, 0.07, { type: 'square', v: 0.14, lp: 3500 }); tone(c, o, t + 0.07, 1318.5, 0.28, { type: 'square', v: 0.14, lp: 3500 }); } },
      { name: 'Open fifth', note: 'Two notes at once, clean and open.', len: 0.45,
        play: (c, o, t) => { tone(c, o, t, 523.3, 0.36, { v: 0.3, a: 0.01 }); tone(c, o, t, 784, 0.36, { v: 0.3, a: 0.01 }); } },
      { name: 'Clave', note: 'Two dry clicks.', len: 0.2,
        play: (c, o, t) => { [0, 0.1].forEach((d) => { tone(c, o, t + d, 2500, 0.035, { v: 0.4, a: 0.001 }); noise(c, o, t + d, 0.02, { f: 2600, q: 8, v: 0.6, a: 0.001 }); }); } },
      { name: 'Swell', note: 'A soft synth rise.', len: 0.4,
        play: (c, o, t) => { tone(c, o, t, 440, 0.18, { type: 'sawtooth', v: 0.3, a: 0.12, lp: 400, lpTo: 3000, lpGlide: 0.15 }); tone(c, o, t, 660, 0.18, { type: 'sawtooth', v: 0.18, a: 0.12, lp: 400, lpTo: 3000, lpGlide: 0.15 }); } },
      { name: 'Roger', note: 'The radio over chirp, three steps up.', len: 0.3,
        play: (c, o, t) => [1300, 1650, 2050].forEach((f, i) => tone(c, o, t + i * 0.055, f, i === 2 ? 0.1 : 0.045, { v: 0.35, a: 0.002 })) },
      // 8.9.2: the AirPods swallow the first half second or so while they switch to the mic, so this one
      // strikes three times and rings about three seconds: whatever gets clipped, you still hear the bell
      { name: 'Long bell', note: 'A bell struck three times, rings about three seconds.', len: 3.3,
        play: (c, o, t) => [0, 0.6, 1.2].forEach((d) => {
          tone(c, o, t + d, 880, 2.0, { v: 0.35, a: 0.002 });
          tone(c, o, t + d, 1760, 0.9, { v: 0.1, a: 0.002 });
          tone(c, o, t + d, 2429, 0.6, { v: 0.12, a: 0.002 });
        }) }
    ];
    // play(ctx, out, t) goes through a level stage so every cue matches
    return cues.map((c, i) => Object.assign({}, c, {
      play: (ctx, out, t) => { const g = ctx.createGain(); g.gain.value = LEVEL[i]; g.connect(out); c.play(ctx, g, t); }
    }));
  }
  const CUES = chfCues();
  // 9.7: sound 22, Voices. A woman's voice says one of these when the mic opens, a different line each time.
  // Each line is made once through your ElevenLabs key, kept in this browser, and plays instantly after that.
  const VC_LINES = ['Hey baby.', 'Okay.', 'Just a minute.', 'Yes?', 'Say something.', 'Talk to me.', "I'm listening.",
    'Go ahead.', 'Mm hm?', "What's up?", 'Go for it.', "I'm here.", 'Tell me.', 'Ready.', 'What do you need?', 'Hey you.',
    'Shoot.', 'Lay it on me.', 'Yeah?', 'Hi there.', "I'm all ears.", "What's on your mind?", 'Hey.', 'Go on.'];
  const VC = { bufs: {}, last: '', warming: false, db: null };
  const VC_KEY = (i) => i + '|' + VC_LINES[i];
  const vcVoice = (i) => (i % 2 ? EL_BUILTIN_VOICE : EL_DEFAULT_VOICE);   // Annika and Jessica take turns, so no one voice owns it
  CUES.push({ name: 'Voices', note: 'A spoken line, a different one each time the mic opens.', len: 1.3, voices: true, play() {} });
  const CUE_VOLS = [0.5, 0.7, 1, 1.4, 2];
  const cueNum = () => (Number.isInteger(cfg.micSound) && cfg.micSound >= 1 && cfg.micSound <= CUES.length ? cfg.micSound : 2);
  const cueVol = () => (CUE_VOLS.includes(cfg.cueVol) ? cfg.cueVol : 1);
  // 8.9.2: André's mic bell kept getting cut off, so the long bell replaces whatever was picked, once.
  // "Mic sound" still steps through all of them afterwards and the choice sticks.
  if (!cfg.longBell892) { cfg.longBell892 = true; cfg.micSound = 21; try { save(cfg); } catch (e) {} }
  function vcDb() {
    if (VC.db) return VC.db;
    VC.db = new Promise((res, rej) => {
      try {
        const r = indexedDB.open('chf_voicecues', 1);
        r.onupgradeneeded = () => { try { r.result.createObjectStore('clips'); } catch (e) {} };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
    VC.db.catch(() => { VC.db = null; });
    return VC.db;
  }
  async function vcStore(mode, key, blob) {
    const db = await vcDb();
    return new Promise((res) => {
      try {
        const tx = db.transaction('clips', mode), st = tx.objectStore('clips');
        const r = mode === 'readwrite' ? st.put(blob, key) : st.get(key);
        r.onsuccess = () => res(r.result || null); r.onerror = () => res(null);
      } catch (e) { res(null); }
    });
  }
  async function vcDecode(key, blob) {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      VC.bufs[key] = await actx.decodeAudioData(await blob.arrayBuffer());
    } catch (e) {}
  }
  // load what this browser already has, and make the missing lines, one tab at a time
  async function vcWarm() {
    if (VC.warming) return;
    VC.warming = true;
    try {
      const missing = [];
      for (let i = 0; i < VC_LINES.length; i++) {
        const k = VC_KEY(i);
        if (VC.bufs[k]) continue;
        const b = await vcStore('readonly', k);
        if (b) await vcDecode(k, b); else missing.push(i);
      }
      if (!missing.length || !elKey() || typeof GM_xmlhttpRequest !== 'function') return;
      let lock = 0;
      try { lock = +localStorage.getItem('chf_vc_lock') || 0; } catch (e) {}
      if (Date.now() - lock < 90000) return;   // another tab is making them
      try { localStorage.setItem('chf_vc_lock', String(Date.now())); } catch (e) {}
      dlog('making voice cues', missing.length + ' lines');
      for (const i of missing) {
        const k = VC_KEY(i);
        let blob = null;
        try { blob = await elRequest(VC_LINES[i], vcVoice(i), elKey(), false, 'eleven_multilingual_v2'); }
        catch (e) {
          if (vcVoice(i) !== EL_BUILTIN_VOICE) { try { blob = await elRequest(VC_LINES[i], EL_BUILTIN_VOICE, elKey(), false, 'eleven_multilingual_v2'); } catch (x) {} }
        }
        if (!blob) continue;
        await vcStore('readwrite', k, blob);
        await vcDecode(k, blob);
        try { localStorage.setItem('chf_vc_lock', String(Date.now())); } catch (e) {}
      }
      try { localStorage.removeItem('chf_vc_lock'); } catch (e) {}
    } catch (e) { dlog('voice cues failed', String((e && e.message) || e)); }
    finally { VC.warming = false; }
  }
  function playVoiceCue(g) {
    const ready = Object.keys(VC.bufs);
    if (!ready.length) { vcWarm(); CUES[2].play(actx, g, actx.currentTime + 0.03); return; }   // not made yet: Chirp stands in
    const pool = ready.length > 1 ? ready.filter((k) => k !== VC.last) : ready;
    const k = pool[Math.floor(Math.random() * pool.length)];
    VC.last = k;
    const src = actx.createBufferSource();
    src.buffer = VC.bufs[k];
    src.connect(g);
    src.start(actx.currentTime + 0.03);
    if (ready.length < VC_LINES.length) vcWarm();
  }
  function playCue(n) {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume().catch(() => {});
      const g = actx.createGain();
      g.gain.value = cueVol();
      g.connect(actx.destination);
      const c = CUES[(n || cueNum()) - 1];
      if (c.voices) playVoiceCue(g); else c.play(actx, g, actx.currentTime + 0.03);
    } catch (e) {}
  }
  setTimeout(() => { if (CUES[cueNum() - 1].voices) vcWarm(); }, 8000);
  // 2.9: the cue to start talking. 7.0: your pick of twenty
  function blip() { playCue(); }
  function setCue(n) {
    n = ((n - 1 + CUES.length) % CUES.length) + 1;
    cfg.micSound = n; save(cfg);
    playCue(n);
    if (CUES[n - 1].voices) {   // 9.7: the lines are made the first time; Chirp stands in until they're ready
      const fresh = !Object.keys(VC.bufs).length;
      vcWarm();
      return sleep(1600).then(() => say('Sound ' + n + ', Voices.' + (fresh ? ' Making the lines now, about a minute.' : '')));
    }
    return sleep(CUES[n - 1].len * 1000 + 350).then(() => say('Sound ' + n + ', ' + CUES[n - 1].name + '.'));
  }
  function stepCueVol(dir) {
    const i = CUE_VOLS.indexOf(cueVol()), j = Math.max(0, Math.min(CUE_VOLS.length - 1, i + dir));
    cfg.cueVol = CUE_VOLS[j]; save(cfg);
    playCue();
    const words = ['quietest', 'quieter', 'normal', 'louder', 'loudest'][j];
    return sleep(600).then(() => say('Mic sound ' + words + (j === i ? ', as far as it goes.' : '.')));
  }
  async function cueWhenLive() {
    const t0 = Date.now();
    let on = false;
    for (let i = 0; i < 40 && !on; i++) { await sleep(100); on = buttons('stop').length > 0; }
    if (!on) return;
    // 3.5: tick when the mic is really hearing you, not when the button changes
    for (let i = 0; i < 50 && micLiveAt < t0 && cfg.autoSend; i++) await sleep(100);
    if (buttons('stop').length) blip();
  }

  // ---------- switchboard: this tab's traffic light (2.5) ----------
  const ssGet = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const lsJson = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  // 6.0: a tab without the floor never keeps a mic open: cancel, never send
  function dropStaleDictation(why) {
    try {
      const cancel = last(buttons('cancel')), stop = last(buttons('stop'));
      if (!cancel && !stop) return;
      dlog('dropped dictation', why);
      noteMode = false;
      markFinishClick();
      if (cancel) cancel.click(); else stop.click();   // stop leaves the words in the box, unsent
    } catch (e) {}
  }
  // 6.0: the shared floor record has the last word, so two tabs never both talk
  function ownsFloor() {
    try {
      if (!isFloor()) return false;
      const f = lsJson(K_FLOOR, null);
      return !f || !f.id || f.id === ME;
    } catch (e) { return true; }
  }
  const lsPut = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const K_FLOOR = 'chf_sb_floor', K_QUIET = 'chf_sb_quiet', K_NAGS = 'chf_sb_nags', K_MIN = 'chf_sb_min';

  const ME = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
  const BORN = +(ssGet('chf_sb_born') || 0) || Date.now();   // keeps its tile number across reloads
  ssSet('chf_sb_born', String(BORN));
  let lastActive = +(ssGet('chf_sb_active') || 0);
  let touched = false;
  // 8.9: Switcheroo Chrome lets sound play without a click. A tab where it can is ready to talk without one,
  // so the chats Boot opens can take the AirPods and the mic straight away.
  let soundFree = false;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      const ac = new AC();
      setTimeout(() => {
        soundFree = ac.state === 'running';
        try { ac.close(); } catch (e) {}
        if (soundFree) { try { publish(true); } catch (e) {} }
      }, ac.state === 'running' ? 0 : 400);
    }
  } catch (e) {}
  const armedHere = () => soundFree || (navigator.userActivation ? navigator.userActivation.hasBeenActive : touched);

  let floorId = (lsJson(K_FLOOR, {}) || {}).id || '';
  const isFloor = () => floorId === ME && !tabOff;
  let quiet = lsJson(K_QUIET, { quiet: false, until: 0 });
  // 7.2: quiet.turns holds the board for that many of your messages (quiet.turnsUntil is the backstop)
  const pausedTurns = () => (quiet.turns > 0 || quiet.turnsDone) && Date.now() < (quiet.turnsUntil || 0);
  let hardPause = false;   // 7.5: "pause" during a note stops everything until you click back in
  // 8.0: HOLD. Shared by every Claude tab and kept across reloads until you resume
  const K_HOLD = 'chf_hold';
  let held = !!(lsJson(K_HOLD, {}) || {}).on;
  const quietNow = () => held || hardPause || !!quiet.quiet || Date.now() < (quiet.until || 0) || pausedTurns();

  const sb = { state: 'idle', since: Date.now(), seen: true, request: '', reqKey: '', urgent: false, folder: '', ask: false, ready: false, path: location.pathname };
  let idleSince = 0;

  function chatTitle() {
    let t = (document.title || '').replace(/\s*[|–—-]\s*Claude\s*$/i, '').trim();
    if (!t || /^claude$/i.test(t) || /^new chat$/i.test(t)) t = 'New chat';
    return t;
  }
  function shortName(t) {
    const w = String(t).replace(/[^\p{L}\p{N}'&\s]/gu, ' ').split(/\s+/).filter(Boolean);
    return w.slice(0, 5).join(' ') || 'New chat';
  }

  function replies() {
    const a = document.querySelectorAll('[data-testid="assistant-message"]');
    return a.length ? a : document.querySelectorAll('[data-is-streaming]');
  }
  function isWorking() {
    if (document.querySelector('[data-is-streaming="true"]')) return true;
    return buttons('halt').length > 0;
  }
  // backup: the newest reply is still growing (its last line, a timestamp, is left out)
  let lenSeen = null, lenChangedAt = 0;
  function streamingByText() {
    const ms = replies();
    const m = ms[ms.length - 1];
    const key = ms.length + ':' + (m ? (m.innerText || '').trim().replace(/\n[^\n]*$/, '').length : 0);
    if (key !== lenSeen) { lenSeen = key; lenChangedAt = Date.now(); }
    return sb.ready && Date.now() - lenChangedAt < GROW_MS;
  }
  // 2.6: a request to use a folder on your computer.
  // 6.9: allowed by voice ("allow") after it's read aloud; a squeeze never allows a folder.
  const DENY_WORDS = /^(deny|decline|don't allow|dont allow)(?: esc)?$/;
  function folderHit() {
    try {
      const snap = document.evaluate("//*[not(self::script) and not(self::style) and contains(normalize-space(text()), 'wants to use a folder on your computer')]",
        document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = snap.snapshotLength - 1; i >= 0; i--) {
        const hit = snap.snapshotItem(i);
        if (!hit || ours(hit) || !visible(hit)) continue;
        if (hit.closest('[data-testid="user-message"], [contenteditable="true"]')) continue;
        if (folderButtons(hit).allow) return hit;   // a real request has its own Allow button
      }
    } catch (e) {}
    return null;
  }
  function folderButtons(hit) {
    let el = hit;
    for (let i = 0; i < 8 && el && el !== document.body; i++, el = el.parentElement) {
      const bs = [...el.querySelectorAll('button, [role="button"]')].filter((b) => !ours(b) && visible(b) && !b.disabled);
      const allow = bs.find((b) => /^allow(?: once)?$/.test(wordsOf(b)));
      if (allow) return { allow, deny: bs.find((b) => DENY_WORDS.test(wordsOf(b))) || null, always: bs.find((b) => /^always allow\b/.test(wordsOf(b))) || null, box: el };
    }
    return {};
  }
  function folderAsk() {
    const hit = folderHit();
    if (!hit) return '';
    const { box } = folderButtons(hit);
    const m = ((box && box.innerText) || '').match(/(?:~|\/Users|\/Volumes|\/home)\/[^\n]*?([^\/\n]+)\/([^\/\n]+?)\/?\s*$/m);
    return m ? (m[1].trim() + ' ' + m[2].trim()).replace(/\s+/g, ' ') : 'a';
  }
  // 8.1: a request to control the computer, or apps on it ("allow Claude to control your computer").
  // Found by its words and its own Allow button. Allowed by voice only as "allow" plus an app's name,
  // for this session only; Always allow is a click in screen mode, never your voice.
  const COMP_RE = /control (?:your|this|the) (?:computer|mac|screen|desktop)|computer use|access to (?:your |the |these )?(?:apps?|applications?|screen|computer)|wants? to (?:use|control|access|open) .{0,80}\b(?:apps?|applications?|computer|mac)\b|use (?:these|the following) apps|app access/i;
  const COMP_NOT = /^(?:allow|deny|always|cancel|claude|not now|don't allow|dont allow|for this session|this session|apps?|applications?|computer|your computer|learn more|details|show more|more)\b/i;
  let lastComp = null;
  function compButtons(el) {
    const bs = [...el.querySelectorAll('button, [role="button"]')].filter((b) => !ours(b) && visible(b) && !b.disabled);
    const allow = bs.find((b) => /^allow(?: for (?:this |the )?session| once| for now| access| control| apps?)?$/.test(wordsOf(b)));
    if (!allow) return null;
    return { allow, always: bs.find((b) => /^always allow\b/.test(wordsOf(b))) || null,
      deny: bs.find((b) => DENY_WORDS.test(wordsOf(b)) || /^(?:not now|cancel|don't allow|dont allow)$/.test(wordsOf(b))) || null, bs };
  }
  function compApps(box, head) {
    const skip = new Set();
    box.querySelectorAll('button, [role="button"]').forEach((b) => skip.add(textOf(b)));
    const out = [];
    const add = (x) => {
      x = String(x || '').replace(/\s+/g, ' ').trim();
      if (!x || x.length > 32 || x.split(' ').length > 4 || /[?:]/.test(x) || COMP_NOT.test(x) || skip.has(x.toLowerCase())) return;
      if (head && x.length > 12 && head.includes(x) && x.split(' ').length > 3) return;
      if (!out.some((o) => o.toLowerCase() === x.toLowerCase())) out.push(x);
    };
    box.querySelectorAll('img[alt]').forEach((im) => add(im.getAttribute('alt')));
    box.querySelectorAll('li, [role="listitem"], [role="option"], [role="checkbox"], label, span, div, p').forEach((el) => {
      if (ours(el) || el.closest('button, [role="button"]')) return;
      if ([...el.children].some((c) => !/^(img|svg|i|b|strong|em)$/i.test(c.tagName))) return;   // leaves only
      add(el.innerText || el.textContent);
    });
    if (!out.length && head) {   // "Claude wants to use Notes and Finder on your computer"
      const m = head.match(/(?:use|control|access|open)\s+(.+?)(?:\s+on (?:your|this) (?:computer|mac))?[.?!]*$/i);
      if (m && !/computer|screen|desktop|apps?\b/i.test(m[1])) m[1].split(/\s*(?:,|\band\b|&)\s*/).forEach(add);
    }
    return out.slice(0, 8);
  }
  function compAsk() {
    try {
      const snap = document.evaluate("//*[not(self::script) and not(self::style) and not(self::button)][string-length(normalize-space(text())) > 8]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = snap.snapshotLength - 1; i >= 0; i--) {
        const hit = snap.snapshotItem(i);
        if (!hit || ours(hit) || !visible(hit)) continue;
        const head = (hit.innerText || hit.textContent || '').replace(/\s+/g, ' ').trim();
        if (head.length > 240 || !COMP_RE.test(head)) continue;
        if (hit.closest('[data-testid="user-message"], [contenteditable="true"], nav')) continue;
        let el = hit;
        for (let k = 0; k < 8 && el && el !== document.body; k++, el = el.parentElement) {
          const b = compButtons(el);
          if (!b) continue;
          const apps = compApps(el, head);
          lastComp = Object.assign({ box: el, head, apps, key: 'c|' + location.pathname + '|' + apps.join(',') + '|' + head.slice(0, 60) }, b);
          return lastComp;
        }
      }
    } catch (e) {}
    lastComp = null;
    return null;
  }
  const appList = (apps) => !apps || !apps.length ? 'your computer' : apps.length === 1 ? apps[0] : apps.slice(0, -1).join(', ') + ' and ' + apps[apps.length - 1];
  const compLine = (e) => e.name + ' wants control of ' + appList(e.comp) + '. Say allow and the app name.';
  // the name you said, against the apps the card lists
  function appMatch(said, apps) {
    const q = normName(said).replace(/^(?:the |my )/, '').replace(/\s+(?:app|application|for this session|for now|please)$/, '').trim();
    if (!q) return null;
    const list = apps && apps.length ? apps : ['your computer'];
    for (const a of list) {
      const t = normName(a);
      if (t === q || (q.length >= 3 && (t.startsWith(q) || t.split(' ').includes(q))) || (q.length >= 4 && lev(q, t) <= 2)) return a;
      if (t === 'your computer' && /^(?:your |the |my )?(?:computer|mac|screen|desktop)$/.test(q)) return a;
    }
    return null;
  }
  function doAllowComputer(key, always, app, fromScreen) {
    const c = compAsk();
    if (!c || c.key !== key) return false;
    if (always) { if (!fromScreen || !c.always) return false; dlog('computer always allowed from screen mode', c.apps.join(', ')); c.always.click(); setTimeout(scheduleCompute, 300); return true; }
    if (!fromScreen && !appMatch(app || '', c.apps)) return false;   // by voice, only with an app's name
    dlog('computer allowed for this session', (app || 'screen mode') + ' / ' + c.apps.join(', '));
    c.allow.click();
    setTimeout(scheduleCompute, 300);
    return true;
  }
  function doDenyComputer(key) {
    const c = compAsk();
    if (!c || c.key !== key || !c.deny) return false;
    c.deny.click(); setTimeout(scheduleCompute, 300); return true;
  }

  const folderLine = (e) => e.name + ' needs your ' + (e.folder === 'a' ? '' : e.folder + ' ') + 'folder. ' +
    (cfg.autoListen ? 'Say allow, or deny.' : 'Allow it at the keyboard with Command Enter.');
  // 6.9: read a folder request, then "allow" by voice works for it
  async function announceFolder(e) {
    if (earBusy()) return false;
    if (!cfg.autoListen) return say(folderLine(e));
    let said = false;
    await askAloud(folderLine(e), (alts) => judgeApproval(alts), { afterLine: () => {   // 8.1: listens here for the answer
      said = true;
      approval = { id: e.id, key: '', folder: e.folder, name: e.name, until: 0, voiceUntil: Date.now() + VOICE_APPROVE_MS, askedAt: Date.now() };
      paintPill(); paintBoard();
    } });
    return said;
  }

  function urgentLine() {
    const ms = replies();
    const m = ms[ms.length - 1];
    const t = m ? (m.innerText || '').trim() : '';
    if (!/^URGENT\b/.test(t)) return '';
    return t.split('\n')[0].replace(/^URGENT\W*/, '').slice(0, 200).trim() || 'no details';
  }

  // Allow once, never Always allow
  function denyNear(b) {
    let el = b.parentElement;
    for (let i = 0; i < 4 && el; i++, el = el.parentElement) {
      if ([...el.querySelectorAll('button, [role="button"]')].some((x) => DENY_WORDS.test(wordsOf(x)))) return true;
    }
    return false;
  }
  function findAllow() {
    const all = [...document.querySelectorAll('button, [role="button"]')].filter((b) => !ours(b) && visible(b) && !b.disabled);
    if (cfg.allow) {
      const t = all.filter((b) => sigMatch(b, cfg.allow));
      if (t.length) return last(t);
    }
    return last(all.filter((b) => wordsOf(b) === 'allow once')) ||
      last(all.filter((b) => wordsOf(b) === 'allow' && denyNear(b))) || null;
  }
  function requestText(btn) {
    let el = btn.parentElement, box = null;
    for (let i = 0; i < 8 && el && el !== document.body; i++, el = el.parentElement) {
      if ((el.innerText || '').trim().length > 40 && el.querySelectorAll('button, [role="button"]').length >= 2) { box = el; break; }
    }
    if (!box) return 'Claude is asking for permission';
    const skip = new Set([...box.querySelectorAll('button, [role="button"]')].map(textOf).filter(Boolean));
    let s = (box.innerText || '').split('\n').map((x) => x.trim()).filter((x) => x && !skip.has(x.toLowerCase())).join('. ');
    s = s.replace(/mcp__/gi, '').replace(/_+/g, ' ').replace(/[{}[\]"`<>]/g, ' ')
      .replace(/\s+/g, ' ').replace(/([.:])\s*\./g, '$1').trim();
    if (s.length > 240) s = s.slice(0, 240).replace(/\s+\S*$/, '') + ', and more';
    return s || 'Claude is asking for permission';
  }
  const reqKeyOf = (req) => location.pathname + '|' + req.slice(0, 120);

  function persistChat() {
    ssSet('chf_sb_chat', JSON.stringify({ path: sb.path, state: sb.state, since: sb.since, seen: sb.seen, urgent: sb.urgent, request: sb.urgent ? sb.request : '' }));
  }
  function restoreChat() {
    let p = null;
    try { p = JSON.parse(ssGet('chf_sb_chat')); } catch (e) {}
    if (p && p.path === location.pathname && (p.state === 'yellow' || p.state === 'idle' || (p.state === 'red' && p.urgent))) {
      Object.assign(sb, { state: p.state, since: p.since, seen: p.seen, urgent: !!p.urgent, request: p.request || '', reqKey: '' });
    } else {
      Object.assign(sb, { state: 'idle', since: Date.now(), seen: true, urgent: false, request: '', reqKey: '' });
    }
  }
  // replies already on screen at load don't count
  function initReady() {
    sb.ready = false;
    setTimeout(() => { streamingByText(); lenChangedAt = 0; sb.ready = true; }, 2500);
  }

  // ---------- question cards (3.9) ----------
  // Claude sometimes asks with a card of numbered choices and a Skip button. Find it, read it,
  // and let a spoken number or name pick a choice.
  function readAskNumbered() {
    const all = [...document.querySelectorAll('button, [role="button"]')].filter((b) => !ours(b) && visible(b));
    const skip = last(all.filter((b) => wordsOf(b) === 'skip'));
    if (!skip) return null;
    const linesOf = (el) => (el.innerText || '').split('\n').map((x) => x.trim()).filter(Boolean);
    const parse = (el) => {
      const L = linesOf(el).filter((x) => /[\p{L}\p{N}]/u.test(x));   // 6.8: no icon glyphs like the return arrow
      if (!L.length) return null;
      let num, label, rest;
      if (/^\d{1,2}$/.test(L[0]) && L[1]) { num = +L[0]; label = L[1]; rest = L.slice(2); }
      else { const m = L[0].match(/^(\d{1,2})\s*(\D.*)$/); if (!m) return null; num = +m[1]; label = m[2].trim(); rest = L.slice(1); }
      return { el, num, label, desc: rest.join(' ') };
    };
    let box = skip.parentElement, opts = [];
    for (let i = 0; i < 8 && box && box !== document.body; i++, box = box.parentElement) {
      const cand = [...box.querySelectorAll('button, [role="button"], [role="option"], [role="radio"], [role="checkbox"], [role="menuitem"], li, label')]
        .filter((el) => !ours(el) && visible(el) && /^\s*\d{1,2}\b/.test(el.innerText || ''));
      const outer = cand.filter((el) => !cand.some((o) => o !== el && o.contains(el)));
      opts = outer.map(parse).filter(Boolean);
      if (opts.length >= 2) break;
    }
    if (opts.length < 2 || !opts.every((o, i) => o.num === i + 1)) return null;   // must read 1, 2, 3 ...
    const skipLines = new Set(['skip', 'something else']);
    opts.forEach((o) => { skipLines.add(o.label.toLowerCase()); skipLines.add(String(o.num)); if (o.desc) skipLines.add(o.desc.toLowerCase()); });
    // 6.8: a line that belongs to a choice (its label or note, whole or in part) is never the question
    const optText = opts.map((o) => (o.label + ' ' + (o.desc || '')).toLowerCase());
    const ofChoice = (x) => { const l = x.toLowerCase(); return optText.some((t) => t.includes(l) || l.includes(t)) || /^\d{1,2}\b/.test(x); };
    let question = '', first = '';
    for (let el = box, i = 0; el && el !== document.body && i < 5 && !question; el = el.parentElement, i++) {
      const L = linesOf(el).filter((x) => !skipLines.has(x.toLowerCase()) && x.length > 3 && !ofChoice(x));
      question = L.find((x) => /\?\s*$/.test(x)) || '';
      if (!first && L[0]) first = L[0];
    }
    question = question || first || 'Claude has a question.';
    return { question, options: opts, skip, key: question + '|' + opts.map((o) => o.label).join('|') };
  }
  // ---------- ballot cards (7.9) ----------
  // Claude also asks with ballot cards: a question, choices without numbers, sometimes one marked
  // recommended, sometimes an Other box, and Submit (or Next) instead of Skip. Some take several
  // picks. Choices are numbered here in the order they show, top to bottom.
  const readAsk = () => readAskNumbered() || readBallot();
  const BALLOT_GO = /^(submit|submit answers?|send|send answers?|continue|done|confirm|next|answer|save|skip)$/;
  const BALLOT_SURE = /^(submit|submit answers?|send answers?|done|confirm|answer|skip)$/;
  const BALLOT_NOT = /^(copy|retry|edit|share|close|cancel|back|previous|more|menu|expand|collapse|show more|show less|good response|bad response|thumbs up|thumbs down|stop|pause|resume|allow|allow once|always allow|deny)$/;
  const OPT_SEL = '[role="radio"],[role="checkbox"],[role="option"],[role="menuitemradio"],[role="menuitemcheckbox"],input[type="radio"],input[type="checkbox"],label,button,[role="button"],li';
  const CHOICE_ROLE = '[role="radio"],[role="checkbox"],[role="option"],[role="menuitemradio"],[role="menuitemcheckbox"],input[type="radio"],input[type="checkbox"]';
  const onAttr = (x) => !!x && x.getAttribute && (x.getAttribute('aria-checked') === 'true' || x.getAttribute('aria-pressed') === 'true' ||
    x.getAttribute('aria-selected') === 'true' || /^(checked|on|selected)$/.test(x.getAttribute('data-state') || '') || x.checked === true);
  const isOn = (el) => onAttr(el) || [...el.querySelectorAll('input,[aria-checked],[aria-pressed],[aria-selected],[data-state]')].some(onAttr);
  const isOff = (b) => !b || b.disabled || b.getAttribute('aria-disabled') === 'true';
  function ballotFair(el, comp) {
    if (ours(el)) return false;
    if (comp && (el.contains(comp) || comp.contains(el))) return false;
    return !el.closest('nav, header, [data-testid="user-message"]');
  }
  function parseChoice(el) {
    const raw = (el.innerText || el.getAttribute('aria-label') || '').split('\n').map((x) => x.trim()).filter((x) => /[\p{L}\p{N}]/u.test(x));
    if (!raw.length) return null;
    let rec = false;
    const L = raw.filter((x) => { if (/^\(?recommended\)?$/i.test(x)) { rec = true; return false; } return true; });
    if (!L.length) return null;
    if (/^\d{1,2}[.)]?$/.test(L[0]) && L[1]) L.shift(); else L[0] = L[0].replace(/^\d{1,2}[.)]\s+/, '');
    let label = L[0];
    if (/\(recommended\)/i.test(label)) { rec = true; label = label.replace(/\s*\(recommended\)\s*/ig, ' ').trim(); }
    if (!label) return null;
    const multi = el.matches('[role="checkbox"],[role="menuitemcheckbox"],input[type="checkbox"]') || !!el.querySelector('[role="checkbox"],[role="menuitemcheckbox"],input[type="checkbox"]');
    const role = el.matches(CHOICE_ROLE + ',label') || !!el.querySelector(CHOICE_ROLE);
    const other = /^(other|something else|none of (these|those|the above)|type (your|an|my) (own )?answer|write in|custom answer)\b/i.test(label);
    return { el, label, desc: L.slice(1).join(' '), rec, multi, role, other };
  }
  function ballotChoices(box, comp) {
    let raw = [...box.querySelectorAll(OPT_SEL)].filter((el) => {
      if (!ballotFair(el, comp)) return false;
      if (el.matches('input')) return visible(el.closest('label') || el.parentElement || el);
      if (!visible(el) || el.hasAttribute('aria-expanded') || el.hasAttribute('aria-haspopup')) return false;   // tool chips and menus
      if (el.matches('li') && el.querySelector('li')) return false;
      const w = wordsOf(el);
      if (!w || BALLOT_GO.test(w) || BALLOT_NOT.test(w)) return false;
      const t = (el.innerText || '').trim();
      return t.length >= 1 && t.length <= 400 && /[\p{L}\p{N}]/u.test(t);
    });
    raw = raw.map((el) => el.matches('input') ? (el.closest('label') || el.parentElement) : el);
    raw = raw.filter((el, i) => raw.indexOf(el) === i);
    // a wrapper holding two or more choices is not a choice itself
    raw = raw.filter((el) => raw.filter((o) => o !== el && el.contains(o)).length < 2);
    const outer = raw.filter((el) => !raw.some((o) => o !== el && o.contains(el)));
    return outer.map(parseChoice).filter(Boolean);
  }
  function ballotQuestion(start, choices, comp) {
    const skip = new Set();
    choices.forEach((o) => { skip.add(o.label.toLowerCase()); if (o.desc) skip.add(o.desc.toLowerCase()); });
    const ofChoice = (x) => { const l = x.toLowerCase(); return skip.has(l) || choices.some((o) => (o.label + ' ' + o.desc).toLowerCase().includes(l)); };
    let first = '';
    for (let el = start, i = 0; el && el !== document.body && i < 5; el = el.parentElement, i++) {
      if (i > 0 && ((comp && el.contains(comp)) || el.querySelector('[data-testid="user-message"]'))) break;
      const L = (el.innerText || '').split('\n').map((x) => x.trim())
        .filter((x) => x.length > 3 && /[\p{L}]/u.test(x) && !ofChoice(x) && !BALLOT_GO.test(x.toLowerCase()) && !/^\(?recommended\)?$/i.test(x));
      const q = L.filter((x) => /\?\s*$/.test(x));
      if (q.length) return { text: q[q.length - 1], real: true };
      if (!first) {
        const h = el.querySelector('legend, h1, h2, h3, h4, [role="heading"]');
        first = (h && h.innerText.trim() && !ofChoice(h.innerText.trim()) && h.innerText.trim()) || '';
      }
    }
    return { text: first || 'Claude has a question.', real: false };
  }
  function readBallot() {
    const comp = composer();
    const acts = [...document.querySelectorAll('button, [role="button"]')].filter((b) => ballotFair(b, comp) && visible(b));
    const goes = acts.filter((b) => BALLOT_GO.test(wordsOf(b)));
    const starts = goes.slice().reverse();
    // a lone radio group with no button still counts
    const groups = [...document.querySelectorAll('[role="radiogroup"]')].filter((g) => ballotFair(g, comp) && visible(g));
    if (groups.length) starts.push(last(groups));
    for (const s of starts) {
      let box = s.matches('[role="radiogroup"]') ? s : s.parentElement;
      for (let i = 0; i < 8 && box && box !== document.body; i++, box = box.parentElement) {
        if ((comp && box.contains(comp)) || box.querySelector('[data-testid="user-message"]')) break;
        const all = ballotChoices(box, comp);
        if (all.length < 2) continue;
        if (all.length > 14) break;
        const roles = all.filter((o) => o.role).length >= 2;
        const kin = all.every((o) => o.el.parentElement === all[0].el.parentElement) ||
          all.every((o) => o.el.parentElement && all[0].el.parentElement && o.el.parentElement.parentElement === all[0].el.parentElement.parentElement);
        const boxGo = goes.filter((b) => box.contains(b));
        const sure = boxGo.some((b) => BALLOT_SURE.test(wordsOf(b)));
        // several questions stacked in one card: take the first one not answered yet
        const keyOf = (o) => o.el.closest('[role="radiogroup"],[role="group"],fieldset,[role="listbox"]');
        const gs = [];
        all.forEach((o) => { const g = box.contains(keyOf(o)) ? keyOf(o) : box; if (!gs.includes(g)) gs.push(g); });
        let cur = gs[0];
        if (gs.length > 1) cur = gs.find((g) => !all.filter((o) => (box.contains(keyOf(o)) ? keyOf(o) : box) === g).some((o) => isOn(o.el))) || gs[gs.length - 1];
        const mine = gs.length > 1 ? all.filter((o) => (box.contains(keyOf(o)) ? keyOf(o) : box) === cur) : all;
        if (mine.length < 2 && !(mine.length === 1 && mine[0].other)) continue;
        const q = ballotQuestion(cur === box ? box : cur, mine, comp);
        if (!q.real && !roles) break;          // no question mark and no real choices: not a ballot
        if (!roles && !(sure && kin) && !q.real) break;
        if (!roles && !kin) continue;
        const multi = mine.some((o) => o.multi) || /\b(all that apply|select (all|any|several|multiple)|pick (all|any|several|multiple)|choose (all|any|several|multiple))\b/i.test(box.innerText || '');
        const otherOpt = mine.find((o) => o.other) || null;
        const options = mine.filter((o) => !o.other).map((o, j) => Object.assign(o, { num: j + 1 }));
        if (options.length < 1 || (options.length < 2 && !otherOpt)) continue;
        const otherInput = [...box.querySelectorAll('textarea, input[type="text"], input:not([type]), [contenteditable="true"]')]
          .find((x) => ballotFair(x, comp) && visible(x)) || null;
        const submit = last(boxGo.filter((b) => wordsOf(b) !== 'skip')) || null;
        const skip = last(boxGo.filter((b) => wordsOf(b) === 'skip')) || null;
        const left = gs.length > 1 ? gs.filter((g) => g !== cur && !all.filter((o) => (box.contains(keyOf(o)) ? keyOf(o) : box) === g).some((o) => isOn(o.el))).length : 0;
        return { ballot: true, question: q.text, options, otherOpt, otherInput, multi, submit, skip, left, box,
          key: 'b|' + q.text + '|' + options.map((o) => o.label).join('|') };
      }
    }
    return null;
  }
  // puts spoken words in a text box the page is watching (React needs the native setter)
  function fillBox(el, text) {
    try {
      if (el.isContentEditable) { el.focus(); document.execCommand('selectAll', false); document.execCommand('insertText', false, text); return; }
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
      el.focus(); set.call(el, text);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) { try { el.value = text; } catch (x) {} }
  }
  function choose(o) { if (!isOn(o.el)) { const t = o.el.matches('label') ? (o.el.querySelector('input') || o.el) : o.el; t.click(); } }
  // after the picks: Submit (or Next) goes, unless another question in the card is still open
  async function sendBallot(a, line) {
    askKeyRead = '';
    await sleep(300);
    const now = readAsk();
    if (a.left > 0 && now && now.ballot && now.key !== a.key) { dlog('ballot', 'next question in the card'); return say(line); }
    let go = (now && now.ballot && now.submit) || a.submit;
    for (let i = 0; i < 10 && go && isOff(go); i++) { await sleep(150); go = ((readAsk() || {}).submit) || go; }
    if (go && !isOff(go)) { ownFill++; try { go.click(); } finally { ownFill--; } dlog('ballot sent', line); return say(line + ' Sent.'); }
    dlog('ballot', 'no submit button, picked only');
    return say(line);
  }
  // 7.9: a copy of the card for André to paste in chat when a ballot isn't heard right
  function ballotSnapshot() {
    const a = readAsk();
    const pick = a ? (a.box || (a.options[0] && a.options[0].el.parentElement)) : null;
    let el = pick || ((compAsk() || {}).box) || null;   // 8.1: a computer access card too
    if (!el) {
      const qs = [...document.querySelectorAll('button, [role="button"], [role="radio"], [role="checkbox"]')].filter((b) => !ours(b) && visible(b));
      el = qs.length ? qs[qs.length - 1].parentElement : null;
      for (let i = 0; i < 4 && el && el.parentElement; i++) el = el.parentElement;
    }
    const lines = [];
    const walk = (n, d) => {
      if (!n || d > 12 || lines.length > 160) return;
      if (n.nodeType === 3) { const t = n.textContent.trim(); if (t) lines.push('  '.repeat(d) + '"' + t.slice(0, 80) + '"'); return; }
      if (n.nodeType !== 1 || /^(svg|path|script|style)$/i.test(n.tagName)) return;
      const at = ['role', 'aria-label', 'aria-checked', 'aria-pressed', 'aria-selected', 'data-state', 'data-testid', 'type', 'disabled']
        .filter((k) => n.hasAttribute(k)).map((k) => k + '=' + (n.getAttribute(k) || '').slice(0, 30)).join(' ');
      lines.push('  '.repeat(d) + '<' + n.tagName.toLowerCase() + (at ? ' ' + at : '') + '>');
      [...n.childNodes].forEach((c) => walk(c, d + 1));
    };
    walk(el, 0);
    const out = 'Hands free ' + '7.9' + ' ballot snapshot, detected: ' + (a ? (a.ballot ? 'ballot' : 'numbered') + ', ' + a.options.length + ' choices' : 'nothing') + '\n' + lines.join('\n');
    try { localStorage.setItem('chf_ballot_snap', out); } catch (e) {}
    try { navigator.clipboard.writeText(out).then(() => toast('Ballot snapshot copied. Paste it to Claude.'), () => toast('Snapshot saved, clipboard blocked')); } catch (e) { toast('Snapshot saved'); }
  }
  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Copy question or computer card snapshot', ballotSnapshot); } catch (e) {}

  function askText(a) {
    const brief = (d) => { d = String(d || ''); const m = d.match(/^[^.]{4,90}\./); return m ? m[0] : (d.length > 90 ? d.slice(0, 90).replace(/\s+\S*$/, '') : d); };
    let s = a.question + ' ' + a.options.map((o) => o.num + ', ' + o.label + (o.rec ? ', recommended' : '') + '.' + (o.desc ? ' ' + brief(o.desc) : '')).join(' ');
    if (!a.ballot) return s + ' Say a number, or just answer.';
    if (a.otherOpt || a.otherInput) s += ' Or say other, then your answer.';
    if (a.multi) return s + ' Say the numbers you want, like one and three, or all of them.';
    return s + (a.options.some((o) => o.rec) ? ' Say a number, or recommended.' : ' Say a number.');
  }
  let askKeyRead = '', askReading = false;
  // read a new card once things are quiet; opens the mic after if your turn mode is on
  async function checkAsk(fromTurn) {
    if (held || hardPause || !isFloor() || tabOff || askReading || earBusy() || !sb.ready || (!fromTurn && turnPending)) return;
    if (DK.on) return;   // 7.9: the deck has the floor's voice
    if (buttons('stop').length || buttons('pause').length || buttons('resume').length || speaking > 0 || fbActive() || alerting || announcingRed) return;
    const a = readAsk();
    if (!a || a.key === askKeyRead) return;
    askKeyRead = a.key; askReading = true;
    dlog('question card', (a.ballot ? 'ballot ' : 'numbered ') + a.options.length + (a.multi ? ' multi' : ''));
    try {
      try { const c = composer(); if (c && document.activeElement && a.box && a.box.contains(document.activeElement)) c.focus(); } catch (e) {}
      // 8.1: the card listens for its own answer; commands run, picks pick, nothing is typed into the card
      const got = cfg.autoListen ? await askAloud(askText(a), (alts) => judgeCard(alts), {}) : (await say(askText(a)), false);
      if (!got && !fromTurn) openTurnMic('question card');
    } finally { askReading = false; }
  }
  // 8.1: what the card's ears heard: a command, a pick, or (four words or more) a reply in this chat
  function judgeCard(alts) {
    for (const raw of alts) {
      const f = flatOf(raw);
      if (NOTE_PAUSE.test(f)) { hush(); hardPause = true; paintBoard(); toast('Paused. Click in this tab, or squeeze, to pick back up.'); return true; }
      const c = parseCommand(raw);
      if (c && !isTail(c)) { runCommand(c); return true; }
    }
    for (const raw of alts) if (answerAsk(raw)) return true;
    const best = String(alts[0] || '').trim();
    if (best.split(/\s+/).length >= 4) { dlog('card reply sent in this chat', best); insertIntoComposer(best.charAt(0).toUpperCase() + best.slice(1)); sendWhenReady(); return true; }
    return 'Say a number' + (readAsk() && readAsk().ballot ? ', recommended, or other and your answer.' : ', or just answer.');
  }
  const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, won: 1, to: 2, too: 2, tree: 3, for: 4 };
  const REC_WORDS = /^(?:(?:the|your)\s+)?(?:recommended|recommendation|recommend|one you recommend|what you recommend|your pick|suggested)(?: one| option| choice)?$/;
  // one spoken choice: a number, first/second/last, recommended, or words from its name
  function pickOf(a, f) {
    f = String(f || '').replace(/^(?:let'?s go with|go with|i'?ll take|i'?ll go with|pick|choose|select|take|do|number)\s+/, '')
      .replace(/^(?:the\s+)?(?:option|number|choice)\s+/, '').replace(/^the\s+/, '').replace(/\s+please$/, '').trim();
    if (!f) return null;
    if (a.ballot && REC_WORDS.test(f)) return a.options.find((o) => o.rec) || null;
    const om = f.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|last)(?: one| option| choice)?$/);
    let n = om ? (om[1] === 'last' ? a.options.length : ORD[om[1]]) : toNum(f);
    if (!isFinite(n) && f in ORD) n = ORD[f];
    if (!isFinite(n)) { const d = f.match(/^(\d{1,2})(?:st|nd|rd|th)?$/); if (d) n = +d[1]; }
    if (isFinite(n)) return a.options.find((x) => x.num === n) || null;
    const q = normName(f);
    let best = null, bs = 0;
    for (const o of a.options) {
      const t = normName(o.label);
      const sc = t === q ? 100 : (q.length >= 4 && t.startsWith(q)) ? 85 : (q.length >= 4 && t.includes(q)) ? 70 : 0;
      if (sc > bs) { bs = sc; best = o; }
    }
    return best && bs >= 70 ? best : null;
  }
  function answerAsk(text) {
    const a = readAsk();
    if (!a) return false;
    const rawText = String(text || '').trim();
    let f = rawText.toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(?:(?:uh+|um+|okay|ok|so|alright|all right)\s+)+/, '');
    if (/^(skip|skip it|skip this|skip that|pass)$/.test(f)) {
      if (a.skip) { a.skip.click(); askKeyRead = ''; say('Skipped.'); return true; }
      if (a.ballot) { say('This one has no skip. Say a number' + (a.otherOpt || a.otherInput ? ', or other and your answer.' : '.')); return true; }
      return false;
    }
    // 7.9: hear the card again
    if (/^(?:(?:read|say|give me|tell me)\s+)?(?:it|that|the (?:question|card|options|choices))?\s*(?:again|options|choices)$|^(?:what are|what were) (?:the|my) (?:options|choices)$|^(?:options|choices|the options|the choices)$/.test(f)) {
      askKeyRead = a.key; say(askText(a)); return true;
    }
    if (!a.ballot) {   // 3.9 numbered cards: one pick, and the card sends itself
      const o = pickOf(a, f);
      if (!o) return false;
      o.el.click(); askKeyRead = ''; say('Picked ' + o.num + ', ' + o.label + '.');
      return true;
    }
    // Other, then your own words
    const om = rawText.match(/^\s*(?:uh+,?\s+|um+,?\s+)?(?:other|something else|none of (?:those|these|the above))\b[\s,.:;!-]*([\s\S]*)$/i);
    if (om) {
      const words = om[1].replace(/[\s.]+$/, '').trim();
      if (!words) { say('Say other, then your answer, all in one go.'); return true; }
      (async () => {
        if (a.otherOpt) { choose(a.otherOpt); await sleep(300); }
        const now = readAsk();
        const box = (now && now.otherInput) || a.otherInput;
        if (!box) { dlog('ballot', 'other: no box to type in'); say("I can't find the box for your own answer. Say a number, or answer at the keyboard."); return; }
        ownFill++; try { fillBox(box, words.charAt(0).toUpperCase() + words.slice(1)); } finally { ownFill--; }
        await sendBallot(a, 'Other: ' + words + '.');
      })();
      return true;
    }
    // several picks: "one and three", "two, four, five", "all of them"
    let picks = null;
    const whole = pickOf(a, f);
    if (a.multi && /^(?:all|all of them|all of those|everything|every one|the whole list)$/.test(f)) picks = a.options.slice();
    else if (whole) picks = [whole];
    else {
      const toks = f.split(/\s*(?:,|&|\band also\b|\band\b|\bplus\b|\balso\b)\s*/).map((x) => x.trim()).filter(Boolean);
      if (toks.length > 1) {
        const got = toks.map((t) => pickOf(a, t));
        if (got.every(Boolean)) picks = got.filter((o, i) => got.indexOf(o) === i);
        else if (!a.multi) return false;
        else { say("I didn't catch all of those. Say the numbers, like one and three."); return true; }
        if (!a.multi && picks.length > 1) { say('Just one on this card. Which number?'); return true; }
      }
    }
    if (!picks || !picks.length) return false;   // anything else goes out as a regular reply
    picks.forEach(choose);
    const line = picks.length === 1 ? 'Picked ' + picks[0].num + ', ' + picks[0].label + '.'
      : 'Picked ' + picks.map((o) => o.num).join(', ').replace(/, (\d+)$/, ' and $1') + '.';
    sendBallot(a, line);
    return true;
  }

  // ---------- 8.1: a voice command said while a ballot card is open never answers it ----------
  // With a card open, dictation can land in the card's Other box instead of the message box, and the
  // card then went out with "read again" or "pause" as your answer. Now every phrase in a card's box is
  // checked against the command list first, before the box can be submitted. Only a choice number, a
  // choice name, "recommended" or "other, then your words" answers the card.
  let ownFill = 0;   // the script itself is typing into a card or pressing its Submit
  const CARD_FIELDS = 'textarea, input[type="text"], input:not([type]), [contenteditable="true"]';
  const fieldText = (f) => String((f.isContentEditable ? f.innerText : f.value) || '');
  function cardField(el) {
    if (!el || !el.closest || ours(el)) return null;
    const f = el.closest(CARD_FIELDS);
    if (!f) return null;
    const c = composer();
    if (c && (c === f || c.contains(f) || f.contains(c))) return null;
    const a = readAsk();
    if (!a || !a.ballot || !a.box || !a.box.contains(f)) return null;
    return { f, a };
  }
  function cardCommandOf(text) {
    const t = String(text || '').trim();
    if (!t || t.length > 80) return null;
    const low = t.toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (NOTE_PAUSE.test(low)) return { kind: 'cardPause' };
    if (/^(?:uh |um |okay |ok )?(?:over|over and out)$/.test(low)) return { kind: 'cardDrop' };
    const c = parseCommand(t);
    return c && !isTail(c) ? c : null;
  }
  async function runCardCommand(f, c, text) {
    dlog('command kept off the card', text.slice(0, 60) + ' => ' + c.kind);
    ownFill++;
    try { fillBox(f, ''); } finally { ownFill--; }
    try { f.blur(); } catch (e) {}
    if (c.kind === 'cardDrop') return;
    if (c.kind === 'cardPause') {   // "pause" while a card is read: stop talking, same as pause in a note
      hush(); hardPause = true; paintBoard();
      toast('Paused. Click in this tab, or squeeze, to pick back up.');
      return;
    }
    if (!isFloor()) takeFloor('touch');
    await runCommand(c);
  }
  let cardT = null;
  document.addEventListener('input', (e) => {
    if (ownFill || tabOff) return;
    const h = cardField(e.target);
    if (!h) return;
    clearTimeout(cardT);
    cardT = setTimeout(() => {   // dictation lands a word at a time; judge the phrase once it settles
      if (ownFill || !h.f.isConnected) return;
      const t = fieldText(h.f), c = cardCommandOf(t);
      if (c) runCardCommand(h.f, c, t);
    }, 900);
  }, true);
  // and nothing in a card's box goes out as the answer if it's a command: Submit, Enter, or a form submit
  function guardCard(e) {
    if (ownFill || tabOff) return;
    if (e.type === 'keydown' && (e.key !== 'Enter' || e.shiftKey || e.isComposing)) return;
    const a = readAsk();
    if (!a || !a.ballot || !a.box) return;
    if (e.type === 'click') {
      const b = e.target && e.target.closest && e.target.closest('button, [role="button"]');
      if (!b || !a.box.contains(b) || !BALLOT_GO.test(wordsOf(b))) return;
    } else if (e.type === 'keydown') {
      if (!cardField(e.target)) return;
    } else if (!(e.target && (a.box.contains(e.target) || e.target.contains(a.box)))) return;
    const f = [...a.box.querySelectorAll(CARD_FIELDS)].find((x) => !ours(x) && fieldText(x).trim());
    if (!f) return;
    const t = fieldText(f), c = cardCommandOf(t);
    if (!c) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    clearTimeout(cardT);
    runCardCommand(f, c, t);
  }
  ['click', 'keydown', 'submit'].forEach((t) => document.addEventListener(t, guardCard, true));

  // ---------- 8.1: question cards and the voice, as screen mode sees them ----------
  let sbAskObj = null;
  function askForScreen() {
    const a = sbAskObj;
    if (!a || !a.options || !a.options.length) return null;
    const on = (o) => { try { return isOn(o.el); } catch (e) { return false; } };
    return { key: a.key, q: String(a.question || '').slice(0, 300), multi: !!a.multi, skip: !!a.skip,
      opts: a.options.slice(0, 12).map((o) => ({ n: o.num, label: String(o.label || '').slice(0, 120), desc: String(o.desc || '').slice(0, 160), rec: !!o.rec, on: on(o) })) };
  }
  // a click on a choice in screen mode: only for the card it showed, and it goes the same way your voice would
  function pickFromScreen(key, n) {
    const a = readAsk();
    if (!a || a.key !== key) return false;
    dlog('question card answered from screen mode', String(n));
    if (n === 'skip') return answerAsk('skip');
    if (Array.isArray(n)) return n.length ? answerAsk(n.map(Number).filter(isFinite).join(' and ')) : false;
    return isFinite(+n) ? answerAsk(String(+n)) : false;
  }
  // where the voice is in the reply, for screen mode's glow
  let rdNow = null, rdSent = '';
  const readingNow81 = () => (rdNow && fb ? rdNow : null);
  // part: the stretch being read (as it went to the voice); at: the character the voice is on
  function readPos(part, at) {
    rdNow = part ? { part: String(part).slice(0, 4000), at: at || 0, path: location.pathname } : null;
    const k = rdNow ? rdNow.part.length + ':' + rdNow.at + ':' + rdNow.part.slice(0, 40) : '';
    if (k === rdSent) return;
    rdSent = k;
    if (isFloor()) post({ t: 'reading', from: ME, r: rdNow });
  }

  // ---------- 8.2: links in replies, caught and numbered for HQ ----------
  // Newest reply first, in the order they appear in it, so "open" is the first link of the latest reply.
  // Agents write links as [short spoken label](url); the readout says the label, never the address.
  const hostLabel = (u) => { try { const x = new URL(u); return /claude\.ai$/.test(x.hostname) && /\/artifact\//.test(x.pathname) ? 'Claude page' : x.hostname.replace(/^www\./, ''); } catch (e) { return 'link'; } };
  function chatLinks() {
    const ms = [...replies()], out = [];
    for (let i = ms.length - 1; i >= 0 && out.length < 40; i--) {
      for (const a of ms[i].querySelectorAll('a[href]')) {
        if (ours(a) || a.closest('pre')) continue;
        let url = '';
        try { url = new URL(a.getAttribute('href'), location.href).href; } catch (e) { continue; }
        if (!/^https?:/i.test(url) || out.some((x) => x.url === url)) continue;
        if (url.split('#')[0] === location.href.split('#')[0]) continue;
        let label = (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
        if (!label || /^(?:https?:\/\/|www\.)/i.test(label) || label === url) label = hostLabel(url);
        out.push({ n: out.length + 1, label: label.slice(0, 90), url });
      }
    }
    return out;
  }
  // which practice this chat belongs to: a pin from HQ, else words in its project or title. The words live in
  // Tampermonkey's menu (Links: practice words), on this Mac only, never in the script.
  function projectName() {
    const a = [...document.querySelectorAll('a[href*="/project/"]')].find((x) => !ours(x) && !x.closest('nav, aside, [data-testid="assistant-message"]') && visible(x));
    return a ? (a.innerText || '').trim() : '';
  }
  function bizOfChat() {
    const pin = (lsJson('chf_biz_chat', {}) || {})[location.pathname];
    if (pin) return pin === 'none' ? '' : pin;
    const hay = (projectName() + ' ' + chatTitle()).toLowerCase();
    const words = { 'CHxTLD': String(cfg.bizCh || 'chxtld, clever homes, toby long design'), 'ANDRE MANDEL': String(cfg.bizAm || 'andre mandel, andré mandel') };
    for (const b of Object.keys(words)) if (words[b].split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).some((k) => hay.includes(k))) return b;
    return '';
  }
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Links: CHxTLD project words', () => {
        const v = window.prompt('Words that mark a chat as CHxTLD (its project name or title), separated by commas. Kept on this Mac only.', cfg.bizCh || 'chxtld, clever homes, toby long design');
        if (v !== null) { cfg.bizCh = v; save(cfg); linksPush(true); }
      });
      GM_registerMenuCommand('Links: ANDRÉ MANDEL project words', () => {
        const v = window.prompt('Words that mark a chat as ANDRÉ MANDEL (its project name or title), separated by commas. Kept on this Mac only.', cfg.bizAm || 'andre mandel, andré mandel');
        if (v !== null) { cfg.bizAm = v; save(cfg); linksPush(true); }
      });
    }
  } catch (e) {}
  let linksSig = '', linksAt = 0;
  function linksPush(force) {
    if (tabOff || !composer()) return;
    const links = chatLinks(), title = chatTitle();
    const m = { t: 'links', from: ME, title, name: shortName(title), path: location.pathname, biz: bizOfChat(), links };
    const sig = JSON.stringify([m.path, m.biz, title, links]);
    if (!force && sig === linksSig && Date.now() - linksAt < 30000) return;
    linksSig = sig; linksAt = Date.now();
    post(m);
  }
  // "open", "open two": the latest reply's links first; HQ shows the page, or this tab opens it
  let pageAsk = null;
  function openLink(n) {
    const L = chatLinks();
    if (!L.length) return say('No links in this chat.');
    const x = L[(n || 1) - 1];
    if (!x) return say('This chat has ' + (L.length === 1 ? 'one link.' : L.length + ' links.'));
    const tok = Math.random().toString(36).slice(2);
    pageAsk = { tok, x };
    post({ t: 'page-open', from: ME, url: x.url, label: x.label, n: x.n, biz: bizOfChat() });
    setTimeout(() => {
      if (!pageAsk || pageAsk.tok !== tok) return;
      pageAsk = null;   // no screen mode open: a tab instead
      try { GM_openInTab(x.url, { active: true, insert: true }); } catch (e) { window.open(x.url, '_blank'); }
      say('Opening ' + x.label + ' in a tab.');
    }, 1500);
  }

  // ---------- Swipe Deck by voice (7.9) ----------
  // The Swipe Deck page tells the claude.ai page around it which card is on top. Here that card is
  // read aloud and your answer goes back: yes, no, TBD, back one. It listens with Chrome's own
  // speech recognition, since a deck tab has no message box to dictate into.
  const DECK_URL = 'https://claude.ai/artifact/CbVwPd6sZh5MH2A7NUeMGP';
  const DK = { present: false, src: null, st: null, on: false, readId: '', prefix: '', rec: null, gen: 0,
    busy: false, misses: 0, cueArmed: false, micBlocked: false, waitAck: null, told: false, clearSaid: '' };
  const SRX = window.SpeechRecognition || window.webkitSpeechRecognition;
  const bizName = (b) => b === 'CHxTLD' ? 'Clever Homes' : b === 'ANDRE MANDEL' ? 'André Mandel' : 'no business tag';
  function deckSend(cmd, extra) {
    if (!DK.src) return false;
    try { DK.src.postMessage(Object.assign({ type: 'swipedeck:cmd', v: 1, cmd }, extra || {}), '*'); return true; } catch (e) { return false; }
  }
  // the deck may load before this page listens, so say hello into every frame for a while
  function pingFrames(w, depth) {
    if (depth > 4) return;
    let n = 0; try { n = w.length; } catch (e) { return; }
    for (let i = 0; i < n; i++) {
      try { w[i].postMessage({ type: 'swipedeck:cmd', v: 1, cmd: 'hello' }, '*'); pingFrames(w[i], depth + 1); } catch (e) {}
    }
  }
  let pings = 0;
  const pingTimer = setInterval(() => { if (DK.present || ++pings > 45) { clearInterval(pingTimer); return; } pingFrames(window, 0); }, 2000);
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object' || typeof d.type !== 'string' || d.type.indexOf('swipedeck:') !== 0) return;
    DK.src = e.source;
    if (!DK.present) { DK.present = true; dlog('deck', 'found'); deckFound(); }
    if (d.type === 'swipedeck:hello') { deckSend('hello'); return; }
    if (d.type === 'swipedeck:touch') { if (!tabOff && !isFloor()) takeFloor('deck touch'); return; }
    if (d.type === 'swipedeck:key') { if (DK.on) deckStop(false); else deckStart('keys'); return; }
    if (d.type === 'swipedeck:state') { DK.st = d; onDeckState(d); deckRelay(); }
  });
  // 8.1: screen mode shows the deck too, so the tab holding it tells everyone what's on top
  const deckTabs = new Map();   // other tabs holding a deck, and when they last said so
  function deckRelay() {
    if (!DK.present || !DK.st) return;
    post({ t: 'deck', from: ME, on: !!DK.on, st: { loaded: !!DK.st.loaded, deck: DK.st.deck, remaining: DK.st.remaining || 0, card: DK.st.card || null,
      canBack: !!DK.st.canBack, nAudio: DK.st.nAudio || 0, nVisual: DK.st.nVisual || 0, status: DK.st.status || '' } });
  }
  setInterval(() => { if (DK.present) { post({ t: 'deck-here', id: ME }); deckRelay(); } }, 5000);
  function deckFromScreen(m) {
    if (!DK.present) return;
    const cmd = m.cmd;
    if (cmd === 'start') { if (!DK.on) deckStart('screen'); return; }
    if (cmd === 'stop') { if (DK.on) deckStop(false); return; }
    const card = DK.st && DK.st.card;
    if ((cmd === 'yes' || cmd === 'no' || cmd === 'tbd' || cmd === 'move') && (!card || (m.id && m.id !== card.id))) { deckSend('hello'); return; }   // only the card on screen
    const extra = cmd === 'deck' ? { deck: m.deck === 'audio' ? 'audio' : 'visual' } : card && cmd !== 'back' ? { id: card.id } : {};
    post({ t: 'deck-act', cmd });
    if (DK.on) {   // the voice review is running: answer it the way your voice would, and it reads the next card
      DK.prefix = { yes: 'Yes.', no: 'No.', tbd: 'Holding.', back: 'Back one.', move: 'Saved for your screen.', deck: '' }[cmd] || '';
      if (cmd === 'deck') DK.clearSaid = '';
      hush(); DK.gen++;
      deckAct(cmd, extra);
    } else deckSend(cmd, extra);
  }
  function deckFound() {
    let auto = 0;
    try { auto = +GM_getValue('chf_deck_auto', 0) || 0; } catch (e) {}
    if (auto && Date.now() - auto < 90000) { try { GM_setValue('chf_deck_auto', 0); } catch (e) {} setTimeout(() => deckStart('asked'), 600); return; }
    if (!DK.told) { DK.told = true; toast('Swipe Deck here. Squeeze, or Option Shift V, to review it hands free'); }
  }
  function deckStart(why) {
    if (held) { toast('On hold. Say resume, or click RESUME, first'); return; }   // 8.0
    if (tabOff) { toast('Hands free is off in this tab. Option Shift H turns it on'); return; }
    if (!DK.present) { openDeck(); return; }
    dlog('deck on', why || '');
    takeFloor('deck');
    hush();
    Object.assign(DK, { on: true, readId: '', prefix: 'Swipe Deck.', misses: 0, micBlocked: false, clearSaid: '' });
    paintPill();
    deckRelay();   // 8.1
    if (!deckSend('hello')) deckSay("I can't reach the deck. Reload this tab.", () => deckStop(true));
  }
  function deckStop(quietly) {
    if (!DK.on) return;
    DK.on = false; DK.gen++; DK.busy = false;
    deckMicOff();
    deckRelay();   // 8.1
    clearTimeout(DK.waitAck);
    dlog('deck off', '');
    paintPill();
    if (!quietly) say('Deck off.');
  }
  function openDeck() {
    try { GM_setValue('chf_deck_auto', Date.now()); } catch (e) {}
    try { GM_openInTab(DECK_URL, { active: true, insert: true }); } catch (e) { window.open(DECK_URL, '_blank'); }
    say('Opening Swipe Deck.');
  }
  // lines in the deck go straight to the voice, and the deck's own ears open after
  async function deckSay(text, then) {
    deckMicOff();
    DK.busy = true;
    const gen = ++DK.gen;
    let ok = false;
    try { const job = speakChain.then(() => speakNow(text)); speakChain = job.catch(() => {}); ok = await job; } catch (e) {}
    if (gen !== DK.gen) return;
    DK.busy = false;
    if (!DK.on) return;
    if (!ok && !ownsFloor()) { dlog('deck', 'lost the floor'); deckStop(true); return; }
    if (then) { then(); return; }
    DK.cueArmed = true;
    deckListen();
  }
  function deckMicOff() {
    const r = DK.rec; DK.rec = null;
    if (r) { r.onend = null; r.onresult = null; r.onerror = null; try { r.abort(); } catch (e) {} }
  }
  function deckListen() {
    if (!DK.on || DK.busy || DK.rec || speaking > 0) return;
    if (!isFloor()) { deckStop(true); return; }
    if (!SRX) { toast('This browser has no speech recognition. Use the arrow keys.'); return; }
    const r = new SRX();
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    DK.rec = r;
    r.onaudiostart = () => { if (DK.cueArmed) { DK.cueArmed = false; try { playCue(); } catch (e) {} } };
    r.onresult = (e) => {
      const res = e.results[e.results.length - 1], alts = [];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      deckMicOff();
      deckHeard(alts);
    };
    r.onerror = (e) => {
      if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) {
        DK.micBlocked = true;
        dlog('deck mic', e.error);
        toast('Chrome blocked the mic here. Click the lock by the address, allow the microphone, then Option Shift V.');
      }
    };
    r.onend = () => {
      if (DK.rec === r) DK.rec = null;
      if (DK.micBlocked) { deckStop(true); return; }
      if (DK.on && !DK.busy) setTimeout(deckListen, 250);
    };
    try { r.start(); } catch (e) { DK.rec = null; setTimeout(deckListen, 800); }
  }
  const DECK_RULES = [
    ['yes', /^(?:yes|yeah|yep|yup|yah|ya|yes please|sure|approve|approved|affirmative|correct|do it|go ahead|go for it|absolutely|ok|okay)\b/],
    ['no', /^(?:no|nope|nah|negative|don't|do not|no thanks|reject|decline|know)\b/],
    ['tbd', /^(?:tbd|t b d|t\.b\.d|tb d|tv d|tvd|t v d|tpd|t p d|pbd|to be determined|hold|hold it|hold that|hold on it|later|skip|pass|maybe|not sure|ask me later|park it|park)\b/],
    ['back', /^(?:go back|back one|back|undo|previous|last one)\b/],
    ['repeat', /^(?:repeat|again|say again|say that again|come again|read it again|read again|one more time|what|huh|pardon)\b/],
    ['details', /^(?:details|detail|more|context|explain|why|tell me more|more info|source|who asked)\b/],
    ['move', /^(?:screen|needs? (?:my )?screen|need to see|move (?:it |this )?to visual|save (?:it |this )?for (?:my )?(?:screen|desk)|at my desk)\b/],
    ['toVisual', /^(?:visual|visual deck|the visual deck|switch to visual|go to visual|visual cards)$/],
    ['toAudio', /^(?:audio|audio deck|the audio deck|switch to audio|go to audio|audio cards)$/],
    ['stop', /^(?:stop|stop deck|pause|quit|exit|that's it|that's all|i'm done|done|end|close)\b/]
  ];
  function deckHeard(alts) {
    if (!DK.on) return;
    dlog('deck heard', alts[0]);
    for (const raw of alts) {
      const t = String(raw || '').toLowerCase().replace(/[.,!?]/g, ' ').replace(/\s+/g, ' ').trim()
        .replace(/^(?:(?:uh+|um+|so|and|hey|claude)\s+)+/, '');
      for (const [cmd, re] of DECK_RULES) {
        const m = t.match(re);
        if (!m) continue;
        DK.misses = 0;
        const card = DK.st && DK.st.card;
        const rest = t.slice(m[0].length).trim().replace(/^(?:and|because|but|note|with a note|so|since|cause)\s+/, '').trim();
        if (cmd === 'yes' || cmd === 'no' || cmd === 'tbd') {
          if (!card) return deckReadNow('');
          const extra = { id: card.id };
          if (rest.split(/\s+/).length >= 3) extra.note = rest.charAt(0).toUpperCase() + rest.slice(1) + '.';
          DK.prefix = { yes: 'Yes.', no: 'No.', tbd: 'Holding.' }[cmd] + (extra.note ? ' Note saved.' : '');
          return deckAct(cmd, extra);
        }
        if (cmd === 'back') {
          if (!DK.st || !DK.st.canBack) return deckSay('Nothing to go back to.');
          DK.prefix = 'Back one.'; return deckAct('back', {});
        }
        if (cmd === 'repeat') return deckReadNow('');
        if (cmd === 'details') return deckDetails();
        if (cmd === 'move') { if (!card) return deckReadNow(''); DK.prefix = 'Saved for your screen.'; return deckAct('move', { id: card.id }); }
        if (cmd === 'toVisual' || cmd === 'toAudio') { DK.prefix = cmd === 'toVisual' ? 'Visual deck.' : 'Audio deck.'; DK.clearSaid = ''; return deckAct('deck', { deck: cmd === 'toVisual' ? 'visual' : 'audio' }); }
        if (cmd === 'stop') return deckStop(false);
      }
    }
    DK.misses++;
    if (DK.misses >= 2) { DK.misses = 0; return deckSay('Say yes, no, T B D, or back one. Details, repeat, or stop.'); }
    deckListen();
  }
  function deckAct(cmd, extra) {
    post({ t: 'deck-act', cmd });   // 8.1: screen mode flings the card the same way
    DK.busy = true; deckMicOff();
    const before = DK.readId;
    deckSend(cmd, extra);
    try { playCue(); } catch (e) {}
    clearTimeout(DK.waitAck);
    // no new card within 4 seconds: ask again and read what's there
    DK.waitAck = setTimeout(() => { if (DK.on && DK.readId === before) { DK.busy = false; DK.readId = ''; deckSend('hello'); } }, 4000);
    setTimeout(() => { if (DK.on && DK.readId === before && !DK.rec && !(speaking > 0)) DK.busy = false; }, 1500);
  }
  function onDeckState(d) {
    if (!DK.on) return;
    if (/^(couldn't|not saved|deck is full|lost the live)/i.test(d.status || '') && d.status !== DK.lastBad) { DK.lastBad = d.status; deckSay(d.status); return; }
    const c = d.card;
    if (!c) {
      clearTimeout(DK.waitAck);
      if (!d.loaded) return;
      const other = d.deck === 'audio' ? (d.nVisual || 0) : (d.nAudio || 0);
      const key = d.deck + '|' + other;
      if (DK.clearSaid === key) return;
      DK.clearSaid = key; DK.readId = '';
      const lead = (DK.prefix ? DK.prefix + ' ' : '') + (d.deck === 'audio' ? 'Audio deck clear.' : 'Visual deck clear.');
      DK.prefix = '';
      if (other) return deckSay(lead + ' ' + other + (d.deck === 'audio' ? ' visual' : ' audio') + (other === 1 ? ' card waits.' : ' cards wait.') + ' Say ' + (d.deck === 'audio' ? 'visual' : 'audio') + ' to go through them, or stop.');
      return deckSay(lead + ' All clear. Deck off.', () => deckStop(true));
    }
    DK.clearSaid = '';
    if (c.id === DK.readId) return;
    clearTimeout(DK.waitAck);
    DK.readId = c.id;
    const p = DK.prefix; DK.prefix = '';
    deckRead(c, d, p);
  }
  function deckRead(c, d, prefix) {
    const n = d.remaining || 1;
    const bits = [prefix, (c.project || 'General') + ', ' + bizName(c.business) + '.', n === 1 ? 'Last one.' : n + ' to go.'];
    if (+c.priority === 1) bits.push('Priority one.');
    bits.push(String(c.question || 'No question text.').trim());
    if (c.context) bits.push(String(c.context).trim());
    deckSay(bits.filter(Boolean).join(' '));
  }
  function deckReadNow(prefix) {
    const d = DK.st;
    if (!d || !d.card) { DK.readId = ''; DK.clearSaid = ''; deckSend('hello'); return; }
    deckRead(d.card, d, prefix);
  }
  function deckDetails() {
    const c = DK.st && DK.st.card;
    if (!c) return deckReadNow('');
    const bits = [c.context || 'No extra context.'];
    if (c.source) bits.push('Source, ' + c.source + '.');
    if (c.agent) bits.push('Asked by ' + c.agent + '.');
    bits.push('Yes, no, or T B D?');
    deckSay(bits.join(' '));
  }
  function deckSqueeze() {
    if (!DK.on) { deckStart('squeeze'); return; }
    hush(); DK.gen++; DK.busy = false;
    deckReadNow('');
  }

  // ---------- 9.0: Chief of Staff ----------
  // The Chief of Staff board tells the claude.ai tab around it what's on it: the morning brief, the
  // counts and Start Here. That tab passes it to every tab, so HQ draws the COS wedge and the chat
  // you're talking to can read the brief aloud. Mark done goes back the same way, and undo reopens.
  const CHIEF_URL = 'https://claude.ai/artifact/JJjN3PuusV1pH3UF9D6ndX';
  const CH = { present: false, src: null, st: null, asked: new Map(), launched: new Set() };   // this tab holds the board
  const CHF = { st: null, from: '', at: 0, list: [], readAt: 0, closed: null, want: '', wantAt: 0, openAt: 0, toks: new Map() };   // the board as this tab hears it
  function chiefSend(cmd, extra) {
    if (!CH.src) return false;
    try { CH.src.postMessage(Object.assign({ type: 'chief:cmd', v: 1, cmd }, extra || {}), '*'); return true; } catch (e) { return false; }
  }
  // the board may load before this page listens, so say hello into its frames for a while
  function chiefPing(w, depth) {
    if (depth > 4) return;
    let n = 0; try { n = w.length; } catch (e) { return; }
    for (let i = 0; i < n; i++) {
      try { w[i].postMessage({ type: 'chief:cmd', v: 1, cmd: 'hello' }, '*'); chiefPing(w[i], depth + 1); } catch (e) {}
    }
  }
  if (/\/artifact\//.test(location.pathname)) {
    let cps = 0;
    const cpT = setInterval(() => { if (CH.present || ++cps > 45) { clearInterval(cpT); return; } chiefPing(window, 0); }, 2000);
  }
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object' || typeof d.type !== 'string' || d.type.indexOf('chief:') !== 0 || e.source === window) return;
    CH.src = e.source;
    if (!CH.present) { CH.present = true; dlog('chief', 'found'); }
    if (d.type === 'chief:hello') { chiefSend('hello'); return; }
    if (d.type === 'chief:launch' && d.th) { chiefLaunchFromBoard(d.th); return; }   // 9.1
    if (d.type === 'chief:state') { CH.st = d; chiefRelay(); return; }
    if (d.type === 'chief:ack') {
      const to = CH.asked.get(d.token); CH.asked.delete(d.token);
      const m = { t: 'chief-ack', to: to || '', token: d.token, cmd: d.cmd, id: d.id, ok: !!d.ok, why: d.why || '', title: d.title || '' };
      if (to === ME) chiefAcked(m); else if (to) post(m);
    }
  });
  function chiefRelay() {
    if (!CH.present || !CH.st) return;
    const s = CH.st;
    const st = { loaded: !!s.loaded, canWrite: !!s.canWrite, brief: s.brief || null, counts: s.counts || {},
      start: Array.isArray(s.start) ? s.start.slice(0, 8) : [], note: String(s.note || '') };
    post({ t: 'chief', from: ME, st });
    chiefHeard({ from: ME, st });   // a channel never hears itself
  }
  setInterval(() => { if (CH.present) chiefRelay(); }, 5000);
  const chiefAlive = () => !!CHF.st && Date.now() - CHF.at < 20000;
  function chiefHeard(m) {
    CHF.st = m.st; CHF.from = m.from; CHF.at = Date.now();
    if (CHF.want && m.st.loaded && Date.now() - CHF.wantAt < 45000) { const w = CHF.want; CHF.want = ''; chiefSay(w); }
  }
  // a command from HQ or another tab, for the board this tab holds
  function chiefFromTab(m) {
    if (!CH.present) { if (m.from) post({ t: 'chief-ack', to: m.from, token: m.token, cmd: m.cmd, id: m.id, ok: false, why: 'closed' }); return; }
    if (m.cmd !== 'done' && m.cmd !== 'undo') return;
    CH.asked.set(m.token, m.from);
    chiefSend(m.cmd, { id: m.id, status: m.status || '', token: m.token });
  }
  // 9.1: Open chat on a board card. HQ takes it when it's open; otherwise this tab opens the chat, or a new one
  // with the thread typed in and not sent
  const chiefSeedText = (t) => {
    const lane = { 'CHxTLD': 'CHxTLD', 'ANDRE MANDEL': 'ANDRÉ MANDEL', 'PERSONAL': 'Personal' }[t.business] || '';
    return 'Chief of Staff thread' + (lane ? ', ' + lane : '') + (t.project ? ', ' + t.project : '') + ': ' + (t.title || 'Untitled') + '.' +
      (t.next ? ' Next: ' + t.next : '') + (t.link ? ' Link: ' + t.link : '');
  };
  function chiefLaunchFromBoard(th) {
    const token = Math.random().toString(36).slice(2, 10);
    post({ t: 'chief-launch', from: ME, th, token });
    setTimeout(() => {
      if (CH.launched.delete(token)) return;
      const link = String(th.link || '');
      if (/^https:\/\/claude\.ai\/chat\/[0-9a-f-]{36}/.test(link)) { try { GM_openInTab(link, { active: true, insert: true }); } catch (e) { window.open(link, '_blank'); } return; }
      const at = Date.now();
      try { GM_openInTab('https://claude.ai/new', { active: true, insert: true }); } catch (e) { window.open('https://claude.ai/new', '_blank'); }
      let tries = 0;
      const iv = setInterval(() => {
        const e = listTabs().find((x) => x.path === '/new' && (x.born || 0) >= at - 1500);
        if (e) { clearInterval(iv); setTimeout(() => post({ t: 'deliver', to: e.id, from: ME, token: Math.random().toString(36).slice(2), files: [], text: chiefSeedText(th), send: false }), 600); }
        else if (++tries > 60) clearInterval(iv);
      }, 500);
    }, 1500);
  }
  function chiefAsk(cmd, t) {
    const token = Math.random().toString(36).slice(2, 10);
    CHF.toks.set(token, { cmd, t });
    const m = { t: 'chief-cmd', to: CHF.from, from: ME, cmd, id: t.id, status: t.status || '', token };
    if (CHF.from === ME) chiefFromTab(m); else post(m);
    setTimeout(() => { if (CHF.toks.delete(token)) say("Chief didn't answer. Check the board."); }, 9000);
  }
  // spoken lines
  const chiefBizWord = (b) => b === 'CHxTLD' ? 'Clever Homes' : b === 'ANDRE MANDEL' ? 'André Mandel' : b === 'PERSONAL' ? 'personal' : '';
  const chiefEnd = (x) => { x = String(x || '').trim(); return !x ? '' : /[.!?]$/.test(x) ? x : x + '.'; };
  function chiefDueWords(t) {
    if (!t.due) return '';
    const d = new Date(t.due + 'T12:00:00'), t0 = new Date();
    if (isNaN(d)) return '';
    t0.setHours(12, 0, 0, 0);
    const days = Math.round((d - t0) / 864e5);
    return days < 0 ? 'Overdue.' : days === 0 ? 'Due today.' : days === 1 ? 'Due tomorrow.' : 'Due in ' + days + ' days.';
  }
  function chiefOpen(want) {
    CHF.want = want; CHF.wantAt = Date.now();
    if (Date.now() - CHF.openAt < 20000) return say('Chief of Staff is opening. One moment.');
    CHF.openAt = Date.now();
    try { GM_openInTab(CHIEF_URL, { active: false, insert: true }); } catch (e) { window.open(CHIEF_URL, '_blank'); }
    return say('Opening Chief of Staff. One moment.');
  }
  function chiefSay(what) { return what === 'needs' ? chiefNeeds() : chiefBrief(); }
  function chiefBrief() {
    if (!chiefAlive()) return chiefOpen('brief');
    const s = CHF.st;
    if (!s.loaded) { CHF.want = 'brief'; CHF.wantAt = Date.now(); return say('Chief is still loading. One moment.'); }
    const b = s.brief, c = s.counts || {};
    const bits = ['Chief of Staff.'];
    if (b && b.headline) bits.push(chiefEnd(b.headline));
    else bits.push('No brief yet today.');
    if (b && Array.isArray(b.items)) b.items.slice(0, 6).forEach((x) => bits.push(chiefEnd(x)));
    const nn = (c.needs || 0) + (c.blocked || 0);
    bits.push(nn ? (c.needs || 0) + ' need you' + (c.blocked ? ', ' + c.blocked + ' blocked' : '') + ', ' + (c.running || 0) + ' running.' : 'Nothing needs you. ' + (c.running || 0) + ' running.');
    if (nn) bits.push('Say what needs me to hear them.');
    return say(bits.join(' '));
  }
  function chiefNeeds() {
    if (!chiefAlive()) return chiefOpen('needs');
    const s = CHF.st;
    if (!s.loaded) { CHF.want = 'needs'; CHF.wantAt = Date.now(); return say('Chief is still loading. One moment.'); }
    const all8 = (s.start || []).slice(0, 8), list = all8.slice(0, 5);   // 9.1: HQ shows eight, so done six works too
    CHF.list = all8.map((t) => Object.assign({}, t, { gone: false })); CHF.readAt = Date.now();
    if (!list.length) return say('Nothing needs you on the Chief board.');
    const total = (s.counts.needs || 0) + (s.counts.blocked || 0);
    const bits = ['Start here.', total === 1 ? 'One thread.' : total + ' threads' + (total > list.length ? ', here are the first ' + list.length + '.' : '.')];
    list.forEach((t, i) => {
      bits.push('Number ' + (i + 1) + '.');
      const where = [t.project, chiefBizWord(t.business)].filter(Boolean).join(', ');
      if (t.status === 'blocked') bits.push('Blocked.');
      if (where) bits.push(chiefEnd(where));
      bits.push(chiefEnd(t.title || 'Untitled thread'));
      if (t.next) bits.push(chiefEnd(t.next));
      const due = chiefDueWords(t); if (due) bits.push(due);
    });
    bits.push(list.length === 1 ? 'Say done to close it.' : 'Say done and the number to close one.');
    return say(bits.join(' '));
  }
  function chiefDone(n) {
    if (!CHF.list.length || Date.now() - CHF.readAt > 10 * 60000) return say('Say what needs me first, then done and the number.');
    if (!n) { if (CHF.list.length === 1) n = 1; else return say('Which one? Say done and the number, 1 to ' + CHF.list.length + '.'); }
    const t = CHF.list[n - 1];
    if (!t) return say('There is no number ' + n + '. I read ' + CHF.list.length + '.');
    if (t.gone) return say('Number ' + n + ' is already closed.');
    if (!chiefAlive()) return say("Chief of Staff isn't open, so I can't close it. Say chief to open it.");
    if (!CHF.st.canWrite) return say("Chief is read only in that tab, so I can't close it.");
    t.n = n;
    chiefAsk('done', t);
  }
  function chiefUndo() {
    const c = CHF.closed;
    if (!c || Date.now() - c.at > 3 * 60000) return say('Nothing to undo.');
    if (!chiefAlive()) return say("Chief of Staff isn't open, so I can't reopen it.");
    chiefAsk('undo', c.t);
  }
  function chiefAcked(m) {
    const p = CHF.toks.get(m.token);
    if (!p) return;
    CHF.toks.delete(m.token);
    const title = String(m.title || p.t.title || 'that thread');
    if (p.cmd === 'done') {
      if (!m.ok) return say(m.why === 'gone' ? 'That thread is already gone from the board.' : m.why === 'readonly' ? "Chief is read only in that tab, so I couldn't close it." : m.why === 'closed' ? "Chief of Staff closed, so I couldn't close it." : "I couldn't close it. Try Mark done on the board.");
      p.t.gone = true;
      CHF.closed = { t: p.t, at: Date.now() };
      return say('Closed number ' + (p.t.n || '') + '. ' + chiefEnd(title) + ' Say undo to reopen it.');
    }
    if (!m.ok) return say("I couldn't reopen it. It's under Closed on the board.");
    p.t.gone = false; CHF.closed = null;
    return say('Reopened. ' + chiefEnd(title));
  }
  // "done", "done two", "two is done", "mark three done", "close number one", only right after Start Here was read
  const CHIEF_N = { one: 1, won: 1, first: 1, '1': 1, two: 2, to: 2, too: 2, second: 2, '2': 2, three: 3, third: 3, '3': 3, four: 4, for: 4, fourth: 4, '4': 4, five: 5, fifth: 5, '5': 5, six: 6, sixth: 6, '6': 6, seven: 7, seventh: 7, '7': 7, eight: 8, eighth: 8, ate: 8, '8': 8 };
  const CHIEF_NW = '(one|won|first|1|two|to|too|second|2|three|third|3|four|for|fourth|4|five|fifth|5|six|sixth|6|seven|seventh|7|eight|eighth|ate|8)';
  const CHIEF_DONE_RES = [
    new RegExp('^(?:mark |close |finish )?(?:number |thread |item )?' + CHIEF_NW + '(?: is| as)? (?:done|closed|finished|complete|completed)$'),
    new RegExp('^(?:done|close|closed|mark done|mark|finished|complete|done with)(?: number| thread| item)? ' + CHIEF_NW + '(?: done| as done)?$')
  ];
  function chiefDoneSaid(flat) {
    if (!CHF.list.length || Date.now() - CHF.readAt > 10 * 60000) return null;
    for (const re of CHIEF_DONE_RES) { const m = flat.match(re); if (m) return { kind: 'chiefDone', n: CHIEF_N[m[1]] || 0 }; }
    if (/^(?:done|that's done|thats done|it's done|its done|that one's done|that one is done|mark done|mark it done|mark that done|mark it as done|mark that as done|mark that one done)$/.test(flat)) return { kind: 'chiefDone', n: 0 };
    return null;
  }
  const CHIEF_SAID = /^(?:(?:open|read|run|play|give me|start|pull up|bring up|show me|read me|let's hear|lets hear|what's|whats|what is|what does|check)\s+)?(?:the\s+|my\s+)?(?:chief|chief of staff|chiefs|chief's|chief of staff's)(?:\s+(?:brief|briefing|update|report|board|status|say|says))?(?:\s+(?:please|now))*$|^(?:(?:read|play|give me|what's|whats|what is)\s+)?(?:the\s+|my\s+|today's\s+|todays\s+)?(?:morning |daily )?(?:brief|briefing)(?:\s+(?:please|now))*$/;
  const CHIEF_NEEDS = /^(?:(?:what|whats|what's|what is)\s+(?:needs|need|is waiting on|waiting on|waits on|is waiting for|waiting for|needs a call from)\s+me(?:\s+(?:today|now|first))?|what needs me|what's on my plate|whats on my plate|start here|read start here|(?:chief|chief of staff)(?:'s)? start here)(?:\s+please)?$/;

  // ---------- 9.1: CHxTLD Outbox ----------
  // The Outbox page tells the claude.ai tab around it which drafts it holds. That tab passes them to every tab,
  // so HQ draws the OUT wedge and an editor over the pie, and "outbox" reads them aloud in any chat.
  // HQ only ever saves a draft's subject and body back. Nothing here sends mail or touches Gmail.
  // 9.4: two lanes. "ch" is the CHxTLD Outbox, "am" the ANDRÉ MANDEL Outbox. Each page says which it is (the CHxTLD
  // page predates lanes, so no lane means ch); every relay, save and answer carries the lane, so the two never mix.
  const OX_URLS = { ch: 'https://claude.ai/artifact/S1cg22eqDYW7qKScqj3gRn', am: 'https://claude.ai/artifact/NZ5VthFKGWUwMEWSoXKxCy' };
  const OX_SPOKEN = { ch: 'The Clever Homes outbox', am: 'The André Mandel outbox' };
  const oxLane = (x) => (x === 'am' ? 'am' : 'ch');
  const OXL = { ch: { present: false, src: null, st: null, asked: new Map() }, am: { present: false, src: null, st: null, asked: new Map() } };   // the Outbox this tab holds
  const OXFL = { ch: { st: null, from: '', at: 0, openAt: 0, want: '', wantN: 0, wantAt: 0 }, am: { st: null, from: '', at: 0, openAt: 0, want: '', wantN: 0, wantAt: 0 } };   // as this tab hears them
  const OXR = { list: [], lane: 'ch', readAt: 0 };   // the last list read aloud
  function oxSend(lane, cmd, extra) {
    const X = OXL[lane];
    if (!X.src) return false;
    try { X.src.postMessage(Object.assign({ type: 'outbox:cmd', v: 1, lane, cmd }, extra || {}), '*'); return true; } catch (e) { return false; }
  }
  function oxPing(w, depth) {
    if (depth > 4) return;
    let n = 0; try { n = w.length; } catch (e) { return; }
    for (let i = 0; i < n; i++) {
      try { w[i].postMessage({ type: 'outbox:cmd', v: 1, cmd: 'hello' }, '*'); oxPing(w[i], depth + 1); } catch (e) {}
    }
  }
  if (/\/artifact\//.test(location.pathname)) {
    let ops = 0;
    const opT = setInterval(() => { if (OXL.ch.present || OXL.am.present || ++ops > 45) { clearInterval(opT); return; } oxPing(window, 0); }, 2000);
  }
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object' || typeof d.type !== 'string' || d.type.indexOf('outbox:') !== 0 || d.type === 'outbox:cmd' || e.source === window) return;
    const lane = oxLane(d.lane), X = OXL[lane];
    X.src = e.source;
    if (!X.present) { X.present = true; dlog('outbox', 'found ' + lane); }
    if (d.type === 'outbox:hello') { oxSend(lane, 'hello'); return; }
    if (d.type === 'outbox:state') { X.st = d; oxRelay(lane); return; }
    if (d.type === 'outbox:ack') {
      const to = X.asked.get(d.token); X.asked.delete(d.token);
      const cur = d.current && typeof d.current === 'object' ? { subject: String(d.current.subject || ''), body: String(d.current.body || '') } : null;
      if (to) post({ t: 'outbox-ack', lane, to, token: d.token, cmd: d.cmd, id: d.id, ok: !!d.ok, why: String(d.why || ''), current: cur, at: String(d.at || '') });
    }
  });
  const oxStr = (x, n) => String(x == null ? '' : x).slice(0, n);
  function oxRelay(lane) {
    const X = OXL[lane];
    if (!X.present || !X.st) return;
    const s = X.st, c = s.counts || {};
    const drafts = (Array.isArray(s.drafts) ? s.drafts : []).slice(0, 24).map((d) => ({
      id: oxStr(d.id, 120), subject: oxStr(d.subject, 400), body: oxStr(d.body, 40000), to: oxStr(d.to, 600), cc: oxStr(d.cc, 600), thread: oxStr(d.thread, 300),
      status: d.status === 'sent' ? 'sent' : d.status === 'hold' ? 'hold' : 'ready', order: +d.order || 99,
      updated_at: oxStr(d.updated_at, 40), edited_by: oxStr(d.edited_by, 120), sent_at: oxStr(d.sent_at, 40), chat: oxStr(d.chat, 200) }));
    const st = { loaded: !!s.loaded, canWrite: !!s.canWrite, drafts, counts: { ready: +c.ready || 0, hold: +c.hold || 0, sent: +c.sent || 0, total: +c.total || drafts.length },
      sigHtml: oxStr(s.sigHtml, 12000), sigText: oxStr(s.sigText, 2000), note: oxStr(s.note, 300) };
    post({ t: 'outbox', lane, from: ME, st });
    oxHeard({ lane, from: ME, st });   // a channel never hears itself
  }
  setInterval(() => { for (const l of ['ch', 'am']) if (OXL[l].present) oxRelay(l); }, 5000);
  // a save from HQ, for the Outbox this tab holds
  function oxFromTab(m) {
    if (m.cmd !== 'save') return;
    const lane = oxLane(m.lane), X = OXL[lane];
    if (!X.present) { if (m.from) post({ t: 'outbox-ack', lane, to: m.from, token: m.token, cmd: m.cmd, id: m.id, ok: false, why: 'closed' }); return; }
    X.asked.set(m.token, m.from);
    oxSend(lane, 'save', { id: m.id, subject: String(m.subject == null ? '' : m.subject), body: String(m.body == null ? '' : m.body), base: m.base || null, force: !!m.force, token: m.token });
  }
  const oxAliveT = (lane) => !!OXFL[lane].st && Date.now() - OXFL[lane].at < 20000;
  function oxHeard(m) {
    const lane = oxLane(m.lane), F = OXFL[lane];
    F.st = m.st; F.from = m.from; F.at = Date.now();
    if (F.want && m.st.loaded && Date.now() - F.wantAt < 45000) { const w = F.want, n = F.wantN; F.want = ''; if (w === 'read') oxRead(n, lane); else oxList(lane); }
  }
  // spoken lines
  const oxWhoSaid = (s) => String(s || '').split(',').map((x) => { x = x.trim(); const mm = x.match(/^"?([^"<]+?)"?\s*</); return mm ? mm[1].trim() : x.replace(/@.*$/, ''); }).filter(Boolean).join(' and ');
  const oxOpenDrafts = (lane) => (OXFL[lane].st.drafts || []).filter((d) => d.status !== 'sent')
    .sort((a, b) => ((b.chat === location.pathname) - (a.chat === location.pathname)) || String(b.updated_at || '').localeCompare(String(a.updated_at || '')));   // 9.5.1
  function oxOpen(lane, want, n) {
    const F = OXFL[lane], nm = OX_SPOKEN[lane];
    F.want = want; F.wantN = n || 0; F.wantAt = Date.now();
    if (Date.now() - F.openAt < 20000) return say(nm + ' is opening. One moment.');
    F.openAt = Date.now();
    try { GM_openInTab(OX_URLS[lane], { active: false, insert: true }); } catch (e) { window.open(OX_URLS[lane], '_blank'); }
    return say('Opening ' + nm.replace(/^The/, 'the') + '. One moment.');
  }
  function oxList(lane) {
    lane = oxLane(lane);
    if (!oxAliveT(lane)) return oxOpen(lane, 'list');
    const s = OXFL[lane].st, nm = OX_SPOKEN[lane];
    if (!s.loaded) { OXFL[lane].want = 'list'; OXFL[lane].wantAt = Date.now(); return say(nm + ' is still loading. One moment.'); }
    post({ t: 'ox-show', lane });   // HQ opens the drafts over the pie
    const ds = oxOpenDrafts(lane), c = s.counts || {};
    OXR.list = ds.map((d) => d.id); OXR.lane = lane; OXR.readAt = Date.now();
    if (!ds.length) return say(nm + ' is empty.');
    const bits = [nm + '.', (c.ready || 0) + ' ready' + (c.hold ? ', ' + c.hold + ' on hold' : '') + '.'];
    ds.slice(0, 6).forEach((d, i) => bits.push('Number ' + (i + 1) + ', ' + (d.status === 'hold' ? 'on hold' : 'ready') + ', to ' + (oxWhoSaid(d.to) || 'no one yet') + '. ' + chiefEnd(d.subject || 'No subject')));
    bits.push(ds.length === 1 ? 'Say read the draft to hear it.' : 'Say read draft and the number to hear one.');
    return say(bits.join(' '));
  }
  function oxRead(n, lane) {
    const fresh = OXR.list.length && Date.now() - OXR.readAt < 10 * 60000;
    lane = oxLane(lane || (fresh ? OXR.lane : 'ch'));
    if (!oxAliveT(lane)) return oxOpen(lane, 'read', n);
    const s = OXFL[lane].st, nm = OX_SPOKEN[lane];
    if (!s.loaded) { OXFL[lane].want = 'read'; OXFL[lane].wantN = n || 0; OXFL[lane].wantAt = Date.now(); return say(nm + ' is still loading. One moment.'); }
    const ds = oxOpenDrafts(lane);
    const ids = fresh && OXR.lane === lane ? OXR.list : ds.map((d) => d.id);
    if (!ids.length) return say(nm + ' is empty.');
    if (!n) { if (ids.length === 1) n = 1; else return say('Which one? Say read draft and the number, 1 to ' + ids.length + '.'); }
    const d = (s.drafts || []).find((x) => x.id === ids[n - 1]);
    if (!d) return say('There is no draft ' + n + '. ' + nm + ' has ' + ids.length + '.');
    post({ t: 'ox-show', lane });
    return say('Draft ' + n + ', to ' + (oxWhoSaid(d.to) || 'no one yet') + '. ' + chiefEnd(d.subject || 'No subject') + ' ' + String(d.body || '').replace(/\s*\n\s*/g, ' ').trim());
  }
  // 9.4: "mandel outbox", "andre mandel outbox", "practice outbox", "personal outbox" open the ANDRÉ MANDEL Outbox
  const AM_OX_SAID = /^(?:(?:open|read|check|show|show me|pull up|bring up|go to|take me to|what's in|whats in|what is in|read me)\s+)?(?:the\s+|my\s+)?(?:andre mandel|andré mandel|andre|andré|mandel|practice|private practice|personal|a m)(?:'s|s)?\s+(?:outbox|out box)(?:\s+drafts)?(?:\s+(?:please|now))*$/;
  const OX_SAID = /^(?:(?:open|read|check|show|show me|pull up|bring up|go to|take me to|what's in|whats in|what is in|read me)\s+)?(?:the\s+|my\s+)?(?:(?:clever homes|c h x|chx|chxtld|work)\s+)?(?:outbox|out box|outbox drafts|out box drafts)(?:\s+(?:please|now))*$|^(?:read|check|show me|read me)\s+(?:my\s+)?(?:email\s+)?drafts(?:\s+please)?$/;
  const OX_NW = '(one|won|first|1|two|to|too|second|2|three|third|3|four|for|fourth|4|five|fifth|5|six|sixth|6)';
  const OX_N = Object.assign({}, CHIEF_N, { six: 6, sixth: 6, '6': 6 });
  const OX_READ_RES = [
    new RegExp('^(?:read|play|read me|let me hear|hear)(?: me)?(?: the)? (outbox )?draft(?: number)? ' + OX_NW + '(?: please)?$'),
    new RegExp('^(outbox )?draft(?: number)? ' + OX_NW + '$')
  ];
  function oxReadSaid(flat) {
    const fresh = OXR.list.length && Date.now() - OXR.readAt < 10 * 60000;
    for (const re of OX_READ_RES) { const m = flat.match(re); if (m && (fresh || m[1])) return { kind: 'oxRead', n: OX_N[m[2]] || 0 }; }
    if (fresh && /^(?:read|play|read me)(?: me)? (?:the|that|this) draft(?: please)?$/.test(flat)) return { kind: 'oxRead', n: 0 };
    return null;
  }

  function computeLocal() {
    if (location.pathname !== sb.path) { sb.path = location.pathname; restoreChat(); initReady(); }
    const prev = sb.state;
    const comp = compAsk();                      // 8.1: control of the computer, checked before anything else
    const fold = comp ? '' : folderAsk();        // 6.9: checked first; its Allow button isn't a tool approval
    const allow = fold || comp ? null : findAllow();
    const ask = allow || fold || comp ? null : readAsk();
    sb.ask = !!ask;
    sbAskObj = ask;   // 8.1: screen mode shows its choices
    const working = !allow && !fold && !comp && !ask && (isWorking() || streamingByText());
    sb.comp = comp ? comp.apps : null;
    if (comp) {
      idleSince = 0;
      if (prev !== 'red' || sb.reqKey !== comp.key) { sb.since = Date.now(); sb.seen = false; }
      Object.assign(sb, { state: 'red', request: 'wants control of ' + appList(comp.apps), reqKey: comp.key, urgent: false, folder: '' });
    } else if (allow) {
      idleSince = 0;
      const req = requestText(allow), key = reqKeyOf(req);
      if (prev !== 'red' || sb.reqKey !== key) { sb.since = Date.now(); sb.seen = false; }
      Object.assign(sb, { state: 'red', request: req, reqKey: key, urgent: false, folder: '' });
    } else if (fold) {
      idleSince = 0;
      if (prev !== 'red' || sb.folder !== fold) { sb.since = Date.now(); sb.seen = false; }
      Object.assign(sb, { state: 'red', request: '', reqKey: '', urgent: false, folder: fold });
    } else if (working) {
      idleSince = 0;
      if (prev !== 'green') sb.since = Date.now();
      Object.assign(sb, { state: 'green', request: '', reqKey: '', urgent: false, folder: '', seen: true });
    } else {
      if (!idleSince) { idleSince = Date.now(); setTimeout(scheduleCompute, SETTLE_MS + 150); }
      // Claude stopped and stayed stopped: the chat wants you
      if (Date.now() - idleSince >= SETTLE_MS && sb.ready && (prev === 'green' || (prev === 'red' && (!!sb.reqKey || !!sb.folder)))) {
        const u = urgentLine();
        Object.assign(sb, { state: u ? 'red' : 'yellow', since: Date.now(), seen: isFloor(), request: u, reqKey: '', urgent: !!u, folder: '' });
      }
    }
    if (sb.state !== prev) persistChat();
  }
  let computeTimer = null;
  function scheduleCompute() {
    if (computeTimer) return;
    computeTimer = setTimeout(() => { computeTimer = null; computeLocal(); publish(); mirrorPush(); linksPush(); }, 400);
  }

  // ---------- switchboard: talking to the other tabs ----------
  const reg = new Map();
  let bc = null;
  try { bc = new BroadcastChannel('chf-switchboard-v25'); } catch (e) {}
  const post = (m) => { try { if (bc) bc.postMessage(m); } catch (e) {} };

  function myEntry() {
    const title = chatTitle();
    return {
      id: ME, born: BORN, title, name: shortName(title), path: location.pathname,
      state: sb.state, since: sb.since, seen: sb.seen, request: sb.request, reqKey: sb.reqKey, urgent: sb.urgent, folder: sb.folder, ask: !!sb.ask, comp: sb.comp || null,
      on: !tabOff, armed: armedHere(), chat: !!composer(), active: lastActive, ts: Date.now()
    };
  }
  let lastPub = '', lastPubAt = 0;
  function publish(force) {
    const e = myEntry();
    reg.set(ME, e);
    const sig = JSON.stringify(Object.assign({}, e, { ts: 0 }));
    if (force || sig !== lastPub || Date.now() - lastPubAt > 15000) {
      lastPub = sig; lastPubAt = Date.now();
      post({ t: 'state', e });
    }
    paintBoard();
    paintPill();
  }
  function listTabs() {
    const now = Date.now();
    for (const [id, e] of reg) if (id !== ME && now - e.ts > STALE_MS) reg.delete(id);
    return [...reg.values()].filter((e) => e.chat).sort((a, b) => a.born - b.born || (a.id < b.id ? -1 : 1));
  }
  const rankOf = (e) => (e.state === 'red' ? (e.reqKey || e.folder ? 0 : 1) : 2);
  function waitingList() {
    return listTabs().filter((e) => e.on && e.id !== ME && (e.state === 'red' || e.state === 'yellow'))
      .sort((a, b) => rankOf(a) - rankOf(b) || a.since - b.since);
  }

  let pending = null;          // a floor handoff waiting for the other tab to answer
  let pendingApprove = null;   // an approval sent to another tab
  if (bc) bc.onmessage = (ev) => onMsg(ev.data || {});
  function onMsg(m) {
    switch (m.t) {
      case 'hello': publish(true); deckRelay(); chiefRelay(); linksPush(true); break;
      case 'mirror-hello': mirrorPush(true); linksPush(true); break;
      case 'hq-press': if (isFloor() && !tabOff) { dlog('press from HQ', m.kind); pressAct(m.kind); } break;   // 9.5
      case 'page-opened': if (m.to === ME && pageAsk) { const pa = pageAsk; pageAsk = null; say('Opening ' + pa.x.label + '.'); } break;   // 8.2: HQ has it
      case 'biz': if (m.path === location.pathname) linksPush(true); break;
      case 'state':
        if (m.e && m.e.id !== ME) { reg.set(m.e.id, Object.assign({}, m.e, { ts: Date.now() })); paintBoard(); }
        break;
      case 'bye': reg.delete(m.id); paintBoard(); break;
      case 'floor': gotFloor(m); break;
      case 'floor-ack': if (pending && m.token === pending.token) pending = null; break;
      case 'approve':
        // 8.1: Always allow only ever comes from a click in screen mode
        if (m.to === ME) post({ t: 'approved', to: m.from, ok: !tabOff && doApprove(m.key, m.folder, m.from === 'mirror' && m.always === true, m.app || '', m.from === 'mirror'), always: !!m.always });
        break;
      case 'askpick': if (m.to === ME) post({ t: 'askpicked', to: m.from, ok: !tabOff && pickFromScreen(m.key, m.n) }); break;   // 8.1
      case 'deck-start': if (m.to === ME) { if (DK.present) deckStart('screen'); } break;          // 8.1
      case 'deck-cmd': if (m.to === ME) deckFromScreen(m); break;                                    // 8.1
      case 'deck-here': if (m.id !== ME) deckTabs.set(m.id, Date.now()); break;                       // 8.1
      case 'chief': if (m.st && m.from !== ME) chiefHeard(m); break;                                   // 9.0
      case 'chief-cmd': if (m.to === ME) chiefFromTab(m); break;
      case 'chief-ack': if (m.to === ME) chiefAcked(m); break;
      case 'chief-say': if (m.to === ME) chiefSay(m.what); break;
      case 'chief-launch-ack': if (m.to === ME) CH.launched.add(m.token); break;   // 9.1
      case 'outbox': if (m.st && m.from !== ME) oxHeard(m); break;                                     // 9.1
      case 'outbox-cmd': if (m.to === ME) oxFromTab(m); break;
      case 'follow': break;
      case 'approved':
        if (m.to === ME && pendingApprove) { const pa = pendingApprove; pendingApprove = null; say(m.ok ? (pa.comp ? 'Allowed ' + appList(pa.comp) + ' for this session.' : 'Allowed.') : 'That request changed, so I left it alone.'); }
        break;
      case 'deny':
        if (m.to === ME) post({ t: 'denied', to: m.from, ok: !tabOff && doDeny(m.key, m.folder) });
        break;
      case 'denied':
        if (m.to === ME && pendingApprove) { pendingApprove = null; say(m.ok ? 'Denied.' : 'That request changed, so I left it alone.'); }
        break;
      case 'quiet': quiet = m.q || { quiet: false, until: 0 }; paintBoard(); break;
      case 'hold': applyHold(!!m.on); break;   // 8.0
      case 'model':   // 8.8: set this chat's model, then report back
        if (m.from !== ME) setModelHere(m.name).then((r) => post({ t: 'model-ack', to: m.from, token: m.token, id: ME, name: shortName(chatTitle()), ok: r.ok, why: r.why || '' }));
        break;
      case 'model-ack': if (m.to === ME && mdlRun && m.token === mdlRun.token) { mdlRun.acks.push(m); if (mdlRun.acks.length >= mdlRun.expect) mdlFinish(); } break;
      case 'cfg': reloadCfg(); break;          // 8.0: screen mode changed a setting
      case 'front': if (m.to === ME) bringToFront(); break;
      case 'deliver': if (m.to === ME) deliverHere(m); break;   // 8.7
      case 'boot-ack': if (m.to === ME) bootAckAt = Date.now(); break;   // 8.9
    }
  }

  // 8.7: HQ hands this chat files and words. Files land in the message box; words go out with Send
  let deliverChain = Promise.resolve();
  function deliverHere(m) { deliverChain = deliverChain.then(() => deliverNow(m)).catch(() => {}); }
  function composerZone() {
    const c = composer();
    if (!c) return null;
    const s = last(buttons('send'));
    let z = c;
    for (let i = 0; i < 14 && z.parentElement && z.parentElement !== document.body; i++) {
      z = z.parentElement;
      if (s ? z.contains(s) : z.tagName === 'FIELDSET') break;
    }
    for (let i = 0; i < 2 && z.parentElement && z.parentElement !== document.body; i++) z = z.parentElement;
    return z;
  }
  const attCount = (z) => (z ? z.querySelectorAll('img, [data-testid*="file" i], [data-testid*="attach" i], [aria-label*="remove" i]').length : 0);
  async function attachFiles(files) {
    const names = files.map((f) => String(f.name || '').slice(0, 24)).filter(Boolean);
    const dt = () => { const d = new DataTransfer(); files.forEach((f) => d.items.add(f)); return d; };
    const zone = composerZone(), before = attCount(zone);
    const landed = async (ms) => {
      for (let i = 0; i < ms / 150; i++) {
        await sleep(150);
        const z = composerZone();
        if (attCount(z) > before) return true;
        const tx = z ? z.innerText || '' : '';
        if (names.length && names.some((n) => tx.includes(n))) return true;
      }
      return false;
    };
    // 1: Claude's own file picker
    const inp = (zone && zone.querySelector('input[type="file"]')) || document.querySelector('input[data-testid="file-upload"]') ||
      last([...document.querySelectorAll('input[type="file"]')].filter((x) => !ours(x)));
    if (inp) {
      try { inp.files = dt().files; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
      if (await landed(3500)) return 'picker';
    }
    // 2: a paste into the message box
    const c = composer();
    if (c) {
      try { c.focus(); c.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt(), bubbles: true, cancelable: true })); } catch (e) {}
      if (await landed(3000)) return 'paste';
      // 3: a drop on the message box
      try { const d = dt(); for (const ty of ['dragenter', 'dragover', 'drop']) c.dispatchEvent(new DragEvent(ty, { dataTransfer: d, bubbles: true, cancelable: true })); } catch (e) {}
      if (await landed(3000)) return 'drop';
    }
    return '';
  }
  function typeInComposer(text) {
    const c = composer();
    if (!c) return false;
    const had = composerText();
    const add = (had ? (/\s$/.test(had) ? '' : ' ') : '') + text;
    caretToEnd(c);
    let ok = false;
    try { ok = document.execCommand('insertText', false, add); } catch (e) {}
    if (!ok || composerText().length <= had.length) {
      try { const d = new DataTransfer(); d.setData('text/plain', add); caretToEnd(c); c.dispatchEvent(new ClipboardEvent('paste', { clipboardData: d, bubbles: true, cancelable: true })); } catch (e) {}
    }
    return composerText().length > had.length;
  }
  async function sendWhenUploaded() {
    for (let i = 0; i < 400; i++) {   // uploads get about a minute and a half
      await sleep(225);
      const b = last(buttons('send'));
      if (b && !b.disabled && b.getAttribute('aria-disabled') !== 'true') { dlog('HQ sends', composerText().slice(0, 60)); b.click(); return true; }
    }
    return false;
  }
  async function deliverNow(m) {
    const reply = (o) => post(Object.assign({ t: 'delivered', to: m.from || 'mirror', token: m.token, from: ME }, o));
    try {
      if (!composer()) return reply({ ok: false, why: 'no message box in that tab' });
      const files = [...(m.files || [])].filter((f) => f && typeof f.size === 'number');
      let how = '';
      if (files.length) {
        how = await attachFiles(files);
        dlog('HQ files', files.length + ' ' + (how || 'not taken'));
        if (!how) return reply({ ok: false, why: 'Claude did not take the file' });
      }
      if (m.text && !typeInComposer(m.text)) return reply({ ok: false, why: 'could not type in the message box' });
      if (!m.send) return reply({ ok: true, n: files.length, how });
      const ok = await sendWhenUploaded();
      reply({ ok, sent: ok, n: files.length, why: ok ? '' : 'Send never came on. Check the chat' });
    } catch (e) { reply({ ok: false, why: 'something broke: ' + String(e && e.message || e).slice(0, 60) }); }
  }

  function markActive() { lastActive = Date.now(); ssSet('chf_sb_active', String(lastActive)); }
  function bringToFront() {
    // Tampermonkey brings a tab forward when it "highlights" it
    try { if (typeof GM_notification === 'function') GM_notification({ highlight: true, silent: true, timeout: 1 }); } catch (e) {}
  }
  function pauseReading() {
    fbStop();   // 5.1: another tab has the floor now
    const p = last(buttons('pause'));
    if (p) p.click();
    if (agPlaying()) agPause();
  }

  // this tab takes the floor (you clicked or typed here, or it won an election)
  // ---------- screen mode: the floor tab feeds the mirror (2.7) ----------
  let mirrorLast = '', mirrorAt = 0;
  function convoNodes() {
    const all = [...document.querySelectorAll('[data-testid="user-message"], [data-testid="assistant-message"], [data-is-streaming]')]
      .filter((el) => !ours(el)).slice(-24);
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el))).slice(-6);
  }
  function mirrorPush(force) {
    if (!isFloor()) return;
    const now = Date.now();
    if (!force && now - mirrorAt < 500) return;
    const parts = convoNodes().map((n) => n.outerHTML);
    let total = parts.reduce((t, x) => t + x.length, 0);
    while (parts.length > 1 && total > 400000) { total -= parts[0].length; parts.shift(); }
    const p = {
      title: chatTitle(), path: location.pathname, state: sb.state, folder: sb.folder || '',
      reqKey: !!sb.reqKey, urgent: !!sb.urgent, draft: composerText().slice(-800), html: parts.join(''),
      ask: askForScreen(), reading: readingNow81()   // 8.1: question card choices, and where the voice is
    };
    const sig = JSON.stringify(p);
    if (!force && sig === mirrorLast && now - mirrorAt < 10000) return;
    mirrorLast = sig; mirrorAt = now;
    post({ t: 'mirror', from: ME, p });
  }
  function enterScreenMode() {
    try { sessionStorage.setItem(MIRROR_KEY, '1'); } catch (e) {}
    releaseAirPods();
    post({ t: 'bye', id: ME });
    toast('Screen mode on. This tab now mirrors the chat you are talking to.');
    setTimeout(() => location.reload(), 600);
  }

  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Screen mode in this tab', enterScreenMode); } catch (e) {}
  // 8.9: "boot up" from a chat. An open HQ opens your recent chats; with none open, a new tab becomes HQ and boots
  let bootAckAt = 0;
  async function bootFromChat() {
    const t0 = Date.now();
    post({ t: 'boot', from: ME });
    for (let i = 0; i < 12 && bootAckAt < t0; i++) await sleep(100);
    if (bootAckAt >= t0) { say('Booting. Your recent chats are opening behind HQ.'); return; }
    const url = 'https://claude.ai/new?switcheroo=boot';
    try { GM_openInTab(url, { active: true, insert: true }); } catch (e) { try { window.open(url, '_blank', 'noopener'); } catch (x) {} }
    say('Booting. HQ is opening.');
  }
  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Boot: HQ and my 10 most recent chats', bootFromChat); } catch (e) {}
  // 8.6: HQ comes forward when we talk, your video when it plays on (needs the Switcheroo Tabs extension)
  try {
    if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('HQ and video trade places, on or off', () => {
      const on = GM_getValue('chf_tabswap', true) === false;
      GM_setValue('chf_tabswap', on);
      toast(on ? 'HQ and your video will trade places' : 'Tabs stay where they are');
    });
  } catch (e) {}

  // 4.9: bring the chat you land on to the front always, or only when you're looking at Claude
  try {
    if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Always bring chats forward, on or off', () => {
      cfg.frontAlways = cfg.frontAlways !== true; save(cfg);
      toast(cfg.frontAlways ? 'Chats you land on will always come to the front' : 'Chats come to the front only when you are looking at Claude');
    });
  } catch (e) {}

  // 4.5: wipe buttons taught with Option Shift 1 to 5 and go back to finding them by name
  try {
    if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Forget learned buttons', () => {
      ['mic', 'stop', 'speak', 'allow', 'halt'].forEach((k) => { delete cfg[k]; });
      save(cfg);
      toast('Forgot the learned buttons. Reload your other Claude tabs.');
    });
  } catch (e) {}

  function takeFloor(why) {
    if (tabOff) return;
    const had = floorId === ME;
    floorId = ME;
    lsPut(K_FLOOR, { id: ME, ts: Date.now() });
    if (!had) post({ t: 'floor', to: ME, from: ME, why: why || 'touch', token: '' });
    armAirPods();
    markActive();
    if (sb.state === 'yellow' || (sb.state === 'red' && sb.urgent)) { sb.seen = true; persistChat(); }
    publish(true);
    mirrorPush(true);
  }

  // another tab (or this one) moved the floor
  function gotFloor(m) {
    const had = floorId === ME;
    floorId = m.to;
    if (m.to === ME) {
      if (tabOff) { tabOff = false; ssSet(TAB_KEY, '0'); if (!cfg.autoListen) { cfg.autoListen = true; save(cfg); } }
      armAirPods();
      markActive();
      if (sb.state !== 'red' || sb.urgent) sb.seen = true;
      persistChat();
      if (m.token) post({ t: 'floor-ack', token: m.token, id: ME });
      if (m.front) bringToFront();
      publish(true);
      mirrorPush(true);
      if (m.why === 'boot') bootArrival();   // 8.9
      else if (m.why !== 'touch' && m.why !== 'elect') announceArrival();
    } else {
      if (had) { pauseReading(); releaseAirPods(); }
      dropStaleDictation('floor moved to another tab');
      publish();
    }
  }

  // move the floor to another tab: your AirPods, reading and talking go with it
  function handOff(e, why) {
    if (!e) return;
    if (e.id === ME) { takeFloor(why); announceArrival(); return; }
    // 4.9: with Always bring chats forward on, the chat you land on comes to the front even
    // from another app; otherwise only when you're already looking at a Claude chat
    const front = cfg.frontAlways === true || (document.visibilityState === 'visible' && document.hasFocus());
    if (!e.armed) {
      if (front) post({ t: 'front', to: e.id });
      say(e.name + ' needs one click before it can talk.');
      return;
    }
    const token = Math.random().toString(36).slice(2);
    if (floorId === ME) { pauseReading(); releaseAirPods(); dropStaleDictation('handing off'); }
    floorId = e.id;
    lsPut(K_FLOOR, { id: e.id, ts: Date.now() });
    pending = { token, id: e.id, name: e.name };
    post({ t: 'floor', to: e.id, from: ME, why: why || 'switch', front, token });
    publish(true);
    setTimeout(() => {
      if (!pending || pending.token !== token) return;
      pending = null;
      reg.delete(e.id);
      takeFloor('reclaim');
      say("Couldn't reach " + e.name + '. Staying here.');
    }, 3000);
  }

  // if the floor tab closed or went off, the most recently used tab takes over
  const STARTED = Date.now();
  let floorLostAt = 0;
  function checkFloor() {
    if (Date.now() - STARTED < 2500 || pending || tabOff) return;
    const list = listTabs();
    // 6.0: two tabs both thinking they hold the floor: the shared record settles it
    const rec = lsJson(K_FLOOR, null);
    if (floorId === ME && rec && rec.id && rec.id !== ME) {
      if (list.some((e) => e.id === rec.id && e.on)) {
        dlog('gave up the floor to the record', rec.id);
        floorId = rec.id; pauseReading(); releaseAirPods(); dropStaleDictation('record says another tab'); publish(true); paintPill();
      } else takeFloor('reclaim');
      return;
    }
    if (list.some((e) => e.id === floorId && e.on)) { floorLostAt = 0; return; }
    if (!floorLostAt) { floorLostAt = Date.now(); return; }
    if (Date.now() - floorLostAt < 1500) return;
    const c = list.filter((e) => e.on && e.armed)
      .sort((a, b) => (b.active || 0) - (a.active || 0) || (a.id < b.id ? -1 : 1))[0];
    if (c && c.id === ME) { floorLostAt = 0; takeFloor('elect'); }
  }

  // 8.9: Boot handed this chat the floor: say so and open the mic. Anything waiting here is read first.
  async function bootArrival() {
    computeLocal();
    if (sb.state === 'red') { announceArrival(); return; }
    const ok = await say('Switcheroo is up. ' + shortName(chatTitle()) + '.');
    if (!ok) yourTurn();   // the line couldn't play: the mic still opens
  }
  // arriving in a chat by voice: say its name, then read what it wants
  async function announceArrival() {
    askKeyRead = '';   // a question waiting here is read again when you arrive
    computeLocal();
    publish();
    const name = shortName(chatTitle());
    if (sb.state === 'red' && sb.reqKey) { await alertRed(myEntry()); yourTurn(); return; }   // 8.1: computer requests too
    if (sb.state === 'red' && sb.folder) { await announceFolder(myEntry()); yourTurn(); return; }
    if (sb.state === 'red') { await say(name + ', urgent. ' + sb.request); readLatest(); return; }
    if (sb.state === 'green') { await say(name + ', still working.'); yourTurn(); return; }
    await say(name + '.');
    if (await readOnArrival('arrived')) return;   // 8.1: the mic opens when the reading ends
    yourTurn();                                    // 6.3: nothing to read, your turn now
  }
  // 8.1: landing in a chat (next, take me to, a click on HQ) reads its last reply right away.
  // Before, it read only when Claude's own Read aloud button was on screen, so you had to say
  // "read it again". Now it reads the same way "read it" does, unless you're on hold or read aloud is off.
  async function readOnArrival(why) {
    if (held || hardPause || tabOff || !cfg.autoRead) return false;
    for (let i = 0; i < 25 && !replies().length; i++) await sleep(200);   // the chat is still drawing
    if (!replies().length || isWorking() || buttons('stop').length) return false;
    if (readAsk()) return false;   // a question card waiting here is read instead, by yourTurn
    { const all = replies(), lastM = all[all.length - 1];   // 9.5.1: already heard, here or in another tab: don't start it over
      if (lastM && heardRead(headOf(lastM))) { dlog('arrival, last reply already heard, not read again', why || ''); return false; } }
    dlog('read on arrival', why || '');
    readLatest(true);
    return true;
  }
  // ---------- backup voice (5.0) ----------
  // When Claude's read aloud doesn't start (a usage limit, or the button isn't answering), the Mac
  // reads the reply with its own voice, a sentence or two at a time so it can pause for notes.
  let fb = null;   // { parts, i, paused, gen }
  const fbActive = () => !!fb && !fb.paused;
  // 8.7: the reply as plain text, its sentences, and sentences grouped into reading parts
  function replyText(m) {
    const els = [...m.querySelectorAll('p, li, h1, h2, h3, h4, h5, blockquote, td')]
      .filter((e) => !e.closest('pre, button, [aria-hidden="true"], .sr-only, [data-testid="message-actions"]'));   // 6.2: no hidden summary
    const outer = els.filter((e) => !els.some((o) => o !== e && o.contains(e)));
    return (outer.length ? outer.map((e) => e.innerText) : [m.innerText]).join('. ')
      .replace(/^\s*Claude responded:\s*/i, '')
      .replace(/https?:\/\/\S+/g, 'a link').replace(/[`*_#>|]/g, ' ').replace(/\s+/g, ' ').replace(/(\.\s*){2,}/g, '. ').trim();
  }
  // a period inside a number (8.7, 3.5 ft) doesn't end a sentence
  const sentencesOf = (text) => (String(text || '').replace(/(\d)\.(\d)/g, '$1\u2024$2').match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || []).map((y) => y.trim().replace(/\u2024/g, '.')).filter(Boolean);
  function partsOf(sentences, firstMax, restMax) {
    const parts = [];
    let cur = '';
    for (const x of sentences) {
      const max = parts.length ? restMax : firstMax;
      if (cur && (cur + ' ' + x).length > max) { parts.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x;
    }
    if (cur) parts.push(cur);
    return parts;
  }
  function replyParts(m, firstMax, restMax) {
    firstMax = firstMax || 220; restMax = restMax || 220;
    return partsOf(sentencesOf(replyText(m)), firstMax, restMax);
  }
  async function fbPlay() {
    if (!fb) return;
    const me = fb;
    me.paused = false;
    await speakChain;                          // 6.0: let a Switchboard line finish first
    // 6.3: and for an announcement that's still on its chime or its line
    for (let i = 0; i < 130 && (alerting || announcingRed || askReading || speaking > 0); i++) await sleep(150);
    await speakChain;
    if (fb !== me || me.paused) return;
    if (!ownsFloor()) { dlog('reading skipped, not the floor'); fb = null; return; }
    const gen = me.gen = (me.gen || 0) + 1;
    while (fb === me && me.gen === gen && !me.paused && me.i < me.parts.length) {
      let ok;
      if (me.engine === 'el') {
        ok = await elPart(me);
        if (ok === 'fail') {                                   // 5.3: ElevenLabs failed, Claude reads it
          fbStop();
          const sp = last(buttons('speak'));
          if (sp && !claudeIsReading()) sp.click();   // 5.6: never toggle a reading off
          return;
        }
      } else ok = await say(me.parts[me.i]);
      if (fb !== me || me.gen !== gen) return;
      if (!ok) { me.paused = true; return; }   // paused by a squeeze: pick up from this part later
      me.i += 1;
    }
    if (fb === me && me.i >= me.parts.length) {
      fb = null;
      readPos(null);   // 8.1
      // 6.7: stopped at the cap: the rest waits for "keep reading"
      if (me.more && me.more.length) {
        moreRead = { path: location.pathname, parts: me.more, at: Date.now() };
        dlog('read cap', me.more.length + ' parts left');
        say("There's more. Say keep reading.");
      }
    }
  }
  // 6.7: long replies stop after about 150 words; "keep reading" plays the rest
  const READ_CAP = 300;   // 7.6: only if you turn the cap on in the menu
  let moreRead = null;   // { path, parts, at }
  const wordsIn = (x) => String(x || '').split(/\s+/).filter(Boolean).length;
  function capParts(parts) {
    if (cfg.readCap !== true) return { now: parts, more: [] };   // 7.5: off unless you turn it on
    const now = [];
    let n = 0;
    for (let k = 0; k < parts.length; k++) {
      const w = wordsIn(parts[k]);
      if (n + w <= READ_CAP + 20) { now.push(parts[k]); n += w; continue; }
      // this chunk runs past the cap: stop at the sentence that reaches it
      const sents = (parts[k].match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [parts[k]]).map((x) => x.trim()).filter(Boolean);
      let take = '', j = 0;
      for (; j < sents.length; j++) {
        if (n >= READ_CAP && (take || now.length)) break;
        take += (take ? ' ' : '') + sents[j]; n += wordsIn(sents[j]);
      }
      if (take) now.push(take);
      const more = (j < sents.length ? [sents.slice(j).join(' ')] : []).concat(parts.slice(k + 1));
      if (wordsIn(more.join(' ')) < 40) return { now: parts, more: [] };   // not worth a stop for a short tail
      return { now, more };
    }
    return { now: parts, more: [] };
  }
  const moreWaiting = () => !!moreRead && moreRead.path === location.pathname && Date.now() - moreRead.at < 15 * 60000;
  function readMore() {
    if (!moreWaiting()) return say('Nothing more to read here.');
    if (!elReady()) { moreRead = null; return say('The rest needs the ElevenLabs voice.'); }
    takeFloor('touch');
    const parts = moreRead.parts;
    moreRead = null;
    fbStop();
    fb = { engine: 'el', parts, i: 0, paused: false, gen: 0, audio: null, audioIdx: -1, cache: [], more: [] };
    fbPlay();
  }
  // 7.5: the page follows the voice, a paragraph at a time, unless you just scrolled yourself
  let userScrollAt = 0;
  const scrolled = () => { userScrollAt = Date.now(); };
  addEventListener('wheel', scrolled, { passive: true, capture: true });
  addEventListener('touchmove', scrolled, { passive: true, capture: true });
  const normW = (x) => String(x || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  function followText(me, piece) {
    try {
      if (cfg.follow === false || !me || !me.el || !me.el.isConnected || Date.now() - userScrollAt < 6000) return;
      const words = normW(piece).split(' ');
      let hit = null;
      for (const n of [7, 4, 2]) {
        const key = words.slice(0, n).join(' ');
        if (!key) break;
        let best = null;
        for (const b of me.el.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,pre,blockquote,td,th')) {
          if (me.lastBlock && me.lastBlock.isConnected && b !== me.lastBlock && (me.lastBlock.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING)) continue;
          const t = normW(b.textContent);
          if (t.includes(key) && (!best || t.length < normW(best.textContent).length)) best = b;
        }
        if (best) { hit = best; break; }
      }
      if (!hit || hit === me.lastBlock) return;
      me.lastBlock = hit;
      hit.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (e) {}
  }
  function followAudio(me, i, a, align) {
    const text = me.parts[i] || '';
    const starts = [0];
    text.replace(/[.!?:]["')\]]*\s+/g, (m0, at) => { starts.push(at + m0.length); return m0; });
    // 8.1: where every word starts in the text, and (from ElevenLabs) when each character is spoken
    const wordAt = [];
    text.replace(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu, (m0, at) => { wordAt.push(at); return m0; });
    const ok = align && Array.isArray(align.character_start_times_seconds) && align.character_start_times_seconds.length >= text.length * 0.8;
    const cs = ok ? align.character_start_times_seconds : null;
    const charAt = (t) => {
      if (cs) { let lo = 0, hi = cs.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (cs[mid] <= t) lo = mid; else hi = mid - 1; } return Math.min(text.length - 1, lo); }
      return a.duration && isFinite(a.duration) ? Math.floor(t / a.duration * text.length) : 0;
    };
    let shown = -1, wShown = -1;
    const tick = () => {
      if (fb !== me || me.i !== i) { clearInterval(iv); return; }
      const t = a.currentTime + (cs ? 0.06 : 0);   // a hair early, so the glow lands with the sound, not after it
      const pos = charAt(t);
      let k = 0;
      while (k + 1 < starts.length && starts[k + 1] <= pos) k++;
      if (k !== shown) { shown = k; followText(me, text.slice(starts[k])); }
      let w = 0;
      while (w + 1 < wordAt.length && wordAt[w + 1] <= pos) w++;
      if (w !== wShown) { wShown = w; readPos(text, wordAt[w] || 0); }   // 8.1: one message per word
    };
    // a tab that's playing sound isn't slowed down by Chrome, so a quick beat keeps every word on time
    const iv = setInterval(tick, 40);
    a.ontimeupdate = tick;
    a.addEventListener('ended', () => clearInterval(iv), { once: true });
    tick();
  }
  function readReply(m, engine, full, auto) {
    if (engine !== 'el') return;   // 5.3: no Mac voice for replies
    const el = true;
    let all = replyParts(m, 180, 600);
    // 8.7: what read along already said isn't said twice
    if (auto && ra && ra.heard.size) {
      const ss = sentencesOf(replyText(m)), rest = ss.filter((x) => !ra.heard.has(x));
      if (rest.length < ss.length) {
        ra = null;
        const tail = partsOf(rest, 180, 600);
        dlog('read along, the rest', tail.length + ' parts');
        if (fb && fb.ra) { fb.parts.push(...tail); fb.ra = false; return; }
        if (!tail.length) { if (cfg.autoListen && !fbActive()) yourTurn(); return; }
        all = tail;
        full = true;
      }
    }
    moreRead = null;
    const cut = full ? { now: all, more: [] } : capParts(all);
    const parts = cut.now;
    dlog('reading', parts.length + ' parts: ' + (parts[0] || '').slice(0, 50));
    if (!parts.length) return;
    fbStop();
    fb = { engine: el ? 'el' : 'mac', parts, i: 0, paused: false, gen: 0, audio: null, audioIdx: -1, cache: [], more: cut.more, el: m, lastBlock: null };
    fbPlay();
  }
  function fbPause() {
    if (!fb) return;
    readPos(null);   // 8.1
    fb.paused = true;
    if (fb.audio) { try { fb.audio.pause(); } catch (e) {} }
    hush();
  }
  function fbStop() {
    readPos(null);   // 8.1
    if (!fb) return;
    const a = fb.audio;
    fb = null;
    if (a) { try { a.pause(); } catch (e) {} }
    hush();
  }

  // ---------- read along (8.7) ----------
  // While Claude is still working, each update it sends is read as it lands. A sentence still being
  // written waits; when the reply finishes, readReply reads only what wasn't read here.
  let ra = null;   // { turn, heard: Set, last, at }
  function raReply() {
    const all = replies(), m = all[all.length - 1];
    if (!m) return null;
    const us = document.querySelectorAll('[data-testid="user-message"]'), u = us[us.length - 1];
    if (u && !(u.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING)) return null;   // nothing new since your last message
    return m;
  }
  setInterval(() => {
    if (cfg.readAlong === false || tabOff || held || hardPause || !cfg.autoRead || !isFloor() || !ownsFloor()) return;
    if (!isWorking() || !elReady()) return;
    if (buttons('stop').length || agActive() || noteMode) return;   // you're talking
    if (fb && !fb.ra) return;   // something else is being read; this waits its turn
    const m = raReply();
    if (!m) return;
    const turn = location.pathname + '|' + document.querySelectorAll('[data-testid="user-message"]').length;
    if (!ra || ra.turn !== turn) {
      // the reply on screen when this turn started is never read along
      ra = { turn, heard: new Set(), last: '', at: Date.now() };
    }
    const text = replyText(m);
    const still = text === ra.last && Date.now() - ra.at > 1500;
    if (text !== ra.last) { ra.last = text; ra.at = Date.now(); }
    let ss = sentencesOf(text);
    if (ss.length && (!still || !/[.!?]["')\]]*$/.test(ss[ss.length - 1]))) ss = ss.slice(0, -1);   // the last sentence may still be growing
    const fresh = ss.filter((x) => !ra.heard.has(x));
    if (!fresh.length) return;
    fresh.forEach((x) => ra.heard.add(x));
    const parts = partsOf(fresh, 220, 600);
    dlog('read along', fresh.length + ' sentences: ' + fresh[0].slice(0, 50));
    if (fb && fb.ra) { fb.parts.push(...parts); return; }   // the reading in progress picks these up
    fb = { engine: 'el', parts, i: 0, paused: false, gen: 0, audio: null, audioIdx: -1, cache: [], more: [], el: m, lastBlock: null, ra: true };
    fbPlay();
  }, 700);

  // ---------- ElevenLabs voice (5.1) ----------
  const EL_DEFAULT_VOICE = 'j08RBkJwvXYv5AZ961JE';   // Annika, warm and conversational
  const EL_BUILTIN_VOICE = 'cgSgspJ2msm6clMCkdW9';   // Jessica, built into every ElevenLabs account
  const gmGet = (k, d) => { try { return typeof GM_getValue === 'function' ? GM_getValue(k, d) : d; } catch (e) { return d; } };
  const elKey = () => String(gmGet('chf_el_key', '') || '').trim();
  // 9.7: a voice per project, so you know who's talking. Replies read in the voice of their chat's project;
  // HQ's own lines and anything unmatched read in the Chief's voice. Edit the map from the Tampermonkey menu.
  // 9.7.3: off by default. Every chat reads in Annika again. Add a voice back whenever you want one from the
  // Tampermonkey menu (ElevenLabs: project voices), format: words = voice ID; words = voice ID.
  const EL_CHIEF_VOICE = EL_DEFAULT_VOICE;           // Annika
  const EL_PROJECT_VOICES = [];
  const elVoiceMap = () => { try { const j = JSON.parse(gmGet('chf_el_voices', '') || 'null'); if (Array.isArray(j)) return j; } catch (e) {} return EL_PROJECT_VOICES; };
  const elChiefVoice = () => String(gmGet('chf_el_chief', '') || '').trim() || EL_CHIEF_VOICE;
  function elProjectVoice() {
    let hay = '';
    try { hay = (projectName() + ' ' + chatTitle()).toLowerCase(); } catch (e) {}
    if (!hay.trim()) return '';
    for (const [words, id] of elVoiceMap()) if (String(words).split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).some((k) => hay.includes(k))) return id;
    return '';
  }
  // 9.7.1: HQ's own lines keep the voice you had before (Annika, or the one set by ID); replies use their project's
  const elLineVoice = () => String(gmGet('chf_el_voice', '') || '').trim() || EL_DEFAULT_VOICE;
  const elVoice = (reply) => reply ? (elProjectVoice() || elChiefVoice()) : elLineVoice();
  let elDownUntil = 0, elWarned = false;
  // 6.6: reading speed for the ElevenLabs voice, as a playback rate (pitch stays put)
  const SPEEDS = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
  if (!cfg.speed971) { cfg.speed971 = true; cfg.elSpeed = 1; try { save(cfg); } catch (e) {} }   // 9.7.1: back to normal speed once
  const voiceSpeed = () => (SPEEDS.includes(cfg.elSpeed) ? cfg.elSpeed : 1);
  function rateOn(a) { try { a.preservesPitch = true; a.playbackRate = voiceSpeed(); } catch (e) {} return a; }
  function stepSpeed(dir) {
    const i = SPEEDS.indexOf(voiceSpeed());
    const j = dir === 0 ? SPEEDS.indexOf(1) : Math.max(0, Math.min(SPEEDS.length - 1, i + dir));
    cfg.elSpeed = SPEEDS[j]; save(cfg);
    if (fb && fb.audio) rateOn(fb.audio);   // a reading already playing changes right away
    if (lineAudio) rateOn(lineAudio);
    const x = String(SPEEDS[j]).replace(/^1$/, '1.0');
    return say((j === i && dir !== 0 ? 'That is as ' + (dir > 0 ? 'fast' : 'slow') + ' as it goes. ' : '') + 'Voice at ' + x + ' speed.');
  }
  const elReady = () => cfg.el !== false && !!elKey() && Date.now() > elDownUntil && typeof GM_xmlhttpRequest === 'function';
  // 8.1: replies come with a time for every character, so screen mode can light each word as it's said
  let elStampsOff = false;
  function b64Blob(b64) {
    const bin = atob(b64), u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type: 'audio/mpeg' });
  }
  // 9.9.5: ElevenLabs' own reason for a refusal, read from the answer's body, so the note can say it
  function elReject(r, reject) {
    const fin = (body) => {
      let why = '';
      try {
        const j = typeof body === 'string' ? JSON.parse(body) : body;
        const d = j && j.detail;
        why = String((d && (d.message || d.status)) || (typeof d === 'string' ? d : '') || (j && j.message) || '').slice(0, 160);
      } catch (e) {}
      reject({ status: r.status, why });
    };
    try {
      const b = r.response;
      if (b && typeof Blob !== 'undefined' && b instanceof Blob) return void b.text().then(fin, () => fin(''));
      fin(b != null ? b : r.responseText);
    } catch (e) { reject({ status: r.status, why: '' }); }
  }
  const elKeyTail = () => { const k = elKey(); return k ? ' ending ' + k.slice(-4) : ''; };
  const elWhyLine = (e) => (e && e.why ? ' ElevenLabs says: ' + e.why : '');
  function elRequest(text, voice, key, stamps, model) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voice) + (stamps ? '/with-timestamps' : '') + '?output_format=mp3_44100_64',
        headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: stamps ? 'application/json' : 'audio/mpeg' },
        data: JSON.stringify({ text, model_id: model || 'eleven_multilingual_v2' }),   // 9.7.1: the natural model, not the fast one
        responseType: stamps ? 'json' : 'blob', timeout: 25000,
        onload: (r) => {
          if (!(r.status >= 200 && r.status < 300 && r.response)) return elReject(r, reject);
          if (!stamps) return resolve(r.response);
          try {
            const j = typeof r.response === 'string' ? JSON.parse(r.response) : r.response;
            const blob = b64Blob(j.audio_base64);
            blob.align = j.alignment || j.normalized_alignment || null;
            resolve(blob);
          } catch (e) { reject({ status: 1 }); }
        },
        onerror: () => reject({ status: 0 }), ontimeout: () => reject({ status: 0 })
      });
    });
  }
  // 9.7.4: your ElevenLabs library, so a voice can be picked by name instead of pasting an ID
  function elMyVoices(key) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.elevenlabs.io/v1/voices',
        headers: { 'xi-api-key': key, Accept: 'application/json' },
        responseType: 'json', timeout: 20000,
        onload: (r) => {
          if (!(r.status >= 200 && r.status < 300 && r.response)) return elReject(r, reject);
          try {
            const j = typeof r.response === 'string' ? JSON.parse(r.response) : r.response;
            const out = (j.voices || []).map((v) => ({ id: v.voice_id, name: String(v.name || v.voice_id) })).filter((v) => v.id);
            out.length ? resolve(out) : reject({ status: 1 });
          } catch (e) { reject({ status: 1 }); }
        },
        onerror: () => reject({ status: 0 }), ontimeout: () => reject({ status: 0 })
      });
    });
  }
  // 9.7.4: one voice for everything. Sets the project map to something that matches nothing, plus the two
  // fallbacks, so replies, unmapped chats and HQ's own lines all land on the same voice.
  function elSetOneVoice(id) {
    try { GM_setValue('chf_el_voices', JSON.stringify([['zznone', id]])); } catch (e) {}
    try { GM_setValue('chf_el_chief', id); } catch (e) {}
    try { GM_setValue('chf_el_voice', id); } catch (e) {}
    elWarned = false;
  }
  async function elOneVoicePick() {
    const key = elKey();
    if (!key) return toast('Set your ElevenLabs API key first, in this same menu.');
    toast('Fetching your ElevenLabs voices...');
    let list;
    try { list = await elMyVoices(key); }
    catch (e) {
      const st = (e && e.status) || 0;
      return toast(st === 401 ? 'ElevenLabs turned down the key' + elKeyTail() + '.' + elWhyLine(e) : "Couldn't reach your ElevenLabs voices." + elWhyLine(e));
    }
    const now = elChiefVoice();
    const at = list.findIndex((v) => v.id === now);
    const menu = list.map((v, i) => (i + 1) + '. ' + v.name + (v.id === now ? '   (current)' : '')).join('\n');
    const pick = window.prompt('One voice for every chat, HQ included. Type a number.\n\n' + menu, String(at >= 0 ? at + 1 : 1));
    if (pick === null) return;
    const i = parseInt(String(pick).trim(), 10) - 1;
    if (!(i >= 0 && i < list.length)) return toast('No voice picked.');
    elSetOneVoice(list[i].id);
    toast('Every chat now reads in ' + list[i].name + '. Reload your chat tabs.');
  }

  async function elFetch(text, stamps) {
    const key = elKey(), voice = elVoice(stamps);   // stamps means a reply: it reads in its project's voice
    const go = async (v) => {
      if (!stamps || elStampsOff) return elRequest(text, v, key, false);
      try { return await elRequest(text, v, key, true); }
      catch (e) {
        const st = (e && e.status) || 0;
        if ([401, 402, 429].includes(st) || st === 0) throw e;   // the key or credits: the same answer either way
        if (st === 404 || st === 405 || st === 1) { elStampsOff = true; dlog('ElevenLabs timestamps off', 'status ' + st); }
        return elRequest(text, v, key, false);
      }
    };
    try { return await go(voice); }
    catch (e) {
      const st = (e && e.status) || 0;
      if (voice !== EL_BUILTIN_VOICE && st >= 400 && st < 500 && ![401, 402, 429].includes(st)) {
        const chief = elChiefVoice();
        if (voice !== chief) {   // 9.7: a project voice that won't play hands over to the Chief first
          if (!elWarned) { elWarned = true; toast("That project's ElevenLabs voice isn't in your voices yet, so the Chief is reading"); }
          try { return await go(chief); } catch (x) { const s2 = (x && x.status) || 0; if (!(s2 >= 400 && s2 < 500 && ![401, 402, 429].includes(s2))) throw x; }
        }
        if (!elWarned) { elWarned = true; toast("That ElevenLabs voice isn't in your voices yet, so Jessica is reading"); }
        return go(EL_BUILTIN_VOICE);
      }
      throw e;
    }
  }
  function elFailed(e) {
    const st = (e && e.status) || 0;
    elDownUntil = Date.now() + (st === 401 || st === 402 || st === 429 ? 10 * 60000 : 60000);
    toast(st === 401 ? 'ElevenLabs turned down the key' + elKeyTail() + '.' + elWhyLine(e) + ' Set it again in the Tampermonkey menu.'
      : st === 402 || st === 429 ? 'ElevenLabs is out of credits or busy. Using another voice for now.'
      : "ElevenLabs didn't answer. Using another voice for now.");
  }
  function elPart(me) {
    const i = me.i;
    const want = (j) => { if (!me.cache[j]) { const pr = elFetch(me.parts[j], true); pr.catch(() => {}); me.cache[j] = pr; } };
    want(i);
    if (i + 1 < me.parts.length) want(i + 1);   // fetch the next part while this one plays
    return me.cache[i].then((blob) => {
      if (fb !== me || me.paused || me.i !== i) return false;
      return new Promise((resolve) => {
        let a = me.audio;
        if (!a || me.audioIdx !== i) {
          if (a) { try { a.pause(); } catch (x) {} }
          a = new Audio(URL.createObjectURL(blob));
          me.audio = a; me.audioIdx = i;
        }
        rateOn(a);
        followAudio(me, i, a, blob.align);
        const done = (ok) => { a.onended = null; a.onpause = null; a.onerror = null; a.ontimeupdate = null; resolve(ok); };
        a.onended = () => done(true);
        a.onerror = () => done(true);                     // skip a part that won't play
        a.onpause = () => { if (!a.ended) { dlog('reading paused', 'part ' + (i + 1) + ' at ' + a.currentTime.toFixed(1) + 's'); done(false); } };  // paused for a note
        a.play().catch((x) => { dlog('play blocked', (x && (x.name + ' ' + x.message)) || ''); done(false); });
        hqTakeBack();   // 9.5
      });
    }, (e) => { dlog('ElevenLabs failed', 'status ' + ((e && e.status) || 0)); elFailed(e); return 'fail'; });
  }
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('ElevenLabs: set API key', () => {
        const k = window.prompt('Paste your ElevenLabs API key. It stays in Tampermonkey on this Mac. Leave empty to remove it.', '');
        if (k === null) return;
        try { GM_setValue('chf_el_key', k.trim()); } catch (e) {}
        elDownUntil = 0;
        toast(k.trim() ? 'ElevenLabs key saved. Replies will be read in ElevenLabs.' : 'ElevenLabs key removed');
      });
      GM_registerMenuCommand('ElevenLabs voice on or off', () => {
        cfg.el = cfg.el === false; save(cfg);
        toast('ElevenLabs voice ' + (cfg.el === false ? 'off' : 'on'));
      });
      GM_registerMenuCommand('Follow the reading on the page, on or off', () => {
        cfg.follow = cfg.follow === false; save(cfg);
        toast(cfg.follow === false ? 'The page stays put while replies are read' : 'The page follows along as replies are read');
      });
      GM_registerMenuCommand('Read cap on or off (300 words)', () => {
        cfg.readCap = cfg.readCap !== true; save(cfg);
        toast(cfg.readCap !== true ? 'Replies read start to finish' : 'Replies stop after about 300 words. Say keep reading for the rest.');
      });
      GM_registerMenuCommand('Mic sound: next', () => setCue(cueNum() + 1));
      GM_registerMenuCommand('Mic sound: louder', () => stepCueVol(1));
      GM_registerMenuCommand('Mic sound: quieter', () => stepCueVol(-1));
      GM_registerMenuCommand('Voice faster', () => stepSpeed(1));
      GM_registerMenuCommand('Voice slower', () => stepSpeed(-1));
      GM_registerMenuCommand('ElevenLabs: one voice everywhere', () => { elOneVoicePick(); });
      GM_registerMenuCommand('ElevenLabs: HQ lines voice by ID', () => {
        const v = window.prompt('Paste the ElevenLabs voice ID for HQ and Switchboard lines. Leave empty for Annika.', gmGet('chf_el_voice', '') || '');
        if (v === null) return;
        try { GM_setValue('chf_el_voice', v.trim()); } catch (e) {}
        toast(v.trim() ? 'HQ lines voice set' : 'HQ lines voice back to Annika');
      });
      GM_registerMenuCommand('ElevenLabs: Chief voice by ID', () => {
        const v = window.prompt('Paste the ElevenLabs voice ID for any chat outside a mapped project. Leave empty for Eleanor.', gmGet('chf_el_chief', '') || '');
        if (v === null) return;
        try { GM_setValue('chf_el_chief', v.trim()); } catch (e) {}
        elWarned = false;
        toast(v.trim() ? 'Chief voice set' : 'Chief voice back to Eleanor');
      });
      GM_registerMenuCommand('ElevenLabs: project voices', () => {
        const now = elVoiceMap().map(([w, id]) => w + ' = ' + id).join('; ');
        const v = window.prompt('Project voices: words in the project name or chat title = voice ID, separated by semicolons. Leave empty for the defaults.', now);
        if (v === null) return;
        const map = v.split(';').map((x) => x.split('=')).filter((x) => x.length === 2 && x[0].trim() && x[1].trim()).map((x) => [x[0].trim(), x[1].trim()]);
        try { GM_setValue('chf_el_voices', v.trim() && map.length ? JSON.stringify(map) : ''); } catch (e) {}
        elWarned = false;
        toast(v.trim() && map.length ? map.length + ' project voices set' : 'Project voices back to the defaults');
      });
    }
  } catch (e) {}
  const msgOf = (btn) => (btn && btn.closest && btn.closest('[data-testid="assistant-message"]')) || last([...replies()]);
  // 5.3: the Mac voice backup is gone; Claude's read aloud is left to do its job
  function watchPlayback() {}


  let readKickAt = 0;   // 6.4: a reading was just started; the mic waits to see it begin
  function readLatest(asked, full) {
    readKickAt = Date.now();
    const speak = last(buttons('speak'));
    if (!speak) {
      if (!asked) return;
      const all = replies();
      if (all.length && elReady()) { readReply(all[all.length - 1], 'el', full); return; }
      say('Nothing to read here yet.'); return;
    }
    lastKey = replyKey(speak);
    try { const m0 = msgOf(speak); if (m0) { readEls.add(m0); markHeard(headOf(m0)); } } catch (e) {}   // 5.7
    if (!(cfg.autoRead || asked) || (held && !asked)) return;   // 8.0: on hold only an asked read plays
    if (elReady()) { readReply(msgOf(speak), 'el', full); return; }   // 5.1: ElevenLabs reads instead
    speak.click(); watchPlayback(speak);
  }

  // ---------- switchboard: chimes, nags and approvals ----------
  let approval = null;
  let announcingRed = false;
  let alerting = false;
  const approvalOpen = () => !!approval && Date.now() < approval.until;
  // 6.9: this chat is showing a request right now
  const hereWaiting = () => { try { return sb.state === 'red' && !!(sb.reqKey || sb.folder); } catch (x) { return false; } };
  // 6.8: "allow" or "deny" by voice, for the request you heard, while it still waits
  const voiceApproval = () => {
    try {
      return !!approval && Date.now() < approval.voiceUntil &&
        listTabs().some((e) => e.id === approval.id && e.state === 'red' &&
          (approval.folder ? e.folder === approval.folder : e.reqKey === approval.key));
    } catch (x) { return false; }
  };

  const nagKey = (e) => e.id + ':' + e.state + ':' + e.since + ':' + (e.reqKey || '');
  const nagAt = (e) => lsJson(K_NAGS, {})[nagKey(e)] || 0;
  function nagMark(e) {
    const n = lsJson(K_NAGS, {});
    const cut = Date.now() - 86400000;
    for (const k of Object.keys(n)) if (n[k] < cut) delete n[k];
    n[nagKey(e)] = Date.now();
    lsPut(K_NAGS, n);
  }

  // ---------- 8.1: a spoken question keeps its own ears open ----------
  // Before, a line like "say allow, or deny" opened Claude's dictation in whatever tab held the mic, and if
  // the answer was missed it was typed into a chat as a message. Now the tab that asked listens itself, with
  // Chrome's speech recognition, for about twelve seconds, and acts on the answer. Nothing it hears is ever
  // typed into a message box. A squeeze while a request still waits opens those ears again.
  const EAR = { rec: null, gen: 0, blocked: false, fin: null, asking: 0 };
  const earOpen = () => !!EAR.rec;
  const earBusy = () => !!EAR.rec || EAR.asking > 0;   // a question is out and waiting for its answer
  function earStop() {
    const r = EAR.rec, f = EAR.fin; EAR.rec = null; EAR.fin = null;
    if (r) { r.onend = null; r.onresult = null; r.onerror = null; try { r.abort(); } catch (e) {} }
    if (f) f(null);
    try { paintPill(); } catch (e) {}
  }
  function earListen(ms) {
    return new Promise((resolve) => {
      if (!SRX || EAR.blocked || held || tabOff || !isFloor() || buttons('stop').length) return resolve(null);
      if (EAR.rec) return resolve(null);   // already listening for a question; never steal its ears
      let r;
      try { r = new SRX(); } catch (e) { return resolve(null); }
      r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      EAR.rec = r;
      let done = false;
      const fin = (v) => { if (done) return; done = true; clearTimeout(t); if (EAR.fin === fin) EAR.fin = null; if (EAR.rec === r) earStop(); resolve(v); };
      EAR.fin = fin;
      const t = setTimeout(() => fin(null), Math.max(1500, ms || 9000));
      r.onaudiostart = () => { try { playCue(); } catch (e) {} };
      r.onresult = (e) => {
        const res = e.results[e.results.length - 1], alts = [];
        for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
        dlog('ears heard', alts[0]);
        fin(alts);
      };
      r.onerror = (e) => {
        dlog('ears', e.error);
        if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) { EAR.blocked = true; toast('Chrome blocked the mic for Switcheroo here. Allow the microphone for claude.ai.'); }
        fin(null);
      };
      r.onend = () => fin(null);
      try { r.start(); toast('Listening'); paintPill(); } catch (e) { fin(null); }
    });
  }
  const sayOnly = (text) => { const job = speakChain.then(() => speakNow(text)); speakChain = job.catch(() => {}); return job; };
  const flatOf = (x) => String(x || '').toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^(?:(?:uh+|um+|okay|ok|so|hey|claude)\s+)+/, '');
  // ask, then listen here. judge(alts) answers true (handled), a line to say before listening again, or false
  async function askAloud(line, judge, opts) {
    opts = opts || {};
    EAR.asking++;
    try { return await askAloudNow(line, judge, opts); } finally { EAR.asking--; }
  }
  async function askAloudNow(line, judge, opts) {
    if (line) { const ok = await sayOnly(line); if (!ok) return false; }
    if (opts.afterLine) opts.afterLine();
    if (!SRX || EAR.blocked || !cfg.autoListen) return false;
    const end = Date.now() + (opts.ms || 12000);
    let nudges = 0, quick = 0;
    while (Date.now() < end && !held && isFloor() && !tabOff) {
      const t0 = Date.now();
      const alts = await earListen(end - Date.now());
      if (EAR.blocked) return false;
      if (!alts) { if (Date.now() - t0 < 400 && ++quick > 2) return false; continue; }
      const v = judge(alts);
      if (v === true) return true;
      if (typeof v === 'string' && nudges++ < 2) { const ok = await sayOnly(v); if (!ok) return false; }
    }
    return false;
  }
  const ALLOW_SAID = /^(?:(?:yes|yeah|yep|sure)\s+)?(?:allow|allow it|allow that|allow once|allowed|a low|aloud|approve|approve it|approved|go ahead|do it|yes|yeah|yep|sure)(?: please)?$/;
  const DENY_SAID = /^(?:no|nope|deny|deny it|deny that|denied|don't allow|dont allow|do not allow|don't allow it|decline|reject|no thanks)(?: please)?$/;
  const ALLOW_APP = /^(?:yes\s+)?(?:allow|allowed|a low|aloud|approve|give|grant)\s+(?:access to\s+|control of\s+)?(.+?)(?:\s+(?:for this session|for now|please))*$/;
  function judgeApproval(alts) {
    for (const raw of alts) {
      const f = flatOf(raw);
      if (ALLOW_SAID.test(f)) { approveNow(); return true; }
      if (DENY_SAID.test(f)) { denyNow(); return true; }
    }
    return 'Say allow, or deny.';
  }
  function judgeComputer(alts) {
    const a = approval;
    if (!a || !a.comp) return true;
    let bare = false;
    for (const raw of alts) {
      const f = flatOf(raw);
      if (DENY_SAID.test(f)) { denyNow(); return true; }
      const m = f.match(ALLOW_APP);
      if (m) { const hit = appMatch(m[1], a.comp); if (hit) { approveApp(hit); return true; } }
      if (ALLOW_SAID.test(f)) bare = true;
    }
    if (bare) return 'Say allow and the app name, like allow ' + appList(a.comp.slice(0, 1)) + '.';
    return 'Say allow and the app name, or deny.';
  }
  // a squeeze while a request still waits: listen for the answer here, never in a message box
  function earAnswer() {
    if (!approval || earBusy()) return;
    const judge = approval.comp ? judgeComputer : judgeApproval;
    askAloud('', judge, { ms: 9000 });
  }

  async function alertRed(e) {
    if (earBusy() || announcingRed) return;   // 8.1: one question out loud at a time
    if (e.comp) return alertComputer(e);   // 8.1
    announcingRed = true;
    nagMark(e);
    try {
      await chime('red');
      await sleep(200);
      const ask = cfg.autoListen ? 'Say allow, or deny.' : 'Squeeze to allow once.';
      const opened = () => {
        approval = { id: e.id, key: e.reqKey, name: e.name, until: Date.now() + APPROVE_MS, voiceUntil: Date.now() + VOICE_APPROVE_MS, askedAt: Date.now() };
        paintPill(); paintBoard();
      };
      if (!cfg.autoListen) { if (await say(e.name + ' needs approval. ' + e.request + '. ' + ask)) opened(); return; }
      let said = false;
      await askAloud(e.name + ' needs approval. ' + e.request + '. ' + ask, judgeApproval, { afterLine: () => { said = true; announcingRed = false; opened(); } });
      if (!said) return;
    } finally { announcingRed = false; }
  }
  // 8.1: "Alder wants control of Notes and Finder. Say allow and the app name."
  async function alertComputer(e) {
    if (earBusy() || announcingRed) return;
    announcingRed = true;
    nagMark(e);
    try {
      await chime('red');
      await sleep(200);
      const opened = () => {
        approval = { id: e.id, key: e.reqKey, name: e.name, comp: e.comp && e.comp.length ? e.comp : ['your computer'], until: 0, voiceUntil: Date.now() + VOICE_APPROVE_MS, askedAt: Date.now() };
        paintPill(); paintBoard();
      };
      await askAloud(compLine(e), judgeComputer, { afterLine: () => { announcingRed = false; opened(); } });
    } finally { announcingRed = false; }
  }
  // allow the computer request you heard, naming one of its apps; this session only
  function approveApp(app) {
    const a = approval;
    if (!a || !a.comp) return say('Nothing is asking for your computer.');
    const hit = appMatch(app, a.comp);
    if (!hit) return say('I heard ' + app + '. This one asks for ' + appList(a.comp) + '. Say allow and one of those.');
    approval = null;
    paintPill(); paintBoard();
    if (a.id === ME) return say(doAllowComputer(a.key, false, hit, false) ? 'Allowed ' + appList(a.comp) + ' for this session.' : 'That request changed, so I left it alone.');
    pendingApprove = a;
    post({ t: 'approve', to: a.id, from: ME, key: a.key, folder: '', app: hit });
    setTimeout(() => { if (pendingApprove === a) { pendingApprove = null; say("Couldn't reach " + a.name + '.'); } }, 3000);
  }
  function approveNow() {
    if (approval && approval.comp) { say('Say allow and the app name, like allow ' + appList(approval.comp.slice(0, 1)) + '.'); return; }   // 8.1: never a bare allow
    const a = approval;
    approval = null;
    paintPill(); paintBoard();
    if (!a) return;
    if (a.id === ME) { say(doApprove(a.key, a.folder) ? 'Allowed.' : 'That request changed, so I left it alone.'); return; }
    pendingApprove = a;
    post({ t: 'approve', to: a.id, from: ME, key: a.key, folder: a.folder || '' });
    setTimeout(() => { if (pendingApprove === a) { pendingApprove = null; say("Couldn't reach " + a.name + '.'); } }, 3000);
  }
  // 6.8: turn a request down, the same way
  function denyNow() {
    const a = approval;
    approval = null;
    paintPill(); paintBoard();
    if (!a) return say('Nothing to deny.');
    if (a.id === ME) return say(doDeny(a.key, a.folder) ? 'Denied.' : 'That request changed, so I left it alone.');
    pendingApprove = a;
    post({ t: 'deny', to: a.id, from: ME, key: a.key, folder: a.folder || '' });
    setTimeout(() => { if (pendingApprove === a) { pendingApprove = null; say("Couldn't reach " + a.name + '.'); } }, 3000);
  }
  function doDeny(key, folder) {
    if (String(key || '').startsWith('c|')) return doDenyComputer(key);   // 8.1
    if (folder) {
      if (folderAsk() !== folder) return false;
      const d = folderButtons(folderHit()).deny;
      if (!d) return false;
      d.click(); setTimeout(scheduleCompute, 300); return true;
    }
    const btn = findAllow();
    if (!btn || reqKeyOf(requestText(btn)) !== key) return false;
    let el = btn.parentElement, d = null;
    for (let i = 0; i < 4 && el && !d; i++, el = el.parentElement) {
      d = [...el.querySelectorAll('button, [role="button"]')].find((x) => !ours(x) && DENY_WORDS.test(wordsOf(x))) || null;
    }
    if (!d) return false;
    d.click();
    setTimeout(scheduleCompute, 300);
    return true;
  }
  // clicks Allow once only if it is still the exact request that was read aloud
  // 8.1: always is true only for a click on ALWAYS ALLOW in screen mode, never by voice or squeeze
  function doApprove(key, folder, always, app, fromScreen) {
    if (String(key || '').startsWith('c|')) return doAllowComputer(key, always, app, fromScreen);   // 8.1
    if (folder) {   // 6.9: only the folder that was read aloud, and only Allow once
      if (folderAsk() !== folder) return false;
      const fbs = folderButtons(folderHit());
      const b = always ? fbs.always : fbs.allow;
      if (!b) return false;
      dlog(always ? 'folder always allowed from screen mode' : 'folder allowed', folder);
      b.click();
      setTimeout(scheduleCompute, 300);
      return true;
    }
    const btn = findAllow();
    if (!btn || reqKeyOf(requestText(btn)) !== key) return false;
    if (always) {
      const a = alwaysNear(btn);
      if (!a) return false;
      dlog('always allowed from screen mode', key.slice(0, 60));
      a.click();
    } else btn.click();
    setTimeout(scheduleCompute, 300);
    return true;
  }
  function alwaysNear(b) {
    let el = b.parentElement;
    for (let i = 0; i < 5 && el; i++, el = el.parentElement) {
      const x = [...el.querySelectorAll('button, [role="button"]')].find((y) => !ours(y) && visible(y) && !y.disabled && /^always allow\b/.test(wordsOf(y)));
      if (x) return x;
    }
    return null;
  }

  function busy() {
    return speaking > 0 || announcingRed || approvalOpen() || !!pending || agPlaying() || earBusy() ||
      Date.now() < duckHold || askReading || fbActive() ||
      buttons('stop').length > 0 || buttons('pause').length > 0 || buttons('resume').length > 0;
  }
  async function tickAnnouncer(fromTurn) {
    if (!isFloor() || alerting || quietNow() || busy()) return;
    const now = Date.now();
    const due = listTabs().filter((e) => e.on).map((e) => {
      if (e.state === 'red' && (e.reqKey || e.folder)) return { e, every: RED_EVERY };
      if (e.state === 'red' && !e.seen) return { e, every: RED_EVERY };
      if (e.state === 'yellow' && !e.seen && e.id !== ME) return { e, every: YELLOW_EVERY };
      return null;
    }).filter((d) => d && now - nagAt(d.e) >= d.every)
      .sort((a, b) => rankOf(a.e) - rankOf(b.e) || a.e.since - b.e.since);
    if (!due.length) return;
    const e = due[0].e;
    alerting = true;
    let spoke = false;
    const readingNow = () => fbActive() || buttons('pause').length > 0;   // 6.3
    try {
      if (e.state === 'red' && e.reqKey) {
        spoke = true;
        await alertRed(e);
      } else if (e.state === 'red' && e.folder) {
        nagMark(e); await chime('red'); await sleep(200);
        if (readingNow()) return;                 // 6.3: a reply started reading, say it later
        spoke = true; await announceFolder(e);
      } else if (e.state === 'red') {
        nagMark(e); await chime('red'); await sleep(200);
        if (readingNow()) return;
        spoke = true; await say(e.name + ', urgent. ' + e.request);
      } else {
        nagMark(e); await chime('yellow'); await sleep(200);
        if (readingNow()) return;
        spoke = true; await say(e.name + (e.ask ? ' has a question.' : ' needs you.'));
      }
    } finally {
      alerting = false;
      if (spoke && !fromTurn) { dlog('line done, your turn'); yourTurn(); }   // 6.3: mic opens after
    }
  }

  // ---------- switchboard: voice commands ----------
  const NUMS = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
    nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, ninety: 90
  };
  function toNum(s) {
    s = String(s || '').toLowerCase().replace(/^(tile|number|chat|tab)\s+/, '').trim();
    if (/^\d+$/.test(s)) return +s;
    if (/^(an? hour|one hour)$/.test(s)) return 60;
    if (/^half an hour$/.test(s)) return 30;
    const parts = s.split(/[\s-]+/).filter(Boolean);
    if (!parts.length || !parts.every((p) => p in NUMS)) return NaN;
    return parts.reduce((n, p) => n + NUMS[p], 0);
  }
  const READ_AGAIN_ALIKE = new RegExp('^(?:uh |um |okay |ok |so |and )?(?:' + [
    'breathe', 'breath', 'breed', 'bread', 'bred', 'reed', 'red', 'rid', 'ride', 'raid', 'rate', 'reid', 'reade', 'reach', 'wreath',
    'freed', 'greed', 'treat', 'tweed', 'weed', "we'd", 'lead', 'led', 'need', 'feed', 'bleed', 'speed', 'plead', 'read', 'reading', 'ready', 're',
    'reread', 're read', 'redo', 'read it', 'breathe it', 'read that', 'three', 'free', 'tree'
  ].join('|') + ')(?: )?(?:again|a gain|agin|a gin|again\'?s|a game|the game|against|a gun|agan|again now|a again|and again)(?: please)?$|^(?:reagan|ray gun|regain|re gain|regan|reagan please|again|again please|one more)$');
  // 8.9.1: a command said after a lead in ("stop, new chat in Alder", "wait, next") still counts.
  // Only moves count this way, so a message that starts with "stop" or "no" still goes to Claude.
  const LEAD_IN = /^\s*(?:(?:stop|stop it|stop that|stop reading|wait|hold on|hang on|no|nope|actually|and|now|then|okay|ok|alright|all right|so|uh+|um+|hey|switcheroo|hey switcheroo|cancel that|never mind|nevermind|scratch that|sorry)[\s.,;:!?-]+)+/i;
  function parseCommand(raw) {
    const c = parseCommandCore(raw);
    if (c) return c;
    const t = String(raw || ''), rest = t.replace(LEAD_IN, '');
    if (rest === t || !rest.trim()) return null;
    const c2 = parseCommandCore(rest);
    if (!c2) return null;
    const ok = c2.kind === 'newChat' || c2.kind === 'next' || c2.kind === 'boot' || c2.kind === 'status' ||
      (c2.kind === 'switch' && !!findDest(c2.name, false));
    if (ok) { try { dlog('command after a lead in', t + ' => ' + c2.kind); } catch (e) {} return c2; }
    return null;
  }
  function parseCommandCore(raw) {
    const t = String(raw || '').trim();
    // 4.3: a filler in front (uh, um, okay, so) no longer hides the command
    const flat = t.toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(?:(?:uh+|um+|uhm|erm?|ah+|hmm+|so|okay|ok|alright|all right|hey|hey claude|claude)\s+)+/, '');
    // 6.8: a request you heard is waiting: allow or deny it by voice
    const heardIt = voiceApproval();
    // 8.1: a computer request needs "allow" and an app's name; a bare allow just asks for the name
    const compWait = (heardIt && approval && approval.comp) || (!heardIt && hereWaiting() && sb.comp);
    if (compWait) {
      const am = flat.match(ALLOW_APP);
      if (am && !ALLOW_SAID.test(flat)) return { kind: 'allowApp', name: am[1], here: !heardIt };
      if (ALLOW_SAID.test(flat) || /^allow(?: it| once| that)?$/.test(flat)) return { kind: 'needApp', here: !heardIt };
      if (DENY_SAID.test(flat)) return { kind: 'deny', here: !heardIt };
    }
    if (!heardIt && hereWaiting() && /^(?:allow|allow it|allow once|allow that|approve|approve it|allow the folder|allow folder)(?: please)?$/.test(flat)) return { kind: 'allow', here: true };
    if (!heardIt && hereWaiting() && /^(?:deny|deny it|decline|don't allow|dont allow|do not allow)(?: please)?$/.test(flat)) return { kind: 'deny', here: true };
    if (heardIt) {
      if (/^(?:(?:yes|yeah|yep|sure)\s+)?(?:allow|allow it|allow that|allow once|allowed|a low|aloud|approve|approve it|approved|go ahead|do it|yes|yeah|yep|sure)(?: please)?$/.test(flat)) return { kind: 'allow' };
      if (/^(?:no|nope|deny|deny it|deny that|denied|don't allow|dont allow|do not allow|don't allow it|decline|reject|no thanks)(?: please)?$/.test(flat)) return { kind: 'deny' };
    }
    // 8.1: "allow", "deny" or "allow Notes" is never a message for Claude: it answers whatever is waiting
    if (/^(?:allow|allow it|allow that|allow once|allowed|approve|approve it|deny|deny it|don't allow|dont allow|do not allow)$/.test(flat) ||
      /^(?:allow|approve)\s+[\p{L}\p{N}'][\p{L}\p{N}' ]{0,30}$/u.test(flat) && flat.split(' ').length <= 4) {
      if (listTabs().some((e) => e.on && e.state === 'red' && (e.reqKey || e.folder))) return { kind: 'approvalWord', flat };   // only while something waits
    }
    // 7.9: Swipe Deck hands free
    if (/^(?:(?:open|start|review|run|do|go to|take me to|bring up|pull up|let's do|lets do|let's review)\s+)?(?:the\s+|my\s+)?(?:swipe ?decks?|swipe ?deck review|deck review|review (?:the |my )?deck)(?:\s+(?:hands free|please|now))*$/.test(flat)) return { kind: 'deck' };
    // 9.0: Chief of Staff. "chief" reads the brief, "what needs me" reads Start Here, "done two" closes one
    if (AM_OX_SAID.test(flat)) return { kind: 'outbox', lane: 'am' };   // 9.4
    if (OX_SAID.test(flat)) return { kind: 'outbox' };   // 9.1: "outbox" lists the drafts, "read draft two" reads one
    { const orx = oxReadSaid(flat); if (orx) return orx; }
    if (CHIEF_SAID.test(flat)) return { kind: 'chief' };
    if (CHIEF_NEEDS.test(flat)) return { kind: 'chiefNeeds' };
    { const cd = chiefDoneSaid(flat); if (cd) return cd; }
    if (CHF.closed && Date.now() - CHF.closed.at < 180000 && /^(?:undo|undo that|undo it|reopen|reopen it|reopen that|put it back|not done|that's not done|thats not done)(?: please)?$/.test(flat)) return { kind: 'chiefUndo' };
    if (/^(next|next chat|next one|next please)(?: (?:over|server|rover|or|ore|oh|over and out))?$/.test(flat)) return { kind: 'next' };   // 9.0.1: "next, over" heard as "next server" (9.4.2: or "next, or")
    if (/^(?:(?:run (?:a )?|do (?:a )?)?(?:video|videos|youtube|media|tv|sports) check|check (?:the |my )?(?:videos?|youtube|media|tv|sports)|is youtube (?:connected|working|on)|(?:are|is) (?:the |my )?videos? (?:connected|working))(?: please)?$/.test(flat)) return { kind: 'videoCheck' };   // 8.4
    // 8.2: links. "open", "open two", "open link three", "open the second link", "close page"
    {
      const om = flat.match(/^(?:open|pull up|show me|bring up)(?: (?:it|that|this))?(?: (?:the|a))?(?: (first|second|third|fourth|fifth|sixth|seventh|eighth|last))?(?: (?:link|page|one))?(?: (?:number )?([a-z]+|\d{1,2}))?(?: (?:link|page))?(?: please)?$/);
      if (om && (/^open\b/.test(flat) || /\b(?:link|page)\b/.test(flat))) {
        const w = om[1] || om[2];
        let n = !w ? 1 : w === 'last' ? -1 : (ORD[w] || toNum(w));
        if (isFinite(n) && n !== 0) return { kind: 'openLink', n };
      }
      if (/^(?:close|hide|dismiss|shut)(?: the| this| that)? (?:page|link|window|viewer|site)(?: please)?$|^(?:close it|page close|close page please)$/.test(flat)) return { kind: 'closePage' };
    }
    if (/^(?:(?:please|can you|could you)\s+)?(?:update|upgrade|refresh|reinstall)\s+(?:the\s+|my\s+)?(?:switcheroo|switch a roo|switch roo|switchboard|script|hands free)(?:\s+(?:now|please))*$|^(?:check for (?:an? )?updates?|any updates?|is there an update)$/.test(flat)) return { kind: 'update' };   // 8.1.1
    if (/^(?:please\s+)?(?:boot|boot up|bootup|boot it up|boot me up|reboot|start up|startup|boot switcheroo|boot up switcheroo|switcheroo boot|switcheroo boot up|open (?:my |the )?(?:ten |10 )?(?:most )?recent chats|open (?:my |the )?last (?:ten |10 )?chats)(?:\s+(?:please|now))*$/.test(flat)) return { kind: 'boot' };   // 8.9
    if (/^(?:follow|follow along|follow me|follow the voice|follow the reading|follow it|follow again|keep up)$/.test(flat)) return { kind: 'follow' };   // 8.1
    if (/^(status|status check|what's the status|whats the status|board|switchboard|switcheroo)$/.test(flat)) return { kind: 'status' };
    // 8.3: videos pause while we talk, or turn down instead
    if (/^(?:(?:please )?pause (?:the |my )?(?:videos?|youtube|music)(?: (?:mode|instead|when (?:we|i) talk|while (?:we|i) talk))?|(?:videos?|youtube) (?:pause|pauses|pause mode|pause instead)|pause mode)(?: please)?$/.test(flat)) return { kind: 'duckMode', m: 'pause' };
    if (/^(?:(?:please )?(?:turn|lower|duck) (?:the |my )?(?:videos?|youtube|music) down(?: instead)?|(?:lower|duck) (?:the |my )?(?:videos?|youtube|music)(?: instead)?|(?:videos?|youtube) (?:down|lower|duck)(?: instead)?|(?:don't|dont|do not) pause (?:the )?(?:videos?|youtube|music))(?: please)?$/.test(flat)) return { kind: 'duckMode', m: 'lower' };
    // 9.4.4: a reading is playing: these words drop that reading, wherever the mic happened to be
    // open. Checked before Hold on purpose: away from a reading, "shut up" is still Hold (8.0).
    if (ABORT_SAID.test(flat) && readingAloud()) return { kind: 'abort' };
    // 8.0: HOLD everything, and resume
    if (HOLD_SAID.test(flat)) return { kind: 'hold', meeting: /meeting/.test(flat) };
    if (UNHOLD_SAID.test(flat) || (held && /^(wake up|wake|i'm back|im back|resume switchboard|switchboard back on|switchboard on|resume switcheroo|switcheroo back on|switcheroo on)$/.test(flat))) return { kind: 'unhold' };
    // 8.8: one model for every open chat
    const mdm = flat.match(/^(?:please )?(?:(?:set|switch|change|put|move|make|use)\s+)?(?:all|every|each)(?: of)?(?: my| the)?(?: open)?\s*(?:chats?|tabs?|conversations?|models?)(?: models?)?\s+(?:to|over to|onto|on|use|using|be)\s+(?:the\s+)?(?:model\s+)?(sonnets?|sonet|opus|haiku|hiku|hi coup|hike you|fable|mythos)\b(?:\s+(\d(?:\.\d)?))?(?: please)?$/);
    if (mdm) return { kind: 'allModels', name: mdm[1] };
    if (CLOCK_ON.test(flat)) return { kind: 'lookClock', on: true };   // 9.3
    if (CLOCK_OFF.test(flat)) return { kind: 'lookClock', on: false };
    const vwc = viewParse(flat);   // 9.1: HQ's view
    if (vwc) return vwc;
    const lkc = lookParse(flat);   // 8.9.3, 9.0.1: HQ's look
    if (lkc) return lkc;
    if (/^(go quiet|quiet|be quiet|quiet mode|hush|shh+)$/.test(flat)) return { kind: 'quiet' };
    // 7.2: hold the board for a few of your messages
    const BOARD = '(?:the )?(?:switchboard|switch board|switch boards|switchboards|switcheroo|switch a roo|switch roo|board|alerts?|notifications?|chimes?)';
    let pm = flat.match(new RegExp('^(?:pause|hold|mute|silence|quiet) ' + BOARD + '(?: for (?:the next )?(.+?)(?: more)?(?: prompts?| turns?| messages?| exchanges?| rounds?)?)?$'));
    if (pm) {
      const n = pm[1] ? toNum(pm[1]) : 2;
      if (!pm[1] || (isFinite(n) && n >= 1 && n <= 20)) return { kind: 'pauseTurns', n: pm[1] ? n : 2 };
    }
    if (new RegExp('^(?:resume|unpause|un pause|unmute|restart) ' + BOARD + '$').test(flat) || /^(?:switchboard|switch board|switcheroo) (?:back on|on)$/.test(flat)) return { kind: 'wake' };
    if (/^(wake up|wake|wakey wakey|i'm back|im back)$/.test(flat)) return { kind: 'wake' };
    // 6.7: the rest of a capped reply, or a whole reply
    if (/^(?:keep reading|read more|read the rest|the rest|rest of it|read on|finish (?:it|reading)|finish the reply)(?: please)?$/.test(flat)) return { kind: 'more' };
    if (/^(?:keep going|go on|continue|more|carry on)(?: please)?$/.test(flat) && moreWaiting()) return { kind: 'more' };
    if (/^(?:(?:could you|can you|would you|please)\s+)?read (?:the whole (?:thing|reply|message|response)|all of it|it all|everything)(?: please)?$/.test(flat)) return { kind: 'readAll' };
    // 6.7: "could you repeat that", "can you read it again for me"
    const flatRead = flat.replace(/^(?:could you|can you|would you|will you)\s+(?:please\s+)?/, '').replace(/\s+for me$/, '');
    // 4.8: hear the latest reply without touching the speaker button
    if (/^(read it|read that|read it again|read that again|read it to me|read the last one|read the last reply|read the reply|read me the reply|repeat|repeat that|say that again|play it|play that|what did you say|what did claude say)$/.test(flatRead)) return { kind: 'read' };
    // 6.1: short read or repeat requests in other words
    if (/^(please )?(read|repeat|replay|reread|play)( (it|that|this|them|back|again|aloud|out loud|to me|please|the (last )?(one|reply|response|message|answer)))*( please)?$/.test(flatRead)) return { kind: 'read' };
    if (/^(say (it|that) again|come again|say again|one more time)( please)?$/.test(flatRead)) return { kind: 'read' };
    // 7.4: AirPods dictation mishears "read again" (breathe again, reed again, read a game, Reagan)
    if (READ_AGAIN_ALIKE.test(flatRead)) return { kind: 'read' };
    // 3.6: dictation often hears quieter as writer, quitter or quiet her
    if (/^(?:a little |a bit )?(quieter|writer|quitter|quiet her|quite a|choir|quieter please|turn (?:the game|it|that|the tv|the volume) down|game quieter|background quieter)$/.test(flat)) return { kind: 'quieter' };
    if (/^(?:a little |a bit )?(louder|lauder|loud her|louder please|turn (?:the game|it|that|the tv|the volume) up|game louder|background louder)$/.test(flat)) return { kind: 'louder' };
    // 6.6: reading speed; dictation sometimes hears faster as fast her
    if (/^(?:a little |a bit |go |talk |read |speak )?(faster|fast her|quicker|speed up|speed it up)(?: please)?$/.test(flat)) return { kind: 'faster' };
    if (/^(?:a little |a bit |go |talk |read |speak )?(slower|slow her|slow down|slow it down)(?: please)?$/.test(flat)) return { kind: 'slower' };
    if (/^(?:normal|regular|default|usual) (?:speed|pace)$/.test(flat)) return { kind: 'speedReset' };
    // 7.0: the mic live sound
    // 7.1: "mic sound" in any words
    // 9.7: "mic sound voices", "voice cues": sound 22
    if (/^(?:(?:mic|mike|my) )?(?:sound )?(?:voices|voice cues?)$/.test(flat) || /^(?:mic|mike) (?:sound )?voice$/.test(flat)) return { kind: 'cue', n: CUES.length };
    const bag = micSoundBag(flat);
    if (bag) return bag;
    // 7.0.1: dictation hears sound as bound, found, round or sounds
    const SND = "(?:sounds?|bound|found|round|sound's)";
    let m = flat.match(new RegExp("^(?:try |use |play |pick |set )?(?:the )?(?:(?:mic|mike|mike's|my|microphone|beep) )?" + SND + "(?: number)? (.+)$"));
    if (m) {
      const n = toNum(m[1]);
      // "round 3" or "found 7" alone could be anything; they count only after mic, try, use and the like
      const loose = !/^(?:try |use |play |pick |set |the |mic |mike |mike's |my |microphone |beep )/.test(flat) && !/^sounds? /.test(flat);
      if (isFinite(n) && n >= 1 && n <= CUES.length && !loose) return { kind: 'cue', n };   // 9.7: was 20, so 21 and 22 never took
      if (/^(?:louder|up|a bit louder|a little louder)$/.test(m[1])) return { kind: 'cueVol', dir: 1 };
      if (/^(?:quieter|softer|down|a bit quieter|a little quieter)$/.test(m[1])) return { kind: 'cueVol', dir: -1 };
    }
    if (new RegExp("^(?:next|nex|necks|x|ex|text|next's|another|different|try another|try the next|a new|new) (?:mic |mike )?" + SND + "$").test(flat)) return { kind: 'cueStep', dir: 1 };
    if (new RegExp("^(?:previous|last|back one|go back a) (?:mic |mike )?" + SND + "$").test(flat)) return { kind: 'cueStep', dir: -1 };
    if (new RegExp("^(?:louder|quieter|softer) (?:mic |mike )?" + SND + "$").test(flat)) return { kind: 'cueVol', dir: /^louder/.test(flat) ? 1 : -1 };
    // 7.0.3: a clipped first word ("that's sound", "X sound") or "sound" alone: the next sound
    if (/^(?:[a-z']{1,8} )?sounds?$/.test(flat) && !/^(?:good|great|nice|safe|sweet|cool|fine|no|what|that sounds|it sounds) /.test(flat + ' ')) return { kind: 'cueStep', dir: 1 };
    m = flat.match(/^snooze(?: for)?(?: (.+?))?(?: minutes?| mins?)?$/);
    if (m) {
      const n = m[1] ? toNum(m[1]) : 10;
      return { kind: 'snooze', minutes: isFinite(n) && n > 0 ? Math.min(Math.round(n), 480) : 10 };
    }
    m = flat.match(/^(?:start |open |make )?(?:a )?(?:new|fresh) (?:chat|conversation|thread)(?: (?:in|on|for|under|and|an|at|into|inside|to)? ?(?:the |my )?(.+?))?(?: project)?$/);
    if (m) return { kind: 'newChat', project: (m[1] || '').trim() };
    m = flat.match(GO_WORDS);
    // a real chat name always counts; a short plain "take me to X" with no match gets a "don't see it" reply,
    // but "can you take me to the next step and..." goes to Claude as a message
    if (m && (findDest(m[1], false) || (!/^(?:can you|could you|would you|please|i want to|i wanna|i'd like to)\s/.test(flat) && m[1].split(' ').length <= 6))) return { kind: 'switch', name: m[1] };
    // 6.5: softer words count only when they clearly match a chat, so "show me the plan" goes to Claude
    m = flat.match(/^(?:(?:can you|could you|please)\s+)?(?:open up|open|reopen|pull up|bring up|show me|let me see|resume)\s+(?:the\s+|my\s+)?(.+?)(?:\s+please)?$/);
    if (m && findDest(m[1], true)) return { kind: 'switch', name: m[1] };
    // a message ending in "next" after a pause, or in "next chat": send it, then jump
    // 2.6.1: dictation often leaves a comma or a trailing space after the last word
    m = t.match(/^([\s\S]*?[.!?,;:])\s*next[\s.!?,;:]*$/i) || t.match(/^([\s\S]*?)[\s.,;:!?]+next chat[\s.!?,;:]*$/i);
    if (m && /[\p{L}\p{N}]/u.test(m[1])) return trivialBody(m[1]) ? { kind: 'next' } : { kind: 'sendNext', keep: m[1].trim() };
    // 3.3: a message ending in "new chat in alder" after a pause: send it, then start that chat
    m = t.match(/^([\s\S]*?[.!?,;:])\s*(?:(?:uh+|um+|okay|ok|so)[,.]?\s+)?(?:start |open |make )?(?:a )?(?:new|fresh) (?:chat|conversation|thread)(?: (?:in|on|for|under|and|an|at|into|inside|to)? ?(?:the |my )?([^.!?]+?))?(?: project)?[\s.!?,;:]*$/i);
    if (m && /[\p{L}\p{N}]/u.test(m[1])) return trivialBody(m[1]) ? { kind: 'newChat', project: (m[2] || '').trim() } : { kind: 'sendNew', keep: m[1].trim(), project: (m[2] || '').trim() };
    // 6.5: a message ending in "take me to roof study" after a pause: send it, then go there
    m = t.match(/^([\s\S]*?[.!?,;:])\s*(?:(?:uh+|um+|okay|ok|so|and|now|then|and then)[,.]?\s+)?((?:(?:can you|could you|please|let's|lets)\s+)?(?:switch|jump|go|head|hop|navigate|take me|take us|bring me|get me)(?:\s+(?:over|back|right|straight))?\s+(?:to|too|into)\s+[^.!?]+?)[\s.!?,;:]*$/i);
    if (m && /[\p{L}\p{N}]/u.test(m[1])) {
      const g = m[2].toLowerCase().replace(/[,;:]+/g, ' ').replace(/\s+/g, ' ').trim().match(GO_WORDS);
      if (g && findDest(g[1], true)) return trivialBody(m[1]) ? { kind: 'switch', name: g[1] } : { kind: 'sendGo', keep: m[1].trim(), name: g[1] };
    }
    return null;
  }
  // 8.0: the words for HOLD and for ending it
  // 8.9.3, 9.0.1: HQ's look by voice. "next look", "previous look", "random look", or a look by name:
  // "blueprint look", "aurora theme", "change the look to tahoe", "switch to retro". A name has to be one
  // of HQ's looks (HQ saves the list), so "take a look" or "switch to <a chat>" still do what they did.
  const LOOK_ALIAS = { dark: 'dark', tron: 'dark', 'andre mandel': 'dark', light: 'light', chxtld: 'light', 'ch x tld': 'light', 'c h x t l d': 'light',
    'clever homes': 'light', 'clever home': 'light', synthwave: 'retro', 'synth wave': 'retro', outrun: 'retro', 'retro futurism': 'retro',
    'retro futurist': 'retro', 'retro futuristic': 'retro', 'retro wave': 'retro', night: 'night', 'night drive': 'night', nightdrive: 'night' };
  const LOOK_NEXT = /^(?:please )?(?:(?:show me |give me |try |go to |switch to )?(?:the |a )?(?:next|another|different|new) (?:look|theme|style|skin)|(?:change|switch|cycle|flip) (?:the )?(?:looks?|themes?|styles?|skins?))(?: please)?$/;
  const LOOK_BACK = /^(?:please )?(?:(?:go )?back (?:a |one )?(?:look|theme|style)|(?:the )?(?:previous|prior|last) (?:look|theme|style|skin)|(?:go )?back to the (?:last|previous) (?:look|theme|style))(?: please)?$/;
  const LOOK_RAND = /^(?:please )?(?:(?:a |pick a |give me a )?random (?:look|theme|style|skin)|surprise me with a (?:look|theme))(?: please)?$/;
  const LOOK_SUFFIX = /^(?:please )?(?:(?:switch|change|set|turn|put|make|go)(?: (?:hq|the hq|switcheroo|screen mode|the screen|it))?(?: to| into| over to)? )?(?:the )?(.{2,32}?) (?:look|theme|mode|style|skin)(?: please)?$/;
  const LOOK_PREFIX = /^(?:please )?(?:switch|change|set|turn|put|make) (?:the |my |hq's |the hq )?(?:look|theme|style|skin)(?: to| into)? (?:the )?(.{2,32}?)(?: please)?$/;
  const LOOK_VERB = /^(?:please )?(?:switch|change|set|turn|put|make)(?: (?:hq|the hq|switcheroo|screen mode|the screen|it))?(?: to| into| over to)? (?:the )?(.{2,32}?)(?: please)?$/;
  const lookNorm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  function lookList() {
    try { const l = JSON.parse(localStorage.getItem('chf_looks')); if (Array.isArray(l) && l.length) return l; } catch (e) {}
    return [['light', 'CHxTLD'], ['dark', 'Tron'], ['retro', 'Retro'], ['night', 'Night drive']];
  }
  function lookFind(w, coreOnly) {
    w = lookNorm(w).replace(/^the /, '');
    if (LOOK_ALIAS[w]) return LOOK_ALIAS[w];
    if (coreOnly) return w === 'retro' ? 'retro' : null;   // a bare "switch to X" only for the first three
    const hit = lookList().find((x) => lookNorm(x[1]) === w || x[0] === w.replace(/ /g, ''));
    return hit ? hit[0] : null;
  }
  // 9.1: "radar view", "show me the puzzle view", "next view", "previous view", "random view"
  const VIEW_ALIAS = { pie: 'pie', 'pie chart': 'pie', radar: 'radar', sonar: 'radar', puzzle: 'puzzle', jigsaw: 'puzzle', 'puzzle piece': 'puzzle', 'puzzle pieces': 'puzzle',
    seismograph: 'seismo', seismo: 'seismo', earthquake: 'seismo', mixer: 'mixer', 'mixing board': 'mixer', meters: 'mixer', meter: 'mixer', equalizer: 'mixer', orbit: 'orbit',
    orbits: 'orbit', planets: 'orbit', 'solar system': 'orbit', lanes: 'lanes', lane: 'lanes', kanban: 'lanes', columns: 'lanes', timeline: 'timeline', gantt: 'timeline',
    departures: 'board', 'departure board': 'board', 'departures board': 'board', 'split flap': 'board', honeycomb: 'hive', hive: 'hive', hexagons: 'hive', hex: 'hive',
    treemap: 'treemap', 'tree map': 'treemap', blocks: 'treemap' };
  const VIEW_NAMES = { pie: 'Pie', radar: 'Radar', puzzle: 'Puzzle', seismo: 'Seismograph', mixer: 'Mixer', orbit: 'Orbit', lanes: 'Lanes', timeline: 'Timeline', board: 'Departures', hive: 'Honeycomb', treemap: 'Treemap' };
  const VIEW_STEP = /^(?:please )?(?:(?:show me |give me |try |go to |switch to )?(?:the |a )?(next|another|different|new|previous|prior|last|random) view|(?:change|switch|cycle) (?:the )?views?)(?: please)?$/;
  const VIEW_NAMED = /^(?:please )?(?:(?:show me|switch to|go to|change to|try|give me|use|show|open)\s+)?(?:the |a )?(.{3,24}?) view(?: please)?$/;
  function viewParse(flat) {
    const st = flat.match(VIEW_STEP);
    if (st) return { kind: 'view', step: /previous|prior|last/.test(st[1] || '') ? -1 : st[1] === 'random' ? 'rand' : 1 };
    const m = flat.match(VIEW_NAMED), id = m && VIEW_ALIAS[m[1].replace(/^the /, '')];
    return id ? { kind: 'view', id } : null;
  }
  function setHqView(c) {   // HQ picks it up from the message, or from storage when it next opens
    const ids = Object.keys(VIEW_NAMES);
    let cur = 'pie';
    try { cur = localStorage.getItem('chf_mirror_view') || 'pie'; } catch (e) {}
    let id = c.id;
    if (!id) {
      const i = Math.max(0, ids.indexOf(cur)), n = ids.length;
      id = c.step === 'rand' ? ids[(i + 1 + Math.floor(Math.random() * (n - 1))) % n] : ids[(i + c.step + n) % n];
    }
    try { localStorage.setItem('chf_mirror_view', id); } catch (e) {}
    post({ t: 'view', id });
    return say(VIEW_NAMES[id] + ' view.');
  }
  const CLOCK_ON = /^(?:please )?(?:(?:turn on |start |use |switch to |go to )?(?:follow(?:ing)? the (?:clock|time of day|time)|time of day (?:looks?|mode|colors?)|clock (?:mode|looks?)|auto(?:matic)? looks?)(?: on| mode)?)(?: please)?$/;
  const CLOCK_OFF = /^(?:please )?(?:(?:stop|quit|don't|dont) follow(?:ing)? the (?:clock|time of day|time)|(?:clock|time of day|auto) (?:mode |looks? )?off|turn off (?:the )?(?:clock|time of day|auto) (?:mode|looks?))(?: please)?$/;
  const LOOK_NUM = /^(?:please )?(?:(?:go to|switch to|show me|try|jump to|set|use|give me) )?(?:the )?look (?:number )?([a-z]+(?: [a-z]+)?|\d{1,2})(?: please)?$/;
  function lookParse(flat) {
    const ln = flat.match(LOOK_NUM);   // 9.1: "look eight", "go to look number twenty"
    if (ln) { const n = toNum(ln[1]), l = lookList(); if (isFinite(n) && n >= 1 && n <= l.length) return { kind: 'look', id: l[n - 1][0] }; }
    if (LOOK_NEXT.test(flat)) return { kind: 'look', step: 1 };
    if (LOOK_BACK.test(flat)) return { kind: 'look', step: -1 };
    if (LOOK_RAND.test(flat)) return { kind: 'look', step: 'rand' };
    let m = flat.match(LOOK_SUFFIX), id = m && lookFind(m[1]);
    if (!id) { m = flat.match(LOOK_PREFIX); id = m && lookFind(m[1]); }
    if (!id) { m = flat.match(LOOK_VERB); id = m && lookFind(m[1], true); }
    return id ? { kind: 'look', id } : null;
  }
  function setHqLook(c) {   // HQ picks it up from the message, or from storage when it next opens
    const l = lookList();
    let ids = l.map((x) => x[0]);
    if (!c.id && c.step !== 'rand') {   // 9.1: next and previous keep to favorites when that's how HQ's arrows step
      try {
        const f0 = JSON.parse(localStorage.getItem('chf_look_favs') || '[]'), fv = ids.filter((id) => f0.includes(id));   // 9.3: dark to light
        if (localStorage.getItem('chf_look_step') === 'fav' && fv.length) ids = fv;
      } catch (e) {}
    }
    let cur = 'dark';
    try { cur = localStorage.getItem('chf_mirror_theme') || 'dark'; } catch (e) {}
    let id = c.id;
    if (!id) {
      const i = Math.max(0, ids.indexOf(cur)), n = ids.length;
      id = c.step === 'rand' ? ids[(i + 1 + Math.floor(Math.random() * (n - 1))) % n] : ids[(i + c.step + n) % n];
    }
    try { localStorage.setItem('chf_mirror_theme', id); } catch (e) {}
    post({ t: 'look', id });
    const nm = id === 'light' ? 'Light' : ((l.find((x) => x[0] === id) || [id, id])[1]);
    return say(nm + ' look.');
  }
  const HOLD_SAID = /^(?:please )?(?:silence|silent|silence (?:everything|all|it|claude|responses|switchboard)|hold (?:everything|all|it all|all of it|responses|the responses|all responses)|hold responses|responses off|response off|turn (?:off )?(?:the |all )?responses(?: off)?|turn (?:the )?responses off|pause (?:all |the )?responses|pause everything|pause all|stop (?:all |the )?responses|stop everything|stop all|stop all processes|stop all of it|stop talking|no more responses|meeting mode|meeting|in a meeting|i'm in a meeting|im in a meeting|shut up|shut it|quiet everything|everything off|all off)(?: please| now| for now)?$/;
  const UNHOLD_SAID = /^(?:please )?(?:resume|resume everything|resume all|resume responses|responses on|response on|turn (?:on )?(?:the )?responses(?: back)? on|turn responses back on|turn on responses|back on|unhold|un hold|end hold|end the hold|release|release hold|meeting over|meeting's over|meetings over|meeting is over|out of the meeting|i'm out of the meeting|end meeting mode|go live|everything on|all on)(?: please| now)?$/;
  // 6.5: every way of saying "take me there"; dictation sometimes writes to as too
  const GO_WORDS = /^(?:(?:can you|could you|would you|please|let's|lets|let us|i want to|i wanna|i'd like to)\s+)?(?:(?:switch|jump|go|swap|change|move|head|hop|navigate|take me|take us|bring me|get me|send me)(?:\s+(?:over|back|right|straight))?\s+(?:to|too|into|onto|on to)|back to|over to|return to)\s+(?:the\s+)?(.+?)(?:\s+please)?$/;
  // 7.1: a short phrase made only of these words is about the mic sound
  const MS_SOUND = new Set('sound sounds sound\'s ping pings bell bells alert alerts notification notifications tone tones chime chimes beep beeps cue cues ding dings noise noises signal tick effect effects'.split(' '));
  const MS_ALIKE = new Set(['bound', 'found', 'round']);   // how dictation hears sound; only next to a mic or change word
  const MS_MIC = new Set('mic mike mike\'s mic\'s mics microphone microphones microphone\'s claude claude\'s live'.split(' '));
  const MS_HOT = new Set(['hot', 'open']);
  const MS_VERB = new Set('change changing adjust revise revive switch swap cycle next nex necks x ex text another different new try update set pick use rotate alternate other choose select give get move go edit tweak modify fix'.split(' '));
  const MS_BACK = new Set('previous back last prior before'.split(' '));
  const MS_UP = new Set('louder up raise increase boost higher bigger'.split(' '));
  const MS_DOWN = new Set('quieter softer down lower decrease reduce smaller'.split(' '));
  const MS_FILL = new Set('the a an my to please can you could would will let\'s lets i want wanna like i\'d me for it this that of on now again just some kind so number turn make volume level its it\'s is sound\'s'.split(' '));
  function micSoundBag(flat) {
    const w = flat.split(' ').filter(Boolean);
    if (!w.length || w.length > 9) return null;
    let snd = false, alike = false, mic = false, hot = false, verb = false, back = false, up = false, down = false;
    const nums = [];
    for (const x of w) {
      if (MS_SOUND.has(x)) snd = true;
      else if (MS_ALIKE.has(x)) alike = true;
      else if (MS_MIC.has(x)) mic = true;
      else if (MS_HOT.has(x)) hot = true;
      else if (MS_BACK.has(x)) back = true;
      else if (MS_UP.has(x)) up = true;
      else if (MS_DOWN.has(x)) down = true;
      else if (MS_VERB.has(x)) verb = true;
      else if (/^\d{1,2}$/.test(x) || x in NUMS || x === 'one') nums.push(x);
      else if (!MS_FILL.has(x)) return null;   // a word from outside: it's a message for Claude
    }
    if (alike && (mic || hot || verb || back || up || down)) snd = true;
    if (!(snd || (mic && hot))) return null;
    if (!snd && !(verb || back || up || down || nums.length)) return null;   // "open the mic" is not about the sound
    if (up !== down) return { kind: 'cueVol', dir: up ? 1 : -1 };
    // "another one" means the next sound, not sound 1
    const n = nums.length && !(verb && nums.length === 1 && nums[0] === 'one') ? toNum(nums.join(' ')) : NaN;
    if (isFinite(n) && n >= 1 && n <= CUES.length) return { kind: 'cue', n };   // 8.9.2: 21 is the long bell
    if (nums.length && !verb && !back) return null;   // "sound 25": not one of ours
    if (back) return { kind: 'cueStep', dir: -1 };
    if (verb) return { kind: 'cueStep', dir: 1 };
    if (mic || hot) return { kind: 'cueSay' };          // "mic sound": which one is it now
    return null;
  }
  // 6.2: "next." or "uh, okay" in front of a command is not a message worth sending
  function trivialBody(k) {
    const w = String(k || '').toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, ' ').replace(/\s+/g, ' ').trim();
    return !w || w.replace(/ /g, '').length <= 3 ||
      /^(?:(?:uh+|um+|hmm+|okay|ok|so|and|then|next|alright|all right|right|yeah|yes|well|now|stop|stop it|stop that|stop reading|wait|hold on|hang on|nope|actually|sorry|never mind|nevermind|cancel that|scratch that|switcheroo)\s*)+$/.test(w);   // 8.9.1: lead ins
  }

  function clearComposer() {
    const c = composer();
    if (!c) return;
    c.focus();
    const sel = window.getSelection();
    const r = document.createRange();
    r.selectNodeContents(c);
    sel.removeAllRanges();
    sel.addRange(r);
    document.execCommand('delete', false);
  }
  async function trimTail(keep) {
    const c = composer();
    if (!c) return;
    const n = composerText().length - keep.length;
    caretToEnd(c);
    for (let i = 0; i < n + 3 && composerText().length > keep.length; i++) document.execCommand('delete', false);
    await sleep(80);
    if (composerText() !== keep) { clearComposer(); insertIntoComposer(keep); await sleep(80); }
  }

  async function runCommand(c) {
    dlog('command', c.kind + (c.name ? ' ' + c.name : ''));
    if (c.kind === 'abort') return abortReading('said it');   // 9.4.4
    if ((c.kind === 'allow' || c.kind === 'deny' || c.kind === 'allowApp' || c.kind === 'needApp') && c.here && !voiceApproval()) {
      approval = { id: ME, key: sb.reqKey || '', folder: sb.folder || '', comp: sb.comp || null, name: shortName(chatTitle()), until: 0, voiceUntil: Date.now() + 5000 };
    }
    if (c.kind === 'allModels') return modelAll(c.name);   // 8.8
    if (c.kind === 'allowApp') return approveApp(c.name);   // 8.1
    if (c.kind === 'approvalWord') {   // 8.1: aim it at the request that's waiting, or drop it
      const w = listTabs().filter((e) => e.on && e.state === 'red' && (e.reqKey || e.folder))
        .sort((a, b) => (b.id === ME) - (a.id === ME) || (a.since || 0) - (b.since || 0))[0];
      if (!w) return say('Nothing is waiting for an allow.');
      approval = { id: w.id, key: w.reqKey || '', folder: w.folder || '', comp: w.comp || null, name: w.name, until: 0, voiceUntil: Date.now() + 5000, askedAt: Date.now() };
      const f = c.flat;
      if (/^(?:deny|deny it|don't allow|dont allow|do not allow)$/.test(f)) return denyNow();
      const am = f.match(ALLOW_APP);
      if (w.comp) return am && !ALLOW_SAID.test(f) ? approveApp(am[1]) : approveNow();
      return approveNow();
    }
    if (c.kind === 'needApp') { if (approval) approval.voiceUntil = Math.max(approval.voiceUntil, Date.now() + VOICE_APPROVE_MS); return approveNow(); }
    if (c.kind === 'cue') return setCue(c.n);
    if (c.kind === 'cueStep') return setCue(cueNum() + c.dir);
    if (c.kind === 'cueVol') return stepCueVol(c.dir);
    if (c.kind === 'cueSay') { playCue(); return sleep(CUES[cueNum() - 1].len * 1000 + 350).then(() => say('Your mic sound is ' + cueNum() + ', ' + CUES[cueNum() - 1].name + '. Say change mic sound for another.')); }
    if (c.kind === 'allow') return approveNow();
    if (c.kind === 'deny') return denyNow();
    if (c.kind === 'next') return jumpNext(true);
    if (c.kind === 'status') return sayStatus();
    if (c.kind === 'switch') return switchByName(c.name);
    if (c.kind === 'newChat') return newChat(c.project, false);
    if (c.kind === 'quieter') return stepRead(-1, true);
    if (c.kind === 'duckMode') return setDuckMode(c.m, true);   // 8.3
    if (c.kind === 'look') return setHqLook(c);
    if (c.kind === 'view') return setHqView(c);                 // 9.1
    if (c.kind === 'lookClock') {                                // 9.3
      try { localStorage.setItem('chf_look_clock', c.on ? 'on' : 'off'); } catch (e) {}
      post({ t: 'look-clock', on: c.on });
      return say(c.on ? 'Following the clock.' : 'Not following the clock.');
    }                 // 8.9.3, 9.0.1
    if (c.kind === 'deck') {   // 7.9 (8.1: a deck already open in another tab is used, not opened twice)
      if (DK.present) return deckStart('voice');
      const other = [...deckTabs].filter(([id, at]) => Date.now() - at < 15000).sort((a, b) => b[1] - a[1])[0];
      if (other) { post({ t: 'deck-start', to: other[0] }); return say('Swipe Deck.'); }
      return openDeck();
    }
    if (c.kind === 'chief') return chiefBrief();          // 9.0
    if (c.kind === 'chiefNeeds') return chiefNeeds();
    if (c.kind === 'chiefDone') return chiefDone(c.n);
    if (c.kind === 'chiefUndo') return chiefUndo();
    if (c.kind === 'outbox') return oxList(c.lane || 'ch');   // 9.1, 9.4
    if (c.kind === 'oxRead') return oxRead(c.n);
    if (c.kind === 'update') return checkUpdate(true);   // 8.1.1
    if (c.kind === 'boot') return bootFromChat();         // 8.9
    if (c.kind === 'videoCheck') return videoCheck();   // 8.4
    if (c.kind === 'openLink') return openLink(c.n === -1 ? chatLinks().length : c.n);   // 8.2
    if (c.kind === 'closePage') { post({ t: 'page-close', from: ME }); return say('Page closed.'); }
    if (c.kind === 'follow') { post({ t: 'follow' }); toast('Screen mode follows the voice again'); return; }   // 8.1
    if (c.kind === 'read') {
      takeFloor('touch');
      const a = readAsk();   // 7.9: a question card on screen is what "read it again" means
      if (a) { askKeyRead = a.key; return say(askText(a)); }
      return readLatest(true);
    }
    if (c.kind === 'more') return readMore();
    if (c.kind === 'readAll') { takeFloor('touch'); return readLatest(true, true); }
    if (c.kind === 'louder') return stepRead(1, true);
    if (c.kind === 'faster') return stepSpeed(1);
    if (c.kind === 'slower') return stepSpeed(-1);
    if (c.kind === 'speedReset') return stepSpeed(0);
    if (c.kind === 'pauseTurns') {
      hush();
      setQuiet({ quiet: false, until: 0, turns: c.n, turnsDone: false, turnsUntil: Date.now() + 30 * 60000 });
      return say('Switcheroo paused for ' + (c.n === 1 ? 'one turn.' : c.n + ' turns.'));
    }
    if (c.kind === 'quiet') { hush(); setQuiet({ quiet: true, until: 0 }); return say('Going quiet. Say wake up when you want me back.'); }
    if (c.kind === 'hold') return setHold(true, c.meeting);     // 8.0 (8.1: meeting mode shows as MEETING)
    if (c.kind === 'unhold') return setHold(false);
    if (c.kind === 'pauseToggle') {   // 7.3: the board's button, Option Shift Q, the menu
      if (held) return setHold(false);   // 8.0: Resume on the board ends a hold first
      if (quietNow()) { setQuiet({ quiet: false, until: 0 }); return say('Switcheroo is back on.'); }
      return runCommand({ kind: 'pauseTurns', n: 2 });
    }
    if (c.kind === 'wake') { setQuiet({ quiet: false, until: 0 }); return say("I'm up."); }
    if (c.kind === 'snooze') {
      setQuiet({ quiet: false, until: Date.now() + c.minutes * 60000 });
      return say('Snoozing ' + c.minutes + (c.minutes === 1 ? ' minute.' : ' minutes.'));
    }
  }
  // 8.1.1: a newer Switcheroo on GitHub opens Tampermonkey's update page; one click on Update installs it
  async function checkUpdate(asked) {
    const v = await latestVersion();
    if (!v) { if (asked) say("I couldn't reach GitHub to check."); return; }
    if (!verNewer(v, SW_VER)) { if (asked) say("You're on the latest Switcheroo, " + SW_VER + '.'); return; }
    if (!asked) {
      if (lsJson('chf_sw_told', '') === v) return;
      lsPut('chf_sw_told', v);
      toast('Switcheroo ' + v + ' is ready. Say update Switcheroo.');
      if (ownsFloor() && !quietNow()) say('A new Switcheroo is ready. Say update Switcheroo when you want it.');
      return;
    }
    await say('Switcheroo ' + v + ' is ready. Opening the update. Click Update once.');
    try { GM_openInTab(SW_URL + '?t=' + Date.now(), { active: true, insert: true }); } catch (e) { window.open(SW_URL, '_blank'); }
  }
  setTimeout(() => { if (isFloor()) checkUpdate(false); }, 60000);
  setInterval(() => { if (isFloor()) checkUpdate(false); }, 3 * 3600000);

  function setQuiet(q) { quiet = q; lsPut(K_QUIET, q); post({ t: 'quiet', q }); paintBoard(); }

  // ---------- 8.8: one model for every open chat ----------
  // Each chat tab opens its own model picker and clicks the model named, then reports back.
  // A chat that is mid reply or waiting on a card is skipped, and named in the summary.
  const MODEL_RE = /\b(sonnet|opus|haiku|fable|mythos)\b/i;
  const MODEL_ALIAS = { sonnets: 'sonnet', sonet: 'sonnet', hiku: 'haiku', 'hi coup': 'haiku', 'hike you': 'haiku' };
  const modelWord = (n) => { const w = String(n || '').toLowerCase().trim(); return MODEL_ALIAS[w] || w; };
  const modelBtn = () => [...document.querySelectorAll('button[aria-haspopup], button[data-testid*="model" i]')]
    .find((b) => visible(b) && !b.closest('nav, header, [data-testid="user-message"], [data-testid="assistant-message"]') && MODEL_RE.test(b.textContent || '')) || null;
  const modelItems = () => [...document.querySelectorAll('[role="menuitem"],[role="menuitemradio"],[role="option"]')].filter(visible);
  function fullClick(el) {
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
      try { el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window, button: 0 })); } catch (e) {}
    }
  }
  const closeMenus = () => { try { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true })); } catch (e) {} };
  async function setModelHere(want) {
    const w = modelWord(want);
    try {
      if (!composer()) return { ok: false, why: 'no chat' };
      if (buttons('stop').length || sb.ask || sb.state === 'red') return { ok: false, why: 'busy' };
      let b = modelBtn();
      if (!b) return { ok: false, why: 'no picker' };
      if ((b.textContent || '').toLowerCase().includes(w)) return { ok: true, why: 'already' };
      fullClick(b);
      let item = null;
      for (let i = 0; i < 12 && !item; i++) {
        await sleep(150);
        item = modelItems().find((x) => (x.textContent || '').toLowerCase().includes(w)) || null;
        if (!item && i === 5) { const more = modelItems().find((x) => /more models|other models|all models/i.test(x.textContent || '')); if (more) fullClick(more); }
      }
      if (!item) { closeMenus(); return { ok: false, why: 'not listed' }; }
      fullClick(item);
      await sleep(700);
      closeMenus();
      b = modelBtn();
      return b && (b.textContent || '').toLowerCase().includes(w) ? { ok: true, why: '' } : { ok: false, why: 'unverified' };
    } catch (e) { closeMenus(); return { ok: false, why: 'error' }; }
  }
  let mdlRun = null;
  const capWord = (n) => { const w = modelWord(n); return w.charAt(0).toUpperCase() + w.slice(1); };
  function mdlFinish() {
    const r = mdlRun; if (!r) return; mdlRun = null; clearTimeout(r.t);
    const set = r.acks.filter((a) => a.ok).length + (r.me && r.me.ok ? 1 : 0);
    const bad = r.acks.filter((a) => !a.ok).concat(r.me && !r.me.ok ? [{ name: 'this chat', why: r.me.why }] : []);
    const lost = Math.max(0, r.expect - r.acks.length);
    let msg = capWord(r.name) + ' is set in ' + set + (set === 1 ? ' chat.' : ' chats.');
    if (bad.length) msg += ' Skipped ' + bad.slice(0, 3).map((a) => (a.name || 'a chat') + ' (' + (a.why || 'failed') + ')').join(', ') + (bad.length > 3 ? ' and ' + (bad.length - 3) + ' more' : '') + '.';
    if (lost) msg += ' ' + lost + ' did not answer.';
    say(msg);
  }
  async function modelAll(name) {
    if (mdlRun) return say('Still setting the last one.');
    const token = Math.random().toString(36).slice(2, 8);
    const expect = listTabs().filter((e) => e.on && e.chat && e.id !== ME).length;
    mdlRun = { token, name, expect, acks: [], me: null, t: setTimeout(mdlFinish, 12000) };
    post({ t: 'model', name, from: ME, token });
    say('Setting every chat to ' + capWord(name) + '.');
    mdlRun.me = await setModelHere(name);
    if (mdlRun && mdlRun.acks.length >= mdlRun.expect) mdlFinish();
  }

  // ---------- 8.0: HOLD, for every tab at once ----------
  // On hold nothing reads, talks, chimes or opens the mic by itself, and other tabs aren't turned
  // down. Typing and squeezes still work, so "resume" by voice can end it.
  function setHold(on, meeting) {
    on = !!on;
    lsPut(K_HOLD, { on, meeting: !!(on && meeting), ts: Date.now() });
    post({ t: 'hold', on, meeting: !!(on && meeting) });
    if (on === held && on) { toast('Already on hold. Say resume, or click RESUME'); return; }
    applyHold(on);
  }
  function applyHold(on) {
    on = !!on;
    if (on === held) return;
    held = on;
    dlog(on ? 'hold on' : 'hold off');
    if (on) {
      hardPause = false;
      try { hush(); } catch (e) {}
      try { pauseReading(); } catch (e) {}
      try { deckStop(true); } catch (e) {}
      try { earStop(); } catch (e) {}   // 8.1
      try { const c = last(buttons('cancel')); if (c && autoStarted) { markFinishClick(); c.click(); } } catch (e) {}   // a mic that opened by itself closes
      toast('On hold. Nothing reads or talks until you resume');
    } else {
      toast('Back on');
      if (ownsFloor()) {
        const w = waitingList().length;
        say('Back on.' + (w ? (w === 1 ? ' One chat is waiting.' : ' ' + w + ' chats are waiting.') : ''));
      }
    }
    try { syncDuck(); } catch (e) {}
    paintBoard(); paintPill(); mirrorPush(true);
  }
  // screen mode writes the settings straight into this browser's store; pick them up here
  function reloadCfg() {
    const c = load();
    for (const k of ['autoRead', 'autoSend', 'autoListen', 'listenOff', 'duck', 'duckMode', 'duckReading', 'duckReadLevel', 'el', 'readAlong']) {
      if (k in c) cfg[k] = c[k]; else if (k === 'listenOff' || k === 'duck' || k === 'duckMode' || k === 'el' || k === 'duckReading' || k === 'readAlong') delete cfg[k];
    }
    try { syncDuck(); } catch (e) {}
    paintPill(); paintBoard();
  }
  window.addEventListener('storage', (e) => {
    if (e.key === STORE) reloadCfg();
    else if (e.key === K_HOLD) { try { applyHold(!!(JSON.parse(e.newValue) || {}).on); } catch (x) {} }
    else if (e.key === K_QUIET) { try { quiet = JSON.parse(e.newValue) || { quiet: false, until: 0 }; paintBoard(); } catch (x) {} }
  });

  // "next" on its own parks the chat you're in (grey) so the rotation moves on
  function jumpNext(park) {
    if (park && (sb.state === 'yellow' || (sb.state === 'red' && sb.urgent))) {
      Object.assign(sb, { state: 'idle', since: Date.now(), seen: true, urgent: false, request: '' });
      persistChat();
      publish(true);
    }
    const list = waitingList();
    if (!list.length) { say(park ? 'Nothing else waiting.' : 'Nothing waiting, staying here.'); return; }
    handOff(list.find((e) => e.armed) || list[0], 'next');
  }

  const normName = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^(the|my)\s+/, '').replace(/\s+(chat|tab|please)$/, '').trim();
  // 4.4: dictation mishears names (Birch as Burch or Berch), so close spellings count too
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = d[j];
        d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return d[n];
  }
  const sim = (a, b) => (a && b ? 1 - lev(a, b) / Math.max(a.length, b.length) : 0);
  // how well a spoken name fits a title, 0 to 100; each spoken word finds its closest title word
  function nameScore(q, title) {
    const t = normName(title), tw = t.split(' '), qw = q.split(' ').filter((w) => w.length > 1);
    if (!q) return 0;
    if (t === q) return 100;
    if (t.startsWith(q)) return 85;
    if (t.includes(q)) return 70;
    const hits = qw.filter((w) => tw.includes(w) || (w.length >= 3 && tw.some((x) => x.startsWith(w)))).length;
    const exact = qw.length ? 60 * hits / qw.length : 0;
    const fuzzy = qw.length ? 60 * qw.reduce((sum, w) => sum + Math.max(...tw.map((x) => (x.length >= 3 && sim(w, x) >= 0.5 ? sim(w, x) : 0))), 0) / qw.length : 0;
    return Math.max(exact, fuzzy);
  }
  function bestOf(items, q, nameOf) {
    const ranked = items.map((x) => ({ x, s: nameScore(q, nameOf(x)) })).sort((a, b) => b.s - a.s);
    const top = ranked[0], next = ranked[1];
    if (!top || top.s < 30) return null;
    if (top.s < 60 && next && top.s - next.s < 10) return null;   // too close to call
    return top.x;
  }
  function matchTab(spoken) {
    const q = normName(spoken);
    const list = listTabs();
    const n = toNum(q);
    if (isFinite(n) && list[n - 1]) return list[n - 1];
    return bestOf(list, q, (e) => e.title);
  }
  // ---------- go to any chat by name (6.5) ----------
  // Open tabs first, then chats in the sidebar, then your recent chats from claude.ai.
  const chatIdOf = (path) => { const m = String(path || '').match(/\/chat\/([0-9a-f-]{8,})/i); return m ? m[1].toLowerCase() : ''; };
  const INSIDE_CHAT = '[data-testid="user-message"],[data-testid="assistant-message"],[data-is-streaming],.font-claude-message';
  function sidebarChats() {
    const seen = new Map();
    document.querySelectorAll('a[href*="/chat/"]').forEach((a) => {
      if (ours(a) || a.closest(INSIDE_CHAT)) return;
      const id = chatIdOf(a.getAttribute('href'));
      if (!id || seen.has(id)) return;
      const txt = (a.innerText || a.textContent || a.getAttribute('aria-label') || a.title || '');
      const name = (txt.split('\n').map((x) => x.trim()).find(Boolean) || '').replace(/\s+/g, ' ');
      if (name) seen.set(id, { id, title: name, el: a });
    });
    return [...seen.values()];
  }
  const K_CHATS = 'chf_chat_index';
  let orgCache = '';
  async function orgId() {
    if (orgCache) return orgCache;
    const m = document.cookie.match(/(?:^|;\s*)lastActiveOrg=([0-9a-f-]{36})/i);
    if (m) return (orgCache = m[1]);
    try {
      const r = await fetch('/api/organizations', { credentials: 'include' });
      const j = r.ok ? await r.json() : [];
      const o = Array.isArray(j) ? j.find((x) => x && x.uuid) : null;
      if (o) orgCache = o.uuid;
    } catch (e) {}
    return orgCache;
  }
  // your recent chats, shared by every tab and refreshed every few minutes at most
  function chatIndex() { const x = lsJson(K_CHATS, null); return x && Array.isArray(x.list) ? x : { at: 0, list: [] }; }
  let indexBusy = null;
  function refreshChatIndex(force) {
    const cur = chatIndex();
    if (!force && Date.now() - cur.at < 5 * 60000) return Promise.resolve(cur.list);
    if (indexBusy) return indexBusy;
    indexBusy = (async () => {
      try {
        const org = await orgId();
        if (!org) throw new Error('no org');
        const r = await fetch('/api/organizations/' + org + '/chat_conversations?limit=400', { credentials: 'include' });
        if (!r.ok) throw new Error('status ' + r.status);
        const j = await r.json();
        const arr = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : []);
        const list = arr.filter((c) => c && c.uuid && c.name).map((c) => ({ id: String(c.uuid).toLowerCase(), title: String(c.name).slice(0, 140) }));
        if (list.length) lsPut(K_CHATS, { at: Date.now(), list });
        dlog('chat index', list.length + ' chats');
        return list;
      } catch (e) {
        dlog('chat index failed', String((e && e.message) || e));
        return cur.list;
      } finally { indexBusy = null; }
    })();
    return indexBusy;
  }
  function destinations() {
    const out = [], ids = new Set();
    for (const e of listTabs()) { const id = chatIdOf(e.path); if (id) ids.add(id); out.push({ kind: 'tab', e, id, title: e.title }); }
    for (const c of sidebarChats()) if (!ids.has(c.id)) { ids.add(c.id); out.push({ kind: 'chat', id: c.id, title: c.title, el: c.el }); }
    for (const c of chatIndex().list) if (!ids.has(c.id)) { ids.add(c.id); out.push({ kind: 'chat', id: c.id, title: c.title }); }
    return out;
  }
  // strict: only a clear match (the title starts with the words, or two or more words all fit)
  function findDest(spoken, strict) {
    const q = normName(spoken).replace(/\s+(chat|conversation|thread)$/, '').trim();
    if (!q) return null;
    const tabs = listTabs(), n = toNum(q);
    if (isFinite(n)) return tabs[n - 1] ? { kind: 'tab', e: tabs[n - 1], title: tabs[n - 1].title, raw: 100 } : null;
    const words = q.split(' ').filter((w) => w.length > 1).length;
    const ranked = destinations()
      .map((d) => { const raw = nameScore(q, d.title); return Object.assign(d, { raw, s: Math.min(100, raw + (d.kind === 'tab' ? 12 : 0)) }); })
      .sort((a, b) => b.s - a.s);
    const top = ranked[0], next = ranked[1];
    if (!top || top.raw < 30) return null;
    if (top.s < 60 && next && top.s - next.s < 10) return null;   // too close to call
    if (strict && !(top.raw >= 85 || (words >= 2 && top.raw >= 60))) return null;
    return top;
  }
  function spaGo(path) {
    try {
      const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
      const r = w.next && w.next.router;
      if (r && typeof r.push === 'function') { r.push(path); return true; }
    } catch (e) {}
    return false;
  }
  // moves THIS tab to the chat, so it keeps your AirPods; a working chat you leave keeps its tile
  async function openChatHere(d, sent) {
    const path = '/chat/' + d.id, label = shortName(d.title);
    if (location.pathname.toLowerCase() === path) return say("You're already in " + label + '.');
    const oldPath = location.pathname;
    if (sent) { for (let i = 0; i < 20 && !isWorking(); i++) await sleep(250); }   // let the message land
    const keep = /^\/chat\//.test(oldPath) && (sent || isWorking() || sb.state === 'red');
    if (keep && typeof GM_openInTab === 'function') {
      try { GM_openInTab(location.origin + oldPath, { active: false, insert: true, setParent: true }); } catch (e) {}
    }
    if (!isFloor()) takeFloor('touch');
    dlog('go to chat', label + ' ' + path);
    const link = (d.el && d.el.isConnected) ? d.el : ((sidebarChats().find((c) => c.id === d.id) || {}).el);
    let moved = false;
    if (link) { link.click(); moved = true; } else moved = spaGo(path);
    if (moved) for (let i = 0; i < 30; i++) { await sleep(200); if (location.pathname.toLowerCase() === path && composer()) break; }
    if (location.pathname.toLowerCase() !== path) {
      // no quiet way in: load the page. It needs one click before it can talk again.
      await say('Opening ' + label + '. Click it once so it can talk.');
      location.assign(path);
      return;
    }
    await sleep(300);
    publish(true);
    await say(label + '.');
    if (await readOnArrival('went to a chat by voice')) return;   // 8.1: read it, mic after
    openTurnMic('went to a chat by voice');
  }
  async function switchByName(spoken, sent) {
    if (/^next( chat| one)?$/.test(normName(spoken))) return jumpNext(false);
    let d = findDest(spoken, false);
    if (!d) { await refreshChatIndex(true); d = findDest(spoken, false); }
    if (!d) return say("I don't see a chat called " + spoken + '.');
    if (d.kind === 'tab') {
      if (d.e.id === ME) return say("You're already in " + d.e.name + '.');
      return handOff(d.e, 'switch');
    }
    return openChatHere(d, sent);
  }
  setTimeout(() => refreshChatIndex(false), 4000 + Math.random() * 6000);
  setInterval(() => { if (isFloor()) refreshChatIndex(false); }, 5 * 60000);

  // ---------- new chat by voice (3.3) ----------
  // Moves THIS tab to a fresh chat with a click on the sidebar link, so the page never reloads
  // and keeps its AirPods. The chat you were in reopens in a background tab to keep its tile.
  function projectLinks() {
    const seen = new Map();
    document.querySelectorAll('a[href*="/project/"]').forEach((a) => {
      if (ours(a)) return;
      const m = (a.getAttribute('href') || '').match(/\/project\/([0-9a-f-]{8,})\/?$/i);
      if (!m) return;
      const name = (a.innerText || a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (name && !seen.has(m[1])) seen.set(m[1], { id: m[1], name, el: a });
    });
    return [...seen.values()];
  }
  function matchProject(spoken) {
    const q = normName(spoken).replace(/\s+project$/, '');
    return bestOf(projectLinks(), q, (p) => p.name);
  }
  // 8.9.1: every project you have, not just the ones the sidebar shows, kept for ten minutes
  const K_PROJ = 'chf_project_index';
  async function projectIndex() {
    const cur = lsJson(K_PROJ, null);
    if (cur && Array.isArray(cur.list) && cur.list.length && Date.now() - cur.at < 10 * 60000) return cur.list;
    try {
      const org = await orgId();
      if (!org) throw new Error('no org');
      const r = await fetch('/api/organizations/' + org + '/projects', { credentials: 'include' });
      if (!r.ok) throw new Error('status ' + r.status);
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : []);
      const list = arr.filter((x) => x && x.uuid && x.name).map((x) => ({ id: String(x.uuid).toLowerCase(), name: String(x.name).slice(0, 120) }));
      if (list.length) lsPut(K_PROJ, { at: Date.now(), list });
      return list;
    } catch (e) {
      dlog('project index failed', String((e && e.message) || e));
      return (cur && cur.list) || [];
    }
  }
  async function findProject(spoken) {
    const p = matchProject(spoken);
    if (p) return p;
    const q = normName(spoken).replace(/\s+project$/, '');
    const hit = bestOf(await projectIndex(), q, (x) => x.name);
    if (!hit) return null;
    const el = [...document.querySelectorAll('a[href*="/project/"]')].find((a) => !ours(a) && (a.getAttribute('href') || '').toLowerCase().includes(hit.id)) || null;
    return { id: hit.id, name: hit.name, el };
  }
  // 8.9.1: "new chat in X" had to load a page: the new chat takes the floor, says its name and opens the mic
  const K_NEWCHAT = 'chf_newchat';
  try {
    const nc = JSON.parse(sessionStorage.getItem(K_NEWCHAT) || 'null');
    sessionStorage.removeItem(K_NEWCHAT);
    if (nc && Date.now() - (nc.at || 0) < 30000) (async () => {
      for (let i = 0; i < 40 && !composer(); i++) await sleep(250);
      await sleep(1200);
      if (tabOff) return;
      takeFloor('voice');
      dlog('new chat by voice, after load', nc.label || '');
      const ok = await say((nc.label || 'New chat') + '.');
      if (!ok) openTurnMic('new chat by voice');
    })();
  } catch (e) {}
  async function newChat(spoken, sent, proj) {
    let target = null, label = 'New chat', url = '/new';
    if (proj) {   // 9.6: a double press, already knows the project
      target = proj.el; label = 'New chat in ' + shortName(proj.name); url = '/project/' + proj.id;
    } else if (spoken) {
      const p = await findProject(spoken);   // 8.9.1: the sidebar first, then every project you have
      if (!p) { await say("I don't see a project called " + spoken + '.'); return; }
      target = p.el; label = 'New chat in ' + shortName(p.name); url = '/project/' + p.id;
    } else {
      target = [...document.querySelectorAll('a[href="/new"], a[href$="/new"]')].find((a) => !ours(a)) || null;
    }
    const oldPath = location.pathname;
    if (sent) { for (let i = 0; i < 20 && !isWorking(); i++) await sleep(250); }   // let the message land
    const keep = /^\/chat\//.test(oldPath) && (sent || isWorking());
    if (keep && typeof GM_openInTab === 'function') {
      try { GM_openInTab(location.origin + oldPath, { active: false, insert: true, setParent: true }); } catch (e) {}
    }
    if (!target) {   // 8.9.1: the page has to load; the new chat picks up the floor and the mic when it does
      try { sessionStorage.setItem(K_NEWCHAT, JSON.stringify({ at: Date.now(), label })); } catch (e) {}
      location.assign(url);
      return;
    }
    target.click();
    for (let i = 0; i < 30; i++) { await sleep(200); if (location.pathname !== oldPath && composer()) break; }
    await sleep(300);
    publish(true);
    await say(label + '.');
    openTurnMic('new chat by voice');
  }

  function ago(since) {
    const m = Math.floor((Date.now() - since) / 60000);
    if (m < 1) return 'under a minute';
    if (m < 60) return m + (m === 1 ? ' minute' : ' minutes');
    const h = Math.floor(m / 60);
    return h === 1 ? 'over an hour' : h + ' hours';
  }
  function sayStatus() {
    const list = listTabs();
    if (!list.length) return say('The board is empty.');
    const parts = [];
    const here = list.find((e) => e.id === floorId);
    if (here) parts.push("You're in " + here.name + '.');
    list.filter((e) => e.state === 'red').forEach((e) => parts.push(e.folder ? folderLine(e) : e.name + (e.reqKey ? ' needs approval.' : ' is urgent.')));
    const ys = list.filter((e) => e.state === 'yellow' && e.id !== floorId).sort((a, b) => a.since - b.since);
    ys.slice(0, 4).forEach((e) => parts.push(e.name + (e.ask ? ' has a question, waiting ' : ' waiting ') + ago(e.since) + '.'));
    if (ys.length > 4) parts.push('And ' + (ys.length - 4) + ' more waiting.');
    const gs = list.filter((e) => e.state === 'green');
    if (gs.length) parts.push(gs.length <= 2 ? gs.map((e) => e.name).join(' and ') + (gs.length === 1 ? ' is working.' : ' are working.') : gs.length + ' chats working.');
    const idle = list.filter((e) => e.state === 'idle').length;
    if (idle) parts.push(idle === 1 ? 'One chat idle.' : idle + ' chats idle.');
    if (!parts.slice(here ? 1 : 0).length) parts.push('Nothing else going on.');
    if (pausedTurns()) parts.push('Paused for ' + (quiet.turns > 0 ? quiet.turns + ' more ' + (quiet.turns === 1 ? 'turn.' : 'turns.') : 'this reply.'));
    else if (quiet.quiet) parts.push('Quiet mode is on.');
    else if (Date.now() < quiet.until) parts.push('Snoozed for ' + ago(Date.now() - (quiet.until - Date.now())) + ' more.');
    return say(parts.join(' '));
  }

  // ---------- switchboard: the board ----------
  const COLORS = { green: '#35b27a', yellow: '#f0c24b', red: '#ef5a4c', idle: '#8d9894' };
  const sbCss = document.createElement('style');
  sbCss.id = 'chf-sb-style';
  sbCss.textContent = [
    '#chf-board{position:fixed;z-index:999997;top:64px;right:12px;width:240px;max-width:calc(100vw - 24px);box-sizing:border-box;font:12px/1.35 system-ui,-apple-system,sans-serif;color:#eef3f1;background:rgba(27,36,33,.95);border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.28);padding:6px;display:none}',
    '#chf-board.min{width:auto;padding:6px 9px}',
    '#chf-board .hd{display:flex;align-items:center;gap:7px;padding:2px 4px 6px;cursor:move;user-select:none;touch-action:none}',
    '#chf-board.min .hd{padding:0}',
    '#chf-board .hd b{font-weight:650;letter-spacing:.02em}',
    '#chf-board .mode{margin-left:auto;font-weight:500;opacity:.8;white-space:nowrap}',
    '#chf-board .pz{all:unset;cursor:pointer;font:600 11px/1 system-ui,-apple-system,sans-serif;letter-spacing:.03em;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.12);color:#eef3f1;white-space:nowrap}',
    '#chf-board .pz:hover{background:rgba(255,255,255,.22)}',
    '#chf-board .pz.on{background:#f0c24b;color:#231a04}',
    '#chf-board .pz:focus-visible{outline:2px solid #fff;outline-offset:1px}',
    '#chf-board .hz{all:unset;cursor:pointer;font:700 11px/1 system-ui,-apple-system,sans-serif;letter-spacing:.03em;padding:4px 8px;border-radius:999px;background:#c4402f;color:#fff;white-space:nowrap}',
    '#chf-board .hz:hover{background:#d9503e}',
    '#chf-board .hz.on{background:#35b27a;color:#06140e}',
    '#chf-board .hz:focus-visible{outline:2px solid #fff;outline-offset:1px}',
    '#chf-board.min .hz{margin-left:4px}',
    '#chf-board .dots{display:none;gap:5px;align-items:center}',
    '#chf-board.min .dots{display:flex}',
    '#chf-board.min .tiles,#chf-board.min .hd b,#chf-board.min .foot{display:none}',
    '#chf-board.min .mode{margin-left:4px}',
    '#chf-board .tiles{display:grid;gap:4px}',
    '#chf-board .tile{all:unset;box-sizing:border-box;display:grid;grid-template-columns:10px 14px 1fr auto;align-items:center;gap:7px;padding:6px 8px;border-radius:8px;cursor:pointer;background:rgba(255,255,255,.05);border:1px solid transparent}',
    '#chf-board .tile:hover{background:rgba(255,255,255,.11)}',
    '#chf-board .tile:focus-visible{outline:2px solid #fff;outline-offset:1px}',
    '#chf-board .tile.floor{border-color:rgba(255,255,255,.6)}',
    '#chf-board .tile.here .nm{font-weight:650}',
    '#chf-board .tile.yellow{background:rgba(240,194,75,.16)}',
    '#chf-board .tile.red{background:rgba(239,90,76,.24)}',
    '#chf-board .tile.off{opacity:.5}',
    '#chf-board .dot{width:10px;height:10px;border-radius:50%;display:block}',
    '#chf-board .no{opacity:.6;font-variant-numeric:tabular-nums;text-align:right}',
    '#chf-board .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '#chf-board .st{opacity:.85;white-space:nowrap;font-variant-numeric:tabular-nums}',
    '#chf-board .tile.unseen .st{font-weight:650;opacity:1}',
    '#chf-board .tile.red .dot,#chf-board .dots .red{animation:chfpulse 1.1s ease-in-out infinite}',
    '@keyframes chfpulse{50%{box-shadow:0 0 0 4px rgba(239,90,76,.35)}}',
    '@media (prefers-reduced-motion:reduce){#chf-board .tile.red .dot,#chf-board .dots .red{animation:none}}',
    '#chf-board .foot{padding:6px 4px 1px;font-weight:600;color:#ffb3aa}'
  ].join('\n');

  const boardEl = document.createElement('div');
  boardEl.id = 'chf-board';
  boardEl.setAttribute('role', 'region');
  boardEl.setAttribute('aria-label', 'Switcheroo');
  const boardMin = () => { try { return localStorage.getItem(K_MIN) === '1'; } catch (e) { return false; } };
  function toggleMin() { try { localStorage.setItem(K_MIN, boardMin() ? '0' : '1'); } catch (e) {} paintBoard(); }

  // 2.8: drag the board by its heading. The spot is shared by every tab and kept on screen.
  const K_POS = 'chf_sb_pos';
  let boardPos = lsJson(K_POS, null);
  let dragging = false, dragMoved = false;
  function placeBoard() {
    if (!boardPos) { boardEl.style.left = ''; boardEl.style.top = ''; boardEl.style.right = ''; return; }
    const w = boardEl.offsetWidth || 240, h = boardEl.offsetHeight || 40;
    const x = Math.min(Math.max(4, boardPos.x), Math.max(4, window.innerWidth - w - 4));
    const y = Math.min(Math.max(4, boardPos.y), Math.max(4, window.innerHeight - h - 4));
    boardEl.style.left = x + 'px'; boardEl.style.top = y + 'px'; boardEl.style.right = 'auto';
  }
  boardEl.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0 || !ev.target.closest('.hd')) return;
    const r = boardEl.getBoundingClientRect();
    const sx = ev.clientX, sy = ev.clientY, ox = sx - r.left, oy = sy - r.top;
    dragging = true; dragMoved = false;
    const move = (e) => {
      if (!dragMoved && Math.hypot(e.clientX - sx, e.clientY - sy) < 5) return;
      dragMoved = true;
      boardPos = { x: Math.round(e.clientX - ox), y: Math.round(e.clientY - oy) };
      placeBoard();
    };
    const up = () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', up, true);
      dragging = false;
      if (dragMoved) lsPut(K_POS, boardPos);
    };
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', up, true);
    ev.preventDefault();
  });
  function resetBoardPos() { boardPos = null; lsPut(K_POS, null); placeBoard(); toast('Board back in the corner'); }
  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Reset board position', resetBoardPos); } catch (e) {}
  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Hold everything, or resume', () => setHold(!held)); } catch (e) {}   // 8.0
  try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Pause or resume Switcheroo', () => { if (!isFloor()) takeFloor('touch'); runCommand({ kind: 'pauseToggle' }); }); } catch (e) {}   // 7.3
  window.addEventListener('resize', placeBoard);

  boardEl.addEventListener('click', (ev) => {
    ev.preventDefault(); ev.stopPropagation();
    if (ev.target.closest('.hz')) { dragMoved = false; setHold(!held); return; }   // 8.0
    if (ev.target.closest('.pz')) { dragMoved = false; if (!isFloor()) takeFloor('touch'); runCommand({ kind: 'pauseToggle' }); return; }   // 7.3
    if (ev.target.closest('.hd')) { if (dragMoved) { dragMoved = false; return; } toggleMin(); return; }
    const tile = ev.target.closest('.tile');
    if (!tile) return;
    const e = listTabs().find((x) => x.id === tile.dataset.id);
    if (e) handOff(e, 'switch');
  });

  function tileStatus(e) {
    if (!e.on) return 'off';
    if (e.state === 'red') return e.reqKey ? 'approve' : e.folder ? 'folder' : 'urgent';
    if (e.state === 'green') return 'working';
    if (e.state === 'yellow') {
      if (e.ask) return 'question';
      const m = Math.floor((Date.now() - e.since) / 60000);
      return m < 1 ? 'now' : m < 60 ? m + 'm' : Math.floor(m / 60) + 'h';
    }
    return 'idle';
  }
  let boardHtml = '';
  function paintBoard() {
    if (!composer()) { boardEl.style.display = 'none'; return; }
    if (!document.head.contains(sbCss)) document.head.appendChild(sbCss);
    if (!document.body.contains(boardEl)) document.body.appendChild(boardEl);
    const list = listTabs();
    let mode = '';
    if (held) mode = '⏸ on hold';
    else if (hardPause) mode = '⏸ paused';
    else if (pausedTurns()) mode = '⏸ ' + (quiet.turns > 0 ? quiet.turns : 'last');
    else if (quiet.quiet) mode = '🔕 quiet';
    else if (Date.now() < quiet.until) mode = '💤 ' + Math.ceil((quiet.until - Date.now()) / 60000) + 'm';
    const dots = list.map((e) => '<i class="dot ' + (e.on ? e.state : 'idle') + '" style="background:' + COLORS[e.on ? e.state : 'idle'] + '"></i>').join('');
    const tiles = list.map((e, i) => {
      const color = COLORS[e.on ? e.state : 'idle'];
      const cls = ['tile', e.on ? e.state : 'off', e.id === floorId ? 'floor' : '', e.id === ME ? 'here' : '',
        (e.state === 'yellow' && !e.seen) ? 'unseen' : ''].filter(Boolean).join(' ');
      const tip = e.title + (e.id === floorId ? ' (has the floor)' : '') + (e.armed ? '' : ' (needs one click before it can talk)');
      return '<button type="button" class="' + cls + '" data-id="' + esc(e.id) + '" title="' + esc(tip) + '">' +
        '<span class="dot" style="background:' + color + '"></span>' +
        '<span class="no">' + (i + 1) + '</span>' +
        '<span class="nm">' + (e.id === floorId ? '🎧 ' : '') + esc(e.title) + '</span>' +
        '<span class="st">' + tileStatus(e) + (e.armed ? '' : ' · click') + '</span></button>';
    }).join('');
    const foot = (approvalOpen() || voiceApproval()) ? '<div class="foot">' + (cfg.autoListen ? 'Say allow or deny · ' : 'Squeeze to allow once · ') + esc(approval.name) + '</div>' : '';
    const html = '<div class="hd" title="Drag to move. Click to shrink or grow (Option Shift B)"><b>Switcheroo</b><span class="dots">' + dots +
      '</span><span class="mode">' + mode + '</span>' +
      '<button type="button" class="hz' + (held ? ' on' : '') + '" title="' + (held ? 'Resume everything in every tab' : 'Hold: nothing reads, talks or opens the mic, in any tab, until you resume') + '">' + (held ? 'Resume' : 'Hold') + '</button>' +
      (held ? '' : '<button type="button" class="pz' + (quietNow() ? ' on' : '') + '" title="' + (quietNow() ? 'Chimes and alerts back on' : 'No chimes or alerts for your next two messages') + ' (Option Shift Q)">' +
      (quietNow() ? 'Resume' : 'Pause') + '</button>') + '</div><div class="tiles">' + tiles + '</div>' + foot;
    if (html !== boardHtml) { boardHtml = html; boardEl.innerHTML = html; }
    boardEl.className = boardMin() ? 'min' : '';
    boardEl.style.display = 'block';
    if (!dragging) boardPos = lsJson(K_POS, null);   // another tab may have moved it
    placeBoard();
  }

  // ---------- dictation hotkey ----------
  let noteMode = false; // true when a note interrupted Claude reading aloud
  let pausedEl = null;  // 4.1: the button that paused the reading; it toggles back to play
  let boxBefore = '';   // 7.5: what sat in the box when the mic opened (earlier notes)
  function endHardPause(why) {
    if (!hardPause) return false;
    hardPause = false;
    dlog('hard pause over', why);
    paintBoard();
    toast(resumeReading() ? 'Back on, resuming' : 'Back on');
    return true;
  }
  document.addEventListener('pointerdown', (e) => { if (hardPause && e.isTrusted) endHardPause('click'); }, true);

  // 4.1: Claude's paused button isn't always labeled Resume, so fall back to the button we paused with
  function resumeReading() {
    if (fb && fb.paused) { fbPlay(); return true; }   // 5.0: the Mac voice picks up where it stopped
    const r = last(buttons('resume'));
    if (r) { r.click(); pausedEl = null; return true; }
    if (pausedEl && pausedEl.isConnected && !/pause/.test(labelOf(pausedEl) + ' ' + textOf(pausedEl))) {
      pausedEl.click(); pausedEl = null; return true;
    }
    pausedEl = null;
    return false;
  }

  // 9.4.4: a reading is in the air: Switcheroo's own voice (playing or paused), Claude's read aloud,
  // or one a squeeze left paused. While one is, "stop" / "shut up" drops it instead of becoming text.
  const readingAloud = () => !!fb || buttons('pause').length > 0 || buttons('resume').length > 0 ||
    (!!pausedEl && pausedEl.isConnected);

  // 8.5: drop the reading that a squeeze just paused, for good: nothing resumes it
  function abortReading(why) {
    dlog('reading aborted', why || '');
    try { fbStop(); } catch (e) {}
    pausedEl = null;
    noteMode = false;
    try { hush(); } catch (e) {}
    toast('Stopped reading');
    if (cfg.autoListen) setTimeout(() => { try { openTurnMic('after abort'); } catch (e) {} }, 400);
  }

  function toggleDictation() {
    try { dlog('squeeze', 'stop=' + buttons('stop').length + ' fb=' + fbActive() + ' pause=' + buttons('pause').length); } catch (x) {}
    if (!ownsFloor() && !buttons('stop').length) { dlog('squeeze ignored, not the floor'); return; }   // 6.0
    if (earOpen()) { earStop(); toast('Stopped listening'); return; }   // 8.1: a squeeze while listening stops it
    const askedLately = !!approval && Date.now() - (approval.askedAt || 0) < 120000;   // 8.1: asked in the last two minutes
    if (approval && approval.comp && voiceApproval() && askedLately) { earAnswer(); return; }   // never a squeeze alone for the computer
    if (approvalOpen()) { approveNow(); return; }                     // the squeeze that allows once
    if (voiceApproval() && askedLately && !buttons('stop').length && cfg.autoListen) { earAnswer(); return; }   // 8.1: the answer, heard here
    if (announcingRed) { toast('Hold on, reading the request'); return; } // never approve before you hear it
    const fbWas = fbActive();                                           // 5.0: backup voice reading
    if (fbWas) fbPause();                                              // 5.1: pause ElevenLabs or the Mac voice
    if (speaking) hush();                                              // a squeeze talks over the board
    const stop = last(buttons('stop'));
    if (stop) { finishDictation(); return; }
    if (hardPause) { endHardPause('squeeze'); return; }                 // 7.5: a squeeze also ends a pause
    if (agActive()) {                       // agenda player owns the squeeze while a take is loaded
      if (agPlaying()) { agStartNote(); return; }
      agPlay(); return;
    }
    // a reading left paused after a note: this squeeze picks it back up
    if (!noteMode && pausedEl && pausedEl.isConnected && !buttons('pause').length && resumeReading()) { toast('Resuming'); return; }
    const pause = last(buttons('pause'));
    if (pause) { pausedEl = pause; pause.click(); noteMode = true; toast('Note'); }
    else if (fbWas) { noteMode = true; toast('Note'); }
    const mic = last(buttons('mic'));
    if (!mic) return toast('Mic not found. Press Option Shift 1, then click the mic.');
    duckSoon();
    boxBefore = composerText();
    dlog('mic open');
    armListener();   // 8.7.1
    mic.click();
    cueWhenLive();
  }

  async function finishDictation() {
    const byOver = overFlag;
    overFlag = false;
    dlog('finish', (byOver ? 'by over' : 'by squeeze or pause') + ' note=' + noteMode + ' text=' + composerText());
    const stop = last(buttons('stop'));
    if (stop) { markFinishClick(); stop.click(); }
    if (ag.noteOpen) {
      if (byOver) { await sleep(900); await stripOver(); }
      await agFinishNote(); return;
    }
    if (noteMode) {
      noteMode = false;
      await sleep(1200); // let the note land in the box
      if (byOver) await stripOver();
      // 7.5: what you just said, apart from earlier notes. "pause" holds everything; a command runs
      const before = boxBefore.trim(), now = composerText().trim();
      const said = now.startsWith(before) ? now.slice(before.length).trim() : '';
      const flatten = (x) => String(x || '').toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim();
      const saidFlat = flatten(said);
      // 9.4.4: dictation sometimes rewrites the whole box, so the diff comes back empty. Then the last
      // line counts, so "stop" still drops the reading instead of sitting there as a note.
      const abortFlat = saidFlat || flatten((now.split('\n').pop() || '').trim());
      if (abortFlat && ABORT_SAID.test(abortFlat)) {   // 8.5: drop this reading, keep earlier notes
        await trimTail(boxBefore);
        abortReading('said ' + abortFlat);
        return;
      }
      if (said && HOLD_SAID.test(said.toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim())) {   // 8.0
        await trimTail(boxBefore);
        setHold(true);
        return;
      }
      if (said && NOTE_PAUSE.test(said.toLowerCase())) {
        await trimTail(boxBefore);
        hardPause = true; hush();
        dlog('hard pause', said);
        paintBoard();
        toast('Paused. Click in this tab, or squeeze, to pick back up.');
        return;
      }
      const nc = said && parseCommand(said);
      if (nc && !isTail(nc) && LEAVES.includes(nc.kind)) {   // 7.6: moving on sends the notes, then goes
        dlog('notes out, then ' + nc.kind, said);
        fbStop();
        await sendOrCommand(byOver);
        return;
      }
      if (nc && !isTail(nc)) {
        await trimTail(boxBefore);
        dlog('command in a note', said + ' => ' + nc.kind);
        if (['read', 'more', 'readAll', 'wake'].includes(nc.kind)) { if (!resumeReading()) await runCommand(nc); }
        else await runCommand(nc);
        return;
      }
      toast(resumeReading() ? 'Note saved, resuming' : 'Note saved. Squeeze to pick the reading back up.');
    } else {
      await sendOrCommand(byOver);
    }
  }

  // 7.6: next, take me to and new chat send your notes first, then go; everything else keeps them in the box
  const LEAVES = ['next', 'switch', 'newChat'];
  // 8.5: said right after a squeeze that paused a reading: drop that reading for good
  // 9.4.4: more than one filler in front, the words said twice, and a "claude" on the end all count
  const ABORT_CORE = "abort|abort it|abort that|abort reading|stop|stop it|stop that|stop reading|stop talking|stop please|please stop|shut up|shut it|shut it down|cancel|cancel it|cancel that|skip|skip it|skip that|skip this|enough|that's enough|thats enough|okay enough|never mind|nevermind|forget it|kill it|drop it|be quiet|quiet|irrelevant|not relevant|no longer relevant";
  const ABORT_SAID = new RegExp("^(?:(?:uh+|um+|uhm|okay|ok|no|nah|hey|claude|please)\\s+)*(?:" + ABORT_CORE + ")(?:[,\\s]+(?:" + ABORT_CORE + "))*(?:\\s+(?:please|now|thanks|thank you|claude))?$");
  const NOTE_PAUSE = /^(?:uh |um |okay |ok )?(?:pause|pause it|pause that|pause everything|pause all|pause all of it|pause please|pause for now|hold|hold on|hold it|hold everything|stop|stop everything|stop please|wait|wait please|paws|pose|pas|pods|pots|cause|pauls)[\s.,!?]*$/;
  // a dictated message is either a switchboard command or a message (maybe ending in "next")
  const isTail = (c) => !!c && (c.kind === 'sendNext' || c.kind === 'sendNew' || c.kind === 'sendGo');
  async function sendOrCommand(byOver) {
    let prev = null, stableAt = 0, text = '';
    for (let i = 0; i < 60; i++) {
      await sleep(150);
      text = composerText();
      const send = last(buttons('send'));
      if (text !== prev) { prev = text; stableAt = Date.now(); continue; }
      const cmd = text && parseCommand(text);
      if (text && Date.now() - stableAt >= 450 && ((send && !send.disabled) || (cmd && !isTail(cmd)))) break;
    }
    if (byOver && text) { await stripOver(); text = composerText(); }   // 4.2: drop the word over
    if (!text) { dlog('nothing to send'); toast('Nothing to send'); return; }
    if (/^\s*over(?: and out)?[\s.,;:!?]*$/i.test(text)) { dlog('dropped a lone over', text); clearComposer(); return; }   // 6.9
    // 7.5: notes already waiting in the box: a command said after them runs, and the notes stay put
    const before = boxBefore.trim();
    let lead = null;
    if (before && text.trim().startsWith(before) && text.trim().length > before.length) {
      const said = text.trim().slice(before.length).trim(), tc = parseCommand(said);
      if (tc && !isTail(tc) && !LEAVES.includes(tc.kind)) { dlog('command after notes', said + ' => ' + tc.kind); await trimTail(boxBefore); await runCommand(tc); return; }
      // 7.6: next, take me to or new chat after notes: the notes go out first, then it moves
      if (tc && tc.kind === 'next') lead = { kind: 'sendNext', keep: before };
      if (tc && tc.kind === 'switch') lead = { kind: 'sendGo', keep: before, name: tc.name };
      if (tc && tc.kind === 'newChat') lead = { kind: 'sendNew', keep: before, project: tc.project };
    }
    const cmd = lead || parseCommand(text);
    dlog('heard', text + ' => ' + (cmd ? cmd.kind : 'message'));
    if (cmd && !isTail(cmd)) { clearComposer(); await runCommand(cmd); return; }
    // 3.9: a number, a choice's name or skip answers a question card on screen
    // 8.1: only after the command check above, and never a pause or an over
    if (!NOTE_PAUSE.test(text.toLowerCase().trim()) && answerAsk(cmd ? cmd.keep : text)) {
      clearComposer();
      if (cmd && cmd.kind === 'sendNext') { await sleep(800); jumpNext(false); }
      if (cmd && cmd.kind === 'sendNew') await newChat(cmd.project, true);
      if (cmd && cmd.kind === 'sendGo') { await sleep(500); await switchByName(cmd.name, true); }
      return;
    }
    if (cmd) await trimTail(cmd.keep);
    await sendWhenReady();
    if (cmd && cmd.kind === 'sendNext') { await sleep(500); jumpNext(false); }
    if (cmd && cmd.kind === 'sendNew') await newChat(cmd.project, true);
    if (cmd && cmd.kind === 'sendGo') { await sleep(500); await switchByName(cmd.name, true); }
  }

  // ---------- "over" ends it now (4.2) ----------
  // "over" as its own word right after a beat, like "Looks good. Over." Dictation puts a period or
  // comma where you paused, which keeps "go over the plans" from counting.
  const OVER_END = /(^|[.!?,;:])\s*over(?: and out)?[\s.!?,;:]*$/i;
  // 4.6: the live transcript has no punctuation yet, so "over" as the last word counts too,
  // unless it's part of a phrase like "go over" or "start over"
  const OVER_PHRASE = /\b(go|goes|going|went|look|looking|looked|hand|handed|turn|turned|think|start|started|move|moved|come|came|all|pull|pulled|take|took|run|ran|left|get|got|hang|roll|flip|tip|push|fall|fell|carry|spill|sleep|stay|boil|brush|gloss|mull|cross|read|check|talk|pass|switch|change|win|bend|lean|climb|jump|step|hop|swing|walk|drive|fly|send|bring|and|is|was|it's|its|game|all's)\s+over[\s.!?,;:]*$/i;
  const endsWithOver = (x) => /\bover(?: and out)?[\s.!?,;:]*$/i.test(x) && (OVER_END.test(x) || !OVER_PHRASE.test(x));
  let overFlag = false;
  // the words so far, from the message box or the live transcript next to the finish button
  function liveLines() {
    const lines = [composerText()];
    let el = last(buttons('stop'));
    for (let i = 0; i < 6 && el && el.parentElement && el !== document.body; i++) {
      el = el.parentElement;
      (el.innerText || '').split('\n').forEach((x) => { x = x.trim(); if (x) lines.push(x); });
      if (el.matches && el.matches('fieldset, form')) break;
    }
    return lines;
  }
  async function stripOver() {
    const t = composerText();
    const m = t.match(/^([\s\S]*?)[\s.,;:!?]*\bover(?: and out)?[\s.!?,;:]*$/i);
    if (!m) return;
    const keep = m[1].trim();
    if (keep) await trimTail(keep); else clearComposer();
    await sleep(60);
  }

  // ---------- auto send on pause ----------
  // Listens to the mic level only while Claude's own dictation is running.
  let watching = false;
  let micLiveAt = 0;   // when the mic first delivered real sound (3.5)
  let autoStarted = false; // mic opened by your turn mode

  // 8.7.1: one listener per dictation. Claude's finish button stays on screen for a beat after it's
  // clicked, and a fresh listener used to start on that leftover button, taking the mic again the
  // moment Claude let it go, every single time. Now a listener starts only when the button first
  // appears, and never on a button that shows up again right after a finish click.
  var stopShown = false, finishClickAt = 0;   // var: earlier code can mark a finish click before this line runs
  function markFinishClick() { finishClickAt = Date.now(); }
  function armListener() { finishClickAt = 0; stopShown = false; }   // the mic is being opened on purpose: listen to it
  // Claude can swap the button's label without the page observer seeing it, so check for the button going away too
  setInterval(() => { if (stopShown && !watching && !buttons('stop').length) stopShown = false; }, 700);
  function maybeWatch() {
    const on = buttons('stop').length > 0;
    const rose = on && !stopShown;
    stopShown = on;
    if (!rose || tabOff) return;
    if (Date.now() - finishClickAt < 1500) { dlog('leftover finish button, not listening'); return; }
    watchForPause();
  }

  async function watchForPause() {
    if (watching || !cfg.autoSend) return;
    watching = true;
    dlog('listening for pause');
    let stream, ctx;
    let finishAfter = false;   // 4.7: let go of the mic first, then send or save
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: false, autoGainControl: false } });
      ctx = new AudioContext();
      // 6.4: a tab nobody has clicked gets a sleeping audio context, so it can't hear levels.
      // Then it goes by the words landing in the box instead.
      if (ctx.state !== 'running') { try { await Promise.race([ctx.resume(), sleep(300)]); } catch (e) {} }
      const deaf = ctx.state !== 'running';
      if (deaf) dlog('going by words, no mic level yet');
      const text0 = composerText();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      const buf = new Float32Array(an.fftSize);
      const level = () => {
        an.getFloatTimeDomainData(buf);
        let s = 0; for (const v of buf) s += v * v;
        return Math.sqrt(s / buf.length);
      };
      // 3.5: AirPods deliver pure silence while they switch to headset mode; wait for real sound
      for (let i = 0; i < 50 && !deaf && level() < 2e-5 && composerText() === text0 && buttons('stop').length; i++) await sleep(100);   // 8.7.1: let go if dictation already ended
      micLiveAt = Date.now();

      // learn the room's noise floor for a moment
      let floor = 0;
      for (let i = 0; i < 6; i++) { await sleep(50); floor = Math.max(floor, level()); }
      const talkLevel = Math.max(floor * 2.5, 0.015);

      let spoke = false;
      const started = Date.now();
      let lastSound = Date.now();
      let lastText = text0;   // 6.4: words that landed while the AirPods woke up count as talking
      let overLine = '', overSince = 0;

      while (buttons('stop').length) {
        await sleep(100);
        const now = Date.now();
        if (level() > talkLevel) { spoke = true; lastSound = now; }
        const t = composerText();
        if (t !== lastText) { const landed = !!t.trim(); lastText = t; if (landed) { lastSound = now; spoke = true; } }   // 8.7.1: the box emptying after a send isn't you talking
        if (!cfg.autoSend) break;
        // 4.2: "over" said and held for a moment ends it now
        const ol = spoke ? liveLines().find(endsWithOver) || '' : '';
        if (ol !== overLine) { overLine = ol; overSince = now; }
        else if (ol && now - overSince >= 900) { overFlag = true; finishAfter = true; break; }
        if (autoStarted && !spoke && now - started > 8000) { // your turn, but you stayed quiet
          const cancel = last(buttons('cancel'));
          if (cancel) { markFinishClick(); cancel.click(); }
          toast('Mic closed');
          break;
        }
        if (spoke && now - lastSound > PAUSE_MS) { finishAfter = true; break; }
      }
    } catch (e) {
      toast('Auto send could not hear the mic');
    } finally {
      autoStarted = false;
      syncDuck();
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (ctx) ctx.close();
      watching = false;
    }
    // the script's own listening is closed before the message goes out, so the mic is only open
    // while you're actually talking and a squeeze right after works again
    if (finishAfter && !ownsFloor()) { dropStaleDictation('pause heard in a tab without the floor'); return; }
    if (finishAfter) await finishDictation();
  }

  async function sendWhenReady() {
    // wait for the transcript to land in the box, then press Send
    for (let i = 0; i < 50; i++) {
      await sleep(150);
      const send = last(buttons('send'));
      if (send && !send.disabled && composerText().length > 0) {
        dlog('script sends', composerText());
        send.click();
        toast('Sent');
        return;
      }
    }
    toast('Nothing to send');
  }

  // ---------- auto read aloud ----------
  // Claude keeps a single Read aloud button and moves it to the newest reply,
  // so track which REPLY was last read, not which button.
  function replyKey(btn) {
    // the start of the reply text (the timestamp at the end changes, so skip it)
    const msg = btn.closest('[data-testid="assistant-message"]');
    if (!msg) return '';
    return msg.innerText.trim().slice(0, 300);
  }
  let lastKey = null;
  const readEls = new WeakSet();   // 5.6: each reply is auto read once, by element
  const readHeads = [];            // 5.7: ...and by what it says, in case Claude swaps the element
  const headOf = (m) => { try { return replyParts(m, 100000, 100000).join(' ').replace(/\s+/g, ' ').trim().slice(0, 160); } catch (e) { return ''; } };
  // 9.5.1: heard is shared by every tab for half an hour, so a reply one tab read isn't read again by another,
  // or by this one when you land back on it (that was the double readback)
  const K_HEARD = 'chf_heard_v1', HEARD_MS = 30 * 60000;
  const heardShared = () => { const a = lsJson(K_HEARD, []); return Array.isArray(a) ? a.filter((x) => x && Date.now() - (x.t || 0) < HEARD_MS) : []; };
  const heardBefore = (h) => !!h && (readHeads.includes(h) || heardShared().some((x) => x.h === h));
  const heardRead = (h) => !!h && heardShared().some((x) => x.h === h);   // read aloud somewhere, not just on screen at load
  const markHeard = (h, localOnly) => {   // localOnly: seen here, not read aloud, so other tabs may still read it
    if (!h) return;
    if (!readHeads.includes(h)) { readHeads.push(h); if (readHeads.length > 40) readHeads.shift(); }
    if (localOnly) return;
    const a = heardShared().filter((x) => x.h !== h); a.push({ h, t: Date.now() });
    lsPut(K_HEARD, a.slice(-60));
  };
  const claudeIsReading = () => buttons('pause').length > 0 || buttons('resume').length > 0;
  const markAll = () => {
    const b = last(buttons('speak')); lastKey = b ? replyKey(b) : '';
    dlog('page (re)loaded, current reply marked as heard');
    const lm = last([...document.querySelectorAll('[data-testid="assistant-message"]')]);
    if (lm) { readEls.add(lm); markHeard(headOf(lm), true); }   // 5.6: the reply already on screen is never auto read
    // a take already on screen at load is remembered, not loaded
    const msgs = document.querySelectorAll('[data-testid="assistant-message"]');
    const m = msgs[msgs.length - 1];
    if (m) { const t = parseTake(m); if (t) ag.loadedKey = t.url; }
  };
  setTimeout(markAll, 1500); // ignore the reply already on screen at load

  // a new reply with an agenda take loads the player instead of being read aloud
  function checkForTake() {
    const msgs = document.querySelectorAll('[data-testid="assistant-message"]');
    const m = msgs[msgs.length - 1];
    if (!m) return false;
    const t = parseTake(m);
    if (!t) return false;
    if (t.url !== ag.loadedKey) {
      ag.loadedKey = t.url;
      loadTake(t);
    }
    return true;
  }

  let timer = null;
  let wasReading = false;
  let lastUrl = location.href;
  const observer = new MutationObserver((muts) => {
    if (muts.every((m) => ours(m.target) || m.target === boardEl)) return; // our own repaints
    scheduleCompute();                             // traffic light, even when hands free is off here
    maybeWatch();                                  // 8.7.1: dictation just started, by hotkey or by click (once per start)
    if (tabOff) return;
    syncDuck();

    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(markAll, 1500);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(maybeAutoRead, 1200);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // a finished reply that hasn't been read yet gets read, once
  function maybeAutoRead() {
    if (tabOff) return;
    if (buttons('stop').length) return;          // you're dictating, stay quiet
    const speak = last(buttons('speak'));
    const isTake = lastKey !== null && checkForTake();
    if (isTake) { if (speak) lastKey = replyKey(speak); return; } // never read a take message aloud
    if (!cfg.autoRead) return;
    if (!speak || lastKey === null) return;
    if (isWorking()) return;                     // 5.6: wait until Claude has fully finished
    const key = replyKey(speak);
    if (key && key !== lastKey) {
      lastKey = key;
      const msg = speak.closest('[data-testid="assistant-message"]');
      if (!msg) { dlog('new reply, no message box'); return; }
      if (readEls.has(msg)) { dlog('new reply text, same box, skip'); return; }      // 5.6: this reply already had its turn
      readEls.add(msg);
      const head = headOf(msg);
      if (heardBefore(head)) { dlog('reply already heard, skip', head.slice(0, 50)); return; }             // 5.7: same words in a fresh element
      markHeard(head, true);   // 9.5.1: shared only once it's actually read, below
      if (held) { dlog('new reply, on hold, not read', head.slice(0, 50)); return; }   // 8.0
      if (!ownsFloor()) dlog('new reply, not the floor, chime only', head.slice(0, 50));
      if (ownsFloor()) {                           // other tabs chime on the switchboard instead
        dlog('auto read', (msg.innerText || '').trim().slice(18, 70));
        markHeard(head);   // 9.5.1: now every tab knows it was read
        if (elReady()) { if (!(fb && fb.ra)) fbStop(); readReply(msg, 'el', false, true); }   // 5.1: ElevenLabs reads it (8.7: after read along)
        else if (!claudeIsReading()) { dlog('ElevenLabs not ready, Claude read aloud'); fbStop(); speak.click(); watchPlayback(speak); }   // 5.6: never toggle
        else dlog('Claude already reading, skip');
      }
    }
  }
  // 5.2: the page never sits still when other chats are busy (the sidebar keeps changing), so
  // the quiet moment the reader used to wait for may never come. Check on a steady beat too:
  // Claude has stopped, and the newest reply has held still for over a second.
  let beatKey = null, beatSince = 0;
  setInterval(() => {
    if (tabOff || lastKey === null || !cfg.autoRead) return;
    if (isWorking() || buttons('stop').length) { beatSince = 0; return; }
    const speak = last(buttons('speak'));
    const key = speak ? replyKey(speak) : '';
    if (!key || key === lastKey) { beatKey = key; beatSince = 0; return; }
    if (key !== beatKey || !beatSince) { beatKey = key; beatSince = Date.now(); return; }
    if (Date.now() - beatSince >= 1200) maybeAutoRead();
  }, 400);

  // your turn mode: check a few times a second whether Claude just finished reading.
  // (Polling, because Claude sometimes flips Pause back to Read aloud without a DOM swap.)
  setInterval(() => {
    if (tabOff || !isFloor()) { wasReading = false; return; }
    const claudeReading = buttons('pause').length > 0 || buttons('resume').length > 0;
    if (claudeReading && fbActive()) fbStop();   // Claude's own read aloud started after all
    const readingNow = claudeReading || fbActive() || (!!fb && noteMode);
    if (wasReading && !readingNow && cfg.autoListen && !noteMode && !agActive() && !buttons('stop').length && !isWorking()) yourTurn();   // 8.7: not while Claude still works
    wasReading = readingNow;
  }, 300);

  // 3.4: when a reading ends, the Switchboard gets its say first, then the mic opens,
  // so you know whether to say next before you start talking
  let turnPending = false;
  async function yourTurn() {
    if (turnPending) return;
    turnPending = true;
    try {
      const readingNow = () => buttons('pause').length > 0 || buttons('resume').length > 0 || fbActive();   // 6.3: ElevenLabs too
      await sleep(600);
      if (held || hardPause || buttons('stop').length || readingNow() || !isFloor() || tabOff) return;
      await checkAsk(true);    // a question card is read before anything else
      if (quiet.turnsDone && !(quiet.turns > 0)) {   // 7.2: the paused turns are over
        setQuiet({ quiet: false, until: 0 });
        const waiting = waitingList().length;
        if (waiting) await say('Switcheroo is back. ' + (waiting === 1 ? 'One chat is waiting.' : waiting + ' chats are waiting.'));
      }
      await tickAnnouncer(true);   // anything due is announced now, not over your mic
      for (let i = 0; i < 200 && (speaking > 0 || alerting || announcingRed); i++) await sleep(150);   // 6.8: no squeeze wait
      await sleep(250);
      if (buttons('stop').length || readingNow() || agActive() || !isFloor() || tabOff || !cfg.autoListen || earBusy()) return;
      openTurnMic('reading done');
    } finally { turnPending = false; }
  }

  // ---------- the mic comes on by itself (6.4) ----------
  // Every automatic mic open goes through here, so two triggers at once can't click it twice.
  let autoMicAt = 0;
  function openTurnMic(why) {
    if (held || !cfg.autoListen || tabOff || !isFloor() || !ownsFloor()) return false;
    if (earBusy()) return false;   // 8.1: the ears are waiting for an answer
    if (buttons('stop').length || Date.now() - autoMicAt < 2500) return false;
    const mic = last(buttons('mic'));
    if (!mic) { dlog('mic not found', why); return false; }
    autoMicAt = Date.now();
    dlog('mic opened by itself', why);
    autoStarted = true; duckSoon(); boxBefore = composerText(); armListener(); mic.click(); toast('Your turn'); cueWhenLive();
    return true;
  }
  const claudeReadingNow = () => buttons('pause').length > 0 || buttons('resume').length > 0;
  // waits until nothing is talking; false if a reading started (your turn mode takes it from there)
  async function quietThenMic(why, gen) {
    for (let i = 0; i < 260; i++) {
      if (gen !== undefined && gen !== afterGen) return false;   // a newer line took over
      if (buttons('stop').length || tabOff || !isFloor() || !cfg.autoListen) return false;
      if (turnPending || askReading || fbActive() || claudeReadingNow() || agActive() || noteMode) return false;
      const waiting = speaking > 0 || alerting || announcingRed || !!pending || earOpen() ||
        Date.now() - readKickAt < 4000;   // arriving in a chat: its reply is about to be read
      if (!waiting) break;
      await sleep(150);
    }
    await sleep(200);
    if (gen !== undefined && gen !== afterGen) return false;
    if (speaking > 0 || alerting || announcingRed || fbActive() || claudeReadingNow()) return false;
    return openTurnMic(why);
  }
  // a Switchboard line just finished: open the mic once nothing else is about to talk
  let afterGen = 0;
  async function micAfterLine() {
    if (held || !cfg.autoListen || tabOff || !isFloor()) return;
    const gen = ++afterGen;
    await sleep(900);   // a reading that follows a line has started by now
    return quietThenMic('after a line', gen);
  }
  // opening Claude, or landing on a new chat: the tab you're looking at gets the mic
  let micOnTouch = false;
  const looking = () => document.visibilityState === 'visible' && document.hasFocus();
  function newChatPage() {
    const p = location.pathname;
    return (/^\/(new\/?)?$/.test(p) || /^\/project\/[^/]+\/?$/.test(p)) && !!composer() && !replies().length;
  }
  async function micOnArrive(why) {
    if (held || !cfg.autoListen || tabOff) return;
    for (let i = 0; i < 40 && !composer(); i++) await sleep(250);   // the page is still drawing
    await sleep(why === 'load' ? 2800 : why === 'focus' ? 400 : 800);   // let the board settle and the floor be sorted
    if (!cfg.autoListen || tabOff || !composer() || buttons('stop').length) return;
    if (why === 'new chat' && !newChatPage()) return;
    if (!isFloor()) {
      if (!looking()) {
        // Chrome opened behind another app: the mic waits until you bring this tab up
        if (why === 'load') window.addEventListener('focus', () => { if (Date.now() - STARTED < 60000) micOnArrive('focus'); }, { once: true });
        return;
      }
      const rec = lsJson(K_FLOOR, null);
      const alive = !!(rec && rec.id && rec.id !== ME && listTabs().some((e) => e.id === rec.id && e.on));
      if (alive && !newChatPage()) return;   // reopening an old chat doesn't pull the floor away
      takeFloor('load');
    }
    const opened = await quietThenMic(why);
    if (!opened && !isFloor()) return;
    // a tab nobody has clicked may not be allowed the mic on a cold start; the first click opens it
    for (let i = 0; i < 30 && !buttons('stop').length; i++) await sleep(100);
    if (!buttons('stop').length && !armedHere()) { micOnTouch = true; dlog('mic waits for a first click'); }
  }
  let pathSeen = location.pathname;
  setInterval(() => {
    if (location.pathname === pathSeen) return;
    pathSeen = location.pathname;
    if (/^\/(new\/?)?$/.test(pathSeen) || /^\/project\/[^/]+\/?$/.test(pathSeen)) micOnArrive('new chat');
  }, 400);

  // ---------- warm mic (2.9) ----------
  // Opening the mic flips AirPods from listening mode to headset mode, which eats the first
  // couple of seconds. While your turn mode is on, the floor tab holds the mic open so they
  // stay in headset mode. Nothing is recorded or sent; the stream is only held.
  let warmStream = null, warming = false;
  // 3.5: opt in. While any mic is open, macOS treats an AirPods squeeze as mute, not play/pause.
  // 4.0: retired. Any mic held open makes macOS treat an AirPods squeeze as mute, so this
  // always answers no and the next tick lets go of anything an older version was holding.
  const wantWarm = () => false;
  if ('warmMic' in cfg) { delete cfg.warmMic; save(cfg); }
  async function holdMic() {
    if (warmStream || warming) return;
    warming = true;
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!wantWarm()) { st.getTracks().forEach((t) => t.stop()); return; }
      warmStream = st;
      st.getTracks().forEach((t) => t.addEventListener('ended', () => { if (warmStream === st) warmStream = null; }));
    } catch (e) {
    } finally { warming = false; }
  }
  function dropMic() {
    if (!warmStream) return;
    try { warmStream.getTracks().forEach((t) => t.stop()); } catch (e) {}
    warmStream = null;
  }
  function syncWarm() { if (wantWarm()) holdMic(); else dropMic(); }

  // ---------- quiet other tabs while you talk (3.0) ----------
  const hasGM = typeof GM_setValue === 'function';
  let ducked = false, duckAt = 0, duckHold = 0, duckLevel = 0, readHold = 0, duckSent = '', duckKind = '';
  // 8.3: videos pause rather than turn down, unless you choose turn down
  const duckMode = () => (cfg.duckMode === 'lower' ? 'lower' : 'pause');
  // level is a share of each tab's own volume: 0 while you talk, a little while Claude reads
  const READ_LEVELS = [0.05, 0.1, 0.15, 0.25, 0.35, 0.5];
  const readLevel = () => (READ_LEVELS.includes(cfg.duckReadLevel) ? cfg.duckReadLevel : 0.25);
  function duckPost(on, lvl, kind) {
    ducked = on; duckLevel = on ? (lvl || 0) : 0; duckAt = Date.now(); duckSent = duckMode(); duckKind = on ? (kind || 'talk') : '';
    try { if (hasGM) GM_setValue('chf_duck', { on, ts: duckAt, level: duckLevel, mode: duckSent, kind: duckKind }); } catch (e) {}
  }
  // turn the other tabs down just before the mic opens, so nothing leaks into the first words
  function duckSoon() {
    if (!hasGM || cfg.duck === false || tabOff || !isFloor()) return;
    duckHold = Date.now() + 3000;
    if (!ducked || duckLevel !== 0 || duckKind !== 'talk') duckPost(true, 0, 'talk');
  }
  function syncDuck() {
    if (!hasGM) return;
    const talking = buttons('stop').length > 0 || ag.noteOpen || Date.now() < duckHold;
    const reading = !held && cfg.duckReading !== false && (speaking > 0 || fbActive() || Date.now() < readHold || buttons('pause').length > 0 || agPlaying());
    const want = cfg.duck !== false && isFloor() && !tabOff && (talking || reading);
    const lvl = talking ? 0 : readLevel();
    // 8.4: a conversation pauses videos; a short Switcheroo line or chime only turns them down
    let conversing = false;
    try { conversing = fbActive() || buttons('pause').length > 0 || agPlaying() || askReading || announcingRed || earBusy() || DK.on; } catch (e) {}
    const kind = talking ? 'talk' : conversing ? 'read' : 'line';
    if (want !== ducked || (want && lvl !== duckLevel) || (want && duckSent !== duckMode()) || (want && kind !== duckKind)) duckPost(want, lvl, kind);
    else if (want && Date.now() - duckAt > 5000) duckPost(true, lvl, kind);   // keep it fresh
  }
  function setDuckMode(m, spoken) {   // 8.3
    cfg.duckMode = m; save(cfg);
    if (ducked) duckPost(true, duckLevel, duckKind); else syncDuck();
    const msg = m === 'pause' ? 'Videos pause while we talk, and play on when it goes quiet.' : 'Videos turn down while we talk instead of pausing.';
    if (spoken) return say(msg);
    toast(msg);
  }
  function stepRead(dir, spoken) {
    const i = READ_LEVELS.indexOf(readLevel());
    const j = Math.max(0, Math.min(READ_LEVELS.length - 1, i + dir));
    cfg.duckReadLevel = READ_LEVELS[j]; save(cfg); syncDuck();
    const msg = 'Other tabs at ' + Math.round(cfg.duckReadLevel * 100) + ' percent while Claude reads';
    if (spoken) return say(msg + (j === i ? ', and that is as far as it goes.' : '.'));
    toast(msg);
  }
  // 8.4: the video tabs that report in, fresh within the last half minute
  const mediaTabs = new Map();
  try { if (typeof GM_addValueChangeListener === 'function') GM_addValueChangeListener('chf_media_beat', (n, o, b) => { if (b && b.id) mediaTabs.set(b.id, b); }); } catch (e) {}
  function liveMediaTabs() {
    const now = Date.now();
    for (const [id, b] of mediaTabs) if (now - (b.ts || 0) > 30000) mediaTabs.delete(id);
    return [...mediaTabs.values()];
  }
  const siteName = (h) => /(^|\.)youtube\.com$/.test(h) ? (/^tv\./.test(h) ? 'YouTube TV' : 'YouTube') : /(^|\.)espn\.com$/.test(h) ? 'ESPN' : String(h || 'a site').replace(/\.(com|net|org|tv|co|com\.au|io)$/, '');
  function mediaWord(b) {
    if (b.rule === 'ignore') return 'is left alone';
    if (b.rule === 'mute') return 'mutes the whole tab while we talk';
    if (b.rule === 'lower' || (b.rule === 'auto' && (b.live || duckMode() === 'lower'))) return b.live ? 'is live, so it turns down' : 'turns down';
    return 'pauses while we talk';
  }
  function videoCheck() {
    if (cfg.duck === false) return say('Quiet other tabs is off, so videos are left alone. Say quiet other tabs on, or flip it on HQ.');
    const list = liveMediaTabs();
    if (!list.length) return say("I don't hear from any video tabs. Play something for a few seconds and ask again. Still nothing means Tampermonkey isn't running on that site: click its icon on that page and allow it on all sites.");
    const seen = new Set(), bits = [];
    for (const b of list) { const k = b.site + '|' + mediaWord(b); if (seen.has(k)) continue; seen.add(k); bits.push(siteName(b.site) + ' ' + mediaWord(b)); }
    return say(bits.slice(0, 4).join('. ') + '.');
  }
  // another tab started playing and may have taken the AirPods squeeze; take it back
  let reclaimedAt = 0;
  function reclaimKeys() {
    if (hqHasKeys() || !silent || tabOff || !isFloor() || Date.now() - reclaimedAt < 2000) return;
    reclaimedAt = Date.now();
    try { silent.pause(); silent.play().catch(() => {}); navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
  }
  try {
    if (typeof GM_addValueChangeListener === 'function') {
      GM_addValueChangeListener('chf_media', (n, o, v, remote) => { if (remote) setTimeout(reclaimKeys, 400); });
    }
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Quiet other tabs on or off', () => {
        cfg.duck = cfg.duck === false; save(cfg); syncDuck();
        toast('Quiet other tabs ' + (cfg.duck ? 'on' : 'off'));
      });
      GM_registerMenuCommand('Quiet them while Claude reads too, on or off', () => {
        cfg.duckReading = cfg.duckReading === false; save(cfg); syncDuck();
        toast('Other tabs quiet while Claude reads: ' + (cfg.duckReading ? 'on' : 'off'));
      });
      GM_registerMenuCommand('Videos: pause or turn down', () => setDuckMode(duckMode() === 'pause' ? 'lower' : 'pause', false));
      GM_registerMenuCommand('Video check: which tabs are connected', () => { if (!isFloor()) takeFloor('touch'); videoCheck(); });
      GM_registerMenuCommand('Other tabs quieter while Claude reads', () => stepRead(-1, false));
      GM_registerMenuCommand('Other tabs louder while Claude reads', () => stepRead(1, false));
    }
  } catch (e) {}

  function toggleAutoListen() {
    cfg.autoListen = !cfg.autoListen;
    if (cfg.autoListen) delete cfg.listenOff;
    save(cfg);
    syncWarm();
    toast('Your turn mode ' + (cfg.autoListen ? 'on' : 'off'));
    if (typeof paintPill === 'function') paintPill();
  }

  // ---------- AirPods squeeze (media play/pause) ----------
  // Chrome sends headphone play/pause presses to the tab that is playing media.
  // A silent loop keeps the floor tab as that tab. Only the floor tab plays it.
  let silent = null;
  // 3.8: a 30 Hz hum about 55 dB below full scale, far too low to hear. Pure silence let Chrome
  // treat the floor tab as idle once you selected another tab, slow its timers and drop squeezes.
  // A tab that is playing sound stays awake. 6 seconds holds exactly 180 cycles, so the loop is seamless.
  function silentWav() {
    const sr = 8000, n = sr * 6, b = new Uint8Array(44 + n * 2), v = new DataView(b.buffer);
    const w = (o, str) => { for (let i = 0; i < str.length; i++) b[o + i] = str.charCodeAt(i); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    w(36, 'data'); v.setUint32(40, n * 2, true);
    const amp = 82;   // of 32767, about -55 dBFS peak
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(amp * Math.sin(2 * Math.PI * 30 * i / sr)), true);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  // 9.5: HQ holds the AirPods when it can. It says so in chf_hq_keys every few seconds and sends each press
  // here as 'hq-press'. While it does, this tab drops its own loop and handlers (so Chrome can't hand the press
  // back to a minimized window) and keeps awake on a Web Audio hum instead, which Chrome never routes presses to.
  const HQ_KEYS = 'chf_hq_keys';
  const hqHasKeys = () => { const k = lsJson(HQ_KEYS, null); return !!(k && Date.now() - (k.ts || 0) < 12000); };
  let hqHad = false;
  const hqTakeBack = () => { if (hqHasKeys()) post({ t: 'hq-reclaim', from: ME }); };
  let hum = null;
  function humOn() {
    try {
      if (!hum) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC(), osc = ctx.createOscillator(), g = ctx.createGain();
        osc.frequency.value = 30; g.gain.value = 0.0025;   // the 3.8 hum's level, about -52 dB: Chrome counts it as sound
        osc.connect(g); g.connect(ctx.destination); osc.start();
        hum = ctx;
      }
      if (hum.state !== 'running') hum.resume().catch(() => {});
    } catch (e) {}
  }
  function humOff() { if (hum) { try { hum.close(); } catch (e) {} hum = null; } }
  // one press, two presses, or a track key: the same thing whether this tab or HQ heard it
  // 9.6: single opens the mic, double ('double' from two taps, 'next' from the AirPods) starts a new chat in
  // this chat's project, triple ('prev') jumps to the chat waiting longest. Seek keys still flip your turn mode.
  let pressBusyAt = 0;
  function pressAct(kind) {
    if (DK.on || (DK.present && !composer())) {   // 7.9: in a Swipe Deck tab one reads the card, two or three stop the deck
      if (kind === 'single') deckSqueeze(); else if (kind === 'track') toggleAutoListen(); else deckStop(false);
      return;
    }
    if (kind === 'single') { toggleDictation(); return; }
    if (kind === 'track') { toggleAutoListen(); return; }
    if (Date.now() - pressBusyAt < 2500) return;   // one gesture at a time; a page change takes a moment
    if (buttons('stop').length) { toast('Mic is open. Finish first, then press again'); return; }   // never leave mid sentence
    pressBusyAt = Date.now();
    if (kind === 'prev') { dlog('triple press: next chat waiting'); jumpNext(true); return; }
    dlog('double press: new chat in this project');
    newChatHere();
  }
  // 9.6: the project of the chat you're in, by the page address, then Claude's record of the chat, then the header link
  async function hereProject() {
    const id = /^\/project\/([0-9a-f-]{36})/i.exec(location.pathname);
    if (id) return id[1].toLowerCase();
    const c = /^\/chat\/([0-9a-f-]{36})/i.exec(location.pathname);
    if (c) {
      try {
        const org = await orgId();
        if (org) {
          const r = await fetch('/api/organizations/' + org + '/chat_conversations/' + c[1], { credentials: 'include' });
          if (r.ok) {
            const j = await r.json();
            const p = j && (j.project_uuid || (j.project && j.project.uuid));
            if (p) return String(p).toLowerCase();
            if (j && 'project_uuid' in j) return null;   // Claude says this chat isn't in a project
          }
        }
      } catch (e) { dlog('chat project lookup failed', String((e && e.message) || e)); }
    }
    const a = [...document.querySelectorAll('header a[href^="/project/"], main a[href^="/project/"]')].find((x) => !ours(x));
    const m = a && /\/project\/([0-9a-f-]{36})/i.exec(a.getAttribute('href') || '');
    return m ? m[1].toLowerCase() : null;
  }
  async function newChatHere() {
    const pid = await hereProject();
    if (!pid) { dlog('no project here, plain new chat'); return newChat(null, false); }
    const hit = (await projectIndex()).find((x) => x.id === pid);
    const el = [...document.querySelectorAll('a[href*="/project/"]')].find((a) => !ours(a) && (a.getAttribute('href') || '').toLowerCase().includes(pid)) || null;
    return newChat(null, false, { id: pid, name: (hit && hit.name) || 'this project', el });
  }
  function yieldKeysToHQ() {
    if (silent) { try { silent.pause(); } catch (e) {} silent = null; }
    if ('mediaSession' in navigator) {
      ['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward'].forEach((a) => {
        try { navigator.mediaSession.setActionHandler(a, null); } catch (e) {}
      });
      try { navigator.mediaSession.playbackState = 'none'; } catch (e) {}
    }
    humOn();
  }
  // HQ came or went: whoever holds the floor rearms the right way
  setInterval(() => {
    const has = hqHasKeys();
    if (has === hqHad) { if (has && isFloor()) humOn(); return; }
    hqHad = has;
    dlog(has ? 'HQ holds the AirPods' : 'HQ let go of the AirPods, this tab takes them');
    if (isFloor()) armAirPods();
  }, 3000);
  function armAirPods() {
    if (tabOff || !isFloor() || !('mediaSession' in navigator)) return;
    if (hqHasKeys()) { hqHad = true; yieldKeysToHQ(); return; }
    humOff();
    if (silent) { silent.play().catch(() => {}); return; }
    silent = new Audio(silentWav());
    silent.loop = true;
    silent.volume = 1;   // the level is in the file; Chrome must see real sound
    silent.play().catch(() => { silent = null; });
    navigator.mediaSession.metadata = new MediaMetadata({ title: 'Claude dictation' });
    // one tap = dictate; two taps within 450 ms (F8 double tap) = your turn mode on or off
    let tapTimer = null;
    const squeeze = () => {
      if (silent) silent.play().catch(() => {});
      navigator.mediaSession.playbackState = 'playing';
      if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; pressAct('double'); return; }
      tapTimer = setTimeout(() => { tapTimer = null; pressAct('single'); }, 450);
    };
    ['play', 'pause', 'stop'].forEach((a) => {
      try { navigator.mediaSession.setActionHandler(a, squeeze); } catch (e) {}
    });
    // 9.6: double squeeze = next track = new chat in this project; triple = previous track = next chat waiting
    const trackKind = { nexttrack: 'next', previoustrack: 'prev', seekforward: 'track', seekbackward: 'track' };
    Object.keys(trackKind).forEach((a) => {
      try { navigator.mediaSession.setActionHandler(a, () => pressAct(trackKind[a])); } catch (e) {}
    });
    navigator.mediaSession.playbackState = 'playing';
  }
  // let go of the AirPods and F8 so the floor tab can have them
  function releaseAirPods() {
    dropMic();
    humOff();
    if (silent) { try { silent.pause(); } catch (e) {} silent = null; }
    if (!('mediaSession' in navigator)) return;
    ['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward'].forEach((a) => {
      try { navigator.mediaSession.setActionHandler(a, null); } catch (e) {}
    });
    try { navigator.mediaSession.playbackState = 'none'; } catch (e) {}
  }

  // clicking or typing in a Claude tab gives it the floor (clicks on the board don't)
  function onTouch(e) {
    if (!e.isTrusted) return;
    touched = true;
    if (ours(e.target)) return;
    if (tabOff || !composer()) return;
    if (!isFloor()) takeFloor('touch'); else { armAirPods(); markActive(); }
    if (micOnTouch && e.type === 'click') { micOnTouch = false; setTimeout(() => openTurnMic('first click'), 350); }
  }
  document.addEventListener('click', onTouch, true);
  document.addEventListener('keydown', onTouch, true);

  // 5.8: a Switchboard command never goes to Claude, however it is sent (Enter, the send button)
  function catchCommand(e) {
    if (tabOff) return false;
    const text = composerText();
    if (!text || text.length > 80) return false;
    if (/^\s*over(?: and out)?[\s.,;:!?]*$/i.test(text)) {   // 6.9: a lone "over" is not a message
      dlog('dropped a lone over', text);
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      clearComposer();
      return true;
    }
    const cmd = parseCommand(text);
    if (!cmd || isTail(cmd)) return false;
    dlog('caught on ' + e.type, text + ' => ' + cmd.kind);
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (!isFloor()) takeFloor('touch');
    clearComposer();
    runCommand(cmd);
    return true;
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    const c = composer();
    if (c && e.target && c.contains(e.target)) { dlog('enter key', composerText()); catchCommand(e); }
  }, true);
  // 5.9: note every message that goes out, and whether the script sent it
  let userCount = -1, userPath = location.pathname;
  setInterval(() => {
    const um = document.querySelectorAll('[data-testid="user-message"]');
    const samePath = location.pathname === userPath;
    if (userCount >= 0 && samePath && um.length > userCount) {
      dlog('message went out', (um[um.length - 1].innerText || '').trim());
      // 7.2: a paused board counts your messages; the last one's reply ends the pause
      if (isFloor() && quiet.turns > 0 && pausedTurns()) {
        const left = quiet.turns - 1;
        setQuiet(Object.assign({}, quiet, { turns: left, turnsDone: left === 0 }));
        dlog('pause', left + ' turns left');
      }
    }
    userCount = um.length; userPath = location.pathname;
  }, 700);
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Clear trouble log', () => { try { localStorage.removeItem('chf_log'); } catch (e) {} toast('Trouble log cleared'); });
    }
  } catch (e) {}
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest && e.target.closest('button');
    if (b && buttons('send').includes(b)) { dlog('send button', (e.isTrusted ? 'by you: ' : 'by script: ') + composerText()); catchCommand(e); }
    else if (b && e.isTrusted && buttons('mic').includes(b)) { armListener(); dlog('mic clicked by you'); }
  }, true);

  function toggleTab() {
    tabOff = !tabOff;
    try { sessionStorage.setItem(TAB_KEY, tabOff ? '1' : '0'); } catch (e) {}
    if (tabOff) {
      releaseAirPods();
      if (ag.audio) agPause();
      toast('Hands free off in this tab');
    } else {
      if (!cfg.autoListen) { cfg.autoListen = true; save(cfg); syncWarm(); }   // 7.8: your turn mode comes on with it
      takeFloor('touch');
      toast('Hands free on in this tab, your turn mode on');
    }
    publish(true);
  }

  // ---------- on/off pill above the message box ----------
  const pill = document.createElement('button');
  pill.id = 'chf-pill';
  pill.type = 'button';
  pill.title = [
    'Click: take the floor here, or hands free off and on (Option Shift H)',
    'F8, Space or squeeze: talk. Again, or pause, to send',
    'Say next, take me to name, status, snooze 10, go quiet, wake up',
    'F8, Space or squeeze while Claude talks: quick note, or say stop to drop the reading',
    'F8 or squeeze while an agenda take plays: note, then it resumes',
    'Double squeeze: new chat in this project. Triple: next chat waiting. Your turn mode: Option Shift L',
    'Option Shift N: next chat   Option Shift B: board',
    'Option Shift A: auto send   Option Shift R: auto read aloud'
  ].join('\n');
  Object.assign(pill.style, {
    position: 'fixed', zIndex: 40, display: 'flex', alignItems: 'center', gap: '6px',   // 7.7: under Claude's menus
    font: '600 12px system-ui, -apple-system, sans-serif', color: '#fff',
    border: '0', borderRadius: '999px', padding: '4px 10px 4px 8px', cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,.25)', opacity: '0.92'
  });
  function paintPill() {
    let dot, bg, label;
    if (tabOff) { dot = '#9aa3a0'; bg = '#4a4f4d'; label = 'Hands free off'; }
    else if (held) { dot = '#ffffff'; bg = '#c4402f'; label = 'On hold · say resume'; }   // 8.0
    else if (approvalOpen() || voiceApproval()) { dot = '#ffffff'; bg = '#c4402f'; label = cfg.autoListen ? 'Say allow or deny' : 'Squeeze to allow once'; }
    else if (DK.on) { dot = '#ffffff'; bg = '#c95a22'; label = 'Swipe Deck by voice'; }   // 7.9
    else if (isFloor()) { dot = '#7ee2b8'; bg = '#1f6f5b'; label = 'Hands free on' + (cfg.autoListen ? ' · your turn' : ''); }
    else { dot = '#c9d2ce'; bg = '#39423f'; label = 'Standby'; }
    const html = '<span style="width:8px;height:8px;border-radius:50%;background:' + dot + '"></span>' + label;
    if (pill.innerHTML !== html) pill.innerHTML = html;
    pill.style.background = bg;
  }
  // 7.7: the pill steps aside whenever a Claude menu or picker is open (model, style, tools, a dialog)
  const MENU_SEL = '[role="menu"],[role="listbox"],[role="dialog"],[data-radix-popper-content-wrapper],[data-radix-menu-content]';
  const menuOpen = () => { try { return [...document.querySelectorAll(MENU_SEL)].some((m) => !m.closest(OURS) && m.getBoundingClientRect().height > 0); } catch (e) { return false; } };
  function placeBars() {
    if (!document.body.contains(pill)) document.body.appendChild(pill);
    pill.style.visibility = menuOpen() ? 'hidden' : '';
    const c = composer();
    const box = c && (c.closest('fieldset') || (c.parentElement && c.parentElement.parentElement && c.parentElement.parentElement.parentElement));
    const r = box && box.getBoundingClientRect();
    if (r && r.width > 0) {
      // 7.7: left corner above the box, clear of the model picker on the right
      pill.style.right = ''; pill.style.bottom = '';
      pill.style.top = Math.max(4, r.top - 30) + 'px';
      pill.style.left = Math.max(8, r.left) + 'px';
      bar.style.bottom = ''; bar.style.right = '';
      bar.style.top = Math.max(4, r.top - 30) + 'px';
      bar.style.left = Math.max(8, r.left + (pill.offsetWidth || 150) + 8) + 'px';
    } else {
      pill.style.top = ''; pill.style.left = '';
      pill.style.right = '16px'; pill.style.bottom = '16px';
      bar.style.top = ''; bar.style.right = '';
      bar.style.left = '16px'; bar.style.bottom = '16px';
    }
  }
  pill.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!tabOff && DK.present && !composer()) { if (DK.on) deckStop(false); else deckStart('pill'); return; }   // 7.9
    if (!tabOff && !isFloor()) { takeFloor('touch'); toast('This tab has the floor'); return; }
    toggleTab();
  });
  paintPill();
  placeBars();
  setInterval(placeBars, 500);
  window.addEventListener('resize', placeBars);
  const soonPlace = () => { setTimeout(placeBars, 40); setTimeout(placeBars, 200); };
  document.addEventListener('pointerdown', soonPlace, true);
  document.addEventListener('keydown', soonPlace, true);

  // 8.5: plain Space talks, like a squeeze or F8, whenever you're not typing in a box
  function typingIn(t) {
    if (!t || t === document.body || t === document.documentElement) return false;
    if (t.isContentEditable) return true;
    return !!(t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"], [role="combobox"], [role="searchbox"]'));
  }
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.isComposing) return;
    if (tabOff || typingIn(e.target)) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.repeat) return;
    if (!isFloor()) takeFloor('touch');
    toggleDictation();
  }, true);
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && !tabOff && !typingIn(e.target)) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // ---------- hotkeys ----------
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;
    if (e.code === 'KeyH' && e.shiftKey) { e.preventDefault(); toggleTab(); return; }
    if (e.code === 'KeyB' && e.shiftKey) { e.preventDefault(); toggleMin(); return; }
    if (e.code === 'KeyQ' && e.shiftKey) { e.preventDefault(); if (!isFloor()) takeFloor('touch'); runCommand({ kind: 'pauseToggle' }); return; }   // 7.3
    if (e.code === 'KeyM' && e.shiftKey) { e.preventDefault(); enterScreenMode(); return; }
    if (tabOff) return;
    if (e.code === 'Space' && !e.shiftKey) { e.preventDefault(); toggleDictation(); return; }
    if (!e.shiftKey) return;
    const teach = { Digit1: 'mic', Digit2: 'stop', Digit3: 'speak', Digit4: 'allow', Digit5: 'halt' }[e.code];
    if (teach) { e.preventDefault(); teaching = teach; toast('Click the ' + TEACH_NAMES[teach] + ' button now'); return; }
    if (e.code === 'KeyN') { e.preventDefault(); jumpNext(true); return; }
    if (e.code === 'KeyV') { e.preventDefault(); if (DK.on) deckStop(false); else deckStart('keys'); return; }   // 7.9
    if (e.code === 'KeyP' && ag.audio) { e.preventDefault(); if (agPlaying()) agPause(); else agPlay(); return; }
    if (e.code === 'KeyJ' && ag.audio) { e.preventDefault(); ag.audio.currentTime = Math.max(0, ag.audio.currentTime - 10); ag.ended = false; paintAgenda(); return; }
    if (e.code === 'KeyX' && ag.audio) { e.preventDefault(); closeAgenda(); return; }
    if (e.code === 'KeyR') {
      e.preventDefault();
      cfg.autoRead = !cfg.autoRead; save(cfg);
      toast('Auto read aloud ' + (cfg.autoRead ? 'on' : 'off'));
    }
    if (e.code === 'KeyL') { e.preventDefault(); toggleAutoListen(); return; }
    if (e.code === 'KeyA') {
      e.preventDefault();
      cfg.autoSend = !cfg.autoSend; save(cfg);
      toast('Auto send on pause ' + (cfg.autoSend ? 'on' : 'off'));
    }
  }, true);

  // ---------- switchboard: heartbeat ----------
  // Background tabs get their timers slowed way down, so a tiny worker keeps the beat when the
  // page allows one. The plain interval runs too; each tick is safe to run twice.
  function every(ms, fn) {
    setInterval(fn, ms);
    try {
      const url = URL.createObjectURL(new Blob(['setInterval(function(){postMessage(0)},' + ms + ')'], { type: 'text/javascript' }));
      const w = new Worker(url);
      w.onmessage = fn;
      w.onerror = () => { try { w.terminate(); } catch (e) {} };
    } catch (e) {}
  }
  let lastTick = 0;
  function tick() {
    const now = Date.now();
    if (now - lastTick < 800) return;
    lastTick = now;
    try {
      computeLocal();
      publish();
      checkFloor();
      if (approval && !approvalOpen() && !voiceApproval()) { approval = null; paintPill(); paintBoard(); }
      tickAnnouncer();
      mirrorPush();
      syncWarm();
      syncDuck();
      checkAsk(false);
    } catch (e) {}
  }

  restoreChat();
  initReady();
  window.addEventListener('pagehide', () => { post({ t: 'bye', id: ME }); if (ducked) duckPost(false); });
  post({ t: 'hello' });
  publish(true);
  every(1000, tick);
  micOnArrive('load');   // 6.4

  toast(tabOff ? 'Hands free is off in this tab. Option Shift H turns it on' : 'Switcheroo ' + SW_VER + ' loaded' + (held ? '. On hold, say resume' : ''));
})();
