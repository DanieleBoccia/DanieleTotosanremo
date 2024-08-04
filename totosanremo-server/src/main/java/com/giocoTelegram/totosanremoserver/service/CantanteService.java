package com.giocoTelegram.totosanremoserver.service;

import com.giocoTelegram.totosanremoserver.entity.Cantante;
import com.giocoTelegram.totosanremoserver.repository.CantanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CantanteService {

    @Autowired
    private CantanteRepository cantanteRepository;

    public Cantante aggiungiCantante(Cantante cantante) {
        return cantanteRepository.save(cantante);
    }


    public Cantante aggiornaCantante(Cantante cantante) {
        return cantanteRepository.save(cantante);
    }


    public void eliminaCantante(Long id) {
        cantanteRepository.deleteById(id);
    }

    public List<Cantante> ottieniTutti() {
        return cantanteRepository.findAll();
    }
}

