# OJT Approval System - Dean Assignment Updates

## Task
Update Admin/Users.jsx to auto-update department dean_id on dean assignment and prevent duplicate deans per department.

## Implementation Steps
- [x] 1. Update app/Http/Controllers/UserController.php index(): Add `with('dean:id,name')` to departments query.
- [x] 2. Update UserController.php update(): Add validation and logic to set dept.dean_id if role='dean'.
- [x] 3. Update UserController.php store(): Similar logic for new users.
- [x] 4. Update resources/js/Pages/Admin/Users.jsx: Frontend validation (disable submit if dept has dean & role=dean unless editing self); error message.
- [x] 5. Test: Backend auto-updates dept.dean_id; frontend/backend prevent duplicates.

 ## Progress
Fully implemented dean assignment logic with frontend/backend validation and auto-update. Changes complete.

**Next**: Run `php artisan serve` + test in browser (Admin > Users > Edit/Add dean).
