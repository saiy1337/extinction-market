const fs = require('fs');
const axios = require('axios')
const config = JSON.parse(fs.readFileSync('config.json'));

let priceArray = config.weapons;
let doneOffers = [];

const formatNumber = (n) => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

setInterval( async () => {
	const item = priceArray[~~(Math.random() * priceArray.length)];
	const name = item.sanitized_name;

	try {
		const request = await axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${item.name}`);

		const data = request.data;

		data.forEach((offer) => {
			if (offer.price < item.price && !(doneOffers.find(v => (offer.id.toString() === v)))) {
				axios.post(config.webhook_link, { content: `@here An item has been put on sale **${name}** at the price of **${formatNumber(offer.price)}$** by **${offer.seller}**!`});
				doneOffers.push(offer.id);

			}
		});
	} catch (err) {
		return console.error(err);
	}
} , config.interval);