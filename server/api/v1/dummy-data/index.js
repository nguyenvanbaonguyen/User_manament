const fs = require("fs");
const { exit } = require("process");
const userModel = require("../components/user/user.model");

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await userModel.create(users);
    exit(1);
  } catch (err) {
    console.log(err);
  }
};

// //Delete DATA from DB
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     await ReviewModel.deleteMany();
//     await UserModel.deleteMany();
//     console.log("Data delete successfully");
//     exit(1);
//   } catch (err) {
//     console.log(err);
//   }
// };

if (process.argv[2] === "--import") {
  importData();
}
