{{-- resources/views/emails/submission-status.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Submission {{ ucfirst($status) }}</title>
</head>
<body>
    <h1>Submission {{ ucfirst($status) }}</h1>

    <p>Dear {{ $submission->student->name }},</p>

    <p>Your report "{{ $submission->title }}" has been <strong>{{ $status }}</strong>.</p>

    @if($submission->feedback)
        <h3>Feedback:</h3>
        <p>{{ $submission->feedback }}</p>
    @endif

    <p>Thank you for using our system.</p>
</body>
</html>
