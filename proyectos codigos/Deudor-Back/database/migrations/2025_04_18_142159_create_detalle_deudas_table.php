<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detalle_deudas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deuda_id')->constrained('deudas')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->integer('cantidad');
            $table->decimal('subtotal', 10, 2); // precio_unitario * cantidad
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('detalle_deudas');
    }
};
