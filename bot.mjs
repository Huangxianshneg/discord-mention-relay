// Discord 即時轉發器：保持 Discord 連線，一收到 @ 機器人的訊息就立刻通知 Base44 API
// 需要環境變數：DISCORD_BOT_TOKEN、BASE44_RELAY_URL
import { Client, GatewayIntentBits } from "discord.js";

const BASE44_RELAY_URL = process.env.BASE44_RELAY_URL;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BASE44_RELAY_URL || !DISCORD_BOT_TOKEN) {
  console.error("請先設定 BASE44_RELAY_URL 和 DISCORD_BOT_TOKEN 環境變數");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`轉發器已上線：${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guildId) return; // 只處理伺服器頻道
    if (!message.mentions.has(client.user)) return;

    const res = await fetch(BASE44_RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-relay-token": DISCORD_BOT_TOKEN,
      },
      body: JSON.stringify({
        guild_id: message.guildId,
        channel_id: message.channelId,
        message_id: message.id,
        author_id: message.author.id,
        author_name: message.author.globalName || message.author.username,
        content: message.content,
      }),
    });
    if (!res.ok) {
      console.error(`轉發失敗（${res.status}）：${await res.text()}`);
    }
  } catch (error) {
    console.error(`轉發錯誤：${error.message}`);
  }
});

client.login(DISCORD_BOT_TOKEN);