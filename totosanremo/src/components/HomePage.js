import React from 'react';
import { Container, Typography, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import CookieConsent from './informativa/CookieConsent';

const HomePage = () => {
  

  let navigate = useNavigate();

  const handleVoteNowClick = () => {
    navigate('/votazionePreAscolto'); // Assumi che il percorso della pagina di votazione pre-ascolto sia '/preListenVoting'
  };

  // Aggiungi questo nella tua HomePage
const handleViewRankingsClick = () => {
  navigate('/classifiche'); // Assumi che il percorso per ClassifichePage sia '/classifiche'
};


  return (
    <>
    <Container maxWidth="md" sx={{ mt: 4, mb: '97px' }}>
      {/* Titolo dell'applicazione */}
      <Typography variant="h2" gutterBottom
      /*
      sx={{
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #00c6ff 30%, #0072ff 50%, #ff77ab 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
        MozTextFillColor: 'transparent',
        display: 'inline', // Assicurati che il Typography sia impostato su inline per applicare correttamente il gradiente
      }}
      */
      >
        TOTOSANREMO TELEGRAM
      </Typography>

      {/* Sottotitolo o introduzione */}
      <Typography variant="h5" gutterBottom>
        BENVENUTO
      </Typography>
      
      {/* Descrizione del gioco */}
      <Typography paragraph>
        Partecipa al Totosanremo e prova a prevedere i risultati della competizione!
        Vota la tua top 5, la migliore cover, e molto altro prima e dopo aver ascoltato i brani.
      </Typography>

      {/* Regole del Gioco */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Regole del Gioco
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Votazioni</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              La votazione va effettuata prima di ascoltare i brani. Si può votare fino a [Admin inserirà data].
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Guida Assegnazione Punti</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Typography component="div">
          <strong>PUNTI STANDARD</strong><br />
          - Da 1 a 30 punti per ogni nome della top 5 in base al piazzamento in classifica finale<br />
          - Da 1 a 30 punti per il nome della cover in base al piazzamento in classifica cover<br />
          - Da 1 a 30 punti per ogni nome della critica in base al piazzamento in classifica finale<br />
          - Da 30 a 1 punti per l'ultimo e il penultimo in base al piazzamento in classifica finale<br />
          - Da 1 a 30 punti per i due nomi della critica in base al piazzamento in classifica finale<br /><br />
          <strong>PUNTI BONUS</strong><br />
          + 10 a chi indovina il primo dalla top 5<br />
          + 6 a chi indovina il secondo dalla top 5<br />
          + 4 a chi indovina il terzo dalla top 5<br />
          + 2 a chi indovina il quarto dalla top 5<br />
          + 1 a chi indovina il quinto dalla top 5<br />
          + 10 a chi indovina l'ultimo<br />
          + 10 a chi indovina il penultimo<br />
          + 10 a chi indovina il vincitore della serata cover<br />
          + 5 se il penultimo indicato arriva ultimo<br />
          + 5 se l'ultimo indicato arriva penultimo<br />
          + 10 a chi indovina il premio della critica<br />
          + 5 a chi indovina il premio del miglior testo
          </Typography>
          </AccordionDetails>
        </Accordion>
        {/* Aggiungi altre sezioni espandibili per altre regole se necessario */}
      </Paper>

      {/* Bottoni per navigare alle pagine di votazione o altre sezioni */}
      <Button variant="contained" sx={{ mr: 2 }} onClick={handleVoteNowClick}>
        Vota Ora
      </Button>
      <Button variant="outlined" onClick={handleViewRankingsClick}>
        Visualizza Classifiche
      </Button>
    </Container>
    <CookieConsent />
    </>
  );
};

export default HomePage;

