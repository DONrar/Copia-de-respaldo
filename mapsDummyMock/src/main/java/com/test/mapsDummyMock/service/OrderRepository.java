package com.test.mapsDummyMock.service;

import com.test.mapsDummyMock.entity.Order;

public interface OrderRepository {
    Order save(Order order);
}
