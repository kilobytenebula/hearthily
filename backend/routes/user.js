const router = require("express").Router();
const User = require('../models/User'); // Import your User model

router.route("/getuser/:customerId").get(async (req, res) => {
    const loggedCustomerId = req.params.customerId;

    try {
        const user = await User.findOne({ _id: loggedCustomerId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
