import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function loadCommands(client) {
  const commandsPath = join(__dirname, "..", "commands")
  const commandFolders = readdirSync(commandsPath)

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder)
    const commandFiles = readdirSync(folderPath).filter((file) => file.endsWith(".js"))

    for (const file of commandFiles) {
      const filePath = join(folderPath, file)
      const { default: command } = await import(`file://${filePath}`)

      if (command.name) {
        client.commands.set(command.name, command)

        if (command.slashCommand) {
          client.slashCommands.set(command.name, command)
        }
      }
    }
  }

  console.log(`✅ Loaded ${client.commands.size} commands`)
}
