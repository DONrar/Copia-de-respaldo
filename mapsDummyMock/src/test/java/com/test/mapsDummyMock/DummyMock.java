package com.test.mapsDummyMock;

import com.test.mapsDummyMock.entity.Address;
import com.test.mapsDummyMock.entity.Customer;

public class DummyMock {

    private Customer buildCustomer() {

        Address address = new Address();
        address.setCity("city");
        address.setStreet("street");
        address.setCountry("country");

        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("name");
        customer.setAddress(address);
        return customer;

    }
}
