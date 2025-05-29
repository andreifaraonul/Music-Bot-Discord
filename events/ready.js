import { ActivityType } from "discord.js"

export default {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`🎵 ${client.user.tag} is online and ready to play music!`)

    client.user.setActivity("🎵 Music for everyone!", {
      type: ActivityType.Listening,
    })

    // Register slash commands individually to avoid Entry Point conflicts
    registerSlashCommands(client)
  },
}

async function registerSlashCommands(client) {
  try {
    console.log("🔄 Starting slash command registration...")

    // Get existing commands to check what's already registered
    const existingCommands = await client.application.commands.fetch()
    console.log(`📋 Found ${existingCommands.size} existing commands`)

    // Get our bot's commands
    const botCommands = Array.from(client.slashCommands.values()).filter((cmd) => cmd.slashCommand)

    for (const cmd of botCommands) {
      try {
        // Check if command already exists
        const existingCommand = existingCommands.find((existing) => existing.name === cmd.name)

        if (existingCommand) {
          // Update existing command
          await existingCommand.edit(cmd.slashCommand.toJSON())
          console.log(`✅ Updated command: ${cmd.name}`)
        } else {
          // Create new command
          await client.application.commands.create(cmd.slashCommand)
          console.log(`✅ Created command: ${cmd.name}`)
        }
      } catch (cmdError) {
        console.error(`❌ Failed to register command ${cmd.name}:`, cmdError.message)
      }
    }

    console.log("✅ Slash command registration completed")
  } catch (error) {
    console.error("❌ Error during command registration:", error.message)
    console.log("⚠️ Bot will continue to work with prefix commands only")
  }
}
