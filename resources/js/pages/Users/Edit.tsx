import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

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
    roles: Role[]; // Kullanıcının sahip olduğu mevcut roller
}

// Bileşene gelen props'ların tipini tanımlayan arayüz.
interface EditUserProps {
    user: User;
    allRoles: string[]; // Tüm mevcut rollerin sadece isimleri (string dizisi)
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

// Bileşen, 'user' ve 'allRoles' adında iki prop alır.
export default function Edit({ user, allRoles }: EditUserProps) {

    // useForm hook'u ile form verilerini yönetiyoruz.
    const { data, setData, errors, patch } = useForm({
        name: user.name,
        email: user.email,
        password: '', // Şifre boş olabilir, güncellenmezse gönderilmez
        // Kullanıcının sahip olduğu rollerin isimlerini bir dizi olarak başlangıç değeri olarak atıyoruz.
        roles: user.roles.map(r => r.name),
    });

    // Form gönderme işlemini yöneten fonksiyon.
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 'patch' metodunu kullanarak kullanıcıyı güncelliyoruz.
        patch(route('users.update', user.id));
    };

    // Rol checkbox'larının durumunu güncelleyen fonksiyon.
    const handleRoleChange = (roleName: string, checked: boolean) => {
        setData(prevData => {
            const newRoles = checked
                ? [...prevData.roles, roleName] // İşaretlendiyse ekle
                : prevData.roles.filter(r => r !== roleName); // İşareti kaldırıldıysa çıkar

            return {
                ...prevData,
                roles: newRoles,
            };
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />

            <div className="p-3">
                <Link href={route('users.index')} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Back
                </Link>

                <form onSubmit={handleSubmit} className="mx-auto mt-4 max-w-md space-y-6">
                    {/* Name Alanı */}
                    <div className="grid gap-2">
                        <label htmlFor="name" className="peer-dis text-sm leading-none font-medium select-none">
                            Name:
                        </label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            placeholder="Enter user name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email Alanı */}
                    <div className="grid gap-2">
                        <label htmlFor="email" className="peer-dis text-sm leading-none font-medium select-none">
                            Email :
                        </label>
                        <input
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            name="email"
                            type='email'
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            placeholder="Enter user email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Alanı */}
                    <div className="grid gap-2">
                        <label htmlFor="password" className="peer-dis text-sm leading-none font-medium select-none">
                            Password :
                        </label>
                        <input
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            name="password"
                            type='password'
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            placeholder="Enter a new password (optional)"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Roller Alanı */}
                    <div className="grid gap-2">
                        <label className="peer-dis text-sm leading-none font-medium select-none">
                            Roles:
                        </label>
                        <div className="mt-1 grid grid-cols-2 gap-2 rounded-md border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-800">
                            {allRoles.map((roleName) => (
                                <label key={roleName} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="roles[]"
                                        value={roleName}
                                        checked={data.roles.includes(roleName)} // Kullanıcının bu role sahip olup olmadığını kontrol et
                                        onChange={(e) => handleRoleChange(roleName, e.target.checked)}
                                        id={`role-${roleName}`}
                                        className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-600"
                                    />
                                    <span className="capitalize text-gray-800 dark:text-gray-200">{roleName}</span>
                                </label>
                            ))}
                        </div>
                        {errors.roles && <p className="mt-1 text-sm text-red-500">{errors.roles}</p>}
                    </div>

                    <button type="submit" className="rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-700">
                        Update User
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
