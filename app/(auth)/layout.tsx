import Image from "next/image";
import {Button} from "@/components/ui/button";
interface AuthLayoutProps {
    children: React.ReactNode;
};

const authLayout = ({children}: AuthLayoutProps) => {

    return (
        <main className=" min-h-screen">
            <div className="max-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">

                    <Image src="/image.png" alt="Logo" width={166} height={56} />
                    <Button variant="secondary">Sign Up</Button>
                </nav>
                <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
                    {children}
                </div>
            </div>
        </main>
    )
};

export default authLayout;