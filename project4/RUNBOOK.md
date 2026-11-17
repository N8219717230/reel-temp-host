# Project 4 - daily history documentary -> YouTube (channel "Info" @traveldina: Zapier connection "YouTube #5")

Each run makes ONE ~60 s 16:9 documentary (animated map + free local narration + synthesized music + subtitles) and uploads it PUBLIC.
Everything below runs in the cloud workspace; nothing needs the user's computer.

## Steps
1. Repo: add `N8219717230/reel-temp-host` with push access (add_repo), `git clone --depth 1` it to /home/claude/reel-temp-host (long timeout), register_repo_root.
2. Topic: first line in `project4/topics.md` that is NOT in `project4/topics-used.md`. If the list is empty, invent 30 more history topics (event + place) and append them.
3. Research: 3+ WebSearch calls. Every number/date must be backed by a source. If sources conflict, say "traditionally" / "about". Never invent facts.
4. Write /home/claude/p4/story.json (schema below). 8-11 sentences, 120-150 spoken words total (about 60 s). Spell numbers/years out in `text` (TTS), put digits in `display` (subtitles).
5. `pip install --break-system-packages -q kokoro-onnx soundfile` then run in background:
   `nohup python3 project4/pkg/build_video.py /home/claude/p4/run story.json > build.log 2>&1 &`
   (needs ~120 MB model + 2 GeoJSON downloads from GitHub, all allowed; a render takes 10-20 min: poll with `sleep 500; tail -2 build.log` in the foreground).
6. QA (never skip): ffprobe duration/streams, mean volume (about -15 dB), and LOOK at 8+ frames (`ffmpeg -ss T -i video.mp4 -frames:v 1`): pins inside the picture, no text overlapping, subtitles readable, geography matches the sentence. Fix story.json and rebuild if wrong (maps and models are cached in the run dir).
7. Host: copy to `project4/videos/<date>.mp4`, commit, push, URL `https://raw.githubusercontent.com/N8219717230/reel-temp-host/main/project4/videos/<date>.mp4`; `curl -sSI` must return 200 with a video type.
8. Upload with the Zapier YouTube "upload_video" action, connection_id `027e380e-9f8c-8f74-9dfb-f8c69ab8dcfb` (YouTube #5, channel Info): params video=<raw url>, title, description (2-3 sentences + "Sources:" with the URLs used), tags (5-8), category_id "27", privacy_status "public", made_for_kids false, embeddable true, notify_subscribers true, default_language "en", license "youtube". Inspect the action schema first (inspect_zapier_actions) because parameter names can change.
9. Cleanup: `git rm` the video, append the topic to `project4/topics-used.md` as `- <topic> (used <date>, https://youtube.com/watch?v=<id>)`, commit, push.
10. Report: title, YouTube link, one line on anything that looked off.

## story.json schema
{"title": "...", "voice": "am_michael", "speed": 0.95, "sentences": [
 {"text": "spoken text, numbers spelled out", "display": "subtitle text (optional)",
  "shot": {"cam": [lon, lat, width_deg], "cam_end": [lon, lat, width_deg],
           "title": "UPPERCASE LABEL  ·  DATE" (optional),
           "pins": [{"name": "PLACE", "lon": 0, "lat": 0, "sub": "COUNTRY"}],
           "lines": [{"from": [lon, lat], "to": [lon, lat]}],
           "glows": [{"lon": 0, "lat": 0, "r_deg": 20, "color": [r,g,b 0-1], "label": "TEXT", "at": 0.6, "alpha": 0.5}]}}]}
- width_deg is the visible longitude span (30 = a country region, 140 = a continent, 330 = whole world). Frame is 16:9, so height = width * 0.5625.
- Keep pins in the middle 70% of the frame and 3+ degrees apart at the shown zoom, otherwise labels collide.
- One shot per sentence; the first sentence gets the intro fade, the last fades out.
- Optional real photos: put `<name>.jpg` in run/img and add `"img": "<name>", "rib": ["TITLE", "subtitle"]` to the shot (only with files whose licence you can credit in the description; the cloud cannot download Wikimedia, so normally use maps).

## Rules
Original script only. Accurate and neutral. No graphic violence. Public upload is what the owner chose; stop and report if the upload fails twice, do not retry in a loop.
