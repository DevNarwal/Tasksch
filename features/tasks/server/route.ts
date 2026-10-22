import {Hono} from "hono";
import {z} from "zod";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";
import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { Project } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/types";

import { Database_ID , Task_ID  , Project_ID, Member_ID} from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";

const  app=new Hono()
        .get("/",
            sessionMiddleware,
            zValidator(
                "query",
                z.object({
                    workspaceId:z.string(),
                    projectId:z.string().nullish(),
                    assigneId:z.string().nullish(),
                    status:z.nativeEnum(TaskStatus).nullish(),
                    search:z.string().nullish(),
                    dueDate:z.string().nullish()
                })
            ),
            async(c)=>{
                const {users} = await createAdminClient();
                const databases = c.get("tablesDB");
                const user = c.get("user");

                const {workspaceId,projectId , status,search,assigneId,dueDate,} = c.req.valid("query");

                const member = await getMember({
                    databases,
                    workspaceId,
                    userId:user.$id
                    }
                );

                if(!member){
                    return c.json({error:"Unauthrized"},401);
                }
                
                const query = [
                    Query.equal("workspaceId",workspaceId),
                    Query.orderDesc("$createdAt",)
                ];

                if(workspaceId){
                    console.log("workspaceId:",workspaceId);
                    query.push(Query.search("workspaceId",workspaceId));
                }

                if(projectId){
                    console.log("projectId:",projectId);
                    query.push(Query.search("projectId",projectId));
                }

                if(assigneId){
                    console.log("assigneId:",assigneId);
                    query.push(Query.search("assigneId",assigneId));
                }
                if(status){
                    console.log("status:",status);
                    query.push(Query.search("status",status));
                }
                if(search){
                    console.log("search:",search);
                    query.push(Query.search("search",search));
                }
                if(dueDate){
                    console.log("dueDate:",dueDate);
                    query.push(Query.search("dueDate",dueDate));
                }


                const tasks = await databases.listRows(
                    Database_ID,
                    Task_ID,
                    query
                );

                const projectIds = tasks.rows.map((task)=>task.projectId);
                const assigneIds = tasks.rows.map((task)=>task.assigneId);
                
                const projects = await databases.listRows<Project>(
                    Database_ID,
                    Project_ID,
                    projectIds.length > 0 ? [Query.contains("$id",projectIds)] :[]
                );

                const members = await databases.listRows(
                    Database_ID,
                    Member_ID,
                    assigneIds.length > 0 ? [Query.contains("$id",assigneIds)] :[]
                );

                const assignees = await Promise.all(
                    members.rows.map(async(member)=>{
                        const user= await users.get(member.userId);

                        return {
                            ...members,
                            name:user.name,
                            email:user.email
                        }
                    })
                )

                const populateTasks = tasks.rows.map((task)=>{

                    const project = projects.rows.find(
                        (project)=> project.$id === task.projectId,
                    );

                    const assignee = assignees.find(
                        (assignee)=>assignee.$id === task.assigneId,
                    );

                    return {
                        ...task,
                        project,
                        assignee,
                    };
                });

                return c.json({
                    data:{
                        ...tasks,
                        documents:populateTasks
                    }
                });


            }
        )
        .post("/" , 
            sessionMiddleware ,
            zValidator("json",createTaskSchema),
            async(c)=>{

                const user= c.get("user");
                const databases = c.get("tablesDB");
                const {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    dueDate,
                    assigneId

                }= c.req.valid("json");

                const member  = await getMember({
                    databases,
                    workspaceId,
                    userId:user.$id,
                });

                if(!member){
                    return c.json({error:"Unauthorized"},401);
                }

                const highestPositionPeak = await databases.listRows(
                    Database_ID,
                    Task_ID,
                    [
                        Query.equal("status",status),
                        Query.equal("workspaceId",workspaceId),
                        Query.orderAsc("position"),
                        Query.limit(1)

                    ]
                );

                const newPosition = highestPositionPeak.rows.length > 0 ?highestPositionPeak.rows[0].position +1000 :1000;

                const task = await databases.createRow(
                    Database_ID,
                    Task_ID,
                    ID.unique(),

                    {
                        name,
                        status,
                        workspaceId,
                        projectId,
                        dueDate,
                        assigneId,
                        position:newPosition,
                    }

                )

                return c.json({data:task});
            }
        );

export default app;