<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionStatusMail extends Mailable
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
        return $this->markdown('emails.submission-status')
                    ->subject("Submission {$this->status} - OJT Report");
    }
}
