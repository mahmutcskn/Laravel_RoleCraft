import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Notebook, UserRound } from 'lucide-react';
import AppLogo from './app-logo';
import { can } from '@/lib/can'; // 'can' fonksiyonunu import ediyoruz

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UserRound,
    },
    // 'Roles' menü öğesi artık dinamik olarak render edilecek
    // {
    //     title: 'Roles',
    //     href: '/roles',
    //     icon: Notebook,
    // },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    // Rollerle ilgili herhangi bir yetkiye sahip olup olmadığını kontrol ediyoruz.
    // Eğer kullanıcının 'roles.view' veya 'roles.create' veya 'roles.edit' veya 'roles.delete'
    // izinlerinden herhangi biri varsa, 'Roles' menü öğesini göstereceğiz.
    const hasRolePermissions = can('roles.view') || can('roles.create') || can('roles.edit') || can('roles.delete');

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
                {/* NavMain'e sadece Dashboard ve Users öğelerini gönderiyoruz. */}
                {/* Roles öğesi için ayrı bir koşullu render yapısı kuracağız. */}
                <NavMain items={mainNavItems} />

                {/* Eğer kullanıcının rollerle ilgili yetkisi varsa 'Roles' menü öğesini göster */}
                {hasRolePermissions && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/roles">
                                {/* Notebook ikonunu SidebarMenuButton'ın çocuğu olarak geçirdik */}
                                <SidebarMenuButton className="w-full">
                                    <Notebook className="h-5 w-5" /> {/* İkonu buraya ekleyin */}
                                    Roles
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
