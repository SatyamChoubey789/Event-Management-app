// utils/generateEventId.js
const generateEventId = () => {
  return "EVENT-" + Date.now(); // Creates a unique event ID using the current timestamp
};

module.exports = { generateEventId };
