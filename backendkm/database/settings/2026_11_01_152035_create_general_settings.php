<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.store_name', 'Kopag Malam');
        $this->migrator->add('general.store_address', 'Jl. Contoh No. 1');
        $this->migrator->add('general.store_phone', '08123456789');
        $this->migrator->add('general.tax_rate', 0);
        $this->migrator->add('general.currency', 'IDR');
    }
};
