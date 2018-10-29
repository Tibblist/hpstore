const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        primaryCharacter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Character'
        },
        characters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Character'
        }],
        defaultShipping: String,
        group: Number,
        token: String,

    }
)

module.exports = mongoose.model("User", UserSchema);