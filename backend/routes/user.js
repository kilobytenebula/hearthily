const router = require("express").Router();
let User = require("../models/User")

router.route('/:userId').get(async (req, res) => {
    let userId = req.params.userId;

    const user = await User.findById(userId)
        .then(user => res.status(200).send({ status: "User fetched", user: user }))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;