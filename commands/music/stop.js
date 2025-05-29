import { SlashCommandBuilder } from "discord.js"

export default {
  name: "stop",
  description: "Stop the music and clear the queue",
  aliases: ["disconnect", "dc"],
  slashCommand: new SlashCommandBuilder().setName("stop").setDescription("Stop the music and clear the queue"),

  async execute(message, args, client) {
    await this.stopMusic(message, client)
  },

  async executeSlash(interaction, client) {
    await this.stopMusic(interaction, client)
  },

  async stopMusic(ctx, client) {
    const player = client.music.players.get(ctx.guild.id)

    if (!player) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There is no active music player!",
        timestamp: new Date().toISOString(),
      }
      return ctx.reply({ embeds: [embed] })
    }

    const voiceChannel = ctx.member.voice.channel
    if (!voiceChannel || voiceChannel.id !== player.voiceId) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "You need to be in the same voice channel as the bot!",
        timestamp: new Date().toISOString(),
      }
      return ctx.reply({ embeds: [embed] })
    }

    player.destroy()

    const embed = {
      color: 0x00ff00,
      title: "⏹️ Music Stopped",
      description: "Music stopped and queue cleared. Thanks for listening!",
      fields: [{ name: "Stopped by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
      timestamp: new Date().toISOString(),
    }

    ctx.reply({ embeds: [embed] })
  },
}
