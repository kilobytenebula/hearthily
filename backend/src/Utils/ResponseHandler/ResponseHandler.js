const HttpType = require('./HttpType')

const response = (res, code, data) => {
    const status = HttpType.getStatus(code)
    const payLoad = {
        code,
        status,
        data
    }
    return res.status(code).json(payLoad);
}

module.exports = response;