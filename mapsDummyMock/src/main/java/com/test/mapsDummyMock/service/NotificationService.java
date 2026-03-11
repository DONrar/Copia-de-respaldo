package com.test.mapsDummyMock.service;

import com.test.mapsDummyMock.entity.Order;

public interface NotificationService {
    void sendOrderConfirmation(Order order);
}
