
import { redirect } from 'next/navigation';
import {UserButton} from '@/features/auth/components/user-button';
import { getUser } from '@/features/auth/actions';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspaces-form';
export default async function Home() {
  
  const user = await getUser();
  if(!user){
    redirect("/sign-in");
  }


  return (
    <div className='bg-neutral-100 p-4 h-full' >
      <CreateWorkspaceForm />
    </div>
     
  );
}
