import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../css/chefsList.css";

export default function ChefsList(){
  const [allChefs, setAllChefs] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:3500/kitchenChef/chefs"); // Fetch chefs data from backend
      const data = await response.json();
      setAllChefs(data);
    } catch (error) {
      console.error("Error fetching chefs:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(fetchInfo, 40000); // Fetch data every 40 seconds
    return () => clearInterval(interval);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    const chefsToday = allChefs.filter(
      chef =>
        chef.date instanceof Date &&
        !isNaN(chef.date.getTime()) &&
        chef.date.toISOString().split("T")[0] === currentDate
    );

    doc.setFontSize(10);
    doc.text("Date: " + currentDate, 10, 15);

    // Add title
    doc.setTextColor("black");
    doc.setFontSize(20);
    doc.setFont("bold");
    doc.text("Chef Report " + currentDate, 105, 25, { align: "center" });

    // Add introductory text
    doc.setFont("normal");
    doc.setFontSize(12);
    doc.text("This report contains information about the chefs for the day.", 105, 35, { align: "center" });

    // Table headers
    const headers = ["Chef ID", "Chef Name", "Orders Completed"];

    // AutoTable options
    const tableOptions = {
      startY: 50, // Start position for the table
      head: [headers], // Include table headers
      styles: {
        cellPadding: 5,
        fontSize: 12,
        valign: "middle", // vertical alignment
        halign: "center", // horizontal alignment
        textColor: [0, 0, 0], // Text color
        fillColor: [211, 211, 211], // Fill color
      },
    };

    // Table data (chef details)
    const chefData = chefsToday.map(chef => [
      chef.chef_id.toString(),
      chef.chef_name.toString(),
      chef.orders_completed.toString(),
    ]);

    // Add table data to options
    tableOptions.body = chefData;

    // Add table
    doc.autoTable(tableOptions);

    // Save PDF
    doc.save("chef_report_" + currentDate + ".pdf");
  };

  return (
    <div>
      <div className="report">
        <div className="report-header">
          <h1>All Chefs List</h1>
          <button className="generate-pdf-button" onClick={generatePDF}>
            Generate Report
          </button>
        </div>
        <div className="report-format-main">
          <p>Chef ID</p>
          <p>Chef Name</p>
          <p>Orders Completed</p>
        </div>
        <div className="report-allchef">
          <hr />
          {allChefs.map((chef, index) => (
            <React.Fragment key={index}>
              <div className="report-format-main report-format">
                <p>{chef.chef_id}</p>
                <p>{chef.chef_name}</p>
                <p>{chef.orders_completed}</p>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
