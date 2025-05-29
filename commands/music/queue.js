import { SlashCommandBuilder } from "discord.js"

export default {
  name: "queue",
  description: "Show the current music queue",
  aliases: ["q", "list"],
  slashCommand: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current music queue")
    .addIntegerOption((option) => option.setName("page").setDescription("Page number to view").setMinValue(1)),

  async execute(message, args, client) {
    const page = Number.parseInt(args[0]) || 1
    await this.showQueue(message, client, page)
  },

  async executeSlash(interaction, client) {
    const page = interaction.options.getInteger("page") || 1
    await this.showQueue(interaction, client, page)
  },

  async showQueue(ctx, client, page) {
    const player = client.music.players.get(ctx.guild.id)

    if (!player || (!player.queue.current && player.queue.length === 0)) {
      const embed = {
        color: 0xff0000,
        title: "❌ Empty Queue",
        description: "The queue is currently empty. Add some songs with the play command!",
        timestamp: new Date().toISOString(),
      }
      return ctx.reply({ embeds: [embed] })
    }

    const queue = player.queue
    const tracksPerPage = 10
    const start = (page - 1) * tracksPerPage
    const end = start + tracksPerPage
    const totalPages = Math.ceil(queue.length / tracksPerPage)

    if (page > totalPages && totalPages > 0) {
      const embed = {
        color: 0xff0000,
        title: "❌ Invalid Page",
        description: `Page ${page} doesn't exist. There are only ${totalPages} pages.`,
        timestamp: new Date().toISOString(),
      }
      return ctx.reply({ embeds: [embed] })
    }

    let description = ""

    if (queue.current) {
      description += `**🎵 Now Playing:**\n[${queue.current.title}](${queue.current.uri}) - \`${this.formatTime(queue.current.length)}\`\n\n`
    }

    if (queue.length > 0) {
      description += `**📋 Queue (${queue.length} songs):**\n`
      const tracks = queue.slice(start, end)

      tracks.forEach((track, index) => {
        const position = start + index + 1
        description += `\`${position}.\` [${track.title}](${track.uri}) - \`${this.formatTime(track.length)}\`\n`
      })

      if (totalPages > 1) {
        description += `\n📄 Page ${page} of ${totalPages}`
      }
    }

    const embed = {
      color: 0x0099ff,
      title: "🎵 Music Queue",
      description: description,
      fields: [
        {
          name: "⏱️ Total Duration",
          value: this.formatTime(
            queue.current
              ? queue.current.length + queue.reduce((acc, track) => acc + track.length, 0)
              : queue.reduce((acc, track) => acc + track.length, 0),
          ),
          inline: true,
        },
        { name: "🔊 Volume", value: `${player.volume}%`, inline: true },
        { name: "🔁 Loop", value: player.loop || "Off", inline: true },
      ],
      timestamp: new Date().toISOString(),
    }

    ctx.reply({ embeds: [embed] })
  },

  formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  },
}
