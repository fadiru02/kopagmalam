<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = QueryBuilder::for(Customer::class)
            ->allowedFilters('name', 'email', 'phone')
            ->allowedSorts('', '')
            ->defaultSort('name')
            ->paginate($request->integer('per_page', 15));

        return response()->json($customers);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer->load(['user', 'orders']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:customers,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
        ]);

        $customer = Customer::create($data);

        return response()->json($customer, 201);
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:customers,email,'.$customer->id],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'loyalty_points' => ['nullable', 'integer', 'min:0'],
        ]);

        $customer->update($data);

        return response()->json($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json(['message' => 'Customer deleted.']);
    }
}
