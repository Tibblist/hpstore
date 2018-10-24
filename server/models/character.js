const mongoose = require('mongoose')

let CharacterSchema = new mongoose.Schema(
    {
        name: String,
        corpID: Number,
        corpName: String,
        allianceID: Number,
        allianceName: String,

    }
)

module.exports = mongoose.model("Character", CharacterSchema);