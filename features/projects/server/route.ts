import {z} from "zod";
import {Hono} from "hono";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";

import { sessionMiddleware } from "@/lib/session-middleware";   
import {Database_ID , Project_ID , } from "@/config";

import { createProjectSchema , updateProjectSchema } from "../schemas";

import { Image_Bucket_ID } from "@/config";
import { ID } from "node-appwrite";

import { Project } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/types";

const app = new Hono()
            .post("/", sessionMiddleware,
                zValidator("form", createProjectSchema) , 
                async (c) => {
                    const databases = c.get("tablesDB");
                    const user = c.get("user");
                    const storage = c.get("storage");

                    const { name ,imageUrl , workspaceId } = c.req.valid("form");

                    const member = await getMember({
                            databases,
                            workspaceId,
                            userId:user.$id
                        }
                    );

                    let uploadedImageUrl: string | undefined;

                    if(imageUrl instanceof File){
                        const file = await storage.createFile(
                            Image_Bucket_ID,
                            ID.unique(),
                            imageUrl,
                        );
                    
                        uploadedImageUrl= file.$id;
                    }

                    const project = await databases.createRow({ 
                        databaseId: Database_ID,
                        tableId: Project_ID,
                        rowId: ID.unique(),
                        data: {
                            name,
                           
                            imageUrl:uploadedImageUrl,
                            workspaceId,
                         
                        },
                    });

                   

                    return c.json({
                        data: project,
                    });
                }
            
                
            )

            .get("/", sessionMiddleware ,
                zValidator("query" , z.object({workspaceId: z.string()})),

                async(c)=>{

                    const user = c.get("user");
                    const databases = c.get("tablesDB");
                    
                    const {workspaceId} = c.req.valid("query");

                    if(!workspaceId){
                        return c.json({error:"Missing Workspace Id"},400);
                    }

                    const member = await getMember({
                        databases, 
                        workspaceId,
                        userId:user.$id,
                    });

                    if(!member){
                        return c.json({error: "Unauthorized"},401);
                    }

                    const projects = await databases.listRows(
                        Database_ID , 
                        Project_ID,
                        [
                            Query.equal("workspaceId" , workspaceId),
                            Query.orderDesc("$createdAt")
                        ]

                    );

                    return c.json({data:projects});

                }
            )
            .patch("/:projectId",
                    sessionMiddleware , 
                    zValidator("form" , updateProjectSchema),
                    
                    async(c)=>{
                        const databases= c.get("tablesDB");
                        const storage = c.get("storage");
                        const user = c.get("user");
            
                        const {projectId}= c.req.param();
                        const {imageUrl ,name} = c.req.valid("form");

                        const existingProject = await databases.getRow<Project>(
                            Database_ID,
                            Project_ID,
                            projectId
                        );
                        
                        const member= await getMember({databases,workspaceId:existingProject.workspaceId ,   userId:user.$id });
            
                        if(!member ){
                            
                            return c.json({error : "Unauthorized"},401);
                            
                        }
            
                        
                        
                        let uploadedImageUrl: string | undefined;
            
                        if(imageUrl instanceof File){
                            const file = await storage.createFile(
                                Image_Bucket_ID,
                                ID.unique(),
                                imageUrl,
                            );
                           
                            uploadedImageUrl= file.$id;
                        }
                        
            
              
            
                        const project = await databases.updateRow(
                            Database_ID ,
                            Project_ID,
                            projectId ,
                            {
                                name,
                                imageUrl:uploadedImageUrl ?? existingProject.imageUrl,
            
                            }
            
                        );
            
                        return c.json({data:project});
                    }
            
                )
             .delete("/:projectId" , 
                    sessionMiddleware , 
                    
                    async(c)=>{
                        const databases = c.get("tablesDB");
                        const user  = c.get("user");
                        const {projectId} = c.req.param();


                        const existingProject = await databases.getRow<Project>(
                            Database_ID,
                            Project_ID,
                            projectId
                        );

                        const member = await getMember({
                            databases , 
                            workspaceId:existingProject.workspaceId ,
                            userId:user.$id,
                        });
            
                        if(!member  ){
                            return c.json( {error:"Unauthrized" } , 401 )
                            
                        }
            
                        // To do  :Delete member , project
            
                        await databases.deleteRow(Database_ID , Project_ID , projectId);
            
                        return c.json({data:{$id:projectId}});
            
                    }
                )


export default app;
