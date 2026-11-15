# RUNBOOK: make and upload the next Ramayan part (daily run)

Goal: one finished vertical Short (~30-35 s, Hindi narration, Paper Atlas paper-cut look) uploaded PUBLIC to the YouTube channel
"Ramayan 3D". The user wants a fully automatic daily run. Never ask questions; if something cannot be fixed, STOP before uploading and
tell the user (SendUserMessage) what failed. Never upload a video you did not look at.

Fixed values
- Repo: N8219717230/reel-temp-host, long-lived branch `automation` (this folder). `main` is the user's old temp host: do not touch it except as the Zapier branch source.
- Zapier YouTube connection for the new channel: connection_id `021d3a74-6d92-862d-95e6-b9bfd9c0997e` (channel must be titled "Ramayan 3D", id UCpxJZ9jUoN1ypFfc0qUWXAg). Pass it on every YouTube call.
- ElevenLabs voice (through Zapier, standard voice): `JBFqnCBsd6RMkjVDRZzb` (George), model `eleven_multilingual_v2`. The user's own "AJ - Hindi" voice does NOT work through the API.
- Zapier tools are MCP tools (mcp__Zapier__*); load their schemas with ToolSearch first. The Zapier GitHub custom action is `code_action_githubcliapi__commit_binary_from_url` (selected_api `GitHubCLIAPI`, via execute_zapier_write_action). Do not use the plain GitHub create_file action for audio: it corrupts binary files.
- The workspace cannot download from ElevenLabs/S3/Google, only from GitHub (git, raw.githubusercontent.com). That is why audio is relayed through a GitHub branch.

## Steps

1. **Get the repo.** `add_repo` N8219717230/reel-temp-host with access "push", then
   `git clone --depth 1 -b automation https://github.com/N8219717230/reel-temp-host /home/claude/reel-temp-host` (one clone, long timeout). Read `automation/STATE.json`:
   - `next_part` = N. If N > total_parts: send the user "The Ramayan series is complete" and stop.
   - If STATE already lists part N as uploaded, increment and re-read (idempotent).
   Read `automation/PARTS.md` (outline for part N and the character colours) and `automation/examples/` (Part 1 script + shots as the model).
2. **Check tools.** `node -v` (>=22), `ffmpeg -version`, `/usr/bin/google-chrome` present, `python3 -c "import numpy, scipy"` (pip install --break-system-packages numpy scipy if missing).
3. **New project.** `cp -r automation/template ~/faceless-shorts/ramayan-NN` and work only inside it.
4. **Research + script.** WebSearch/WebFetch the part's events in Valmiki Ramayana (Gita Press / reputable summaries) and Britannica; keep only facts the sources agree on; list them in script.json "sources". Write `script.json` like `examples/script.part1.json`:
   - Hindi (Devanagari), conversational storyteller voice, ~60-75 words, 8-11 lines (a line = one picture cut; split sentences at commas into 1-2 lines).
   - Every line has `caps`: 1-3 word caption chunks separated by `|`, exactly one `*crimson` word per chunk; chunk first words must be the exact words said.
   - Start with a hook line that recalls the previous part in a few words, end with the teaser «अगले भाग में।» (or the closing line for Part 15).
   - Sentences end with «।» (or ? !). Use the same names/spellings as earlier parts (राम, लक्ष्मण, भरत, शत्रुघ्न, दशरथ, विश्वामित्र, सीता, हनुमान, रावण...).
   - No violence on screen, respectful tone, no invented quotes.
   - Set `"voice": "elevenlabs"`, `"music": "bed"`, `"lead": 0.4`, `"outro": 1.2`.
5. **Voice (ElevenLabs via Zapier).** Build the narration text = all line texts joined with spaces inside a sentence, and `<break time="0.8s" />` after every sentence except the last (this makes sentence boundaries clearly the longest pauses).
   `execute_zapier_write_action` selected_api `App226160CLIAPI`, action `text_to_speech`, tool_name `elevenlabs_convert_text_to_speech`, params {text, voice_id "JBFqnCBsd6RMkjVDRZzb", model_id "eleven_multilingual_v2"}. The result has `audio_url`.
6. **Relay the audio into the workspace.**
   a. Zapier GitHubCLIAPI action `create_branch` {repo "N8219717230/reel-temp-host", branch_name "audio-ramayan-NN", ref "main"}.
   b. Zapier `code_action_githubcliapi__commit_binary_from_url` {repo, path "audio/partNN.mp3", branch "audio-ramayan-NN", message "audio part NN", file_url audio_url}. Check github_file_size_bytes == downloaded_bytes.
   c. `git fetch --depth=1 origin audio-ramayan-NN && git show FETCH_HEAD:audio/partNN.mp3 > ~/faceless-shorts/ramayan-NN/raw.mp3` then `ffprobe` it: it must be a valid mp3 of 22-40 s. If longer than 40 s, shorten the script and redo steps 5-6 once.
7. **Timing.** `python3 tools/align_hindi.py . raw.mp3` (inside the project). Read its output: boundaries must follow the script. If it prints a WARNING, look at that part of the contact sheet very carefully.
8. **Shots.** Rewrite `src/shots.js`: one shot per line, each started with `cutAt(i)`, key moments on words with `Wd('word', line)` (the word must appear in that line; Hindi words match by prefix). Import shared shapes from `./shapes.js` (nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, pop) and ADD new reusable shapes there (export them). Look at `examples/shots.part1.js`. Rules (Paper Atlas): everything is cut paper (`K.cut`), crimson only for routes/targets/fire/key word, gold only for crowns/dates/seals, maps first (where) then who then what, a gold ribbon opens a new place/era, night = parchment under a navy wash. Keep anything important above y=1450 (the caption strip sits at y 1570-1710). Hindi text goes through the kit's slip/ribbon/label (font stack already has Devanagari). One crimson route/arrow at most per shot. Add sound cues (whoosh at each cut, pop on slips, thud on seals).
9. **Check + QA (mandatory).**
   `node tools/capture.mjs check` must print CHECK OK; `node tools/capture.mjs cues`; `python3 tools/mix.py .`;
   `node tools/capture.mjs sheet review/all.jpg 1 8` and READ the image: for every frame ask: does the picture match the line being said, are captions spelled right with one crimson word, is anything overlapping or cut off, is the caption zone clear, are people/props consistent with earlier parts. Look at suspicious frames full size (`capture.mjs frames review/f "t1,t2"`). Fix and re-check (max 3 rounds). If still wrong: stop and notify, do not upload.
10. **Render.** `node tools/capture.mjs video renders/ramayan-partNN.mp4`; ffprobe must show h264 1080x1920, 22-45 s, with audio.
11. **Upload (public).**
    a. Verify the channel: Zapier YouTube `execute_zapier_read_action` selected_api YouTubeV4CLIAPI, action `_zap_raw_request`, tool_name `youtube_make_api_get_request`, connection_id 021d3a74-6d92-862d-95e6-b9bfd9c0997e, params {url "https://www.googleapis.com/youtube/v3/channels", method "GET", fail_on_errors "true", querystring {part "snippet", mine "true"}} (the query must go in `querystring`, not the URL); title must be "Ramayan 3D". Otherwise stop and notify.
    b. Host the MP4 on GitHub: in the repo clone use a throwaway dir: `mkdir /tmp/vid/video; cp mp4 there; git init -b video-ramayan-NN; git remote add origin <repo url>; commit; git push origin video-ramayan-NN` (keeps the automation files out of the video branch). URL: https://raw.githubusercontent.com/N8219717230/reel-temp-host/video-ramayan-NN/video/ramayan-partNN.mp4 ; `curl -sSI` must return 200.
    c. Zapier YouTube `upload_video` (tool_name youtube_upload_video, connection_id above): video = that URL; title "रामायण भाग N | <short Hindi subtitle> | Ramayan Part N #shorts"; description = 1-2 Hindi lines about the part + a teaser for the next part + `#shorts #ramayan #ramayana #ram #hindi #bharat #mythology`; tags [ramayan, ramayana, ram, hindi, bharat, mythology, shorts]; category_id "27"; privacy_status "public"; embeddable true; notify_subscribers false; license "youtube"; default_language "hi". Do not set made_for_kids.
    d. The result has `id`: the link is https://www.youtube.com/watch?v=<id>.
12. **Clean up and save state.** Zapier GitHub `delete_branch` {repo "N8219717230/reel-temp-host", branch_name "audio-ramayan-NN"} and again for "video-ramayan-NN" (git cannot delete branches here). In the repo clone: `git checkout automation`; save `automation/parts/NN/{script.json,shots.js}`, copy any new `src/shapes.js` into `automation/template/src/shapes.js`, update STATE.json (next_part = N+1, append {part, video_id, title, privacy: "public"}), commit "part N uploaded", `git push origin automation`.
13. **Report.** SendUserMessage: "Part N is live: <link>" plus one line on anything unusual (voice sync warning, shortened script). Keep it short.

If any Zapier tool is missing or a connection is expired, stop and tell the user exactly which connection to reconnect (YouTube: https://mcp.zapier.com/api/v1/connect-auth/YouTubeV4CLIAPI?accountId=29269330 ; ElevenLabs: .../App226160CLIAPI?accountId=29269330 ; GitHub: .../GitHubCLIAPI?accountId=29269330).


Note (Part 2 lessons): scripts of ~85-90 Hindi words give a ~35 s short, which is fine. Keep the previous part's reusable shapes (boulder, hut, forest, sparkles added in Part 2). Shot 2 style: keep travellers away from the palace so they do not overlap.
