import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

const SECRET_KEY = process.env.JWT_SECRET || '';

// Hàm tạo token
export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

// Hàm xác minh token (nếu cần kiểm tra token trong tương lai)
export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};

export const getUserIdFromCookie = () => {
    const userId = Cookies.get('userId');
    if (!userId) return null;

    return userId;
};
