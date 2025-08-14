import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

// Bileşene gelecek olan izinlerin tipini tanımlayan arayüz.
// Controller'dan sadece isimleri (string dizisi) geldiği için string[] olarak belirtiyoruz.
interface CreateRoleProps {
    permissions: string[]; // Tüm mevcut izinlerin adları (örneğin ['users.view', 'roles.create'])
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Create',
        href: '/roles',
    },
];

// Bileşen, 'permissions' adında bir prop alır.
export default function Create({ permissions }: CreateRoleProps) {
    // useForm hook'unda 'name' ve seçilen izinler için boş bir dizi (permissions) tuttuk.
    // TypeScript'e 'data' nesnesinin yapısını ve tiplerini açıkça belirtmek için generic kullandık.
    const { data, setData, errors, post } = useForm<{ name: string; permissions: string[] }>({
        name: '',
        permissions: [], // Seçilen izinlerin adlarını tutacak dizi
    });

    // Checkbox durumunu güncelleyen fonksiyon.
    // 'permissionName' string, 'checked' boolean tipinde belirtildi.
    function handleCheckboxChange(permissionName: string, checked: boolean) {
        if (checked) {
            // Eğer checkbox işaretlendiyse, izin adını diziye ekle.
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            // Eğer checkbox işaretlenmediyse, izin adını diziden çıkar.
            setData('permissions', data.permissions.filter((p) => p !== permissionName));
        }
    }

    // Form gönderme işlemini yöneten fonksiyon.
    function Submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // 'roles.store' rotasına veri gönderiyoruz.
        post(route('roles.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="p-3">
                <Link href={route('roles.index')} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    Back
                </Link>
                <form onSubmit={Submit} className="mx-auto mt-4 max-w-md space-y-6">
                    {/* Rol Adı Alanı */}
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
                            placeholder="Enter role name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* İzinler Alanı */}
                    <div className="grid gap-2">
                        <label htmlFor="permissions" className="peer-dis text-sm leading-none font-medium select-none">
                            Permissions:
                        </label>
                        <div className="mt-1 grid grid-cols-2 gap-2 rounded-md border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-800">
                            {/* Gelen tüm izinler üzerinde döneriz */}
                            {permissions.map((permission) => (
                                <label key={permission} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="permissions[]" // Laravel'in dizi olarak alması için bu isim önemlidir
                                        value={permission}
                                        // Checkbox'ın seçili olup olmadığını kontrol ederiz
                                        checked={data.permissions.includes(permission)}
                                        onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                        id={permission} // Her checkbox için benzersiz ID
                                        className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-600"
                                    />
                                    {/* İzin adını gösteririz, Tailwind CSS ile metin rengi ve büyük harf ayarı */}
                                    <span className="capitalize text-gray-800 dark:text-gray-200">{permission}</span>
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <p className="mt-1 text-sm text-red-500">{errors.permissions}</p>}
                    </div>

                    <button type="submit" className="rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
