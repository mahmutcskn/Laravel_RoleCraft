import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

// Define the expected structure of the 'auth' object within PageProps
interface AuthProps extends PageProps {
    auth: {
        user: any; // Kullanıcı objesinin tamamı (can() metodu backend'de kalır)
        permissions: string[]; // Bu, Laravel'den gelen izinler dizisidir.
    };
}

export function can(permission: string): boolean {
    // Call usePage() as a function to get the page object, then access its props.
    // We also cast it to our custom AuthProps to ensure TypeScript knows the structure.
    const { auth } = usePage<AuthProps>().props;
    
    // Ensure auth and auth.permissions exist before checking
    // İzinler dizisi doğrudan 'auth' objesinin altında.
    if (auth && auth.permissions) {
        return auth.permissions.includes(permission);
    }
    return false; // If auth or permissions are not available, assume no permission
}
