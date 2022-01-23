import BaseCog from './base'
import { Base, Client, MessageEmbed, TextChannel } from "discord.js"
import Twitter from 'node-tweet-stream'

interface BoostReplace {
    target: string;
    replace: string;
}

interface DailyResult {
    type: string;
    value: string | null;
    value2?: string
}

export default class TwitterCog {
    // Class Metadata
    public description = "The Class Containing the Guide Commands"

    // Class Variables
    private twitter: Twitter

    // Datas

    private gift_check: Array<string> = []
    private boost_check: Array<string> = []
    private black_list: Array<string> = []

    private boostReplaceList: Array<BoostReplace> = [
        { target: "(rep) ", replace: "" },
        { target: "(exp) ", replace: "" },
        { target: " Rep ", replace: " Reputation " },
        { target: "(reputation) ", replace: "" },
        { target: "(experience) ", replace: "" },
        { target: "Xp ", replace: "Experience " },
    ]
    constructor(private client: Client, private base: BaseCog) {
        this.gift_check = base.files["resources"]["twitter"]["gift_check"]
        this.boost_check = base.files["resources"]["twitter"]["boost_check"]
        this.black_list = base.files["resources"]["twitter"]["black_list"]

        this.base.registerCommand(this.cmdRegisterChannel.bind(this), {
            name: 'register_daily',
            description: 'Administrator only command. Set this channel to receive AQW Daily Gift Updates. Ping Role optional',
            options: [{
                name: 'daily_role_id',
                description: "Enter role ID which the bot will ping everytime.",
                required: false,
                type: base.dTypes.STRING,
            }]
        })

        this.base.registerCommand(this.cmdUnregisterChannel.bind(this), {
            name: 'unregister_daily',
            description: 'Administrator only command. Remove this channel from r/AQW live stream of new posts',
        })

        this.start()

    }


    /*==============================================================================================================
                                                                                                   
                         ██████╗ ██████╗ ███╗   ███╗███╗   ███╗ █████╗ ███╗   ██╗██████╗ ███████╗
                        ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝
                        ██║     ██║   ██║██╔████╔██║██╔████╔██║███████║██╔██╗ ██║██║  ██║███████╗
                        ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║╚════██║
                        ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝███████║
                         ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝
                                                                                                 
    ==============================================================================================================*/


    async cmdRegisterChannel(mode: string, source) {

        // Args check
        var args_
        switch (mode) {
            case "slash":
                let { options } = source
                args_ = options.getString("daily_role_id")
                if (args_ !== null ) {
                    args_ = args_.trim()
                }
                break
            case "legacy":
                args_ = this.base.ContentClean(source.content, "register_daily")
                break;
        }
        
        // Permission Check
        if (!source.member.permissionsIn(source.channel).has("ADMINISTRATOR")) {
            await source.reply("\`[Error]\`: You do not have administrator permission in this channel to use `register_daily` command.")
            return
        }

        // Variables
        const channelID: string = String(source.channel.id).trim()
        const guildID: string = String(source.guild.id)
        var roleID = `<@&${args_}>`
        if (args_ === "" || args_ == null || args_.match(/[^$,.\d]/) ) {
            roleID = "None"
        }

        var status = "\`Status\`: Successfully Registered"
        // Replace
        if (this.base.dailyChannels.hasOwnProperty(guildID) && this.base.dailyChannels[guildID].channel != channelID) {
            status += `\n\`Notice\`: Replacing Previous Channel <#${this.base.dailyChannels[guildID].channel}>`
        }

        // Add it
        this.base.dailyChannels[guildID] = {channel: channelID, role: args_}
        const result = await this.base.database.dbUpdate("settings.webhooks", { _id: "daily_gift_webhooks" }, { $set: { urls: this.base.dailyChannels } })
        await source.reply(`**__Register Daily Gift Feed__**\n\`Channel\`: <#${channelID}>\n\`Role\`: ${roleID}\n${status}`)
        return
    }


    async cmdUnregisterChannel(mode: string, source) {

        // Permission Check
        if (!source.member.permissionsIn(source.channel).has("ADMINISTRATOR")) {
            await source.reply("\`[Error]\`: You do not have administrator permission in this channel to use `unregister_daily` command.")
            return
        }

        // Variables
        const guildID: string = String(source.guild.id)

        // Validity
        if (!this.base.dailyChannels.hasOwnProperty(guildID)) {
            await source.reply(`**__Unregister Daily Gift Feed__**:\n\`Status\`: No registered Daily Gifts Channel`)
            return
        }

        // Delete it
        const channelID = this.base.dailyChannels[guildID].channel
        delete this.base.dailyChannels[guildID]

        // Upload Change
        const result = await this.base.database.dbUpdate("settings.webhooks", { _id: "daily_gift_webhooks" }, { $set: { urls: this.base.dailyChannels } })

        // Reply
        await source.reply(`**__Unregister Daily Gift Feed__**\n\`Channel\`: <#${channelID}>\n\`Status\`: Successfully Removed.`)
        return
    }



/*==============================================================================================================
                                                                                                   
                        ██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗███████╗███████╗
                        ██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝██║██╔════╝██╔════╝
                        ██║   ██║   ██║   ██║██║     ██║   ██║   ██║█████╗  ███████╗
                        ██║   ██║   ██║   ██║██║     ██║   ██║   ██║██╔══╝  ╚════██║
                        ╚██████╔╝   ██║   ██║███████╗██║   ██║   ██║███████╗███████║
                         ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝
                                                                                    
==============================================================================================================*/


    public async start() {
        // Get Channels 
        this.base.dailyChannels = (await this.base.database.dbRead("settings.webhooks", { _id: "daily_gift_webhooks" })).urls
        
        // Get account and Twitter
        var account = await this.base.database.dbRead("settings.accounts", { _id: "twitter_account" })
        this.twitter = new Twitter(account)
        
        // Error Listener
        this.twitter.on('error', function (err) {
            console.log('Oh no')
        })

        // Tweet Listener
        this.twitter.on('tweet', this.processTweet.bind(this))

        // Bloom -> 1349290524901998592
        // Alina -> 16480141
        this.twitter.follow('16480141')
    }

    private async processTweet(tweet) {

        // Get text
        var text: string = ""
        if (tweet.hasOwnProperty('extended_tweet')) {
            text = tweet.extended_tweet.full_text
        } else {
            text = tweet.text
        }

        // Get String
        const target: string = text.toLowerCase().trim().replace("log in each day for a new reward, boost, or gift at ", " ")
        if (this.isBlackListed(target)) return

        // Get URL
        const url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str

        // Get Image
        var image: string = ""
        if (tweet.hasOwnProperty('extended_tweet') && tweet.extended_tweet.hasOwnProperty('entities') && tweet.extended_tweet.entities.hasOwnProperty('media')) {
            try {
                image = tweet.extended_tweet.entities.media[0].media_url
            } catch (error) {
                console.log("[Twitter] Failed to get media: ", error)
            }
            
        }
        

        // Get Date
        const date: Date = new Date(parseInt(tweet.timestamp_ms)) 

        // Create Embed
        var content: string = ""
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setAuthor("AdventureQuest Worlds", this.base.files["resources"]["images"]["aqw_icon"])
            .setURL(url)
            .setImage(image)
            
        // Create Content
        if (this.isBoost(target)) { // If Boost
            embed.setTitle("New Daily Boost!")
            const boostResult: DailyResult = this.findBoost(target)
            var durationResult: DailyResult = this.findDuration(target)

            if (this.hasValue(durationResult)) {
                content += `**Duration**: ${durationResult.value} Hours\n`

                const startsIn = this.getDate(date)
                if (durationResult.value !== null) {
                    date.setHours(date.getHours() + parseInt(durationResult.value!));
                }
                const endsIn = this.getDate(date)

                content += `**Starts In**: ${startsIn}\n`
                content += `**Ends In**: ${endsIn}\n`
            } else {
                durationResult.value = ""
            }

            if (this.hasValue(boostResult)) {
                content += `**Boost**: ${boostResult.value?.replace("Hour", "").replace("Hours", "").replace(durationResult.value!, "").trim()}\n`
            } 

        } else if (this.isGift(target)) { // If Gift
            embed.setTitle("New Daily Gift!")
            const locationResult: DailyResult = this.findLocation(target)!
            const itemResult: DailyResult = this.findItem(target)
            const enemyResult: DailyResult = this.findEnemy(target)
            const npcResult: DailyResult = this.findNPC(target)
            const questResult: DailyResult = this.findQuest(target)
            
            if (this.hasValue(enemyResult)) {
                content += `**Enemy**: [${enemyResult.value}](${this.wikiLinkifier(enemyResult.value!)})\n`
            }
            if (this.hasValue(npcResult)) {
                content += `**NPC**: ${npcResult.value}\n`
            }
            if (this.hasValue(questResult)) {
                if (locationResult.type !== "quest") {
                    if (this.hasValue(locationResult)) {
                        content = `**${this.capitalize(locationResult.type)}**: ${locationResult.value}\n` + content
                    } 
                }
                content += `**Quest**: ${questResult.value}\n`
            } else {
                if (this.hasValue(locationResult)) {
                    content = `**${this.capitalize(locationResult.type)}**: ${locationResult.value}\n` + content
                } 
            }
            content += `**Date**: ${this.getDate(date)}\n`
            if (this.hasValue(itemResult)) {
                content += `**Item**: ${itemResult.value}\n`
            }
            console.log("what")
           
        }

        embed.setDescription(content)

        // Send to Channel
        for (const channelID in this.base.dailyChannels) {
            let loginChannel = await this.client.channels.cache.get(this.base.dailyChannels[channelID].channel) as TextChannel

            try {
                if (this.base.dailyChannels[channelID].hasOwnProperty('role') && this.base.dailyChannels[channelID].role != "") {
                    await loginChannel.send({ content: `\n<@&${this.base.dailyChannels[channelID].role}>` })
                }
                await loginChannel.send({ embeds: [embed] })
            } catch (error) {
                console.log("[Twitter] Error:> ", error)
            }

        }
    }
    
    private capitalize(value) {
        if (!value) return "";
        return value
            .split(" ")
            .map(val => val.charAt(0).toUpperCase() + val.slice(1))
            .join(" ");
    };

    private hasValue(obj: DailyResult) {
        if (obj.value == null || obj.value == "none") return false
        return true
    }

    private getDate(date: Date) {
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'})
    }

    private wikiLinkifier(name: string) {
        return "http://aqwwiki.wikidot.com/" + name.trim().replace(/  /g, ' ').replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '').toLowerCase()
    }


    private isGift(target: string) {
        for (const check of this.gift_check) {
            if (target.includes(check)) return true
            if ((target).includes(check + "s")) return true
            if ((target).includes(check + "!")) return true
            if ((target).includes(check + "s!")) return true
        }
        return false
    }

    private isBoost(target: string) {
        for (const check of this.boost_check) if (target.includes(check)) return true
        return false
    }

    private isBlackListed(target: string) {
        for (const check of this.black_list) if (target.includes(check)) return true
        return false
    }



    private findLocation(str: string) {
        /*Gets the location where the daily-gift, (item, shop, quest) can be found.*/
        const target: string = str.replace("https://t.co/", "").replace("log in", "")

        // Pre-defined matches
        if (target.includes("battleontown")) return { type: "map", value: "/battleontown" }

        // Direct match
        var location_raw: string = ""
        var result = target.match(/\s\/(.*?)(\.|\s|!)/)

        if (result !== null && result[0].includes("/")) {
            location_raw = result![0].trim()
        }

        // Indirect matches
        if (result == null || !result[0].includes("/")) {
            result = target.match(/( boss battle in the | in your | available now in the | battle in the | in the | in \/|\sin\s)(.*?)( to collect | map for a chance | map to collect | map to find| until | to find |\.| \(|\!| for a chance | to get the rare | to get the | map | quest | and )/)

            if (result === null || result![2] === undefined) {
                // Try different
                result = target.match(/(complete | in your | in the )(.*?)( to choose one | quest in the |quest in | quest | and )/)

                // return if empty
                if (result === null || result![2] === undefined) return { type: "map", value: null }
            }

            location_raw = result![2].trim()
        }

        // If Shop
        if (location_raw.includes("shop")) {
            return { type: "shop", value: this.capitalize(location_raw.replace("/", "")) }
        }

        // If Quest
        if ((target.includes(" quests ") || target.includes(" quest ")) && location_raw.includes(" ")) {
            return { type: "quest", value: this.capitalize(location_raw.replace(/\"/g, "")) + " Quest" }
        }

        // Return
        if (!location_raw.startsWith("/")) {
            location_raw = "/" + location_raw
        }

        return { type: "map", value: location_raw }
    }

    private findItem(str: string) {
        const target = str
        var result = target.match(/(to get seasonal | to get this seasonal | collect all |to collect| to find our|to find the|find the|to find|find her|find her|for a chance to get the|for a chance to get our|for a chance to get|0 AC|this seasonal|to get the|a host of)(.*?)((\!)|(\.)|(\!|in your|dropping from his|dropping in|as we celebrate| available now |as we head into|in the|in her|in his shop|in her shop|as we lead up|until|in your))/)
        if (result == null || result[2] == undefined) {
            result = target.match(/(pieces of the |to collect all |find the full|\sfor\s|one of the new|to find)(.*?)(\.|\!|available|\,|in his shop)/)

            if (result == null || result[2] == undefined) {
                return { type: "item", value: null }
            }
        }
        var item_raw = this.capitalize(result[2].trim()).replace(/\sAc\s/g, " AC ")
        return { type: "item", value: item_raw }
    }

    private findEnemy(str: string) {
        var target = str
        // Check if has Enemy
        const enemy_check = ["battle", "defeat", "fight", "kill"]
        let true_enemy: boolean = false
        for (const check of enemy_check) {
            if (target.includes(check)) {
                true_enemy = true
                break
            }
        }
        if (!true_enemy) return { type: "enemy", value: "none" }

        var result = target.match(/(\sdefeat the\s| battle the | battle | defeat | fight |defeat the)(.*?)(for reward gear|\sfor reward gear\,\s|in |in the\s\/|in\s\/|the\s|\/)/)
        // console.log(result)
        if (result == null || result[2] == undefined) {
            result = target.match(/(\sbattle the\s)(.*?)(\sin\s)/)

            if (result == null || result[2] == undefined) {
                return { type: "enemy", value: null }
            }
        }
        var enemy_raw = this.capitalize(result![2])
        return { type: "enemy", value: enemy_raw }
    }

    private findNPC(str: string) {
        var target = str
        // NPC Check
        const enemy_check = ["talk to", "talk", "complete"]
        let true_npc: boolean = false
        for (const check of enemy_check) {
            if (target.includes(check)) {
                true_npc = true
                break
            }
        }
        if (!true_npc) return { type: "npc", value: "none" }

        var result = target.match(/(talk to|complete the|complete )(.+?)(\sin\s|\, in|\'s|\s\")/)
        if (result == null || result[2] == undefined) {
            return { type: "npc", value: null }
        }
        var npc_raw = this.capitalize(result![2].trim())
        return { type: "npc", value: npc_raw }

    }

    private findQuest(str: string) {
        var target = str

        // Quest Check
        const quest_check = ["quest", "quests"]
        let true_quest: boolean = false
        for (const check of quest_check) {
            if (target.includes(check)) {
                true_quest = true
                break
            }
        }
        if (!true_quest) return { type: "quest", value: "none" }

        var result = target.match(/(\'s\s|\s\"|\s\"\s)(.*?)(quest|quest\!|quests|quests!)/)
        if (result == null || result[2] == undefined) {
            return { type: "quest", value: null }
        }


        var npc_raw = this.capitalize(result![2].trim().replace(/\"/g, ""))

        return { type: "quest", value: npc_raw }

    }

    private findBoost(str: string) {
        var target = str

        var result = target.match(/(happening now\:|double|hour)(.*?)(on all servers|until|through|\!|\.)/)

        if (result == null || result[2] == undefined) {
            return { type: "boost", value: null }
        }

        var boost_raw = this.capitalize(result![2].trim().replace(/\"/g, ""))

        for (const rep of this.boostReplaceList) {
            boost_raw = boost_raw.replace(rep.target, rep.replace)
        }

        return { type: "boost", value: boost_raw }
    }

    private findDuration(str: string) {
        var target = str

        var result = target.match(/(\d\d)/)
        if (result == null) {
            return { type: "duration", value: null }
        }

        var time_raw = result[0].trim()

        return { type: "duration", value: time_raw }
    }



 }