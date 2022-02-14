const {
	Client,
	Intents,
	MessageEmbed
} = require('discord.js')
const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
})
const chalk = require("chalk")

const config = require("./config/config.js")
const fetch = require('node-fetch')
const match = require('nodemon/lib/monitor/match')
const log = console.log

client.on("ready", () => {
	log(chalk.green(`login ${client.user.tag}!`))
})

let nTime = () => new Date().getTime() - 1000 * 60 * 60 * 24 * 7
let oldTime = nTime()
let data = []
let err = true
let start = true
let powerError = 80

const datas = async () => {
	const wallet = config.Wallet
	const ignore = config.Ignore
	const image = config.Image
	const color = config.Color
	
	for (let i = 0; i < wallet.length; i++) {
		fetch(`https://api.ethermine.org/miner/:${wallet[i]}/workers`, {
		method: 'GET'
		})
		.then(res => res.json())
		.then(res => {
		if (res.status === "OK") {
			list = res.data
			.filter(item => (item.currentHashrate * 100 / item.reportedHashrate <= powerError
					|| item.reportedHashrate === 0 )
					&& item.worker !== ignore)
			.map(item =>`
			worker: ${item.worker}  ${image[i]}
			lastSeen: ${item.lastSeen} MH/s
			reportedHashrate: ${item.reportedHashrate} MH/s
			currentHashrate: ${item.currentHashrate} MH/s
			${Math.floor(item.currentHashrate*100/item.reportedHashrate)} %	
			`)
			.join('\n')
			if(list !== "") data += list
			if(nTime() - oldTime  >= 600000 && err == false) err = true
			nTime() 
		}
		})
		.catch((err) => console.log(err, "failed"))
	}	
}

client.on("message", (msg) => {
	const {author} = msg

	// Check if user is a bot
	if (author.bot) return ;
	if (msg.content === "!ping") msg.reply("ping",data);
	if (msg.content === "!start" && start === true) {
		start = false
		msg.reply("Start");
		log(data);
		setInterval(() => {
			datas();		
			if (data.length > 0 && err === true) {	
				msg.reply(data)
				oldTime = nTime()
       			err = false 
			};				
			data = ""
		}, 35000)
	}
})

client.login(config.TOKEN)