import { z } from "zod";

export const sendMessageSchema = z.object({
    recipientId: z.string().uuid("Invalid recipient ID"),
    content: z.string().min(1, "Message cannot be empty"),
});
