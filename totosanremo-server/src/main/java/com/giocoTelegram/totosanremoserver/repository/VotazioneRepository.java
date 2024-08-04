package com.giocoTelegram.totosanremoserver.repository;

import com.giocoTelegram.totosanremoserver.entity.Votazione;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VotazioneRepository extends JpaRepository<Votazione, Long> {
    // Qui potresti definire metodi personalizzati se necessario
    List<Votazione> findByTipo(String tipo);
    boolean existsByTipo(String tipo);

    Optional<Votazione> findByTipoAndAbilitata(String tipo, boolean abilitata);

    // Trova una votazione disabilitata di un dato tipo
    Optional<Votazione> findFirstByTipoAndAbilitata(String tipo, boolean abilitata);

    List<Votazione> findByAbilitataTrue();
    List<Votazione> findAllByAbilitata(boolean abilitata);



}

