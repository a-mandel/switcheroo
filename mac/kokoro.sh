#!/bin/bash
# Kokoro for Switcheroo: a free voice engine that runs on this Mac (Apple silicon GPU), so replies and
# Switchboard lines speak without ElevenLabs credits. Starts at every login and stays up. Safe to run again.
#   curl -fsSL https://raw.githubusercontent.com/a-mandel/switcheroo/main/mac/kokoro.sh | bash
# Undo: launchctl bootout gui/$(id -u)/com.switcheroo.kokoro; rm -rf ~/.switcheroo/Kokoro-FastAPI ~/Library/LaunchAgents/com.switcheroo.kokoro.plist
set -e
DIR="$HOME/.switcheroo/Kokoro-FastAPI"
LABEL="com.switcheroo.kokoro"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/switcheroo-kokoro.log"
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

say_step() { printf '\n== %s\n' "$1"; }

say_step "uv (the Python installer Kokoro uses)"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi
uv --version

if command -v brew >/dev/null 2>&1 && ! command -v espeak-ng >/dev/null 2>&1; then
  say_step "espeak-ng (helps Kokoro say unusual words)"
  brew install espeak-ng || true
fi

say_step "Kokoro-FastAPI"
mkdir -p "$HOME/.switcheroo"
if [ -d "$DIR/.git" ]; then git -C "$DIR" pull --ff-only || true
else git clone --depth 1 https://github.com/remsky/Kokoro-FastAPI.git "$DIR"; fi
cd "$DIR"

say_step "Python packages (a few minutes the first time)"
[ -d .venv ] || uv venv --python 3.12
uv pip install -e ".[cpu]"

say_step "Voice model"
PYTHONPATH="$DIR:$DIR/api" uv run --no-sync python docker/scripts/download_model.py --output api/src/models/v1_0

say_step "Start at login"
cat > "$HOME/.switcheroo/kokoro-run.sh" <<EOF
#!/bin/bash
cd "$DIR"
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:\$PATH"
export USE_GPU=true DEVICE_TYPE=mps PYTORCH_ENABLE_MPS_FALLBACK=1
export PYTHONPATH="$DIR:$DIR/api" MODEL_DIR=src/models VOICES_DIR=src/voices/v1_0 WEB_PLAYER_PATH="$DIR/web"
exec uv run --no-sync uvicorn api.src.main:app --host 127.0.0.1 --port 8880
EOF
chmod +x "$HOME/.switcheroo/kokoro-run.sh"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>$HOME/.switcheroo/kokoro-run.sh</string></array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict></plist>
EOF
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"

say_step "Waiting for Kokoro to answer"
for i in $(seq 1 90); do
  if curl -fsS http://127.0.0.1:8880/v1/audio/voices >/dev/null 2>&1; then
    curl -fsS -X POST http://127.0.0.1:8880/v1/audio/speech -H 'Content-Type: application/json' \
      -d '{"model":"kokoro","input":"Kokoro is ready, handsome.","voice":"af_heart","response_format":"mp3"}' \
      -o /tmp/kokoro-test.mp3 && afplay /tmp/kokoro-test.mp3 || true
    echo "Kokoro is running on this Mac. In Chrome, say update Switcheroo and reload your chats."
    echo "Pick a voice from the Tampermonkey menu: Kokoro: pick a voice."
    exit 0
  fi
  sleep 2
done
echo "Kokoro didn't answer yet. The log is at $LOG"
exit 1
