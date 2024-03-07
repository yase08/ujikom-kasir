import axios from "axios";
import { BASEURL } from "../utils/url";
import { config } from "../utils/config";

export const register = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/auth/register`,
      requestData
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const login = async (requestData) => {
  try {
    const response = await axios.post(`${BASEURL}/api/auth/login`, requestData);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      throw error.response.data.message;
    }
  }
};

export const me = async () => {
  try {
    const response = await axios.get(`${BASEURL}/api/auth/me`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      throw error.response.data.message;
    }
  }
};
