import axios from "axios";
import axiosRetry from "axios-retry";
import convert from "xml-js";

const axiosInstance = axios.create({
  baseURL: "https://boardgamegeek.com/xmlapi2/",
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

axiosInstance.interceptors.response.use(
  (response) => {
    const jsonData = convert.xml2js(response.data, {compact: true});
    response.data = jsonData;
    return response;
  },
  (error) => {
    return Promise.reject({ message: "Error" });
  }
);

export default axiosInstance;
