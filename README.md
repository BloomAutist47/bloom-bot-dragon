# Bloom Bot: Dragon

An AdventureQuest Worlds Discord Helper bot. Completely overhauled from scratch and ported from python to js. To invite the bot, simply use the link below. For any suggestions or concerns, join the Support Discord Server and we will help you.

**Current Version**: v.2.0.0
**Invitation Link**: [Bloom Bot](https://discord.com/api/oauth2/authorize?client_id=799639690176495637&permissions=268749888&scope=bot)
**Discord Support**: [discord.gg/YcXzxPt593](https://discord.gg/YcXzxPt593)
**Prefix**:
 - ` ; ` - Semi Colon
 - ` / ` - Slash

# Credits
- Satan and Shane for their suggestions.
- AuQW Coomunity for their support.
- Molevolent and Shiminuki for their Class Charts
- AE for creating this game we both love and hate.
# Features/Commands
 - `;help` - Shows the help embed
 - [Game Guide Helps](##game-guide-helps)
 - [Class Chart Search](##class-chart-search)
 - [Player Search](##player-search)
 - [Fully Detailed Wiki Search](##wiki-search)
 - [Server Details](##server-details)
 - [Alina's Daily Gift Updates (Automated)](##alina's-daily-gift-updates)
 - [r/AQW Reddit Feeds](###AQW-Reddit-Feeds)

## Game Guide Helps
**Description**: Contains a wide array of guides ranging from gold guide, xp guide, farming guides, ioda guides, alchemy guides, boosted set guides, and more...

**Commands**:
`;g` - Summons a list of all [guides](https://github.com/BloomAutist47/bloom-bot-dragon/blob/main/data/guides.json).
`;g guide_name` - Returns a specific guide. 

**Example**:
`;g xp`
`;g setgeneral`
`;g topfarm`

## Class Chart Search
**Description**: Using the [data chart](https://docs.google.com/spreadsheets/d/1Ywl9GcfySXodGA_MtqU4YMEQaGmr4eMAozrM4r00KwI/edit?usp=sharing) created by [Molevolent](https://twitter.com/molevolent) and [Shiminuki](https://www.youtube.com/channel/UCyQ5AocDVVDznIslRuGUS3g), and with the help of the [AuQW coomunity](https://auqw.tk/), we created a Class Chart containing Class Radar Values, allowing you to see how strong certain classes are, as well as their difficulty.

**Command**: 
`;c class_name` - Returns a class data chart of a given name or acronym. If no result, will give list of suggestions.

**Example**:
`;c legion revenant`
`;c vhl`

## Player Search
**Description**:  Gets player data from [AQW Character Page](https://account.aq.com/CharPage?).

**Command**: 
`;char player_name`

**Example**:
`;char artix`
`;char sora to hoshi`

## Wiki Search
**Description**:  Smart Searches the [AQW Wikidot page](http://aqwwiki.wikidot.com/) and returns direct or search results. Due to limitations of discord (plus it didn't make any sense to), I've disabled the following page types: Events, Maps, Cutscene-scripts, Quests, Chaos, Game-menu, NPCs.

**Command**: 
`;w search_key`

**Example**:
`;w legion revenant`
`;w necrotic sword of doom sword`

## Server Details
**Description**:  Shows a list of AQW servers and their player count and online status.
**Command**: 
`;servers`



## Alina's Daily Gift Updates
**Description**:  Sets a discord channel to receive feed on Alina's Daily Gift Updates. Fully automated by Bloom Bot. You can also set a role id to ping whenever a new daily gift arrives.
**Note**: Ensure that Bloom Bot has message and embed permissions on the channel. If you will use the optional update ping *role_id*, then add mention permission.

**Commands**: 
`;register_daily role_id` - Registers current channel to receive Daily Gift updates. *role\_id* is optional. To change the registered channel, simply enter this command on a new channel. 
`;unregister_daily`- Removes registered daily gift feed channel.
`;channels` - View registered feed channels.

**Example**:
`;register_daily` - Will simply send updates to channel without any pings.
`;register_daily 814054683651342367` - Will ping my **@Daily Gifts** role whenever there's a new update.

## AQW Reddit Feeds
**Description**:  Sets a discord channel to receive r/AQW feed updates.
**Note**: Ensure that Bloom Bot has message and embed permissions on the channel. If you will use the optional update ping *role_id*, then add mention permission.

**Commands**: 
`;register_raqw` - Registers current channel to receive r/AQW Reddit new posts. To change the registered channel, simply enter this command on a new channel. 
`;unregister_raqw` - Removes registered r/AQW feed channel.
`;channels` - View registered feed channels.

**Example**:
`;register_raqw` - that's literally it.

