package com.giocoTelegram.totosanremoserver.repository;

import com.giocoTelegram.totosanremoserver.dto.EmailRequestStatus;
import com.giocoTelegram.totosanremoserver.entity.EmailApprovata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailApprovataRepository extends JpaRepository<EmailApprovata, Long> {
    boolean existsByEmail(String email);
    Optional<EmailApprovata> findByEmail(String email); // Add this line
    List<EmailApprovata> findEmailRequestsByStatus(EmailRequestStatus status);
    Optional<EmailApprovata> findByEmailAndStatus(String email, EmailRequestStatus status); // Aggiungi questa linea

}

