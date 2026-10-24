# Discord 即時轉發器

這個小程式跑在免費雲端主機上，全職保持 Discord 連線。有人 @ 機器人時，它會在 1 秒內通知你的 Base44 API，由墨衡先生回覆——不用等輪詢。

## 部署步驟

### 1. 開啟 Message Content Intent（必做）

到 [Discord Developer Portal](https://discord.com/developers/applications) → 你的應用程式 → **Bot** 頁面 → **Privileged Gateway Intents** → 開啟 **MESSAGE CONTENT INTENT**。
沒有開的話，機器人收到的訊息內容會是空的。

### 2. 部署到任何「全職在線」的免費主機

推薦 [Railway](https://railway.app) 或 [Render](https://render.com)（都有免費方案）：

1. 把 `relay/` 資料夾裡的 `bot.mjs` 和 `package.json` 上傳（或連到一個 GitHub repo）
2. 設定兩個環境變數：

   | 環境變數 | 值 |
   |---|---|
   | `DISCORD_BOT_TOKEN` | 你的機器人 Token（跟 Base44 Secrets 裡的同一個） |
   | `BASE44_RELAY_URL` | `https://slick-ping-pulse-bot.base44.app/functions/discordMentionRelay` |

3. 啟動指令：`npm start`

### 3. 測試

在頻道裡 @ 機器人說句話，應該幾秒內就會收到墨衡先生的回覆。

## 注意事項

- 轉發器離線時，Base44 每幾分鐘的輪詢掃描會自動當備援，不會漏掉訊息（也不會重複回覆）
- 主機的免費方案若會休眠，選一個不會睡眠的方案或加個保活機制