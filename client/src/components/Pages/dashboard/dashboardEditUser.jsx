import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";
import { getUser, updateUser } from "../../../services/user.service";
import { useParams, useNavigate } from "react-router-dom";

function DashboardEditUserPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    address: "",
    password: "",
    image: null,
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const dataToUpdate = new FormData();
    dataToUpdate.append("username", formData.username);
    dataToUpdate.append("email", formData.email);
    dataToUpdate.append("fullname", formData.fullname);
    dataToUpdate.append("address", formData.address);
    dataToUpdate.append("password", formData.password);
    if (formData.image) {
      dataToUpdate.append("image", formData.image);
    }

    try {
      const res = await updateUser({ id, updateData: dataToUpdate });
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
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleFetch = async () => {
    try {
      const res = await getUser(id);
      setData(res.user);
      setFormData({
        username: res.user.username,
        email: res.user.email,
        fullname: res.user.fullname,
        address: res.user.address,
        password: "",
        image: null,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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
  }, [id, alert]);
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
            <div className="text-2xl font-semibold pb-5">Update User</div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-2 gap-5 mb-5">
                <label className="form-control w-full max-w-lg">
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
                    className="input input-bordered w-full max-w-lg"
                  />
                </label>
                <label className="form-control w-full">
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
                    className="input input-bordered w-full max-w-lg"
                  />
                </label>
                <label className="form-control w-full max-w-lg">
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
                    className="input input-bordered w-full max-w-lg"
                  />
                </label>
                <label className="form-control w-full max-w-lg">
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
                    className="input input-bordered w-full max-w-lg"
                  />
                </label>
                <label className="form-control w-full max-w-lg">
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
                    className="input input-bordered w-full max-w-lg"
                  />
                </label>
                <label className="form-control w-full max-w-lg">
                  <div className="label">
                    <span className="label-text">Pick a file</span>
                  </div>
                  <input
                    name="image"
                    type="file"
                    className="file-input file-input-bordered w-full max-w-lg"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>
              <button className="btn btn-primary w-full" onClick={handleUpdate}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </DashboardComponent>
    </DashboardLayout>
  );
}

export default DashboardEditUserPage;
