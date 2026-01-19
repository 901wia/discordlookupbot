require("dotenv").config();

const { Client, GatewayIntentBits, REST, Routes, ActivityType } = require("discord.js");
const { handleInteraction, handleMessage } = require("./interactionHandler");
const { commands } = require("./commands");
const { DATABASE } = require("./config");
const db = require("./database");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", async () => {
    client.user.setPresence({
        activities: [{
            name: "github.com/901wia",
            type: ActivityType.Watching,
            url: "https://github.com/901wia"
        }],
        status: "online"
    });

    if (DATABASE.ENABLED && DATABASE.URI) {
        await db.connect(DATABASE.URI);
    }

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );

    console.log(`READY ${client.user.tag}`);
});

client.on("interactionCreate", i => handleInteraction(i, client));
client.on("messageCreate", m => handleMessage(m, client));

client.login(process.env.BOT_TOKEN);
