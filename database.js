require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017";

const database = process.env.DB_NAME || "library";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dbConnection() {
  try {
    await client.connect();
    console.info("db connected");
    return client;
  } catch (error) {
    console.log("connection error");
    console.error(error);
  }
}
module.exports = {
  dbconnect: dbConnection,
  db: client.db(database),
};
