const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

console.log(initData);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => console.log("connection to database successfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initiDb = async () => {
  initData.data.forEach((obj) => {
    obj.owner = "65fbb22ec785a60bce7c7438";
    console.log(obj);
  });
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data added to db");
};

initiDb();
