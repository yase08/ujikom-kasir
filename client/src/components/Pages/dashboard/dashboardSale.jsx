import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";
import { Link, useNavigate } from "react-router-dom";
import { getProductOptions } from "../../../services/product.service";
import { createCustomer } from "../../../services/customer.service";
import { createDetailSale } from "../../../services/detailSale.service";
import { createSale } from "../../../services/sale.service";

function DashboardSalePage() {
  const navigate = useNavigate();
  const initialProductQuantity =
    Number(sessionStorage.getItem("productQuantity")) || 1;
  const [productQuantity, setProductQuantity] = useState(
    initialProductQuantity
  );
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    products: [],
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleCreate = async () => {
    try {
      // Mengambil data produk dari array products
      const productData = formData.products.map((product) => {
        const foundProduct = products.find(
          (prod) => prod.id === parseInt(product.id)
        );
        return {
          id: parseInt(foundProduct.id),
          name: foundProduct.name,
          price: foundProduct.price,
          quantity: parseInt(product.quantity),
        };
      });

      // Membuat pelanggan baru
      const resCustomer = await createCustomer({
        name: formData.name,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
      });

      // Menghitung total harga
      const totalPrice = productData.reduce(
        (acc, product) =>
          acc + parseInt(product.price) * parseInt(product.quantity),
        0
      );

      // Membuat penjualan baru
      const resSale = await createSale({
        customer_id: resCustomer?.data?.customer.id,
        saleDate: new Date(),
        totalPrice: totalPrice,
      });

      // Membuat detail penjualan
      const resDetailSale = await createDetailSale({
        products: productData.map((product) => {
          return {
            sale_id: resSale?.data?.sale.id,
            product_id: parseInt(product.id),
            totalProduct: parseInt(product.quantity),
            subTotal: parseInt(product.price) * parseInt(product.quantity),
          };
        }),
      });

      sessionStorage.setItem("productQuantity", 1);
    } catch (error) {
      console.error("Error creating sale and detail sale:", error);
    }
  };

  const handleFetch = async () => {
    try {
      const res = await getProductOptions();
      if (Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("productQuantity", productQuantity);
    handleFetch();
  }, [productQuantity]);
  return (
    <DashboardLayout>
      <DashboardComponent>
        {alert && (
          <div
            role="alert"
            className={`alert ${
              error ? "alert-error" : "alert-success"
            } absolute max-w-sm top-10`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        )}
        <div className="p-6 min-h-screen flex justify-between bg-base-100">
          <div className="w-full flex flex-col gap-5">
            <div className="text-2xl font-semibold pb-5">Buy Product</div>
            <div className="flex gap-3 justify-end w-full"></div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 w-full">
                <div>
                  <div>Create Customer</div>
                </div>
                <div className="flex gap-5">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Address</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Mobile Number</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </div>
              </div>
              <div>
                <div>
                  <div>Buy Products</div>
                </div>
                <div>
                  {[...Array(productQuantity)].map((_, index) => (
                    <div className="flex gap-5" key={index}>
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Product</span>
                        </div>
                        <select
                          className="select select-bordered"
                          onChange={(e) => {
                            const newProduct = {
                              id: e.target.value,
                              quantity: 1,
                            };
                            setFormData({
                              ...formData,
                              products: [...formData.products, newProduct],
                            });
                          }}
                        >
                          <option disabled selected>
                            Pick one
                          </option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Quantity</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Type here"
                          value={formData.products[index]?.quantity || 1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              products: formData.products.map((product, i) =>
                                i === index
                                  ? {
                                      ...product,
                                      quantity: parseInt(e.target.value),
                                    }
                                  : product
                              ),
                            })
                          }
                          className="input input-bordered w-full max-w-xs"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setProductQuantity(productQuantity + 1);
                  }}
                  className="btn btn-primary mt-5"
                >
                  Add Product
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCreate}>
              Submit
            </button>
          </div>
        </div>
      </DashboardComponent>
    </DashboardLayout>
  );
}

export default DashboardSalePage;
