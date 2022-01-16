const dotenv = require("dotenv").config({ path: __dirname + "/./../../.env" })

module.exports = {
  TOKEN: process.env.token,
  Wallet: process.env.WALLET
}
