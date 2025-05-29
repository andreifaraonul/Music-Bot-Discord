import { SlashCommandBuilder } from "discord.js"

export default {
  name: "stop",
  description: "Stop the music and clear the queue",
  aliases: ["disconnect", "dc"],
  slashCommand: new SlashCommandBuilder().setName("stop").setDescription("Stop the music and clear the queue"),

  async execute(message, args, client) {
    await this.stopMusic(message, client, false)
  },

  async executeSlash(interaction, client) {
    await interaction.deferReply()
    await this.stopMusic(interaction, client, true)
  },

  async stopMusic(ctx, client, isSlash = false) {
    const player = client.music.players.get(ctx.guild.id)

    if (!player) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There is no active music player!",
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

    player.destroy()

    const embed = {
      color: 0x00ff00,
      title: "⏹️ Music Stopped",
      description: "Music stopped and queue cleared. Thanks for listening!",
      fields: [{ name: "Stopped by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
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
