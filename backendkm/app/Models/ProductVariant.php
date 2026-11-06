<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['product_id', 'name', 'sku', 'price', 'cost', 'stock', 'attributes', 'is_active'])]
class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'cost' => 'decimal:2',
            'stock' => 'integer',
            'attributes' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function effectivePrice(): float
    {
        return (float) ($this->price ?? $this->product?->price ?? 0);
    }

    public function effectiveCost(): float
    {
        return (float) ($this->cost ?? $this->product?->cost ?? 0);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
