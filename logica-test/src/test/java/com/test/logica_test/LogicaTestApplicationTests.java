package com.test.logica_test;

import com.test.logica_test.bases.DiscountService;
import com.test.logica_test.testMiniProyecto.User;
import com.test.logica_test.testMiniProyecto.interfaz.EmailGateway;
import com.test.logica_test.testMiniProyecto.repository.UserRepository;
import com.test.logica_test.testMiniProyecto.service.NotifierService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
@SpringBootTest
class LogicaTestApplicationTests {

	@Mock
	UserRepository repo;

	@Mock
	EmailGateway email;
	@InjectMocks
	NotifierService service;

	@Test
	void aplicarDescuentoCuandoTrue() {
		// Arrange
		DiscountService service = new DiscountService();

		Double resultado = service.aplicarDescuento(100.0);
		// Assert
		assertEquals(180.0, resultado, 	0.0001);
	}

	@Test
	void exceptionCuandoNegativo() {
		// Arrange - Preparamos
		DiscountService service = new DiscountService();

		// Act & Assert - Actuamos y Verificamos
		assertThrows(IllegalArgumentException.class, () -> {
			service.aplicarDescuento(-50.0);
		});
	}



	@Test
	void notifyUser_shouldSendEmail_toUserEmail() {
		// Arrange
		when(repo.findById("u1")).thenReturn(new User("u1", "a@b.com"));

		// Act
		service.notifyUser("u1", "hola");

		// Assert: se llamó send con los argumentos esperados
		verify(email).send("a@b.com", "Notification", "hola");
		verifyNoMoreInteractions(email);
	}

	@Test
	void notifyUser_shouldFail_whenUserNotFound() {
		when(repo.findById("missing")).thenReturn(null);

		assertThatThrownBy(() -> service.notifyUser("missing", "msg"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("User not found");

		verifyNoInteractions(email); // nunca se envía correo
	}


}
