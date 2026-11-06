<?php

namespace Database\Seeders;

use App\Settings\GeneralSettings;
use App\Settings\PaymentSettings;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $general = app(GeneralSettings::class);
        $general->store_name = 'Kopag Malam';
        $general->store_address = 'Jl. Contoh No. 1';
        $general->store_phone = '08123456789';
        $general->tax_rate = 0;
        $general->currency = 'IDR';
        $general->save();

        $payment = app(PaymentSettings::class);
        $payment->cash_enabled = true;
        $payment->midtrans_enabled = true;
        $payment->save();
    }
}
