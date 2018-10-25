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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    price: Number,
    amountPaid: Number,
    orderDate: Date,
    endDate: Date,
    deliveredDate: Date,
    status: String,

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

OrderSchema.methods.changePrice = function(newPrice) {
    this.price = newPrice;
    this.save();
}

OrderSchema.methods.changePaid = function(newPaid) {
    this.paid = newPaid;
    this.save();
}

OrderSchema.methods.changeStatus = function(newStatus) {
    this.status = newStatus;
    this.save();
}

OrderSchema.methods.changeExpectedDate = function(newDate) {
    this.endDate = newDate;
    this.save();
}

OrderSchema.methods.changeDeliveredDate = function(newDate) {
    this.deliveredDate = newDate;
    this.save();
}

OrderSchema.methods.getOrderByBuyer = function(_id) {
    Order.find({'buyer': _id}).then((order) => {
        return order;
    });
}

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Order", OrderSchema);