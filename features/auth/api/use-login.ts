"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;
type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;


export const useLogin = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {//(json) is same as (data) => {const json = data.json; return await client.api.auth.login["$post"](json); }  it is just a shorthand way of writing the function. It is a parameter that is passed to the mutation function when it is called. It is an object that contains the data that is sent to the server. In this case, it is an object that contains the email and password of the user.
      const response = await client.api.auth.login["$post"](json);
      return await response.json();//this json is use to convert the response to json format and return it to the component that called this function
    }
  });

  return mutation;
};