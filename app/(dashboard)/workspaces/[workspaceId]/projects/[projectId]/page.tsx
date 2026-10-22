import {redirect} from "next/navigation";

import {getUser} from "@/features/auth/queries";

import { getProjectUpdate } from "../queries";
import { ProjectAvtar } from "@/features/projects/components/project-avtar";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

import TaskViewSwitcher from "@/features/tasks/components/task-viewer-switcher";

interface ProjectIdPageProps {
    params:{projectId:string},
}

const ProjectIdPage = async({params}:ProjectIdPageProps)=>{

    const user = await getUser();

    if(!user)redirect("/sign-in");
     
    const initialValue= await getProjectUpdate({
        projectId:params.projectId,
    });

    if(!initialValue){
        throw new Error("Project not found");
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvtar name={initialValue.name} image= {initialValue.imageUrl} className="size-8"/>
                    <p className="text-lg font-semibold">{initialValue.name}</p>
                </div>
                <div>
                    <Button   variant="secondary" className="text-black" asChild>
                        <Link href={`/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}/settings`}>
                        <PencilIcon className="size-4 mr-2" />
                        Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            <TaskViewSwitcher/>

        </div>

    )
}

export default ProjectIdPage;