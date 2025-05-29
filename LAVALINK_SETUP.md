# Lavalink Setup Guide

## Step 1: Download Lavalink

1. Go to [Lavalink Releases](https://github.com/lavalink-devs/Lavalink/releases)
2. Download the latest `Lavalink.jar` file (v4.0.0 or higher recommended)
3. Place it in your project directory

## Step 2: Create Configuration

1. Copy the updated `application.yml` file from this project to the same directory as `Lavalink.jar`
2. Make sure the password in `application.yml` matches your `.env` file

## Step 3: Install Java

Lavalink requires Java 17 or higher:

### Windows:
- Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
- Install and add to PATH

### Check Java version:
\`\`\`bash
java -version
\`\`\`

## Step 4: Start Lavalink

Open a terminal in the directory with `Lavalink.jar` and run:

\`\`\`bash
java -jar Lavalink.jar
\`\`\`

You should see:
\`\`\`
Lavalink is ready to accept connections on port 2333
\`\`\`

**Note:** The first time you start Lavalink with the new configuration, it will download the YouTube plugin automatically. This may take a few moments.

## Step 5: Start Your Bot

In another terminal, start your Discord bot:

\`\`\`bash
npm start
\`\`\`

## What Changed

### YouTube Plugin Update
- **Old:** Built-in YouTube source (deprecated)
- **New:** External YouTube plugin (`dev.lavalink.youtube:youtube-plugin`)
- **Benefits:** 
  - Better reliability
  - More frequent updates
  - Better YouTube compatibility
  - Reduced rate limiting

### Configuration Changes
- Set `youtube: false` in sources (disables deprecated source)
- Added YouTube plugin in the `plugins` section
- Added plugin configuration under `plugins.youtube`

## Troubleshooting

### Plugin Download Issues
If the plugin fails to download:
1. Check your internet connection
2. Restart Lavalink
3. Check the logs for specific error messages

### YouTube Search Not Working
If YouTube searches fail:
1. Make sure `youtubeSearchEnabled: true` in the config
2. Check that the plugin loaded successfully in the logs
3. Try restarting Lavalink

### Error 400 (Connection Issues)
- Make sure Lavalink is running before starting the bot
- Check that the password in `.env` matches `application.yml`
- Verify the port (default: 2333) is not blocked

### Port Already in Use
\`\`\`bash
# Windows - Kill process on port 2333
netstat -ano | findstr :2333
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:2333 | xargs kill -9
\`\`\`

### Java Not Found
- Install Java 17+
- Add Java to your system PATH
- Restart your terminal

## Quick Start Commands

1. **Start Lavalink:**
   \`\`\`bash
   java -jar Lavalink.jar
   \`\`\`

2. **Start Bot (in new terminal):**
   \`\`\`bash
   npm start
   \`\`\`

3. **Test in Discord:**
   \`\`\`
   !play never gonna give you up
   \`\`\`

## Expected Startup Messages

When Lavalink starts successfully with the new plugin, you should see:
\`\`\`
INFO 1 --- [Lavalink] [           main] l.server.bootstrap.PluginManager         : Loading plugin 'youtube-plugin' version 1.5.2
INFO 1 --- [Lavalink] [           main] l.server.bootstrap.PluginManager         : Loaded plugin youtube-plugin
INFO 1 --- [Lavalink] [           main] lavalink.server.Launcher                 : Lavalink is ready to accept connections on port 2333
\`\`\`
