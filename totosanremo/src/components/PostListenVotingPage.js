import React, { useState, useEffect } from 'react';
import { Box, FormControlLabel, Switch, Container, Typography, Grid, Autocomplete, TextField, Chip, Button, IconButton, Alert } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { jwtDecode } from 'jwt-decode';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { formatISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';

const PostListenVotingPage = () => {
  // Aggiorna gli stati per includere tutti i campi richiesti
  const [topFive, setTopFive] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [coverWinner, setCoverWinner] = useState('');
  const [lastPlace, setLastPlace] = useState('');
  const [secondLastPlace, setSecondLastPlace] = useState('');
  const [criticAwards, setCriticAwards] = useState(Array(2).fill(''));

  const [submissionSuccess, setSubmissionSuccess] = useState(false); // Stato per il successo dell'invio
  const [submissionError, setSubmissionError] = useState(false); // Nuovo stato per l'errore di invio
  const [timer, setTimer] = useState('');


  // Stato per controllare l'apertura del menu a tendina di Autocomplete
  const [open, setOpen] = useState(false);
  const [isVotingEnabled, setIsVotingEnabled] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  //const [votazioneId, setVotazioneId] = useState(null);
  const [dataInizio, setDataInizio] = useState(null);
  const [dataFine, setDataFine] = useState(null);
  const [isVotazioneEnabled, setIsVotazioneEnabled] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Decidi se calcolare il tempo fino all'inizio o alla fine
      const targetDate = isVotazioneEnabled ? dataFine : dataInizio;
      const timeRemaining = calculateTimeRemaining(targetDate);
      setTimer(timeRemaining);
  
      // Se la votazione si è conclusa, puoi anche fermare l'intervallo
      if (isVotazioneEnabled && new Date() > new Date(dataFine)) {
        clearInterval(intervalId);
      }
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [isVotazioneEnabled, dataInizio, dataFine]);


  useEffect(() => {
    // Definisci una funzione per controllare lo stato della votazione
    const checkVotazioneStatus = async () => {
      try {
        const response = await fetch('/api/public/votazioni/check-status');
        if (response.ok) {
          const { isAbilitata } = await response.json();
          setIsVotazioneEnabled(isAbilitata);
        }
      } catch (error) {
        console.error('Errore durante il controllo dello stato della votazione:', error);
      }
    };
  
    // Esegui la funzione al montaggio del componente
    checkVotazioneStatus();
  }, []);

  

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const seconds = differenceInSeconds(end, now);
    if (seconds <= 0) {
      return '00:00:00';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    const fetchVotingEnabledStatus = async () => {
      try {
        const url = `/api/public/votazioni/stato/POST`; // URL per ottenere lo stato attuale della votazione PRE
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`, // Se necessario
          },
        });
  
        if (response.ok) {
          const { isAbilitata } = await response.json();
          setIsVotingEnabled(isAbilitata); // Imposta lo stato in base al valore corrente nel db
        } else {
          console.error('Impossibile recuperare lo stato della votazione PRE');
        }
      } catch (error) {
        console.error('Errore di rete nel recuperare lo stato della votazione PRE:', error);
      }
    };
  
    fetchVotingEnabledStatus();
  }, []); // L'array di dipendenze vuoto assicura che questo effetto si esegua solo al montaggio del componente
  
  
  const toggleVoting = async () => {
    try {
      const url = `/api/admin/votazioni/toggle/POST`; // URL specifico per il toggle della votazione PRE
      const response = await fetch(url, {
        method: 'POST', // Metodo POST per effettuare il toggle
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`, // Assicurati che il token JWT sia correttamente inserito
          'Content-Type': 'application/json', // Header per indicare il tipo di contenuto
        },
      });
  
      if (response.ok) {
        const newState = await response.json(); // Assumendo che il backend risponda con il nuovo stato
        console.log("Votazione PRE toggled con successo.");
        setIsVotingEnabled(newState.isAbilitata); // Aggiorna lo stato di abilitazione con il nuovo valore
      } else {
        console.error('Errore nell\'attivazione/disattivazione della votazione PRE');
      }
    } catch (error) {
      console.error('Errore di rete:', error); // Gestione degli errori di rete
    }
  };

  /*
  useEffect(() => {
    // Crea una funzione per interrogare lo stato della votazione
    const fetchVotingStatus = async () => {
      try {
        const url = `/api/public/votazioni/stato/PRE`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        if (response.ok) {
          const { isAbilitata } = await response.json();
          setIsVotingEnabled(isAbilitata);
        } else {
          console.error('Errore nel recupero dello stato della votazione');
        }
      } catch (error) {
        console.error('Errore di rete:', error);
      }
    };
  
    // Imposta un intervallo per eseguire il polling ogni tot secondi (es. ogni 30 secondi)
    const intervalId = setInterval(fetchVotingStatus, 30000);
  
    // Chiama la funzione immediatamente per ottenere lo stato iniziale
    fetchVotingStatus();
  
    // Effettua la pulizia dell'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, []);
  */
  
  
  useEffect(() => {
    // Qui dovresti avere la logica per impostare se l'utente è admin
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.isAdmin || decoded.roles.includes('ROLE_ADMIN'));
    }
    // Fetch dei cantanti
    const fetchCantanti = async () => {
      // Logica di fetch qui
    };
    fetchCantanti();
  }, []);



    // Funzione per inviare le date al backend
const handleSubmitDate = async (event) => {
  event.preventDefault(); // Previene il comportamento di invio di default del form

  // Assumendo dataInizio e dataFine siano Date object di JavaScript
  const dataInizioUtc = formatISO(zonedTimeToUtc(dataInizio, 'Europe/Rome'));
  const dataFineUtc = formatISO(zonedTimeToUtc(dataFine, 'Europe/Rome'));

  // Invia le date in formato UTC al tuo backend
  const url = `/api/admin/votazioni/impostaDate/POST`;
  const token = localStorage.getItem('jwt');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        dataInizio: dataInizioUtc, // Correggi qui
        dataFine: dataFineUtc, // E qui
      }),
    });

    if (response.ok) {
      alert('Date impostate con successo!');
    } else {
      const errorText = await response.text(); // Ottiene la risposta testuale dell'errore
      alert(`Si è verificato un errore: ${errorText}`);
    }
  } catch (error) {
    console.error('Errore di rete:', error);
  }
};

// Funzione per pulire le date al backend
const pulisciDateVotazione = async () => {
  try {
    const url = `/api/admin/votazioni/pulisciDate/POST`; // Modifica 'PRE' se necessario per supportare diversi tipi di votazione
    const response = await fetch(url, {
      method: 'DELETE', // Usa il metodo DELETE
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Date pulite con successo!');
      // Aggiorna lo stato della pagina se necessario, ad esempio resettando i valori di dataInizio e dataFine
      setDataInizio(null);
      setDataFine(null);
    } else {
      const errorText = await response.text();
      alert(`Si è verificato un errore: ${errorText}`);
    }
  } catch (error) {
    console.error('Errore di rete:', error);
  }
};



  const handleRemoveCantante = (cantanteToRemove) => {
    setTopFive(topFive.filter(cantante => cantante !== cantanteToRemove));
  };

   // Gestione dell'aggiunta e del limite di cantanti selezionabili
   const handleChange = (event, newValue) => {
    // Limita l'array newValue a un massimo di 5 elementi
    const limitedNewValue = newValue.slice(0, 5);
    setTopFive(limitedNewValue);
  };

  const [cantantiOptions, setCantantiOptions] = useState([]);

  useEffect(() => {
    const fetchCantanti = async () => {
        try {
            // Modifica l'URL con il percorso effettivo del tuo endpoint API
            const response = await fetch('/api/admin/cantanti/list');
            if (!response.ok) {
                throw new Error('Errore nel caricamento dei cantanti');
            }
            const data = await response.json();
            // Assumiamo che 'data' sia un array di oggetti cantante con una proprietà 'nome'
            setCantantiOptions(data.map(cantante => cantante.nome));
        } catch (error) {
            console.error("Errore nel caricamento dei cantanti:", error);
        }
    };
    fetchCantanti();
}, []);

  const handleCriticAwardsChange = (index, value) => {
    const updatedCriticAwards = [...criticAwards];
    updatedCriticAwards[index] = value;
    setCriticAwards(updatedCriticAwards);
  };

  // Invio del form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Controlla se tutti i campi sono compilati correttamente
    if (topFive.length === 5 && coverWinner && lastPlace && secondLastPlace && criticAwards.every(award => award)) {
      console.log("Voti inviati:", { topFive, coverWinner, lastPlace, secondLastPlace, criticAwards });
      setSubmissionSuccess(true);
      setSubmissionError(false); // Resetta l'errore di invio se l'invio ha successo
    } else {
      setSubmissionError(true); // Imposta l'errore di invio se i controlli falliscono
      setSubmissionSuccess(false);
    }
  };

  // Funzione per gestire l'apertura/chiusura del menu a tendina
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" gutterBottom>Votazione Post-Ascolto</Typography>
      {submissionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Voti inviati con successo!
        </Alert>
      )}
      
      {submissionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Compilare tutti i campi obbligatori.
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <Autocomplete
              multiple
              open={open} // Controlla l'apertura del menu a tendina con lo stato
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              value={topFive}
              onChange={handleChange}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
              options={cantantiOptions.filter(option => !topFive.includes(option))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleziona i cantanti per la Top 5"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <IconButton onClick={toggleOpen} style={{ cursor: 'pointer' }}>
                          <ArrowDropDownIcon />
                        </IconButton>
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} onDelete={() => handleRemoveCantante(option)} />
                ))
              }
              freeSolo
            />
          </Grid>

          {/* Input per gli altri campi */}
          {/* Autocomplete per i restanti campi con la stessa logica della Top 5 */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={coverWinner}
              onChange={(event, newValue) => setCoverWinner(newValue)}
              options={cantantiOptions}
              renderInput={(params) => <TextField {...params} label="Vincitore serata Cover" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={lastPlace}
              onChange={(event, newValue) => setLastPlace(newValue)}
              options={cantantiOptions}
              renderInput={(params) => <TextField {...params} label="Ultimo classificato" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={secondLastPlace}
              onChange={(event, newValue) => setSecondLastPlace(newValue)}
              options={cantantiOptions}
              renderInput={(params) => <TextField {...params} label="Penultimo classificato" />}
            />
          </Grid>
          {/* Autocomplete per i Premi della Critica e Miglior Testo */}
          {criticAwards.map((award, index) => (
            <Grid item xs={12} sm={6} key={`critic-award-${index}`}>
              <Autocomplete
                value={award}
                onChange={(event, newValue) => handleCriticAwardsChange(index, newValue)}
                options={cantantiOptions}
                renderInput={(params) => <TextField {...params} label={index === 0 ? "Premio della Critica" : "Premio Miglior Testo"} />}
              />
            </Grid>
          ))}
          {/* Bottone di Invio */}
          <Grid item xs={12}>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!isVotingEnabled} // Disabilita il pulsante basandosi sullo stato di isVotingEnabled
      >
        Invia Voti
      </Button>
      {isAdmin && isVotingEnabled !== null && (
        <FormControlLabel
        control={<Switch checked={isVotingEnabled} onChange={toggleVoting} />}
        label={isVotingEnabled ? 'Disabilita Votazione POST' : 'Abilita Votazione POST'}
        />
      )}
          </Grid>
        </Grid>
      </form>
      <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
        Imposta Data e Ora di Inizio e Fine Votazione
      </Typography>
      <Box component="form" onSubmit={handleSubmitDate} noValidate sx={{ mt: 1 }}>
        <Typography sx={{ mt: 2, mb: 1 }}>Data e Ora di Inizio:</Typography>
        <Flatpickr
          data-enable-time
          value={dataInizio}
          onChange={([date]) => setDataInizio(date)}
          options={{ dateFormat: "Y-m-d H:i" }}
          className="form-control"
        />
        <Typography sx={{ mt: 2, mb: 1 }}>Data e Ora di Fine:</Typography>
        <Flatpickr
          data-enable-time
          value={dataFine}
          onChange={([date]) => setDataFine(date)}
          options={{ dateFormat: "Y-m-d H:i" }}
          className="form-control"
        />
        </Box>
        <Box component="form" onSubmit={handleSubmitDate} noValidate sx={{ mt: 1 }}>
  <Button
    type="submit"
    variant="contained"
    size='small'
    sx={{ mt: 3, mb: 2, mr: 2 }} // Aggiungi un margine a destra al primo bottone
  >
    Imposta Date
  </Button>
  <Button
    onClick={pulisciDateVotazione}
    variant="contained"
    color='error'
    size='small'
    sx={{ mt: 3, mb: 2 }} // Il secondo bottone resta invariato, ma puoi aggiungere ml se necessario
  >
    Ripulisci Date
  </Button>
  <Typography variant="h6">{isVotazioneEnabled ? 'Tempo alla fine della votazione: ' : 'Tempo all\'inizio della votazione: '} {timer}</Typography>
</Box>
    </Container>
  );
};

export default PostListenVotingPage;


