import { SlashCommandBuilder } from "discord.js"

export default {
  name: "pause",
  description: "Pause or resume the current song",
  aliases: ["resume"],
  slashCommand: new SlashCommandBuilder().setName("pause").setDescription("Pause or resume the current song"),

  async execute(message, args, client) {
    await this.togglePause(message, client, false)
  },

  async executeSlash(interaction, client) {
    await interaction.deferReply()
    await this.togglePause(interaction, client, true)
  },

  async togglePause(ctx, client, isSlash = false) {
    const player = client.music.players.get(ctx.guild.id)

    if (!player || !player.queue.current) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There is no song currently playing!",
        timestamp: new Date().toISOString(),
      }
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }

    const voiceChannel = ctx.member.voice.channel
    if (!voiceChannel || voiceChannel.id !== player.voiceId) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "You need to be in the same voice channel as the bot!",
        timestamp: new Date().toISOString(),
      }
      return this.sendResponse(ctx, { embeds: [embed] }, isSlash)
    }

    const wasPaused = player.paused
    player.pause(!player.paused)

    const embed = {
      color: wasPaused ? 0x00ff00 : 0xff9900,
      title: wasPaused ? "▶️ Music Resumed" : "⏸️ Music Paused",
      description: `Music has been ${wasPaused ? "resumed" : "paused"}`,
      fields: [{ name: "Action by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
      timestamp: new Date().toISOString(),
    }

    this.sendResponse(ctx, { embeds: [embed] }, isSlash)
  },

  sendResponse(ctx, content, isSlash) {
    if (isSlash) {
      return ctx.editReply(content)
    } else {
      return ctx.reply(content)
    }
  },
}
