import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspacesSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";

const Database_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const Workspace_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!;

const app = new Hono()
    .post(
        "/",
        zValidator("json", createWorkspacesSchema),
        sessionMiddleware,
        async (c) => {
            const tablesDB = c.get("tablesDB");
            const user = c.get("user");

            const { name } = c.req.valid("json");

            const workspace = await tablesDB.createRow({
                databaseId: Database_ID,
                tableId: Workspace_ID,
                rowId: ID.unique(),
                data: {
                    name,
                    UserId: user.$id,
                },
            });

            return c.json({
                data: workspace,
            });
        }
    );

export default app;

 