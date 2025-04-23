const mongoose = require("mongoose");

const SkillCreditSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    credits: { type: Number, default: 0 }
});

module.exports = mongoose.model("SkillCredit", SkillCreditSchema);
