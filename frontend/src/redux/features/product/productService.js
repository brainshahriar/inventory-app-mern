import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/products/`;

// Create New Product
const createProduct = async (formData) => {
  const response = await axios.post(`${API_URL}/create-product`, formData);
  return response.data;
};

// Get all products
const getProducts = async () => {
  const response = await axios.get(`${API_URL}/get-all-products`);
  return response.data;
};

// Delete a Product
const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/delete-product/` + id);
  return response.data;
};
// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/get-single-product/` + id);
  return response.data;
};
// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}/update-product/${id}`, formData);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};

export default productService;
