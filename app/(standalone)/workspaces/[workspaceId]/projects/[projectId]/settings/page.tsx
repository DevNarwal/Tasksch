import { getProjectUpdate } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/queries";
import { EditProjecteForm } from "@/features/projects/components/edit-project-form";
interface ProjectIdSettingPageProps{

    params:{
        projectId:string,
    }
}

const ProjectIdSettingPage = async({params}:ProjectIdSettingPageProps)=>{

    const project = await getProjectUpdate({projectId:params.projectId});
    const initialValues = {
        $id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
        workspaceId: project.workspaceId,
    };

    return( 
    <div >
        <EditProjecteForm initialValues={initialValues}/>
    </div>
    )
};

export default ProjectIdSettingPage;