package com.giocoTelegram.totosanremoserver.repository;

import com.giocoTelegram.totosanremoserver.entity.ConfirmationToken;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface ConfirmationTokenRepository extends CrudRepository<ConfirmationToken, Long> {
    Optional<ConfirmationToken> findByToken(String token);
    Optional<ConfirmationToken> findTopByUserEmailOrderByCreatedAtDesc(String email);

}

