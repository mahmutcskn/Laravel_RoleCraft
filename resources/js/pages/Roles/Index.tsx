import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {can} from '@/lib/can';

// İzin (Permission) verisinin yapısını tanımlayan arayüz.
interface Permission {
    id: number;
    name: string;
}

// Rol (Role) verisinin yapısını tanımlayan arayüz.
// Artık bir rolün 'permissions' adında, Permission dizisi tipinde bir özelliği var.
interface Role {
    id: number;
    name: string;
    permissions: Permission[]; // Rolün sahip olduğu izinler
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

// Bileşen, 'roles' adında bir prop alır ve bu prop'un tipi 'Role[]' olarak belirtilir.
export default function Index({ roles }: { roles: Role[] }) {

    // Rol silme işlemini yöneten fonksiyon.
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="p-3">
                {/* Yeni rol oluşturma sayfası için bağlantı */}
                {can('roles.create') && <Link href={route('roles.create')} className="cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white">
                    Create Role
                </Link>}

                <div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Permissions</th> {/* Yeni başlık */}
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 'roles' dizisi üzerinde dönerek her bir rolü listeleriz. */}
                            {roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-900 even:dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th scope="row" className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                                        {role.id}
                                    </th>
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                                        {role.name}
                                    </td>
                                    {/* Permissions sütunu */}
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                                        {/* Rolün sahip olduğu izinler üzerinde döneriz */}
                                        {role.permissions.map((permission) => (
                                            <span
                                                key={permission.id} // Her izin için benzersiz bir anahtar
                                                className="mr-1 bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                            >
                                                {permission.name} {/* İzin adını gösteririz */}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="flex space-x-2 px-6 py-2">
                                        {can('roles.view') && 
                                        <Link
                                            href={route('roles.show', role.id)}
                                            className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                                        >
                                            Show
                                        </Link>
                                        }
                                        {can('roles.edit') &&<Link
                                            href={route('roles.edit', role.id)}
                                            className="cursor-pointer rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white"
                                        >
                                            Edit
                                        </Link>}
                                        {can('roles.delete') && <button
                                            onClick={() => handleDelete(role.id)}
                                            className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
                                        >
                                            Delete
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
