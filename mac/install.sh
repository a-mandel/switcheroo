#!/bin/bash
# Switcheroo Chrome: one click in the Dock (and every login) opens Chrome ready for Switcheroo
# and boots HQ with your 10 most recent Claude chats behind it. Safe to run again.
#   curl -fsSL https://raw.githubusercontent.com/a-mandel/switcheroo/main/mac/install.sh | bash
APP="$HOME/Applications/Switcheroo Chrome.app"
RAW="https://raw.githubusercontent.com/a-mandel/switcheroo/main"
TMP="$(mktemp -d)"
mkdir -p "$HOME/Applications"

cat > "$TMP/launcher.applescript" <<'EOF'
set bootURL to "https://claude.ai/new?switcheroo=boot"
set chromeFlags to "--disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --autoplay-policy=no-user-gesture-required"
set isReady to false
try
	do shell script "pgrep -f 'Google Chrome.app/Contents/MacOS/Google Chrome .*--autoplay-policy=no-user-gesture-required' >/dev/null"
	set isReady to true
end try
if isReady then
	-- Chrome is already running the Switcheroo way: just boot
	do shell script "open -a 'Google Chrome' " & quoted form of bootURL
else
	-- restart Chrome with the Switcheroo settings, then boot
	if application "Google Chrome" is running then
		tell application "Google Chrome" to quit
		repeat 60 times
			delay 0.25
			if application "Google Chrome" is not running then exit repeat
		end repeat
		delay 1
	end if
	do shell script "open -a 'Google Chrome' --args " & chromeFlags & " " & quoted form of bootURL
end if
EOF

if ! osacompile -o "$APP" "$TMP/launcher.applescript"; then
  echo "Couldn't build Switcheroo Chrome. Send Claude a screenshot of this window."; exit 1
fi

# the Switcheroo eye icon
if curl -fsSL "$RAW/mac/switcheroo-eye.png" -o "$TMP/eye.png"; then
  SET="$TMP/eye.iconset"; mkdir -p "$SET"
  for s in 16 32 128 256 512; do
    sips -z $s $s "$TMP/eye.png" --out "$SET/icon_${s}x${s}.png" >/dev/null 2>&1
    sips -z $((s*2)) $((s*2)) "$TMP/eye.png" --out "$SET/icon_${s}x${s}@2x.png" >/dev/null 2>&1
  done
  iconutil -c icns "$SET" -o "$APP/Contents/Resources/applet.icns" >/dev/null 2>&1
fi
codesign --force --deep --sign - "$APP" >/dev/null 2>&1
touch "$APP"

# runs at login
osascript -e 'tell application "System Events" to delete (every login item whose name is "Switcheroo Chrome")' \
          -e "tell application \"System Events\" to make login item at end with properties {path:\"$APP\", hidden:false}" >/dev/null 2>&1 \
  || echo "Note: macOS blocked the login item. Allow Terminal to control System Events, then run this again."

# in the Dock, once
if ! defaults read com.apple.dock persistent-apps 2>/dev/null | grep -q "Switcheroo"; then
  defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$APP</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
fi
killall Dock 2>/dev/null

# Tampermonkey's update page for Switcheroo 8.9, in Chrome
open -a "Google Chrome" "$RAW/switcheroo.user.js" 2>/dev/null

rm -rf "$TMP"
echo ""
echo "Switcheroo Chrome is ready."
echo "1. In Chrome, click Update on the Tampermonkey page."
echo "2. Click Switcheroo Chrome in your Dock."
