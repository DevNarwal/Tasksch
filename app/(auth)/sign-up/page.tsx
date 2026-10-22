import { getUser } from "@/features/auth/queries";  
import {redirect} from "next/navigation";
import { SignupCard } from "@/features/auth/components/SignupCard";
const SignUp = async() => {
    const user = await getUser();
    if(user){
        redirect("/");
    }
    return (
         <div className="bg-white rounded-lg border-[#dbe7f5] border-2">
        <SignupCard/>
        </div>
    )

};
export default SignUp;