const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const prices = new Database("/database/settingsdata/prices.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('change-price')
    .setDescription('تغيير سعر البوت')
    .addStringOption(Option => 
        Option
        .setName('bot-type')
        .setDescription('نوع البوت')
        .addChoices(
            {
                name:`Apply`,value:`apply`
            },
            {
                name:`Broadcast Controller` , value:`Bc`
            },
            {
                name:`Normal Broadcast` , value:`normalBroadcast`
            },
            {
                name:`Credit` , value:`credit`
            },
            {
                name:`Tax` , value:`tax`
            },
            {
                name:`Scammers` , value:`scam`
            },
            {
                name:`nadeko` , value:`nadeko`
            },
            {
                name:`Logs` , value:`logs`
            },
            {
                name:`Giveaways` , value:`giveaway`
            },
            {
                name:`Tickets` , value:`ticket`
            },
            {
                name:`Suggestions` , value:`suggestions`
            },
            {
                name:`System` , value:`system`
            },
            {
                name:`Feedback` , value:`feedback`
            },
            {
                name:`Probot Premium` , value:`probot`
            },
            {
                name:`Protect` , value:`protect`
            },
            {
                name:`Blacklist` , value:`blacklist`
            },
            
            {
                name:`Autoline` , value:`autoline`
            },
          )
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`price`)
            .setDescription(`السعر بالعملات`)
            .setRequired(true)), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false});
    const Bot_Type = interaction.options.getString(`bot-type`)
    const price = interaction.options.getInteger(`price`)
   await prices.set(`${Bot_Type}_price_${interaction.guild.id}` , price)
   return interaction.editReply({content:`**تم تغيير سعر البوت بنجاح**`})
}
}