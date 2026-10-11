import { SigninCard } from "@/features/auth/components/SigninCard";
import { getUser } from "@/features/auth/queries";
import {redirect} from "next/navigation";
const Signin = async() => {

    const user = await getUser();

    if(user){
        redirect("/");
    }

    return (

        <SigninCard/>
    )

};
export default Signin;