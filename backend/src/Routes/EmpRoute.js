const router = require('express').Router();
const EmpController = require('../Controller/EmpController');
const EmpYup = require('../Utils/Validation/EmpYup');
const validateSchema = require('../Middleware/ValidateSchema');
const validateToken = require('../Middleware/ValidateToken');

// Route to handle getting an employee by ID
router.post('/getEmployee', validateToken, validateSchema(EmpYup.getEmp), EmpController.getEmployee);

// Route to handle deleting an employee by ID
router.delete('/deleteEmployee', validateToken, validateSchema(EmpYup.dltEmp), EmpController.deleteEmployee);

// Route to handle updating an employee by ID
router.put('/updateEmployee', validateToken, validateSchema(EmpYup.updateEmployee), EmpController.updateEmployee);

module.exports = router;
