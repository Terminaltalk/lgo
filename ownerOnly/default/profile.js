const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const {createCanvas, loadImage} = require('canvas')
const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports ={
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('رؤ ية بروفايلك او بروفايل شخص اخر')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص`)
        .setRequired(false)),
    async execute(interaction, client) {
        try{
        await interaction.deferReply({ephemeral:false})
        const user = interaction.options.getUser(`user`) ?? interaction.user
        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`) ?? 0;
        let userbots = usersdata.get(`bots_${user.id}_${interaction.guild.id}`) ?? 0;
        let usersub = usersdata.get(`sub_${user.id}`)
        let userstatus = '';
        if(usersub) {
            userstatus = "مشترك"
        }else {
            userstatus = "غير مشترك"
        }
        let avatar1 = await user.displayAvatarURL({dynamic:false,format: 'jpg'})
        let avatar2 = avatar1.slice(0,-4)
        avatar2 += "jpg"
        const avatar = await loadImage(avatar2);
        const canvas = createCanvas(608, 608);
        const ctx = canvas.getContext("2d");
        const crx = canvas.getContext(`2d`)
        const profilebackground = "https://cdn.discordapp.com/attachments/1205211527871995946/1205361680943550564/Picsart_23-11-22_20-19-17-326.jpg?ex=65d8178b&is=65c5a28b&hm=bd8cc98770960b3467f65a69dc537d2e67ce5ae13aa96b60c5df8691eddf8c43&"
        const background = await loadImage(profilebackground); 
        let sizeX = 165;
        let sizeY = sizeX;
        let z = 110;
        let x = z - sizeX / 2;
        let y = z - sizeY / 2;
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(10px)";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 40px arial";
        ctx.strokeStyle = "#ffffff"; // Stroke color
        ctx.lineWidth = 2; // Stroke width
        ctx.fillText(user.username, 350, 125);
        ctx.font = "bold 25px jazeel";
        ctx.textAlign = "left";
        ctx.font = "40px jazeel";
        ctx.fillStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px arial";
        ctx.fillText(`${userbalance}`, 45, 200 + 110 + 35);
        ctx.fillText(`${userbots}`, 45, 200 + 220 + 35);
        ctx.font = "bold 40px jazeel"
        ctx.fillText(`${userstatus}`, 45, 110 + 420 + 35);
        /* -------------- */
        ctx.beginPath();
        ctx.arc(z, z, sizeY / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
        ctx.save();
        ctx.clip();
        ctx.drawImage(avatar, 27.5, 27.5, sizeX, sizeY);        
        ctx.restore();
        const thefinal = canvas.toBuffer();
        return interaction.editReply({files:[{attachment:thefinal,name:`profile.png`}]})  
    }
catch {
    console.error(error)
            return interaction.editReply({content:`**حدث خطأ حاول مرة اخرى**`})
}
    }
}