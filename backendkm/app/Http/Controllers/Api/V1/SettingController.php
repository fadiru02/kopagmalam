<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Settings\GeneralSettings;
use App\Settings\PaymentSettings;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        $g = (new GeneralSettings)->refresh();
        $p = (new PaymentSettings)->refresh();

        return response()->json([
            'general' => $g,
            'payment' => $p,
        ]);
    }

    public function updateGeneral(Request $request, GeneralSettings $settings)
    {
        $settings->refresh();
        $data = $request->validate([
            'store_name' => ['sometimes', 'string', 'max:255'],
            'store_address' => ['nullable', 'string'],
            'store_phone' => ['nullable', 'string', 'max:30'],
            'tax_rate' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        foreach ($data as $key => $value) {
            $settings->{$key} = $value;
        }
        $settings->save();

        return response()->json($settings);
    }

    public function updatePayment(Request $request, PaymentSettings $settings)
    {
        $settings->refresh();
        $data = $request->validate([
            'cash_enabled' => ['nullable', 'boolean'],
            'midtrans_enabled' => ['nullable', 'boolean'],
        ]);

        foreach ($data as $key => $value) {
            $settings->{$key} = $value;
        }
        $settings->save();

        return response()->json($settings);
    }
}
