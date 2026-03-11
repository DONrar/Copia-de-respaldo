<?php

namespace App\Http\Controllers;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
     // Listar todos los clientes
     public function index()
     {
         return Cliente::all();
     }

     // Ver detalles de un cliente
     public function show($id)
     {
         $cliente = Cliente::with('deudas.detalles.producto')->find($id);

         if (!$cliente) {
             return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
         }

         return response()->json($cliente);
     }

     // Crear un cliente
     public function store(Request $request)
     {
         $request->validate([
             'nombre' => 'required|string',
             'telefono' => 'nullable|string',
             'direccion' => 'nullable|string',
         ]);

         $cliente = Cliente::create($request->all());

         return response()->json($cliente, 201);
     }

     // Actualizar un cliente
     public function update(Request $request, $id)
     {
         $cliente = Cliente::find($id);

         if (!$cliente) {
             return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
         }

         $cliente->update($request->all());

         return response()->json($cliente);
     }

     // Eliminar un cliente (opcional)
     public function destroy($id)
     {
         $cliente = Cliente::find($id);

         if (!$cliente) {
             return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
         }

         $cliente->delete();

         return response()->json(['mensaje' => 'Cliente eliminado']);
     }
}
