"use client";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {updateWorkspacesSchema} from "../schemas";
import {z} from "zod";
import {Card , CardContent , CardHeader ,CardTitle } from "@/components/ui/card";
import {Form , FormControl , FormField , FormMessage , FormLabel , FormItem   } from "@/components/ui/form";
import {DottedSeprator} from '@/components/dotted-seprator';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useRef } from "react";
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Workspace } from "../types";

import { ArrowLeftIcon } from "lucide-react";


import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";

import { CopyIcon } from "lucide-react"; 
import { toast } from "sonner";

import { useResetInviteCode } from "../api/use-reset-invite-code";
interface EditWorkspacesFormProps {
    onCancle?:() =>void;
    initialValues:Workspace;
};

export const EditWorkspaceForm = ({onCancle , initialValues}:EditWorkspacesFormProps)=>{
    const {mutate ,isPending, error} = useUpdateWorkspace();

    const {mutate:deleteWorkspace , isPending:isDeletingWorkspace}= useDeleteWorkspace();
    const {mutate:resetInviteCode , isPending:isResettingInviteCode}= useResetInviteCode();

    const inputRef = useRef<HTMLInputElement>(null);

    const [DeleteDialog , confirmDelete]   = useConfirm(
        "Delete Workspace",
        "This action cannot be undone",
        "destructive"

    );
    const [ResetDialog , confirmReset]   = useConfirm(
        "Reset Invite link",
        "This will invalidate the current invite code",
        "destructive"

    );

    // console.log(initialValues.name);
    // console.log(initialValues.imageUrl);
    
    const form = useForm<z.infer<typeof updateWorkspacesSchema>>({
        resolver:zodResolver(updateWorkspacesSchema),
        defaultValues:{
            name:initialValues.name,
            imageUrl:initialValues.imageUrl ?? "",


        },

    });
    const handleDelete = async() =>{

       

        const ok = await confirmDelete();
        
        if(!ok){
            return;
        }

        deleteWorkspace({
            param:{workspaceId:initialValues.$id}
        },{
            onSuccess:()=>{
               window.location.href="/" ;
            }
        })
    }
    const handleResetInviteCode = async() =>{

       

        const ok = await confirmReset();
        
        if(!ok){
            return;
        }

        resetInviteCode({
            param:{workspaceId:initialValues.$id}
        },{
            onSuccess:()=>{
               router.refresh();
            }
        })
    }
    const router= useRouter();
    const onSubmit = (values:z.infer<typeof updateWorkspacesSchema>)=>{
        const  finalValues= {...values , 
            image: values.imageUrl instanceof File ? values.imageUrl : "",
        };
        mutate({form:finalValues , param:{workspaceId:initialValues.$id , }},{
            onSuccess:({data})=>{
                form.reset();
                router.push(`/workspaces/${data.$id}`)
                
            }
        });
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(file){
            form.setValue("imageUrl", file);
        }
    }

    const fullinvitecode= `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

    const handleCopyInviteLink = ()=>{
        navigator.clipboard.writeText(fullinvitecode)
        .then(()=> toast.success("Invite code copied to the clipboard"));
    }
    return (
        <div className="flex flex-col gap-y-4 m-5 "> 
            <DeleteDialog/>
            <ResetDialog/>
            <div className="flex flex-row">
            <Card className="w-full h-full border-2 shadow-non  bg-[#f7faff]  border-[#dbe7f5] p-4  ">
                <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
                    <Button size="sm" variant="secondary" onClick={onCancle ? onCancle: ()=> router.push(`/workspaces/${initialValues.$id}`) }>
                        <ArrowLeftIcon  className="size-4 mr-2"/>
                        Back
                    </Button>
                    
                    <CardTitle >
                    {initialValues.name}
                    </CardTitle>
                    
                </CardHeader>

                <div className="px-7"> 
                    <DottedSeprator/>
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4 ">
                                <FormField control={form.control}
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Worksapce Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            {...field}
                                            placeholder="Enter Workspace Name"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}>
                                    
                                </FormField>
                                {error && (
                                    <p className="text-sm text-destructive">
                                        {error.message || "Unable to create workspace"}
                                    </p>
                                )}

                                <FormField 
                                control={form.control}
                                name="imageUrl"
                                render={({field})=>(

                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <Avatar className="size-[72px] rounded-md">
                                                    <AvatarImage
                                                        alt="Logo"
                                                        className="object-cover"
                                                        src={field.value instanceof File
                                                            ? URL.createObjectURL(field.value)
                                                            : `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID}/files/${field.value}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`}
                                                    />
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400"/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            ):(
                                                <Avatar className="size-[72px] ">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400"/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col ">
                                                <p className="text-sm">Workspace Icon</p>
                                                <p className="text-sm text-muted-foreground" >JPG , PNG, SVG or JPEG max 1MB  </p>
                                                <input
                                                type="file"
                                                className="hidden"
                                                accept=".jpg , .png , .jpeg , .svg"
                                                ref={inputRef}
                                                disabled={isPending}
                                                onChange={handleImageChange}
                                                />

                                                <Button className="w-fit mt-2"
                                                type="button"
                                                disabled={isPending}
                                                variant= "tertiary"
                                                size="sm"
                                                onClick={()=>inputRef.current?.click()}
                                                >
                                                    Upload Image
                                                </Button>

                                                
                                            </div>
                                        </div>
                                    </div>
                                )}
                                />

                            </div>
                            <DottedSeprator className="py-7"/>
                            <div className="flex  items-center justify-between">
                                <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                onClick={onCancle}
                                disabled={isPending}
                                className={cn(!onCancle && "invisible")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                type="submit"
                                size="lg"
                                disabled={isPending}
                                
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
            <DottedSeprator/>
            <div   >
            <Card className="  bg-[#f7faff] border-2 border-[#daeaff] p-4 ">
                <CardContent className="p-7 ">
                    <div className="flex flex-col ">
                        <h3 className="font-bold" > Invite Members</h3>
                        <p className="text-sm text-muted-foreground">Use the invite link to add members to your workspace</p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2 ">
                                <Input disabled value={fullinvitecode} />
                                <Button onClick={handleCopyInviteLink}
                                        variant="secondary"
                                        className="size-12">
                                    <CopyIcon/>

                                </Button>
                            </div>      
                        </div>

                        <Button className="mt-6 w-fit  ml-auto" size="sm"variant="destructive" type="button" disabled={isPending || isResettingInviteCode} 
                        onClick={handleResetInviteCode}
                        >

                            Reset Invite Code

                        </Button>
                    </div>

                </CardContent>
            </Card>
         
            <Card className=" w-full sm:w-full md:w-[500px] bg-[#f7faff] border-2 border-[#daeaff] p-4 ">
                <CardContent className="p-7">
                    <div className="flex flex-col ">
                        <h3 className="font-bold" >Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Deleting a workspace is irreversible and we will remove all associated data</p>
                        <Button className="mt-6 w-fit  ml-auto" size="sm"variant="destructive" type="button" disabled={isPending || isDeletingWorkspace} 
                        onClick={handleDelete}
                        >

                            Delete Workspace

                        </Button>
                    </div>

                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    )
};