# LANGUAGE: ENGLISH (since 2026-11-19, owner request; supersedes the earlier Hindi switch because ElevenLabs credits ran out). Every video is English: Kokoro local narration (voice am_michael, speed 0.95), English subtitles/labels, English YouTube title/description, default_language "en". Do NOT use ElevenLabs. Follow the English steps below.

# Project 4 - daily history documentary -> YouTube (channel "Info" @traveldina: Zapier connection "YouTube #5")

Each run makes ONE ~60 s 16:9 documentary (animated map + free local narration + synthesized music + subtitles) and uploads it PUBLIC.
Everything below runs in the cloud workspace; nothing needs the user's computer.

## Steps
1. Repo: add `N8219717230/reel-temp-host` with push access (add_repo), `git clone --depth 1` it to /home/claude/reel-temp-host (long timeout), register_repo_root.
2. Topic: first line in `project4/topics.md` that is NOT in `project4/topics-used.md`. If the list is empty, invent 30 more history topics (event + place) and append them.
3. Research: 3+ WebSearch calls. Every number/date must be backed by a source. If sources conflict, say "traditionally" / "about". Never invent facts.
4. Write /home/claude/p4/story.json (schema below). 8-11 sentences, 120-150 spoken words total (about 60 s). Spell numbers/years out in `text` (TTS), put digits in `display` (subtitles).
4b. PHOTOS (required, at least 3 photos per video, mixed with the map shots; photos for people/places/objects, maps for geography and routes).
   The cloud cannot reach photo sites, so a GitHub Action (.github/workflows/project4-photos.yml) fetches them from Wikimedia Commons:
   - write `project4/requests/<date>/queries.json`: {"per": 4, "queries": [{"id": "samarkand", "q": "Samarkand Registan"}, ...]} (4-8 specific queries, one per planned photo shot), commit, push.
   - wait ~60-90 s, then `git pull --rebase --depth 1 origin HEAD`; photos appear in `project4/photos/<date>/<id>_<n>.jpg` with `meta.json` (license, artist, page URL). Only PD, CC0, CC BY and CC BY-SA are kept.
   - build a contact sheet and LOOK at the candidates; choose only photos that truly show what the sentence says (right place/period/object; no modern clutter; no recognisable private people). If none fit, change the query and push again (max 2 retries), else use a map shot instead.
   - copy the chosen files to `/home/claude/p4/run/img/<name>.jpg` and add to that sentence's shot: `"shot": {"img": "<name>", "rib": ["TITLE", "SUBTITLE"]}` (caps, short). Portrait photos are auto-framed.
   - the upload description MUST end with a "Photo credits:" list: `"<Title>" by <Artist> (<License>) <page URL>` for every CC BY / CC BY-SA photo (PD/CC0 optional).
5. `pip install --break-system-packages -q kokoro-onnx soundfile` then run in background:
   `nohup python3 project4/pkg/build_video.py /home/claude/p4/run story.json > build.log 2>&1 &`
   (needs ~120 MB model + 2 GeoJSON downloads from GitHub, all allowed; a render takes 10-20 min: poll with `sleep 500; tail -2 build.log` in the foreground).
6. QA (never skip): ffprobe duration/streams, mean volume (about -15 dB), and LOOK at 8+ frames (`ffmpeg -ss T -i video.mp4 -frames:v 1`): pins inside the picture, no text overlapping, subtitles readable, geography matches the sentence. Fix story.json and rebuild if wrong (maps and models are cached in the run dir).
7. Host: copy to `project4/videos/<date>.mp4`, commit, push, URL `https://raw.githubusercontent.com/N8219717230/reel-temp-host/main/project4/videos/<date>.mp4`; `curl -sSI` must return 200 with a video type.
8. Upload with the Zapier YouTube "upload_video" action, connection_id `027e380e-9f8c-8f74-9dfb-f8c69ab8dcfb` (YouTube #5, channel Info): params video=<raw url>, title, description (2-3 sentences + "Sources:" with the URLs used), tags (5-8), category_id "27", privacy_status "public", made_for_kids false, embeddable true, notify_subscribers true, default_language "en" (Hindi: "hi"), license "youtube". Inspect the action schema first (inspect_zapier_actions) because parameter names can change.
8b. COVER: `python3 project4/pkg/make_cover.py <best photo.jpg> "SHORT TITLE IN CAPS" "SUBTITLE IN CAPS" cover.jpg`, LOOK at it (text readable, not cut off), commit it as `project4/videos/<date>-cover.jpg`, push, then run the Zapier YouTube "Update Video Thumbnail" action (tool youtube_update_video_thumbnail, same connection) with video_id=<uploaded id>, thumbnail=<raw url of the cover>. (Do NOT pass the thumbnail inside upload_video: it fails; the channel is phone-verified so the separate action works.)
9. Cleanup (also delete the cover from the repo): `git rm -r` the video, `project4/photos/<date>` and `project4/requests/<date>`, append the topic to `project4/topics-used.md` as `- <topic> (used <date>, https://youtube.com/watch?v=<id>)`, commit, push.
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
- Photo shot: `"shot": {"img": "name", "rib": ["TITLE", "subtitle"]}` (file run/img/name.jpg, see step 4b). Keep map shots for the title, routes and geography.

## Rules
Original script only. Accurate and neutral. No graphic violence. Public upload is what the owner chose; stop and report if the upload fails twice, do not retry in a loop.
