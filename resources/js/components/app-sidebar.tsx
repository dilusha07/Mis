import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { AdministrationDropdown } from './administration-dropdown';
import { ModuleDropdown } from './module-dropdown';
import { ExaminationPlanDropdown } from './examination-plan';
import { StudentDropdown } from './student-dropdown';
import { NavMain } from './nav-main';

const mainNavItems: NavItem[] = [
   
];

const footerNavItems: NavItem[] = [
    {
        title: 'Permissions',
        href: '',
        icon: Folder,
    },
    {
        title: 'News',
        href: 'https://lms.eng.ruh.ac.lk/mod/forum/view.php?id=2',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
                {/*Dropdown */}
                <div className="mt-2">
                    <ModuleDropdown />
                    <ExaminationPlanDropdown />
                    <StudentDropdown />
                    <AdministrationDropdown />
                </div>
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
