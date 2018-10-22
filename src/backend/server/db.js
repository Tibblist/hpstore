const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const OrderSchema = new Schema(
  {
    id: Number,
    tid: Number,
    builder: String,
    buyerName: String,
    shipName: String,
    price: Number,
    amountPaid: Number,
    orderDate: Date,
    endDate: Date,
    deliveredDate: Date,
    status: String,

  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Order", OrderSchema);