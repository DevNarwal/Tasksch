"use client";
import {Card  , CardContent , CardHeader , CardTitle} from "@/components/ui/card";
import { useWorkspaceId } from "./hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import  Link  from "next/link";
import DottedSeprator from "@/components/dotted-seprator";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { MemberAvtar } from "@/features/members/components/member-avtar";
import { MoreVertical } from "lucide-react";
import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu , DropdownMenuContent , DropdownMenuItem , DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import {useConfirm} from "@/hooks/use-confirm";

export const MemberList = () => {

    const workspaceId = useWorkspaceId();
    const [ConfrimDialogue , confirm] = useConfirm(
        "Remove member",
        "This member will be remove from the workspace",
        "destructive"
    );

    const {data, isPending, error} = useGetMembers({workspaceId});

    const {mutate:deleteMember , isPending:isDeletingMember} = useDeleteMember();
    const {mutate:updateMember , isPending:isUpdatingMember} = useUpdateMember();

    const handleUpdateMember = (memberId:string , role:MemberRole)=> {

        updateMember({
            json:{role} , 
            param:{memberId}
        });
    };
    
    const handleDeleteMember = async(memberId:string)=>{
        const ok = await confirm();
        if(!ok)return;

        deleteMember({ param:{ memberId}},{
            onSuccess:()=>{
                window.location.reload();
            },
        })
    }


    return (
       
        <Card  className="w-full h-full border-none shadow-none ">
            <ConfrimDialogue/>
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button asChild variant="secondary" size="sm" >
                    <Link href={`/workspaces/${workspaceId}`}>
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Back
                    </Link>
                </Button>
                <CardTitle className="text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>

            <div className="px-7">
                <DottedSeprator/>
            </div>
            <CardContent className="p-7">
                {isPending && <p className="text-sm text-muted-foreground">Loading members...</p>}
                {error && <p className="text-sm text-destructive">{error.message}</p>}
                {!isPending && !error && data?.documents.length === 0 && (
                    <p className="text-sm text-muted-foreground">No members found.</p>
                )}
                {data?.documents.map((member,index) => (
                    <Fragment>
                    <div key={member.$id} className="flex items-center gap-3 py-3">
                        <MemberAvtar
                            className="size-10"
                            fallbackClassName="text-lg"
                            name={member.name}
                        />
                        <div className="min-w-0">
                            <p className="truncate font-medium">{member.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="ml-auto" variant="secondary" size="icon">
                                    <MoreVertical className="size-4 text-muted-foreground"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                                <DropdownMenuItem className="font-medium" onClick={ ()=>handleUpdateMember(member.$id , MemberRole.ADMIN)} disabled={isUpdatingMember} >
                                    Set as Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium" onClick={ ()=>handleUpdateMember(member.$id , MemberRole.MEMBER)} disabled={isUpdatingMember} >
                                    Set as Member
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium text-amber-700" onClick={ ()=>handleDeleteMember(member.$id)} disabled={isDeletingMember} >
                                    Remove Member
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {index < data.documents.length -1 && (
                        <Separator className="my-2.5"/>
                    ) }
                    </Fragment>
                ))}
            </CardContent>      
     
        </Card>

    )
}