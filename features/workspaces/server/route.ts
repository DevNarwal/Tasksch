import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspacesSchema , updateWorkspacesSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID , Query } from "node-appwrite";
import { inviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import {z} from "zod";
import { Workspace } from "../types";
import {Database_ID ,Workspace_ID ,Image_Bucket_ID , Member_ID  } from "@/config";

const app = new Hono()
    .get("/",sessionMiddleware , async(c)=>{

        const databases=c.get("tablesDB");
        const user = c.get("user");

        const member= await databases.listRows(
            Database_ID , 
            Member_ID,
            [Query.equal("UserId" , user.$id)]
        );

        if(member.total == 0){
            return c.json({data:{rows:[], total:0}});
        }

        const workspaceIds=  member.rows.map((member)=>member.workspaceID);
        

        const workspace = await databases.listRows(
            Database_ID,
            Workspace_ID,
            [   
                Query.orderDesc("$createdAt"),
                Query.equal("$id", workspaceIds)
            ]

        );
        return c.json({data:workspace});

    })
    .post(
        "/",
        zValidator("form", createWorkspacesSchema),
        sessionMiddleware,
        async (c) => {
            const tablesDB = c.get("tablesDB");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name ,imageUrl } = c.req.valid("form");

            let uploadedImageUrl: string | undefined;

            if(imageUrl instanceof File){
                const file = await storage.createFile(
                    Image_Bucket_ID,
                    ID.unique(),
                    imageUrl,
                );
               
                uploadedImageUrl= file.$id;
            }

            const workspace = await tablesDB.createRow({
                databaseId: Database_ID,
                tableId: Workspace_ID,
                rowId: ID.unique(),
                data: {
                    name,
                    UserId: user.$id,
                    imageUrl:uploadedImageUrl,
                    inviteCode:inviteCode(6),
                },
            });

            await tablesDB.createRow(
                Database_ID,
                Member_ID,
                ID.unique(),
                {
                    UserId:user.$id,
                    workspaceID:workspace.$id,
                    role: MemberRole.ADMIN 
                }

            )

            return c.json({
                data: workspace,
            });
        }
    )
    .patch("/:workspaceId",
        sessionMiddleware , 
        zValidator("form" , updateWorkspacesSchema),
        
        async(c)=>{
            const databases= c.get("tablesDB");
            const storage = c.get("storage");
            const user = c.get("user");

            const {workspaceId}= c.req.param();
            const {imageUrl ,name} = c.req.valid("form");
            
            const member= await getMember({databases , workspaceId  ,  userId:user.$id});

            if(!member || member.role!==MemberRole.ADMIN){
                
                return c.json({error : "Unauthorized"},401);
                
            }

            const existingWorkspace = await databases.getRow(
                Database_ID , 
                Workspace_ID,
                workspaceId,
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
            

  

            const workspace = await databases.updateRow(
                Database_ID ,
                Workspace_ID,
                workspaceId ,
                {
                    name,
                    imageUrl:uploadedImageUrl ?? existingWorkspace.imageUrl,

                }

            );

            return c.json({data:workspace});
        }

    )
    .delete("/:workspaceId" , 
        sessionMiddleware , 
        
        async(c)=>{
            const databases = c.get("tablesDB");
            const user  = c.get("user");
            const {workspaceId} = c.req.param();

            const member = await getMember({
                databases , 
                workspaceId ,
                userId:user.$id,
            });

            if(!member || member.role != MemberRole.ADMIN ){
                return c.json( {error:"Unauthrized" } , 401 )
                
            }

            // To do  :Delete member , project

            await databases.deleteRow(Database_ID , Workspace_ID , workspaceId);

            return c.json({data:{$id:workspaceId}});

        }
    )
    .post("/:workspaceId/reset-invite-code" , 
        sessionMiddleware , 
        
        async(c)=>{
            const databases = c.get("tablesDB");
            const user  = c.get("user");
            const {workspaceId} = c.req.param();

            const member = await getMember({
                databases , 
                workspaceId ,
                userId:user.$id,
            });

            if(!member || member.role != MemberRole.ADMIN ){
                return c.json( {error:"Unauthrized" } , 401 )
                
            }

            // To do  :Delete member , project

            const workspace = await databases.updateRow(Database_ID , Workspace_ID , workspaceId ,
                 {inviteCode:inviteCode(6)});

            return c.json({data:workspace});

        }
    )
    .post(
        "/:workspaceId/join",
        sessionMiddleware,
        zValidator("json" , z.object({code:z.string()})),
        async(c) =>{
            const {workspaceId} = c.req.param();
            const {code} = c.req.valid("json");
            const databases = c.get("tablesDB");
            const user = c.get("user");

            const member = await getMember({
                databases,
                workspaceId,
                userId:user.$id,

            });

            if(member){
                return c.json({error:"Already a member"} , 400);
                
            }

            const workspace = await databases.getRow<Workspace>(Database_ID , Workspace_ID , workspaceId);

            if(workspace.inviteCode !== code ){
                return c.json({error:"Invalid invite code"},400);
            }

            await databases.createRow(
                Database_ID , 
                Member_ID,
                ID.unique(),
                {
                    workspaceID:workspaceId,
                    UserId:user.$id,
                    role:MemberRole.MEMBER,
                },
            );
            return c.json({data:workspace});

        }

    )

export default app;

 