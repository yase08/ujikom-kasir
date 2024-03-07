import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";
import {
  createUser,
  deleteUser,
  exportUser,
  getUsers,
} from "../../../services/user.service";
import Pagination from "../../Elements/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { BASEURL } from "../../../utils/url";
import { Link } from "react-router-dom";
import { TfiExport } from "react-icons/tfi";
import axios from "axios";

function DashboardUserPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    address: "",
    password: "",
    image: null,
  });
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
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("fullname", formData.fullname);
    data.append("address", formData.address);
    data.append("password", formData.password);
    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await createUser(data);
    if (res?.status === 201) {
      setError(false);
      setMessage(res.data.message);
      setAlert(true);
    } else {
      setError(true);
      setMessage(res?.data.message);
      setAlert(true);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetch = async () => {
    try {
      const res = await getUsers({
        currentPage,
        search,
      });
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteUser(id);
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

  const handleExport = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/users/export`, {
        responseType: "blob",
      });

      if (response.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const outputFileName = `user-data-${Date.now()}.xlsx`;

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
            <div className="text-2xl font-semibold pb-5">User List</div>
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
                Create User
              </button>
            </div>
            <dialog id="create_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Create User</h3>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Username</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Email</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Fullname</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullname: e.target.value,
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
                      <span className="label-text">Password</span>
                    </div>
                    <input
                      type="password"
                      placeholder="Type here"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Pick a file</span>
                    </div>
                    <input
                      name="image"
                      type="file"
                      className="file-input file-input-bordered w-full max-w-xs"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.files[0],
                        })
                      }
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>Fullname</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      <td>{item.fullname === null ? "-" : item.fullname}</td>
                      <td>{item.address === null ? "-" : item.address}</td>
                      <td>
                        <p className="lowercase">{item.role}</p>
                      </td>
                      <td>
                        {item.image === null ? (
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span className="text-lg">U</span>
                            </div>
                          </div>
                        ) : (
                          <div className="avatar">
                            <div className="w-10 rounded-full">
                              <img src={`${BASEURL}/images/${item.image}`} />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="flex gap-3">
                        <Link
                          className="btn btn-info btn-sm text-white text-xs"
                          to={`${item.id}`}
                        >
                          Edit
                        </Link>
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

export default DashboardUserPage;
