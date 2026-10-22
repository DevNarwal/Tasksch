import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

interface useGetProjectsProps{
    workspaceId:string;
}

export const useGetProjects =( {workspaceId}:useGetProjectsProps)=>{

    const querry = useQuery({

        queryKey:["projects",workspaceId],
        queryFn:async ()=>{
            const response = await client.api.projects.$get({
                query:{workspaceId}
            });

            if(!response.ok){
                throw new Error(await response.text());
            }

            const {data} = await response.json();
            return data;
        },
    })
    return querry;
}