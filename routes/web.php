<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    

Route::resource('users', UserController::class)
    ->only(['create', 'store'])
    ->middleware('permission:users.create');

// 'edit' ve 'update' işlemleri için 'users.edit' izni gereklidir.
Route::resource('users', UserController::class)
    ->only(['edit', 'update'])
    ->middleware('permission:users.edit');

// 'destroy' işlemi için 'users.delete' izni gereklidir.
Route::resource('users', UserController::class)
    ->only(['destroy'])
    ->middleware('permission:users.delete');

// 'index' ve 'show' işlemleri için 'users.view' izni gereklidir.
// Ayrıca, 'users.create', 'users.edit', 'users.delete' izinlerine sahip olanlar da görebilir.
// Bu kısım, 'users.view' izni yoksa bile diğer izinlerden biri varsa erişim sağlar.
Route::resource('users', UserController::class)
    ->only(['index', 'show'])
    ->middleware('permission:users.view|users.create|users.edit|users.delete');
    
    


    
// Roller rotaları
// 'create' ve 'store' işlemleri için 'roles.create' izni gereklidir.
Route::resource('roles', RoleController::class)
    ->only(['create', 'store'])
    ->middleware('permission:roles.create');

// 'edit' ve 'update' işlemleri için 'roles.edit' izni gereklidir.
Route::resource('roles', RoleController::class)
    ->only(['edit', 'update'])
    ->middleware('permission:roles.edit');

// 'destroy' işlemi için 'roles.delete' izni gereklidir.
Route::resource('roles', RoleController::class)
    ->only(['destroy'])
    ->middleware('permission:roles.delete');

// 'index' ve 'show' işlemleri için 'roles.view' izni gereklidir.
// Ayrıca, 'roles.create', 'roles.edit', 'roles.delete' izinlerine sahip olanlar da görebilir.
// Bu kısım, 'roles.view' izni yoksa bile diğer izinlerden biri varsa erişim sağlar.
Route::resource('roles', RoleController::class)
    ->only(['index', 'show'])
    ->middleware('permission:roles.view|roles.create|roles.edit|roles.delete');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
