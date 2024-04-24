const router = require("express").Router();
const User = require('../src/Modal/User'); // Import your User model

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

router.route('/:userId').get(async (req, res) => {
    let userId = req.params.userId;

    const user = await User.findById(userId)
        .then(user => res.status(200).send({ status: "User fetched", user: user }))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').get(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

module.exports = router;
