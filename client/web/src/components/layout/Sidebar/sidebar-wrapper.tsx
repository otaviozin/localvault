import { AppSidebar } from './app-sidebar';
import { Me } from '@/api/auth/user';

export async function SidebarWrapper() {
    const user = await Me();
    return <AppSidebar user={user} />;
}
