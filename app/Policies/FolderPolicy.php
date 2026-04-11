<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FolderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSupervisor() || $user->isStudent();
    }

    /**
     * Determine whether the user can view the Folder model.
     */
    public function view(User $user, Folder $folder): bool
    {
        if ($user->isSupervisor()) {
            return $folder->supervisor_id === $user->id;
        }

        if ($user->isStudent()) {
            $supervisorQuery = $folder->supervisor();
            return $supervisorQuery
                ->where('department_id', $user->getAttribute('department_id'))
                ->where('company_id', $user->getAttribute('company_id'))
                ->exists();
        }
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isSupervisor();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Folder $folder): bool
    {
        if ($user->isSupervisor()) {
            return $folder->supervisor_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Folder $folder): bool
    {
        if ($user->isSupervisor()) {
            return $folder->supervisor_id === $user->id;
        }

        return false;
    }
}


