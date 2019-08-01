import jwt from 'jsonwebtoken';

const generateToken = props => jwt.sign({ ...props }, '123456', { expiresIn: '7d' });

const formatUserAuthPayload = user => ({ 
    user, 
    token: generateToken({ id: user._id }) 
});

const applyMiddlewareToFields = (operations, middleware) => (
    Object.entries(operations)
        .reduce((acc, [operation, fields]) => ({
            ...acc,
            [operation]: fields.reduce((acc, field) => ({
                ...acc,
                [field]: middleware
            }), {})
        }), {})
);

export {
    generateToken,
    applyMiddlewareToFields,
    formatUserAuthPayload
};