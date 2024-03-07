import React from "react";
import { Link } from "react-router-dom";

function Base({ children }) {
  return (
    <div>
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <Link to={"/"} className="btn btn-ghost text-xl">Template</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}

export default Base;
