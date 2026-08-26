import { DottedSeprator } from "@/components/dotted-seprator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/dist/client/link";
import { loginSchema } from "../schemas";


const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
};

export const SigninCard = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Welcome Back
                </CardTitle>
            </CardHeader>

            <div className="px-7 mb-2">
                <DottedSeprator />
            </div>

            <CardContent className="p-7 flex flex-col gap-y-4">
                <Form {...form} >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Email */}
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter email address"
                                            className="w-full border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                        />
                                    </FormControl>

                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter password"
                                            className="w-full border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                            minLength={8}
                                            maxLength={256}
                                        />
                                    </FormControl>

                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        {/* Login button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <div className="px-7">
                <DottedSeprator />
            </div>

            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                >
                    <FcGoogle className="mr-2 size-5" />
                    Login with Google
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                >
                    <FaGithub className="mr-2 size-5" />
                    Login with GitHub
                </Button>
            </CardContent>
            <div className="px-7">
                <DottedSeprator />
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