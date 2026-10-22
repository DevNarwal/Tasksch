"use client";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {createProjectSchema} from "../schemas";
import {z} from "zod";
import {Card , CardContent , CardHeader ,CardTitle } from "@/components/ui/card";
import {Form , FormControl , FormField , FormMessage , FormLabel , FormItem   } from "@/components/ui/form";
import {DottedSeprator} from '@/components/dotted-seprator';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "../api/use-create-project";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {Avatar , AvatarFallback} from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/components/hooks/use-workspace-id";

interface CreateProjectFormProps {
    onCancle?:() =>void;
};

export const CreateProjectForm = ({onCancle}:CreateProjectFormProps)=>{
    const workspaceId = useWorkspaceId();
    const {mutate ,isPending, error} = useCreateProject();

    const inputRef = useRef<HTMLInputElement>(null);
    const formSchema = createProjectSchema.omit({ workspaceId: true });
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
    const form = useForm<
        z.input<typeof formSchema>,
        unknown,
        z.output<typeof formSchema>
    >({

        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
            imageUrl: undefined,

        },

    });
    const imageValue = form.watch("imageUrl");

    useEffect(() => {
        if (!(imageValue instanceof File)) {
            setImagePreviewUrl(undefined);
            return;
        }

        const previewUrl = URL.createObjectURL(imageValue);
        setImagePreviewUrl(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [imageValue]);

    const onSubmit = (values:z.output<typeof formSchema>)=>{
        const finalValues = {...values, workspaceId};
        mutate({form:finalValues},{
            onSuccess:()=>{
                form.reset();
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
                onCancle?.();
            }
        });
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(file){
            form.setValue("imageUrl", file, {shouldValidate: true});
        }
    }

    return (
        
        <Card className="w-full h-full bg-white border-2 border-[#dbe7f5] rounded-lg">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a Project 
                </CardTitle>
            </CardHeader>

            <div className="px-7"> 
                <DottedSeprator />
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
                                        Project Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="Enter Project Name"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}>
                                
                            </FormField>
                            {error && (
                                <p className="text-sm text-destructive">
                                    {error.message || "Unable to create project"}
                                </p>
                            )}

                            <FormField 
                            control={form.control}
                            name="imageUrl"
                            render={()=>(
                                <FormItem>
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {imagePreviewUrl ? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image
                                                    alt="Project icon preview"
                                                    fill
                                                    className="object-cover"
                                                    src={imagePreviewUrl}
                                                    />
                                                </div>
                                            ):(
                                                <Avatar className="size-[72px] ">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400 "/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col ">
                                                <p className="text-sm">Project Icon</p>
                                                <p className="text-sm text-neutral-700">JPG, PNG, SVG, or JPEG (max 1 MB)</p>
                                                <FormMessage />
                                                <input
                                                type="file"
                                                className="hidden"
                                                accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
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
                                </FormItem>
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
                                Create Project
                            </Button>
                         </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
};