import { z } from "zod";

export const GetGamesPreview = z.object({
    gamesId: z.array(z.number()),
});