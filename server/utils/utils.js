import jwt from 'jsonwebtoken';
import { pick } from 'ramda';

const generateToken = props => jwt.sign({ ...props }, '123456', { expiresIn: '7d' });

const formatUserAuthPayload = user => ({ 
    user, 
    token: generateToken({ id: user._id }) 
});

export {
    generateToken,
    formatUserAuthPayload
};