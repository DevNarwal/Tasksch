"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"],200>;


export const useResetInviteCode = () => {
  const querryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({param}) => {
      const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({param});
      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }
      return await response.json();
    },
    onSuccess:({data})=>{
      
      toast.success("Invite code reset");
      router.refresh();
      querryClient.invalidateQueries({queryKey:["workspaces"]});
      querryClient.invalidateQueries({queryKey:["workspaces" , data.$id]});
    },
    onError:()=>{
      toast.error("Fail to reset invite code");
    }
  });

  return mutation;
};