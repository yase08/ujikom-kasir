import React from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import DashboardComponent from "../../Layouts/DashboardComponent";

function DashboardHelpPage() {
  return (
    <DashboardLayout>
      <DashboardComponent>
        <div className="p-6 min-h-screen flex justify-between bg-base-100">
          <div className="w-full flex flex-col">
            <div className="text-2xl font-semibold pb-5">Help</div>
            <div className="prose">
              <h2>How to Use Our Dashboard</h2>
              <p>
                Welcome to our Dashboard! Here are some instructions on how to
                use the features:
              </p>
              <ul>
                <li>Feature 1: ...</li>
                <li>Feature 2: ...</li>
              </ul>

              <h2>FAQs</h2>
              <p>Common questions and answers:</p>
              <ul>
                <li>Q: How do I update my profile?</li>
                <li>A: To update your profile, navigate to the ...</li>
              </ul>
            </div>
          </div>
        </div>
      </DashboardComponent>
    </DashboardLayout>
  );
}

export default DashboardHelpPage;
