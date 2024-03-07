import React from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";

const DefaultLayout = () => {
  return (
    <DashboardLayout>
      <DashboardComponent>
        <div
          style={{
            padding: 24,
            minHeight: 360,
          }}
        >
          hello
        </div>
      </DashboardComponent>
    </DashboardLayout>
  );
};

export default DefaultLayout;
