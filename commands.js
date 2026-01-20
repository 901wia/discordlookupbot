const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    MessageFlags
} = require("discord.js");

const CACHE = new Map();
const TTL = 60000;

function getCache(k) {
    const v = CACHE.get(k);
    if (!v) return null;
    if (Date.now() - v.t > TTL) {
        CACHE.delete(k);
        return null;
    }
    return v.d;
}

function setCache(k, d) {
    CACHE.set(k, { d, t: Date.now() });
}

const commands = [
    new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Discord lookup panel")
        .toJSON()
];

async function globalProfile(user, client) {
    const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });
    const banner = user.bannerURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: avatar })
        .setColor(user.accentColor || 0x5865F2)
        .setThumbnail(avatar)
        .addFields(
            { name: "User ID", value: user.id, inline: true },
            { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
            { name: "Created At", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>` }
        )
        .setTimestamp();

    if (banner) embed.setImage(banner);

    const buttons = [
        new ButtonBuilder().setLabel("Avatar").setStyle(ButtonStyle.Link).setURL(avatar),
        banner && new ButtonBuilder().setLabel("Banner").setStyle(ButtonStyle.Link).setURL(banner)
    ].filter(Boolean);

    return {
        embeds: [embed],
        components: buttons.length ? [new ActionRowBuilder().addComponents(buttons)] : []
    };
}

async function guildProfile(member) {
    const avatar = member.displayAvatarURL({ dynamic: true, size: 4096 });

    const roles = member.roles.cache
        .filter(r => r.id !== member.guild.id)
        .sort((a, b) => b.position - a.position)
        .map(r => r.toString())
        .slice(0, 20)
        .join(" ") || "None";

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: avatar })
        .setColor(0x2ECC71)
        .setThumbnail(avatar)
        .addFields(
            { name: "User ID", value: member.id, inline: true },
            { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` },
            { name: "Roles", value: roles }
        )
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Avatar").setStyle(ButtonStyle.Link).setURL(avatar)
    );

    return { embeds: [embed], components: [row] };
}

const slashHandlers = {
    async panel({ interaction }) {
        const embed = new EmbedBuilder()
            .setTitle("Lookup Panel")
            .setColor(0x3498DB);

        const menu = new StringSelectMenuBuilder()
            .setCustomId("lookup_select")
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel("Global Profile").setValue("global"),
                new StringSelectMenuOptionBuilder().setLabel("Server Profile").setValue("guild")
            );

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(menu)],
            flags: MessageFlags.Ephemeral
        });
    }
};

const selectHandlers = {
    async lookup_select({ interaction }) {
        const type = interaction.values[0];

        if (type === "guild" && !interaction.guild) {
            return interaction.reply({ content: "This option works only inside a server.", flags: MessageFlags.Ephemeral });
        }

        const modal = new ModalBuilder()
            .setCustomId(`${type}_modal`)
            .setTitle("User Lookup");

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("user")
                    .setLabel("User ID or Mention")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            )
        );

        await interaction.showModal(modal);
    }
};

const modalHandlers = {
    async global_modal({ interaction, client }) {
        const id = interaction.fields.getTextInputValue("user").replace(/\D/g, "");
        const key = `global_${id}`;

        let data = getCache(key);
        if (!data) {
            const user = await client.users.fetch(id).catch(() => null);
            if (!user) return interaction.reply({ content: "User not found.", flags: MessageFlags.Ephemeral });
            data = await globalProfile(user, client);
            setCache(key, data);
        }

        await interaction.reply({ ...data, flags: MessageFlags.Ephemeral });
    },

    async guild_modal({ interaction }) {
        const id = interaction.fields.getTextInputValue("user").replace(/\D/g, "");
        const key = `guild_${interaction.guild.id}_${id}`;

        let data = getCache(key);
        if (!data) {
            const member = await interaction.guild.members.fetch(id).catch(() => null);
            if (!member) return interaction.reply({ content: "User is not in this server.", flags: MessageFlags.Ephemeral });
            data = await guildProfile(member);
            setCache(key, data);
        }

        await interaction.reply({ ...data, flags: MessageFlags.Ephemeral });
    }
};

const prefixHandlers = {
    async lookup({ message, args, client }) {
        const id = args[0]?.replace(/\D/g, "");
        if (!id) return message.reply("You must provide a valid user ID.");

        const user = await client.users.fetch(id).catch(() => null);
        if (!user) return message.reply("User not found.");

        const data = await globalProfile(user, client);
        await message.reply(data);
    },

    async lookupserver({ message, args }) {
        if (!message.guild) return;

        const id = args[0]?.replace(/\D/g, "");
        if (!id) return message.reply("You must provide a valid user ID.");

        const member = await message.guild.members.fetch(id).catch(() => null);
        if (!member) return message.reply("User is not in this server.");

        const data = await guildProfile(member);
        await message.reply(data);
    }
};

module.exports = {
    commands,
    slashHandlers,
    selectHandlers,
    modalHandlers,
    prefixHandlers,
    buttonHandlers: {}
};
