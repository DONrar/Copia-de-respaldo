package com.test.mapsDummyMock.entity;

public class Customer {
    private Long id;
    private String name;
    private CustomerType type; // REGULAR, PREMIUM
    private Address address;

    public Customer() {
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", address=" + address +
                '}';
    }

    public Customer(Long id, String name, CustomerType type, Address address) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.address = address;
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

    public CustomerType getType() {
        return type;
    }

    public void setType(CustomerType type) {
        this.type = type;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}

