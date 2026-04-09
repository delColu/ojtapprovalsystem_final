<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $submission;
    public $status;

    public function __construct(Submission $submission, $status)
    {
        $this->submission = $submission;
        $this->status = $status;
    }

    public function build()
    {
        $subject = match ($this->status) {
            'approved_by_supervisor' => 'Supervisor Approved Your OJT Report',
            'approved_by_dean' => 'Dean Approved Your OJT Report',
            'rejected_by_supervisor' => 'Supervisor Rejected Your OJT Report',
            'rejected_by_dean' => 'Dean Rejected Your OJT Report',
            default => "Submission {$this->status} - OJT Report",
        };

        return $this->view('emails.submission-status')
                    ->subject($subject);
    }
}
