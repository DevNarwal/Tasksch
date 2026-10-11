"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/router";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>;
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"],200>;


export const useJoinWorkspace = () => {
  const querryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({param , json}) => {
      const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({param , json});
      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }
      return await response.json();
    },
    onSuccess:({data})=>{
      
      toast.success("Joined Workspace");
      querryClient.invalidateQueries({queryKey:["workspaces"]});
      querryClient.invalidateQueries({queryKey:["workspaces" , data.$id]});
    },
    onError:()=>{
      toast.error("Failed to join workspace");
    }
  });

  return mutation;
};