package com.giocoTelegram.totosanremoserver.controller;

import com.giocoTelegram.totosanremoserver.entity.Cantante;
import com.giocoTelegram.totosanremoserver.service.CantanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cantanti") // Modifica il percorso di base
public class CantanteAdminController { // Potresti anche considerare di rinominare il controller per riflettere il suo scopo

    @Autowired
    private CantanteService cantanteService;

    @PostMapping("/aggiungi")
    @PreAuthorize("hasRole('ADMIN')") // Assicurati che solo gli utenti con ruolo ADMIN possano accedere a questo endpoint
    public ResponseEntity<Cantante> aggiungiCantante(@Validated @RequestBody Cantante cantante) {
        return new ResponseEntity<>(cantanteService.aggiungiCantante(cantante), HttpStatus.CREATED);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Cantante>> ottieniTuttiCantanti() {
        List<Cantante> cantanti = cantanteService.ottieniTutti();
        return new ResponseEntity<>(cantanti, HttpStatus.OK);
    }

    @PutMapping("/aggiorna/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cantante> aggiornaCantante(@Validated @RequestBody Cantante cantante, @PathVariable Long id) {
        cantante.setId(id);
        Cantante cantanteAggiornato = cantanteService.aggiornaCantante(cantante);
        return new ResponseEntity<>(cantanteAggiornato, HttpStatus.OK);
    }

    @DeleteMapping("/elimina/{id}")
    public ResponseEntity<Void> eliminaCantante(@PathVariable Long id) {
        cantanteService.eliminaCantante(id);
        return ResponseEntity.ok().build();
    }
}
