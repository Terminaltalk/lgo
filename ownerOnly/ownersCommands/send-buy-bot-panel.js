const { SlashCommandBuilder,SelectMenuBuilder,StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const setting = new Database("/database/settingsdata/setting")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('send-buy-bot-panel')
    .setDescription(`ارسال بانل شراء البوتات`),
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    let price1 = await setting.get(`balance_price_${interaction.guild.id}`) ?? 5000;
    let recipient = await setting.get(`recipient_${interaction.guild.id}`)
    let transferroom = await setting.get(`transfer_room_${interaction.guild.id}`)
    let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
    let probot = await setting.get(`probot_${interaction.guild.id}`)
    let clientrole = await setting.get(`client_role_${interaction.guild.id}`)
    let panelroom = await setting.get(`panel_room_${interaction.guild.id}`)
    let buybotroom = await setting.get(`buy_bot_room${interaction.guild.id}`)
    if(!price1 || !recipient || !transferroom || !logroom || !probot || !clientrole || !buybotroom) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
    let theroom = interaction.guild.channels.cache.find(ch => ch.id == buybotroom)
    let embed = new EmbedBuilder()
    .setTitle(`**__CyBots Center__**`)
    .setDescription(`**
 - اهلا بكم في خادم __CyBots Center__
 - نحن نقدم لكم بوتات ب افضل جوده و اعلي كفائه دون انقطاع و الحاجه الي البرمجه 
 - نحن نقدم لكم ارخص سعر فل سوق ب أكملة 
 
 :اسعار البوتات 
 
> بوت خط تلقائي : 20 كوينز 
> بوت اقتراحات :20 كوينز 
> بوت التقديمات :25 كوينز 
> بوت البلاك ليست :25 كوينز 
> بوت فيدباك :25 كوينز   

------------------------

> بوت لوج :25 كوينز 
> بوت كشف نصابين :25 كوينز 
> بوت ضريبه :25 كوبنز 
> بوت جيفاوي :25 كوينز 
> بوت حمايه :30 كوينز 
> بوت بروبوت وهمي :35 كوينز 
> بوت سستم :45 كوينز 
> بوت ناديكو :45 كوينز 
> بوت تكت مطور : 45 كوينز 
> بوت برودكاست مع بانل :50 كوينز 
**`)
    .setTimestamp()
    const select = new StringSelectMenuBuilder()
    .setCustomId('select_bot')
    .setPlaceholder('قم بأختيار البوت من القائمة')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('بـوت تـقـديـمـات')
            .setDescription('شراء بوت تقديمات')
            .setValue('BuyApply'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت خـط تـلـقائـي')
            .setDescription('شراء بوت خط تلقائي')
            .setValue('BuyAutoline'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت بـلاكلـيـسـت')
            .setDescription('شراء بوت بلاك ليست')
            .setValue('BuyBlacklist'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت بـرودكـاسـت بـانـل')
            .setDescription('شراء بوت برودكاست')
            .setValue('BuyBroadcast'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت فيـدباك')
            .setDescription('شراء بوت اراء')
            .setValue('BuyFeedback'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت جـيـفاواي')
            .setDescription('شراء بوت جيف اواي')
            .setValue('BuyGiveaway'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت لـوج')
            .setDescription('شراء بوت لوج')
            .setValue('BuyLogs'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت نـاديـكـو')
            .setDescription('شراء بوت ناديكو')
            .setValue('BuyNadeko'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت بـروبـوت')
            .setDescription('شراء بوت  بروبوت بريميوم وهمي')
            .setValue('BuyProbot'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت حـمـايـه')
            .setDescription('شراء بوت حماية')
            .setValue('BuyProtect'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت كـشـف نـصـابـيـن')
            .setDescription('شراء بوت نصابين')
            .setValue('BuyScammers'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت اقـتـراحـات')
            .setDescription('شراء بوت اقتراحات')
            .setValue('BuySuggestions'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت سـسـتـم')
            .setDescription('شراء بوت سيستم')
            .setValue('BuySystem'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت ضـريـبـة')
            .setDescription('شراء بوت ضريبة')
            .setValue('BuyTax'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت تـكـت')
            .setDescription('شراء بوت تكت')
            .setValue('BuyTicket'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اعـاده تـحـمـيـل الـمـنـيـو')
            .setDescription('عمل اعادة تعيين للاختيار')
            .setValue('Reset_Selected'),
    );
    const row = new ActionRowBuilder()
    .addComponents(select);
    theroom.send({embeds:[embed] , components:[row]})
    if(setting.has(`subscribe_room_${interaction.guild.id}`)) {
        let subscriberoo = setting.get(`subscribe_room_${interaction.guild.id}`)
        let subscriberoom = interaction.guild.channels.cache.find(ch => ch.id == subscriberoo)
        let embed2 = new EmbedBuilder()
    .setTitle(`**𝐁𝐨𝐭 𝐌𝐚𝐤𝐞𝐫 𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 𝐩𝐚𝐧𝐞𝐥**`)
    .setDescription(`** 
 - __CyBots Center__ اهلا بكم في خادم 
 - نحن نقدم لكم بوتات ب افضل جوده و اعلي كفائه دون انقطاع و الحاجه الي البرمجه 
 - نحن نقدم لكم ارخص سعر فل سوق ب أكملة 

الاشتراكات و المميزات :


Smart :
> يمكنك بيع البوتات ناقصه 
> يمكنك بيع الكوينز
سعره :مائة كوينز 

Pro :
> يمكنك تغيير الاسم و الصوره .
> يمكنك بيع البوتات ناقصه
> يمكنك بيع الكوينز
> يمكنك تغيير السعر 
> Smart+ يمكنك بيع الاشتراكات ماعدا ال اشتراك 
> يمكنك اعطاء كوينز مجانا
> يمكنك انشاء اكواد كوينز مجانا
> يمكنك انشاء اكواد الدعوه
سعره :مئتين كوينز

Pro+ : 
> يمكنك تغيير الاسم و الصوره .
> يمكنك بيع البوتات مثل ما تريد
> يمكنك بيع الكوينز
> يمكنك تغيير السعر 
> يمكنك بيع الاشتراكات 
> يمكنك اعطاء كوينز مجانا
> يمكنك انشاء اكواد كوينز مجانا
> يمكنك انشاء اكواد الدعوه
> يمكنك تجديد اشتراك البوتات
السعر: ثلاثمئة كوينز

**`)
    .setTimestamp()
        const select2 = new StringSelectMenuBuilder()
        .setCustomId('select_bot')
        .setPlaceholder('الاشتراك في بوت الميكر')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت مـيـكـر سمــارت')
            .setDescription('الاشتراك في بوت الميكر برونز')
            .setValue('Bot_Maker_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بـوت مـيـكـر بــــرو')
            .setDescription('الاشتراك في بوت الميكر سيلفر')
            .setValue('Bot_Maker_Premium_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('الاشتراك في بوت ميكر برو بلس')
            .setDescription('الاشتراك في بوت الميكر الماسي')
            .setValue('Bot_Maker_Ultimate_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اعـاده تـحـمـيـل الـمـنـيـو')
            .setDescription('عمل اعادة تعيين للاختيار')
            .setValue('Reset_Selected'),);
            const row2 = new ActionRowBuilder().addComponents(select2)
        subscriberoom.send({embeds:[embed2],components:[row2]})
    }
    return interaction.editReply({content:`**تم ارسال الرسالة بنجاح**`})
}
}