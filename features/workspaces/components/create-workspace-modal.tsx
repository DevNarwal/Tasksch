"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./create-workspaces-form";
import {useCreateWorkspaceModal} from "./hooks/use-create-workspace-modal";

export const CreateWorkspaceModel = ()=>{

    const {isOpen , setisOpen , close}=useCreateWorkspaceModal();

    return(
       
        <ResponsiveModal open={isOpen} onOpenChange={setisOpen  }>
            <CreateWorkspaceForm onCancle={close}/>
        </ResponsiveModal>
        

    )
}