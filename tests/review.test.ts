// Mocks globaux placés avant tout import applicatif
(global as any).jest = require('jest-mock');
jest.mock('../src/core/services/twitchService', () => ({
    TwitchService: function () {
        return {
            getAccessToken: () => Promise.resolve('mock-token'),
            fetchIGDBData: () => Promise.resolve({}),
        };
    }
}));

import request from 'supertest';
import express from 'express';
import { createReviewRoutes } from '../src/modules/review/routes';
import * as reviewRepositoryModule from '../src/database/repositories/review';
import { getUserFromRequest } from '../src/core/utils/getUserFromRequest';

jest.mock('../src/database/repositories/review');
jest.mock('../src/core/utils/getUserFromRequest');
// Mock du middleware d'auth pour bypasser le besoin de JWT_SECRET
jest.mock('../src/core/middlewares/auth', () => ({
    authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

// Utilisation de as unknown as jest.Mock pour forcer le typage
const mockGetReviewsById = reviewRepositoryModule.ReviewRepository.prototype.getReviewsById as unknown as jest.Mock;
const mockGetReviewsByGame = reviewRepositoryModule.ReviewRepository.prototype.getReviewsByGame as unknown as jest.Mock;
const mockHandleLikeReview = reviewRepositoryModule.ReviewRepository.prototype.handleLikeReview as unknown as jest.Mock;

describe('Review Module', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/review', createReviewRoutes());
    });

    beforeEach(() => {
        jest.resetAllMocks();
        (getUserFromRequest as jest.Mock).mockReturnValue({ userId: 'mock-user-id' });
    });

    describe('GET /review/:id', () => {
        it('should return 200 and null data if no review found', async () => {
            mockGetReviewsById.mockResolvedValue([]);
            const res = await request(app).get('/review/1');
            expect(res.status).toBe(200);
            expect(res.body.data).toBeNull();
            expect(res.body.message).toBe('No review found');
        });
        it('should return 200 and review data if found', async () => {
            mockGetReviewsById.mockResolvedValue([
                {
                    id: 1,
                    game_id: 10,
                    user_id: 'mock-user-id',
                    owner_pseudo: 'testuser',
                    owner_picture: 1,
                    rating: 5,
                    review: 'Great game!',
                    like_count: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                    has_liked: true
                }
            ]);
            const res = await request(app).get('/review/1');
            expect(res.status).toBe(200);
            expect(res.body.data.data).toHaveProperty('id', 1);
            expect(res.body.data.data).toHaveProperty('gameId', 10);
            expect(res.body.data.data).toHaveProperty('userId', 'mock-user-id');
            expect(res.body.data.data).toHaveProperty('owner_pseudo', 'testuser');
        });
    });

    describe('GET /review/get_by_game_id/:game_id', () => {
        it('should return 200 and null data if no reviews for game', async () => {
            mockGetReviewsByGame.mockResolvedValue([]);
            const res = await request(app).get('/review/get_by_game_id/10');
            expect(res.status).toBe(200);
            expect(res.body.data).toBeNull();
            expect(res.body.message).toBe('No review found');
        });
        it('should return 200 and reviews data if found', async () => {
            mockGetReviewsByGame.mockResolvedValue([
                {
                    id: 2,
                    game_id: 10,
                    user_id: 'mock-user-id',
                    owner_pseudo: 'testuser',
                    owner_picture: 1,
                    rating: 4,
                    review: 'Nice!',
                    like_count: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                    has_liked: false
                }
            ]);
            const res = await request(app).get('/review/get_by_game_id/10');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.data)).toBe(true);
            expect(res.body.data.data[0]).toHaveProperty('id', 2);
            expect(res.body.data.data[0]).toHaveProperty('gameId', 10);
        });
    });

    describe('POST /review/like', () => {
        it('should return 201 on successful like', async () => {
            mockHandleLikeReview.mockResolvedValue(undefined);
            const res = await request(app)
                .post('/review/like')
                .set('Authorization', 'Bearer faketoken')
                .send({ id: 1 });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('handle like successfully');
        });
    });

    // Ajoutez ici d'autres tests pour les autres endpoints (getAllReviews, likeReview, etc.)
});
