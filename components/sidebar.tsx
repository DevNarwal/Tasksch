import Link from "next/link";
import Image from "next/image";
import DottedSeprator from "./dotted-seprator";
import  {Navigation}  from "./navigation";
import { WorkspaceSwitcher } from "./workspaces-switcher";
import {Projects} from "./projects";

export const Sidebar =() =>{
    return (
        <aside className="h-full w-full bg-[#f7faff] border-r border-[#c0d4eb] p-4">

            <Link href="/">
                <Image src="/image.png" alt="logo" width={222} height={38}/>
            </Link> 
            <DottedSeprator className="my-4 bg-neutral-500" />
            <WorkspaceSwitcher/>
            <DottedSeprator className="my-4" />

            <Navigation/>

            <DottedSeprator className="my-4" />
            <Projects/>


        </aside>
    );
};