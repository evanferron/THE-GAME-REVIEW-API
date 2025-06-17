import request from 'supertest';
import express from 'express';
import { createAuthRoutes } from '../src/modules/auth/routes';
import * as userRepositoryModule from '../src/database/repositories/user';
import * as bcrypt from 'bcrypt';

// Mock dependencies as needed (e.g., database, userRepository, etc.)
// This is a basic structure. You should adapt the mocks to your actual implementation.

jest.mock('../src/database/repositories/user');
jest.mock('bcrypt');

describe('Auth Module', () => {
    let app: express.Express;

    // Helper to reset mocks
    const resetAllMocks = () => {
        jest.resetAllMocks();
    };

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', createAuthRoutes());
    });

    describe('POST /auth/login', () => {
        beforeEach(() => {
            resetAllMocks();
        });

        it('should return 400 for invalid email format', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'invalid', password: '123456' });
            expect(res.status).toBe(400);
        });

        it('should return 401 for non-existent user', async () => {
            (userRepositoryModule.UserRepository.prototype.findByColumn as jest.Mock).mockResolvedValue([]);
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'notfound@example.com', password: '123456' });
            expect(res.status).toBe(401);
        });

        it('should return 401 for wrong password', async () => {
            (userRepositoryModule.UserRepository.prototype.findByColumn as jest.Mock).mockResolvedValue([
                { email: 'test@example.com', password: 'hashed', pseudo: 'test', id: 1, deleted_at: null, profil_picture_id: null }
            ]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpass' });
            expect(res.status).toBe(401);
        });

        it('should return 200 and tokens for valid credentials', async () => {
            (userRepositoryModule.UserRepository.prototype.findByColumn as jest.Mock).mockResolvedValue([
                { email: 'test@example.com', password: 'hashed', pseudo: 'test', id: 1, deleted_at: null, profil_picture_id: 42 }
            ]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: '123456' });
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data.pseudo).toBe('test');
        });
    });

    describe('POST /auth/register', () => {
        beforeEach(() => {
            resetAllMocks();
        });

        it('should return 400 for short pseudo', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ pseudo: 'ab', email: 'test@example.com', password: '123456' });
            expect(res.status).toBe(400);
        });
        it('should return 201 for valid registration', async () => {
            //TODO
        });
    });

    describe('POST /auth/refresh', () => {
        beforeEach(() => {
            resetAllMocks();
        });

        it('should return 400 if refreshToken is missing', async () => {
            const res = await request(app)
                .post('/auth/refresh')
                .send({});
            expect(res.status).toBe(400);
        });
    });
});
