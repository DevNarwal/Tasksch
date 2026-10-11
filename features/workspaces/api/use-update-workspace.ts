"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/router";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"] >;
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"] , 200>;


export const useUpdateWorkspace = () => {
  const querryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({form , param}) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({form , param});
      if (!response.ok) {
        throw new Error("Failed to update Workspace");
      }
      return await response.json();
    },
    onSuccess:({data})=>{
      
        toast.success("Workspace Updated");
        querryClient.invalidateQueries({queryKey:["workspaces"]});
        querryClient.invalidateQueries({queryKey:["workspaces" , data.$id]});
    },
    onError:()=>{
      toast.error("Fail to update Workspace");
    }
  });

  return mutation;
};