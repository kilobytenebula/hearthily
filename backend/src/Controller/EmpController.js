const User = require("../Modal/User.js");
const response = require("../Utils/ResponseHandler/ResponseHandler.js");
const ResTypes = require("../Utils/ResponseHandler/ResTypes.js");

class UserController {
    // Method to get an user by ID
    getEmployee = async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) return response(res, 404, ResTypes.errors.not_found);
            return response(res, 200,  user );
        } catch (error) {
            console.log(error);
            return response(res, 500, error);
        }
    }

    // Method to delete an user by ID
    deleteEmployee = async (req, res) => {
        const { email } = req.body;
        try {
            const deletedUser = await User.findOneAndDelete({ email });
            if (!deletedUser) return response(res, 404, ResTypes.errors.not_found);
            return response(res, 200, ResTypes.successMessages.success);
        } catch (error) {
            console.log(error);
            return response(res, 500, error);
        }
    }

    // Method to update an user by ID
    updateEmployee = async (req, res) => {
        const { email, name,fname,lname, age, salary, nic, role, gender,address  } = req.body;
        try {
            const userExist = await User.findOne({ email});
            if (!userExist) return response(res, 404, ResTypes.errors.not_found);

            const result = await User.updateOne(
                { email },
                { $set: {name, age, salary, nic, role, gender,address,fname,lname } }
            );
            if (result.modifiedCount === 0) return response(res, 403, ResTypes.errors.upadate_error);
            return response(res, 200, ResTypes.successMessages.upadted_success);
        } catch (error) {
            console.log(error);
            return response(res, 500, error);
        }
    }
}

module.exports = new UserController();
