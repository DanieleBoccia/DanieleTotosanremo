package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.dto.VotazioneDataDTO;
import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.repository.VotazioneRepository;
import com.giocoTelegram.totosanremoserver.service.SchedulerService;
import com.giocoTelegram.totosanremoserver.service.VotazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@RestController
@RequestMapping("/api/admin/votazioni")
public class AdminVotazioneController {

    private static final Logger logger = LoggerFactory.getLogger(PublicVotazioneController.class);

    @Autowired
    private VotazioneService votazioneService;

    @Autowired
    private VotazioneRepository votazioneRepository;

    @Autowired
    private SchedulerService schedulerService;



    @PostMapping("/toggle/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> toggleStatoVotazione(@PathVariable String tipo) {
        Optional<Votazione> votazioneOpzionale = votazioneRepository.findByTipoAndAbilitata(tipo, true);

        if (votazioneOpzionale.isPresent()) {
            Votazione votazione = votazioneOpzionale.get();
            votazione.setAbilitata(false); // Disabilita se già abilitata
            votazioneRepository.save(votazione);
            return ResponseEntity.ok(Map.of("isAbilitata", false));
        } else {
            Optional<Votazione> votazioneDaAbilitare = votazioneRepository
                    .findByTipoAndAbilitata(tipo, false)
                    .stream()
                    .findFirst();

            if (votazioneDaAbilitare.isPresent()) {
                Votazione votazione = votazioneDaAbilitare.get();
                votazione.setAbilitata(true); // Abilita se trovata disabilitata
                votazioneRepository.save(votazione);
                return ResponseEntity.ok(Map.of("isAbilitata", true));
            } else {
                // Se nessuna votazione è trovata, presumibilmente potresti voler creare una nuova
                // votazione o gestire questo caso come errore.
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("errore", "Nessuna votazione trovata per il tipo: " + tipo));
            }
        }
    }

    @PostMapping("/impostaDate/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> impostaDateVotazione(@PathVariable String tipo, @RequestBody VotazioneDataDTO dateDTO) {
        System.out.println("Ricevuto richiesta per impostare date votazione di tipo: " + tipo);
        System.out.println("Data inizio ricevuta: " + dateDTO.getDataInizio());
        System.out.println("Data fine ricevuta: " + dateDTO.getDataFine());

        OffsetDateTime oraCorrente = OffsetDateTime.now();
        System.out.println("Ora corrente: " + oraCorrente);

        if (dateDTO.getDataInizio().isAfter(dateDTO.getDataFine())) {
            return ResponseEntity.badRequest().body(Map.of("errore", "La data di inizio deve essere prima della data di fine."));
        }

        if (dateDTO.getDataInizio().isBefore(oraCorrente) || dateDTO.getDataFine().isBefore(oraCorrente)) {
            return ResponseEntity.badRequest().body(Map.of("errore", "Le date devono essere nel futuro."));
        }

        try {
            Optional<Votazione> votazioneOpzionale = votazioneRepository.findByTipo(tipo).stream().findFirst();
            if (votazioneOpzionale.isPresent()) {
                Votazione votazione = votazioneOpzionale.get();

                // Convertito OffsetDateTime in ZonedDateTime con fuso orario Europe/Rome e poi in LocalDateTime
                ZonedDateTime dataInizioZoned = dateDTO.getDataInizio().atZoneSameInstant(ZoneId.of("Europe/Rome"));
                ZonedDateTime dataFineZoned = dateDTO.getDataFine().atZoneSameInstant(ZoneId.of("Europe/Rome"));

                System.out.println("Pre-salvataggio ZonedDateTime data inizio: " + dataInizioZoned);
                System.out.println("Pre-salvataggio ZonedDateTime data fine: " + dataFineZoned);

                // Impostato LocalDateTime convertendo da ZonedDateTime
                votazione.setDataInizio(dataInizioZoned.toLocalDateTime());
                votazione.setDataFine(dataFineZoned.toLocalDateTime());

                System.out.println("Post-conversione LocalDateTime data inizio: " + votazione.getDataInizio());
                System.out.println("Post-conversione LocalDateTime data fine: " + votazione.getDataFine());

                votazioneRepository.save(votazione);
                // Dopo aver salvato la votazione con le nuove date
                schedulerService.programmaAttivazioneDisattivazioneVotazione(votazione);
                votazioneService.activateBroadcast();

                System.out.println("Date salvate con successo per la votazione di tipo: " + tipo);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("errore", "Votazione di tipo " + tipo + " non trovata."));
            }
        } catch (Exception e) {
            logger.error("Errore durante l'impostazione delle date della votazione", e);
            return ResponseEntity.internalServerError().body(Map.of("errore", "Errore durante l'impostazione delle date."));
        }
    }



    @DeleteMapping("/pulisciDate/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> pulisciDateVotazione(@PathVariable String tipo) {
        System.out.println("Ricevuto richiesta per pulire le date della votazione di tipo: " + tipo);

        // Cerca la votazione specificata dal tipo
        Optional<Votazione> votazioneOpzionale = votazioneRepository.findByTipo(tipo).stream().findFirst();
        if (votazioneOpzionale.isPresent()) {
            Votazione votazione = votazioneOpzionale.get();

            // Pulisci le date di inizio e fine impostandole a null
            votazione.setDataInizio(null);
            votazione.setDataFine(null);

            // Salva le modifiche nel database
            votazioneRepository.save(votazione);
            votazioneService.deactivateBroadcast();

            System.out.println("Date pulite con successo per la votazione di tipo: " + tipo);
            return ResponseEntity.ok().build();
        } else {
            System.out.println("Votazione di tipo " + tipo + " non trovata.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("errore", "Votazione di tipo " + tipo + " non trovata."));
        }
    }


}

