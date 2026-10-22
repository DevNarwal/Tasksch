"use client";
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {RiAddCircleFill} from "react-icons/ri";
import {Select , 
    SelectContent , 
    SelectItem ,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { WorkspaceAvtar } from "@/features/workspaces/components/workspaces-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/components/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/components/hooks/use-create-workspace-modal"
export const WorkspaceSwitcher = ()=>{

    const {data:workspaces} = useGetWorkspaces();
    const {open} = useCreateWorkspaceModal();
    const router = useRouter();
    const onSelect= (id:string) =>{
        router.push(`/workspaces/${id}`);
    }
    const workspaceId = useWorkspaceId();
    
    return (
        <div className="flex flex-col gap-y-2">
           <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500">Workspace</p>
            <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
           </div>
           <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-white font-medium p-1">
                    <SelectValue placeholder="No workspace Selceted"/>
                </SelectTrigger>
                <SelectContent className="bg-white">
                    {workspaces?.rows.map((workspaces)=>(
                        <SelectItem key={workspaces.$id} value={workspaces.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvtar name={workspaces.name}  className="size-7"
                                    image={workspaces.imageUrl? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID}/files/${workspaces.imageUrl}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`: undefined}
                                 />
                                <span className="truncate">{workspaces.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
           </Select>
        </div>
    );
};