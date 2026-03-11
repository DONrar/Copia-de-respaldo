package com.test.logica_test.bases;

public class DiscountService {
    public Double aplicarDescuento(Double total){
        if (total < 0){
            throw new IllegalArgumentException("El total no puede ser negativo");
        }
        return total >= 100 ? total * 0.9 : total;
    }
}
