const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// Generate and save PDF ticket
const generateTicketPDF = async (booking, user) => {
  const fileName = `ticket-${booking._id}.pdf`;
  const doc = new PDFDocument();
  const filePath = `./tickets/${fileName}`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Title
  doc.fontSize(20).text("Bus Ticket", { align: "center" });
  doc.moveDown();

  // Passenger Info
  doc.fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Booking ID: ${booking._id}`);
  doc.text(`From: ${booking.bus.from}`);
  doc.text(`To: ${booking.bus.to}`);
  doc.text(`Date: ${booking.bus.travelDate}`);
  doc.text(`Seats: ${booking.seatsBooked}`);
  doc.text(`Total Fare: ₹${booking.totalFare}`);
  doc.moveDown();

  // QR Code
  const qrData = `Name: ${user.name}, Booking ID: ${booking._id}, From: ${booking.bus.from}, To: ${booking.bus.to}, Date: ${booking.bus.travelDate}, Fare: ₹${booking.totalFare}`;
  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, { width: 120, align: "center" });
  doc.end();

  return filePath;
};

module.exports = generateTicketPDF;
