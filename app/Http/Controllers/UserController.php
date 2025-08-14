<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role; // Spatie Role modelini import ettik

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Kullanıcıları çekerken, ilişkili rolleri de yüklüyoruz.
        return Inertia::render("Users/Index", [
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Tüm mevcut rolleri 'Create' sayfasına gönderiyoruz.
        return Inertia::render("Users/Create", [
            'allRoles' => Role::pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email', // Email benzersiz olmalı
            'password' => 'required|string|min:8', // Şifre minimum 8 karakter
            'roles' => 'nullable|array', // Roller boş olabilir veya bir dizi olmalı
            'roles.*' => 'exists:roles,name', // Her rolün 'roles' tablosunda var olduğunu kontrol et
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Seçilen rolleri kullanıcıya atıyoruz.
        // Eğer 'roles' boşsa veya hiç gönderilmezse, syncRoles boş bir dizi ile çağrılır.
        $user->syncRoles($request->input('roles', []));

        return to_route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Kullanıcıyı ilişkili rolleriyle birlikte buluyoruz.
        $user = User::with('roles')->findOrFail($id);
        return Inertia::render('Users/Show', [
            "user" => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Kullanıcıyı ilişkili rolleriyle birlikte buluyoruz.
        $user = User::with('roles')->findOrFail($id);
        // Tüm mevcut rolleri de gönderiyoruz.
        $allRoles = Role::pluck('name');

        return Inertia::render("Users/Edit", [
            'user' => $user,
            'allRoles' => $allRoles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id, // Email güncellenirken kendi email'ini hariç tut
            'password' => 'nullable|string|min:8', // Şifre boş olabilir, eğer varsa min 8 karakter
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // Seçilen rolleri kullanıcıya güncelliyoruz.
        $user->syncRoles($request->input('roles', []));

        return to_route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::destroy($id);
        return to_route('users.index');
    }
}
