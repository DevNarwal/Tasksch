import { redirect } from "next/navigation";
import {getUser}from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
interface WorksapceIdJoinPageProps {
    params:{
        workspaceId:string
    };
};

const WorksapceIdJoinPage = async({
    params,}:WorksapceIdJoinPageProps) =>{

    const user = await getUser();
    if(!user){
        redirect("/sign-in");
    }

    const initialValues =  await getWorkspaceInfo({
        workspaceId:params.workspaceId,
    
    });

    if(!initialValues){
        redirect("/");
    }

    return (
        <div>
            <JoinWorkspaceForm initialValues={initialValues} />
        </div>
    )
};

export default WorksapceIdJoinPage;