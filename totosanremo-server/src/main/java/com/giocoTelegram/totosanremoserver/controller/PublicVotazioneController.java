package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.dto.VotazioneDTO;
import com.giocoTelegram.totosanremoserver.entity.Votazione;
import com.giocoTelegram.totosanremoserver.service.VotazioneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/public/votazioni")
public class PublicVotazioneController {

    private static final Logger logger = LoggerFactory.getLogger(PublicVotazioneController.class);


    @Autowired
    private VotazioneService votazioneService;

    @PostMapping("/invia")
    public ResponseEntity<?> inviaVoto(@RequestBody Votazione votazione) {
        Votazione salvata = votazioneService.saveVotazione(votazione);
        return ResponseEntity.ok(salvata);
    }

    @GetMapping("/stato/{tipo}")
    public ResponseEntity<?> getStatoVotazione(@PathVariable String tipo) {
        try {
            Boolean isAbilitata = votazioneService.isVotazioneAttiva(tipo);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isAbilitata", isAbilitata);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Errore durante il recupero dello stato della votazione", e);
            // Qui si restituisce un ResponseEntity con un codice di stato che indica un errore,
            // ma senza cercare di adattarlo alla firma di Map<String, Boolean>
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/timer/{tipo}")
    public ResponseEntity<?> getVotazioneTimer(@PathVariable String tipo) {
        try {
            Map<String, Long> timer = votazioneService.getVotazioneTimer(tipo);
            return ResponseEntity.ok(timer);
        } catch (Exception e) {
            logger.error("Errore durante il recupero del timer della votazione", e);
            return ResponseEntity.internalServerError().body(Map.of("errore", "Errore durante il recupero del timer."));
        }
    }




}



