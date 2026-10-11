import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspaces-form";
import { getUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
const WorkspaceCreatePage = async()=>{
    const user = await getUser();
      if(!user){
        redirect("/sign-in");
      }
    return (
        <div className=" w-8/12  lh:max-w-xl flex justify-center bg-neutral-300">
            <CreateWorkspaceForm/>
        </div>
    )
};

export default WorkspaceCreatePage;