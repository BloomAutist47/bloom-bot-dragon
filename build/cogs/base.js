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
const path_1 = __importDefault(require("path"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("./database"));
const jsonfile = require('jsonfile');
class DInteraction {
    constructor(source) {
        this.source = source;
    }
    reply(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.source.editReply(dataObj);
        });
    }
}
class BaseCog {
    constructor(client, fileList, commands) {
        this.client = client;
        this.fileList = fileList;
        this.commands = commands;
        // Class Metadata
        this.description = "The Base Class with common methods shared by all cogs";
        // Class Variables
        this.files = {};
        this.dTypes = discord_js_1.Constants.ApplicationCommandOptionTypes;
        this.prefix = "'";
        this.color = '#44FC75';
        this.database = new database_1.default(this);
        this.commandList = {};
        // Registered Channels
        this.dailyChannels = [];
        this.aqwChannels = [];
        this.auqwChannels = [];
        client.on('shardError', error => {
            console.error('A websocket connection encountered an error:', error);
        });
        process.on('unhandledRejection', error => {
            console.error('Unhandled promise rejection:', error);
        });
        process.on('requestError', error => {
            console.error('Shayt:', error);
        });
        process.on('uncaughtException', function (err) {
            console.error(err.stack);
            console.log("Node NOT Exiting...");
        });
        // process.on('ESOCKETTIMEDOUT', error => {
        //     console.log("THIS HSIT AGAIN FUCK")
        // })
    }
    registerCommand(func, slashData, defered = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.commands) === null || _a === void 0 ? void 0 : _a.create(slashData);
            this.commandList[slashData.name] = { func: func, data: slashData, defered: defered };
        });
    }
    createListener() {
        return __awaiter(this, void 0, void 0, function* () {
            // Start Database
            // await this.database.start()
            // Create Discord Listeners
            this.client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
                if (!interaction.isCommand())
                    return;
                const prefix = interaction.commandName;
                if (!(prefix in this.commandList))
                    return;
                if (this.commandList[prefix].defered) {
                    yield interaction.deferReply();
                }
                try {
                    yield this.commandList[prefix].func("slash", interaction, this.commandList[prefix].defered);
                }
                catch (err) {
                    if (this.commandList[prefix].defered) {
                        yield interaction.editReply(`${err}`);
                        return;
                    }
                    else {
                        yield interaction.reply(`${err}`);
                    }
                }
            }));
            this.client.on("messageCreate", (msg) => __awaiter(this, void 0, void 0, function* () {
                let prefix = msg.content.trim().split(" ")[0].replace(this.prefix, "").trim();
                if (!(prefix in this.commandList))
                    return;
                try {
                    yield this.commandList[prefix].func("legacy", msg, this.commandList[prefix].defered);
                }
                catch (err) {
                    yield msg.reply(`${err}`);
                }
            }));
        });
    }
    reply(data, source, defered = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (source instanceof discord_js_1.Message) {
                yield source.reply(data);
                return;
            }
            if (source instanceof discord_js_1.CommandInteraction && defered) {
                yield source.editReply(data);
            }
            else {
                source.reply(data);
            }
        });
    }
    getWebsite(url, tries = 5, parseData = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let tryCount = 0;
            while (true) {
                if (tryCount >= tries)
                    return NaN;
                try {
                    return axios_1.default.get(url)
                        .then(res => {
                        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
                        console.log('[http] Status Code:', res.status);
                        console.log('[http] Date in Response header:', headerDate);
                        if (!parseData) {
                            return res;
                        }
                        return cheerio_1.default.load(res.data);
                    })
                        .catch(err => {
                        return NaN;
                    });
                }
                catch (error) {
                    tryCount += 1;
                    continue;
                }
            }
        });
    }
    getWebData(url, tries = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(url)
                .then(res => {
                return res.data;
            })
                .catch(err => {
                console.log(err);
            });
        });
    }
    // Reads Json files
    readData() {
        let curPath = path_1.default.join(__dirname, '../');
        for (let i = 0; i < this.fileList.length; i++) {
            jsonfile.readFile("./data/" + this.fileList[i] + ".json", 'utf8', (err, data) => {
                if (err)
                    throw (err);
                this.files[this.fileList[i]] = data;
                console.log(`[File]: Finished reading ${this.fileList[i]}`);
            });
        }
    }
    ;
    // Sleep in miliseconds
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Checks if cmd uses right prefix
    isPrefixed(entry, cmdPrefix) {
        let pref = this.prefix + cmdPrefix;
        if (entry.startsWith(pref + " ") || entry.startsWith(pref))
            return true;
        else
            return false;
    }
    // Removes prefix of cmd and returns string array of parameters
    ContentSplit(entry) {
        let _rawList = entry.replace(this.prefix, '').split(" ");
        let result = [];
        for (let item of _rawList) {
            console.log(item);
            result.push(item);
        }
        return result;
    }
    ContentClean(entry, cmdPrefix) {
        return entry.replace(this.prefix + cmdPrefix, "").trim();
    }
    combineStrArray(str, removeLastLine = true) {
        if (str.length == 1)
            return str[0];
        var result = "";
        for (let i in str) {
            result += str[i] + "\n";
        }
        if (removeLastLine)
            result = this.removeLastOccurance(result, "\n");
        result += "\u200b";
        return result;
    }
    removeLastOccurance(str, char) {
        var pos = str.lastIndexOf(char);
        return str.substring(0, pos) + str.substring(pos + 1);
    }
    simpleEmbedMsg(title, message) {
        return new discord_js_1.MessageEmbed()
            .setColor(this.color)
            .setTitle(title)
            .setDescription(message);
    }
}
exports.default = BaseCog;
