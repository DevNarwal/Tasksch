"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "./create-project-form";
import {useCreateProjectModal} from "@/features/projects/hooks/use-create-project-modal";

export const CreateProjectModel = ()=>{

    const {isOpen , setisOpen , close}=useCreateProjectModal();

    return(
       
        <ResponsiveModal open={isOpen} onOpenChange={setisOpen  }>
            <CreateProjectForm onCancle={close}/>
        </ResponsiveModal>
        

    )
}