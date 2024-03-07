import axios from "axios";
import { config } from "../utils/config";
import { BASEURL } from "../utils/url";

export const getUsers = async ({ currentPage, search }) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/users?search=${search}&page=${currentPage}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const exportUser = async () => {
  try {
    const configHeader = {
      method: "GET",
      url: URL,
      responseType: "arraybuffer",
    };

    const response = await axios.get(
      `${BASEURL}/api/users/export`,
      configHeader
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/users/${id}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BASEURL}/api/users/${id}`, config);
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const updateUser = async ({ id, updateData }) => {
  try {
    const response = await axios.put(
      `${BASEURL}/api/users/${id}`,
      updateData,
      config
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const createUser = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/users`,
      requestData,
      config
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};
