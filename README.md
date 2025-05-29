# Discord Music Bot

A beautiful Discord music bot with Lavalink integration, supporting both prefix and slash commands.

## Features

- 🎵 High-quality music playback with Lavalink
- 🎯 Both prefix and slash commands support
- 📋 Queue management with pagination
- ⏯️ Full playback controls (play, pause, skip, stop)
- 🔊 Volume control
- 📱 Beautiful embeds in English
- 🎨 Clean and organized code structure

## Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Lavalink Server** - Download from [Lavalink Releases](https://github.com/freyacodes/Lavalink/releases)

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure your environment variables in `.env`:
   \`\`\`env
   DISCORD_TOKEN=your_discord_bot_token_here
   PREFIX=!
   LAVALINK_URL=localhost:2333
   LAVALINK_PASSWORD=youshallnotpass
   \`\`\`

4. Set up Lavalink server:
   - Download Lavalink jar file
   - Create `application.yml` configuration file
   - Run Lavalink: `java -jar Lavalink.jar`

5. Start the bot:
   \`\`\`bash
   npm start
   \`\`\`

## Commands

### Music Commands
- `!play <song>` or `/play` - Play a song or add to queue
- `!skip` or `/skip` - Skip the current song
- `!stop` or `/stop` - Stop music and clear queue
- `!pause` or `/pause` - Pause/resume the music
- `!queue` or `/queue` - Show the current queue
- `!volume <1-100>` or `/volume` - Change the volume

### General Commands
- `!help` or `/help` - Show all commands
- `!ping` or `/ping` - Check bot latency

## Lavalink Configuration

Create an `application.yml` file for your Lavalink server:

\`\`\`yaml
server:
  port: 2333
  address: 0.0.0.0
lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: false
    bufferDurationMs: 400
    frameBufferDurationMs: 5000
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true

metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""

logging:
  file:
    max-history: 30
    max-size: 1GB
  path: ./logs/

  level:
    root: INFO
    lavalink: INFO
\`\`\`

## Project Structure

\`\`\`
discord-music-bot/
├── commands/
│   ├── music/
│   │   ├── play.js
│   │   ├── skip.js
│   │   ├── stop.js
│   │   ├── pause.js
│   │   ├── queue.js
│   │   └── volume.js
│   └── general/
│       ├── help.js
│       └── ping.js
├── events/
│   ├── ready.js
│   ├── messageCreate.js
│   └── interactionCreate.js
├── handlers/
│   ├── commandHandler.js
│   └── eventHandler.js
├── index.js
├── package.json
├── .env
└── README.md
\`\`\`

## Contributing

Feel free to contribute to this project by submitting issues or pull requests!

## License

This project is licensed under the MIT License.
