## Features

* **Global Profile Lookup**: Fetch detailed user profiles, including user ID, bot status, account creation date, avatar, and banner.
* **Server Profile Lookup**: View member-specific details within a guild, including roles, join date, and avatar.
* **Interactive Lookup Panel**: Use the `/panel` command to choose between a global or server-specific lookup via a dropdown, followed by modal input for user IDs.
* **Prefix Commands**: Support for legacy commands like `.lookup <user_id>` for global lookups and `.lookupserver <user_id>` for server-based lookups.
* **Efficient Caching**: In-memory caching with a time-to-live (TTL) of 60 seconds to reduce redundant API calls and enhance performance.
* **Ephemeral Responses**: Ensures privacy by delivering all interactions as ephemeral messages.
* **Optional Database Integration**: MongoDB support for persistent storage (disabled by default), allowing for enhanced functionality when enabled.

## Requirements

* **Node.js v18+** (LTS recommended for stability).
* **Discord Bot Token** and **Client ID** (set up in the `.env` file).
* Access to a Discord application with required intents: **Guilds**, **GuildMembers**, **GuildMessages**, and **MessageContent**.

## Installation

1. Install dependencies:

   ```bash
   npm install discord.js dotenv mongodb
   ```

2. Configure your environment variables in `.env`:

   * Add your **Discord Bot Token** and **Client ID**.
   * Set up the **MongoDB URI** if you plan to use the database (optional).

3. Update the `config.js` file as needed for bot prefix or MongoDB URI configuration.

## Usage

1. Start the bot:

   ```bash
   node index.js
   ```

2. Invite the bot to your Discord server with the following permissions:

   * **Read Messages**
   * **Send Messages**
   * **Embed Links**

3. Interaction Methods:

   * **Slash Command**: Use `/panel` to open an interactive dropdown for selecting the lookup type.
   * **Prefix Commands**:

     * `.lookup <user_id>` for global lookups.
     * `.lookupserver <user_id>` for guild-specific lookups.

> **Note:** Global lookups can be performed anywhere, while server-based lookups require the bot to be in the server.

## Development Notes

* **Error Handling**: The bot gracefully handles errors, replying with helpful messages for invalid input or API errors. All error responses are ephemeral to maintain privacy.
* **Modular Design**: The bot's functionality is organized into distinct handlers for slash commands, select menus, modals, and prefix commands, making it easy to extend and maintain.
* **Caching**: A 60-second time-to-live (TTL) is applied to cached data, balancing performance with data freshness.
* **Database Integration**: Enable MongoDB support in `config.js` to allow for persistent storage. Connection pooling is used for efficient database interactions when enabled.
