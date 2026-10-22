import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";

interface StandaloneLayoutProps{
    children:React.ReactNode;
};

const StandaloneLayout = ( {children}:StandaloneLayoutProps)=>{

    return (
        
        <main className="bg-gradient-to-r from-white via-[#f9fcff] to-[#f1f7ff]  border-[#dbe7f5]">
            <div className="max-auto max-w-screen-2xl p-4 ">
                <nav className="flex justify-between items-center h-full">
                    <Link href="/">
                        <Image src="/image.png" alt="logo" height={56} width={152} />
                    </Link>
                    <UserButton/>
                </nav>
                <div className="flex flex-col items-center justify-center py-4">
                    {children}
                </div>
            </div>
        </main>
        
        
    )

};

export default StandaloneLayout;