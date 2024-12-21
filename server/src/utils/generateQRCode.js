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
