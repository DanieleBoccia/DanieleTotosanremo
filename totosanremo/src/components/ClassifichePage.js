import React, { useState } from 'react';

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

// Dati fittizi degli utenti e delle loro scelte
const utenti = [
  {
    nome: "Utente1",
    topFive: ["Cantante A", "Cantante B", "Cantante C", "Cantante D", "Cantante E"],
    coverWinner: "Cantante F",
    ultimo: "Cantante G",
    penultimo: "Cantante H",
    critica: ["Cantante I", "Cantante J"],
    status: "Non Compilato", // o "Non Compilato"
    punti: 0 // Sarà calcolato in seguito
  },
  
];

// Supponiamo che questa funzione determini se l'utente attuale è l'amministratore
const isAdmin = () => {
    // Qui potresti controllare una proprietà dello stato dell'app o un token
    return true; // Questo è solo un esempio, sostituiscilo con la tua logica
  };

const ClassifichePage = () => {
  const [mostraClassificaDefinitiva, setMostraClassificaDefinitiva] = useState(false);

  const calcolaPunteggi = () => {
    // Qui inseriresti la logica per calcolare i punteggi basata sulle scelte pre e post ascolto
    // Per ora, impostiamo semplicemente mostraClassificaDefinitiva su true
    setMostraClassificaDefinitiva(true);
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 20 }}>
      <Typography variant="h3" gutterBottom>Classifiche Totosanremo 2025</Typography>
      <Typography variant="h4" gutterBottom>Classifica Pre-Ascolto</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="classifica generale">
          <TableHead>
            <TableRow>
              <TableCell>Nome Utente</TableCell>
              <TableCell align="right">Top 5</TableCell>
              <TableCell align="right">Vincitore Cover</TableCell>
              <TableCell align="right">Ultimo</TableCell>
              <TableCell align="right">Penultimo</TableCell>
              <TableCell align="right">Critica</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Punti</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utenti.map((utente) => (
              <TableRow key={utente.nome}>
                <TableCell component="th" scope="row">{utente.nome}</TableCell>
                <TableCell align="right">{utente.topFive.join(", ")}</TableCell>
                <TableCell align="right">{utente.coverWinner}</TableCell>
                <TableCell align="right">{utente.ultimo}</TableCell>
                <TableCell align="right">{utente.penultimo}</TableCell>
                <TableCell align="right">{utente.critica.join(", ")}</TableCell>
                <TableCell align="right">{utente.status}</TableCell>
                <TableCell align="right">{utente.punti}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h4" gutterBottom>Classifica Post-Ascolto</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="classifica generale">
          <TableHead>
            <TableRow>
              <TableCell>Nome Utente</TableCell>
              <TableCell align="right">Top 5</TableCell>
              <TableCell align="right">Vincitore Cover</TableCell>
              <TableCell align="right">Ultimo</TableCell>
              <TableCell align="right">Penultimo</TableCell>
              <TableCell align="right">Critica</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Punti</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utenti.map((utente) => (
              <TableRow key={utente.nome}>
                <TableCell component="th" scope="row">{utente.nome}</TableCell>
                <TableCell align="right">{utente.topFive.join(", ")}</TableCell>
                <TableCell align="right">{utente.coverWinner}</TableCell>
                <TableCell align="right">{utente.ultimo}</TableCell>
                <TableCell align="right">{utente.penultimo}</TableCell>
                <TableCell align="right">{utente.critica.join(", ")}</TableCell>
                <TableCell align="right">{utente.status}</TableCell>
                <TableCell align="right">{utente.punti}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pulsante per calcolare la classifica definitiva (visibile solo all'admin) */}
      {isAdmin() && (
        <Button
          variant="contained"
          color="primary"
          onClick={calcolaPunteggi}
          sx={{ my: 2 }}
        >
          Calcola Classifica Definitiva
        </Button>
      )}

      {/* Classifica Definitiva (mostrata solo dopo il calcolo) */}
      {mostraClassificaDefinitiva && (
        <>
          <Typography variant="h4" gutterBottom>Classifica Definitiva</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="classifica definitiva">
              <TableHead>
                <TableRow>
                  <TableCell>Nome Utente</TableCell>
                  <TableCell align="right">Punti Totali</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Qui inserisci la logica per mappare gli utenti con i loro punti totali */}
                {utenti.map((utente) => (
                  <TableRow key={utente.nome}>
                    <TableCell component="th" scope="row">{utente.nome}</TableCell>
                    {/* Assumiamo che 'punti' sia già la somma dei punti pre e post ascolto */}
                    <TableCell align="right">{utente.punti}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

    </Container>
   );
};

export default ClassifichePage;


