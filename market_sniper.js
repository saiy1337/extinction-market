const fs = require('fs');
const axios = require('axios')
const config = JSON.parse(fs.readFileSync('config.json'));
var priceArray = config.weapons;
var doneOffers = [];

function formatNumber(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const Discord = require('discord.js');
const bot = new Discord.Client();

function checkMarketplace() {
  var item = priceArray[~~(Math.random() * priceArray.length)];
  const item_name = item.sanitized_name;
  try {
    axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${item.name}`)
      .then(function (response) {
        const data = response.data;
        data.forEach((offer) => {
          if (offer.price < item.price && !(doneOffers.find(v => (offer.id.toString() === v)))) {
            axios.post(config.webhook_link, {content : `@here An item has been put on sale **${item_name}** at the price of **${formatNumber(offer.price)}$** by **${offer.seller}**!`})
            doneOffers.push(offer.id.toString());
            return;
          }
        })
      });
  }
  catch (err) {
    return console.log(err);
  }
}

setInterval(checkMarketplace, config.interval);

bot.login(config.token);
