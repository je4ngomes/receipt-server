import validate, { validator, isNotValid } from 'validator-handler';
import { isEmpty, pick } from 'ramda';
import jwt from 'jsonwebtoken';

import { InputInvalidError, AuthorizationError } from '../graphql/errors';

const validateUserInput = (resolve, parent, { data }) => {
    const keys = Object.keys(data);
    const validations = pick(
        keys, 
        { password: ["Password must be 8 characters or longer.", (x) => x.length >= 8],
          email: ["Invalid email address", validator.isEmail ],
          username: ["Invalid email address", validator.notEmpty ],
          name: ['Name is required', validator.notEmpty] }
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

const all_parseJWT = (...args) => {
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

    req.user = token && jwt.verify(token.slice(7), '123456'); // remove `Bearer` word from token and verify it.
    req.isAuthenticated = !!req.user; // cast to bool

    return resolve(); 
};

const fieldValidations = {
    Mutation: {
        signUp: validateUserInput,
        updateUser: validateUserInput
    }

};

const authRequired = {
    Query: {
        me: authenticationRequired
    },
    Mutation: {
        updateUser: authenticationRequired
    }
};

export {
    all_parseJWT,
    fieldValidations,
    authRequired
};