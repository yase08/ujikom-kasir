import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSidebar } from "../../contexts/SidebarContext";

function Sidebar({ children }) {
  const { expanded, setExpanded } = useSidebar();
  return (
    <aside className="flex min-h-screen">
      <div className="flex-shrink-0">
        <nav className="h-full flex flex-col bg-neutral border-4 border-base-100 shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt=""
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg"
            >
              {expanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
