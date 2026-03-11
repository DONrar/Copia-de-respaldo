package com.test.mapsDummyMock.entity;

public class Product {
    private Long id;
    private String name;
    private double price;
    private boolean taxable;

    public Product() {
    }

    public Product(Long id, String name, double price, boolean taxable) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.taxable = taxable;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isTaxable() {
        return taxable;
    }

    public void setTaxable(boolean taxable) {
        this.taxable = taxable;
    }
}
