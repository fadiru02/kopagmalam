<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $from = $request->date('from', now()->startOfMonth());
        $to = $request->date('to', now()->endOfDay());

        $summary = Order::whereBetween('created_at', [$from, $to])
            ->where('payment_status', 'paid')
            ->selectRaw('COUNT(*) as orders_count, COALESCE(SUM(total),0) as revenue, COALESCE(SUM(discount_total),0) as discount, COALESCE(SUM(tax_total),0) as tax')
            ->first();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'summary' => $summary,
        ]);
    }

    public function topProducts(Request $request)
    {
        $from = $request->date('from', now()->startOfMonth());
        $to = $request->date('to', now()->endOfDay());

        $items = OrderItem::select('product_id', 'name', DB::raw('SUM(qty) as qty_sold'), DB::raw('SUM(subtotal) as revenue'))
            ->whereHas('order', fn ($q) => $q->whereBetween('created_at', [$from, $to])->where('payment_status', 'paid'))
            ->groupBy('product_id', 'name')
            ->orderByDesc('qty_sold')
            ->limit($request->integer('limit', 10))
            ->get();

        return response()->json($items);
    }

    public function daily(Request $request)
    {
        $from = $request->date('from', now()->subDays(30));
        $to = $request->date('to', now()->endOfDay());

        $rows = Order::whereBetween('created_at', [$from, $to])
            ->where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json($rows);
    }
}
