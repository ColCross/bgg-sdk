import axiosBase from "axios";
import axiosRetry from "axios-retry";
import convert from "xml-js";

export const axios = axiosBase.create({
  baseURL: "https://boardgamegeek.com/xmlapi2/",
});

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

axios.interceptors.response.use(
  (response) => {
    try {
      const jsonData = convert.xml2js(response.data, { compact: true });
      response.data = jsonData;
      return response;
    } catch (error) {
      throw new Error("Failed to parse XML data from BGG");
    }
  },
  (error) => {
    return Promise.reject(`Unexpected error calling BGG API: ${error.stack}`);
  },
);
