package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.repository.VotazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import com.giocoTelegram.totosanremoserver.service.VotazioneService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Controller
public class VotazioneWebSocketController {

    @Autowired
    private VotazioneService votazioneService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private VotazioneRepository votazioneRepository;

    private final AtomicBoolean checkVotations = new AtomicBoolean(false);

    public void setCheckVotations(boolean status) {
        this.checkVotations.set(status);
    }


    // Endpoint per richiedere manualmente l'aggiornamento del timer
    @MessageMapping("/votazione/requestTimer")
    @SendTo("/topic/votazioneTimer")
    public Map<String, Long> requestVotazioneTimer() throws Exception {
        // Implementa la logica per ottenere il tempo rimanente
        Map<String, Long> timer = votazioneService.getVotazioneTimer("PRE"); // Esempio con "PRE"
        return timer;
    }

    // Metodo schedulato per inviare aggiornamenti periodici del timer
    @Scheduled(fixedRate = 1000) // Controlla ogni secondo
    public void broadcastTime() {
        if (votazioneService.isBroadcastActive()) { // Controlla se il broadcasting è attivo
            broadcastTimerForType("PRE");
            broadcastTimerForType("POST");
        }
    }

    private void broadcastTimerForType(String tipo) {
        Optional<Votazione> votazioneOpzionale = votazioneRepository.findByTipo(tipo).stream().findFirst();

        if (votazioneOpzionale.isPresent()) {
            Votazione votazione = votazioneOpzionale.get();

            if (votazione.getDataInizio() != null && votazione.getDataFine() != null) {
                LocalDateTime oraCorrente = LocalDateTime.now(ZoneId.of("Europe/Rome"));
                Map<String, Long> timer = votazioneService.getVotazioneTimer(tipo);

                if (oraCorrente.isAfter(votazione.getDataFine().atZone(ZoneId.of("Europe/Rome")).toLocalDateTime())) {
                    // La votazione è terminata
                    votazione.setAbilitata(false);
                    votazione.setDataInizio(null);
                    votazione.setDataFine(null);
                    votazioneRepository.save(votazione);

                    // Invia una notifica di fine votazione e pulizia delle date
                    messagingTemplate.convertAndSend("/topic/votazioneUpdate", Map.of(
                            "tipo", tipo,
                            "azione", "DISATTIVA_PULISCI"
                    ));

                    // Opzionalmente, termina il metodo qui per non inviare ulteriori aggiornamenti del timer
                    votazioneService.deactivateBroadcast();
                } else if (timer != null &&
                        (timer.containsKey("tempoAllInizio") && timer.get("tempoAllInizio") > 0 ||
                                timer.containsKey("tempoAllaFine") && timer.get("tempoAllaFine") > 0)) {
                    // La votazione è ancora attiva, invia l'aggiornamento del timer
                    System.out.println("Invio dati timer: " + timer);
                    messagingTemplate.convertAndSend("/topic/votazioneTimer/" + tipo, timer);
                }
            }
        }
    }
}
