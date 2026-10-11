import Image from "next/image";
import {cn} from "@/lib/utils";

import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar";

interface MemberAvtarProps{
    
    name:string,
    className?:string,
    fallbackClassName?:string;
};

export const MemberAvtar = ({name,className,fallbackClassName}:MemberAvtarProps)=>{

    
    return (
        <Avatar className={cn("size-5 transition border border-neutral-100 rounded-full" , className)}>
            <AvatarFallback className={cn("font-medium text-neutral-500 flex items-center justify-center", fallbackClassName)}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

