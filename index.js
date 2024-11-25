require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = require("./src/config/routes");
const connectToDb = require("./src/config/mongoose");
const swaggerRouter = require("./swagger");
const { initiatePassport } = require("./src/config/passportConfig");
const cors = require("cors");
const { initializeNodeMailer } = require("./src/config/nodeMailer");
const APIError = require("./src/errors/apiError");

initiatePassport();

const app = express();

app.use(passport.initialize());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("x-powered-by", "X.AI");
  res.setHeader("X-developed-by", "Nahom Dereje");
  next();
});
app.use(express.json());
app.use("/api-docs", swaggerRouter);
app.use("/api", router);

app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message,
      stack:
        err.fullStack && process.env.NODE_ENV === "production"
          ? err.stack
          : null,
    });
  }

  res.status(500).send({
    error: "Internal Server Error",
    stack: err.stack,
  });
});

async function main() {
  await connectToDb();
  const transporter = initializeNodeMailer();
  try {
    await transporter.verify();
    console.log("connected to mail server");
  } catch (error) {
    console.error(error);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();

module.exports = app;
