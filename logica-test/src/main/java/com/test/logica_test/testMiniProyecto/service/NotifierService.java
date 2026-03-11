package com.test.logica_test.testMiniProyecto.service;

import com.test.logica_test.testMiniProyecto.interfaz.EmailGateway;
import com.test.logica_test.testMiniProyecto.repository.UserRepository;

public class NotifierService {
    private final EmailGateway emailGateway;
    private final UserRepository userRepository;

    public NotifierService(EmailGateway emailGateway, UserRepository userRepository) {
        this.emailGateway = emailGateway;
        this.userRepository = userRepository;
    }

    public void notifyUser(String UserId, String message) {

       var user = userRepository.findById(UserId);
       if (user == null ){
           throw new RuntimeException("User not found");
       }
       emailGateway.send(user.email(), "notification", message);
    }
}
