package com.giocoTelegram.totosanremoserver.repository;

import com.giocoTelegram.totosanremoserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    // Aggiungi questo metodo per trovare un utente tramite il suo token di reimpostazione password
    Optional<User> findByResetPasswordToken(String resetPasswordToken);

}
