<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('payment.cash_enabled', true);
        $this->migrator->add('payment.midtrans_enabled', true);
    }
};
