import axios, { AxiosInstance, AxiosResponse } from "axios";

export class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public async get<T>(url: string, params?: object): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.get(url, { params });
            return response.data;
        } catch (error) {
            console.error(`GET ${url} failed`, error);
            throw error;
        }
    }

    public async post<T>(url: string, data: object): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.post(url, data);
            return response.data;
        } catch (error) {
            console.error(`POST ${url} failed`, error);
            throw error;
        }
    }
}
