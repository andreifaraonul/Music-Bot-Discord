export default {
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return

    const command = client.slashCommands.get(interaction.commandName)
    if (!command) return

    try {
      command.executeSlash(interaction, client)
    } catch (error) {
      console.error(error)
      const errorEmbed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There was an error executing this command!",
        timestamp: new Date().toISOString(),
      }

      if (interaction.replied || interaction.deferred) {
        interaction.followUp({ embeds: [errorEmbed], ephemeral: true })
      } else {
        interaction.reply({ embeds: [errorEmbed], ephemeral: true })
      }
    }
  },
}
