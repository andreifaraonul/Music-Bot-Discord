import { SlashCommandBuilder } from "discord.js"

export default {
  name: "volume",
  description: "Change the music volume",
  aliases: ["vol", "v"],
  slashCommand: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the music volume")
    .addIntegerOption((option) =>
      option.setName("level").setDescription("Volume level (1-100)").setMinValue(1).setMaxValue(100).setRequired(true),
    ),

  async execute(message, args, client) {
    const volume = Number.parseInt(args[0])
    if (!volume || volume < 1 || volume > 100) {
      const embed = {
        color: 0xff0000,
        title: "❌ Invalid Volume",
        description: "Please provide a volume level between 1 and 100!",
        timestamp: new Date().toISOString(),
      }
      return message.reply({ embeds: [embed] })
    }
    await this.setVolume(message, client, volume, false)
  },

  async executeSlash(interaction, client) {
    const volume = interaction.options.getInteger("level")
    await interaction.deferReply()
    await this.setVolume(interaction, client, volume, true)
  },

  async setVolume(ctx, client, volume, isSlash = false) {
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

    const oldVolume = player.volume
    player.setVolume(volume)

    const embed = {
      color: 0x00ff00,
      title: "🔊 Volume Changed",
      description: `Volume changed from **${oldVolume}%** to **${volume}%**`,
      fields: [{ name: "Changed by", value: `<@${ctx.user?.id || ctx.author.id}>`, inline: true }],
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
