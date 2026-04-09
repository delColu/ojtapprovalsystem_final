<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OJT Report Status Update</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
@php
    $statusMap = match ($status) {
        'approved_by_supervisor' => ['label' => 'Approved by Supervisor', 'color' => '#166534', 'bg' => '#dcfce7'],
        'approved_by_dean' => ['label' => 'Approved by Dean', 'color' => '#1d4ed8', 'bg' => '#dbeafe'],
        'rejected_by_supervisor' => ['label' => 'Rejected by Supervisor', 'color' => '#b91c1c', 'bg' => '#fee2e2'],
        'rejected_by_dean' => ['label' => 'Rejected by Dean', 'color' => '#b91c1c', 'bg' => '#fee2e2'],
        default => ['label' => 'Status Updated', 'color' => '#7c2d12', 'bg' => '#ffedd5'],
    };

    $headline = match ($status) {
        'approved_by_supervisor' => 'Your report was approved by your supervisor',
        'approved_by_dean' => 'Your report received final dean approval',
        'rejected_by_supervisor' => 'Your report was returned by your supervisor',
        'rejected_by_dean' => 'Your report was returned by the dean',
        default => 'Your report status has been updated',
    };

    $reviewer = $status === 'approved_by_dean' || $status === 'rejected_by_dean'
        ? ($submission->dean->name ?? 'Dean')
        : ($submission->supervisor->name ?? 'Supervisor');

    $reviewedAt = $status === 'approved_by_dean' || $status === 'rejected_by_dean'
        ? (optional($submission->dean_reviewed_at)->format('F d, Y h:i A') ?? optional($submission->approved_at)->format('F d, Y h:i A'))
        : (optional($submission->supervisor_approved_at)->format('F d, Y h:i A') ?? optional($submission->approved_at)->format('F d, Y h:i A') ?? optional($submission->rejected_at)->format('F d, Y h:i A'));
@endphp

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f7fb; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 30px rgba(15, 23, 42, 0.08);">
                    <tr>
                        <td style="background:linear-gradient(135deg, #be185d 0%, #db2777 100%); padding:28px 32px; color:#ffffff;">
                            <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; opacity:0.85; font-weight:bold;">OJT Report Update</div>
                            <h1 style="margin:10px 0 8px; font-size:28px; line-height:1.2;">{{ $headline }}</h1>
                            <p style="margin:0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.88);">
                                Hello {{ $submission->student->name }}, here is the latest update for your submitted report.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:32px;">
                            <div style="margin-bottom:24px;">
                                <span style="display:inline-block; padding:8px 14px; border-radius:999px; background-color:{{ $statusMap['bg'] }}; color:{{ $statusMap['color'] }}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">
                                    {{ $statusMap['label'] }}
                                </span>
                            </div>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px 24px; background-color:#fafafa;">
                                        <div style="font-size:13px; color:#6b7280; margin-bottom:6px;">Report Title</div>
                                        <div style="font-size:20px; font-weight:700; color:#111827;">{{ $submission->title }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0 24px 20px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="padding-top:16px; width:50%;">
                                                    <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Folder</div>
                                                    <div style="font-size:14px; color:#111827; font-weight:600;">{{ $submission->folder->name ?? 'No Folder' }}</div>
                                                </td>
                                                <td style="padding-top:16px; width:50%;">
                                                    <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Submitted</div>
                                                    <div style="font-size:14px; color:#111827; font-weight:600;">{{ optional($submission->submitted_at)->format('F d, Y h:i A') ?? 'N/A' }}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top:16px; width:50%;">
                                                    <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Reviewed By</div>
                                                    <div style="font-size:14px; color:#111827; font-weight:600;">{{ $reviewer }}</div>
                                                </td>
                                                <td style="padding-top:16px; width:50%;">
                                                    <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Review Date</div>
                                                    <div style="font-size:14px; color:#111827; font-weight:600;">{{ $reviewedAt ?? 'Pending' }}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @if($status === 'approved_by_supervisor')
                                <div style="margin-bottom:20px; border-radius:16px; background-color:#fef3c7; padding:18px 20px;">
                                    <div style="font-size:15px; font-weight:700; color:#92400e; margin-bottom:6px;">Next Step</div>
                                    <div style="font-size:14px; line-height:1.7; color:#78350f;">
                                        Your supervisor approved this report. You may now log in and use the <strong>Submit to Dean</strong> action for final review.
                                    </div>
                                </div>
                            @elseif($status === 'approved_by_dean')
                                <div style="margin-bottom:20px; border-radius:16px; background-color:#dbeafe; padding:18px 20px;">
                                    <div style="font-size:15px; font-weight:700; color:#1d4ed8; margin-bottom:6px;">Final Confirmation</div>
                                    <div style="font-size:14px; line-height:1.7; color:#1e40af;">
                                        Your report has completed the full approval process. No further action is required for this submission.
                                    </div>
                                </div>
                            @endif

                            @if($submission->feedback)
                                <div style="margin-bottom:24px; border-radius:16px; border:1px solid #e5e7eb; background-color:#f9fafb; padding:20px;">
                                    <div style="font-size:15px; font-weight:700; color:#111827; margin-bottom:10px;">Feedback</div>
                                    <div style="font-size:14px; line-height:1.8; color:#374151;">
                                        {{ $submission->feedback }}
                                    </div>
                                </div>
                            @endif

                            <div style="font-size:14px; line-height:1.8; color:#4b5563;">
                                Please keep this email as part of your submission record. You may also log in to the OJT system to review the latest report details and attached proof.
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:20px 32px; border-top:1px solid #f3f4f6; background-color:#fafafa; text-align:center;">
                            <div style="font-size:12px; color:#9ca3af;">OJT Tracking System</div>
                            <div style="font-size:12px; color:#9ca3af; margin-top:6px;">This is an automated email notification for your internship report workflow.</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
