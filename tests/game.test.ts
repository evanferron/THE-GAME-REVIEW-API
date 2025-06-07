// tests/game.test.ts
// Tests unitaires pour le module game

import request from 'supertest';
import express from 'express';
import { GameController } from '../src/modules/game/controller';

// Création d'une app Express mockée
const app = express();
app.use(express.json());

// Mocks globaux
const mockGetGameDetails = jest.fn();
const mockGetGamesPreview = jest.fn();
const mockGetTopGames = jest.fn();
const mockFindGameReviewByUser = jest.fn();

jest.mock('../src/core/services/twitchService', () => ({
    TwitchService: jest.fn().mockImplementation(() => ({
        getGameDetails: mockGetGameDetails,
        getGamesPreview: mockGetGamesPreview,
        getTopGames: mockGetTopGames,
    })),
}));

jest.mock('../src/core/utils/getUserFromRequest', () => ({
    getUserFromRequest: jest.fn(() => ({ userId: 'mock-user-id' })),
}));

// Mock du middleware getUserIfLogged pour bypasser l'authentification
jest.mock('../src/core/middlewares/getUserIfLogged', () => ({
    getUserIfLogged: (req: any, res: any, next: any) => next(),
}));

import { createGameRoutes } from '../src/modules/game/routes';

// Utilisation du vrai router de prod
app.use('/game', createGameRoutes());

// Ajout du middleware d'erreur Express pour que les erreurs soient bien gérées dans les tests
import { errorHandler } from '../src/core/middlewares/error';
app.use(errorHandler);

// Instanciation du contrôleur sans paramètre
const controller = new GameController();
// Patch dynamique de la config pour injecter les mocks
(controller as any).config = {
    twitchService: {
        getGameDetails: mockGetGameDetails,
        getGamesPreview: mockGetGamesPreview,
        getTopGames: mockGetTopGames,
    },
    reviewRepository: {
        findGameReviewByUser: mockFindGameReviewByUser,
    },
};

describe('GameController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getGameDetails', () => {
        it('should return game details (public, no userRate)', async () => {
            mockGetGameDetails.mockResolvedValueOnce({
                id: 1,
                name: 'Test Game',
                aggregated_rating: 90,
                genres: [{ name: 'Action' }],
                platforms: [{ name: 'PC' }],
                summary: 'A test game',
                cover: { url: 'cover.jpg' },
                franchises: [{ name: 'Test Franchise' }],
                first_release_date: 1234567890,
                involved_companies: [{ company: { name: 'Test Studio' } }],
            });
            // Pas de mockFindGameReviewByUser car pas de token
            const res = await request(app)
                .get('/game/1');
            // Affiche la structure réelle de la réponse pour debug
            console.log('DEBUG getGameDetails', res.body);
            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.data).toMatchObject({
                id: 1,
                name: 'Test Game',
                aggregated_rating: 90,
                genres: ['Action'],
                platforms: ['PC'],
                summary: 'A test game',
                cover_url: 'cover.jpg',
                franchises: ['Test Franchise'],
                first_release_date: 1234567890,
                involved_companies: ['Test Studio'],
            });
        });

        it('should return 400 if id is invalid', async () => {
            const res = await request(app).get('/game/abc');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('getGamesByIds', () => {
        it('should return games by ids', async () => {
            mockGetGamesPreview.mockResolvedValueOnce([
                { id: 1, name: 'Game1', cover: { url: 'c1.jpg' }, total_rating_count: 80, involved_companies: ['Comp1'] },
                { id: 2, name: 'Game2', cover: { url: 'c2.jpg' }, total_rating_count: 70, involved_companies: ['Comp2'] },
            ]);
            const res = await request(app).get('/game/preview/1,2');
            console.log('DEBUG getGamesByIds', res.body);
            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.data).toEqual([
                { id: 1, name: 'Game1', cover: 'c1.jpg', aggregated_rating: 80, involved_companies: ['Comp1'] },
                { id: 2, name: 'Game2', cover: 'c2.jpg', aggregated_rating: 70, involved_companies: ['Comp2'] },
            ]);
        });
    });
    describe('getTendanceGames', () => {
        it('should return trending games', async () => {
            mockGetTopGames.mockResolvedValueOnce([
                { id: 1, name: 'Trend1', cover: { url: 't1.jpg' }, total_rating_count: 100, involved_companies: ['Comp1'] },
                { id: 2, name: 'Trend2', cover: { url: 't2.jpg' }, total_rating_count: 200, involved_companies: ['Comp2'] },
            ]);
            const res = await request(app).get('/game/top');
            console.log('DEBUG getTendanceGames', res.body);
            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.data).toEqual([
                { id: 1, name: 'Trend1', cover: 't1.jpg', aggregated_rating: 100, involved_companies: ['Comp1'] },
                { id: 2, name: 'Trend2', cover: 't2.jpg', aggregated_rating: 200, involved_companies: ['Comp2'] },
            ]);
        });
    });
});
