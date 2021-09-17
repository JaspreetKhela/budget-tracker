// Import the mongoose npm package
const mongoose = require("mongoose");

// Define the Schema
const Schema = mongoose.Schema;

// Define a transaction Schema
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

// Create a Transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Export the Transaction model
module.exports = Transaction;