"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/router";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;
type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;


export const useCreateWorkspace = () => {
  const querryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({form}) => {//(json) is same as (data) => {const json = data.json; return await client.api.auth.login["$post"](json); }  it is just a shorthand way of writing the function. It is a parameter that is passed to the mutation function when it is called. It is an object that contains the data that is sent to the server. In this case, it is an object that contains the email and password of the user.
      const response = await client.api.workspaces["$post"]({form});
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();//this json is use to convert the response to json format and return it to the component that called this function
    },
    onSuccess:()=>{
      
      querryClient.invalidateQueries({queryKey:["workspaces"]});
      toast.success("Workspace Created");
    },
    onError:()=>{
      toast.error("Fail to create workspace");
    }
  });

  return mutation;
};