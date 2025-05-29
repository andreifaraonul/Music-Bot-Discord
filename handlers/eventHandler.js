import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function loadEvents(client) {
  const eventsPath = join(__dirname, "..", "events")
  const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith(".js"))

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file)
    const { default: event } = await import(`file://${filePath}`)

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client))
    } else {
      client.on(event.name, (...args) => event.execute(...args, client))
    }
  }

  console.log(`✅ Loaded ${eventFiles.length} events`)
}
