import { Client, MessageEmbed, MessageActionRow, MessageSelectMenu, RoleResolvable, MessageButton } from "discord.js"
import BaseCog from './base'

interface colorObj {
    label: string;
    description: string;
    value: string;
    emoji: string;
}

export default class PrivateCog {
    // Class Metadata
    public description = "The Class Containing the Guide Commands"

    // Class Variables
    private files = {}
    private colorArray: Array<colorObj> = []
    private roleArray: Array<string> = []

    constructor(private client: Client, private base: BaseCog) {
        this.files = base.files
        this.getColors()


        this.base.registerCommand(this.cmdColorRoleEmbed.bind(this), {
            name: 'auqw_color_roles',
            description: 'Test bot',
        }, false, true)

        client.on('interactionCreate', async interaction => {

            if (interaction.isSelectMenu()) {
                if (interaction.customId === 'select') {
                    await interaction.deferReply({ephemeral: true});
                    // Get User Role IDs
                    var userRoles: Array<string> = []
                    await interaction.guild!.roles.cache.forEach(r => {
                        if (this.roleArray.includes(r.id)) {
                            userRoles.push(r.id)
                        }
                    });

                    // Get Member
                    const member = await interaction.guild!.members.fetch(interaction.user.id)

                    // Remove Previous Color Role
                    for (const id of userRoles) {
                        await member.roles.remove(id)
                    }

                    // Add Selected Color Role
                    const selected_role = await interaction.guild!.roles.fetch(this.files["auqw"]["color_roles"][interaction.values[0]]["id"]) as RoleResolvable
                    await member.roles.add(selected_role)

                    // Reply
                    await interaction.editReply({ content: `Role updated! <@&${this.files["auqw"]["color_roles"][interaction.values[0]]["id"]}>` });
                }
                return
            }

            if (interaction.isButton()) {
                if (interaction.customId === "color_button_auqw") {
                    
                    const embed = new MessageEmbed()
                        .setColor("#ff3b59")
                        .setTitle("Pick a Role")
                        .setAuthor(this.base.files["resources"]["auths"]["auqw"]["author"], this.base.files["resources"]["auths"]["auqw"]["image"])
                        .setDescription("Click on the Select menu to choose a color role for you.")

                    const selectionRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('select')
                                .setPlaceholder('Choose a color role fellow human!')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions(this.colorArray)
                        );

                    await interaction.reply({ ephemeral: true, embeds: [embed], components: [selectionRow] })
                    return
                }
            }

        });


    }

    async cmdColorRoleEmbed(mode: string, source) {
        

        const embed = new MessageEmbed()
            .setColor("#ff3b59")
            .setTitle("Color Roles")
            .setAuthor(this.base.files["resources"]["auths"]["auqw"]["author"], this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription("To choose a role, click the Red Button below!.")

        var text: string = ""
        let count: number = 0
        for (const color of this.colorArray) {
            count += 1
            if (count == 11) {
                embed.addField("Colors", text, true)
                text = ""; continue
            }
            text += `${color.emoji} - <@&${this.files["auqw"]["color_roles"][color.value]["id"]}>\n`

        }
        embed.addField('\u200b', text, true)

        const messageRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('color_button_auqw')
                    .setLabel('Open Role Selection')
                    .setStyle('DANGER'),
            );

        await source.channel.send({ embeds: [embed], components: [messageRow] })
    }

    private getColors() {
        for (const name in this.files["auqw"]["color_roles"]) {
            const color = this.files["auqw"]["color_roles"][name]
            this.colorArray.push({
                label: color["label"],
                description: color["description"],
                value: color["value"],
                emoji: color["emoji"]
            })
            this.roleArray.push(color["id"])
        }
    }



}