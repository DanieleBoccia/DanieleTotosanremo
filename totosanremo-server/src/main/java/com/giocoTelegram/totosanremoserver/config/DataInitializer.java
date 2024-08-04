package com.giocoTelegram.totosanremoserver.config;

import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.repository.VotazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.giocoTelegram.totosanremoserver.entity.Role;
import com.giocoTelegram.totosanremoserver.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private VotazioneRepository votazioneRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crea e salva i ruoli nel database, se non esistono già
        if (!roleRepository.existsByName("ROLE_USER")) {
            roleRepository.save(new Role("ROLE_USER"));
        }
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        if (!votazioneRepository.existsByTipo("PRE")) {
            Votazione preVotazione = new Votazione();
            preVotazione.setTipo("PRE");
            // Imposta altri campi necessari...
            votazioneRepository.save(preVotazione);
        }

        // Assicurati che esista una votazione POST
        if (!votazioneRepository.existsByTipo("POST")) {
            Votazione postVotazione = new Votazione();
            postVotazione.setTipo("POST");
            // Imposta altri campi necessari...
            votazioneRepository.save(postVotazione);
        }

        // Qui puoi aggiungere ulteriore logica per assegnare ruoli agli utenti
    }

}

