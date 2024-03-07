import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";
import Pagination from "../../Elements/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { BASEURL } from "../../../utils/url";
import { TfiExport } from "react-icons/tfi";
import axios from "axios";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../services/product.service";

function DashboardProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
  });
  const [formOld, setFormOld] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedCallback((value) => {
    setSearch(value);
  }, 1000);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleCreate = async () => {
    if (formOld) {
      const res = await updateProduct({
        id: formOld.id,
        updateData: {
          name: formOld.name,
          price: parseInt(formOld.price),
          stock: parseInt(formOld.stock),
        },
      });
      if (res?.status === 200) {
        setError(false);
        setMessage(res.data.message);
        setAlert(true);
        navigate("/dashboard/users");
      } else {
        setError(true);
        setMessage(res?.data.message);
        setAlert(true);
      }
    } else {
      const res = await createProduct({
        name: formData.name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      });
      if (res?.status === 201) {
        setError(false);
        setMessage(res.data.message);
        setAlert(true);
      } else {
        setError(true);
        setMessage(res?.data.message);
        setAlert(true);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetch = async () => {
    try {
      const res = await getProducts({
        currentPage,
        search,
      });
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteProduct(id);
    if (res?.status === 200) {
      setError(false);
      setMessage(res.data.message);
      setAlert(true);
    } else {
      setError(true);
      setMessage(res?.data.message);
      setAlert(true);
    }
    handleFetch();
  };

  const handleEdit = (id) => {
    const selectedItem = data?.products?.find((item) => item.id === id);

    setFormOld({
      id: selectedItem?.id || 0,
      name: selectedItem?.name || "",
      price: selectedItem?.price || 0,
      stock: selectedItem?.stock || 0,
    });
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/products/export`, {
        responseType: "blob",
      });

      if (response.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const outputFileName = `product-data-${Date.now()}.xlsx`;

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", outputFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Export failed: Empty response data");
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  useEffect(() => {
    handleFetch();
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [search, currentPage, alert]);

  useEffect(() => {
    console.log(data?.totalPages);
    setTotalPages(data?.totalPages);
  }, []);
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
          <div className="w-full flex flex-col">
            <div className="text-2xl font-semibold pb-5">Product List</div>
            <div className="flex gap-3 justify-end w-full">
              <button className="btn btn-neutral" onClick={handleExport}>
                <TfiExport size={20} />
              </button>
              <button
                className="btn btn-primary self-end"
                onClick={() =>
                  document.getElementById("create_modal").showModal()
                }
              >
                Create Product
              </button>
            </div>
            <dialog id="create_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Create Product</h3>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formOld ? formOld.name : formData.name}
                      onChange={(e) =>
                        formOld
                          ? setFormOld({ ...formOld, name: e.target.value })
                          : setFormData({ ...formData, name: e.target.value })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Price</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Type here"
                      value={formOld ? formOld.price : formData.price}
                      onChange={(e) =>
                        formOld
                          ? setFormOld({ ...formOld, price: e.target.value })
                          : setFormData({ ...formData, price: e.target.value })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Stock</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Type here"
                      value={formOld ? formOld.stock : formData.stock}
                      onChange={(e) =>
                        formOld
                          ? setFormOld({ ...formOld, stock: e.target.value })
                          : setFormData({ ...formData, stock: e.target.value })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleCreate}
                >
                  Submit
                </button>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full max-w-xs mb-3"
              onChange={(e) => debounced(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.products?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.price)}
                      </td>
                      <td>{item.stock}</td>
                      <td className="flex gap-3">
                        <button
                          className="btn btn-info btn-sm text-white text-xs"
                          onClick={() => {
                            handleEdit(item.id);
                            document.getElementById("create_modal").showModal();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-error btn-sm text-white text-xs"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </DashboardComponent>
    </DashboardLayout>
  );
}

export default DashboardProductPage;
