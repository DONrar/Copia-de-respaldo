<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DeudaController;

Route::apiResource('clientes', ClienteController::class);
Route::get('clientes/{id}/deudas', [DeudaController::class, 'listarDeudasPorCliente']);
Route::post('clientes/{id}/deudas', [DeudaController::class, 'crearDeuda']);
Route::get('deudas/{id}', [DeudaController::class, 'verDetalleDeuda']);
