"use client";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {createWorkspacesSchema} from "../schemas";
import {z} from "zod";
import {Card , CardContent , CardHeader ,CardTitle } from "@/components/ui/card";
import {Form , FormControl , FormField , FormMessage , FormLabel , FormItem   } from "@/components/ui/form";
import {DottedSeprator} from '@/components/dotted-seprator';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRef } from "react";
import Image from "next/image";
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


interface CreateWorkspacesFormProps {
    onCancle?:() =>void;
};

export const CreateWorkspaceForm = ({onCancle}:CreateWorkspacesFormProps)=>{
    const {mutate ,isPending, error} = useCreateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null);
    
    const form = useForm<z.infer<typeof createWorkspacesSchema>>({
        resolver:zodResolver(createWorkspacesSchema),
        defaultValues:{
            name:"",

        },

    });
    const router= useRouter();
    const onSubmit = (values:z.infer<typeof createWorkspacesSchema>)=>{
        const  finalValues= {...values , 
            image: values.imageUrl instanceof File ? values.imageUrl : "",
        };
        mutate({form:finalValues},{
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

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a Workspace 
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
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image
                                                alt="Logo"
                                                fill
                                                className="object-cover"
                                                src={field.value instanceof File ? URL.createObjectURL(field.value) : ""}
                                                />
                                            </div>
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
                                Create Workspace
                            </Button>
                         </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
};