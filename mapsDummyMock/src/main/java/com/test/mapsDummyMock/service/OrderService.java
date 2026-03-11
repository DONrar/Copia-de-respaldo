package com.test.mapsDummyMock.service;

import com.test.mapsDummyMock.entity.*;

import java.util.List;

public class OrderService {

    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    public OrderService(ProductService productService,
                        OrderRepository orderRepository,
                        NotificationService notificationService) {
        this.productService = productService;
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
    }

    public Order createOrder(Customer customer, List<OrderItem> items) {

        double subtotal = 0;
        double tax = 0;

        for (OrderItem item : items) {
            Product product = productService.findById(item.getProduct().getId());

            double itemTotal = product.getPrice() * item.getQuantity();
            subtotal += itemTotal;

            if (product.isTaxable()) {
                tax += itemTotal * 0.19;
            }
        }

        double discount = 0;
        if (customer.getType() == CustomerType.PREMIUM) {
            discount = subtotal * 0.10;
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setDiscount(discount);
        order.setTotal(subtotal + tax - discount);

        Order savedOrder = orderRepository.save(order);
        notificationService.sendOrderConfirmation(savedOrder);

        return savedOrder;
    }
}
