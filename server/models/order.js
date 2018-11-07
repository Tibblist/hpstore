const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const OrderSchema = new Schema(
  {
    _id:  mongoose.Schema.Types.ObjectId,
    transID: Number,
    builder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        id: Number,
        name: String,
        quantity: Number,
        price: Number,
    }],
    price: Number,
    amountPaid: Number,
    orderDate: Date,
    endDate: Date,
    deliveredDate: Date,
    location: String,
    character: String,
    status: String,
    code: String,
  },
  { timestamps: true }
);

OrderSchema.methods.addItem = function(Item) {
    this.items.push(Item);
    this.save();
}

OrderSchema.methods.removeItem = function(Item) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == Item.id) {
            this.items.splice(i, 1);
        }
    }
    this.save();
}

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Order", OrderSchema);