const qr = require("qrcode");

exports.generateQRCode = async (eventId, ticketId) => {
  try {
    const data = `${eventId}-${ticketId}`; // Unique data for QR
    const qrCode = await qr.toDataURL(data); // Generates QR code as a data URL
    return qrCode;
  } catch (error) {
    console.error("QR Code generation failed:", error);
    throw new Error("Failed to generate QR code");
  }
};

exports.generateEventId = () => {
  return "EVENT-" + Date.now(); // Creates a unique event ID using the current timestamp
};

exports.generateTicketId = () => {
  // Generate a unique ticket ID based on the current timestamp
  return "TICKET-" + Date.now(); // Example, you can have a more complex method if needed
};
