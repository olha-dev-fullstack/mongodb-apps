require("dotenv").config();

const { MongoClient } = require("mongodb");
const mongoDbUrl = process.env.MONGODB_CONNECTION_STRING;

let _db;

const initDB = (callback) => {
  if (_db) {
    console.log("Database is already initialized");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
    .then((client) => {
      _db = client.db(process.env.DB_NAME);
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("No database connection");
  }
  return _db;
};

module.exports = {
  initDB,
  getDb,
};
