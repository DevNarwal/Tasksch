import { Hono } from "hono";
import { loginSchema } from "../schemas";
import { z } from "zod";
import {zValidator} from "@hono/zod-validator";

const app = new Hono();

app.post("/login", zValidator("json", loginSchema), (c)=>{

    return c.json({message: "Sucessfull"});
});

export default app;