const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        primaryCharacter: {

        },
        defaultShipping: String,
        group: Number,
        orders: [{

        }],


    }
)

module.exports = mongoose.model("User", UserSchema);