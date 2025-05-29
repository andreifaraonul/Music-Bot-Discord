import { SlashCommandBuilder } from "discord.js"

export default {
  name: "search",
  description: "Search for songs from different sources",
  aliases: ["find"],
  slashCommand: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for songs from different sources")
    .addStringOption((option) => option.setName("query").setDescription("Song name to search for").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription("Source to search from")
        .addChoices(
          { name: "SoundCloud", value: "soundcloud" },
          { name: "YouTube", value: "youtube" },
          { name: "All Sources", value: "all" },
        ),
    ),

  async execute(message, args, client) {
    const query = args.join(" ")
    if (!query) {
      return message.reply({
        embeds: [
          {
            color: 0xff0000,
            title: "❌ Error",
            description: "Please provide a search query!",
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }

    await this.searchMusic(message, query, "all", client, false)
  },

  async executeSlash(interaction, client) {
    const query = interaction.options.getString("query")
    const source = interaction.options.getString("source") || "all"
    await interaction.deferReply()
    await this.searchMusic(interaction, query, source, client, true)
  },

  async searchMusic(ctx, query, source, client, isSlash = false) {
    try {
      const searches = []

      if (source === "all") {
        searches.push(
          { prefix: "scsearch:", name: "SoundCloud", emoji: "🟠" },
          { prefix: "ytsearch:", name: "YouTube", emoji: "🔴" },
        )
      } else if (source === "soundcloud") {
        searches.push({ prefix: "scsearch:", name: "SoundCloud", emoji: "🟠" })
      } else if (source === "youtube") {
        searches.push({ prefix: "ytsearch:", name: "YouTube", emoji: "🔴" })
      }

      const allResults = []

      for (const search of searches) {
        try {
          const result = await client.music.search(`${search.prefix}${query}`, {
            requester: ctx.user || ctx.author,
          })

          if (result.tracks.length > 0) {
            allResults.push({
              source: search.name,
              emoji: search.emoji,
              tracks: result.tracks.slice(0, 3), // Limit to 3 per source
            })
          }
        } catch (error) {
          console.log(`Search failed for ${search.name}:`, error.message)
        }
      }

      if (allResults.length === 0) {
        const embed = {
          color: 0xff0000,
          title: "❌ No Results",
          description: "No songs found for your search query!",
          timestamp: new Date().toISOString(),
        }
        return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
      }

      let description = `**Search results for:** \`${query}\`\n\n`

      allResults.forEach((sourceResult, sourceIndex) => {
        description += `**${sourceResult.emoji} ${sourceResult.source}:**\n`
        sourceResult.tracks.forEach((track, trackIndex) => {
          const number = sourceIndex * 3 + trackIndex + 1
          description += `\`${number}.\` [${track.title}](${track.uri}) - \`${this.formatTime(track.length)}\`\n`
        })
        description += "\n"
      })

      description += `💡 **Tip:** Use \`!play <number>\` or copy the song title to play it!`

      const embed = {
        color: 0x0099ff,
        title: "🔍 Search Results",
        description: description,
        footer: {
          text: `Found ${allResults.reduce((total, source) => total + source.tracks.length, 0)} results`,
        },
        timestamp: new Date().toISOString(),
      }

      this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    } catch (error) {
      console.error("Error in search command:", error)
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "An error occurred while searching for songs.",
        timestamp: new Date().toISOString(),
      }
      this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }
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
