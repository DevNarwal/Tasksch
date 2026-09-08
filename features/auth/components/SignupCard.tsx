import {z} from "zod";
import { DottedSeprator } from "@/components/dotted-seprator";
import { Button } from "@/components/ui/button";
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import Link from "next/dist/client/link";
import{Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import{useForm} from "react-hook-form";
import { registerSchema } from "../schemas";
import {useRegister} from "../api/use-register";

const onsubmit = (values: z.infer<typeof registerSchema>) => {
    console.log(values);
}

export const SignupCard =()=>{
    const {mutate} = useRegister();
    const form = useForm<z.infer<typeof registerSchema >>({
        resolver:zodResolver(registerSchema),
        defaultValues:{
            name:"",
            email:"",
            password:"",
        },
    })
 
    return (

        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>
                    By signing up, you agree to our {" "}
                    <Link href="/privacy">
                    <span className="text-blue-700">
                        Privacy Policy
                    </span>
                    </Link>{" "}
                    and{" "}
                    <Link href="/term">
                    <span className="text-blue-700">
                        Terms of Service
                    </span>
                    </Link>
                </CardDescription>
            </CardHeader>

            <div className="px-7 mb-2">
                <DottedSeprator/>
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field}  type="text"  placeholder="Enter full name" disabled={false} className="w-full"/> 
                                </FormControl>
                                <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field}  type="email"  placeholder="Enter email address" disabled={false} className="w-full"/>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field}  type="password"  placeholder="Enter password" disabled={false} className="w-full" min={8} max={256}/>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={false} size="lg" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <div className="px-7">
                <DottedSeprator/>
            </div>

            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button disabled={false} variant="secondary" size="lg" className="w-full">
                    <FcGoogle className="mr-2 size-5"></FcGoogle>
                    Login with Google
                </Button>
                <Button disabled={false} variant="secondary" size="lg" className="w-full">
                    <FaGithub className="mr-2 size-5"></FaGithub>
                    Login with GitHub
                </Button>
            </CardContent>

            <div className="px-7">
                <DottedSeprator/>
            </div>

            <CardContent className="7px flex items-center justify-center">

                <p>Already have an account?
                     <Link href="/sign-in">
                     <span className="text-blue-700">&nbsp;Sign In</span>
                     </Link>
                </p>

            </CardContent>
        </Card>
       
    );
};
