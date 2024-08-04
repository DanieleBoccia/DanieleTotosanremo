package com.giocoTelegram.totosanremoserver.entity;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
public class Votazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo; // "PRE" o "POST"

    private LocalDateTime dataInizio;

    private LocalDateTime dataFine;

    private Boolean abilitata;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "votazione_cantanti",
            joinColumns = @JoinColumn(name = "votazione_id"),
            inverseJoinColumns = @JoinColumn(name = "cantante_id")
    )
    private Set<Cantante> cantantiVotati;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User utente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(LocalDateTime dataInizio) {
        this.dataInizio = dataInizio;
    }

    public LocalDateTime getDataFine() {
        return dataFine;
    }

    public void setDataFine(LocalDateTime dataFine) {
        this.dataFine = dataFine;
    }

    public Boolean getAbilitata() {
        return abilitata;
    }

    public void setAbilitata(Boolean abilitata) {
        this.abilitata = abilitata;
    }

    public Set<Cantante> getCantantiVotati() {
        return cantantiVotati;
    }

    public void setCantantiVotati(Set<Cantante> cantantiVotati) {
        this.cantantiVotati = cantantiVotati;
    }

    public User getUtente() {
        return utente;
    }

    public void setUtente(User utente) {
        this.utente = utente;
    }
}

