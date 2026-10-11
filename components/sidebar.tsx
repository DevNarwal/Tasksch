import Link from "next/link";
import Image from "next/image";
import DottedSeprator from "./dotted-seprator";
import  {Navigation}  from "./navigation";
import { WorkspaceSwitcher } from "./workspaces-switcher";
export const Sidebar =() =>{
    return (
        <aside className="h-full w-full bg-[#f7faff] border-r border-[#dbe7f5] p-4">

            <Link href="/">
                <Image src="/image.png" alt="logo" width={222} height={38}/>
            </Link> 
            <DottedSeprator className="my-4" />
            <WorkspaceSwitcher/>
            <DottedSeprator className="my-4" />

            <Navigation/>
        </aside>
    );
};