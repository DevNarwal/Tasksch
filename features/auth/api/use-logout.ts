"use client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {InferResponseType , InferRequestType} from "hono";
import {client} from "@/lib/rpc";

type ResponseType  = InferResponseType <typeof client.api.auth.logout["$post"]>;
type RequestType = InferRequestType < typeof client.api.auth.logout["$post"]>;

export const useLogout = ()=>{
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<
    RequestType,
    Error
  
    >({
        mutationFn: async()=>{

            const response = await client.api.auth.logout["$post"]();
            return await response.json();
        },
        onSuccess: ()=>{
            queryClient.removeQueries({queryKey:["current"]});
            router.replace("/sign-in");
        }
    });

    return mutation;

}





