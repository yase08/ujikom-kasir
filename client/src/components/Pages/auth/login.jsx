import React, { useEffect, useState } from "react";
import { login } from "../../../services/auth.service";
import { Link } from "react-router-dom";
import Base from "../../Layouts/Base";
import { useAuth } from "../../../contexts/AuthContext";

function Login() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const { auth, setAuth } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    const res = await login(data);
    if (res?.status === 200) {
      const role = res.data.data.role;
      const token = res.data.data.token;
      setError(false);
      setMessage(res.data.message);
      setAlert(true);
      setAuth({
        role,
        token,
      });
      window.location.href = "/dashboard";
    } else {
      setError(true);
      setMessage(res?.data.message);
      setAlert(true);
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <Base>
      <div className="bg-base-100 w-full min-h-screen flex items-center justify-center flex-col">
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
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center justify-center py-10 flex-col w-full max-w-lg border-2 border-white rounded-md">
            <h1 className="text-2xl text-slate-300 font-bold text-left mb-5">
              Welcome to Gallery app 👋
            </h1>
            <div className="w-full px-10">
              <form onSubmit={handleSubmit}>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">What is your email?</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full mb-5">
                  <div className="label">
                    <span className="label-text">What is your password?</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <button className="w-full btn btn-primary">Login</button>
              </form>
            </div>{" "}
            {window.location.pathname === "/login" ? (
              <p className="text-sm mt-5 text-center text-slate-300">
                New on our platform?{" "}
                <Link
                  to={"/register"}
                  className="font-bold text-blue-500 hover:text-blue-400"
                >
                  Create an account
                </Link>
              </p>
            ) : (
              <p className="text-sm mt-5 text-center text-slate-300">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-bold text-blue-500 hover:text-blue-400"
                >
                  Sign in instead
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
}

export default Login;
