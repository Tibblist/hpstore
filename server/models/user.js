const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        primaryCharacter: {

        },
        defaultShipping: String,
        group: Number,
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }],
    }
)

module.exports = mongoose.model("User", UserSchema);