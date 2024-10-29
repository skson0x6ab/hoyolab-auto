const { CronJob } = require("cron");

const JSON5 = require("json5");
const file = require("node:fs");

const CheckIn = require("./check-in/index.js");
const CodeRedeem = require("./code-redeem/index.js");
const DailiesReminder = require("./dailies-reminder/index.js");
const Expedition = require("./expedition/index.js");
const HowlScratchCard = require("./howl-scratch-card/index.js");
const MissedCheckIn = require("./missed-check-in/index.js");
const RealmCurrency = require("./realm-currency/index.js");
const ShopStatus = require("./shop-status/index.js");
const Stamina = require("./stamina/index.js");
const UpdateCookie = require("./update-cookie/index.js");
const WeekliesReminder = require("./weeklies-reminder/index.js");
const { debug } = require("node:console");

let config;
try {
	config = JSON5.parse(file.readFileSync("./config.json5"));
}
catch {
	config = JSON5.parse(file.readFileSync("./default.config.json5"));
}

const definitions = [
	//CheckIn,
	UpdateCookie
	//CodeRedeem,
	//DailiesReminder,
	//Expedition,
	//HowlScratchCard,
	//MissedCheckIn,
	//RealmCurrency,
	//ShopStatus,
	//Stamina,
	//WeekliesReminder,
];

const BlacklistedCrons = [
	"dailiesReminder",
	"howlScratchCard",
	"weekliesReminder",
	"CodeRedeem",
	"DailiesReminder",
    "Expedition",
    "MissedCheckIn",
    "RealmCurrency",
    "ShopStatus",
    "Stamina",
    "WeekliesReminder",
];

const initCrons = async () => {
	console.log('initCrons start');
	const { blacklist = [], whitelist = [] } = config.crons;
	if (blacklist.length > 0 && whitelist.length > 0) {
		throw new Error(`Cannot have both a blacklist and a whitelist for crons`);
	}
    //BlacklistedCrons.push(test)
	const crons = [];
	for (const definition of definitions) {
		if (blacklist.length > 0 && blacklist.includes(definition.name)) {
			continue;
		}
		else if (whitelist.length > 0 && !whitelist.includes(definition.name)) {
			continue;
		}
		else if (BlacklistedCrons.includes(definition.name)) {
			//const name = app.Utils.convertCase(definition.name, "kebab", "camel");

			//const expression = definition.expression;
			//const job = new CronJob(expression, () => definition.code());
			//job.start();

			//crons.job = job;
			//crons.push({ name, job });
			continue;
		}

		const cron = {
			name: definition.name,
			description: definition.description,
			code: definition.code
		};

		//const name = app.Utils.convertCase(definition.name, "kebab", "camel");

		//const expression = config.crons[name] || definition.expression;
		//const job = new CronJob(expression, () => cron.code(cron));
		//job.start();

		//crons.job = job;
		await cron.code(cron)
		crons.push(cron);
	}

	app.Logger.info("Cron", `Initialized ${crons.length} cron jobs`);
	return crons;
};

module.exports = {
	initCrons
};
