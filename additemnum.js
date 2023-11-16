const fs = require('fs');

// Function to read the current ITEM_ID
const readItemId = () => {
  try {
    const itemId = fs.readFileSync('number.txt', 'utf8');
    return parseInt(itemId);
  } catch (error) {
    console.error('Error reading ITEM_ID:', error);
    return null;
  }
};

// Function to update the ITEM_ID
const updateItemId = (newItemId) => {
  try {
    fs.writeFileSync('number.txt', newItemId.toString());
    
  } catch (error) {
    console.error('Error updating ITEM_ID:', error);
  }
};

module.exports = { readItemId, updateItemId };
