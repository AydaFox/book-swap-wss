const mongoose = require("mongoose");

require("dotenv").config({
  path: `${__dirname}/../.env.production`,
});

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

module.exports = db;
