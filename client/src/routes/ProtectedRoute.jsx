import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import hasAuthToken from "./hasAuthToken";

function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        if (hasAuthToken()) {
          // Redirect to the dashboard
          navigate.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    checkToken();

    return () => (isMounted = false);
  }, [navigate]); // Make sure to include navigate in the dependency array

  return (
    <>
      {!hasAuthToken() ? (
        <Outlet />
      ) : isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          Loading...
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default ProtectedRoute;
