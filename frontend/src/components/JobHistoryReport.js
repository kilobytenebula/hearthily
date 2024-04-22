import React from "react";
import jsPDF from "jspdf";
import logoImage from "../icons/logo.png";

const JobHistoryReport = ({ deliveries }) => {
    const handleDownloadCSV = () => {
        // Generate CSV data
        const csvData = deliveries.map(delivery => ({
            "Customer Name": delivery.name,
            "Date": new Date(delivery.date).toLocaleDateString(),
            "Location": delivery.location,
            "Payment": delivery.paymentMethod
        }));
    
        // Define CSV headers
        const headers = [
            { label: "Customer Name", key: "Customer Name" },
            { label: "Date", key: "Date" },
            { label: "Location", key: "Location" },
            { label: "Payment", key: "Payment" }
        ];
    
        // Create a CSV file
        const csvContent = [
            headers.map(header => header.label).join(","),
            ...csvData.map(row => Object.values(row).join(","))
        ].join("\n");
    
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
            link.setAttribute("download", "job_history_report.csv");
    
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
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
    
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
        doc.text("Job History Report", doc.internal.pageSize.getWidth() / 2, margin + (headerHeight / 2), null, null, "center");
    
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
    
        const headerContent = `${formattedDate} ${formattedTime}`;
    
        // Generated date
        doc.setFontSize(10);
        doc.text(headerContent, doc.internal.pageSize.getWidth() - margin, margin + (headerHeight / 2), null, null, "right");
    
        // Define table headers
        const headers = ["Customer Name", "Date", "Location", "Payment"];
    
        // Set font style and size for table headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
    
        // Define cell width and height
        const cellWidth = 40;
        const cellHeight = 20;
    
        // Calculate table width
        const tableWidth = cellWidth * headers.length;
    
        // Calculate table x-position to center it in the document
        const tableXPos = (doc.internal.pageSize.getWidth() - tableWidth) / 2;
    
        // Define table position
        let yPos = margin + headerHeight + 10;
    
        // Add table headers
        doc.setFillColor(orange200);
        doc.rect(tableXPos, yPos, tableWidth, cellHeight, "F");
        doc.setTextColor(textColor);
        headers.forEach((header, index) => {
            doc.text(header, tableXPos + (index * cellWidth) + (cellWidth / 2), yPos + (cellHeight / 2), null, null, "center");
        });
    
        // Set font style and size for table content
        doc.setFont("helvetica");
        doc.setFontSize(10);
    
        // Add table rows
        yPos += cellHeight; // Start from below the header
        deliveries.forEach(delivery => {
            const values = [
                delivery.name,
                new Date(delivery.date).toLocaleDateString(),
                delivery.location,
                delivery.paymentMethod
            ];
    
            values.forEach((value, index) => {
                const cellValue = value !== null ? value.toString() : ""; // Check for null values
                doc.setFillColor(bgColor);
                doc.rect(tableXPos + (index * cellWidth), yPos, cellWidth, cellHeight, "F");
                doc.setTextColor(textColor);
                doc.text(cellValue, tableXPos + (index * cellWidth) + (cellWidth / 2), yPos + (cellHeight / 2), null, null, "center");
            });
            yPos += cellHeight; // Increment yPos for the next row
        });
    
        // Save the PDF with the specified filename
        doc.save("job_history_report.pdf");
    };    
    
    return (
        <div className="jobhistory-report-actions">
            <div className="jobhistory-report-action-btn" onClick={handleDownloadPDF}>Download PDF Report</div>
            <div className="jobhistory-report-action-btn" onClick={handleDownloadCSV}>Download CSV Report</div>
        </div>
    );
};

export default JobHistoryReport;