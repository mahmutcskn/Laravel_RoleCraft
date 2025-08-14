import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {can} from '@/lib/can';


// Rol verisinin yapısını tanımlayan arayüz.
interface Role {
    id: number;
    name: string;
}

// Kullanıcı verisinin yapısını tanımlayan arayüz.
// Artık bir kullanıcının 'roles' adında, Role dizisi tipinde bir özelliği var.
interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[]; // Kullanıcının sahip olduğu roller
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

// Bileşen, 'users' adında bir prop alır ve bu prop'un tipi 'User[]' olarak belirtilir.
export default function Index({ users }: { users: User[] }) {

    // Kullanıcı silme işlemini yöneten fonksiyon.
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="p-3">
                {/* Yeni kullanıcı oluşturma sayfası için bağlantı */}
                {can('users.create') && <Link href={route('users.create')} className="cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white">
                    Create User
                </Link>}

                <div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Roles</th> {/* Yeni başlık */}
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 'users' dizisi üzerinde dönerek her bir kullanıcıyı listeleriz. */}
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-900 even:dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th scope="row" className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                                        {user.id}
                                    </th>
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                                        {user.email}
                                    </td>
                                    {/* Roller sütunu */}
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                                        {/* Kullanıcının sahip olduğu roller üzerinde döneriz */}
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <span
                                                    key={role.id} // Her rol için benzersiz bir anahtar
                                                    className="mr-1 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                                                >
                                                    {role.name} {/* Rol adını gösteririz */}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-xs italic">No roles</span>
                                        )}
                                    </td>
                                    <td className="flex space-x-2 px-6 py-2">
                                        {can('users.view') && 
                                        <Link
                                            href={route('users.show', user.id)}
                                            className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                                        >
                                            Show
                                        </Link>
                                        }
                                        {can('users.edit') && <Link
                                            href={route('users.edit', user.id)}
                                            className="cursor-pointer rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white"
                                        >
                                            Edit
                                        </Link>}
                                        {can('users.delete') && <button
                                            onClick={() => handleDelete(user.id)}
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
