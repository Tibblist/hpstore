const mongoose = require('mongoose')

let ItemSchema = new mongoose.Schema(
    {
        typeID: Number,
        name: String,
        buildMats: [{

        }],
        buildable: Boolean,
        isCapital: Boolean,
        isSuper: Boolean,
        race: String,
    }
)

module.exports = mongoose.model("Item", ItemSchema);