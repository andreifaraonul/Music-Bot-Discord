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

      // Try multiple search strategies
      let result = null
      let searchAttempts = []

      // If it's a direct YouTube URL, try it first
      if (query.includes("youtube.com") || query.includes("youtu.be")) {
        searchAttempts.push({ query: query, type: "Direct URL" })
      } else {
        // For search queries, try multiple sources
        searchAttempts = [
          { query: `scsearch:${query}`, type: "SoundCloud" },
          { query: `ytsearch:${query}`, type: "YouTube" },
          { query: query, type: "Default" },
        ]
      }

      for (const attempt of searchAttempts) {
        try {
          console.log(`Trying ${attempt.type} search: ${attempt.query}`)
          result = await client.music.search(attempt.query, { requester: ctx.user || ctx.author })

          if (result.tracks.length > 0) {
            console.log(`✅ Found ${result.tracks.length} tracks using ${attempt.type}`)
            break
          }
        } catch (searchError) {
          console.log(`❌ ${attempt.type} search failed:`, searchError.message)
          continue
        }
      }

      if (!result || !result.tracks.length) {
        const embed = {
          color: 0xff0000,
          title: "❌ No Results",
          description:
            "No songs found for your query! YouTube is currently experiencing issues. Try:\n• Different search terms\n• SoundCloud links\n• Waiting a few minutes and trying again",
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
          fields: [
            { name: "Requested by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true },
            { name: "Source", value: this.getSourceEmoji(result.tracks[0]?.sourceName), inline: true },
          ],
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
          { name: "Source", value: this.getSourceEmoji(track.sourceName), inline: true },
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
        description:
          "An error occurred while trying to play the song. YouTube is currently experiencing technical difficulties. Please try:\n• Using SoundCloud instead\n• Different search terms\n• Trying again in a few minutes",
        timestamp: new Date().toISOString(),
      }
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }
  },

  getSourceEmoji(sourceName) {
    const sources = {
      youtube: "🔴 YouTube",
      soundcloud: "🟠 SoundCloud",
      bandcamp: "🔵 Bandcamp",
      twitch: "🟣 Twitch",
      vimeo: "🔵 Vimeo",
      http: "🌐 HTTP",
    }
    return sources[sourceName?.toLowerCase()] || "🎵 Unknown"
  },

  sendResponse(ctx, content, isSlash) {
    if (isSlash) {
      return ctx.editReply(content)
    } else {
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
