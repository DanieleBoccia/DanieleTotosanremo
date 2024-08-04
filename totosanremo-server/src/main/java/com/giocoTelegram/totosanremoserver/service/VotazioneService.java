package com.giocoTelegram.totosanremoserver.service;

import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.repository.VotazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VotazioneService {
    @Autowired
    private VotazioneRepository votazioneRepository;

    private boolean broadcastActive = false;

    // Metodo per attivare il broadcasting
    public void activateBroadcast() {
        this.broadcastActive = true;
        System.out.println("Broadcasting attivato");
    }

    // Metodo per disattivare il broadcasting
    public void deactivateBroadcast() {
        this.broadcastActive = false;
        System.out.println("Broadcasting disattivato");
    }

    public boolean isBroadcastActive() {
        return broadcastActive;
    }

    public List<Votazione> getAllVotazioni() {
        return votazioneRepository.findAll();
    }

    public Votazione saveVotazione(Votazione votazione) {
        return votazioneRepository.save(votazione);
    }


    @Transactional
    public boolean isVotazioneAttiva(String tipo) {
        // Verifica se esiste una votazione attiva di un certo tipo
        return votazioneRepository.findByTipoAndAbilitata(tipo, true).isPresent();
    }

    @Transactional
    public boolean isVotazioneAttivaPerData(String tipo) {
        ZonedDateTime oraCorrenteZoned = ZonedDateTime.now(ZoneId.of("Europe/Rome"));
        Optional<Votazione> votazioneOpzionale = votazioneRepository
                .findByTipo(tipo)
                .stream()
                .filter(v -> v.getDataInizio() != null && v.getDataFine() != null)
                .findFirst();

        if (votazioneOpzionale.isPresent()) {
            Votazione votazione = votazioneOpzionale.get();
            ZonedDateTime dataInizioZoned = votazione.getDataInizio().atZone(ZoneId.of("Europe/Rome"));
            ZonedDateTime dataFineZoned = votazione.getDataFine().atZone(ZoneId.of("Europe/Rome"));

            return !dataInizioZoned.isAfter(oraCorrenteZoned) && !dataFineZoned.isBefore(oraCorrenteZoned) && Boolean.TRUE.equals(votazione.getAbilitata());
        }

        return false;
    }

    public Map<String, Long> getVotazioneTimer(String tipo) {
        ZonedDateTime oraCorrente = ZonedDateTime.now(ZoneId.of("Europe/Rome"));
        Optional<Votazione> votazioneOpzionale = votazioneRepository.findByTipo(tipo).stream().findFirst();

        Map<String, Long> timer = new HashMap<>();

        if (votazioneOpzionale.isPresent()) {
            Votazione votazione = votazioneOpzionale.get();

            // Verifica che sia getDataInizio() che getDataFine() non siano null
            if (votazione.getDataInizio() != null && votazione.getDataFine() != null) {
                ZonedDateTime dataInizio = votazione.getDataInizio().atZone(ZoneId.of("Europe/Rome"));
                ZonedDateTime dataFine = votazione.getDataFine().atZone(ZoneId.of("Europe/Rome"));

                if (oraCorrente.isBefore(dataInizio)) {
                    // Calcola quanto manca all'inizio
                    Duration durataAllInizio = Duration.between(oraCorrente, dataInizio);
                    timer.put("tempoAllInizio", durataAllInizio.getSeconds());
                } else if (oraCorrente.isBefore(dataFine)) {
                    // Calcola quanto manca alla fine
                    Duration durataAllaFine = Duration.between(oraCorrente, dataFine);
                    timer.put("tempoAllaFine", durataAllaFine.getSeconds());
                }
            } else {
                // Qui puoi gestire il caso in cui una delle due date sia null, ad esempio impostando valori predefiniti nel timer
                timer.put("tempoAllInizio", -1L); // Esempio: -1 potrebbe indicare che la data è non disponibile
                timer.put("tempoAllaFine", -1L);
            }
        }

        return timer;
    }




    // Metodi per attivare/disattivare la votazione e per controllare se la votazione è attiva
}


