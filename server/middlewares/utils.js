import jwt from 'jsonwebtoken';
import { pick } from 'ramda';

const generateToken = props => jwt.sign({ ...props }, '123456', { expiresIn: '7d' });
const formatUserObj = (user) => {
    const newObj = pick(['name', 'username', 'email', 'company', 'receipts', '_id'], user);
    
    return { id: newObj._id, ...newObj };
}
const formatUserAuthPayload = user => ({ 
    user: formatUserObj(user), 
    token: generateToken({ id: user._id }) 
});

export {
    generateToken,
    formatUserObj,
    formatUserAuthPayload
};