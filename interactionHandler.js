const { InteractionType, MessageFlags } = require("discord.js");
const { slashHandlers, selectHandlers, modalHandlers, prefixHandlers } = require("./commands");
const { PREFIX } = require("./config");

async function handleInteraction(interaction, client) {
    try {
        if (interaction.isChatInputCommand()) {
            const h = slashHandlers[interaction.commandName];
            if (h) await h({ interaction, client });
        }

        if (interaction.isStringSelectMenu()) {
            const h = selectHandlers[interaction.customId];
            if (h) await h({ interaction, client });
        }

        if (interaction.type === InteractionType.ModalSubmit) {
            const h = modalHandlers[interaction.customId];
            if (h) await h({ interaction, client });
        }
    } catch {
        if (!interaction.replied) {
            interaction.reply({ content: "An unexpected error occurred.", flags: MessageFlags.Ephemeral }).catch(() => {});
        }
    }
}

async function handleMessage(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = args.shift()?.toLowerCase();
    const h = prefixHandlers[cmd];
    if (h) await h({ message, args, client });
}

module.exports = { handleInteraction, handleMessage };
