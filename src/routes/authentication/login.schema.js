import {checkSchema} from 'express-validator';

const schema = {
    email: {
        in: ['body'],
        isEmail: {
            bail: true,
            errorMessage: 'Wrong email'
        },
    },
    password: {
        in: ['body'],
        isLength: {
            min: 3,
            max: 30,
            errorMessage: 'Week Password'
        },
        errorMessage: 'password not found',
    }
}
export default schema
