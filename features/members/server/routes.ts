import {Hono} from  "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import {z} from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "../utils";
import { Query } from "node-appwrite";
import { Database_ID , Member_ID } from "@/config";
import { MemberRole } from "../types";
const app = new Hono()  
    .get("/", sessionMiddleware , zValidator("query", z.object({workspaceId:z.string()})),
    async(c)=>{
        
        const {users} = await createAdminClient();
        const databases = c.get("tablesDB");
        const user = c.get("user");
        const {workspaceId} = c.req.valid("query");

        const member = await getMember({
            databases , 
            workspaceId,
            userId:user.$id
        });

        if(!member){
            return c.json({error:"Unauthroized User"}, 401);
        }

        const members = await databases.listRows(
            Database_ID , 
            Member_ID,
            [Query.equal("workspaceID" , workspaceId)]
        )

        const populateMembers = await Promise.all(
            members.rows.map( async(member)=>{

                const user = await users.get(member.UserId);

                return {
                    ...member,
                    name:user.name,
                    email:user.email, 
                }

            })
        );

        return c.json({
            data:{
                ...member,
                documents:populateMembers,

            }
        })

    }

    )
    .delete("/:memberId" , sessionMiddleware ,
        async(c)=>{
            const {memberId} = c.req.param();
            const user = c.get("user");
            const databases = c.get("tablesDB");

            const memberToDelete = await databases.getRow(
                Database_ID,
                Member_ID,
                memberId
            );
            const allMember = await databases.listRows(
                Database_ID,
                Member_ID ,
                [Query.equal("workspaceID"  , memberToDelete.workspaceID)]
            );
            const member = await getMember({
                databases,
                workspaceId:memberToDelete.workspaceID,
                userId:user.$id
            });

            if(!member){
                return c.json({error:"Unauthorized"}, 401);
            }


            if(member.$id !== memberToDelete.$id  && member.role !== MemberRole.ADMIN ){
                return c.json({error:"Unauthorized"}, 401);
            }
            if(allMember.total==1){
                return c.json({error:"Cannot delete the only member"},400);
            }
            await databases.deleteRow(
                Database_ID,
                Member_ID,
                memberId,
            );

            return c.json({data:{$id:memberToDelete.$id}});

        }
     )
     .patch("/:memberId",
        sessionMiddleware,
        zValidator("json", z.object({role:z.nativeEnum(MemberRole)})),
        async(c)=>{
            const {memberId} = c.req.param();
            const user = c.get("user");
            const databases = c.get("tablesDB");
            const role = c.req.valid("json");

            const memberToUpdate = await databases.getRow(
                Database_ID,
                Member_ID,
                memberId
            );
            const allMember = await databases.listRows(
                Database_ID,
                Member_ID ,
                [Query.equal("workspaceID"  , memberToUpdate.workspaceID)]
            );
            const member = await getMember({
                databases,
                workspaceId:memberToUpdate.workspaceID,
                userId:user.$id
            });

            if(!member){
                return c.json({error:"Unauthorized"}, 401);
            }


            if( member.role !== MemberRole.ADMIN ){
                return c.json({error:"Unauthorized"}, 401);
            }
            if(allMember.total==1){
                return c.json({error:"Cannot downgrade the only member"},400);
            }
            await databases.updateRow(
                Database_ID,
                Member_ID,
                memberId,
                {
                    role,
                }
            );

            return c.json({data:{$id:memberToUpdate.$id}});

        }
        
        

     )

export default app;
