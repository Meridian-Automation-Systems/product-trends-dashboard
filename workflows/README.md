# n8n Workflows

Version-controlled exports of the n8n automation workflows used by this project.
Import a file via **n8n → Workflows → Import from File**.

## `viral-video-generator.json`

**Generate AI viral videos with NanoBanana & VEO3, shared on socials via Blotato**

A Telegram-triggered content pipeline:

1. **Collect idea & image** — a Telegram message with a photo + caption triggers the flow; the image is uploaded to Google Drive and logged to a Google Sheet.
2. **Analyze & create image** — GPT-4o Vision describes the reference image, an AI agent writes a UGC image prompt, and **NanoBanana** (fal.ai) generates an edited image.
3. **Generate video script** — an AI agent produces a structured, schema-constrained video prompt.
4. **Generate video** — **VEO3** (kie.ai) renders a video from the image + prompt; GPT-4o rewrites a short caption.
5. **Auto-post** — the video is uploaded to Blotato, then cross-posted to 9 platforms (TikTok, Instagram, YouTube, Facebook, LinkedIn, Twitter/X, Threads, Bluesky, Pinterest); status is written back to the Sheet and a Telegram notification is sent.

### Note: Blotato implemented via HTTP Request

This export uses generic **HTTP Request** nodes to call the Blotato REST API directly
instead of the `@blotato/n8n-nodes-blotato` community node, so it imports without
requiring that community package to be installed.

- Upload media: `POST https://backend.blotato.com/v2/media` → `{ "url": "..." }`
- Publish: `POST https://backend.blotato.com/v2/posts` with a per-platform
  `post.target` object (e.g. YouTube `title`/`privacyStatus`/`shouldNotifySubscribers`,
  Facebook `pageId`, Pinterest `boardId`, TikTok privacy flags).

### Required setup after import

Credentials (none are bundled in the export — wire them up in n8n):

| Credential | Used by |
| --- | --- |
| **Telegram API** | Telegram trigger + the 4 Telegram nodes |
| **Google Drive OAuth2** | Google Drive: Upload Image |
| **Google Sheets OAuth2** | the 5 Google Sheets nodes |
| **OpenAI** | Vision, the 2 chat models, Rewrite Caption |
| **Header Auth — fal.ai** | NanoBanana + Download Edited Image |
| **Header Auth — kie.ai** | Generate / Download VEO3 |
| **Header Auth — Blotato** | the 10 Blotato HTTP nodes; header name **`blotato-api-key`** |

Manual configuration:

- **`Set: Bot Token (Placeholder)`** — set `YOUR_BOT_TOKEN` to your Telegram bot token.
- **Google Sheets nodes** — set `documentId` / `sheetName` to your copy of the tracking sheet
  (columns: `IMAGE NAME`, `IMAGE URL`, `IMAGE DESCRIPTION`, `CAPTION`, `URL VIDEO FINAL`,
  `TITRE VIDEO`, `CAPTION VIDEO`, `STATUS`).
- **`Google Drive: Upload Image`** — set the destination `folderId` (make the folder public).
- **Blotato post nodes** — replace the placeholder `accountId`s (and Facebook `pageId`,
  Pinterest `boardId`) with the IDs from your own Blotato account
  (`GET https://backend.blotato.com/v2/users/me/accounts`).

### Known caveat

`Generate Image Prompt` reads `{{ $json.CAPTION }}` from the output of the preceding
`Google Sheets: Update Image Description` node — this relies on that node returning the
row's `CAPTION` column. If captions arrive empty there, reference the Telegram trigger
caption directly instead. This behavior is inherited from the original template.
