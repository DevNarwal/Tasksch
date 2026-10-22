import Image from "next/image";
import {cn} from "@/lib/utils";

import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";

interface ProjectAvtarProps{
    image?:string,
    name:string,
    className?:string;
};

export const ProjectAvtar = ({image,name,className}:ProjectAvtarProps)=>{

    if(image){
        return (
            <div className={cn(
                "size-10 relative rounded-md overflow-hidden",
                className
            )}>
                <Image src={image} alt="name" fill className="object-cover" />
            </div>
        )
    }

    return (
        <Avatar className={cn("size-10" , className)}>
            <AvatarFallback className=" text-white bg-[#0f75f1] font-semibold text-lg uppercase   rounded-lg">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}

