import axios, { AxiosInstance } from "axios";
import { TwitchError } from "../";

const TWITCH_BASE_URL = "https://api.twitch.tv/helix";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";



export class TwitchService {
    private TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    private TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
    private tokenExpiration: number = 0;
    private accessToken: string | null = null;
    private client: AxiosInstance;


    constructor() {
        this.client = axios.create({
            baseURL: TWITCH_BASE_URL,
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });
        this.getAccessToken();
    }

    /**
     * Allows to get auth with twitch api
     * 
     * @returns twitch token
     */
    private async getAccessToken(): Promise<string> {
        const now = Math.floor(Date.now() / 1000);
        if (this.accessToken && now < this.tokenExpiration) {
            return this.accessToken;
        }

        try {
            const params = new URLSearchParams({
                client_id: this.TWITCH_CLIENT_ID || "",
                client_secret: this.TWITCH_CLIENT_SECRET || "",
                grant_type: "client_credentials",
            });
            const response = await axios.post<{ access_token: string; expires_in: number }>(TWITCH_AUTH_URL, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiration = now + response.data.expires_in;
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
            const response = await this.client.get(endpoint, { params, headers: { Authorization: `Bearer ${token}`, "Client-ID": this.TWITCH_CLIENT_ID } });
            return response.data;
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