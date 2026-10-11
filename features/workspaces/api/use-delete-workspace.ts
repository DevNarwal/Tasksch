"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/router";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>;
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"],200>;


export const useDeleteWorkspace = () => {
  const querryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({param}) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({param});
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();
    },
    onSuccess:({data})=>{
      
      toast.success("Workspace  Deleted");
      querryClient.invalidateQueries({queryKey:["workspaces"]});
      querryClient.invalidateQueries({queryKey:["workspaces" , data.$id]});
    },
    onError:()=>{
      toast.error("Fail to delete workspace");
    }
  });

  return mutation;
};