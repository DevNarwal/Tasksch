"use client";
import {Card , CardContent , CardHeader , CardDescription , CardTitle }  from "@/components/ui/card";
import {DottedSeprator} from "@/components/dotted-seprator"
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "../api/use-join-workspace";
import  Link  from "next/link";
import { useInviteCode } from "./hooks/use-invite-code";
import { useWorkspaceId } from "./hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
    initialValues:{
        name:string,
    }
    
}

export const JoinWorkspaceForm = ({initialValues,}:JoinWorkspaceFormProps)=>{
    const {mutate , isPending} = useJoinWorkspace();
    const inviteCode = useInviteCode();
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const onsubmit = ()=>{
        mutate({
            param:{workspaceId},
            json:{code:inviteCode}
        },{
            onSuccess:({data})=>{
               router.push(`/workspaces/${data.$id}`);
            }
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join <strong> {initialValues.name}</strong> 
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeprator/>
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                    <Button 
                    className="w-full lg:w-fit"
                    variant="secondary"
                    type="button"
                    asChild 
                    size="lg"
                    disabled={isPending}
                        >
                           <Link href="/" > Cancel</Link>
                             </Button>
                    <Button
                     className="w-full lg:w-fit"
                     type="button"
                     size="lg"
                     onClick={onsubmit}
                     disabled={isPending}
                     > Join Workspace</Button>
                </div>
            </CardContent>
        </Card>
    )
}