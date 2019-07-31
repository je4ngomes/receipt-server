import jwt from 'jsonwebtoken';

const generateToken = props => jwt.sign({ ...props }, '123456', { expiresIn: '7d' });

const formatUserAuthPayload = user => ({ 
    user, 
    token: generateToken({ id: user._id }) 
});

export {
    generateToken,
    formatUserAuthPayload
};