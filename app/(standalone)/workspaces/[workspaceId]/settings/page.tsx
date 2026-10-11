import { getUser} from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { getWorkspaceUpdate } from '@/features/workspaces/queries';
interface WorksapceIdSettingPageProps {
    params:{
        workspaceId:string;
    }
};

const WorksapceIdSettingPage = async({params}:WorksapceIdSettingPageProps)=>{

    const user = await getUser();

    if(!user) redirect("/sign-in");

    const initialValues = await getWorkspaceUpdate({workspaceId:params.workspaceId});

    if(!initialValues)redirect(`/workspaces/${params.workspaceId}`);
     
    return (
        <div>
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    )

};


export default WorksapceIdSettingPage;
