package com.test.mapsDummyMock;

import com.test.mapsDummyMock.service.NotificationService;
import com.test.mapsDummyMock.service.OrderRepository;
import com.test.mapsDummyMock.service.OrderService;
import com.test.mapsDummyMock.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class MapsDummyMockApplicationTests {

	@Mock
	NotificationService notificationService;

	@Mock
	OrderRepository orderRepository;

	@Mock
	ProductService productService;

	@InjectMocks
	OrderService orderService;



}
