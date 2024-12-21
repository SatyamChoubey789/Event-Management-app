const generateTicketId = () => {
  // Generate a unique ticket ID based on the current timestamp
  return "TICKET-" + Date.now(); // Example, you can have a more complex method if needed
};

module.exports = { generateTicketId };
