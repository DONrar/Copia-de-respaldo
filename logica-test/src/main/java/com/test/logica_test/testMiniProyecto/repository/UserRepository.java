package com.test.logica_test.testMiniProyecto.repository;

import com.test.logica_test.testMiniProyecto.User;

public interface UserRepository {
    User findById(String id);
}
