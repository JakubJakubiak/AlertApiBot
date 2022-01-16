const dotenv = require("dotenv").config({ path: __dirname + "/./../../.env" })

module.exports = {
  TOKEN: process.env.Token,
  Wallet: process.env.WALLET
}
