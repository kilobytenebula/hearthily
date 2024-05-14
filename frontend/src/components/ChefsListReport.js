import React from "react";
import jsPDF from "jspdf";
import logoImage from "../icons/logo.png";

const ChefsListReport = ({ chefs }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const bgColor = "#1F1D2B"; // Cell background
    const bg100 = "#252836"; // PDF background
    const orange200 = "#F28638"; // Header background
    const textColor = "#F4F4F4"; // Text color

    doc.setFillColor(bg100);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");

    const headerHeight = 22.5;
    const margin = 20;
    const logoWidth = 30;

    doc.addImage(logoImage, "PNG", margin, margin, logoWidth, headerHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(textColor);
    doc.text("Chefs List Report", doc.internal.pageSize.getWidth() / 2, margin + (headerHeight / 2), null, null, "center");

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const headerContent = `${formattedDate} ${formattedTime}`;

    doc.setFontSize(10);
    doc.text(headerContent, doc.internal.pageSize.getWidth() - margin, margin + (headerHeight / 2), null, null, "right");

    const headers = ["Chef ID", "Chef Name", "Orders Completed"];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    const cellWidth = 60;
    const cellHeight = 20;
    const tableWidth = cellWidth * headers.length;
    const tableXPos = (doc.internal.pageSize.getWidth() - tableWidth) / 2;
    let yPos = margin + headerHeight + 10;

    doc.setFillColor(orange200);
    doc.rect(tableXPos, yPos, tableWidth, cellHeight, "F");
    doc.setTextColor(textColor);
    headers.forEach((header, index) => {
      doc.text(header, tableXPos + (index * cellWidth) + (cellWidth / 2), yPos + (cellHeight / 2), null, null, "center");
    });

    doc.setFont("helvetica");
    doc.setFontSize(10);

    yPos += cellHeight;
    chefs.forEach((chef) => {
      const values = [
        chef.chef_id.toString(),
        chef.chef_name,
        chef.orders_completed.toString(),
      ];

      values.forEach((value, index) => {
        const cellValue = value !== null ? value.toString() : "";
        doc.setFillColor(bgColor);
        doc.rect(tableXPos + (index * cellWidth), yPos, cellWidth, cellHeight, "F");
        doc.setTextColor(textColor);
        doc.text(cellValue, tableXPos + (index * cellWidth) + (cellWidth / 2), yPos + (cellHeight / 2), null, null, "center");
      });
      yPos += cellHeight;
    });

    doc.save("chefs_list_report.pdf");
  };

  return (
    <div className="chefs-report-actions">
      <div className="chefs-report-action-btn" onClick={handleDownloadPDF}>Download PDF Report</div>
    </div>
  );
};

export default ChefsListReport;
