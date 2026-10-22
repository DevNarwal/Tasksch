"use client";

import {RiAddCircleFill} from "react-icons/ri";
import { useGetProjects } from "@/features/projects/api/use-get-project";
import { useWorkspaceId } from "@/features/workspaces/components/hooks/use-workspace-id";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvtar } from "@/features/projects/components/project-avtar";
export const Projects = ()=>{
    const workspaceId= useWorkspaceId();
    const {open} = useCreateProjectModal();
    const {data} =  useGetProjects({workspaceId});
    const pathname = usePathname();
    return (

        <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
                </div>

                {data?.rows.map((project)=>{

                    const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                    const isActive = pathname === href;

                    return (
                        <Link href={href} key={project.$id}>
                            <div 
                            className={cn("flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75  transition cursor-pointer text-neutral-500 border-[#c0d4eb] border-2" , isActive && "bg-white shadow-sm hover:opacity-100 text-primary"   )}>
                            <ProjectAvtar image={project.imageUrl} name={project.name} className="size-5"/>
                            <span className="truncate">{project.name}  </span>
                            </div>
                        </Link>
                    )
                    
                })}
        </div>
    );
};

export default Projects;