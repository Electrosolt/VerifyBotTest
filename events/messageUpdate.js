const config = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    run(oldMessage, newMessage) {
        // If message was not sent the guild, return
        if (newMessage.guild.id !== config.guild) return;
        // Fetch logs channel
        const logs = this.client.channels.find("name", config.logs.messageUpdates);
        // If no logs channel found, return false
        if (!logs) return false;

        // Create an empty var storing the action
        let action = null;
        // Find action type
        if (oldMessage.content !== newMessage.content) action = { action: "Message Edited", color: [255, 255, 100] };
        if (!oldMessage.pinned && newMessage.pinned) action = { action: "Message Pinned", color: [100, 255, 100] };
        if (oldMessage.pinned && !newMessage.pinned) action = { action: "Message Unpinned", color: [255, 155, 100] };

        if (newMessage.author.bot && action.action === "Message Edited") return;

        // If no action found, ignore it
        if (!action) return;

        // Create an embed
        const embed = new MessageEmbed()
            .setColor(action.color)
            .setAuthor(`${newMessage.member.displayName} (${newMessage.author.tag})`)
            .setTitle(`${action.action} in #${newMessage.channel.name}.`)
            .setTimestamp();

        // Customise embed depending on action
        if (action.action === "Message Edited") {
            embed.addField("Old Content", oldMessage.content);
            embed.addField("New Content", newMessage.content);
        } else embed.setDescription(newMessage.content);

        // Send the embed
        logs.send(embed);
    }
};