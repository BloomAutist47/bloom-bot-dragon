import { Client, MessageAttachment, MessageEmbed } from "discord.js"
import BaseCog from './base'
import fs from 'fs'


export default class TextCog {
    // Class Metadata
    public description = "The Class Containing Text send command"

    // Class Variables
    private files = {}
    private guideHeaders = {}

    constructor(private client: Client, private base: BaseCog) {
        this.files = base.files

        this.base.registerCommand(this.cmdUploadFile.bind(this), {
            name: 'upfile',
            description: 'Send txt to upload',
        }, false, true)

        this.base.registerCommand(this.cmdUploadText.bind(this), {
            name: 'uptext',
            description: 'Upload text list embed',
        }, false, true)


    }

    async cmdUploadText(mode: string, source, defered: boolean = false) {

        // Chekc if Bloom
        if (source.author.id != this.files["resources"]["bloom-id"]) {
            await source.reply("You're not bloom.")
            return
        }

        // Arg check
        const args = this.base.ContentClean(source.content, 'uptext')
        if (args == "") {
            await source.reply("Type a text embed name")
            return
        }
        if (!this.base.files["texts"]["Texts"].hasOwnProperty(args)) {
            await source.reply("Name does not exists")
            return
        }
        
        // Clear Channel First
        await this.clearChat(source)

        // Shortening directory
        const embedData = this.base.files["texts"]["Texts"][args]

        var links = {}
        var count = 1



        // Sending Each Embed Content
        for (const cont in embedData["content"]) {
            let title = cont
            if (args != "botfix") {
                title = `${count}. ${cont}`
            }
            const embed = new MessageEmbed()
                .setColor(this.base.color)
                .setTitle(title)

            if (embedData["content"][cont].hasOwnProperty("text")) {
                embed.setDescription(embedData["content"][cont]["text"])
            }

            if (embedData["content"][cont].hasOwnProperty("image")) {
                embed.setImage(embedData["content"][cont]["image"])
            }

            const item = await source.channel.send({ embeds: [embed] , content: "\u200b"})
            links[title] = `https://discordapp.com/channels/${item.guildId}/${item.channelId}/${item.id}`
            count += 1
        }

        // Creating Table of Content
        const tableEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle(embedData["title"])
            .setDescription(embedData["description"])
        
        // Botfix special treatment
        if (args == "botfix") {
            const botfixLinks: Object = {"Grim":'', "RBot":"", "For Both":""}
            for (const link in links) {
                if (link.includes("(Grim)")) {
                    const title = link.replace("(Grim) ", "")
                    botfixLinks["Grim"] += `[${title}](${links[link]})\n`
                    continue
                }
                if (link.includes("(RBot)")) {
                    const title = link.replace("(RBot) ", "")
                    botfixLinks["RBot"] += `[${title}](${links[link]})\n`
                    continue
                }
                botfixLinks["For Both"] += `[${link}](${links[link]})\n`
            }

            tableEmbed.addField("For Both", botfixLinks["For Both"])
            tableEmbed.addField("Grim", botfixLinks["Grim"])
            tableEmbed.addField("RBot", botfixLinks["RBot"])

            await source.channel.send({ embeds: [tableEmbed] , content: "\u200b"})
            return
        }

        // Appending Links to Table of Content
        let words = ""
        let firstField: boolean = false
        for (const link in links) {
            if (words.length >= 900) {
                if (!firstField) {
                    tableEmbed.addField("Table of Content", words)
                    words = ""
                    firstField = true
                } else {
                    tableEmbed.addField( "\u200b", words)
                    words = ""
                }

            }
            words += `[${link}](${links[link]})\n`
            
        }
        if (words) {
            tableEmbed.addField( "\u200b", words)
        }

        // Send to Channel
        await source.channel.send({ embeds: [tableEmbed] , content: "\u200b"})
    }

    async cmdUploadFile(mode: string, source, defered: boolean = false) {

        // Chekc if Bloom
        if (!this.files["resources"]["textUploadAllowedUsers"].includes(source.author.id)) {
            await source.reply("You're not Allowed to use this cmd.")
            return
        }

        // Attachment check
        if(!source.attachments.first()) {
            await source.reply("Please add a txt file only")
            return
        }
        
        // Check if ,txt
        const url = source.attachments.first().url
        const filename = url.split("/").at(-1)
        if (filename.split(".").at(-1) !== "txt") {
            await source.reply("Only .txt files")
            return 
        }
        
        // Process text for sending
        const data = await this.base.getWebData(url)
        console.log(data)
        const texts = data.split("\n")
        let textList: Array<string> = []
        let textRaw: string = ""
        for (const text of texts) {
            if (textRaw.length >= 1800) {
                textList.push(textRaw)
                textRaw = ""
            }
            textRaw += text + "\n"
        }
        if (textRaw !== "") {
            textList.push(textRaw)
        }

        // Create new channel and delete old channel
        const channel = await source.channel.clone()
        await source.channel.delete()

        for (const text of textList) {
            await channel.send(text)
        }

        console.log("[Text]: Done Uploading")
            
        const attachment = new MessageAttachment(Buffer.from(data, 'utf-8'), filename)
        await channel.send({files: [attachment]})

        
    }

    async clearChat (source) {
        const channel = source.channel;
        const messageManager = channel.messages;
        const messages = await messageManager.channel.messages.fetch({ limit: 100 });
        await channel.bulkDelete(messages,true);
    
    }

}
