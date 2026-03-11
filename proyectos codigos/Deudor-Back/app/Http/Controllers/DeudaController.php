<?php

namespace App\Http\Controllers;

use App\Models\Deuda;
use App\Models\Cliente;
use App\Models\DetalleDeuda;
use Illuminate\Http\Request;

class DeudaController extends Controller
{
    // Listar deudas de un cliente
    public function listarDeudasPorCliente($cliente_id)
    {
        $cliente = Cliente::with('deudas')->find($cliente_id);

        if (!$cliente) {
            return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
        }

        return response()->json($cliente->deudas);
    }

    // Crear una deuda para un cliente con productos asociados
    public function crearDeuda(Request $request, $cliente_id)
    {
        $request->validate([
            'fecha' => 'required|date',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1'
        ]);

        $cliente = Cliente::find($cliente_id);
        if (!$cliente) {
            return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
        }

        // Calcular total
        $total = 0;
        foreach ($request->productos as $item) {
            $producto = \App\Models\Producto::find($item['producto_id']);
            $subtotal = $producto->precio_unitario * $item['cantidad'];
            $total += $subtotal;
        }

        // Crear la deuda
        $deuda = Deuda::create([
            'cliente_id' => $cliente_id,
            'fecha' => $request->fecha,
            'total' => $total
        ]);

        // Crear los detalles de la deuda
        foreach ($request->productos as $item) {
            $producto = \App\Models\Producto::find($item['producto_id']);
            $subtotal = $producto->precio_unitario * $item['cantidad'];

            DetalleDeuda::create([
                'deuda_id' => $deuda->id,
                'producto_id' => $producto->id,
                'cantidad' => $item['cantidad'],
                'subtotal' => $subtotal
            ]);
        }

        return response()->json(['mensaje' => 'Deuda registrada correctamente', 'deuda' => $deuda], 201);
    }

    // Ver detalle de una deuda específica (con productos)
    public function verDetalleDeuda($id)
    {
        $deuda = Deuda::with('cliente', 'detalles.producto')->find($id);

        if (!$deuda) {
            return response()->json(['mensaje' => 'Deuda no encontrada'], 404);
        }

        return response()->json($deuda);
    }
}
