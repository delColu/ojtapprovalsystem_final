<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dean Reports</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; }
        h1 { margin-bottom: 4px; }
        p { margin-top: 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Dean Report Registry</h1>
    <p>Dean: {{ $dean->name }}</p>

    <table>
        <thead>
            <tr>
                <th>Intern</th>
                <th>Report</th>
                <th>Folder</th>
                <th>Status</th>
                <th>Supervisor</th>
                <th>Supervisor Approved</th>
                <th>Dean Review</th>
            </tr>
        </thead>
        <tbody>
            @forelse($submissions as $submission)
                <tr>
                    <td>{{ $submission->student?->name }}</td>
                    <td>{{ $submission->title }}</td>
                    <td>{{ $submission->folder?->name }}</td>
                    <td>{{ ucfirst($submission->status) }}</td>
                    <td>{{ $submission->supervisor?->name ?? 'N/A' }}</td>
                    <td>{{ optional($submission->supervisor_approved_at)->format('F d, Y h:i A') ?? 'N/A' }}</td>
                    <td>{{ optional($submission->dean_reviewed_at)->format('F d, Y h:i A') ?? 'Pending' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7">No reports available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
