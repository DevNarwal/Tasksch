"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";


type RequestType = InferRequestType<typeof client.api.projects["$post"]>;
type ResponseType = InferResponseType<typeof client.api.projects["$post"],200>;


export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({form}) => {
      const response = await client.api.projects["$post"]({form});
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["projects"]});
      queryClient.invalidateQueries({queryKey:["workspaces"]});
      toast.success("Project created");
    },
    onError:()=>{
      toast.error("Fail to create project");
    }
  });

  return mutation;
};