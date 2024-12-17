import React from 'react';
import { jsPDF } from 'jspdf';

const InvoiceGenerator = ({ bookingData }) => {
  const generateInvoicePDF = () => {
    const { BookedBy, Customerdetails, Tourpackage, specialrequest, message } = bookingData;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(22);
    doc.text('Booking Invoice', 20, 20);

    // Booking Details Section
    doc.setFontSize(14);
    doc.text(`Booking Message: ${message}`, 20, 40);
    doc.text(`Booked By: ${BookedBy.Name}`, 20, 50);
    doc.text(`Email: ${BookedBy.email}`, 20, 60);
    doc.text(`Username: ${BookedBy.username}`, 20, 70);
    doc.text(`Booking Date: ${new Date(BookedBy.createdAt).toLocaleDateString()}`, 20, 80);

    // Customer Details Section
    const customer = Customerdetails[0][0];  // Accessing the customer data
    doc.text(`Customer Name: ${customer.name}`, 20, 100);
    doc.text(`Phone: ${customer.phone}`, 20, 110);
    doc.text(`Age: ${customer.age}`, 20, 120);
    doc.text(`Gender: ${customer.gender}`, 20, 130);

    // Tour Package Details
    doc.text(`Tour Package: ${Tourpackage.Title}`, 20, 150);
    doc.text(`Description: ${Tourpackage.Description}`, 20, 160);
    doc.text(`Price: $${Tourpackage.Price}`, 20, 170);
    doc.text(`Special Request: ${specialrequest}`, 20, 180);

    // Generate PDF and download
    doc.save(`${Tourpackage.Title}_Invoice.pdf`);
  };

  return (
    <div>
      <h2>Tour Booking Details</h2>
      <button onClick={generateInvoicePDF}>Generate Invoice</button>
    </div>
  );
};

export default InvoiceGenerator;
