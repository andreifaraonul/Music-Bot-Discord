# Troubleshooting Guide

## YouTube Playback Issues

### Common YouTube Errors

#### 1. "Must find action functions from script" Error
This happens when YouTube updates their player scripts faster than the plugin can adapt.

**Solutions:**
1. **Update the plugin** - Check for newer versions
2. **Restart Lavalink** - Sometimes helps refresh the cipher cache
3. **Try different search terms** - Some videos work better than others
4. **Use alternative sources** - Try SoundCloud or other platforms

#### 2. "Something broke when playing the track" Error
General playback failure, usually YouTube-related.

**Solutions:**
1. Try searching instead of direct URLs
2. Use different keywords
3. Try SoundCloud: `!play scsearch:song name`
4. Check if the video is region-blocked

### Alternative Search Prefixes

When YouTube fails, try these:
- `scsearch:song name` - SoundCloud search
- `ytsearch:song name` - Force YouTube search
- Direct URLs from other platforms

### Plugin Updates

The YouTube plugin is frequently updated. To get the latest version:

1. **Stop Lavalink**
2. **Update application.yml** with the latest plugin version
3. **Delete the plugins folder** (if it exists) to force re-download
4. **Restart Lavalink**

### Current Known Issues

- YouTube frequently changes their API
- Some videos may be geo-blocked
- Age-restricted content may not work
- Live streams have limited support

### Recommended Alternatives

When YouTube is problematic:
1. **SoundCloud** - Usually more reliable
2. **Bandcamp** - Good for indie music
3. **Direct HTTP streams** - If you have URLs
4. **Local files** - Most reliable option

### Error Monitoring

Check Lavalink logs for:
- `SignatureCipherManager` errors - YouTube cipher issues
- `FriendlyException` - General playback errors
- Connection timeouts - Network issues

### Performance Tips

1. **Use search instead of URLs** when possible
2. **Avoid very long playlists** - They may timeout
3. **Monitor Lavalink memory usage** - Restart if needed
4. **Keep plugins updated** - Check monthly for updates

## Bot-Specific Issues

### Commands Not Working
1. Check if Lavalink is connected
2. Verify bot permissions in Discord
3. Check console for error messages

### Slash Commands Not Registering
1. Check for Entry Point command conflicts
2. Verify bot has application.commands scope
3. Try restarting the bot

### Audio Quality Issues
1. Adjust `opusEncodingQuality` in application.yml
2. Check your internet connection
3. Try different audio sources

## Getting Help

If issues persist:
1. Check [Lavalink Discord](https://discord.gg/ZW4s47Ppw4)
2. Review [YouTube Plugin Issues](https://github.com/lavalink-devs/youtube-source/issues)
3. Update to the latest versions of all components
