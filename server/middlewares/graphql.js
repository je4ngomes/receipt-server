import validate, { validator, isNotValid } from 'validator-handler';
import { isEmpty, pick } from 'ramda';
import jwt from 'jsonwebtoken';

import { applyMiddlewareToFields } from '../utils/utils';
import { InputInvalidError, AuthorizationError } from '../graphql/errors';

const validateUserInput = (resolve, parent, { data }) => {
    const keys = Object.keys(data);
    const validations = pick(
        keys, 
        { password: [{ error: "Password must be 8 characters or longer.", validator: (x) => x.length >= 8 }],
          email: [{ error: "Invalid email address", validator: validator.isEmail }],
          username: [{ error: "Invalid email address", validator: validator.notEmpty }],
          name: [{ error: 'Name is required', validator: validator.notEmpty }] }
    );
    
    const results = validate(data, validations);

    if (isNotValid(results))
        throw new InputInvalidError({ data: results });
    
    return resolve();
};

const authenticationRequired = (...args) => {
    const [resolve,,, { req }] = args;
    
    if (!req.isAuthenticated)
        throw new AuthorizationError({ message: 'Authentication required.' });

    return resolve();
};

const parseJWTFromRequest = (...args) => {
    const [resolve,,, { req }] = args;
    const { request, connection = {} } = req;

    /*
     - if connection is empty then it's a request;
     - if not, check if context exists
     - if context exists, check for token, otherwise return null meaning the user isn't authenticated
    */
    const token = isEmpty(connection) 
        ? request.headers['authorization']
        : connection.context 
            ? connection.context.Authorization
            : null

    // remove `Bearer` word from token and verify it.
    req.user = token && jwt.verify(token.slice(7), '123456'); 
    req.isAuthenticated = !!req.user; // cast to bool

    return resolve(); 
};

const fieldValidations = {
    Mutation: {
        // signUp: validateUserInput,
        // updateUser: validateUserInput
    }
};

const queriesAuthRequired = [
    'me',
    'receipt',
    'receipts',
    'category',
    'categories'
];
const mutationsAuthRequired = [
    'signIn',
    'signUp',
    'updateUser',
    'createReceipt',
    'updateReceipt',
    'deleteReceipt',
    'deleteManyReceipt',
    'createCategory',
    'updateCategory',
    'deleteCategory',
    'deleteManyCategory'
];

const authRequired = applyMiddlewareToFields({ 
        Query: queriesAuthRequired, 
        Mutation: mutationsAuthRequired 
    }, 
    authenticationRequired
);

export {
    parseJWTFromRequest,
    fieldValidations,
    authRequired
};