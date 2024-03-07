import axios from "axios";
import { config } from "../utils/config";
import { BASEURL } from "../utils/url";

export const getCustomers = async ({ currentPage, search }) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/customers?search=${search}&page=${currentPage}`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const exportCustomer = async () => {
  try {
    const configHeader = {
      method: "GET",
      url: URL,
      responseType: "arraybuffer",
    };

    const response = await axios.get(
      `${BASEURL}/api/customers/export`,
      configHeader
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getCustomer = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/api/customers/${id}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const getCustomerOptions = async (id) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/customers/customer`,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(
      `${BASEURL}/api/customers/${id}`,
      config
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message;
    }
  }
};

export const updateCustomer = async ({ id, updateData }) => {
  try {
    const response = await axios.put(
      `${BASEURL}/api/customers/${id}`,
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

export const createCustomer = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/customers`,
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
