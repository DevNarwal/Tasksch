import {GoHome , GoHomeFill , GoCheckCircle , GoCheckCircleFill} from "react-icons/go";
import { SettingsIcon  , UsersIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
const routes = [
    {
        label:"Home",
        href:"",
        icon:GoHome,
        activeIcon:GoHomeFill,
        
    },
    {
        label:"My Task",
        href:"/tasks",
        icon:GoCheckCircle,
        activeIcon:GoCheckCircleFill,
        
    },
    {
        label:"Settings",
        href:"/setting",
        icon:SettingsIcon,
        activeIcon:SettingsIcon,
        
    },
    {
        label:"Members",
        href:"/members",
        icon:UsersIcon,
        activeIcon:UsersIcon,
        
    }

];

export const Navigation = ()=>{

    return (
        <ul className="Flex flex-col">
            {routes.map((items)=>{
                const isActive = false;
                const Icon = isActive ?items.activeIcon : items.icon;
                return (
                    <Link key={items.href} href={items.href} >
                        <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500" , isActive  && "bg-white shadow-sm  hover:opacity-100  text-primary")}>
                            <Icon className="size-5 text-neutral-500"/>{items.label}
                        </div>
                    </Link>
                );
            })}
        </ul>
    )
}