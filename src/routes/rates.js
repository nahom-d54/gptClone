const express = require("express");

const rateController = require("../controllers/rates");
const asyncHandler = require("../utils/asyncHandler");
const {
  checkIfAdmin,
  checkSubscription,
  limiter,
} = require("../controllers/middlewares");

const router = express.Router();

/**
 * @swagger
 * /rates/best-buy-rate:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the best buy rate
 *     description: Returns the best buy rate
 *     responses:
 *       200:
 *         description: The best buy rate
 */
router.get("/best-buy-rate", limiter, asyncHandler(rateController.bestBuyRate));
/**
 * @swagger
 * /rates/bank-names:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get an array of all bank names in the database
 *     description: Returns an array of all bank names in the database
 *     responses:
 *       200:
 *         description: An array of bank names
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Bank names not found
 */
router.get("/bank-names", limiter, asyncHandler(rateController.getBankNames));

/**
 * @swagger
 * /rates/update-exchange-rates:
 *   post:
 *     tags:
 *       - Rates
 *     summary: Update exchange rates
 *     description: Update exchange rates
 *     responses:
 *       200:
 *         description: Exchange rates updated successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Exchange rates not found
 */
router.post(
  "/update-exchange-rates",
  asyncHandler(rateController.updateExchangeRate)
);

/**
 * @swagger
 * /rates:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get all exchange rates
 *     description: Returns all exchange rates
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: The exchange rates
 */
router.get("/", limiter, asyncHandler(rateController.getAllExchangeRates));

/**
 * @swagger
 * /rates/currency-codes:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get all currency codes
 *     description: Returns all currency codes
 *     responses:
 *       200:
 *         description: The currency codes
 */
router.get(
  "/currency-codes",
  limiter,
  asyncHandler(rateController.getCurrencyCodes)
);

/**
 * @swagger
 * /rates/bnc/{bankName}/{currencyCode}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the exchange rate for a specific bank and currency code
 *     description: Returns the exchange rate for a specific bank and currency code
 *     parameters:
 *       - in: path
 *         name: bankName
 *         description: The name of the bank
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: currencyCode
 *         description: The currency code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Exchange rate not found
 *
 */
router.get(
  "bnc/:bankName/:currencyCode",
  limiter,
  asyncHandler(rateController.getExchangeRateForBankAndCurrencyCode)
);

/**
 * @swagger
 * /rates/c/{currencyCode}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the exchange rate for a specific currency code
 *     description: Returns the exchange rate for a specific currency code
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         description: The currency code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Exchange rate not found
 */
router.get(
  "/c/:currencyCode",
  limiter,
  asyncHandler(rateController.getExchangeRateForCurrencyCode)
);

/**
 * @swagger
 * /rates/exchange-rate/{date}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the exchange rate for a specific date
 *     description: Returns the exchange rate for a specific date
 *     parameters:
 *       - in: path
 *         name: date
 *         description: The date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 */
router.get(
  "/exchange-rate/:date",
  limiter,
  asyncHandler(rateController.getExchangeRateForDate)
);

/**
 * @swagger
 * /rates/bnd/{bankName}/{date}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the exchange rate for a specific bank and date
 *     description: Returns the exchange rate for a specific bank and date
 *     parameters:
 *       - in: path
 *         name: bankName
 *         description: The name of the bank
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: date
 *         description: The date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Exchange rate not found
 */
router.get(
  "/bnd/:bankName/:date",
  limiter,
  asyncHandler(rateController.getExchangeRateForBankAndDate)
);

/**
 * @swagger
 * /rates/cnd/{currencyCode}/{date}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: Get the exchange rate for a specific currency code and date
 *     description: Returns the exchange rate for a specific currency code and date
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         description: The currency code
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: date
 *         description: The date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Exchange rate not found
 */
router.get(
  "/cnd/:currencyCode/:date",
  limiter,
  asyncHandler(rateController.getExchangeRateForCurrencyCodeAndDate)
);

/**
 * @swagger
 * /rates/b/{bankName}:
 *   get:
 *     tags:
 *       - Rates
 *     summary: get exchange rate for a specific bank
 *     description: Returns the exchange rate for a specific bank
 *     parameters:
 *       - in: path
 *         name: bankName
 *         description: The name of the bank
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The exchange rate
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Bank names not found
 */
router.get(
  "/b/:bankName",
  limiter,
  asyncHandler(rateController.getExchangeRateForBank)
);

module.exports = router;
