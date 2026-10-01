// ==UserScript==
// @name         Claude Hands Free Text Mode
// @namespace    andre.mandel
// @version      8.7.1
// @description  Hands free dictation and read aloud for claude.ai, an agenda review player, and the Switchboard: a traffic light tile for every Claude tab, chimes when a chat needs you, voice commands to move between chats, and a squeeze to allow once. 7.9: ballot cards by voice, and Swipe Deck hands free. 8.0: Hold stops every response in every tab until you resume, and screen mode has a control panel. 8.1: Switcheroo. Screen mode (HQ) answers approvals and question cards with a click, runs the Swipe Deck over the pie, glows the sentence being read, and the pie's center plays and pauses everything; arriving in a chat reads its last reply. 8.3: videos in other tabs pause while you and Claude talk, and play on in the quiet. 8.7: HQ takes files and typing, and updates Claude sends mid task are read as they land.
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
    F8 (play/pause key)       same as a squeeze; double tap F8 = your turn mode on or off
    F9 (next track key)       your turn mode on or off (same signal as a double squeeze)
    Space (8.5) or Option + Space  same thing from the keyboard. Plain Space only when you're not typing in a box.
    Squeeze, F8 or Space, then "stop" / "abort" / "shut up" while Claude reads: drops that reading (8.5)
    Double or triple squeeze  your turn mode on or off: when Claude finishes reading,
    (or Option + Shift + L)   the mic opens by itself. Say nothing for 8 seconds and it closes.
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
    Spacebar alone now does what Option Space does (talk, again to send), whenever you're not typing
    in a text box. Option Space still works.
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
    GM_addValueChangeListener('chf_site_media', (n, o, v) => { rules = v || {}; beat(true); if (isDucked) enforce(); });
    const siteRule = () => rules[SITE] || 'auto';   // pause, lower, ignore, or auto
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
      if (r === 'ignore') return 'ignore';
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
      } else {
        if (isDucked) { isDucked = false; restore(); }
        resumeSoon(v && v.resumeMs);
      }
    }
    GM_addValueChangeListener('chf_duck', (name, oldV, newV) => apply(newV));
    try { apply(GM_getValue('chf_duck', null)); } catch (e) {}
    // if the Claude tab vanished mid message, don't leave this tab silent or paused
    setInterval(() => { if (isDucked && Date.now() - stamp > 20000) { isDucked = false; restore(); resumeSoon(0); } }, 3000);
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
        if (!ms.length && !held.size) return;
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
      const NEXT = { auto: 'pause', pause: 'lower', lower: 'ignore', ignore: 'auto' };
      const SAY = { auto: 'Switcheroo decides: videos pause, live and sports turn down', pause: 'Videos here always pause while you talk to Claude',
        lower: 'Videos here always turn down instead of pausing', ignore: 'Switcheroo leaves this site alone' };
      try {
        GM_registerMenuCommand('Switcheroo on this site: pause, turn down, or leave alone', () => {
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
    // a pie of every chat in the middle, load rails on the right. Two looks, same layout:
    // light is the CHxTLD letterhead look, dark is the ANDRÉ MANDEL radar look. Option Shift D flips them.
    // Colors and type live in SM_THEMES, so graphic standards can be swapped in one place.
    const SM_HUD = { hf: '"Orbitron","Rajdhani",Arial,sans-serif', bf: '"Exo 2","Barlow",Arial,sans-serif',   // 8.1.3: Grid Runner, André's pick from Switcheroo Fonts
      mf: '"Share Tech Mono","SF Mono",Menlo,ui-monospace,monospace' };
    const SM_ARIAL = { hf: '"Orbitron","Rajdhani",Arial,sans-serif', bf: '"Exo 2","Barlow",Arial,sans-serif',   // 8.1.3: Grid Runner in light HQ too. Was Arial (letterhead)
      mf: '"Share Tech Mono","SF Mono",Menlo,ui-monospace,monospace' };
    const SM_THEMES = {
      // CHxTLD, from the letterhead: white ground, black Arial set in bold caps for headings,
      // brand orange DE6A2D for the tagline, bullets and keylines, the cube logo up top.
      light: { id: 'light', label: 'CHxTLD', brand: 'ch x tld', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAABwCAYAAADCOeYzAAAntklEQVR42u2dd5iV1bX/P+u06TN0ERTQiF1BRVRk6KKIvSQxMdHEX/QaExNzvale470xpui14M1NNDESYyc2FFBEBBEBRVGx00Sk9yln2jln/f7Y6/W8HKcyc4YZeNfznGfmnLftd+/93avsVURVCSiggPY+CgVdEFBAAbg7DYlIHxHZPxjegPZliuxloC4AegEbgXAwvAEF4N47gN0F2A/4TFWr7LdcVa0OhjmgfZFkbzCoiUgPoIuqLq/nWL6qxoOhDigAd+cDdlegSFU/C4YzoIDSFOrkwO4CFDQFbNPFAwooAHcn4tglqvp5U+eqaqWI5AXDHVAA7o4L6Dyfjt1NVVe34PLAWyegANwdFdiqWiUivQ3YK1pyvapWB9w7oH2JOpVBTUT6A/mq+mEwdAEF1Ek5t4j0EJHJIvKC/d/TdOwPW3nfgHsHFIB7DwJ7IjAfGAEUAAuBU1X13dbe20T7/GDoA9rbKdLBQJ0L3AqcD1wP7ASWAeOAP4tIjqo+1gYAD5xaAgo4dzsCe5hx6IHASFV9FOgKVKnqX4DvApNE5Ldt9LxAPA8oAHc7APtG4Ang76p6hqquEJHuQFRV14pIF1WdAZwCnCEiz7QWnCaeBwAPKAB3lkB9uIgsACYAp6nqJBPNAaKmbwNUm4/4SmA4UAssFJHDWiuhB1MgoADcbQ/sa4CXgJdV9RRVfc84qhfFlQeUe6eratyAr6p6MfAMMFdEzmkF9w72vgPaaymyB0B9APAn4BDgUlV9uYFTS4Atfg7rAV9EilT1RhFZAtwnIn9U1Vt3VzwPpkFAAeduPbAvAeYBm4GhjQAboKcH7syYbFUtF5ESVX0KGANcLSL/aEW7gq2xgAJw7yZ4ikTkfuD3wI9U9f+pamUTl/UCtjfCcXcaB18KnAgcKCKvi0jflgLWRP4A4AEF4G4hsMcCi4Ei49ZTfUazxigfqGgClOVmaNuqqmNwW2mviUjpbuxlp4LpEFAA7uYD+1ZgMnC7ql6kqhvrE7MboFqgSYB6IBaRQlW9FrgFmGoGu5bo3tUB9w5ob6JIlkA9GPgrUAmMUdVlLclnJiL74ZxXyloAzgrbD79HRD4AHhCRo1T1+y0VzwMPtoACzl0/MP8DeBZ4QlVHqeqyFnBrv75dZ/fLbQE4d4hIsarOwzm8HCcisyyxQ7NvE0yLgAJw7wrqQ0RkFnAxcJ6q/r4VtysBdmuLSlXLRKRAVTeo6inAemCxiBzfzOuDwJKAAnD7gH0ZMBtYqqpDVfXNVt4y39O3dyc1saVVyjU9/FvAn4GZthXXXPE8N5geAe2zOreIdDPgDAauVNXn26hdOcCa1tzA5/BSrKq3ici7pocfqar/2ZzXC6ZHQPsk5za3zzdwVu2TVfX5NuR2RcCmtriRieklqjoTGAacKyLTRaQwEM8DCsD9ZWBfCdwL3Kiq31LV7bsrQtdz7y64VEpb2+olzeGl0AJPhpo+v0hEDm9KPA+mSED7DLiNm10LXKGqD2WBu+V67WpLvde2ynJxQSgXAlNwgSdnNfG+QWBJQPsM5z7S/r6WJe5WCOxordrQkB5u4naRqt4E/BC4X0R+1YR4HgA8oH0C3GOBNzxRPAvUDRdYAllyCfUFnjyOCzy5TEQeaeySYKoEtC+A+zRgSRbb1BPY2lY6fBN6uBd4MhToboEnA+rj+EFJooD2anCLSC8Tm1/NYpt60UTASBtz8DygWlXHm6qxwIJdMs+tDKZLQHsz5x4D1KnqW1luU7tZqVW1yjhzoar+GPgl8LiI/LCexS3QvQPaa8F9AvB+thpjom8VUNbeHWHW9GJVvR84E/h3Ebk3cyEIAB7Q3gruE4GpWWxPN5MM9oj7pzm8FKrqItPDjxGR+SKyvx/gwbQJaK8Ct2Ua3R9YmsX2dAcS3iP3RIcYB89T1U0WePIe8LqInJwhYQQU0F7DuUcDb6nqmiy2pwvOnXWPgdvPnS267CrgNmC6iFxhxysDgAfU0aklgSNnkV0rObhc5dvs/z2e9shAXKSqd4nI+8BkCzz5dzuWF4jpAXVqzm1BFt3aAdz5wDoDVnVH6CDbLitU1Vm4BBAjRWSmOcEEwA6o04vlw+3vm9lqiBnQuvg4d4ch08MLTCUZjrPmvy4ixwZTKKDODu5hwKdZ5lS5QIGqlnfEjvISQAAhVb0IeASYIyLXBtMooM6scw8F/p7ltuQBNR4X7yhieQbAvQQQhap6k1U8+YeI9FXVnwXTKaBOBW4r/3Mw2fUnBygmHTDSobOgmJheoqrPiMgpwPMiUmWRZgEF1GnE8lLgYy+LaRZpP9IVRkIdveMs8KRYVT8EfoHbTQgooE4F7nOAt9uhLV+UD+osQRq+vOo72QNFFQMKqLXg7gMsaoe2FOKKGHRG2gKkgpxrAXUanVtESoEC4JV2aEuKdgr1zAKtB6qBHsBnHaFBInKoqToJG+dqVX0jmPJZ7fOugJcfP2n9/r6qrs/iM/sCR5B2+ooAS1R1c1Oi5EnA2paU9WlFp9Sq6uZOOq7bcBVSenUUcJsd4HJc+GwOsEJEhrVl4smAvkSDgOm+7zHgUuChLD5zInAPLppScFvK5wJTmwL3qcDT7dApPbBURp3RpdOs5+ACazoK1VqfVpn6VWvcJKD6GUwRcDoQtn6LGgf8oIV9HvepvFFb9LNJdfapssUkYVJkw2K5iPQ0dn9jO/RtF9LRYJ1tUniLUQI4oIPZU8QmWNS+hwIYN0i9cRVp8w2kOTb3P2jhfcKGq5T1v7TDOEcN2BH7SFM690nAGssxlm0qIG1M62zJCL32luPyv3UUCvvaFyR4bJqSvjlYbf1X09K13sCm9cyPrPEXX/vDmahviM7ajVWrpVwv3ydafOYzCHRGWosrYNjhhIsMTh5QwxwwksEFQ63s8/YeZ2kuuAcCC7ME6lzTVeNmTPuGieae/lrYWQrx+dxk1+G87DqqdBEAu3kS2F4j6UQaAN9gm6gvZgsQInIgLoSyJ/A8MEhEjgJmqeoqj7N3opI+a3AFETv65A2oYSxIBtPrbDYKbRLcpm+XqeqWLHDtgXb/brjiBo9nLCpni0glMNsH8gIg1cGt6GvsnTqaOC4BsJtFcV8/JX26997FuXExy8+2MaiPxm2tJYC3/TW8LVa6UlXfBt4WkaHARBGpM5Av6wQg3wp0sYCSna3opxKgP3AYzgklinPuWQ6sVNXVu7ma12u5NWeXY4ED7af1Nj4fZUkl62vtiFjbwsD25lSwMRtNb5tDnuEqoqorWtGeQ6wtx/q4t4eLo6x/cnAWdO+5m1ozxs1oUwEwADga5yFag/OCXGqxDA3p99IouO3GQ4G/tFFDh1sj60zkXuEfLFWNe77kNngpVX0dlwzhGOBCEdkOvKyqn3RgkO/EudCW2P8t7achwCXA2QbqAna1flYBZVZn/EHgX81UWTxQp/z3E5ELgR/gHC9KfCKoAjtE5G1gkqo+3cb99GvgIpuwnhHrMxE5XVU3NWGnecwYhLdnX2i/Xbmbc7ML8E/gKNJbhR5Aas0WdIFvgUzgjG03AP+bpYXvcpsHB9gciPikiTIR+RC4Q1X/laE6JOvTf3f5ACOAeUBR5rHmfmyyjMRVA70Y6JdxvKCJ6wsyvg+xe10NDPSf19S92usDdAU+AgbvxnWTjDurLYI1uK21nfbZgcv+UmODqMACoLSR+06283baPZfZswqAf9gxb/tnCy5op8yeG/cZlu5q437qB6w0oJTbMxX43yau+4m38NhCVwt8AuzXirYUA4vtfbdYf8Tt/nFr3w6cB2KZnZMArmngfqfaOMZ94/nVZrblAusXtYW4xqTBTdaG7daeOjvnPrvuUvte5hu301W1XrH8XJw/bPlurDxd7QUHmA76gKru8HFltQoflU0Y3DI5+WJgsYgMAk63cj+zMzi57knjm6puN1tBSQv66zDjwkMMZJU2sEmcM0XMtyrXkvZGSpjdYrqI/ExV/68RndsTfeP2d7Jxzm3G+fLsWX69M2yTJQVcKyIVqvqrNuqnz0TkeuBRa2PSJu0VIvKUqr5UTz8dh3MoqSbt9RUGrlbVja1oTtgWvDz71PqOhew3P6Ua+L21HPsXwG+s7yvsGTUN2HC8efJdm29raMBhpj5wHwU80cLGDTBLcV/gQ2CyqlbYsTxcTez4bkyEuN2jUFUrVPUd4B0zvI03kL+iqu/7QL4nQ0Y34Vxpm9tnz5huXW4TLQkU2Smf2v3UQDjAuG6NDeZO3PZhc/K4qS06j+Pi83faxPkUWO1TKQ4xzlpG2pUxjqu+Ml1V57cRwJ8UkYeBy2wyR3A+0beKyMh6GMtt1v4d1q4i4A/1LQQtpGrgb6bH98H5dngLTh7wLjDHZ5Sssd8XtiGwfwjcYnPAc3v1JLr3TBpcbWMxBDjOxq7M1KpKe49Io2I58BXgrUwxuhFRYiDwTdN5hmUcywfy21ikywfyfN+PAn4EXAMcmSGu57ejSJ5nf+9vSGSr55oXbDDLbXB22vcXTJXZ33duEXAycJcNqieaP9vI/f/hE8vjPjE8gXMY+j7QJ+Oa/sAddl6VTWZPbH6gjftsf2CFPaPSxE4F/ivjvJ/7OJonjr+WhTHsb4tHpQ9oP2vhPVoklptty1O34vZJARuBfwMK67lmMPCUr08q7R5VmWJ55oWXAPOb8RLHmeL/XeDYxgCYJTAVAbm+70cbwK8BjsnmAtMEuP8A3NqM8y/L0B8rbYB/1oxrjzd9+wOgZzN0bk+H9p7xGnBIE8+42SZZuW/CrW6NftvAcy60xabSZ2coB072zbMdvmO19n1wFsbwCFtgqnwL7Q1ZBvczds5264NaW/COb8az7skY36qmdO5SGnBcMfF6kH1qgbmqujLDyp5sD73XconnWj71pKq+B7wnIkcCI0TkVBPXP2hn6/p2W2ia2ua42vTGiP0tAn6uqn9oxru/JSITzeC5uZlbYJg4uwG4pBnbaTeb9PAVm3QRE137G1dpq3F8QkT+DnzPuE/YpK7fiMgFwO1m9Kq0Y1HgF7Zl2taU9PWbZPRhNra7jjK81ZEO7KkBvtucKrqqepVt0w03yS+WaTGvD9zXZzSi0GT9I0wHnO6VFLLtiYjpw+2q5/qzo1obEwbmD0TkcGCYiIwAFnqToTX6fxNt8RaNHTQd9jnIxDGv/YXAS80Btu9522g6v3vSB+6E6Yr3N2ef3DwInwJ+ZnOk2q7vkYWhvBFXGrqPfa8xFeQlWyhrfUas51X1z9maUu1snznd9Ortto+eazsGc1twj//GxY+HrZ/C9YLbjFQJ4A373h2Xr7wfzm/6kQzLNx3FNdRnvPM49EfAR7ayDbMMpQtVdYkP5JEs5EjfYkauxmikAc7j3Ar8Txa6JeX7GzaAzmzB9W/7wBa1e8SyMHYbROTntl9dTjpg40Rrs7dIbbXtMLII7vYE+JH2N2rzYQfw1xb23csistiYRaoxa/lE4HUgJCLftFX6XeBBzxunA1ijm3rZygwV4RPgExE5GBhjlToXeWKPLVLShu+zmaaD84f5/o+ZjrU4G5JfxlbYOrOON5e2+dqYtE8oS+P2LxF5EPi2ATzm27rzbCc/r8c7Kxvgbq8Am36+xTcft/387m7cZ7qJ5pWZW3SRjEk3ABgPvOuP4xaRYhN7O0tWUj/I1WwDK0XkIGC4iAwD5tnWWluCfDOgItK9kXRGPXyDGgI+zFJ6qcxJWmNGl+aSt+cb8gE7m8UZf2Yqy5E+EdPbkvqrqt6d7WnTiL2irfXtElNDUr4+3l133/etvTmZB/zgXmjs/Trg7yISAlaYPl1GJyQfyAtNXF8FrBKR/mZ4G4orS/ymT1wPe2L+btAmG7BeJkbWRxHfxAmxq+NENknaYNJnc6w2WCXVQaSTJHii5pvsXRQ1HdvbmqSR+dIUVVk/JTLVppCvc3+D20O7G5gATAFeEJFbRWSE5Ziik4K8wmLHCyxIZbWq/hO3M3CYiPybiAw277kKEcmzBaGlz9liHd2YUc1zH4za4Hbv4N3XHqmCEJHvAF8nbZ2HdDaUW8y6nPWp0k596uVa81Jggdsl2B2KNDQ+kYzJuRZ4AHhARHoA55mY/n+4vNzTcB4781vB3ToCJ/cMgp8Cn1rJpNGmk79lgSu7y8lTOE+9hmgjaS+oFC6O/RBVXZ5lTq2tmOyhLAP7UJyXVsIn/nu2ggTOSPknEZmQxe1Mv84tWZ6HZSKyHrcb4PXtEbt5u8NJR8hpvZy7Pi6kqn9T1a/izPY34/Y97wZeFJG/iMg4i6zpbCCPZ3Dyz42TTwMOEpHvi8jxu8nJq2k8l9rCDD24GzC2HbiRtvL6bNJduH10zxiZY5xMjQFV4HYZfp7lfqovB1q2aBnpaL0KkyAH7sZ9JpLOkU6zwJ3J0VX1cQP6SQbwQlw006sicpeInGWGgk7Fya00b6GFn65R1ceAJ4FDReR7InKSD+S5zVBPNtH4dtgimzwxn879HyYpZYNzq2+cUy2c7OrjopoNDi4i1wFn2AQX49ZrgedIW+pzTFy/XkRGZmk6eH2TrOe3bNg63vFJKgmcofXfWth3pTifgOr6xia0G4DYrqoPq+qlwCjgV9aw24DZIvJXA3rXTqiT54tIkapuUNVHcQkrDhCRq0VkiKpWm3dcXiMg/7wJcL+Fq5ga9oH7YOCe5uaNE5HDReTOZpYvkjaYnFkRVS3K7yYzCoV9RqEbVPVs6ysvUULEzvlTFhZCD8jeroD3rtnMiTcNlxgjgtsKqwauEpEzm9l3Jbg4AI9JJGlBgsTmgGKTqj6jqt/EOR383gbgFmChiNwjIhd1Fo5u4nq5gbzQQP4E8C+gv3HyUuPk5Q2I66saA7ftPPzZN5nDuL3dC4BHmhLNRGQ8rlDEj+w+2Rbns7UdlAfcidvq8qy9xcA/TUUCF/UUNwDUGACOBH6bhSZ5PuEhn8p0fn1qZ1sk71TVdbjoyxxb3Dwbwz9F5KtN9N3+uJDZ40m75oa/pE5kKZCim+kC9+PC1pZYY86hkWCHjvaxFbXQ9723gfAqYGjGuT3t70Sci25zo8J22KT1Ag0+t8XxBHted1wKpHNwXlwVvusUuLeB+99POoi/Fhdo0rUF715KOqijwjjDhW3Yt9f73sOLdFuFLxrOzruGdIhrLek4829kYbwfJh2M4fXzI/gCZoDTzKhc2szAka818rzeuPRZnvXci5CrwXmrnYQvaQpuF+Zy3J64N7ZeWG6lb5H4clRYlgCSC5yPS0vzLi57xn24FDa9OgnICzJA3hUX0XQlMLyeAX6dJiLjgIMMcF5UkDdAlb4Jts7AvoH0FloV6Swtigv/y2sGuN8Huu0GuOM+cF/URv15HG5f11vUvDZObOD8R3zv4k3+z4GD23icz7R+3u4DWgoXIvuUGUO9yKtZrQW3XTPWnhO39/Mv9JXAx8YIXjVbhBe6643JVpsT1b62ndEu4K4n/dI4XLja28bVp+Ayg/TpJJzcv5L2NI56FTDCfhtAE+GYvusP9hnYPA7ppfbxQgC9OlBezHOFT4z9n0bufb8NvjdRlwJdWvCuXrRRmd2jti04ty32C+29dvoWqbsbuaavj8N5/ZOikXj2VrTvXtJx8F4IasJnXPTSLSlwaT3g9q7bbv1/cTOeeY7vnh7IPaAnfAbNct/9FVfs8To7x5szSWB8u4O7npeaYEaBd23w/mliR59OwMlLMr6PtZV/NM5f/LAW5PH6o2/A6nyrsDfIVb5BrjGxcGIT9/W4XbX9Xd5Czj3Crkv47vG1Nui7O3yT2CtWuJgmcvbZdmw1u+YYU+DGto7NB/7uk5S8cdhh4+AlyliKxZ1nSDteGiyvfd9o5nMH4SLhNENCq8b5+Zf7di52mNERXPiwZiwEExvKodaeBqwZwAzzAR9sovoPbGtoGS4t0AIvf3lH2kLLMK4U2sr7VeCnPqA2y6EB+KkFTlxqE6QPzoXVS6vkJcpbAjyuqi8049YrDTReCp51tKzKZ6WpF97ec9S4UWuMaCcad3uVdLbRFHB9UxF6qvqCiPw3zrGqmnTqo9Ei8qiXT68NxrYKl59sOi7O/Bgbi5SNw2ozaN5TTzrmuPWZt3+d09w+sziHsSJyPi6A5gh7bswk3s2ma79mz/ZKfW20bTUvQjNm0h1i6O9QZLnRxtr+ZwnOt3gO8Ix50e3JthXjnHlOsYEfgPMSKjMR+z1c5NmiVjxjgBlbuthArQM2dpbAnUbeK9cfh99J2nywjXES2NzCkr6teW4PXHKMIltY1zSUS76hyjwdEtwZDR+KS/801PbTl9nW1HyvWEGWn3+graKDDdADTWSqMlF3tnHUVZ2o9FFA+wB1eHBnAG0kzg1xogH9fWAWMNX8xFvNWcyKPcQWk4PM6JVjDhVLfZx5bTB9AgrAnR2gH4+LIhqKq9CxwrYr5jVX/xKR/YwrH4lz4xvkM1hsMFVgAbDay0ITUEABuNsX6ENwrrDnmZ66zIA51W+MszjuQcb9v4LbYulm4vUCM1i82R7ifkABBeBuOdCPxDmYDDeDxKc4x5lhOEviNpzl8R1cPPfyRrKmBBRQAO4OCvTjcPujXUxXfsefPiqggAJwBxRQQJ2OQkEXBNRRacpE6f3z05oXUXj9ICnoqO9x6QQpbo/n/OmrUiiTJ+cG4A6o44L6FDlm+ii5r2sZd/XbxklNnf/kBdJrSDGTZp0px3S0d7nvcCm6ZCeTXhwuJ2e1z34ieV1Wc/O8yd85OQB3QB2Svl8qXbvl8LuCMCu6F/KD77+pTRZS6L0BeuVxcH41HS6JZ/QAYvkx9i+JtX1BBz9tv+ME6V3IIZGcdMLNyJ5+ecsmEsG52MVwDiMxXPRQxD7eb15KWC9rpHddnu/aHPvulWjpioukeQ/nxvkZbt96YwCljkfnxDhIhMjIWXpLc69ZOoDUoeuIp7KbV323qHsNKQ1Tl0hk9zlX6uL4jNFSU1n+RVroL4PbtpIqSdeX8sDlASvHB5wCO6fQB8B8+0R9gPXK0YR9v/uPx3yAzvWB00ut05aLUA3wmYiswm2JrcB5nn0EbFHVDQHEGqanzpfurObcrsLUdUWMKxBG5NVSpl158vTnXNZYgAeGy8WFuXwa3klZQT4/WBtn0WVv6IMAT4yWC2sSnFiiRJPCy+fM0+cA7hsh3zwsyoRipfCl0XLrTqGsJs69lyzUjdNOk4k5MCJZQUFNiu01JTxx8UxXA65oOsnq40hFooSnjpELwilOjyrxSB3PjnlNZzf2PnNGSY/tNXw9WswRqWrKErVMuWCBvvXTw6Xo0AK+Fu/FM9fO2LVoxMPDZXh1DUXffUNnAMw4TcZSx/hQmMKaOMsSJTx2wfO6HqA2h1BOHZGKBEyS7sV9Ttl2eXQ495/7x10DZZ4bKeesLmfHNW/pKwCPD5HTcvM4LSnkpIRFF87Vh3cR94dJ//4RvpuM06W2J2t61PIIIRLdu6eLE9QHmvG4JAQHky7fGiNd18oDajZF+syMnUnqj7LyMlY2VApG6rlnFOcfPjDjWDlQLSKrSSeVWGOflZYWZ5+nFSspHtKNy2sinFGwlYWRHKbGijgmUcYt00bKbyfO1ZcBeocZUSz8eGseH9cKq1IRPgCYOlZuzUnQJT+PKTkhcitq+PaMMXLQhNl6N0nKa4UddXlEtZZtyTp2rFlO/L5S+dZ+Ub4mSV7MibA6LByXG+d3c0fKtSPn6rJthxLqFyNUneRHyTre6RbiuXiEfinlhpfGSq+xL+mj9eqpl0nfohR35EVZmYgyJaeKvuRw84wJ8oc/fqRzZ4yXCwtriJKRzqprLt+vDDEf4LlS+XpOhCuSKR6SFOuK8jkjXsHtz42V6896Sdfmh9FQglQsQqKWbcmiHC5MLmAlLgEkAIsmSHEszNUlUf4XYOYouS6vhJFdwjy4tZYteXDJ9OFy6Jmv6k0Aj58uh/SHu8hlaSTK85VlHLJVuKlLDn3Ly9nZILhV9U4RmQr8Jy70LIQLkvCfm6L5WTFlN45JE39bS6mMBcSr11SMC7M7MQP4K0VkDS7k7xNcoolluDDM7ftSwEihUBsGYlEWnf6W3m4/Pz99jOzITXIN8DJALEathCmrgV9dMMdxsZkjZHxEGHDmPL3Yu9/GS2TRknX86YlSmXbFfJ36r1NlnSQYOG62/s47568T5OWqfkw96x71Ju7Tc0bIPfEqhgHLtuSTJEVujvD+uHn6RX61l8bKJynlp08OktkXvKObMt8ldxXfSUX45MzZeoP328Lxsq08ziXAXAlxf3Utlzx4rTx06SRXdWf2GBkWTlFyUJwHXy2VrtEoV0SUm0975YvqnDOfHy23S4KrgBvXfA4DeqOJWiLXq1a+eLY8KxVc7Ad3VQUTNUrFpYt02tzz5YhUHaPzD+F7pX/7QnWcM3O0PPboeVL69ad1XlENV0fDvDNypv7Su8fsETJe4LbK2nQFm3rFXaut9R0ReRT4NS4aqtbH+do6aV59ubWzmRg+lPFsL3tk0icpeOeFcK6qX8m4h5cW6XMReRuXDmcDLhXOWlx8d3lnC3FsigqKiVVDXdU2V8d98uWSe/lkra6rYVokwrnTzpPBE5/Wt6WWkooQz13wiq6fM0pyR83R6qRwYkGYnZNK5YTcJDk1SiKvDg7MJz8aZQCwsksXemicmvtOlaIr5jvR9Xsz9HOA34yRw/rWcmCogsRBJRQToyvAUb2IxrdQ27WAabvouwfyxsbVVBV14xhcIoRdKD/McTlR5v15kBwXjZK/MUrVkTmE84SDHz5MenzjY338hZHy7f3eYRwu3TV1Cb6mEeacsFh3TiuVMyJC2ejZu5bdrROezxGuAqiIkkopIW/CFcSYEk9w2vTxcuqZM3U+QDLMeZLiCYD4ekZHCognV3LAnwdJn6oo0dxtVB/Sj3D+Ng4G5kmSgclu3LbLuPRj4fZ1fFpA2qjYqC5rAfJzcWmE/h2XqK+OdH7ptgai7IH5mvAtWl5tqpCvPV42Ei/1bYp0CZee9jnOd7+NuDRLy4FnRWR2Z4/D3oXb5ROTWqqiW10V0Msnu8UrlqAiHCNZu91NrpoISbFSOaPmuHMKYxQkEvQlTmkoTKo2QrIqRE0xTKvszzIASVCjCVI9PvaJz+fKkV03c93hUXaUVbO+ro5toRi98hPOAt3bGVLqdpaxS027p6eTOOkIkrk5X05RPOlSKR4SI7eshsGpMIlwmKKSFGWbK8jtnsvkb3ysWwAiBczQSi4CnlxwmhyTTHJQfj53AJSF6NM7lRaDPSoRdtRA9JpeUjjqSBIh0BxxSS+GPaGrZw2XeaEk3wbmzzhVxkfzyC2whakgRkzD9F2zjTPqlB2RPEJSQOUmWByKMe+ms6XHSVGkMGfXdz3pQS2bPk4qc0Jpo2KThirjPHeJyDPAL3FpkCIG8jC7Jr+XTgJqf9reSD1qhpeEzqs+UV9t6mozyH2Ii+f+3ET2D3CJFcrZC6lnFKmroaCkPz2Bz5+9SfLPvknjmwroeYCSX1jOeuvhVEx3LQYfT1IWgWXXvql3NnT/bTXUlYSR7Welry3cwtWJCGsvHs3vucktFC+NlMOqbfFY8C7VQ/oQ7ZnP/sCSN8+W/BOe1fi3x1KwbCN5G3ayMvM51z6oZbOHS2WokGnXzNEpDbVnTSFP9Ilz7owJcmw4yenhHJaOet6FF+dGWE+Kngt+Inmn3J4uc1RXw34SI/GnTVoxaaAUd+0Pdcn0+9QV8Qhx7n3jW3J0OMJZiVqmnzrLzZedETYVJ/j80sVab/rme4dIfjiP2vh6egNsuE0Kel+vlWu/Ld1zlB6VobS1vNlGMVX9VFWvxPlqv2KczquWkMz4256FzP2ATPmAmfIdT2b8xSd+e232uHM4Y4cghgsBXYLLQnk7LnlEKTBYVUeq6o9V9TZVnaqqy/dWYAMklNpolJwdLiUWZ9/k7A0HK1fUJVk16i1X8yyWICSW7ucLQ0eIF+pCnDBrnIzzflvwE8l75AQZc+8I2R9A6pB8JVXwUnqSRiOES3JIecB+bJQcnRtjdDTkShJ3KSSUG0K3JfjOU+dL9xOedW1auZVvppTKGa/zcb3bJlHmhGv55pxR6SIHL42Vvg+NkRHe98sf1w2hEC8W13JLCE5J5fCQd6zP/syvq6GmZimXeb99OE66p4TLaoWZAOvzCEeSqH8nbMIMXZEb43U2cncUeperE/kBVu/HnJoaur5WKhf52/rkCBlzw0HS/8rFGq+K8UooxGXrhkh+7+udVPjhKr5aGOLAcknP7xZvManqy8DLInINLvf0AONifg6cov0cZCSD24Z9HDfl++uvKBHKUC28fqgwIH9iFvOVuKiyD3B745Xs47R9O9GeeewIC3WPnSq/65Zga003jooqXSUvXcur3K2MuyTvnzBLl8wYIfcm4boZY+SMymo250Y4OpZDda88/hsgHCIUVyJ8Jc3ptlbzgMb47Quj5A+1ddTk1ZErxezc6fHKfuRv30KiWPg0tpb/erpU1uTl0i8nweEov57cgN2j9kT+Ka/TLxXi79PGyiJNEg2FOClWxQJjYABsXs5DvQ/h4lSKGRNmpNMsnfSglk0ZJTcXJ7hxTqkcvSPFZzkRhhLik4FH8TDA8GOgaj1SG9sVD5t28JAUcDZRplw8K73V9oNHdN0zw+QWjfGrmWNlRJWwKU84PBwit3cxvwTQIv5RVcah7+Yz+aMRsqQSutQmiEuKNcW+Pm9V4IiI9MUVTb/KOFwd6aJkoXYEuN8AlmxggclcyCoMxBtxe92LcZld1gdZVhqmx0fIQYUh7iyp4+pNdRSGIgyPdKWq7n1mnPdpOqHFb46XI4prqPzR+/pZ5j1mDZd+lfkMq6kmp2cBn4+eoV8Yu6ZMkJ5rN3PwjxfvmoPu2bOlX2ItQyRGdEsJL+ZUUVJRhVz9hq6cc5PkLp3CsT98X19/fowcVV7FCalcksXK3AlznDGuMXq5VE7ammJgNIzGYnwwYZYuyTznzokyuKiYTVc88uUt0ZnXS6/aNxhZVUVBJMrH58/XBf7jd5wix6/awvJJy3atcz+pVE7IrWL5lYv1S3r7kyNk/9h2Tg53oSAhbIoUsHDCjF2vf2acjMtNMbCsgKUXP6uv3jlAjqg6jk2/eMqFMLdJVJilP7oZF0PtpYPNIXsecJqxpZVqxJLvJfpfg0u0uAznpbYc+Djgxi2j1y6UwyvLuXsbXPe1mfpe0CMdl9oEfKo6FygVkauMkx+UISa3pU4tPqkgXA83Xm7Grc9w+9FvA+sCbtw2tPFT6jRGdSjvi5THAe3N4PaB/B7L9/wTXM7nAtIVGv2OKPXp5JlGMX8bvXM9MJcZkNfgEhcuw+0tLwNWWC7wgLJA/c5m/TvPcEPPY1kT9EbHpqwlaxCRYbjyrKcZYOtMbG6II4cyjuMD8grjxKtwfuBLgLWqX/Y6CiiggLIMbh/IvwPcgPNV92pc1acbx0nnN3vTQLwaZ7H+TPXLRoeAAgpoD4LbAN4H+CGuVFAhbrvpY9w20zr7/11cgEYQihlQQJ0F3D6Qn4xLJ7zagLwtGIKAAtoLwB1QQAG1H/1/kzXpzbE4gCkAAAAASUVORK5CYII=', f: SM_ARIAL, v: { bg: '#ffffff', bg2: '#f6f6f6', panel: '#ffffff', line: '#d9d9d9', ink: '#000000', mute: '#5c5c5c', accent: '#de6a2d', need: '#de6a2d', wait: '#eb9a6c', work: '#000000', idle: '#c4c4c4', glow: 'rgba(222,106,45,0)', grid: 'rgba(0,0,0,0)', glowc: 'rgba(222,106,45,.5)', glowc2: 'rgba(222,106,45,.22)', glowbg: 'rgba(222,106,45,.12)', glowink: '#b4450f' } },
      dark: { id: 'dark', label: 'ANDRÉ MANDEL', brand: 'ANDRÉ MANDEL', f: SM_HUD, v: { bg: '#0a1520', bg2: '#112436', panel: 'rgba(13,29,45,.92)', line: '#2b4b68', ink: '#eaf3fb', mute: '#a2bccf', accent: '#5ad1ff', need: '#ffae36', wait: '#ffd98a', work: '#5ad1ff', idle: '#37536d', glow: 'rgba(90,209,255,.22)', grid: 'rgba(90,209,255,.06)', glowc: 'rgba(90,209,255,.9)', glowc2: 'rgba(90,209,255,.45)', glowbg: 'rgba(90,209,255,.15)', glowink: '#f2fdff' } }
    };
    const SM_SAT = { need: 1, question: 0.86, wait: 0.7, turn: 0.55, work: 0.45, idle: 0.16 };
    const SM_WT = { need: 5, question: 4, wait: 3, turn: 2.5, work: 2, idle: 1 };
    const SM_COLKEY = { need: 'need', question: 'need', wait: 'wait', turn: 'wait', work: 'work', idle: 'idle' };
    const smKind = (e) => {
      if (e && e.deck) return e.deckN > 0 ? 'question' : 'idle';   // 8.1: the Swipe Deck rides along as a wedge
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
      return tabs.map((e, i) => ({ e, i, k: smKind(e) })).filter((x) => !x.e.deck && x.e.id !== fid && (smWaits(x.k) || x.k === 'turn'))
        .sort((x, y) => smRank(x.e, x.k) - smRank(y.e, y.k) || (x.e.since || 0) - (y.e.since || 0))[0] || null;
    }
    // 8.0: the switches in the control panel: key, label, what it does
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
        '.smx .stage{position:absolute;left:800px;top:100px;width:1100px;bottom:248px}',
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
        '.smx .tgw{display:flex;flex-direction:column;gap:10px;padding:14px 18px;min-width:0}',
        '.smx .tgw .ck{font:600 15px var(--mf);letter-spacing:.24em;text-transform:uppercase;color:var(--mute)}',
        '.smx .tgs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 14px}',
        '.smx .tg{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:12px;row-gap:8px;height:74px;padding:9px 16px;border:1px solid var(--line);background:var(--bg2);min-width:0}',
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
        '.smx .asks{position:absolute;left:800px;top:100px;width:1100px;height:300px;border:1px solid var(--line);background:var(--panel);padding:20px 26px;display:flex;flex-direction:column;gap:12px;overflow:hidden;box-shadow:inset 4px 0 0 var(--need)}',
        '.smx.asking .stage{top:416px}',
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
        '@media (prefers-reduced-motion:reduce){.smx *{animation:none!important;transition:none!important}}'
      ].join('\n');
    }

    // one screen, drawn into any box. The frame is laid out at 1920 wide and scaled to fit;
    // its height follows the box, so a 16:10 display gets a taller stage instead of bars.
    function smMake(host, onAction) {
      const fx = document.createElement('div');
      fx.className = 'smx';
      fx.innerHTML =
        '<div class="gridbg"></div>' +
        '<div class="tx"><div class="hd"><div class="kick">' + SM_HP + '<span class="fl">Screen mode</span></div><div class="ttl">Screen mode</div><div class="sts">Waiting for the chat you&#39;re talking to</div></div>' +
        '<div class="msgs"><div class="mz"><div class="mw">Waiting for the chat you&#39;re talking to</div></div></div>' +
        '<div class="dock" hidden><span class="cn a"></span><span class="cn b"></span><span class="cn c"></span><span class="cn d"></span><div class="il">Image · from this reply</div><div class="im"></div></div>' +
        '<div class="draft" hidden><span class="mic"></span><span class="dw">You</span><span class="dt"></span></div>' +
        '<div class="cmp"><div class="cto"><span class="ck2">To</span><button type="button" class="cdst" title="Follows the chat you are talking to">FLOOR</button><span class="cfl"></span></div>' +
        '<div class="crow"><button type="button" class="cclip" title="Attach files">+</button><textarea class="cin" rows="1" placeholder="Type, paste or drop files" spellcheck="true"></textarea><button type="button" class="csend">SEND</button></div>' +
        '<input type="file" class="cfile" multiple hidden></div>' +
        '<div class="hint">say next · take me to · allow · silence · resume</div><button type="button" class="flw" hidden title="Follow the voice again">FOLLOW</button></div>' +
        '<div class="bar"><span class="br" title="Light or dark (Option Shift D)"></span><span class="sb">Switcheroo</span><span class="dots"></span><span class="grow"></span><span class="nx" title="Go to the next chat (Option Shift N)"></span><span class="lk zero" title="Links from your chats. Say open, or open two">LINKS</span><span class="pz" title="Pause the Switchboard for two turns, or resume it">LIVE</span></div>' +
        '<div class="stage"></div>' +
        '<div class="asks" hidden></div><div class="dkov" hidden></div><div class="lnk" hidden></div><div class="pgv" hidden></div>' +
        '<div class="ctl" hidden><button type="button" class="hold" data-ctl="hold"><span class="hk">Responses · live</span><span class="hv">Hold</span><span class="hs">Stops every tab until you resume</span></button>' +
        '<div class="tgw"><div class="ck">Controls · every tab follows</div><div class="tgs">' +
        SM_CTL.map((c) => '<button type="button" class="tg" data-ctl="' + c[0] + '" title="' + smEsc(c[2]) + '" aria-pressed="false"><span class="tl">' + smEsc(c[1]) + '</span><span class="sw"><i></i></span><span class="tv">OFF</span></button>').join('') +
        '</div></div></div>' +
        '<div class="dropov" hidden><div class="dpt">Drop on a chat</div><div class="dps">The center, or anywhere else, goes to the chat you are talking to</div></div>' +
        '<div class="toast" role="status"></div>';
      host.appendChild(fx);
      const q = (s) => fx.querySelector(s);
      let theme = SM_THEMES.dark, stageSig = '', lastHtml = null, lastPath = '', model = null, H = 1080;
      // 8.1: approvals and question cards, the deck overlay, the reading glow
      let askSig = '', armAlways = '', armT = null, multiSel = new Set(), multiKey = '';
      let dkSig = '', dkOpen = false, lpT = null, lpFired = false;
      let lnkOpen = false, lnkSig = '', lnkBiz = '';   // 8.2
      let msgScrollAt = 0, lastTextSig = '';

      function fit() {
        const w = host.clientWidth || window.innerWidth || 1920, h = host.clientHeight || window.innerHeight || 1080;
        const s = w / 1920;
        H = Math.max(760, Math.round(h / s));
        fx.style.height = H + 'px';
        fx.style.transform = 'scale(' + s + ')';
        if (model) { stageSig = ''; paint(model); }
        fitNames();
      }
      function setTheme(t) {
        theme = t;
        const v = t.v;
        const vars = Object.keys(v).map((k) => '--' + k + ':' + v[k]).join(';') + ';--hf:' + t.f.hf + ';--bf:' + t.f.bf + ';--mf:' + t.f.mf;
        const fs = fx.style.getPropertyValue('--fs');
        fx.setAttribute('style', vars + (fs ? ';--fs:' + fs : ''));
        fx.className = 'smx ' + t.id + (askSig ? ' asking' : '') + (dkOpen ? ' decking' : '');
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
        const dc = ev.target.closest('[data-dk]');
        if (dc) { if (!dc.disabled) onAction({ t: 'deck', cmd: dc.getAttribute('data-dk'), deck: dc.getAttribute('data-deck') || '' }); return; }
        const c = ev.target.closest('[data-ctl]');
        if (c) { onAction({ t: 'ctl', k: c.getAttribute('data-ctl') }); return; }   // 8.0
        const j = ev.target.closest('[data-jump]');
        if (j) { onAction({ t: 'jump', id: j.getAttribute('data-jump') }); return; }
        if (ev.target.closest('.nx')) { onAction({ t: 'next' }); return; }
        if (ev.target.closest('.pz')) { onAction({ t: 'pause' }); return; }
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

      // ---------- the stage: pie wedges, load rails, leader lines ----------
      function stage(tabs, floorId, ex) {
        ex = ex || {};
        const t = theme, v = t.v, P = 'sm' + t.id;
        const vbH = Math.max(600, H - 348);   // 8.0: the control panel takes the bottom 230
        const cx = 430, cy = Math.round(vbH / 2), R = 275;
        const list = tabs.slice(0, 12);
        let o = '<svg viewBox="0 0 1100 ' + vbH + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>' +
          '<radialGradient id="' + P + 'g"><stop offset="0" stop-color="' + v.glow + '"></stop><stop offset=".65" stop-color="' + v.glow + '" stop-opacity="0"></stop></radialGradient>';
        for (const k of ['need', 'wait', 'work']) {
          o += '<pattern id="' + P + k + '" width="13" height="16" patternUnits="userSpaceOnUse"><rect width="10" height="16" fill="' + v[k] + '"></rect>' +
            (k === 'work' ? '<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="13 0" dur=".9s" repeatCount="indefinite"></animateTransform>' : '') + '</pattern>';
        }
        o += '</defs><circle cx="' + cx + '" cy="' + cy + '" r="' + Math.round(R * 1.5) + '" fill="url(#' + P + 'g)"></circle>';

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
          const name = e.deck ? 'SD SWIPE DECK' : smPad(i + 1) + ' ' + smTrunc(e.title || e.name || 'Claude', 40);
          const barY = ay - 8, fill = k === 'work' ? 'url(#' + P + 'work)' : k === 'idle' ? 'none' : 'url(#' + P + (SM_COLKEY[k]) + ')';
          const w0 = e.deck ? Math.round(W * Math.min(1, (e.deckN || 0) / 12)) : k === 'need' ? W : k === 'work' ? W : k === 'idle' ? 0 : Math.round(W * Math.min(1, Math.max(0.06, (Date.now() - (e.since || Date.now())) / 600000)));
          rails += '<g class="hit" data-jump="' + smEsc(e.id) + '"><rect class="hitbg" x="' + (x0 - 12) + '" y="' + smF1(y - 10) + '" width="' + (W + 24) + '" height="' + smF1(hb + 20) + '" fill="' + v.ink + '" fill-opacity="0"></rect>';
          if (e.id === floorId) rails += '<rect x="' + (x0 - 12) + '" y="' + smF1(y - 10) + '" width="' + (W + 24) + '" height="' + smF1(hb + 20) + '" fill="none" stroke="' + v.ink + '" stroke-width="2"></rect>';
          rails += '<text class="rn" data-i="' + i + '" data-full="' + smEsc(name.toUpperCase()) + '" x="' + x0 + '" y="' + smF1(barY - 18) + '" font-size="21" font-weight="700" fill="' + (k === 'idle' ? v.mute : v.ink) + '" font-family=\'' + t.f.hf + '\' dominant-baseline="central" letter-spacing=".4">' + smEsc(name.toUpperCase()) + '</text>';
          const timed = !e.deck && (smWaits(k) || k === 'turn');
          const right = e.deck ? (e.deckN || 0) + ' OPEN' : timed ? smClock(Date.now() - (e.since || Date.now())) : k === 'work' ? 'LIVE' : '';
          rails += '<text class="rr" data-i="' + i + '" x="' + (x0 + W) + '" y="' + smF1(barY - 18) + '" font-size="18" fill="' + col + '" font-family=\'' + t.f.mf + '\' dominant-baseline="central" text-anchor="end"' + (timed ? ' data-since="' + (e.since || 0) + '"' : '') + '>' + right + '</text>';
          rails += '<rect x="' + x0 + '" y="' + smF1(barY) + '" width="' + W + '" height="16" fill="' + v.line + '"></rect>';
          if (w0) rails += '<rect x="' + x0 + '" y="' + smF1(barY) + '" width="' + w0 + '" height="16" fill="' + fill + '"' + (k === 'need' ? ' class="pulse"' : '') + (!e.deck && (k === 'question' || k === 'wait' || k === 'turn') ? ' data-grow="' + (e.since || 0) + '"' : '') + '></rect>';
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
          if (span > 9) pie += smTxt(lp[0], lp[1], e.deck ? 'SD' : smPad(i + 1), 26, SM_SAT[k] > 0.8 && t.id === 'light' ? '#ffffff' : v.ink, t.f.mf, ' text-anchor="middle" pointer-events="none"');
          a += span;
        }
        const waiting = list.filter((e) => !e.deck && e.id !== floorId && smWaits(smKind(e))).length;
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
        return o;
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
          q('.tgw .ck').textContent = ct.held ? 'On hold · these come back when you resume' : 'Controls · every tab follows';
          fx.querySelectorAll('.tg').forEach((b) => {
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
        const sig = t.id + H + '|' + fid + '|' + ex.held + ex.meeting + '|' + tabs.map((e) => [e.id, e.title, e.state, e.seen, e.ask, e.on, e.reqKey, e.folder, e.since, e.deckN, e.nVisual].join('~')).join('|');
        if (sig !== stageSig) { stageSig = sig; q('.stage').innerHTML = stage(tabs, fid, ex); fitNames(); }
        renderAsks(m);   // 8.1
        renderDeck(m);   // 8.1
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
        const box = q('.asks'), tabs = (m.tabs || []).filter((e) => !e.deck);
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
        const waitReq = (m.tabs || []).filter((e) => !e.deck && e.on !== false && e.state === 'red' && (e.reqKey || e.folder)).length;
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
      return { el: fx, fit, setTheme, setZoom, paint, tick, setHtml, clearHtml, flash, setReading, follow, showPage, scale: () => (fx.getBoundingClientRect().width / 1920) || 1 };
    }

    // Rajdhani, Barlow and Share Tech Mono for the dark look. Claude's page blocks outside font
    // links, so the files come in through Tampermonkey and load as fonts in memory. Without them
    // the Mac's DIN Alternate and Avenir Next stand in.
    function smFonts(onload) {
      if (typeof GM_xmlhttpRequest !== 'function' || typeof FontFace !== 'function') return;
      const url = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Exo+2:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&family=Barlow:wght@400;500;600&family=Share+Tech+Mono&family=Shippori+Mincho:wght@500;600;700&family=EB+Garamond:wght@400;500&family=JetBrains+Mono:wght@400;700&display=swap';   // 8.1: plus the living set faces for ANDRÉ MANDEL cards
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
    const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
    let zoom = 1;
    try { zoom = +localStorage.getItem('chf_mirror_zoom2') || 1; } catch (e) {}
    let themeId = 'dark';
    try { themeId = localStorage.getItem('chf_mirror_theme') === 'light' ? 'light' : 'dark'; } catch (e) {}

    const css = document.createElement('style');
    css.textContent = '#chf-mirror{position:fixed;inset:0;z-index:2147483000;overflow:hidden}\n' + smCss();
    const root = document.createElement('div');
    root.id = 'chf-mirror';
    const scr = smMake(root, act);
    scr.setZoom(zoom);

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
      return { tabs: list, floorId: floorId || (f && f.id) || '', floor: floorP, quiet: lsGet('chf_sb_quiet', {}), ctl: ctlModel(), deck: deckModel(), links: linkList() };
    }
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
      const s = scr.scale(), left = Math.round(window.screenX + 800 * s), top = Math.round(window.screenY);
      const width = Math.max(480, Math.round(window.outerWidth - 800 * s)), height = Math.max(400, Math.round(window.outerHeight));
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
      else if (m.t === 'follow') scr.follow();
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
      else if (m.t === 'delivered' && m.to === 'mirror') gotDelivered(m);   // 8.7
    };
    // another tab changed a setting, the hold, or quiet mode
    window.addEventListener('storage', (e) => { if (/^chf_(config_v1|hold|sb_quiet)$/.test(e.key || '')) scr.paint(model()); });

    // 7.8: the mirror's buttons send the same signals as your voice commands
    function jump(id) {
      if (id === '__deck') { deckOpen(); return; }   // 8.1
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
      dkManual = true;
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
    // 8.1: the pie's center. A click pauses or plays everything; a long press is meeting mode
    function setHoldFrom(on, meeting) {
      try { localStorage.setItem('chf_hold', JSON.stringify({ on, meeting: !!(on && meeting), ts: Date.now() })); } catch (x) {}
      send({ t: 'hold', on, meeting: !!(on && meeting) });
      scr.paint(model());
      scr.flash(!on ? 'Playing. Everything is back on' : meeting ? 'Meeting mode. Nothing talks, replies land here as text' : 'Paused. Nothing reads, talks or opens the mic');
    }
    function act(a) {
      if (a.t === 'center') setHoldFrom(!ctlModel().held, false);
      else if (a.t === 'meeting') { const c = ctlModel(); setHoldFrom(!(c.held && c.meeting), true); }
      else if (a.t === 'appr') approveFrom(a.k, a.id);
      else if (a.t === 'pick') pickFrom(a.key, a.n);
      else if (a.t === 'deck') deckCmd(a.cmd, a.deck);
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
      else if (a.t === 'theme') flipTheme();
      else if (a.t === 'ctl') toggleCtl(a.k);   // 8.0
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
        cx.ovt.textContent = id === '__deck' ? 'Swipe Deck does not take files' : to ? 'Drop to send to ' + cName(to) : 'Drop on a chat';
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
        if (id && id !== '__deck') cTo = id === floorId ? '' : id;
        deliver(id || cTarget(), fs, '', false);
      }, true);
      setInterval(paintCmp, 1000);
      paintCmp();
    }

    function flipTheme() {
      themeId = themeId === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('chf_mirror_theme', themeId); } catch (x) {}
      applyTheme();
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
        GM_registerMenuCommand('Screen mode light or dark', flipTheme);
      }
    } catch (e) {}

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
    const LEVEL = [1.35, 1.04, 1.48, 0.84, 0.75, 0.99, 3.13, 3.76, 1.6, 1.45, 1.62, 1.01, 0.8, 1.49, 0.98, 2.34, 0.93, 2.09, 1.72, 1.53];
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
        play: (c, o, t) => [1300, 1650, 2050].forEach((f, i) => tone(c, o, t + i * 0.055, f, i === 2 ? 0.1 : 0.045, { v: 0.35, a: 0.002 })) }
    ];
    // play(ctx, out, t) goes through a level stage so every cue matches
    return cues.map((c, i) => Object.assign({}, c, {
      play: (ctx, out, t) => { const g = ctx.createGain(); g.gain.value = LEVEL[i]; g.connect(out); c.play(ctx, g, t); }
    }));
  }
  const CUES = chfCues();
  const CUE_VOLS = [0.5, 0.7, 1, 1.4, 2];
  const cueNum = () => (Number.isInteger(cfg.micSound) && cfg.micSound >= 1 && cfg.micSound <= CUES.length ? cfg.micSound : 2);
  const cueVol = () => (CUE_VOLS.includes(cfg.cueVol) ? cfg.cueVol : 1);
  function playCue(n) {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume().catch(() => {});
      const g = actx.createGain();
      g.gain.value = cueVol();
      g.connect(actx.destination);
      CUES[(n || cueNum()) - 1].play(actx, g, actx.currentTime + 0.03);
    } catch (e) {}
  }
  // 2.9: the cue to start talking. 7.0: your pick of twenty
  function blip() { playCue(); }
  function setCue(n) {
    n = ((n - 1 + CUES.length) % CUES.length) + 1;
    cfg.micSound = n; save(cfg);
    playCue(n);
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
  const armedHere = () => (navigator.userActivation ? navigator.userActivation.hasBeenActive : touched);

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
      case 'hello': publish(true); deckRelay(); linksPush(true); break;
      case 'mirror-hello': mirrorPush(true); linksPush(true); break;
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
      case 'cfg': reloadCfg(); break;          // 8.0: screen mode changed a setting
      case 'front': if (m.to === ME) bringToFront(); break;
      case 'deliver': if (m.to === ME) deliverHere(m); break;   // 8.7
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
      if (m.why !== 'touch' && m.why !== 'elect') announceArrival();
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
  const elVoice = () => String(gmGet('chf_el_voice', '') || '').trim() || EL_DEFAULT_VOICE;
  let elDownUntil = 0, elWarned = false;
  // 6.6: reading speed for the ElevenLabs voice, as a playback rate (pitch stays put)
  const SPEEDS = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
  const voiceSpeed = () => (SPEEDS.includes(cfg.elSpeed) ? cfg.elSpeed : 1.2);
  function rateOn(a) { try { a.preservesPitch = true; a.playbackRate = voiceSpeed(); } catch (e) {} return a; }
  function stepSpeed(dir) {
    const i = SPEEDS.indexOf(voiceSpeed());
    const j = dir === 0 ? SPEEDS.indexOf(1.2) : Math.max(0, Math.min(SPEEDS.length - 1, i + dir));
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
  function elRequest(text, voice, key, stamps) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voice) + (stamps ? '/with-timestamps' : '') + '?output_format=mp3_44100_64',
        headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: stamps ? 'application/json' : 'audio/mpeg' },
        data: JSON.stringify({ text, model_id: 'eleven_flash_v2_5' }),
        responseType: stamps ? 'json' : 'blob', timeout: 25000,
        onload: (r) => {
          if (!(r.status >= 200 && r.status < 300 && r.response)) return reject({ status: r.status });
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
  async function elFetch(text, stamps) {
    const key = elKey(), voice = elVoice();
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
        if (!elWarned) { elWarned = true; toast("That ElevenLabs voice isn't in your voices yet, so Jessica is reading"); }
        return go(EL_BUILTIN_VOICE);
      }
      throw e;
    }
  }
  function elFailed(e) {
    const st = (e && e.status) || 0;
    elDownUntil = Date.now() + (st === 401 || st === 402 || st === 429 ? 10 * 60000 : 60000);
    toast(st === 401 ? 'ElevenLabs turned down the API key. Set it again in the Tampermonkey menu.'
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
      GM_registerMenuCommand('ElevenLabs: choose voice by ID', () => {
        const v = window.prompt('Paste an ElevenLabs voice ID. Leave empty for Annika.', gmGet('chf_el_voice', '') || '');
        if (v === null) return;
        try { GM_setValue('chf_el_voice', v.trim()); } catch (e) {}
        elWarned = false;
        toast(v.trim() ? 'ElevenLabs voice set' : 'ElevenLabs voice back to Annika');
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
  function parseCommand(raw) {
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
    if (/^(next|next chat|next one|next please)$/.test(flat)) return { kind: 'next' };
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
    if (/^(?:follow|follow along|follow me|follow the voice|follow the reading|follow it|follow again|keep up)$/.test(flat)) return { kind: 'follow' };   // 8.1
    if (/^(status|status check|what's the status|whats the status|board|switchboard|switcheroo)$/.test(flat)) return { kind: 'status' };
    // 8.3: videos pause while we talk, or turn down instead
    if (/^(?:(?:please )?pause (?:the |my )?(?:videos?|youtube|music)(?: (?:mode|instead|when (?:we|i) talk|while (?:we|i) talk))?|(?:videos?|youtube) (?:pause|pauses|pause mode|pause instead)|pause mode)(?: please)?$/.test(flat)) return { kind: 'duckMode', m: 'pause' };
    if (/^(?:(?:please )?(?:turn|lower|duck) (?:the |my )?(?:videos?|youtube|music) down(?: instead)?|(?:lower|duck) (?:the |my )?(?:videos?|youtube|music)(?: instead)?|(?:videos?|youtube) (?:down|lower|duck)(?: instead)?|(?:don't|dont|do not) pause (?:the )?(?:videos?|youtube|music))(?: please)?$/.test(flat)) return { kind: 'duckMode', m: 'lower' };
    // 8.0: HOLD everything, and resume
    if (HOLD_SAID.test(flat)) return { kind: 'hold', meeting: /meeting/.test(flat) };
    if (UNHOLD_SAID.test(flat) || (held && /^(wake up|wake|i'm back|im back|resume switchboard|switchboard back on|switchboard on|resume switcheroo|switcheroo back on|switcheroo on)$/.test(flat))) return { kind: 'unhold' };
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
    const bag = micSoundBag(flat);
    if (bag) return bag;
    // 7.0.1: dictation hears sound as bound, found, round or sounds
    const SND = "(?:sounds?|bound|found|round|sound's)";
    let m = flat.match(new RegExp("^(?:try |use |play |pick |set )?(?:the )?(?:(?:mic|mike|mike's|my|microphone|beep) )?" + SND + "(?: number)? (.+)$"));
    if (m) {
      const n = toNum(m[1]);
      // "round 3" or "found 7" alone could be anything; they count only after mic, try, use and the like
      const loose = !/^(?:try |use |play |pick |set |the |mic |mike |mike's |my |microphone |beep )/.test(flat) && !/^sounds? /.test(flat);
      if (isFinite(n) && n >= 1 && n <= 20 && !loose) return { kind: 'cue', n };
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
    if (isFinite(n) && n >= 1 && n <= 20) return { kind: 'cue', n };
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
      /^(?:(?:uh+|um+|hmm+|okay|ok|so|and|then|next|alright|all right|right|yeah|yes|well|now)\s*)+$/.test(w);
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
    if ((c.kind === 'allow' || c.kind === 'deny' || c.kind === 'allowApp' || c.kind === 'needApp') && c.here && !voiceApproval()) {
      approval = { id: ME, key: sb.reqKey || '', folder: sb.folder || '', comp: sb.comp || null, name: shortName(chatTitle()), until: 0, voiceUntil: Date.now() + 5000 };
    }
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
    if (c.kind === 'deck') {   // 7.9 (8.1: a deck already open in another tab is used, not opened twice)
      if (DK.present) return deckStart('voice');
      const other = [...deckTabs].filter(([id, at]) => Date.now() - at < 15000).sort((a, b) => b[1] - a[1])[0];
      if (other) { post({ t: 'deck-start', to: other[0] }); return say('Swipe Deck.'); }
      return openDeck();
    }
    if (c.kind === 'update') return checkUpdate(true);   // 8.1.1
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
  async function newChat(spoken, sent) {
    let target = null, label = 'New chat';
    if (spoken) {
      const p = matchProject(spoken);
      if (!p) { await say("I don't see a project called " + spoken + '. It needs to be in the sidebar.'); return; }
      target = p.el; label = 'New chat in ' + shortName(p.name);
    } else {
      target = [...document.querySelectorAll('a[href="/new"], a[href$="/new"]')].find((a) => !ours(a)) || null;
    }
    const oldPath = location.pathname;
    if (sent) { for (let i = 0; i < 20 && !isWorking(); i++) await sleep(250); }   // let the message land
    const keep = /^\/chat\//.test(oldPath) && (sent || isWorking());
    if (keep && typeof GM_openInTab === 'function') {
      try { GM_openInTab(location.origin + oldPath, { active: false, insert: true, setParent: true }); } catch (e) {}
    }
    if (!target) { location.assign('/new'); return; }
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
      const saidFlat = said ? said.toLowerCase().replace(/[.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim() : '';
      if (saidFlat && ABORT_SAID.test(saidFlat)) {   // 8.5: drop this reading, keep earlier notes
        await trimTail(boxBefore);
        abortReading('said ' + saidFlat);
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
  const ABORT_SAID = /^(?:uh |um |okay |ok |no |nah )?(?:abort|abort it|abort that|abort reading|stop|stop it|stop that|stop reading|stop talking|stop please|please stop|shut up|shut it|shut it down|cancel|cancel it|cancel that|skip|skip it|skip that|skip this|enough|that's enough|thats enough|okay enough|never mind|nevermind|forget it|kill it|drop it|be quiet|quiet|irrelevant|not relevant|no longer relevant)(?: please| now| thanks| thank you)?$/;
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
  const heardBefore = (h) => !!h && readHeads.includes(h);
  const markHeard = (h) => { if (!h || readHeads.includes(h)) return; readHeads.push(h); if (readHeads.length > 40) readHeads.shift(); };
  const claudeIsReading = () => buttons('pause').length > 0 || buttons('resume').length > 0;
  const markAll = () => {
    const b = last(buttons('speak')); lastKey = b ? replyKey(b) : '';
    dlog('page (re)loaded, current reply marked as heard');
    const lm = last([...document.querySelectorAll('[data-testid="assistant-message"]')]);
    if (lm) { readEls.add(lm); markHeard(headOf(lm)); }   // 5.6: the reply already on screen is never auto read
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
      markHeard(head);
      if (held) { dlog('new reply, on hold, not read', head.slice(0, 50)); return; }   // 8.0
      if (!ownsFloor()) dlog('new reply, not the floor, chime only', head.slice(0, 50));
      if (ownsFloor()) {                           // other tabs chime on the switchboard instead
        dlog('auto read', (msg.innerText || '').trim().slice(18, 70));
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
    if (!silent || tabOff || !isFloor() || Date.now() - reclaimedAt < 2000) return;
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
  function armAirPods() {
    if (tabOff || !isFloor() || !('mediaSession' in navigator)) return;
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
      // 7.9: in a Swipe Deck tab one squeeze reads the card (or starts), two squeezes stop the deck
      if (DK.on || (DK.present && !composer())) {
        if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; deckStop(false); return; }
        tapTimer = setTimeout(() => { tapTimer = null; deckSqueeze(); }, 450);
        return;
      }
      if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; toggleAutoListen(); return; }
      tapTimer = setTimeout(() => { tapTimer = null; toggleDictation(); }, 450);
    };
    ['play', 'pause', 'stop'].forEach((a) => {
      try { navigator.mediaSession.setActionHandler(a, squeeze); } catch (e) {}
    });
    // double squeeze = next track, triple = previous track. Either one flips your turn mode.
    ['nexttrack', 'previoustrack', 'seekforward', 'seekbackward'].forEach((a) => {
      try { navigator.mediaSession.setActionHandler(a, toggleAutoListen); } catch (e) {}
    });
    navigator.mediaSession.playbackState = 'playing';
  }
  // let go of the AirPods and F8 so the floor tab can have them
  function releaseAirPods() {
    dropMic();
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
    'Double F8 or double squeeze: your turn mode (Option Shift L)',
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
