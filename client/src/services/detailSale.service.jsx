import axios from "axios";
import { config } from "../utils/config";
import { BASEURL } from "../utils/url";

export const getDetailSales = async ({ currentPage, search }) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/detail-sales?search=${search}&page=${currentPage}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getDetailSale = async (id) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/detail-sales/detail/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const exportDetailSale = async () => {
  try {
    const configHeader = {
      method: "GET",
      url: URL,
      responseType: "arraybuffer",
    };

    const response = await axios.get(
      `${BASEURL}/api/detail-sales/export`,
      configHeader
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const deleteDetailSale = async (id) => {
  try {
    const response = await axios.delete(
      `${BASEURL}/api/detail-sales/${id}`,
      config
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const updateDetailSale = async ({ id, updateData }) => {
  try {
    const response = await axios.put(
      `${BASEURL}/api/detail-sales/${id}`,
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

export const createDetailSale = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/detail-sales`,
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
