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
class ClassCog {
    constructor(client, base) {
        this.client = client;
        this.base = base;
        // Class Metadata
        this.description = "The Class Containing the Classes Commands";
        // Class Variables
        this.files = {};
        this.classAcronyms = {};
        this.classDuplicates = {};
        this.classLowered = {};
        this.files = base.files["classes"];
        // Create Acronym and Duplicate Dictionary List
        for (let className in this.files) {
            for (let acronym of this.files[className]["acronym"]) {
                this.classAcronyms[acronym.toLowerCase()] = className;
            }
            for (let duplicate of this.files[className]["duplicates"]) {
                this.classDuplicates[duplicate.toLowerCase()] = { "original": className, "uppercasename": duplicate };
            }
            this.classLowered[className.toLowerCase()] = className;
        }
        // Command register
        this.base.registerCommand(this.cmdClassSearch.bind(this), {
            name: 'c',
            description: 'Returns an AQW Class Chart containing Class Data, Stats, How-to-get, etc...',
            options: [{
                    name: 'classname',
                    description: "Enter a specific class to view their Stats Chart.",
                    required: true,
                    type: base.dTypes.STRING,
                }]
        });
        this.base.registerCommand(this.cmdLegends.bind(this), {
            name: 'legends',
            description: 'Shows the Class Chart Legends.',
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
    cmdClassSearch(mode, source, defered = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // Args check
            var args_;
            var result;
            var embed;
            switch (mode) {
                case "slash":
                    let { options } = source;
                    args_ = options.getString("classname").trim();
                    break;
                case "legacy":
                    args_ = this.base.ContentClean(source.content, "c");
                    break;
            }
            var args = args_.toLowerCase().trim();
            // Validity Check
            if (args.length == 0) {
                let embed = this.base.simpleEmbedMsg("Cannot Find Class", `Please add atleast two char to search a class, i.e. \`${this.base.prefix}c className\``);
                yield this.base.reply({ embeds: [embed] }, source, defered);
                return;
            }
            while (true) {
                // Checks Acronym
                if (args.length <= 4) {
                    result = yield this.findAcronym(args);
                    if (result)
                        break;
                }
                // Checks Exact name
                if (args in this.classLowered) {
                    result = this.classLowered[args];
                    break;
                }
                // Checks Duplicates
                result = yield this.findDuplicate(args);
                if (result)
                    break;
                // Checks Acronym again
                result = yield this.findAcronym(args);
                if (result)
                    break;
                break;
            }
            // There's a result
            if (result) {
                embed = yield this.findClassContent(result);
                // Find Alternatives
            }
            else {
                embed = yield this.findSuggestions(args_);
            }
            yield this.base.reply({ embeds: [embed] }, source, defered);
            return;
        });
    }
    cmdRankSearch(mode, source, defered = false) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    cmdLegends(mode, source, defered = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle("Class Legends")
                .setImage(this.base.files["resources"]["images"]["legends"])
                .setAuthor(this.base.files["resources"]["auths"]["aqw"]["author"], this.base.files["resources"]["auths"]["aqw"]["image"])
                .setDescription(`Thanks to Shiminuki and Molevolent for\nthe [Class Tier List](https://docs.google.com/spreadsheets/d/1Ywl9GcfySXodGA_MtqU4YMEQaGmr4eMAozrM4r00KwI/edit?usp=sharing) and to the AuQW!\nUse \`${this.base.prefix}credits\` to see their Links`);
            yield this.base.reply({ embeds: [embed] }, source, defered);
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
    findClassContent(className) {
        return __awaiter(this, void 0, void 0, function* () {
            var embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle(`${className}`)
                .setURL(this.files[className]["wiki"])
                .setImage(this.files[className]["discord_url"])
                .setAuthor(this.base.files["resources"]["auths"]["aqw"]["author"], this.base.files["resources"]["auths"]["aqw"]["image"])
                .setFooter("Use [  ;legends  ] and  [  ;credits  ]");
            // Add duplicates
            if ("duplicates" in this.files[className] && this.files[className]["duplicates"].length != 0) {
                let text = "```YAML\n";
                for (let duplicate of this.files[className]["duplicates"]) {
                    text += "➣ " + duplicate + "\n";
                }
                text += "```";
                embed.addField("Duplicates:", text);
            }
            return embed;
        });
    }
    findAcronym(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args in this.classAcronyms) {
                return this.classAcronyms[args];
            }
            else
                return NaN;
        });
    }
    findDuplicate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let duplicate in this.classDuplicates) {
                if (duplicate === args) {
                    return this.classDuplicates[duplicate]["original"];
                }
            }
            return NaN;
        });
    }
    findSuggestions(args_) {
        return __awaiter(this, void 0, void 0, function* () {
            let args = args_.toLowerCase().trim();
            let argsItems = args.split(" ");
            let suggestions = [];
            // Break down search content 1
            for (let className_ of argsItems) {
                let className = className_.toLowerCase().trim();
                if (className in this.classAcronyms && !(this.classAcronyms[className] in suggestions))
                    suggestions.push(this.classAcronyms[className]);
                if (className in this.classDuplicates && !(this.classDuplicates[className] in suggestions))
                    suggestions.push(this.classDuplicates[className]);
                if (className in this.classLowered && !(this.classLowered[className] in suggestions))
                    suggestions.push(this.classLowered[className]);
                // Second search
                // Search Acronym match
                for (let classEntry_ in this.classAcronyms) {
                    if (suggestions.includes(this.classAcronyms[classEntry_]))
                        continue;
                    let classEntry = classEntry_.toLowerCase();
                    if (classEntry.includes(className) || className.includes(classEntry)) {
                        suggestions.push(this.classAcronyms[classEntry]);
                    }
                }
                // Search Duplicate Match
                for (let classEntry_ in this.classDuplicates) {
                    if (suggestions.includes(this.classDuplicates[classEntry_]["uppercasename"]))
                        continue;
                    let classEntry = classEntry_.toLowerCase();
                    if (classEntry.includes(className) || className.includes(classEntry)) {
                        suggestions.push(this.classDuplicates[classEntry_]["uppercasename"]);
                    }
                }
                // Search lowered char match
                for (let classEntry_ in this.classLowered) {
                    if (suggestions.includes(this.classLowered[classEntry_]))
                        continue;
                    let classEntry = classEntry_.toLowerCase();
                    if (classEntry.includes(className) || className.includes(classEntry)) {
                        suggestions.push(this.classLowered[classEntry_]);
                    }
                }
            }
            // No result
            if (suggestions.length === 0) {
                return this.base.simpleEmbedMsg("Cannot Find Class", `The Class Name \`${args_}\` does not exists.`);
            }
            // Yes result
            let fieldTexts = [];
            let count = 0;
            suggestions.sort((one, two) => (one < two ? -1 : 1));
            for (let suggestClass of suggestions) {
                if (fieldTexts[count] == undefined) {
                    fieldTexts[count] = "```YAML\n";
                }
                if (fieldTexts.length >= 900) {
                    fieldTexts[count] += "```";
                    count += 1;
                }
                fieldTexts[count] += `➣ ${suggestClass}\n`;
            }
            fieldTexts[count] += "```";
            // Create embed
            let embed = new discord_js_1.MessageEmbed()
                .setColor(this.base.color)
                .setTitle("Nothing found")
                .setDescription(`Sorry, nothing came up with your search word \`${args}\`. Maybe one of these?`);
            for (let fieldText of fieldTexts) {
                embed.addField("Suggestions", fieldText);
            }
            return embed;
        });
    }
}
exports.default = ClassCog;
