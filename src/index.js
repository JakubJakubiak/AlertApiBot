const {
	Client,
	Intents
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

const datas = () => {
	const wallet = config.wallet

	for (let i = 0; i < wallet.length; i++) {
		fetch(`https://api.ethermine.org/miner/:${wallet[i]}/workers`, {
				method: 'GET'
			})
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK") {
					list = res.data
			.filter(item => item.currentHashrate * 100 / item.reportedHashrate <= 80)
			.map(item => `
			worker: ${item.worker}
			lastSeen: ${item.lastSeen}
			reportedHashrate: ${item.reportedHashrate}
			currentHashrate: ${item.currentHashrate}
			${Math.floor(item.currentHashrate*100/item.reportedHashrate)} %
        `)
			.join('\n')
			if(list !== "") data += list 
			if(nTime() - oldTime  >= 100000) err = true
			nTime()			
			}
			})
			.catch((err) => console.log(err, "failed"))
	}
}
datas()

client.on("message", (msg) => {
	const {
		author
	} = msg

	// Check if user is a bot
	if (author.bot) return
	if (msg.content === "!moris") {
		msg.reply("Start");
		setInterval(() => {
			datas();
			if (data.length > 0 && err === true) {	
				msg.reply(data)
				oldTime = nTime()
				data = "";
       			err = false
			}
		}, 6000)
	}
})

client.login(config.token)