# Fix Edit Function in MyReports

## Plan Steps:
- [x] Step 1: Update SubmissionController::update method to return Inertia-compatible JSON response instead of redirect()

**Current Progress: Investigating why no save/no errors. Added more logging & route check. Check browser Network tab F12 for request/response to submissions/{id}.**
- [x] Step 2: Fixed all cases - success/no-changes now return full Inertia MyReports page with fresh data + flash messages.
- [ ] Step 3: Verify file upload works during edit
- [ ] Step 4: Check frontend reloads updated reports correctly
- [ ] Step 5: Complete task with attempt_completion

**Current Progress: Starting Step 1**
