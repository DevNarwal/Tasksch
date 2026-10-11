import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetWorkspaces =()=>{

    const querry = useQuery({

        queryKey:["workspaces"],
        queryFn:async ()=>{
            const response = await client.api.workspaces.$get();

            if(!response){
                throw new Error ("Failed to fetch Workspaces");
            }

            const {data} = await response.json();
            return data;
        },
    })
    return querry;
}