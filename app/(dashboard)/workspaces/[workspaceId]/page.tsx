import { getUser} from "@/features/auth/queries";
import { redirect } from "next/navigation";
const WorkspaceIdPage = async()=>{
    const user = await getUser();
      if(!user){
        redirect("/sign-in");
      }
    return (
        <div>
            WorkspaceId
        </div>
    );
};
export  default WorkspaceIdPage;