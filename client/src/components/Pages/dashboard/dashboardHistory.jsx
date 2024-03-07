import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";
import Pagination from "../../Elements/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { BASEURL } from "../../../utils/url";
import { Link } from "react-router-dom";
import { TfiExport } from "react-icons/tfi";
import axios from "axios";
import {
  getDetailSale,
  getDetailSales,
} from "../../../services/detailSale.service";
import { getSalesByDetailSale } from "../../../services/sale.service";

function DashboardHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedCallback((value) => {
    setSearch(value);
  }, 1000);
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetch = async () => {
    try {
      const res = await getDetailSales({
        currentPage,
        search,
      });
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetDetailSale = async (id) => {
    try {
      const res = await getDetailSale(id);
      setDetailData(res);
      console.log(res.detailSales);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/historys/export`, {
        responseType: "blob",
      });

      if (response.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const outputFileName = `history-data-${Date.now()}.xlsx`;

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
    console.log(data);
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
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex gap-3">
              {detailData &&
                detailData?.detailSales?.map((item) => {
                  return (
                    <div className="card w-96 bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">{item.productName}</h2>
                        <p>{item.productPrice}</p>
                        <div>{item.totalPrice}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </dialog>
        <div className="p-6 min-h-screen flex justify-between bg-base-100">
          <div className="w-full flex flex-col">
            <div className="text-2xl font-semibold pb-5">History List</div>
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
                Create History
              </button>
            </div>
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
                    <th>Customer Name</th>
                    <th>Total Product</th>
                    <th>Subtotal</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.detailSales?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.customerName}</td>
                      <td>{item.totalProduct}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.subTotal)}
                      </td>
                      <td>
                        {new Date(item.date)
                          .toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                          .slice(0, 8)}
                      </td>
                      <td className="flex gap-3">
                        <button
                          className="btn btn-secondary btn-sm text-white text-xs"
                          onClick={() => {
                            document.getElementById("my_modal_3").showModal();
                            handleGetDetailSale(item.sale_id);
                          }}
                        >
                          Detail
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

export default DashboardHistoryPage;
