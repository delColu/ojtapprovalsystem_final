<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Supervisor Intern List</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; }
        h1 { margin-bottom: 4px; }
        p { margin-top: 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Intern List</h1>
    <p>Supervisor: {{ $supervisor->name }}</p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Company</th>
                <th>Submissions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($interns as $intern)
                <tr>
                    <td>{{ $intern['name'] }}</td>
                    <td>{{ $intern['email'] }}</td>
                    <td>{{ $intern['student_id'] ?: 'N/A' }}</td>
                    <td>{{ $intern['department'] ?: 'N/A' }}</td>
                    <td>{{ $intern['company'] ?: 'N/A' }}</td>
                    <td>{{ $intern['submissions_count'] ?? 0 }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6">No interns found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
