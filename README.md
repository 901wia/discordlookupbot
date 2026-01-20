Global Profile Lookup: Fetch a user's global details like ID, bot status, creation date, avatar, and banner.
Server Profile Lookup: Retrieve server-specific info such as join date, roles, and avatar for members in the current guild.
Interactive Panel: Use the /panel slash command to select between global or server lookups via a dropdown and modal input.
Prefix Commands: Fallback support for text-based commands like .lookup <user_id> (global) and .lookupserver <user_id> (server-specific).
Caching: In-memory caching with a 60-second TTL to minimize redundant Discord API requests.
Ephemeral Responses: Slash interactions are private by default for user privacy.
Optional Database: Configurable MongoDB connection for potential future expansions (e.g., logging lookups), but not required.

Prerequisites

Node.js v18 or higher
A Discord developer account to create a bot application.
Basic familiarity with environment variables and Discord bot permissions (e.g., GUILD_MEMBERS intent).

Installation
Start by setting up a new project directory on your local machine or server.

Initialize a new Node.js project: npm init -y
Install the required dependencies one by one 
npm install discord.js
npm install dotenv
npm install mongodb

This approach lets you manage versions explicitly if needed, though you could bundle them in a single npm install command for convenience.
Configuration

Create a .env file in the root directory and populate it with your bot's credentials:textBOT_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
DATABASE_URI=your_mongodb_connection_string_here  # Optional; leave blank if not using DB
Obtain BOT_TOKEN and CLIENT_ID from the Discord Developer Portal.
For DATABASE_URI, use a MongoDB Atlas connection string or similar if enabling the database.

Edit config.js to customize settings:
PREFIX: Default is ., but change it to avoid conflicts with other bots.
DATABASE.ENABLED: Set to true if you want MongoDB integration (requires DATABASE_URI in .env).
DATABASE.URI: Leave as an empty string if not using.


Ensure your bot has the necessary intents enabled in the Developer Portal: Guilds, GuildMembers, GuildMessages, and MessageContent.
Running the Bot

Start the bot with:textnode index.js
Once online, the bot will log READY <bot_tag> to the console and set its presence to "Watching github.com/901wia".
Invite the bot to your server using an OAuth2 URL generated in the Developer Portal (include scopes like bot and applications.commands).

Usage
Slash Commands

/panel: Opens an interactive panel (ephemeral). Select "Global Profile" or "Server Profile," then enter a user ID or mention in the modal.
Works globally for global lookups; server lookups require execution in a guild.


Prefix Commands

.lookup <user_id_or_mention>: Global profile lookup (public response).
.lookupserver <user_id_or_mention>: Server profile lookup (public; must be run in a guild).

User IDs can be extracted from mentions (e.g., @user) or provided directly. The bot handles invalid inputs gracefully with error messages.
Development Notes

Error Handling: Interactions include try-catch blocks to prevent crashes, with fallback ephemeral replies.
Caching: Uses a simple Map with TTL for efficiency; expand as needed for production.
Extensibility: The modular structure (e.g., separate handlers in commands.js and interactionHandler.js) makes it easy to add more commands or components.
Database: Currently unused but wired up—access via getDB() in database.js for custom features like storing lookup history.

If scaling, consider adding rate limiting or migrating to a more robust cache like Redis.
Troubleshooting

Bot Not Responding: Check intents, token validity, and console logs for errors.
MongoDB Issues: Ensure the URI is correct and the cluster allows your IP; disable in config if not needed.
Permission Errors: The bot needs View Members permissions for guild lookups.
