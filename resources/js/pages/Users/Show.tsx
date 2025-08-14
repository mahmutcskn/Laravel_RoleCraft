import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

// Rol verisinin yapısını tanımlayan arayüz.
interface Role {
    id: number;
    name: string;
}

// Kullanıcı verisinin yapısını tanımlayan arayüz.
interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[]; // Kullanıcının sahip olduğu roller
}

// Bileşene gelen props'ların tipini tanımlayan arayüz.
interface ShowUserProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Show User',
        href: '#',
    },
];

// Bileşen, 'user' adında bir prop alır.
export default function Show({ user }: ShowUserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Show User: ${user.name}`} />

            <div className="p-3">
                <Link href={route('users.index')} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Back
                </Link>

                <div className="mx-auto mt-4 max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>

                    {/* Kullanıcı Adı */}
                    <div className="border-b border-gray-200 pb-2 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user.name}</p>
                    </div>

                    {/* Email */}
                    <div className="border-b border-gray-200 pb-2 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
                    </div>

                    {/* Roller */}
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Roles:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                    <span
                                        key={role.id}
                                        className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize"
                                    >
                                        {role.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No roles assigned.</p>
                            )}
                        </div>
                    </div>

                    {/* Düzenle Butonu (İsteğe Bağlı) */}
                    <div className="mt-6 flex justify-end">
                        <Link
                            href={route('users.edit', user.id)}
                            className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-yellow-600"
                        >
                            Edit User
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
