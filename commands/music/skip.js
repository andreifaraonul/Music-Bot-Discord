import { SlashCommandBuilder } from "discord.js"

export default {
  name: "skip",
  description: "Skip the current song",
  aliases: ["s", "next"],
  slashCommand: new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),

  async execute(message, args, client) {
    await this.skipSong(message, client)
  },

  async executeSlash(interaction, client) {
    await this.skipSong(interaction, client)
  },

  async skipSong(ctx, client) {
    const player = client.music.players.get(ctx.guild.id)

    if (!player || !player.queue.current) {
      const embed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There is no song currently playing!",
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

    const currentTrack = player.queue.current
    player.skip()

    const embed = {
      color: 0x00ff00,
      title: "⏭️ Song Skipped",
      description: `Skipped **[${currentTrack.title}](${currentTrack.uri})**`,
      fields: [{ name: "Skipped by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
      timestamp: new Date().toISOString(),
    }

    ctx.reply({ embeds: [embed] })
  },
}
