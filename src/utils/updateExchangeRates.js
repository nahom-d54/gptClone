const getEthiopianExchangeRate = require("./getEthiopianExchangeRate");
const mongoose = require("mongoose");
const Rates = require("../models/Rates");
const { DateFuncs } = require("./helperFunctions");
//const connectToDb = require('../config/mongoose')

async function updateExchangeRates() {
  const result = await getEthiopianExchangeRate();

  // Flatten the exchange rates data
  const docs = result.exchange_rates.map((rates) => {
    const date = rates.lastUpdated;
    const name = rates.name;
    return rates.rates.map((rate) => ({
      date: isNaN(date.getTime()) ? DateFuncs.getStartOfDate(new Date()) : date,
      bank: name,
      ...rate,
    }));
  });
  const allDocs = docs.flat(2);

  // Add the best rate from BINANCE
  allDocs.push({
    date: DateFuncs.getStartOfDate(new Date()),
    ...result.bestRates.find((item) => item.bank === "BINANCE"),
  });

  let session;

  try {
    // session = await mongoose.startSession();
    // session.startTransaction();

    // Extract the banks and dates to query the database for existing records
    const bankDatePairs = allDocs.map((doc) => ({
      bank: doc.bank,
      date: doc.date,
    }));

    // Query the database for existing rates of the same banks and dates
    const existingRates = await Rates.find({
      $or: bankDatePairs,
    }); //.session(session);

    // Create a map of existing rates for quick lookup
    const rateMap = new Map();
    existingRates.forEach((rate) => {
      rateMap.set(
        `${rate.bank}-${rate.date.toISOString()}-${rate.currencyCode}`,
        rate
      );
    });

    // Filter out unchanged rates
    const updatedRates = allDocs.filter((doc) => {
      const key = `${doc.bank}-${doc.date.toISOString()}-${doc.currencyCode}`;
      const existingRate = rateMap.get(key);

      const bool =
        !existingRate ||
        existingRate.buyRate !== doc.buyRate ||
        existingRate.sellRate !== doc.sellRate;

      // if (bool) {
      //     console.log(`Updating ${key}`, doc, existingRate);
      // }

      // Only return docs where the buyRate or sellRate has changed, or if the rate doesn't exist
      return bool;
    });

    if (updatedRates.length > 0) {
      // Perform bulk insert or update for changed rates
      // const bulkOps = updatedRates.map(doc => ({
      //     updateOne: {
      //         filter: { bank: doc.bank, date: doc.date, currencyCode: doc.currencyCode },
      //         update: doc,
      //         upsert: true
      //     }
      // }));

      // Bulk write the updates
      await Rates.insertMany(updatedRates, { ordered: false });
      return `${updatedRates.length} exchange rates updated`;
    } else {
      return "No changes in exchange rates";
    }

    //await session.commitTransaction();
  } catch (err) {
    //await session.abortTransaction();
    console.error(err);
    return "Error updating exchange rates";
  }
  // } finally {
  //     session.endSession();
  // }
}

module.exports = updateExchangeRates;
