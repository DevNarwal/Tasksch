import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "@/features/members/utils";
import { Database_ID , Project_ID } from "@/config";
import { Project } from "./types";

interface getProjectUpdateProps{
    projectId:string,
}

export const getProjectUpdate = async({projectId}:getProjectUpdateProps)=>{
    
   
    const {databases , account} = await createSessionClient();
    const user = await account.get();

    const project = await databases.getRow<Project>(
        Database_ID,
        Project_ID,
        projectId
    );

    const member = await getMember({
        databases,
        userId:user.$id,
        workspaceId:project.workspaceId
    });

    if(!member) {
        throw new Error("Unauthorized");
    }
        
    return project; 
    
    
}