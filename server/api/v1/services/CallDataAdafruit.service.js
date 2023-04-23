const axios = require("axios");
const { ADAFRUIT_KEY } = require("../../../config");

const axiosClient = axios.create({
  baseURL: "https://io.adafruit.com/api/v2/",
  timeout: 5000,
  headers: { "x-aio-key": ADAFRUIT_KEY },
});

const AdafruitAPI = {
  getCurrentAmountInPlate() {
    return axiosClient.get("binh28127/feeds/food-weight/data", { params: { limit: 1 } });
  },
  getCurrentWater() {
    return axiosClient.get("binh28127/feeds/water-weight/data", { params: { limit: 1 } });
  },
  sendAmountFood(data) {
    return axiosClient.post("binh28127/feeds/food-amount/data", data);
  },
  sendAmountWater(data) {
    return axiosClient.post("binh28127/feeds/water-amount/data", data);
  },
  sendSignalClean(data) {
    return axiosClient.post("binh28127/feeds/clean-signal/data", data);
  },
  convertTypeToFunctionAdafruit(type) {
    switch (type) {
      case "food":
        return this.sendAmountFood;
      case "water":
        return this.sendAmountWater;
      case "clean":
        return this.sendSignalClean;
      default:
        return null;
    }
  },
};

module.exports = AdafruitAPI;
