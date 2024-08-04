package com.giocoTelegram.totosanremoserver.dto;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public class VotazioneDataDTO {

    private OffsetDateTime dataInizio;
    private OffsetDateTime dataFine;

    // Costruttore vuoto necessario per il binding dei dati della richiesta
    public VotazioneDataDTO() {
    }

    // Costruttore con tutti i campi, opzionale ma utile per il testing o l'inizializzazione rapida
    public VotazioneDataDTO(OffsetDateTime dataInizio, OffsetDateTime dataFine) {
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
    }

    // Getter e Setter


    public OffsetDateTime getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(OffsetDateTime dataInizio) {
        this.dataInizio = dataInizio;
    }

    public OffsetDateTime getDataFine() {
        return dataFine;
    }

    public void setDataFine(OffsetDateTime dataFine) {
        this.dataFine = dataFine;
    }

    // Override del metodo toString(), opzionale ma utile per il debugging
    @Override
    public String toString() {
        return "VotazioneDataDTO{" +
                "dataInizio=" + dataInizio +
                ", dataFine=" + dataFine +
                '}';
    }
}

