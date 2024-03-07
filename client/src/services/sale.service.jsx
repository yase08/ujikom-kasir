import axios from "axios";
import { config } from "../utils/config";
import { BASEURL } from "../utils/url";

export const getSales = async ({ currentPage, search }) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/sales?search=${search}&page=${currentPage}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getSalesByDetailSale = async (id) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/sales/detail/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const exportSale = async () => {
  try {
    const configHeader = {
      method: "GET",
      url: URL,
      responseType: "arraybuffer",
    };

    const response = await axios.get(
      `${BASEURL}/api/sales/export`,
      configHeader
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getSale = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/sales/${id}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getSaleOptions = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/sales/sale`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const deleteSale = async (id) => {
  try {
    const response = await axios.delete(`${BASEURL}/api/sales/${id}`, config);
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const updateSale = async ({ id, updateData }) => {
  try {
    const response = await axios.put(
      `${BASEURL}/api/sales/${id}`,
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

export const createSale = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/sales`,
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
