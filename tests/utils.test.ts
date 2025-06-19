import { UUID } from 'crypto';
import { generateToken, parseToken } from '../src/core/utils/jwt';
import { v4 as uuidv4 } from 'uuid';


describe('token utils', () => {
    const userId = uuidv4();
    let token: string;
    it('should generate a token', () => {
        token = generateToken(userId as UUID)
    })
    it('should parse a token', () => {
        const parsedToken = parseToken(token);
        expect(parsedToken).toBeDefined();
        expect(parsedToken.userId).toBe(userId);
    })
})