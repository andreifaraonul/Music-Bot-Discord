import { ActivityType } from "discord.js"

export default {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`🎵 ${client.user.tag} is online and ready to play music!`)

    client.user.setActivity("🎵 Music for everyone!", {
      type: ActivityType.Listening,
    })

    // Register slash commands
    const commands = Array.from(client.slashCommands.values())
      .filter((cmd) => cmd.slashCommand)
      .map((cmd) => cmd.slashCommand)

    client.application.commands
      .set(commands)
      .then(() => console.log("✅ Slash commands registered"))
      .catch(console.error)
  },
}
