<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['order_number', 'customer_id', 'user_id', 'coupon_id', 'status', 'payment_status', 'payment_method', 'subtotal', 'discount_total', 'tax_total', 'total', 'paid_amount', 'change_amount', 'notes', 'table_number', 'midtrans_order_id', 'midtrans_snap_token', 'midtrans_transaction_id', 'paid_at', 'cancelled_at'])]
class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'change_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }
}
