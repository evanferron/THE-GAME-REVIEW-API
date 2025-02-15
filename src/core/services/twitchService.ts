import { ApiClient } from "../";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_BASE_URL = "https://api.twitch.tv/helix";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";

let accessToken: string | null = null;
let tokenExpiration: number = 0;

const twitchClient = new ApiClient(TWITCH_BASE_URL);

async function getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (accessToken && now < tokenExpiration) {
        return accessToken;
    }

    try {
        const authClient = new ApiClient(TWITCH_AUTH_URL);
        const response = await authClient.post<{ access_token: string; expires_in: number }>("", {
            client_id: TWITCH_CLIENT_ID,
            client_secret: TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials",
        });

        accessToken = response.access_token;
        tokenExpiration = now + response.expires_in;

        return accessToken;
    } catch (error) {
        console.error("Erreur lors de la récupération du token Twitch:", error);
        throw new Error("Impossible de récupérer le token Twitch");
    }
}

async function fetchTwitchData<T>(endpoint: string, params: object = {}): Promise<T> {
    try {
        const token = await getAccessToken();

        return await twitchClient.get<T>(endpoint, {
            ...params,
            headers: {
                Authorization: `Bearer ${token}`,
                "Client-ID": TWITCH_CLIENT_ID,
            },
        });
    } catch (error) {
        console.error(`Erreur lors de l'appel à Twitch (${endpoint}) :`, error);
        throw new Error("Erreur lors de la récupération des données Twitch");
    }
}

export { fetchTwitchData };
