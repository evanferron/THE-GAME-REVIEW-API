import { Request, Response } from "express";

class SSEService {
    private clients: Response[] = [];

    /**
     * Ajoute un client SSE à la liste des clients connectés
     * @param req Request de Express (pour détecter la fermeture de connexion)
     * @param res Response de Express
     */
    public addClient(req: Request, res: Response) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        this.clients.push(res);

        // Suppression du client lorsque la connexion est fermée
        req.on("close", () => {
            this.clients = this.clients.filter(client => client !== res);
        });
    }

    /**
     * Envoie un message SSE à tous les clients connectés
     * @param event Nom de l'événement
     * @param data Données à envoyer
     */
    public sendEvent(event: string, data: any) {
        this.clients.forEach(client => {
            client.write(`event: ${event}\n`);
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }
}

export const sseService = new SSEService();
