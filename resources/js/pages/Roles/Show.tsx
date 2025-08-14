import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

// İzin (Permission) verisinin yapısını tanımlayan arayüz.
interface Permission {
    id: number;
    name: string;
}

// Rol (Role) verisinin yapısını tanımlayan arayüz.
// Bu, görüntülenecek rolün kendisini temsil eder.
interface Role {
    id: number;
    name: string;
    permissions: Permission[]; // Rolün sahip olduğu izinler
}

// Bileşene gelen props'ların tipini tanımlayan arayüz.
interface ShowRoleProps {
    role: Role;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Show Role',
        href: '#', // Geçerli sayfayı temsil eder
    },
];

// Bileşen, 'role' adında bir prop alır.
export default function Show({ role }: ShowRoleProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Show Role: ${role.name}`} />

            <div className="p-3">
                <Link href={route('roles.index')} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Back
                </Link>

                <div className="mx-auto mt-4 max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role Details</h2>

                    {/* Rol Adı */}
                    <div className="border-b border-gray-200 pb-2 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{role.name}</p>
                    </div>

                    {/* İzinler */}
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Permissions:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {role.permissions.length > 0 ? (
                                role.permissions.map((permission) => (
                                    <span
                                        key={permission.id}
                                        className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300 capitalize"
                                    >
                                        {permission.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No permissions assigned.</p>
                            )}
                        </div>
                    </div>

                    {/* Düzenle Butonu (İsteğe Bağlı) */}
                    <div className="mt-6 flex justify-end">
                        <Link
                            href={route('roles.edit', role.id)}
                            className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-yellow-600"
                        >
                            Edit Role
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
