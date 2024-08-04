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
@RequestMapping("/api/public/cantanti") // Modifica il percorso di base
public class CantanteUserController { // Potresti anche considerare di rinominare il controller per riflettere il suo scopo

    @Autowired
    private CantanteService cantanteService;

    @GetMapping("/list")
    public ResponseEntity<List<Cantante>> ottieniTuttiCantanti() {
        List<Cantante> cantanti = cantanteService.ottieniTutti();
        return new ResponseEntity<>(cantanti, HttpStatus.OK);
    }


}

