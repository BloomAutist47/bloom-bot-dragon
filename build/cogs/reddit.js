"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const snoowrap_1 = __importDefault(require("snoowrap"));
const snoostorm_1 = require("snoostorm");
class RedditCog {
    constructor(client, base) {
        this.client = client;
        this.base = base;
        // Class Metadata
        this.description = "The Class Containing the Guide Commands";
        // Datas
        this.redditdb = { "AutoQuestWorlds": "r/auqw", "AQW": "r/aqw", "FashionQuestWorlds": "r/fqw" };
        this.start();
        this.base.registerCommand(this.cmdRegisterChannel.bind(this), {
            name: 'register_raqw',
            description: 'Administrator only command. Set this channel to receive r/AQW live stream of new posts',
        });
        this.base.registerCommand(this.cmdUnregisterChannel.bind(this), {
            name: 'unregister_raqw',
            description: 'Administrator only command. Remove this channel from r/AQW live stream of new posts',
        });
    }
    /*==============================================================================================================
                                                                                                   
                         ██████╗ ██████╗ ███╗   ███╗███╗   ███╗ █████╗ ███╗   ██╗██████╗ ███████╗
                        ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝
                        ██║     ██║   ██║██╔████╔██║██╔████╔██║███████║██╔██╗ ██║██║  ██║███████╗
                        ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║╚════██║
                        ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝███████║
                         ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝
                                                                                                 
    ==============================================================================================================*/
    cmdRegisterChannel(mode, source) {
        return __awaiter(this, void 0, void 0, function* () {
            // Permission Check
            if (!source.member.permissionsIn(source.channel).has("ADMINISTRATOR")) {
                yield source.reply("\`[Error]\`: You do not have administrator permission in this channel to use `register_raqw` command.");
                return;
            }
            // Variables
            const channelID = String(source.channel.id).trim();
            const guildID = String(source.guild.id);
            if (this.base.aqwChannels.hasOwnProperty(guildID) && channelID == this.base.aqwChannels[guildID]) {
                yield source.reply(`** __Register Reddit Feed__ **\n\`Status\`: This Channel is already registered.`);
                return;
            }
            // Validity
            var status = "\`Status\`: Registered";
            if (this.base.aqwChannels.hasOwnProperty(guildID) && this.base.aqwChannels[guildID].trim() != "") {
                status += `\n\`Notice\`: Replacing Previous Channel <#${this.base.aqwChannels[guildID]}>`;
            }
            // Add it
            this.base.aqwChannels[guildID] = channelID;
            const result = yield this.base.database.dbUpdate("settings.webhooks", { _id: "aqw_webhooks" }, { $set: { urls: this.base.aqwChannels } });
            yield source.reply(`**__Register Reddit Feed__**\n\`Channel\`: <#${channelID}>\n${status}`);
            return;
        });
    }
    cmdUnregisterChannel(mode, source) {
        return __awaiter(this, void 0, void 0, function* () {
            // Permission Check
            if (!source.member.permissionsIn(source.channel).has("ADMINISTRATOR")) {
                yield source.reply("\`[Error]\`: You do not have administrator permission in this channel to use `unregister_raqw` command.");
                return;
            }
            // Variables
            const guildID = String(source.guild.id);
            // Validity
            if (!this.base.aqwChannels.hasOwnProperty(guildID)) {
                yield source.reply(`** __Unregister Reddit Feed__ **\n\`Status\`: No registered Feed Channel.`);
                return;
            }
            // Delete it
            const channelID = this.base.aqwChannels[guildID];
            delete this.base.aqwChannels[guildID];
            // Upload Change
            const result = yield this.base.database.dbUpdate("settings.webhooks", { _id: "aqw_webhooks" }, { $set: { urls: this.base.aqwChannels } });
            // Reply
            yield source.reply(`**__Unregister Reddit Feed__**\n\`Channel\`: <#${channelID}>\n\`Status\`: Removed`);
            return;
        });
    }
    /*==============================================================================================================
                                                                                                       
                            ██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗███████╗███████╗
                            ██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝██║██╔════╝██╔════╝
                            ██║   ██║   ██║   ██║██║     ██║   ██║   ██║█████╗  ███████╗
                            ██║   ██║   ██║   ██║██║     ██║   ██║   ██║██╔══╝  ╚════██║
                            ╚██████╔╝   ██║   ██║███████╗██║   ██║   ██║███████╗███████║
                             ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝
                                                                                        
    ==============================================================================================================*/
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get account details
            var account = yield this.base.database.dbRead("settings.accounts", { _id: "reddit_account" });
            // Get channels
            yield this.getAQWChannels();
            // AQW
            try {
                this.redditclient = yield new snoowrap_1.default(account);
                this.submissions = new snoostorm_1.SubmissionStream(this.redditclient, {
                    subreddit: "AQW+FashionQuestWorlds+AutoQuestWorlds",
                    // limit: 10,
                    pollTime: 2000,
                });
                this.submissions.on("item", this.submissionStream.bind(this));
            }
            catch (error) {
                console.log("[Reddit]: Restart");
                yield this.start();
            }
        });
    }
    getAQWChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            this.base.aqwChannels = (yield this.base.database.dbRead("settings.webhooks", { _id: "aqw_webhooks" })).urls;
            this.base.auqwChannels = (yield this.base.database.dbRead("settings.webhooks", { _id: "auqw_webhooks" })).urls;
        });
    }
    submissionStream(subObj) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Validation
            const subreddit = subObj.subreddit.display_name;
            const subExists = yield this.base.database.dbRead(`logger.${this.redditdb[subreddit]}`, { _id: subObj.id }, true);
            if (subExists)
                return;
            // Metadata
            const date = new Date(subObj.created_utc * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            const author = subObj.author.name;
            const title = subObj.title;
            const link = `https://www.reddit.com${subObj.permalink}`;
            const content = subObj.selftext.replace("&#x200B;", "").trim();
            let note = "";
            // Image
            let image;
            if (subObj.hasOwnProperty('post_hint')) {
                if (subObj.post_hint === "image") {
                    image = subObj.url;
                }
            }
            // Gallery
            if (subObj.hasOwnProperty('is_gallery')) {
                note = "Is a Gallery";
            }
            // Video
            let thumbnail;
            if (subObj.media != null) {
                note = "Is a Video";
                // Is reddit video?
                if (subObj.is_video) {
                    thumbnail = subObj.thumbnail;
                }
                else {
                    // Is Youtube video?
                    if (((_a = subObj.media) === null || _a === void 0 ? void 0 : _a.type) == "youtube.com") {
                        image = (_b = subObj.media.oembed) === null || _b === void 0 ? void 0 : _b.thumbnail_url;
                    }
                }
            }
            console.log(link);
            // Upload
            const result = yield this.base.database.dbInsert(`logger.${this.redditdb[subreddit]}`, { _id: subObj.id,
                author: author,
                title: title,
                date: date,
                link: link,
                content: content,
                image: image,
                thumbnail: thumbnail,
                note: note
            });
            // Create Embed
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setAuthor(`r/${subreddit}`, this.base.files["resources"]["reddit"][subreddit])
                .setThumbnail(thumbnail)
                .setURL(link)
                .setImage(image)
                .setFooter(note)
                .addFields({ name: "Author:", value: `[u/${author}](https://www.reddit.com/user/${author}/)`, inline: true }, { name: 'Date:', value: date, inline: true });
            // Title
            if (title.length >= 256) {
                embed.setTitle(title.substring(0, 252) + "...");
                console.log("YEs long name");
            }
            else {
                embed.setTitle(title);
            }
            // Content Spliiting
            if (content) {
                if (content.length <= 950) {
                    embed.addField("Content:", content, false);
                }
                else {
                    const contents = content.match(/.{1,1020}/g);
                    let title = "\u200b";
                    let first = true;
                    let length = 0;
                    for (let con of contents) {
                        if (con.trim() === '')
                            continue;
                        // Checks if embed is too big
                        if (length >= 5000) {
                            console.log("TOO BIG");
                            break;
                        }
                        length += con.length;
                        if (first) {
                            first = false;
                            embed.addField("Content:", con, false);
                            continue;
                        }
                        embed.addField(title, con, false);
                        title += "\u200b";
                    }
                }
            }
            // Send to Channel
            switch (subreddit) {
                case "AutoQuestWorlds":
                    for (const channelID in this.base.auqwChannels) {
                        let loginChannel = yield this.client.channels.cache.get(this.base.aqwChannels[channelID]);
                        yield loginChannel.send({ embeds: [embed] });
                    }
                    break;
                case "AQW":
                case "FashionQuestWorlds":
                    for (const channelID in this.base.aqwChannels) {
                        let loginChannel = yield this.client.channels.cache.get(this.base.aqwChannels[channelID]);
                        yield loginChannel.send({ embeds: [embed] });
                    }
                    break;
                default:
                    break;
            }
        });
    }
}
exports.default = RedditCog;
