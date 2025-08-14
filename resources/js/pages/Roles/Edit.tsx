import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

// İzin (Permission) verisinin yapısını tanımlayan arayüz.
interface Permission {
    id: number;
    name: string;
}

// Rol (Role) verisinin yapısını tanımlayan arayüz.
// Bu, düzenlenecek rolün kendisini temsil eder.
interface Role {
    id: number;
    name: string;
    permissions: Permission[]; // Rolün sahip olduğu mevcut izinler
}

// Bileşene gelen props'ların tipini tanımlayan arayüz.
interface EditRoleProps {
    role: Role;
    allPermissions: string[]; // Tüm mevcut izinlerin sadece isimleri (string dizisi)
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit Role',
        href: '#', // Geçerli sayfayı temsil eder, genellikle dinamik bir rota olmaz
    },
];

// Bileşen, 'role' ve 'allPermissions' adında iki prop alır.
export default function Edit({ role, allPermissions }: EditRoleProps) {

    // useForm hook'u ile form verilerini yönetiyoruz.
    const { data, setData, errors, patch } = useForm({
        name: role.name,
        // Rolün sahip olduğu izinlerin isimlerini bir dizi olarak başlangıç değeri olarak atıyoruz.
        permissions: role.permissions.map(p => p.name),
    });

    // Form gönderme işlemini yöneten fonksiyon.
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 'patch' metodunu kullanarak rolü güncelliyoruz.
        patch(route('roles.update', role.id));
    };

    // İzin checkbox'larının durumunu güncelleyen fonksiyon.
    // Bir checkbox işaretlendiğinde veya işareti kaldırıldığında çalışır.
    const handlePermissionChange = (permissionName: string, isChecked: boolean) => {
        setData(prevData => {
            const newPermissions = isChecked
                ? [...prevData.permissions, permissionName] // İşaretlendiyse ekle
                : prevData.permissions.filter(p => p !== permissionName); // İşareti kaldırıldıysa çıkar

            return {
                ...prevData,
                permissions: newPermissions,
            };
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name}`} />

            <div className="p-3">
                <Link href={route('roles.index')} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Back
                </Link>

                <form onSubmit={handleSubmit} className="mx-auto mt-4 max-w-md space-y-6">
                    {/* Rol Adı Alanı */}
                    <div className="grid gap-2">
                        <label htmlFor="name" className="peer-dis text-sm leading-none font-medium select-none">
                            Role Name:
                        </label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            placeholder="Enter role name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* İzinler Alanı */}
                    <div className="grid gap-2">
                        <label className="peer-dis text-sm leading-none font-medium select-none">
                            Permissions:
                        </label>
                        <div className="mt-1 grid grid-cols-2 gap-2 rounded-md border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-800">
                            {allPermissions.map((permissionName) => (
                                <label key={permissionName} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="permissions[]" // Laravel'in dizi olarak alması için
                                        value={permissionName}
                                        checked={data.permissions.includes(permissionName)} // Rolün bu izne sahip olup olmadığını kontrol et
                                        onChange={(e) => handlePermissionChange(permissionName, e.target.checked)}
                                        className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-600"
                                    />
                                    <span className="capitalize text-gray-800 dark:text-gray-200">{permissionName}</span>
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <p className="mt-1 text-sm text-red-500">{errors.permissions}</p>}
                    </div>

                    {/* Güncelle Butonu */}
                    <button type="submit" className="rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-700">
                        Update Role
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
