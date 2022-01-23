"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const base_1 = __importDefault(require("./cogs/base"));
const general_1 = __importDefault(require("./cogs/general"));
const guide_1 = __importDefault(require("./cogs/guide"));
const classes_1 = __importDefault(require("./cogs/classes"));
const aqw_1 = __importDefault(require("./cogs/aqw"));
const private_1 = __importDefault(require("./cogs/private"));
const reddit_1 = __importDefault(require("./cogs/reddit"));
const twitter_1 = __importDefault(require("./cogs/twitter"));
process.env.UV_THREADPOOL_SIZE = '128';
dotenv_1.default.config();
// Setup
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
    ]
});
var fileList = ["guides", "auqw", "classes", "resources"];
var baseCog = new base_1.default(client, fileList);
baseCog.readData();
// Commands
client.on("ready", () => {
    var _a;
    // Platform & Slash Command Setup
    if (process.platform == "win32") {
        baseCog.commands = client.guilds.cache.get("761956630606250005").commands;
        baseCog.prefix = "'";
    }
    else {
        baseCog.commands = (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands;
        baseCog.prefix = ";";
    }
    // Cogs
    new guide_1.default(client, baseCog);
    new classes_1.default(client, baseCog);
    new general_1.default(client, baseCog);
    new aqw_1.default(client, baseCog);
    new private_1.default(client, baseCog);
    new reddit_1.default(client, baseCog);
    new twitter_1.default(client, baseCog);
    baseCog.createListener();
    // Start
    baseCog.delay(2000);
    console.log(`[System] Logged in as ${client.user.tag}.`);
    const loginChannel = client.channels.cache.get('830702959679373352');
    const date = new Date(Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    loginChannel.send(`**Deployed**: Bloom-${process.env.mode} | \`${date}\``);
});
client.login(process.env.TOKEN);
