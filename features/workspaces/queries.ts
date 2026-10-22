"use server";
import {Client , Databases , TablesDB , Account} from 'node-appwrite';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/features/auth/constants';
import { Query } from 'node-appwrite';
import { getMember } from '../members/utils';
import {Workspace} from './types';

import { Database_ID ,Workspace_ID ,Image_Bucket_ID ,Member_ID    } from '@/config';
import { createSessionClient } from '@/lib/appwrite';

export const getWorkspace = async()=>{
    
    try{
         
        const {databases , account } = await createSessionClient();
        const user= await account.get();

        const member= await databases.listRows(
            Database_ID , 
            Member_ID,
            [Query.equal("UserId" , user.$id)]
        );

        if(member.total == 0){
            
            return {rows:[] , total:0};
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
        return workspace;
    }
    catch{
        return {rows:[] , total:0};
    }


    
}
interface getWorkspaceUpdateProps{
    workspaceId:string
}

export const getWorkspaceUpdate = async({workspaceId}:getWorkspaceUpdateProps)=>{
    
    try{
         const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE);

        if(!session)return null;

        client.setSession(session.value);

        const databases = new TablesDB(client);
        const account = new Account(client);
        const user= await account.get();

        const member = await getMember({databases  ,userId:user.$id , workspaceId }  );

        if(!member) {
            throw new Error("Unauthorized");
        }
        
        const workspace = await databases.getRow<Workspace>(
            Database_ID,
            Workspace_ID,
            workspaceId,
        );
        return {...workspace}; 
    }
    catch{
        return null;
    }


    
}
interface getWorkspaceInfoProps{
    workspaceId:string
}

export const getWorkspaceInfo = async({workspaceId}:getWorkspaceInfoProps)=>{
    
    try{
         const {databases } = await createSessionClient();
         const workspace = await databases.getRow(
            Database_ID,
            Workspace_ID,
            workspaceId
        );

        return {
            name:workspace.name,
        }
    }
    catch{
        return null;
    }


    
}