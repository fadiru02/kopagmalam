<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PaymentSettings extends Settings
{
    public bool $cash_enabled = true;

    public bool $midtrans_enabled = true;

    public static function group(): string
    {
        return 'payment';
    }
}
