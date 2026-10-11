import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/queries";
import { MemberList } from "@/features/workspaces/components/member-list";
const WorkspaceIdMemberPage = async()=>{

    const user = await getUser();

    if(!user) redirect("/sign-in");

    return(
        <div className="w-full lg:max-w-xl">
            <MemberList/>
        </div>
    );
};

export default WorkspaceIdMemberPage;