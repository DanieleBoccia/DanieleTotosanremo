package com.giocoTelegram.totosanremoserver.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Entity
public class Cantante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome non può essere vuoto")
    private String nome;
    @NotBlank(message = "Il titolo del brano non può essere vuoto")
    private String brano;
    @NotBlank(message = "Il titolo della cover non può essere vuoto")
    private String cover;

    // Costruttori, getter e setter
    public Cantante() {}

    public Cantante(String nome, String brano) {
        this.nome = nome;
        this.brano = brano;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBrano() {
        return brano;
    }

    public void setBrano(String brano) {
        this.brano = brano;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }
}
