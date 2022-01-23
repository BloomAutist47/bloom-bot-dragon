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
class PrivateCog {
    constructor(client, base) {
        this.client = client;
        this.base = base;
        // Class Metadata
        this.description = "The Class Containing the Guide Commands";
        // Class Variables
        this.files = {};
        this.files = base.files;
        this.base.registerCommand(this.ping.bind(this), {
            name: 'ping',
            description: 'test command',
            ephemeral: true,
        });
        client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            if (interaction.commandName === 'ping') {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ff3b59")
                    .setTitle("Color Roles")
                    .setAuthor(this.base.files["resources"]["auths"]["auqw"]["author"], this.base.files["resources"]["auths"]["auqw"]["image"])
                    .setDescription("Click on the Select menu to choose a color role for you.")
                    .addField("Colors:", `   ⚫ - <@&867363737883377664>
                                        🤍 - <@&823779840351535124>
                                        🍒 - <@&867363745613480008>
                                        🧧 - <@&843149459931791370>
                                        🧱 - <@&867363741417734154>
                                        🍊 - <@&824243722718937138>
                                        🧿 - <@&867365482629169162>`, true)
                    .addField("\u200b", `📘 - <@&867363737925320764>
                                        ❄️ - <@&867363739401191436>
                                        🥶 - <@&862373263505096704>
                                        💎 - <@&867363744573292564>
                                        🌲 - <@&867363741779361812>
                                        📗 - <@&867363737966477333>
                                        🥬 - <@&867363738809139201>`, true)
                    .addField("\u200b", `☂️ - <@&867363744245743626>
                                        🍆 - <@&867363743489720350>
                                        🎀 - <@&867363742719541309>
                                        🌸 - <@&867363742151606282>
                                        👩 - <@&867363745889255434>
                                        🥜 - <@&867363746941894666>
                                        🍦 - <@&867365482338975764>`, true);
                // const item = client.emojis..emojis.resolveIdentifier('920734782541938738')
                const row1 = new discord_js_1.MessageActionRow()
                    .addComponents(new discord_js_1.MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Choose a color role fellow human!')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                    {
                        label: 'Nigger',
                        description: "So you want a Slave badge?",
                        value: 'nigger  ',
                        emoji: '⚫'
                    },
                    {
                        label: 'W-word',
                        description: 'For the Supreme Cuckold Race',
                        value: 'white',
                        emoji: '🤍'
                    },
                    {
                        label: 'Ruby Red',
                        description: "It's red. But Ruby.",
                        value: 'ruby_red',
                        emoji: '🍒'
                    },
                    {
                        label: 'red',
                        description: 'Just Regular Red',
                        value: 'red',
                        emoji: '🧧'
                    },
                    {
                        label: 'Brick Red',
                        description: "A. Fucking. Brick.",
                        value: 'brick_red',
                        emoji: '🧱',
                    },
                    {
                        label: 'Orange',
                        description: "You peel an orange before eating? gay",
                        value: 'orange',
                        emoji: '🍊',
                    },
                    {
                        label: 'Midnight Blue',
                        description: "This is a shit color contrast to discord dark mode.",
                        value: 'midnight_blue',
                        emoji: '🧿',
                    },
                    {
                        label: 'Blue',
                        description: 'Daddy BlUwU impregnate me with your master seed.',
                        value: 'blue',
                        emoji: '📘',
                    },
                    {
                        label: "Cyan",
                        description: "Gay color",
                        value: "cyan",
                        emoji: '❄️',
                    },
                    {
                        label: "Light Blue",
                        description: "This is almost a passable hex value",
                        value: "light_blue",
                        emoji: '🥶',
                    },
                    {
                        label: "Diamond",
                        description: "Jesus, who made these colors? a woman?",
                        value: "diamond",
                        emoji: '💎',
                    },
                    {
                        label: "Dark Green",
                        description: "What are you, a light mode autist user?",
                        value: "dark_green",
                        emoji: '🌲',
                    },
                    {
                        label: "Green",
                        description: "Good color",
                        value: "green",
                        emoji: '📗',
                    },
                    {
                        label: "Mint Green",
                        description: "Great color",
                        value: "mint_green",
                        emoji: '🥬',
                    },
                    {
                        label: "Dark Purple",
                        description: "Kill yourself",
                        value: "dark_purple",
                        emoji: '☂️',
                    },
                    {
                        label: "Purple",
                        description: "I'm running out of shitposts to write.",
                        value: "purple",
                        emoji: '🍆',
                    },
                    {
                        label: "Dark Fuschia",
                        description: "dark_fushia",
                        value: "dark_fushia",
                        emoji: '🎀',
                    },
                    {
                        label: "Fuschia",
                        description: "Fuschiang Ina mo",
                        value: "fushia",
                        emoji: '🌸',
                    },
                    {
                        label: "Yellow",
                        description: "The yellow girl in power rangers was hot.",
                        value: "yellow",
                        emoji: '👩',
                    },
                    {
                        label: "Hazelnut",
                        description: "DEEZ NUTS MOTHERFUCKER",
                        value: "hazelnut",
                        emoji: '🥜',
                    },
                    {
                        label: "Cream",
                        description: "UwU daddy Kaos please creamy-pie with your trans-grooming skills",
                        value: "cream",
                        emoji: '🍦',
                    }
                ]));
                yield interaction.reply({ ephemeral: true, embeds: [embed], components: [row1] });
            }
        }));
    }
    ping(mode, source) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = PrivateCog;
