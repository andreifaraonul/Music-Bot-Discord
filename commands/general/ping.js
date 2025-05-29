import { SlashCommandBuilder } from "discord.js"

export default {
  name: "ping",
  description: "Check the bot latency",
  aliases: ["latency"],
  slashCommand: new SlashCommandBuilder().setName("ping").setDescription("Check the bot latency"),

  async execute(message, args, client) {
    const sent = await message.reply("🏓 Pinging...")
    const embed = {
      color: 0x00ff00,
      title: "🏓 Pong!",
      fields: [
        { name: "Bot Latency", value: `${sent.createdTimestamp - message.createdTimestamp}ms`, inline: true },
        { name: "API Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
    sent.edit({ content: null, embeds: [embed] })
  },

  async executeSlash(interaction, client) {
    await interaction.deferReply()
    const embed = {
      color: 0x00ff00,
      title: "🏓 Pong!",
      fields: [
        { name: "Bot Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
        { name: "API Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
    interaction.editReply({ embeds: [embed] })
  },
}
