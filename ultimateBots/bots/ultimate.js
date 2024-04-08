const { client, Client, Collection, discord, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const { readdirSync } = require("fs")
const colors = require('colors');
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('path');
const fs = require('fs');
const mongodb = require('mongoose');
const ms = require("ms")
const { Database } = require("st.db")
const tokens = new Database("tokens/tokens")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`);
const subs = tier3subscriptions.get(`tier3_subs`);
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")
const statuses = new Database("/database/settingsdata/statuses")
const prices = new Database("/database/settingsdata/prices.json")

if(!subs) return;
if(subs.length <= 0) return;

subs.forEach(async(sub) => {
    let { token, owner, guildid, prefix, timeleft } = sub;
    const client2 = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember] });
    client2.commandaliases = new Collection()
    const rest = new REST({ version: '10' }).setToken(token);

    module.exports = client2;

    client2.on("ready", async() => {
        setInterval(async () => {
            const subs2 = tier3subscriptions.get(`tier3_subs`);
            if (!subs2) return;
            const sub = subs2.find(su => su.guildid == guildid);
            if (!sub) return;

            const theTimeleft = sub.timeleft;
            if (theTimeleft === 0) {
                await client2.users.fetch(owner);
                const theowner = client2.users.cache.find(us => us.id === owner);
                const endEmbed = new EmbedBuilder()
                    .setTitle("**انتهى اشتراك بوت الميكر الخاص بك**")
                    .setDescription("**انتهى اشتراك بوت الميكر بريميوم الخاص بك يمكنك اعادة الشراء مجددا دون فقد اي من البيانات**")
                    .setTimestamp();

                const sub4 = tier3subscriptionsplus.get(`plus`);
                const filtered = await sub4.filter(su => su.guildid !== guildid);
                await tier3subscriptionsplus.set(`plus`, filtered);
                await theowner.send({ embeds: [endEmbed] }).catch(() => { return; });
                await client2.destroy();
            }

            const sub3 = tier3subscriptionsplus.get(`plus`);
            if (!sub3) return;

            const theSubGet = sub3.find(ch => ch.guildid === guildid);
            if (!theSubGet) return;

            const theTimeleft2 = theSubGet.timeleft;
            theSubGet.timeleft = theTimeleft2 - 1;
            await tier3subscriptionsplus.set(`plus`, sub3);

            if (theTimeleft2 <= 0) {
                const filtered = await sub3.filter(su => su.guildid !== guildid);
                await tier3subscriptionsplus.set(`plus`, filtered);
            }
        }, 1000);

        try {
            await rest.put(
                Routes.applicationCommands(client2.user.id),
                { body: premiumSlashCommands },
            );
        } catch (error) {
            console.error(error);
        }
    });

    client2.on("ready", async() => {
        setInterval(() => {
            let guilds = client2.guilds.cache.forEach(async(guild) => {
                let messageInfo = setting.get(`statusmessageinfo_${guild.id}`);
                if (!messageInfo) return;

                const { messageid, channelid } = messageInfo;
                const theChan = guild.channels.cache.find(ch => ch.id === channelid);
                if (!theChan || !messageid) return;

                await theChan.messages.fetch(messageid).catch(() => { return; });
                const theMsg = await theChan.messages.cache.find(ms => ms.id === messageid);

                const embed1 = new EmbedBuilder()
                    .setTitle("**الحالة العامة للبوتات**");

                const theBots = [
                    { name: `التقديم`, defaultPrice: 15, tradeName: `apply` },
                    { name: `الخط التلقائي`, defaultPrice: 15, tradeName: `autoline` },
                    { name: `البلاك ليست`, defaultPrice: 15, tradeName: `blacklist` },
                    { name: `التحكم في البرودكاست`, defaultPrice: 40, tradeName: `bc` },
                    { name: `البرودكاست العادي`, defaultPrice: 20, tradeName: `Broadcast2` },
                    { name: `الكريدت الوهمي`, defaultPrice: 15, tradeName: `credit` },
                    { name: `الاراء`, defaultPrice: 15, tradeName: `feedback` },
                    { name: `الجيف اواي`, defaultPrice: 15, tradeName: `giveaway` },
                    { name: `اللوج`, defaultPrice: 15, tradeName: `logs` },
                    { name: `الناديكو`, defaultPrice: 15, tradeName: `nadeko` },
                    { name: `البروبوت بريميوم الوهمي`, defaultPrice: 15, tradeName: `probot` },
                    { name: `الحماية`, defaultPrice: 20, tradeName: `protect` },
                    { name: `النصابين`, defaultPrice: 15, tradeName: `scam` },
                    { name: `الاقتراحات`, defaultPrice: 15, tradeName: `suggestions` },
                    { name: `السيستم`, defaultPrice: 35, tradeName: `system` },
                    { name: `الضريبة`, defaultPrice: 15, tradeName: `tax` }
                ];

                theBots.forEach(async(theBot) => {
                    let theBotTokens = tokens.get(theBot.tradeName);
                    let theBotStats = statuses.get(theBot.tradeName) ?? true;

                    embed1.addFields(
                        {
                            name: `**بوتات ${theBot.name} 🟢**`,
                          value: `**السعر في السيرفر : \`${prices.get(theBot.tradeName + '_price_' + guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\``,
                            inline: false
                        }
                    );
                });

                const totalSeconds = process.uptime();
                const days = Math.floor(totalSeconds / (3600 * 24));
                const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
                const hours = Math.floor(remainingSecondsAfterDays / 3600);
                const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
                const minutes = Math.floor(remainingSecondsAfterHours / 60);
                const seconds = Math.floor(remainingSecondsAfterHours % 60);

                embed1.addFields(
                    {
                        name: `**تم الرفع لمدة :**`,
                        inline: false,
                        value: `**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
                    }
                );

                embed1.setColor('DarkGold');
                embed1.setThumbnail(guild.iconURL({ dynamic: true }));
                embed1.setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) });

                try {
                    await theMsg.edit({ embeds: [embed1] });
                } catch {
                    return;
                }
            });
        }, 60 * 1000);
    });

    client2.premiumSlashCommands = new Collection();
    const premiumSlashCommands = [];

    const ascii = require('ascii-table');
    const { setMaxListeners } = require("events");
    const table = new ascii('Owner Commands').setJustify();

    try {
        const commandsDir = path.join(__dirname, '../commands');
        if (!fs.existsSync(commandsDir)) {
            throw new Error(`'../commands/' directory does not exist.`);
        }

        const folders = fs.readdirSync(commandsDir);

        for (let folder of folders.filter(folder => !folder.includes('.'))) {
            const folderPath = path.join(commandsDir, folder);
            const files = fs.readdirSync(folderPath);

            for (let file of files.filter(f => f.endsWith('.js'))) {
                let command = require(path.join(folderPath, file));

                if (command) {
                    premiumSlashCommands.push(command.data.toJSON());
                    client2.premiumSlashCommands.set(command.data.name, command);

                    if (command.data.name) {
                        table.addRow(`/${command.data.name}`, '🟢 Working');
                    } else {
                        table.addRow(`/${command.data.name}`, '🔴 Not Working');
                    }
                }
            }
        }
    } catch (err) { }

    try {
        const eventsDir = path.join(__dirname, '../events');

        if (!fs.existsSync(eventsDir)) {
        }

        const folders = fs.readdirSync(eventsDir);

        for (let folder of folders.filter(folder => !folder.includes('.'))) {
            const folderPath = path.join(eventsDir, folder);
            const files = fs.readdirSync(folderPath);

            for (let file of files.filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath, file));

                if (event.once) {
                    client2.once(event.name, (...args) => event.execute(...args));
                } else {
                    client2.on(event.name, (...args) => event.execute(...args));
                }
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
    }

    try {
        const buttonsDir = path.join(__dirname, '../../buttons');

        if (!fs.existsSync(buttonsDir)) {
            throw new Error(`'../../buttons/' directory does not exist.`);
        }

        const folders = fs.readdirSync(buttonsDir);

        for (let folder of folders.filter(folder => !folder.includes('.'))) {
            const folderPath = path.join(buttonsDir, folder);
            const files = fs.readdirSync(folderPath);

            for (let file of files.filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath, file));

                if (event.once) {
                    client2.once(event.name, (...args) => event.execute(...args));
                } else {
                    client2.on(event.name, (...args) => event.execute(...args));
                }
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
    }

    client2.on('ready', async() => {
        const subs2 = tier3subscriptions.get(`tier3_subs`);
        const sub = subs2.find(su => su.guildid === guildid);

        if (!sub) return;

        try {
            let guilds = client2.guilds.cache.forEach(async(guild) => {
                let subscriptions1 = tier3subscriptions.get(`tier3_subs`);

                if (!subscriptions1) {
                    await tier3subscriptions.set(`tier3_subs`, []);
                }

                let filtered = subscriptions1.find(a => a.guildid === guild.id);

                if (!filtered) {
                    if (guild.id === guildid) return;

                    await guild.leave();
                }
            })
        } catch (error) {
            return;
        }
    });

    client2.on("messageCreate", async(message) => {
        const subs2 = tier3subscriptions.get(`tier3_subs`);
        const sub = subs2.find(su => su.guildid === guildid);

        if (!sub) return;

        if (message.content === `<@${client2.user.id}>`) {
            if (message.author.bot) return;

            return message.reply({ content: `**Hello In <@${client2.user.id}> , Im Using / Commands**` });
        }
    });

    client2.on("guildCreate", async(guild) => {
        const subs2 = tier3subscriptions.get(`tier3_subs`);
        const sub = subs2.find(su => su.guildid === guildid);

        if (!sub) return;

        let subscriptions1 = tier3subscriptions.get(`tier3_subs`);
        let filtered = subscriptions1.find(a => a.guildid === guild.id);

        if (!filtered) {
            if (guild.id === guildid) return;

            await guild.leave();
        }
    });

    client2.on("messageCreate", async(message) => {
        const subs2 = tier3subscriptions.get(`tier3_subs`);
        const sub = subs2.find(su => su.guildid === guildid);

        if (!sub) return;

        const transfer_room = setting.get(`transfer_room_${message.guild.id}`);
        const probot = setting.get(`probot_${message.guild.id}`);

        if (!probot && !transfer_room) return;

        if (message.author.id === probot) return;
        if (message.channel.id !== transfer_room) return;
        if (message.author.id === client2.user.id) return;

        setTimeout(() => {
            try {
                message.delete().catch(async() => { return; });
            } catch (error) {
                return;
            }
        }, 15000);
    });

    client2.on('messageCreate', async(message) => {
        const transfer_room = setting.get(`transfer_room_${message.guild.id}`);
        const probot = setting.get(`probot_${message.guild.id}`);

        if (!probot && !transfer_room) return;

        if (message.channel.id === transfer_room) {
            if (message.author.id === client2.user.id) return;

            if (message.author.id === probot) {
                if (message.content.includes("has transferred")) {
                    let line = setting.get(`line_${message.guild.id}`) ?? "https://media.discordapp.net/attachments/1133351211656036442/1194955034354524180/Picsart_23-12-28_09-55-22-159.jpg?ex=65b23b99&is=659fc699&hm=bf46f04ad4a2845378c0dce28bff4448d72d192cf4d8fe7ed15db9a04f2e7cfc&";

                    if (!line) {
                        line = `https://media.discordapp.net/attachments/1133351211656036442/1194955034354524180/Picsart_23-12-28_09-55-22-159.jpg?ex=65b23b99&is=659fc699&hm=bf46f04ad4a2845378c0dce28bff4448d72d192cf4d8fe7ed15db9a04f2e7cfc&`;
                    }

                    message.channel.send({
                        files: [
                            {
                                name: `line.png`,
                                attachment: line
                            }
                        ]
                    });
                } else {
                    setTimeout(() => {
                        try {
                            message.delete().catch(async() => { return; });
                        } catch (error) {
                            return;
                        }
                    }, 15000);
                }
            }
        }
    });

    client2.login(token)
        .then(() => console.log(`Done Logged In as: ${client2.user.username}`.green))
        .catch(err => console.log(`❌ Token Ultimate are not working: ${token}`.red));
});