/**
 * This is a middleware for express. it is helpful for validation headers and body of a request.
 */
const validate = require('express-validation');
const joi = require('joi');
// Override default options.
validate.options({
    status: 422
})

// Config Validate
const Validation = {
    "/register": {
        "POST": {
            body: {
                email: joi.string().min(3).required(),
                password: joi.string().min(6).required(),
                phonenumber: joi.string().min(6).required(),
            }
        }
    },
    "/send": {
        "POST": {
            body: {
                to: joi.string().min(8).required(),
                amount: joi.number().required()
            }
        }
    }
}

// Init to App Router
function initValidate(appRouter) {
    const Routes = Object.keys(Validation);
    Routes.map(route => {
        const methods = Object.keys(Validation[route]);
        methods.map(method => {
            appRouter[method.toLowerCase()](route.toLowerCase(), validate(Validation[route][method]))
        })
    })
}
module.exports = initValidate;