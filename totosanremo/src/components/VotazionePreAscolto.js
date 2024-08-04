import React, { useState, useEffect, useCallback } from 'react';
import { Box, FormControlLabel, Switch, Container, Typography, Grid, Autocomplete, TextField, Chip, Button, IconButton, Alert } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { jwtDecode } from 'jwt-decode';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { formatISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
//import { differenceInSeconds } from 'date-fns';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';





const VotazionePreAscolto = () => {
  // Aggiorna gli stati per includere tutti i campi richiesti
  const [topFive, setTopFive] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [coverWinner, setCoverWinner] = useState('');
  const [lastPlace, setLastPlace] = useState('');
  const [secondLastPlace, setSecondLastPlace] = useState('');
  const [criticAwards, setCriticAwards] = useState(Array(2).fill(''));
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // Stato per il successo dell'invio
  const [submissionError, setSubmissionError] = useState(false); // Nuovo stato per l'errore di invio
  const [open, setOpen] = useState(false);
  const [isVotingEnabled, setIsVotingEnabled] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [dataInizio, setDataInizio] = useState(null);
  const [dataFine, setDataFine] = useState(null);
  const [timer, setTimer] = useState('');
  const [isDateSubmitting, setIsDateSubmitting] = useState(false);
  const isVotingScheduled = dataInizio && dataFine && new Date(dataFine) > new Date();



  useEffect(() => {
    const savedDataInizio = localStorage.getItem('dataInizio');
    const savedDataFine = localStorage.getItem('dataFine');
    
    if (savedDataInizio && savedDataFine) {
      setDataInizio(new Date(savedDataInizio));
      setDataFine(new Date(savedDataFine));
    }
  }, []);


  const convertSecondsToHMS = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

/*
useEffect(() => {
  const connectOrReconnectWebSocket = () => {
    setIsWaitingForConnection(true); // Inizia a mostrare il messaggio di attesa

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      onConnect: () => {
        console.log('Connesso al WebSocket');
        setIsConnected(true);
        setIsWaitingForConnection(false); // Nasconde il messaggio di attesa
      },
      onStompError: (frame) => {
        // Gestisci errori specifici di STOMP
        console.error('Errore STOMP: ', frame);
        setIsWaitingForConnection(false); // Nasconde il messaggio di attesa in caso di errore
      },
      onWebSocketError: (evt) => {
        // Gestisci errori della connessione WebSocket
        console.error('Errore WebSocket: ', evt);
        setIsWaitingForConnection(false); // Nasconde il messaggio di attesa in caso di errore
      },
      onDisconnect: () => {
        console.log('Disconnesso dal WebSocket');
        setIsConnected(false);
      },
    });

    if (!isConnected) {
      stompClient.activate();
    }

    return stompClient;
  };

  const stompClient = connectOrReconnectWebSocket();

  return () => {
    stompClient.deactivate();
  };
}, [isConnected]);
*/



useEffect(() => {
  // Funzione per recuperare lo stato corrente della votazione
  const fetchVotingStatus = async () => {
    try {
      const response = await fetch('/api/public/votazioni/stato/PRE');
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

  fetchVotingStatus();
}, []);



// Definizione di updateTimer con useCallback
const updateTimer = useCallback((timerData) => {
  // Inizializza una variabile per il tempo rimanente
  let remainingTime;

  // Determina quale valore usare basato sull'esistenza dei campi nell'oggetto timerData
  if (timerData.tempoAllInizio !== undefined) {
    remainingTime = timerData.tempoAllInizio;
  } else if (timerData.tempoAllaFine !== undefined) {
    remainingTime = timerData.tempoAllaFine;
  } else {
    // Gestisci il caso in cui entrambi i valori sono undefined
    console.error('Dati del timer non validi:', timerData);
    return; // Puoi decidere di uscire dalla funzione o di impostare un valore predefinito per remainingTime
  }

  // Usa il valore definito per calcolare la stringa del tempo
  const timeString = convertSecondsToHMS(remainingTime);
  setTimer(timeString);
}, []);


useEffect(() => {
  const stompClient = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    onConnect: () => {
      console.log('Connesso al WebSocket');
      
      // Sottoscrizione per lo stato della votazione
      const stateSubscription = stompClient.subscribe('/topic/votazioneStato', (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.tipo === 'PRE') {
          setIsVotingEnabled(messageBody.stato === 'ATTIVA');
        }
      });

      // Sottoscrizione per gli aggiornamenti del timer
      const timerSubscription = stompClient.subscribe('/topic/votazioneTimer/PRE', (message) => {
        const timerData = JSON.parse(message.body);
        console.log("Dati del timer ricevuti:", timerData);
        updateTimer(timerData);
        //setIsWaitingForConnection(false);
      });

      // Sottoscrizione per l'aggiornamento di fine votazione e pulizia delle date
      const endOfVotingSubscription = stompClient.subscribe('/topic/votazioneUpdate', (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.tipo === 'PRE' && messageBody.azione === 'DISATTIVA_PULISCI') {
          console.log("Votazione terminata e date pulite");
          setIsVotingEnabled(false);
          setDataInizio(null);
          setDataFine(null);
          // Cancellazione delle sottoscrizioni
          stateSubscription.unsubscribe();
          timerSubscription.unsubscribe();
          endOfVotingSubscription.unsubscribe();
        }
      });

      // Aggiunta delle sottoscrizioni a una lista per poterle cancellare in seguito
      const subscriptions = [stateSubscription, timerSubscription, endOfVotingSubscription];

      return () => { // Funzione di pulizia
        subscriptions.forEach(subscription => subscription.unsubscribe());
      };
    },
    onDisconnect: () => {
      console.log('Disconnesso dal WebSocket');
    },
  });

  stompClient.activate();

  return () => { // Questa è la funzione di pulizia per l'effetto complessivo
    stompClient.deactivate();
  };
}, [updateTimer]); // Dipendenze dell'effetto




const toggleVoting = async () => {
  try {
    const url = `/api/admin/votazioni/toggle/PRE`; // URL specifico per il toggle della votazione PRE
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


  // Funzione per inviare le date al backend
const handleSubmitDate = async (event) => {
  event.preventDefault(); // Previene il comportamento di invio di default del form
  setIsDateSubmitting(true); 

  // Assumendo dataInizio e dataFine siano Date object di JavaScript
  const dataInizioUtc = formatISO(zonedTimeToUtc(dataInizio, 'Europe/Rome'));
  const dataFineUtc = formatISO(zonedTimeToUtc(dataFine, 'Europe/Rome'));

  // Salva le date in formato UTC in localStorage per la persistenza attraverso i cambi di pagina
  localStorage.setItem('dataInizio', dataInizioUtc);
  localStorage.setItem('dataFine', dataFineUtc);


  // Invia le date in formato UTC al tuo backend
  const url = `/api/admin/votazioni/impostaDate/PRE`;
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


// Funzione per pulire le date al backend e in localStorage
const pulisciDateVotazione = async () => {
  try {
    const url = `/api/admin/votazioni/pulisciDate/PRE`; // Modifica 'PRE' se necessario per supportare diversi tipi di votazione
    const response = await fetch(url, {
      method: 'DELETE', // Usa il metodo DELETE
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Date pulite con successo!');
      // Aggiorna lo stato della pagina resettando i valori di dataInizio e dataFine
      setDataInizio(null);
      setDataFine(null);
      // Rimuove le date da localStorage
      localStorage.removeItem('dataInizio');
      localStorage.removeItem('dataFine');
      setIsDateSubmitting(false)
    } else {
      const errorText = await response.text();
      alert(`Si è verificato un errore: ${errorText}`);
    }
  } catch (error) {
    console.error('Errore di rete:', error);
  }
};



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
      <Typography variant="h2" gutterBottom>Votazione Pre-Ascolto</Typography>
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
    control={<Switch checked={isVotingEnabled} onChange={toggleVoting} disabled={isVotingScheduled} />}
    label={isVotingEnabled ? 'Disabilita Votazione PRE' : 'Abilita Votazione PRE'}
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
    disabled={isVotingEnabled} // Disabilita se la votazione è attiva
  />
  <Typography sx={{ mt: 2, mb: 1 }}>Data e Ora di Fine:</Typography>
  <Flatpickr
    data-enable-time
    value={dataFine}
    onChange={([date]) => setDataFine(date)}
    options={{ dateFormat: "Y-m-d H:i" }}
    className="form-control"
    disabled={isVotingEnabled} // Disabilita se la votazione è attiva
  />
        </Box>
        <Box component="form" onSubmit={handleSubmitDate} noValidate sx={{ mt: 1 }}>
        <Button
    type="submit"
    variant="contained"
    size='small'
    sx={{ mt: 3, mb: 2, mr: 2 }}
    disabled={isVotingEnabled} // Disabilita il pulsante se la votazione è attiva
  >
    Imposta Date
  </Button>
       
  {isAdmin && (
  <Button
    onClick={pulisciDateVotazione}
    variant="contained"
    color='error'
    size='small'
    sx={{ mt: 3, mb: 2 }} // Il secondo bottone resta invariato, ma puoi aggiungere ml se necessario
  >
    Ripulisci Date
  </Button>
  )}
  {!timer && !isVotingEnabled && !isDateSubmitting && (
  <Typography variant="h6" style={{ textAlign: 'center', margin: '20px 0', color: 'error' }}>
    Nessuna votazione attiva.
  </Typography>
)}
{isDateSubmitting && !timer && (
  <Typography variant="h6" style={{ textAlign: 'center', margin: '20px 0', color: 'error' }}>
     Caricamento del timer in corso. Attendere prego...
  </Typography>
)}
{/* Mostra il timer quando disponibile */}
{timer && (
  <Typography variant="h5">
    Tempo rimanente: {timer}
  </Typography>
)}
</Box>
    </Container>
  );
};

export default VotazionePreAscolto;
