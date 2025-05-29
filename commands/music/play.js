import { SlashCommandBuilder } from "discord.js"

export default {
  name: "play",
  description: "Play a song or add it to the queue",
  aliases: ["p"],
  slashCommand: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or add it to the queue")
    .addStringOption((option) =>
      option.setName("query").setDescription("Song name, URL, or search query").setRequired(true),
    ),

  async execute(message, args, client) {
    const query = args.join(" ")
    if (!query) {
      return message.reply({
        embeds: [
          {
            color: 0xff0000,
            title: "❌ Error",
            description: "Please provide a song name or URL!",
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }

    await this.playMusic(message, query, client, message.member.voice.channel, false)
  },

  async executeSlash(interaction, client) {
    const query = interaction.options.getString("query")
    await interaction.deferReply()
    await this.playMusic(interaction, query, client, interaction.member.voice.channel, true)
  },

  async playMusic(ctx, query, client, voiceChannel, isSlash = false) {
    if (!voiceChannel) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "You need to be in a voice channel to play music!",
        timestamp: new Date().toISOString(),
      }
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }

    try {
      const player = await client.music.createPlayer({
        guildId: ctx.guild.id,
        textId: ctx.channel.id,
        voiceId: voiceChannel.id,
        volume: 100,
        deaf: true,
      })

      const result = await client.music.search(query, { requester: ctx.user || ctx.author })

      if (!result.tracks.length) {
        const embed = {
          color: 0xff0000,
          title: "❌ No Results",
          description: "No songs found for your query!",
          timestamp: new Date().toISOString(),
        }
        return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
      }

      if (result.type === "PLAYLIST") {
        for (const track of result.tracks) {
          player.queue.add(track)
        }

        const embed = {
          color: 0x00ff00,
          title: "📋 Playlist Added",
          description: `Added **${result.tracks.length}** songs from **${result.playlistName}**`,
          fields: [{ name: "Requested by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
          timestamp: new Date().toISOString(),
        }

        if (!player.playing && !player.paused) player.play()
        return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
      }

      const track = result.tracks[0]
      player.queue.add(track)

      const embed = {
        color: 0x00ff00,
        title: player.playing ? "📋 Added to Queue" : "🎵 Now Playing",
        description: `**[${track.title}](${track.uri})**`,
        fields: [
          { name: "Duration", value: this.formatTime(track.length), inline: true },
          { name: "Requested by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true },
        ],
        thumbnail: { url: track.thumbnail || "https://via.placeholder.com/300x300?text=Music" },
        timestamp: new Date().toISOString(),
      }

      if (player.queue.size > 0) {
        embed.fields.push({ name: "Position in queue", value: `${player.queue.size}`, inline: true })
      }

      if (!player.playing && !player.paused) player.play()
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    } catch (error) {
      console.error("Error in play command:", error)
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "An error occurred while trying to play the song. Make sure Lavalink is running!",
        timestamp: new Date().toISOString(),
      }
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }
  },

  sendResponse(ctx, content, isSlash) {
    if (isSlash) {
      // For slash commands, use editReply since we already deferred
      return ctx.editReply(content)
    } else {
      // For regular messages, use reply
      return ctx.reply(content)
    }
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
