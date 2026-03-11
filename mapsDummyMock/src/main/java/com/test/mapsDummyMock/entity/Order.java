package com.test.mapsDummyMock.entity;

import java.util.List;

public class Order {
    private Long id;
    private Customer customer;
    private List<OrderItem> items;
    private double subtotal;
    private double tax;
    private double discount;
    private double total;

    public Order() {
    }

    public Order(Long id, Customer customer, List<OrderItem> items, double subtotal, double tax, double discount, double total) {
        this.id = id;
        this.customer = customer;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
