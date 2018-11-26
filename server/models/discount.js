const mongoose = require('mongoose')

let DiscountSchema = new mongoose.Schema(
    {
        _id:  mongoose.Schema.Types.ObjectId,
        code: String,
        percentOff: Number,
        maxUse: Number,
        uses: Number,
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

module.exports = mongoose.model("Discount", DiscountSchema);