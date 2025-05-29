export default {
  name: "messageCreate",
  execute(message, client) {
    if (message.author.bot || !message.content.startsWith(client.prefix)) return

    const args = message.content.slice(client.prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    try {
      command.execute(message, args, client)
    } catch (error) {
      console.error(error)
      const errorEmbed = {
        color: 0xff0000,
        title: "❌ Error",
        description: "There was an error executing this command!",
        timestamp: new Date().toISOString(),
      }
      message.reply({ embeds: [errorEmbed] })
    }
  },
}
