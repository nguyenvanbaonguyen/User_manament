global.__publicdir = `${__dirname}/public`;
global.__imagedir = `${__publicdir}/images`;

const app = require("./server/app");
const { PORT, MONGO_HOST } = require("./server/config");

app.listen(PORT, () => {
  console.log(`Welcome to my app in port ${PORT} 222222`);
  console.log(MONGO_HOST, 1111);
});
