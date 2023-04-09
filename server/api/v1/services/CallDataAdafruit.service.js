const axios = require("axios");
const axiosClient = axios.create({
  baseURL: "https://io.adafruit.com/api/v2/",
  timeout: 5000,
  headers: { "x-aio-key": "aio_cTDy09wYPf9Cs1MkqsA1wOHaMNFc" },
});

const AdafruitAPI = {
  getCurrentAmountInPlate() {
    return axiosClient.get("binh28127/feeds/food-weight/data", { params: { limit: 1 } });
  },
  sendAmountFood(data) {
    return axiosClient.post("binh28127/feeds/food-amount/data", data);
  },
};

module.exports = AdafruitAPI;
