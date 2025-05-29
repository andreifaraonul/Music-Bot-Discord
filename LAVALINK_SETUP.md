# Lavalink Setup Guide

## Step 1: Download Lavalink

1. Go to [Lavalink Releases](https://github.com/lavalink-devs/Lavalink/releases)
2. Download the latest `Lavalink.jar` file
3. Place it in your project directory

## Step 2: Create Configuration

1. Copy the `application.yml` file from this project to the same directory as `Lavalink.jar`
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

## Step 5: Start Your Bot

In another terminal, start your Discord bot:

\`\`\`bash
npm start
\`\`\`

## Troubleshooting

### Error 400 (Current Issue)
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
