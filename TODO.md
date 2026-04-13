# OJT Approval System - Make Dean Companies page match other Dean tables style

## Task Overview
Convert the table in `resources/js/Pages/Dean/Companies.jsx` to a card-grid layout matching the visual style of other Dean pages (Supervisors.jsx, Departments.jsx): blue theme (bg-[#0077b6]), PageIntro header, SearchField filters, rounded-2xl gradient cards, hover effects, StatusBadge, stats cards.

Current status: [ ] Not started

## Step-by-Step Plan

### Step 1: Update imports and layout structure
- [ ] Import DeanShared components (PageIntro, SearchField, StatusBadge, EmptyState)
- [ ] Change container to Dean standard: space-y-8 bg-[#0077b6] px-4 pt-6 pb-0 sm:px-6 lg:px-8
- [ ] Replace header with PageIntro

### Step 2: Update filters to Dean style
- [ ] Replace TextInput with SearchField
- [ ] Style checkbox filter to match DeanShared (rounded-xl blue focus)

### Step 3: Replace table with card grid
- [ ] Add EmptyState for no companies
- [ ] Create responsive grid: lg:grid-cols-2 xl:grid-cols-3
- [ ] Design cards: gradient bg, sky borders, avatar initial, name+#badge, address detail, students stat card, StatusBadge, View button

### Step 4: Remove table code
- [ ] Delete table, thead, tbody, TableHeading usage

### Step 5: Test and verify
- [ ] Run `npm run dev`
- [ ] Check Dean/Companies page matches style
- [ ] Mark complete and attempt_completion

**Next step:** Step 1
