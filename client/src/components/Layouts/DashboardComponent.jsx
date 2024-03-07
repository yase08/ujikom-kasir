import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BASEURL } from "../../utils/url";
import { useUser } from "../../contexts/UserContext";

const DashboardComponent = ({ children }) => {
  const { user, isLoading } = useUser();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    setAuth({});
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="px-10 py-5">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">
              <img src="https://img.logoipsum.com/243.svg" alt="" />
            </a>
          </div>
          <dialog id="profile_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-5">Profile User</h3>
              <div className="flex flex-col gap-5 mb-5">
                <div className="flex flex-col">
                  <div className="flex gap-10">
                    {user.image === null ? (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-24">
                          <span className="text-lg">U</span>
                        </div>
                      </div>
                    ) : (
                      <div className="avatar">
                        <div className="w-24 rounded-full">
                          <img src={`${BASEURL}/images/${user.image}`} />
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold">
                          {user.fullname ? user.fullname : "-"}
                        </div>
                        <div className="badge badge-outline badge-primary badge-sm">
                          {user.role}
                        </div>
                      </div>
                      <div className="text-lg font-medium">
                        {user.address ? user.address : "-"}
                      </div>
                      <div className="text-xs">
                        @{user.username ? user.username : "-"}
                      </div>
                      <div className="text-xs">
                        {user.email ? user.email : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                className="avatar placeholder btn btn-ghost btn-circle"
                tabIndex={0}
                role="button"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-lg">
                    {user.image === null ||
                    user.image === "" ||
                    user.image === undefined ? (
                      "U"
                    ) : (
                      <div className="avatar">
                        <div className="w-14 rounded-full">
                          <img src={`${BASEURL}/images/${user.image}`} />
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button
                    onClick={() =>
                      document.getElementById("profile_modal").showModal()
                    }
                    className="justify-between"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <Link to={"/dashboard/setting"}>Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardComponent;
