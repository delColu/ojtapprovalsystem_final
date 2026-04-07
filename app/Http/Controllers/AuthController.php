<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            ActivityLog::create([
                'user_id'    => $user->id,
                'action'     => 'login',
                'status'     => 'success',
                'details'    => 'User logged in',
                'ip_address' => $request->ip(),
            ]);

            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'email' => 'Invalid credentials',
        ]);
    }

    public function logout(Request $request)
    {
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'logout',
            'status'     => 'success',
            'details'    => 'User logged out',
            'ip_address' => $request->ip(),
        ]);

        Auth::logout();

        return redirect('/');
    }
}
