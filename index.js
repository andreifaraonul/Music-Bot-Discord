import { Client, GatewayIntentBits, Collection } from "discord.js"
import { Kazagumo } from "kazagumo"
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class MusicBot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    })

    this.commands = new Collection()
    this.slashCommands = new Collection()
    this.prefix = process.env.PREFIX || "!"

    // Initialize Kazagumo (Lavalink manager)
    this.music = new Kazagumo(
      {
        defaultSearchEngine: "youtube",
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId)
          if (guild) guild.shard.send(payload)
        },
      },
      this,
      [
        {
          name: "main",
          url: process.env.LAVALINK_URL || "localhost:2333",
          auth: process.env.LAVALINK_PASSWORD || "youshallnotpass",
          secure: false,
        },
      ],
    )

    this.loadHandlers()
  }

  async loadHandlers() {
    // Load command handler
    const { default: commandHandler } = await import("./handlers/commandHandler.js")
    commandHandler(this)

    // Load event handler
    const { default: eventHandler } = await import("./handlers/eventHandler.js")
    eventHandler(this)
  }
}

const client = new MusicBot()

// Handle music events
client.music.on("playerStart", (player, track) => {
  const channel = client.channels.cache.get(player.textId)
  if (channel) {
    const embed = {
      color: 0x00ff00,
      title: "🎵 Now Playing",
      description: `**[${track.title}](${track.uri})**`,
      fields: [
        { name: "Duration", value: formatTime(track.length), inline: true },
        { name: "Requested by", value: `<@${track.requester}>`, inline: true },
      ],
      thumbnail: { url: track.thumbnail || "https://via.placeholder.com/300x300?text=Music" },
      timestamp: new Date().toISOString(),
    }
    channel.send({ embeds: [embed] })
  }
})

client.music.on("playerEnd", (player) => {
  if (player.queue.length === 0) {
    const channel = client.channels.cache.get(player.textId)
    if (channel) {
      const embed = {
        color: 0xff9900,
        title: "🎵 Queue Finished",
        description: "The queue has ended. Add more songs or I'll leave in 5 minutes of inactivity.",
        timestamp: new Date().toISOString(),
      }
      channel.send({ embeds: [embed] })
    }
  }
})

function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

client.login(process.env.DISCORD_TOKEN)
