const { Client, Intents} = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const chalk = require("chalk")

const config = require("./config/config.js")
const fetch = require('node-fetch')
const log = console.log

client.on("ready", () => {
  log(chalk.green(`login ${client.user.tag}!`))
})


let data = []


const datas = () => {
  const wallet = [
  
  ]

  for(let i=0;i<wallet.length;i++){
   fetch(`https://api.ethermine.org/miner/:${wallet[i]}/workers`,{
     method: 'GET'
   })
  .then(res => res.json())
  .then(res => { 
    list = res.data
      .filter(item => item.reportedHashrate*0.8 >= item.currentHashrate )
      .map(item => `${item.worker} ${item.lastSeen} ${item.reportedHashrate} ${item.currentHashrate}`)
      .join('\n')
    
    data += list

  }) 
  .catch((err) => console.log(err, "failed"))
  }
}
datas()



  



client.on("message", (msg) => {
  const { author } = msg
 

  if (author.bot) return
  if (msg.content === "!ping") {
    msg.reply("pong");
   
    setInterval(() => {
    if(data.length > 0){
      datas();
      msg.reply(data)
      data = "";
    }
  
    },3000)
}
})


client.login(config.token)
