<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomRegisterController;
use App\Http\Controllers\ReportController;

// Welcome page
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Custom registration routes
Route::get('/register', [CustomRegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [CustomRegisterController::class, 'register']);

// Custom login routes
Route::get('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);

// Logout route
Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Dashboard route (protected)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Protected routes
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // My Reports route
    Route::get('/my-reports', [ReportController::class, 'myReports'])->name('my-reports');

    // Submit Reports route (MUST BE OUTSIDE submissions prefix)
    Route::get('/submit-reports', [DashboardController::class, 'submitReports'])->name('submit-reports');

    // Submissions routes
    Route::prefix('submissions')->group(function () {
        Route::post('/', [SubmissionController::class, 'store'])->name('submissions.store');
        Route::put('/{submission}', [SubmissionController::class, 'update'])->name('submissions.update');
        Route::delete('/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
        Route::post('/{submission}/approve', [SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('/{submission}/reject', [SubmissionController::class, 'reject'])->name('submissions.reject');
        Route::get('/{submission}/download-pdf', [SubmissionController::class, 'downloadPdf'])->name('submissions.download-pdf');
        Route::get('/{submission}', [SubmissionController::class, 'show'])->name('submissions.show');
    });

    // Folders routes
    Route::resource('folders', FolderController::class);

    // Admin routes
    Route::prefix('admin')->middleware(['auth'])->group(function () {
        Route::resource('users', UserController::class);
        Route::get('/users/export-pdf', [UserController::class, 'exportPdf'])->name('admin.users.export-pdf');
        Route::get('/reports', [UserController::class, 'reports'])->name('admin.reports.index');
    });
});

// Note: Default auth routes are commented out to avoid conflicts
// require __DIR__.'/auth.php';
