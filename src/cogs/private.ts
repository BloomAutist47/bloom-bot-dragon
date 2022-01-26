import { Client, MessageEmbed, MessageActionRow, MessageSelectMenu, RoleResolvable, MessageButton, GuildMember, MessageOptions } from "discord.js"
import BaseCog from './base'

// This script is exclusive to AuQW Pearl Harbor discord server only

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
    private colorIDArray: Array<string> = []

    constructor(private client: Client, private base: BaseCog) {
        this.files = base.files
        this.getColors()


        this.base.registerCommand(this.cmdServerRoles.bind(this), {
            name: 'auqw_roles',
            description: 'Send auqw embeds',
        }, false, true)

        client.on('interactionCreate', async interaction => {

            if (interaction.isSelectMenu()) {
                if (interaction.customId === 'select') {
                    await interaction.deferReply({ephemeral: true});
                    const targetColorID: string = this.files["auqw"]["color_roles"][interaction.values[0]]["id"]
                    const member: GuildMember = interaction.member as GuildMember
                    
                    var alreadyHasRole: boolean = false

                    for (const roleID of member['_roles']) {
                        if (roleID === targetColorID) {
                            alreadyHasRole = true
                            continue
                        }
                        if (this.colorIDArray.includes(roleID)) {
                            await member.roles.remove(roleID)
                        }
                    }

                    // // Add Selected Color Role
                    if (alreadyHasRole) {
                        await interaction.editReply({ content: `<@${interaction.user.id}> You __already have__ this role: <@&${targetColorID}>` });
                        return
                    }

                    const selected_role: RoleResolvable = await interaction.guild!.roles.fetch(targetColorID) as RoleResolvable
                    await member.roles.add(selected_role)

                    // // Reply
                    await interaction.editReply({ content: `<@${interaction.user.id}> Color role updated!: <@&${targetColorID}>` });
                }
                return
            }

            if (interaction.isButton()) {
                if (interaction.customId === "color_button_auqw") {
                    
                    const embed = new MessageEmbed()
                        .setColor(this.base.color)
                        .setTitle("Pick a Color Role")
                        .setAuthor(this.base.files["resources"]["auths"]["auqw"]["author"], this.base.files["resources"]["auths"]["auqw"]["image"])
                        .setDescription("Click on the Select menu to choose a color role for you.")

                    const selectionRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('select')
                                .setPlaceholder('Choose a color role, fellow boater!')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions(this.colorArray)
                        );

                    await interaction.reply({ ephemeral: true, embeds: [embed], components: [selectionRow] })
                    return
                }
                
                if (interaction.customId === "auqw_ping_daily" || interaction.customId === "auqw_ping_boat") {
                    await interaction.deferReply({ ephemeral: true });

                    // Setup Role ID
                    var roleID: string = ""
                    if (interaction.customId === "auqw_ping_daily") {
                        roleID = "811305081063604290"
                    } else if (interaction.customId === "auqw_ping_boat") {
                        roleID = "811305081063604291"
                    }
                    
                    const member: GuildMember = interaction.member as GuildMember

                    var alreadyHasRole: boolean = false
                    for (const memRole of member['_roles']) {
                        if (memRole === roleID) {
                            alreadyHasRole = true
                            break
                        }
                    }

                    // Delete
                    if (alreadyHasRole) {
                        await member.roles.remove(roleID)
                        await interaction.editReply({ content: `<@${interaction.user.id}> Role Deleted!: <@&${roleID}>` });
                        return
                    // Add
                    } else {
                        const selected_role: RoleResolvable = await interaction.guild!.roles.fetch(roleID) as RoleResolvable
                        await member.roles.add(selected_role)
                        await interaction.editReply({ content: `<@${interaction.user.id}> Role Added!: <@&${roleID}>` });
                        return
                    }
                }

                if (interaction.customId === "auqw_ping_boat") {
                    await interaction.deferReply({ ephemeral: true });
                    // 
                    return
                }
            }

        });


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
            this.colorIDArray.push(color["id"])
        }
    }

    async cmdServerRoles(mode: string, source) {

        // Color Embed
        const colorEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle("Color Roles")
            // .setAuthor(this.base.files["resources"]["auths"]["auqw"]["author"], this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription("To choose a role, click the Green Button below!.")

        var text: string = ""
        let count: number = 0
        for (const color of this.colorArray) {
            count += 1
            if (count == 11) {
                colorEmbed.addField("Colors", text, true)
                text = ""; continue
            }
            text += `${color.emoji} - <@&${this.files["auqw"]["color_roles"][color.value]["id"]}>\n`

        }
        colorEmbed.addField('\u200b', '\u200b', true)
        colorEmbed.addField('\u200b', text, true)

        const colorMessageRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('color_button_auqw')
                    .setLabel('Open Role Selection')
                    .setStyle('SUCCESS'),
            );

        // Ping Embed
        const pingEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle("**Ping Roles**")
            // .setAuthor("AutoQuest Worlds", this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription(`Get Pinged during certain events.\nTo Remove these roles, just click the role buttons again.

                **Roles**: 
               <:TyNpAp:812605163994742815> <@&811305081063604290> - Alina's AQW Daily Gift/Boost!
               ⛵ <@&811305081063604291> - New boats are made by our Staff.​`)
        const pingMessageRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('auqw_ping_daily')
                    .setLabel('Get Daily')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('auqw_ping_boat')
                    .setLabel('Get Boat Notif')
                    .setStyle('SUCCESS'),
            );
               


        // War Embed
        const warEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle("**War Roles**")
            // .setAuthor("AutoQuest Worlds", this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription(`These roles are given by a Server Staff.\nTo get them, Submit a Screenshot Proof of your army (4+ Alts).

                **Possible Roles**:
                <@&811305081063604289> - Have 4+ Level 100 alts with decent support classes.
                <@&870304318115438592> - Have 4+ Hollowborn Reaper's Scythe.
                <@&872139453588717659> - Have 4+ banned accounts.
                <@&873643637043527830> - Have 4+ VHLs (not IoDA).
                <@&873643701971325008> - Have 4+ LRs (not IoDA).
                <@&813793980453879818> - Have 4+ Necrotic Sword of Doom.
                <@&867365483597791232> - Have the Exalted Apotheosis on 4+
                <@&872211457276772422> - Have a fucking pimped out army of 10+ accs.`)
        
        // Bot Maker Role
        const botEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle("**Bot Maker Role**")
            // .setAuthor("AutoQuest Worlds", this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription(`
            **Role**: <@&928630244859052062>

            **Privilige**: Ability to upload bots to the [Portal](https://auqw.tk/), hidden (autistic) channels, and early access to Bot Clients during Development.
            
            **How to get**: 
            1. Join [Pearl Harbor: Prototype](https://discord.gg/9hdNDf9msa) Server
            2. Read the <#848945955147350046> Channel, Create a ticket
            3. Ping a Ruler/Boat Maker/Helper/Staff to review your boat.

            **DISCLAIMER**: "Kill for : X " and "Kill X" are not High Quality Bots
            `)
        
        var tocTexts: string = ""
        var tocCount: number = 1
        const embeds: Array<Object> = [
            { name: "Bot Maker Role", content: "\n​", embeds: [botEmbed] },
            { name: "War Roles", content: "\n​", embeds: [warEmbed] },
            { name: "Ping Roles", content: "\n​", embeds: [pingEmbed], components: [pingMessageRow] },
            { name: "Color Roles", content: "\n​", embeds: [colorEmbed], components: [colorMessageRow] },
        ]

        for (let embed of embeds) {
            tocTexts += `${tocCount}. [${embed["name"]}](`
            delete embed["name"]
            let embedRes = await source.channel.send(embed)
            tocTexts += `${embedRes.url.trim()})\n`
            tocCount += 1
        }


        const contentEmbed = new MessageEmbed()
            .setColor(this.base.color)
            .setTitle("**Table of Content**")
            .setAuthor("AutoQuest Worlds", this.base.files["resources"]["auths"]["auqw"]["image"])
            .setDescription(tocTexts)
            .setImage("https://cdn.discordapp.com/attachments/805367955923533845/935859089563611139/roles.png")

        await source.channel.send({ content: "\n​", embeds: [contentEmbed] })
    }



}