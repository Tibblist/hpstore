const mongoose = require('mongoose')

let CharacterSchema = new mongoose.Schema(
    {
        _id:  mongoose.Schema.Types.ObjectId,
        charID: Number,
        name: String,
        corpID: Number,
        corpName: String,
        allianceID: Number,
        allianceName: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

module.exports = mongoose.model("Character", CharacterSchema);