import {checkSchema} from 'express-validator';

const schema = {
    orderId: {
        in: ['body'],
        errorMessage: 'ID Not Found',
    }
}
export default schema
