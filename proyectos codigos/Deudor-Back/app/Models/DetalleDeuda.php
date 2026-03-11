<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleDeuda extends Model
{
    protected $fillable = ['deuda_id', 'producto_id', 'cantidad', 'subtotal'];

    public function deuda()
    {
        return $this->belongsTo(Deuda::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
