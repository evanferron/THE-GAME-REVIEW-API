import axios, { AxiosInstance } from "axios";
import { TwitchError } from "../";

const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_BASE_URL = "https://api.twitch.tv/helix";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";

export class TwitchService {
    private TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    private TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
    private tokenExpiration: number = 0;
    private accessToken: string | null = null;
    private igbdClient: AxiosInstance;
    private twitchClient: AxiosInstance;

    constructor() {
        this.igbdClient = axios.create({
            baseURL: IGDB_BASE_URL,
            timeout: 5000,
        });
        this.twitchClient = axios.create({
            baseURL: TWITCH_BASE_URL,
            timeout: 5000,
        });
        this.getAccessToken();
    }

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

            const response = await axios.post<{ access_token: string; expires_in: number }>(
                TWITCH_AUTH_URL,
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiration = now + response.data.expires_in;
            return this.accessToken;
        } catch (error) {
            console.error("Erreur lors de la récupération du token Twitch:", error);
            throw new TwitchError("Impossible de récupérer le token Twitch");
        }
    }

    private async fetchIGDBData<T>(endpoint: string, query: string): Promise<T> {
        try {
            const token = await this.getAccessToken();
            const response = await this.igbdClient.post<T>(endpoint, query, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Client-ID": this.TWITCH_CLIENT_ID || "",
                    "Content-Type": "text/plain"
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'appel à IGDB (${endpoint}) :`, error);
            throw new TwitchError("Erreur lors de la récupération des données IGDB");
        }
    }

    private async fetchTwitchData<T>(endpoint: string, params = ""): Promise<T> {
        try {
            const token = await this.getAccessToken();
            const response = await this.twitchClient.get<T>(endpoint + params, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Client-ID": this.TWITCH_CLIENT_ID || "",
                    "Content-Type": "text/plain"
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'appel à IGDB (${endpoint}) :`, error);
            throw new TwitchError("Erreur lors de la récupération des données IGDB");
        }
    }

    public async getGameDetails(gameIdentifier: string | number) {
        try {
            const query = `
            fields id, name, summary, aggregated_rating,
            genres.name, platforms.name, franchises.name,
            cover.url, url, first_release_date, involved_companies.company.name;
            where id = ${gameIdentifier};
            limit 1;
        `;

            const games = await this.fetchIGDBData<any[]>("/games", query);
            if (!games || games.length === 0) {
                throw new Error("Aucun jeu trouvé avec ce nom ou ID.");
            }
            return games[0];
        } catch (error) {
            console.error("Erreur lors de la récupération des informations du jeu IGDB :", error);
            throw new TwitchError("Impossible de récupérer les informations du jeu IGDB");
        }
    }

    public async getGamesDetails(gameIdentifiers: Array<string | number>) {
        try {
            const query = `
                fields id, name, summary, aggregated_rating,
                genres.name, platforms.name, franchise.name, cover.url, url;
                where id = (${gameIdentifiers.join(",")});
            `;
            const games = await this.fetchIGDBData<{ id: number; name: string; cover: { url: string } }[]>(
                "/games",
                query
            );

            return games;
        } catch (error) {
            console.error("Erreur lors de la récupération des informations des jeux IGDB :", error);
            throw new TwitchError("Impossible de récupérer les informations des jeux IGDB");
        }
    }

    /**
     * Récupère les jeux les plus populaires sur IGDB
     * 
     * @param limit Le nombre maximum de jeux à récupérer
     * @returns Les jeux populaires avec leurs aperçus
     */
    public async getTopGames(limit: number = 10) {
        try {
            const query = `
            fields id, name, cover.url, total_rating_count	;
            sort total_rating_count	 desc;
            limit ${limit};
        `;
            const games = await this.fetchIGDBData<{
                id: number;
                name: string;
                cover: { url: string };
                total_rating_count: number;
            }[]>("/games", query);

            return games;
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux populaires IGDB :", error);
            throw new TwitchError("Impossible de récupérer les jeux populaires sur IGDB");
        }
    }


    public async getGameCategories(gameId: string) {
        try {
            const query = `
                fields id, name;
                where game = ${gameId};
            `;
            const categories = await this.fetchIGDBData<{ id: number; name: string }[]>(
                "/game_categories",
                query
            );

            return categories;
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories du jeu IGDB :", error);
            throw new TwitchError("Impossible de récupérer les catégories du jeu IGDB");
        }
    }

    /**
     * Récupère les informations préliminaires de plusieurs jeux
     * 
     * @param gameIdentifiers Liste des IDs de jeux
     * @returns Liste d'aperçus de jeux
     */
    public async getGamesPreview(gameIdentifiers: Array<string | number>) {
        try {
            const query = `
            fields id, name, cover.url, aggregated_rating;
            where id = (${gameIdentifiers.join(",")});
        `;

            const games = await this.fetchIGDBData<{
                id: number;
                name: string;
                cover: { url: string };
                aggregated_rating: number;
            }[]>("/games", query);

            return games;
        } catch (error) {
            console.error("Erreur lors de la récupération des aperçus de jeux IGDB :", error);
            throw new TwitchError("Impossible de récupérer les aperçus de jeux IGDB");
        }
    }

}
