import { NavLink } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";

export function SidebarItem({ icon, text, active, alert, link }) {
  const { expanded } = useSidebar();

  return (
    <NavLink to={link}>
      <div
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-base-100 text-neutral-content"
            : "hover:bg-base-100 text-neutral-content"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          >
            {!expanded && (
              <div
                className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-base-300 text-neutral-content text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
              >
                {text}
              </div>
            )}
          </div>
        )}
      </div>
    </NavLink>
  );
}
