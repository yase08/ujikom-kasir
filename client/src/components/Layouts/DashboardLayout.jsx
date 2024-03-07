import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import Sidebar from "../Elements/Sidebar";
import { SidebarItem } from "../Elements/SidebarItem";
import { IoSettingsOutline } from "react-icons/io5";
import { IoHelpBuoyOutline } from "react-icons/io5";
import { AiOutlineInbox } from "react-icons/ai";
import { FaSellcast } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";

const DashboardLayout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<MdOutlineDashboard size={20} />}
            text={"Dashboard"}
            link={"/dashboard"}
            active={pathname === "/dashboard"}
          >
            Dashboard
          </SidebarItem>
          <SidebarItem
            icon={<CiUser size={20} />}
            text={"User"}
            link={"/dashboard/users"}
            active={pathname === "/user"}
          >
            User
          </SidebarItem>
          <SidebarItem
            icon={<AiOutlineInbox size={20} />}
            text={"Product"}
            link={"/dashboard/products"}
            active={pathname === "/product"}
          >
            Product
          </SidebarItem>
          <SidebarItem
            icon={<FaSellcast size={20} />}
            text={"Sale"}
            link={"/dashboard/sales"}
            active={pathname === "/sale"}
          >
            Sale
          </SidebarItem>
          <SidebarItem
            icon={<FaRegClock size={20} />}
            text={"History"}
            link={"/dashboard/histories"}
            active={pathname === "/history"}
          >
            History
          </SidebarItem>
          <hr className="my-3 border-base-100" />
          <SidebarItem
            icon={<IoSettingsOutline size={20} />}
            text={"Setting"}
            link={"/dashboard/setting"}
            active={pathname === "/dashboard/setting"}
          />
          <SidebarItem
            icon={<IoHelpBuoyOutline size={20} />}
            text={"Help"}
            link={"/dashboard/help"}
            active={pathname === "/dashboard/help"}
          />
        </Sidebar>
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
