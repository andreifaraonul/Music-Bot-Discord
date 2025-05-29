import { SlashCommandBuilder } from "discord.js"

export default {
  name: "help",
  description: "Show all available commands",
  aliases: ["h", "commands"],
  slashCommand: new SlashCommandBuilder().setName("help").setDescription("Show all available commands"),

  async execute(message, args, client) {
    await this.showHelp(message, client)
  },

  async executeSlash(interaction, client) {
    await this.showHelp(interaction, client)
  },

  async showHelp(ctx, client) {
    const embed = {
      color: 0x0099ff,
      title: "🎵 Music Bot Commands",
      description: `Prefix: \`${client.prefix}\` | You can also use slash commands!`,
      fields: [
        {
          name: "🎵 Music Commands",
          value: [
            `\`${client.prefix}play <song>\` - Play a song or add to queue`,
            `\`${client.prefix}search <song>\` - Search for songs from multiple sources`,
            `\`${client.prefix}skip\` - Skip the current song`,
            `\`${client.prefix}stop\` - Stop music and clear queue`,
            `\`${client.prefix}pause\` - Pause/resume the music`,
            `\`${client.prefix}queue\` - Show the current queue`,
            `\`${client.prefix}volume <1-100>\` - Change the volume`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "📋 General Commands",
          value: [
            `\`${client.prefix}help\` - Show this help message`,
            `\`${client.prefix}ping\` - Check bot latency`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "🔍 Search Tips",
          value: [
            "🟠 For SoundCloud: `!play scsearch:song name`",
            "🔴 For YouTube: `!play ytsearch:song name`",
            "🔍 Multi-source search: `!search song name`",
          ].join("\n"),
          inline: false,
        },
        {
          name: "⚠️ Current Status",
          value: "YouTube is experiencing technical issues. SoundCloud is recommended for better reliability.",
          inline: false,
        },
        {
          name: "🔗 Useful Links",
          value:
            "[Support Server](https://discord.gg/your-server) | [Invite Bot](https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot%20applications.commands)",
          inline: false,
        },
      ],
      footer: {
        text: "Made with ❤️ for music lovers",
        icon_url: client.user.displayAvatarURL(),
      },
      timestamp: new Date().toISOString(),
    }

    ctx.reply({ embeds: [embed] })
  },
}
