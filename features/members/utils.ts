import { Query , type TablesDB } from "node-appwrite";
import {Database_ID ,  Member_ID  } from "@/config";

interface getMemberProps{
    databases:TablesDB;
    workspaceId:string;
    userId:string;

}
export const getMember = async({databases , workspaceId , userId}:getMemberProps)  =>{

    const member = await databases.listRows(
        Database_ID,
        Member_ID,
        [
            Query.equal("workspaceID" , workspaceId),
            Query.equal("UserId",userId)
        ]

    )

    return member.rows[0];

}