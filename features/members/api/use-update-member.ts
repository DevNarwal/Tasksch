"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/router";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>;
type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"],200>;


export const useUpdateMember = () => {
  const querryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({param , json}) => {
      const response = await client.api.members[":memberId"]["$patch"]({param , json});
      if (!response.ok) {
        throw new Error("Failed to Update member");
      }
      return await response.json();
    },
    onSuccess:()=>{
      
      toast.success("Member Updated");
      querryClient.invalidateQueries({queryKey:["members"]});
      
    },
    onError:()=>{
      toast.error("Fail to update member");
    }
  });

  return mutation;
};