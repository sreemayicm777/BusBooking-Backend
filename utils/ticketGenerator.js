const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// Generate and save PDF ticket
const generateTicketPDF = async (booking, user) => {
  // Ensure tickets folder exists
  const ticketsDir = path.join(__dirname, "..", "tickets");
  if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir);
  }

  const fileName = `ticket-${booking._id}.pdf`;
  const filePath = path.join(ticketsDir, fileName);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Title
  doc.fontSize(20).text("🚌 Bus Ticket", { align: "center" });
  doc.moveDown();

  // Passenger Info
  doc.fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Booking ID: ${booking.bookingId}`);
  doc.text(`From: ${booking.from}`);
  doc.text(`To: ${booking.to}`);
  doc.text(`Date: ${new Date(booking.bus.startDateTime).toLocaleString()}`);
  doc.text(`Seats Booked: ${booking.seatsBooked}`);
  doc.text(`Total Fare: ₹${booking.totalFare}`);
  doc.moveDown();

  // QR Code data
  const qrData = `Booking ID: ${booking.bookingId}\nName: ${user.name}\nFrom: ${booking.from}\nTo: ${booking.to}\nDate: ${new Date(booking.bus.startDateTime).toLocaleString()}\nSeats: ${booking.seatsBooked}\nTotal: ₹${booking.totalFare}`;
  const qrImageDataURL = await QRCode.toDataURL(qrData);

  // Embed QR code
  const base64Data = qrImageDataURL.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  doc.image(buffer, { fit: [120, 120], align: "center" });

  doc.end();

  return filePath;
};

module.exports = generateTicketPDF;
