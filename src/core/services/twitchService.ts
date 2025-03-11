import { ApiClient, TwitchError } from "../";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_BASE_URL = "https://api.twitch.tv/helix";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";

let tokenExpiration: number = 0;


export class TwitchService {
    private accessToken: string | null = null;
    private twitchClient = new ApiClient(TWITCH_BASE_URL);

    TwitchService() {
        this.getAccessToken();
    }

    /**
     * Allows to get auth with twitch api
     * 
     * @returns twitch token
     */
    private async getAccessToken(): Promise<string> {
        const now = Math.floor(Date.now() / 1000);

        if (this.accessToken && now < tokenExpiration) {
            return this.accessToken;
        }

        try {
            const authClient = new ApiClient(TWITCH_AUTH_URL);
            const response = await authClient.post<{ access_token: string; expires_in: number }>("", {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "client_credentials",
            });

            this.accessToken = response.access_token;
            tokenExpiration = now + response.expires_in;

            return this.accessToken;
        } catch (error) {
            console.error("Erreur lors de la récupération du token Twitch:", error);
            throw new TwitchError("Impossible de récupérer le token Twitch");
        }
    }

    /**
     * Allow to make request to twitch api
     * 
     * @param endpoint twitch endpoint
     * @param params request params
     * @returns twitch response
     */
    private async fetchTwitchData<T>(endpoint: string, params: object = {}): Promise<T> {
        try {
            const token = await this.getAccessToken();

            return await this.twitchClient.get<T>(endpoint, {
                ...params,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Client-ID": TWITCH_CLIENT_ID,
                },
            });
        } catch (error) {
            console.error(`Erreur lors de l'appel à Twitch (${endpoint}) :`, error);
            throw new TwitchError("Erreur lors de la récupération des données Twitch");
        }
    }

    public async getGameInfo(gameIdentifier: string | number) {
        try {
            const paramKey = typeof gameIdentifier === "number" ? "id" : "name";
            const response = await this.fetchTwitchData<{ data: Array<{ id: string; name: string; box_art_url: string }> }>(
                "/games",
                { params: { [paramKey]: gameIdentifier } }
            );

            if (response.data.length === 0) {
                throw new Error("Aucun jeu trouvé avec ce nom ou ID.");
            }

            return response.data[0]; // Retourne le premier jeu trouvé
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des informations du jeu :", error);
            throw new TwitchError("Impossible de récupérer les informations du jeu Twitch");
        }
    }

    public async getGamesInfo(gameIdentifiers: Array<string | number>) {
        try {
            const paramKey = typeof gameIdentifiers[0] === "number" ? "id" : "name";
            const params = gameIdentifiers.map((id) => `${paramKey}=${id}`).join("&");

            const response = await this.fetchTwitchData<{ data: Array<{ id: string; name: string; box_art_url: string }> }>(
                `/games?${params}`
            );

            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des informations des jeux :", error);
            throw new TwitchError("Impossible de récupérer les informations des jeux Twitch");
        }
    }

    public async getTopGames(limit: number = 10) {
        try {
            const response = await this.fetchTwitchData<{ data: Array<{ id: string; name: string; box_art_url: string }> }>(
                "/games/top",
                { params: { first: limit } }
            );

            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des jeux populaires :", error);
            throw new TwitchError("Impossible de récupérer les jeux populaires sur Twitch");
        }
    }

    public async getGameCategories(gameId: string) {
        try {
            const response = await this.fetchTwitchData<{ data: Array<{ id: string; name: string }> }>(
                "/categories",
                { params: { id: gameId } }
            );

            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des catégories du jeu :", error);
            throw new TwitchError("Impossible de récupérer les catégories du jeu");
        }
    }
}