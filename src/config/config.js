const dotenv = require("dotenv").config({ path: __dirname + "/./../../.env" })

module.exports = {
  TOKEN: process.env.Token,
  Wallet: [process.env.WALLET, process.env.WALLET2, process.env.WALLET3],
  Ignore: process.env.IGNORE
}
