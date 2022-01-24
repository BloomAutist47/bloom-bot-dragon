import DiscordJS, { Client, Intents, Interaction, TextChannel } from 'discord.js'
import dotenv from 'dotenv'

import BaseCog from './cogs/base'
import GeneralCog from './cogs/general'
import GuideCog from './cogs/guide'
import ClassCog from './cogs/classes'
import AQWCog from './cogs/aqw'

import PrivateCog from './cogs/private'
import RedditCog from './cogs/reddit'
import TwitterCog from './cogs/twitter'

process.env.UV_THREADPOOL_SIZE = '128';
dotenv.config()

// Setup
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
})


var fileList = ["guides", "auqw", "classes", "resources"]
var baseCog = new BaseCog(client, fileList)
baseCog.readData()


// Commands
client.on("ready", () => {
    // Platform & Slash Command Setup

    if (process.platform == "win32") {
        baseCog.commands = client.guilds.cache.get("761956630606250005")!.commands
        baseCog.prefix = "'"
    } else {
        console.log("[System] Heroku")
        baseCog.commands = client.application?.commands
        baseCog.prefix = ";"
    }

    
    // Cogs
    new GuideCog(client, baseCog)
    new ClassCog(client, baseCog)
    new GeneralCog(client, baseCog)
    new AQWCog(client, baseCog)
    new PrivateCog(client, baseCog)
    new RedditCog(client, baseCog)
    new TwitterCog(client, baseCog)

    
    baseCog.createListener()

    // Start
    baseCog.delay(2000);
    console.log(`[System] Logged in as ${client.user!.tag}.`)
    const loginChannel = client.channels.cache.get('830702959679373352') as TextChannel
    const date = new Date(Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })

    loginChannel.send(`**Deployed**: Bloom-${process.env.mode} | \`${date}\``)
    
})

client.login(process.env.TOKEN)






