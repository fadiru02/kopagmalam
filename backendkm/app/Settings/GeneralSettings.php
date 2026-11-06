<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $store_name = 'Kopag Malam';

    public ?string $store_address = null;

    public ?string $store_phone = null;

    public float $tax_rate = 0;

    public string $currency = 'IDR';

    public static function group(): string
    {
        return 'general';
    }
}
