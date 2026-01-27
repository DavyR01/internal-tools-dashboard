import axios from "axios";

export const api = axios.create({
   baseURL: "https://tt-jsonserver-01.alt-tools.tech",
   headers: {
      "Content-Type": "application/json",
   },
});
