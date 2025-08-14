<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Roles/Index", [
            // Tüm sütunları ve ilişkili izinleri çekmek için get() metodunu argümansız kullanıyoruz.
            'roles' => Role::with('permissions')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Roles/Create", [
            // Tüm izinlerin adlarını çekiyoruz.
            'permissions' => Permission::pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name', // Rol adının benzersizliğini kontrol edin
            'permissions' => 'nullable|array', // İzinler boş olabilir veya bir dizi olmalı
            'permissions.*' => 'exists:permissions,name', // Her iznin 'permissions' tablosunda var olduğunu kontrol edin
        ]);

        $role = Role::create(['name' => $request->name]);

        // İzinleri role atamak için syncPermissions kullanıyoruz.
        // Eğer 'permissions' boşsa veya hiç gönderilmezse, syncPermissions boş bir dizi ile çağrılır.
        $role->syncPermissions($request->input('permissions', []));

        return to_route('roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id); // İzinlerle birlikte rolü bul
        return Inertia::render('Roles/Show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id); // İzinlerle birlikte rolü bul
        $allPermissions = Permission::pluck('name'); // Tüm izinleri çek

        return Inertia::render("Roles/Edit", [
            'role' => $role,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id, // Güncelleme yaparken kendi adını hariç tut
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);

        // İzinleri güncellemek için syncPermissions kullanıyoruz.
        $role->syncPermissions($request->input('permissions', []));

        return to_route('roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete(); // Spatie paketi ile delete() metodu da kullanılabilir.
        return to_route('roles.index');
    }
}
