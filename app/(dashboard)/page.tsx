
import { redirect } from 'next/navigation';
import {UserButton} from '@/features/auth/components/user-button';
import { getUser } from '@/features/auth/queries';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspaces-form';
import {getWorkspace} from '@/features/workspaces/queries';
export default async function Home() {
  
  const user = await getUser();
  if(!user){
    redirect("/sign-in");
  }
  const workspaces = await getWorkspace ();
  
  if(workspaces.total==0){
    redirect('/workspaces/create');
  }
  else{
    //console.log(workspaces.rows[0].$id);
    redirect(`/workspaces/${workspaces.rows[0].$id}`);
  }

  
}
