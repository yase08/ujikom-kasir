import axios from "axios";
import { config } from "../utils/config";
import { BASEURL } from "../utils/url";

export const getProducts = async ({ currentPage, search }) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/products?search=${search}&page=${currentPage}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const exportProduct = async () => {
  try {
    const configHeader = {
      method: "GET",
      url: URL,
      responseType: "arraybuffer",
    };

    const response = await axios.get(
      `${BASEURL}/api/products/export`,
      configHeader
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/products/${id}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getProductOptions = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/products/product`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${BASEURL}/api/products/${id}`,
      config
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const updateProduct = async ({ id, updateData }) => {
  try {
    const response = await axios.put(
      `${BASEURL}/api/products/${id}`,
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

export const createProduct = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/products`,
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
