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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class GuideCog {
    constructor(client, base) {
        this.client = client;
        this.base = base;
        // Class Metadata
        this.description = "The Class Containing the Guide Commands";
        // Class Variables
        this.files = {};
        this.guideHeaders = {};
        this.files = base.files;
        // Remove outdated guides
        for (let guide in this.files["guides"]) {
            if (this.files["guides"][guide] === "header")
                continue;
            if (("status" in this.files["guides"][guide]) && this.files["guides"][guide]["status"] == "outdated") {
                delete this.files["guides"][guide];
            }
        }
        // Create Guide list sorted by Categories
        let guideList = [];
        for (let guide in this.files["guides"]) {
            if (this.files["guides"][guide] == "header") {
                this.guideHeaders[guide] = guideList;
                guideList = [];
                continue;
            }
            else {
                guideList.push(guide);
            }
        }
        // Command register
        this.base.registerCommand(this.cmdGuide.bind(this), {
            name: 'g',
            description: 'Shows the guide list',
            options: [{
                    name: 'guidename',
                    description: "Enter a specific guide from the guide list.",
                    required: false,
                    type: base.dTypes.STRING,
                }]
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
    cmdGuide(mode, source, defered = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var args;
            var embed;
            // Args check
            switch (mode) {
                case "slash":
                    let { options } = source;
                    args = options.getString("guidename");
                    if (args) {
                        embed = yield this.getGuideEmbed(args, source);
                    }
                    break;
                case "legacy":
                    args = this.base.ContentSplit(source.content);
                    if (args.length != 1) {
                        embed = yield this.getGuideEmbed(args[1], source);
                    }
                    break;
            }
            // Found a guide. Send it.
            if (embed) {
                yield this.base.reply({ embeds: [embed] }, source, defered);
                return;
            }
            // Just send the glist
            embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle('Guide Commands')
                .setDescription('To summon this list, use `g`.\n To know all Bloom Bot commands, use `bhelp`.\n\u200b');
            let text = "";
            for (const [key, value] of Object.entries(this.files["guides"])) {
                if (this.files["guides"][key] == "header") {
                    embed.addField(key, `${text}\u200b`);
                    text = "";
                    continue;
                }
                else {
                    if (("ignore" in this.files["guides"][key]) && (this.files["guides"][key]["ignore"] == true))
                        continue;
                }
                text += `\`${this.base.prefix}g ${key}\` -  ${this.files["guides"][key]["title"]}\n`;
            }
            text = this.base.removeLastOccurance(text, "\n");
            yield this.base.reply({ embeds: [embed] }, source, defered);
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
    printHeader() {
        for (let i in this.guideHeaders) {
            console.log(`${i}: ${this.guideHeaders[i]}`);
        }
    }
    getGuideSuggest(name, source) {
        return __awaiter(this, void 0, void 0, function* () {
            let embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle("Guide Not Found")
                .setDescription(`I'm sorry, the guide name \`${this.base.prefix}g ${name}\` does not exists. Maybe these?`);
            // Search for possible guide names
            let possibleGuides = {};
            for (let header in this.guideHeaders) {
                for (let i in this.guideHeaders[header]) {
                    let guide = this.guideHeaders[header][i];
                    if (guide.includes(name) || name.includes(guide)) {
                        if (!(header in possibleGuides)) {
                            possibleGuides[header] = [];
                        }
                        possibleGuides[header].push(`\`${this.base.prefix}g ${guide}\` - ${this.files["guides"][guide]["title"]}`);
                    }
                }
            }
            // If no possible guides, return
            if (Object.keys(possibleGuides).length === 0) {
                embed.setDescription(`I'm sorry, the guide name \`${this.base.prefix}g ${name}\` does not exists.`);
                return embed;
            }
            // Else return embed list
            for (let header in possibleGuides) {
                embed.addField(header, this.base.combineStrArray(possibleGuides[header]));
            }
            return embed;
        });
    }
    getGuideEmbed(name, source) {
        return __awaiter(this, void 0, void 0, function* () {
            var embed;
            // Validity Check
            name = name.toLowerCase().trim();
            if (!(name in this.files["guides"]) || (this.files["guides"][name] == "header")) {
                embed = yield this.getGuideSuggest(name, source);
                return;
            }
            // Embed Creation
            let gItem = this.files["guides"][name];
            embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle(`${gItem["title"]} `)
                .setDescription("Test");
            // Author Check
            if ("auth" in gItem) {
                let auths = this.base.files["resources"]["auths"];
                embed.setAuthor(auths[gItem["auth"]]["author"], auths[gItem["auth"]]["image"]);
            }
            // Description Check
            if (typeof gItem["description"] === 'string' || gItem["description"] instanceof String) {
                embed.setDescription(gItem["description"]);
            }
            else {
                embed.setDescription(this.base.combineStrArray(gItem["description"]));
            }
            // Field Check
            if ("fields" in gItem) {
                for (var field in gItem["fields"]) {
                    embed.addField(field, this.base.combineStrArray(gItem["fields"][field]));
                }
            }
            // Inline Field check
            if ("fieldsInline" in gItem) {
                for (var field in gItem["fieldsInline"]) {
                    embed.addField(field, this.base.combineStrArray(gItem["fieldsInline"][field]), true);
                }
            }
            // Image Check
            if ("image" in gItem)
                embed.setImage(gItem["image"]);
            // Thumbnail Check
            if ("thumbnail" in gItem)
                embed.setThumbnail(gItem["thumbnail"]);
            return embed;
        });
    }
}
exports.default = GuideCog;