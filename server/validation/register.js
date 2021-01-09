import Validator from "validator"
import isEmpty from "is-empty"

function validateRegisterInput(data) {
    let errors = {};
    // Converts empty fields to String in order to validate them
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';

    if (Validator.isEmpty(data.email))
        errors.email = 'Email field is required';

    if (Validator.isEmpty(data.username))
        errors.username = 'Username field is required';

    if (Validator.isEmpty(data.password))
        errors.password = 'Password field is required';

    if (!Validator.isLength(data.password, { min: 6, max: 30 }))
        errors.password = 'Password must be at least 6 characters';

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

export default validateRegisterInput