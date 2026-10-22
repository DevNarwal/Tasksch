import { SigninCard } from "@/features/auth/components/SigninCard";
import { getUser } from "@/features/auth/queries";
import {redirect} from "next/navigation";
const Signin = async() => {

    const user = await getUser();

    if(user){
        redirect("/");
    }

    return (
        <div className="bg-white rounded-lg border-[#dbe7f5] border-2">
        <SigninCard/>
        </div>
    )

};
export default Signin;