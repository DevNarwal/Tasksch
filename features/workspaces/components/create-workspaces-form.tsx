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

interface CreateWorkspacesFormProps {
    onCancle?:() =>void;
};

export const CreateWorkspaceForm = ({onCancle}:CreateWorkspacesFormProps)=>{
    const {mutate ,isPending, error} = useCreateWorkspace();
    const form = useForm<z.infer<typeof createWorkspacesSchema>>({
        resolver:zodResolver(createWorkspacesSchema),
        defaultValues:{
            name:"",
        },

    });

    const onSubmit = (values:z.infer<typeof createWorkspacesSchema>)=>{
       
        mutate({json:values});
    };

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
                        </div>
                        <DottedSeprator className="py-7"/>
                         <div className="flex  items-center justify-between">
                            <Button
                            type="button"
                            size="lg"
                            variant="secondary"
                            onClick={onCancle}
                            disabled={isPending}
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