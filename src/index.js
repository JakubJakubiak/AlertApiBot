const { Client, Intents} = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const chalk = require("chalk")

const config = require("./config/config.js")
const fetch = require('node-fetch')
const match = require('nodemon/lib/monitor/match')
const log = console.log

client.on("ready", () => {
  log(chalk.green(`login ${client.user.tag}!`))
})

let data = []

const datas = () => {
const wallet = []
  
  for(let i=0;i<wallet.length;i++){
   fetch(`https://api.ethermine.org/miner/:${wallet[i]}/workers`,{
     method: 'GET'
   })
  .then(res => res.json())
  .then(res => { 
    if(res.status === "OK"){
    list = res.data
      .filter(item => item.currentHashrate*100/item.reportedHashrate <= 90)
      .map(item => `
        worker: ${item.worker}
        lastSeen: ${item.lastSeen}
        reportedHashrate: ${item.reportedHashrate}
        currentHashrate: ${item.currentHashrate}
        ${Math.floor(item.currentHashrate*100/item.reportedHashrate)} %
        `)
      .join('\n') 
    data += list


  }}) 
  .catch((err) => console.log(err, "failed"))
  }
}
datas()

client.on("message", (msg) => {
  const { author } = msg

  // Check if user is a bot
  if (author.bot) return
  if (msg.content === "!moris") {
    msg.reply("Start");
   
    setInterval(() => {
    if(data.length > 0){
      datas();
      msg.reply(data)
      data = "";
    }},3000)
}})

client.login(config.token)
