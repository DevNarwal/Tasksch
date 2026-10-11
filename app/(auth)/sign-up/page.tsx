import { getUser } from "@/features/auth/queries";  
import {redirect} from "next/navigation";
import { SignupCard } from "@/features/auth/components/SignupCard";
const SignUp = async() => {
    const user = await getUser();
    if(user){
        redirect("/");
    }
    return (

        <SignupCard/>
    )

};
export default SignUp;