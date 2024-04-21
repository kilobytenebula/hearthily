import React from "react";
import jsPDF from "jspdf";
import logoImage from "../icons/logo.png";

const completedInfoReport = ({ driver, completedDeliveries }) => {
  const handleDownloadCSV = () => {
    // Generate CSV data
    const csvData = {
      Name: driver.name,
      "Contact number": driver.contact,
      "Average Rating": driver.averageRating,
      Availability: driver.isAvailable ? "Available" : "Not Available",
      "Completed Jobs": driver.deliveryCount,
    };

    // Create a CSV file
    const csvContent = Object.keys(csvData)
      .map((key) => `${key},${csvData[key]}`)
      .join("\n");

    // Create a Blob object with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary link element
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Create a URL for the Blob object
      const url = URL.createObjectURL(blob);

      // Set the link's href attribute to the URL
      link.setAttribute("href", url);

      // Set the link's download attribute to specify the filename
      link.setAttribute("download", `${driver.name}'s_report.csv`);

      // Append the link to the document body
      document.body.appendChild(link);

      // Click the link to trigger the download
      link.click();

      // Remove the link from the document body
      document.body.removeChild(link);
    } else {
      // Handle browsers that do not support the download attribute
      alert("Your browser does not support the download attribute.");
    }
  };

  const handleDownloadPDF = () => {
    // Create a new instance of jsPDF
    const doc = new jsPDF();

    // Set background and text colors
    const bgColor = "#1F1D2B"; // Cell background
    const bg100 = "#252836"; // PDF background
    const orange200 = "#F28638"; // Header background
    const textColor = "#F4F4F4"; // Text color

    // Set PDF background color
    doc.setFillColor(bg100);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    // Add document header
    const headerHeight = 22.5;
    const margin = 20;
    const logoWidth = 30;

    // Company logo
    doc.addImage(logoImage, "PNG", margin, margin, logoWidth, headerHeight);

    // Report title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(textColor);
    doc.text(
      `${driver.name}'s Report`,
      doc.internal.pageSize.getWidth() / 2,
      margin + headerHeight / 2,
      null,
      null,
      "center"
    );

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const headerContent = `${formattedDate} ${formattedTime}`;

    // Generated date
    doc.setFontSize(10);
    doc.text(
      headerContent,
      doc.internal.pageSize.getWidth() - margin,
      margin + headerHeight / 2,
      null,
      null,
      "right"
    );

    // Add title for basic driver's details
    const basicDetailsTitleYPos = margin + headerHeight + 30; // Adjust yPos to leave space below the header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text("Driver Information", margin, basicDetailsTitleYPos);

    // Add basic driver's details
    const basicDetailsYPos = basicDetailsTitleYPos + 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Name: ${driver.name}`, margin, basicDetailsYPos);
    doc.text(
      `Contact Number: ${driver.contact}`,
      margin,
      basicDetailsYPos + 10
    );
    doc.text(
      `Average Rating: ${driver.averageRating > 4.5 ? `${driver.averageRating} (Top Rated)` : driver.averageRating}`,
      margin,
      basicDetailsYPos + 20
    );
    doc.text(
      `Availability: ${driver.isAvailable ? "Available" : "Not Available"}`,
      margin,
      basicDetailsYPos + 30
    );
    doc.text(
      `Completed Jobs: ${driver.deliveryCount}`,
      margin,
      basicDetailsYPos + 40
    );

    // Define table headers
    const headers = [
      "Customer Name",
      "Date",
      "Location",
      "Payment Method",
      "Rating",
    ];

    // Define table data
    const data = completedDeliveries.map((completed) => [
      completed.cusName,
      completed.date,
      completed.cusLocation,
      completed.payment,
      completed.rating,
    ]);

    // Set font style and size for table headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // Define cell width and height
    const cellWidth = 40;
    const cellHeight = 20; // Increased height for two lines

    // Calculate table width
    const tableWidth = cellWidth * headers.length;

    // Calculate table x-position to center it in the document
    const tableXPos = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Define table position
    let yPos = basicDetailsYPos + 60; // Adjust yPos to leave space below the basic details

    const tableTitleYPos = yPos - 10; // Adjust yPos to leave space above the table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text(
      "Completed Jobs",
      doc.internal.pageSize.getWidth() / 2,
      tableTitleYPos,
      null,
      null,
      "center"
    );

    // Add table headers with increased height
    doc.setFillColor(orange200);
    doc.rect(tableXPos, yPos, tableWidth, cellHeight, "F");
    doc.setTextColor(textColor);
    headers.forEach((header, index) => {
      doc.text(
        header,
        tableXPos + index * cellWidth + cellWidth / 2,
        yPos + cellHeight / 2,
        null,
        null,
        "center"
      );
    });

    // Set font style and size for table content
    doc.setFont("helvetica");
    doc.setFontSize(10);

    // Add table rows
    yPos += cellHeight; // Start from below the header
    data.forEach((row) => {
      row.forEach((cell, index) => {
        doc.setFillColor(bgColor);
        doc.rect(
          tableXPos + index * cellWidth,
          yPos,
          cellWidth,
          cellHeight,
          "F"
        );
        doc.setTextColor(textColor);
        doc.text(
          cell.toString(),
          tableXPos + index * cellWidth + cellWidth / 2,
          yPos + cellHeight / 2,
          null,
          null,
          "center"
        );
      });
      yPos += cellHeight; // Increment yPos for the next row
    });

    // Save the PDF with the specified filename
    doc.save(`${driver.name}'s_report.pdf`);
  };

  return (
    <div className="driver-info-report-actions">
      <div className="driver-report-action-btn" onClick={handleDownloadPDF}>
        Download PDF Report
      </div>
      <div className="driver-report-action-btn" onClick={handleDownloadCSV}>
        Download CSV Report
      </div>
    </div>
  );
};

export default completedInfoReport;
