import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumber = () => {
    const pageNumber = [];

    // Batas jumlah tampilan halaman sekaligus
    const maxVisiblePages = 5;

    // Hitung awal dan akhir halaman yang akan ditampilkan
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Jika halaman terlalu sedikit, sesuaikan startPage dan endPage
    if (totalPages <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // Jika halaman terlalu banyak, tampilkan titik-titik di tengah
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumber.push(
        <div key={i} className="join" onClick={() => onPageChange(i)}>
          <button
            className={`${i === currentPage ? "btn-active" : ""} join-item btn`}
          >
            {i}
          </button>
        </div>
      );
    }

    return pageNumber;
  };
  return (
    <div className="flex gap-3 items-center mt-5">
      <div
        className={`join-item btn btn-outline btn-sm`}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <IoIosArrowBack size={15} />
      </div>
      <div className="flex gap-3">{renderPageNumber()}</div>
      <div
        className={`join-item btn btn-outline btn-sm`}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <IoIosArrowForward size={15} />
      </div>
    </div>
  );
}

export default Pagination;
