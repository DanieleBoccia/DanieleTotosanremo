package com.giocoTelegram.totosanremoserver.service;

import com.giocoTelegram.totosanremoserver.controller.VotazioneWebSocketController;
import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.repository.VotazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class SchedulerService {

    @Autowired
    private VotazioneRepository votazioneRepository;

    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    VotazioneService votazioneService;

    @Autowired
    VotazioneWebSocketController votazioneWebSocketController;


    public void programmaAttivazioneDisattivazioneVotazione(Votazione votazione) {
        ZonedDateTime oraAttivazione = votazione.getDataInizio().atZone(ZoneId.of("Europe/Rome"));
        ZonedDateTime oraDisattivazione = votazione.getDataFine().atZone(ZoneId.of("Europe/Rome"));

        // Schedula l'attivazione
        taskScheduler.schedule(() -> {
            votazione.setAbilitata(true);
            votazioneRepository.save(votazione);
            messagingTemplate.convertAndSend("/topic/votazioneStato", Map.of("tipo", votazione.getTipo(), "stato", "ATTIVA"));
        }, Date.from(oraAttivazione.toInstant()));

        // Schedula la disattivazione
        taskScheduler.schedule(() -> {
            votazione.setAbilitata(false);
            votazioneRepository.save(votazione);
            messagingTemplate.convertAndSend("/topic/votazioneStato", Map.of("tipo", votazione.getTipo(), "stato", "DISATTIVA"));
        }, Date.from(oraDisattivazione.toInstant()));
    }

    @Scheduled(fixedRate = 3600000) // Ogni minuto controlla le votazioni
    public void verificaFineVotazioni() {
        List<Votazione> votazioni = votazioneRepository.findByAbilitataTrue();
        LocalDateTime oraCorrente = LocalDateTime.now(ZoneId.of("Europe/Rome"));

        for (Votazione votazione : votazioni) {
            if (votazione.getDataFine() != null && votazione.getDataFine().isBefore(oraCorrente)) {
                // Disattiva la votazione
                votazione.setAbilitata(false);
                // Pulisci le date
                votazione.setDataInizio(null);
                votazione.setDataFine(null);
                votazioneRepository.save(votazione);

                // Invia una notifica via WebSocket
                messagingTemplate.convertAndSend("/topic/votazioneUpdate", Map.of(
                        "tipo", votazione.getTipo(),
                        "azione", "DISATTIVA_PULISCI"
                ));
            }
        }
    }


}

