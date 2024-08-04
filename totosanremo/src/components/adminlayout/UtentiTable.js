import React, { useState, useEffect } from 'react';
import { Box, TableCell, Checkbox, Table, TableBody, TableHead, TableRow, Select, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Chip  } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { FcDisapprove } from "react-icons/fc";
import { FcApprove } from "react-icons/fc";
import ConfirmDialog from '../../utils/ConfirmDialog';





const ActionContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Centra gli elementi orizzontalmente
  justifyContent: 'center', // Centra gli elementi verticalmente
  marginTop: '16px', // Spazio sopra il container
  marginBottom: '20px' // Spazio sotto il container
});

const InputContainer = styled('div')({
  display: 'flex',
  alignItems: 'center', // Centra verticalmente gli elementi
  justifyContent: 'center', // Centra orizzontalmente gli elementi
});

const MyTextField = styled(TextField)({
  // Larghezza massima del TextField. Regola questo valore a seconda del layout desiderato.
  width: '50%', 
  marginRight: '8px', // Margin a destra del TextField
});

const MyButton = styled(Button)(({ theme }) => ({
  marginLeft: '8px', // Margin a sinistra del Button
  height: theme.spacing(7), // Altezza standard per TextField con variant="outlined"
  // Adatta la larghezza del bottone a quella del TextField se necessario
  minWidth: '120px',
  [theme.breakpoints.up('sm')]: {
    minWidth: '140px',
  },
}));

const FilterContainer = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '20px', // Aumenta lo spazio tra i filtri
  marginBottom: '10px',
  paddingLeft: '153px',
});

const SmallTextField = styled(TextField)({
  width: '250px', // Larghezza ridotta per il campo di testo
});


const CustomTableContainer = styled(TableContainer)({
  maxWidth: '80%', // Limita la larghezza massima al 80% del suo contenitore
  margin: 'auto', // Centra la tabella orizzontalmente
});




const UtentiTable = () => {
  const [utenti, setUtenti] = useState([]);
  const [emailApprovate, setEmailApprovate] = useState([]);
  const [emailDaAggiungere, setEmailDaAggiungere] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailDaModificare, setEmailDaModificare] = useState('');
  const [idEmailSelezionata, setIdEmailSelezionata] = useState(null);
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroEmailRuolo, setFiltroEmailRuolo] = useState(''); 
  const [filtroRuolo, setFiltroRuolo] = useState(''); 
  const [richiesteEmail, setRichiesteEmail] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedApprovedEmails, setSelectedApprovedEmails] = useState([]);
  const [selectedEmailRequests, setSelectedEmailRequests] = useState([]);
  const [filtroEmailRichiesta, setFiltroEmailRichiesta] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState(''); // Nuovo stato per il titolo
  const [confirmMessage, setConfirmMessage] = useState('');





  useEffect(() => {
    const fetchRichiesteEmail = async () => {
      // Sostituisci '/api/path-to-your-email-requests-endpoint' con il tuo endpoint effettivo
      const response = await fetch('/api/admin/email-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRichiesteEmail(data);
      } else {
        // Gestisci errore
        console.error("Errore nel caricamento delle richieste email");
      }
    };
  
    fetchRichiesteEmail();
  }, []);

  const approvaRichiesta = async (id) => {
    const response = await fetch(`/api/admin/approve-email/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // Trova la richiesta di email approvata nell'array richiesteEmail
      const richiestaApprovata = richiesteEmail.find(richiesta => richiesta.id === id);
      // Aggiungi l'email approvata alla lista emailApprovate
      if (richiestaApprovata) {
        const emailAggiunta = { ...richiestaApprovata, status: 'APPROVED' }; // Assumi che ci sia un campo 'status'
        setEmailApprovate(prevEmails => [...prevEmails, emailAggiunta]);
      }
      // Rimuovi la richiesta approvata dall'array richiesteEmail
      setRichiesteEmail(prev => prev.filter(richiesta => richiesta.id !== id));
    } else {
      // Gestisci l'errore
      console.error("Impossibile approvare la richiesta");
    }
  };
  

  const rifiutaRichiesta = async (id) => {
    const response = await fetch(`/api/admin/reject-email/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // Aggiorna la lista delle richieste o notifica l'utente
      setRichiesteEmail(prev => prev.filter(richiesta => richiesta.id !== id));
    } else {
      // Gestisci l'errore
      console.error("Impossibile approvare la richiesta");
    }
  };



  useEffect(() => {
    fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
    .then(response => response.json())
    .then(data => setUtenti(data))
    .catch(error => console.error('Errore nel fetch degli utenti:', error));

    fetch('/api/admin/approved-emails', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log("Email approvate ricevute:", data);
      setEmailApprovate(data);
    })
    .catch(error => console.error('Errore nel fetch delle email approvate:', error));
  }, []);

  const assignRole = (email, roleName) => {
    fetch('/api/admin/assign-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`, // Prende il token JWT dal localStorage
      },
      body: JSON.stringify({ email, roleName }), // Converte i dati dell'utente in JSON
    })
    .then(response => {
      if (response.ok) {
        alert('Ruolo assegnato con successo');
        // Qui puoi anche decidere di aggiornare lo stato locale per riflettere il cambio di ruolo
        // senza necessariamente dover ricaricare tutta la lista degli utenti dal server
        setUtenti(utenti.map(utente => {
          if (utente.email === email) {
            return { ...utente, roles: [{ name: roleName }] };
          }
          return utente;
        }));
      } else {
        alert('Errore nell\'assegnazione del ruolo');
      }
    })
    .catch(error => {
      console.error('Errore nell\'assegnazione del ruolo:', error);
    });
  };

const aggiungiEmailApprovata = () => {
  fetch('/api/admin/add-approved-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    },
    body: JSON.stringify({ email: emailDaAggiungere }),
  })
  .then(response => {
    if (response.ok) {
      response.json().then(data => {
        setEmailApprovate(prevEmails => [...prevEmails, data]); // Aggiungi l'email appena restituita al frontend
        setEmailDaAggiungere('');
        alert('Email aggiunta con successo');
      });
    } else {
      throw new Error('Errore nell\'aggiunta dell\'email');
    }
  })
  .catch(error => {
    console.error('Errore nell\'aggiunta dell\'email:', error);
    alert(error.message);
  });
};




const eliminaEmailApprovata = (id) => {
  fetch(`/api/admin/delete-approved-email/${id}`, { // Nota l'ID passato nell'URL
    method: 'DELETE', // Cambiato in DELETE
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    },
  })
  .then(response => {
    if (response.ok) {
      setEmailApprovate(prevEmails => prevEmails.filter(email => email.id !== id));
      refreshApprovedEmails(); // Ricarica la lista delle email approvate dal server
      alert('Email eliminata con successo');
    } else {
      alert('Errore nell\'eliminazione dell\'email');
    }
  })
  .catch(error => {
    console.error('Errore nell\'eliminazione dell\'email:', error);
  });
};

const refreshApprovedEmails = () => {
  fetch('/api/admin/approved-emails', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    },
  })
  .then(response => response.json())
  .then(data => setEmailApprovate(data))
  .catch(error => console.error('Errore nel fetch delle email approvate:', error));
}

const modificaEmailApprovata = () => {
  fetch(`/api/admin/update-approved-email/${idEmailSelezionata}`, { // Includi l'ID nell'URL
    method: 'PUT', // Conferma l'uso del metodo PUT
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    },
    body: JSON.stringify({ email: emailDaModificare }), // Passa solo la nuova email nel corpo della richiesta
  })
  .then(response => {
    if (response.ok) {
      // Aggiorna lo stato locale per riflettere la modifica senza ricaricare la pagina
      setEmailApprovate(prevEmails => prevEmails.map(email => 
        email.id === idEmailSelezionata ? { ...email, email: emailDaModificare } : email
      ));
      refreshApprovedEmails();
      setIsDialogOpen(false); // Chiudi il dialog
      alert('Email modificata con successo');
    } else {
      // Gestisci gli errori (es. email non trovata, richiesta non valida)
      response.json().then(data => alert(data.message));
    }
  })
  .catch(error => {
    console.error('Errore nella modifica dell\'email:', error);
  });
};

  const apriDialogModifica = (email, id) => {
    setEmailDaModificare(email);
    setIdEmailSelezionata(id);
    setIsDialogOpen(true);
  };

  const chiudiDialog = () => {
    setIsDialogOpen(false);
  };

  
  const handleFiltroStatoChange = (e) => {
    setFiltroStato(e.target.value);
  };

  const filtraEmailApprovate = (emails) => {
    return emails.filter((email) => {
      const corrispondeEmail = email.email.toLowerCase().includes(filtroEmail.toLowerCase());
      // Mostra solo le email con stato "APPROVED"
      const isApproved = email.status === 'APPROVED';
  
      let corrispondeStato = true;
      // Assumendo che `registered` indichi se un'email approvata si è registrata al sito
      if (filtroStato === "Registrata") {
        corrispondeStato = email.registered;
      } else if (filtroStato === "Non registrata") {
        corrispondeStato = !email.registered;
      }
  
      return corrispondeEmail && isApproved && corrispondeStato;
    });
  };
  
  
  
  const filtraUtenti = (utenti) => {
    return utenti.filter((utente) => {
      const corrispondeEmail = utente.email.toLowerCase().includes(filtroEmailRuolo.toLowerCase());
      const corrispondeRuolo = filtroRuolo === '' || utente.roles.some(role => role.name === filtroRuolo);
  
      return corrispondeEmail && corrispondeRuolo;
    });
  };

  const filteredUsers = filtraUtenti(utenti);
  const numSelected = selectedUsers.length;
  const rowCount = filteredUsers.length;

  const indeterminate = numSelected > 0 && numSelected < rowCount;
  const checked = rowCount > 0 && numSelected === rowCount;

  const assignRolesToSelectedUsers = async (roleName) => {
    try {
      const response = await fetch('/api/admin/assign-roles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers, // assicurati che `selectedUsers` sia l'array degli ID utente selezionati
          roleName
        }),
      });
      if (response.ok) {
        alert('Ruoli assegnati con successo.');
        // Qui potresti voler aggiornare lo stato per riflettere i cambiamenti
      } else {
        alert('Seleziona un ruolo.');
      }
    } catch (error) {
      console.error('Errore nell\'assegnazione dei ruoli:', error);
    }
  };

  const handleSelectEmailRequest = (requestId) => {
    const selectedIndex = selectedEmailRequests.indexOf(requestId);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = [...selectedEmailRequests, requestId];
    } else {
      newSelected = selectedEmailRequests.filter((id) => id !== requestId);
    }
  
    setSelectedEmailRequests(newSelected);
  };

  const handleSelectAllEmailRequests = (event) => {
    if (event.target.checked) {
      const newSelecteds = richiesteEmail.map((n) => n.id);
      setSelectedEmailRequests(newSelecteds);
      return;
    }
    setSelectedEmailRequests([]);
  };
  

const approveSelectedEmailRequests = async () => {
  // Assumi che questo filtro applichi il filtro corrente alle email selezionate
  const filteredSelectedRequests = selectedEmailRequests.filter(requestId =>
    richiesteFiltrate.some(filteredRequest => filteredRequest.id === requestId)
  );

  try {
    const response = await fetch('/api/admin/approve-email-requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredSelectedRequests),
    });

    if (response.ok) {
      const approvedEmails = await response.json(); // Assumi che questa sia l'elenco delle email approvate

      // Aggiungi le email approvate all'elenco delle emailApprovate
      setEmailApprovate(prevEmails => [...prevEmails, ...approvedEmails]);

      // Rimuovi le richieste approvate dall'elenco delle richieste
      setRichiesteEmail(prevRichieste => 
        prevRichieste.filter(richiesta => !filteredSelectedRequests.includes(richiesta.id))
      );

      // Deseleziona le richieste approvate
      setSelectedEmailRequests(prevSelected => 
        prevSelected.filter(requestId => !filteredSelectedRequests.includes(requestId))
      );

      alert('Richieste email approvate con successo.');
    } else {
      alert('Errore nell\'approvazione delle richieste email.');
    }
  } catch (error) {
    console.error('Errore nell\'approvazione delle richieste email:', error);
  }
};






const rejectSelectedEmailRequests = async () => {
  // Prima, determina quali delle email selezionate sono visibili secondo il filtro corrente.
  const filteredSelectedRequests = selectedEmailRequests.filter(requestId =>
    richiesteFiltrate.some(filteredRequest => filteredRequest.id === requestId)
  );

  if (filteredSelectedRequests.length === 0) {
    alert("Seleziona almeno una richiesta email per rifiutare.");
    return;
  }

  try {
    const response = await fetch('/api/admin/reject-email-requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredSelectedRequests),
    });

    if (response.ok) {
      alert('Richieste email rifiutate con successo.');

      // Dopo il rifiuto, aggiorna le richieste di email visualizzate rimuovendo quelle appena rifiutate.
      setRichiesteEmail(prevRequests =>
        prevRequests.filter(richiesta => !filteredSelectedRequests.includes(richiesta.id))
      );
      
      // Dopo l'operazione, pulisci le selezioni.
      setSelectedEmailRequests(prevSelected =>
        prevSelected.filter(id => !filteredSelectedRequests.includes(id))
      );
    } else {
      alert('Errore nel rifiuto delle richieste email.');
    }
  } catch (error) {
    console.error('Errore nel rifiuto delle richieste email:', error);
  }
};



  const handleSelectEmail = (emailId) => {
    const selectedIndex = selectedApprovedEmails.indexOf(emailId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedApprovedEmails, emailId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedApprovedEmails.slice(1));
    } else if (selectedIndex === selectedApprovedEmails.length - 1) {
      newSelected = newSelected.concat(selectedApprovedEmails.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedApprovedEmails.slice(0, selectedIndex),
        selectedApprovedEmails.slice(selectedIndex + 1)
      );
    }

    setSelectedApprovedEmails(newSelected);
  };

  const handleSelectAllEmails = (event) => {
    if (event.target.checked) {
      const newSelecteds = filtraEmailApprovate(emailApprovate).map((n) => n.id);
      setSelectedApprovedEmails(newSelecteds);
      return;
    }
    setSelectedApprovedEmails([]);
  };
  


  const deleteSelectedApprovedEmails = async () => {
    try {
      const response = await fetch('/api/admin/delete-approved-emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedApprovedEmails), // `selectedApprovedEmails` è l'array degli ID delle email selezionate
      });
      if (response.ok) {
        alert('Email approvate eliminate con successo.');
  
        // Aggiorna lo stato per riflettere i cambiamenti
        const updatedApprovedEmails = emailApprovate.filter(email => !selectedApprovedEmails.includes(email.id));
        setEmailApprovate(updatedApprovedEmails);
        
        // Resetta le email selezionate dopo l'eliminazione
        setSelectedApprovedEmails([]);
  
      } else {
        alert('Errore nell\'eliminazione delle email approvate.');
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione delle email approvate:', error);
    }
  };
  
  

  const handleSelect = (id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }
  
    setSelectedUsers(newSelected);
  };
  
  const handleSelectAllClick = (event) => {
    // Prima filtra gli utenti basandoti sui criteri attuali
    const filteredUsers = filtraUtenti(utenti);
  
    if (event.target.checked) {
      // Seleziona solo gli ID degli utenti filtrati
      const newSelecteds = filteredUsers.map((n) => n.id);
      setSelectedUsers(newSelecteds);
      return;
    }
    setSelectedUsers([]);
  };

  const richiesteFiltrate = richiesteEmail.filter((richiesta) => 
  richiesta.email.toLowerCase().includes(filtroEmailRichiesta.toLowerCase())
);

  
const handleOpenConfirmDialog = (action, id = null) => {
  let actionTitle, actionMessage;

  if (action === "approve") {
    actionTitle = "Conferma Approvazione";
    actionMessage = id ? "Sei sicuro di voler approvare questa email?" : "Sei sicuro di voler approvare le email selezionate?";
  } else if (action === "reject") {
    actionTitle = "Conferma Rifiuto";
    actionMessage = id ? "Sei sicuro di voler rifiutare questa email?" : "Sei sicuro di voler rifiutare le email selezionate?";
  }
  
  setCurrentAction(action);
  setCurrentItemId(id);
  // Imposta titolo e messaggio qui
  setConfirmTitle(actionTitle);
  setConfirmMessage(actionMessage);
  setConfirmOpen(true);
};


const handleConfirm = () => {
  switch (currentAction) {
    case "approve":
      currentItemId ? approvaRichiesta(currentItemId) : approveSelectedEmailRequests();
      break;
    case "reject":
      currentItemId ? rifiutaRichiesta(currentItemId) : rejectSelectedEmailRequests();
      break;
    case "deleteSingle":
    case "deleteMultiple":
      handleConfirmDelete();
      break;
    default:
      console.log("Azione non riconosciuta");
  }

  // Chiudi il dialogo e resetta lo stato
  setConfirmOpen(false);
  setCurrentAction(null);
  setCurrentItemId(null);
};



const handleOpenConfirmDialogForDelete = (emailId = null) => {
  const actionType = emailId ? "deleteSingle" : "deleteMultiple";
  const actionTitle = emailId ? "Conferma Eliminazione" : "Conferma Eliminazione Multipla";
  const actionMessage = emailId ? "Sei sicuro di voler eliminare questa email?" : "Sei sicuro di voler eliminare le email selezionate?";
  
  setCurrentAction(actionType);
  setCurrentItemId(emailId);
  // Novità: Imposta titolo e messaggio qui
  setConfirmTitle(actionTitle);
  setConfirmMessage(actionMessage);
  setConfirmOpen(true);
};


const handleConfirmDelete = () => {
  if (currentAction === "deleteSingle" && currentItemId) {
    eliminaEmailApprovata(currentItemId);
  } else if (currentAction === "deleteMultiple") {
    deleteSelectedApprovedEmails();
  }

  // Chiudi il dialogo e resetta lo stato
  setConfirmOpen(false);
  setCurrentAction(null);
  setCurrentItemId(null);
};



  return (
    <>
  
  <ConfirmDialog
  open={confirmOpen}
  onClose={() => {
    setConfirmOpen(false);
    setCurrentAction(null);
    setCurrentItemId(null);
  }}
  onConfirm={handleConfirm}
  title={confirmTitle} // Assicurati che queste variabili di stato siano aggiornate
  message={confirmMessage}
/>

          

    <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
    <h2>Assegna Ruolo</h2>
    <FilterContainer>
      <SmallTextField
        label="Cerca per Email"
        variant="outlined"
        size="small"
        value={filtroEmailRuolo}
        onChange={(e) => setFiltroEmailRuolo(e.target.value)}
      />
      <Select
        value={filtroRuolo}
        onChange={(e) => setFiltroRuolo(e.target.value)}
        displayEmpty
        size="small"
        inputProps={{ 'aria-label': 'Filtra per Ruolo' }}
      >
        <MenuItem value="">Tutti</MenuItem>
        <MenuItem value="ROLE_USER">Utente</MenuItem>
        <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
      </Select>
    </FilterContainer>
    <CustomTableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
      <TableHead>
        <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={indeterminate}
            checked={checked}
            onChange={handleSelectAllClick}
          />
        </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Ruolo Utente</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Stato Verifica</TableCell> 
        </TableRow>
      </TableHead>
      <TableBody>
      {filtraUtenti(utenti).map((utente, index) => (
          <TableRow key={utente.id} sx={{ bgcolor: index % 2 ? '#f5f5f5' : 'white' }}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedUsers.indexOf(utente.id) !== -1}
                onChange={() => handleSelect(utente.id)}
              />
            </TableCell>
            <TableCell>{utente.email}</TableCell>
            <TableCell>
            <Select
              autoWidth
              value={utente.roles[0]?.name || ''}
              onChange={(e) => utente.emailVerified && assignRole(utente.email, e.target.value)}
              disabled={!utente.emailVerified}
              sx={{
                fontSize: '0.8rem', // riduci la dimensione del font se necessario
                height: '30px', // riduci l'altezza della Select
                margin: 'auto', // centra la Select all'interno della TableCell se necessario
                '& .MuiSelect-select': { // aggiungere stili specifici per l'elemento interno della Select
                  paddingTop: '5px', // riduci il padding superiore
                  paddingBottom: '5px', // riduci il padding inferiore
                },
              }}
              size="small" 
            >
              <MenuItem value="ROLE_USER">Utente</MenuItem>
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            </Select>
            </TableCell>
            <TableCell>
      {utente.emailVerified ? 
        <Chip label="Verificato" color="success" size="small" /> : 
        <Chip label="Non Verificato" color="error" size="small" />}
          </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CustomTableContainer>
          </div>
          <div style={{ marginBottom: '20px', paddingLeft: '153px' }}>
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          displayEmpty
          size="small"
          style={{ marginRight: '10px' }}
        >
          <MenuItem value="">Seleziona il ruolo</MenuItem>
          <MenuItem value="ROLE_USER">Utente</MenuItem>
          <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => assignRolesToSelectedUsers(selectedRole)}
          disabled={selectedUsers.length === 0 || selectedRole === ''}
        >
          Assegna Ruolo Selezionato
        </Button>
      </div>

    <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h2>Aggiungi Email Approvate</h2>
        <ActionContainer>
          <InputContainer>
        <MyTextField
          label="Email da aggiungere"
          variant="outlined"
          value={emailDaAggiungere}
          onChange={(e) => setEmailDaAggiungere(e.target.value)}
          
          style={{ marginRight: '10px' }}
        />
        <MyButton variant="contained" color="primary" onClick={aggiungiEmailApprovata}>
          Aggiungi Email
        </MyButton>
        </InputContainer>
        </ActionContainer>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h2>Email Approvate</h2>
        <FilterContainer>
          <SmallTextField
            label="Cerca per Email"
            variant="outlined"
            size="small"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />
          <Select
            value={filtroStato}
            onChange={handleFiltroStatoChange}
            displayEmpty
            size="small"
            inputProps={{ 'aria-label': 'Filtra per Stato' }}
          >
            <MenuItem value="">Tutti</MenuItem>
            <MenuItem value="Registrata">Registrata</MenuItem>
            <MenuItem value="Non registrata">Non registrata</MenuItem>
          </Select>
        </FilterContainer>
        <CustomTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedApprovedEmails.length > 0 && selectedApprovedEmails.length < filtraEmailApprovate(emailApprovate).length}
                  checked={filtraEmailApprovate(emailApprovate).length > 0 && selectedApprovedEmails.length === filtraEmailApprovate(emailApprovate).length}
                  onChange={handleSelectAllEmails}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stato Registrazione</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stato Richiesta</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Modifica</TableCell> {/* Colonna Modifica */}
              <TableCell sx={{ fontWeight: 'bold' }}>Elimina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtraEmailApprovate(emailApprovate).map((email) => (
              <TableRow key={email.id} style={email.status === 'PENDING' ? { backgroundColor: 'rgba(0, 0, 0, 0.05)' } : {}}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedApprovedEmails.indexOf(email.id) !== -1}
                    onChange={() => handleSelectEmail(email.id)}
                  />
                </TableCell>
                <TableCell>{email.email}</TableCell>
                <TableCell>
                  <Chip
                    label={email.registered ? "Registrata" : "Non registrata"} size="small"
                    color={email.registered ? "success" : "error"} 
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={email.status === 'APPROVED' ? "Approvata" : "Non approvata"} size="small"
                    color={email.status === 'APPROVED' ? "success" : "error"} 
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => apriDialogModifica(email.email, email.id)}
                    style={{ color: 'black' }}
                  >
                    <AiTwotoneEdit size={"1.7em"} />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenConfirmDialogForDelete(email.id)}
                    //onClick={() => eliminaEmailApprovata(email.id)}
                    style={{ color: 'black' }}
                  >
                    <AiTwotoneDelete size={"1.7em"} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
        </CustomTableContainer>
      </div>
      <div style={{ marginBottom: '20px', paddingLeft: '153px' }}>
          <Button
            variant="contained"
            color="error"
            //onClick={deleteSelectedApprovedEmails}
            onClick={() => handleOpenConfirmDialogForDelete()}
            disabled={selectedApprovedEmails.length === 0}
          >
            Elimina Email Selezionate
          </Button>

      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h2>Richieste di Approvazione Email</h2>
        <FilterContainer>
        <SmallTextField
          label="Cerca per Email"
          variant="outlined"
          value={filtroEmailRichiesta}
          size='small'
          onChange={(e) => setFiltroEmailRichiesta(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        </FilterContainer>
        <CustomTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedEmailRequests.length > 0 && selectedEmailRequests.length < richiesteEmail.length}
                      checked={richiesteEmail.length > 0 && selectedEmailRequests.length === richiesteEmail.length}
                      onChange={handleSelectAllEmailRequests}
                    />
                  </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Approva</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Disapprova</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
              {richiesteFiltrate.map((richiesta) => (
                <TableRow key={richiesta.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmailRequests.indexOf(richiesta.id) !== -1}
                      onChange={() => handleSelectEmailRequest(richiesta.id)}
                    />
                  </TableCell>
                  <TableCell>{richiesta.email}</TableCell>
                  <TableCell align="center"> {/* Centra l'icona nella cella */}
                    <Button onClick={() => handleOpenConfirmDialog("approve", richiesta.id)} style={{minWidth: "auto", padding: "6px", color: "primary"}}>
                      <FcApprove size="24" />
                    </Button>
                  </TableCell>
                  <TableCell align="center"> {/* Centra l'icona nella cella */}
                    <Button onClick={() => handleOpenConfirmDialog("reject", richiesta.id)} style={{minWidth: "auto", padding: "6px", color: "secondary"}}>
                      <FcDisapprove size="24" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CustomTableContainer>
      </div>
      <div style={{ marginBottom: '20px', paddingLeft: '153px' }}>
        <Box display="flex" gap={2}> {/* Usa 'gap' per definire lo spazio tra gli elementi */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenConfirmDialog("approve")}
            //onClick={approveSelectedEmailRequests}
            disabled={selectedEmailRequests.length === 0}
          >
            Approva Selezionate
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenConfirmDialog("reject")}
            //onClick={rejectSelectedEmailRequests}
            disabled={selectedEmailRequests.length === 0}
          >
            Rifiuta Selezionate
          </Button>
        </Box>
      </div>

      <Dialog open={isDialogOpen} onClose={chiudiDialog}>
        <DialogTitle>Modifica Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Nuova Email"
            type="email"
            fullWidth
            variant="outlined"
            value={emailDaModificare}
            onChange={(e) => setEmailDaModificare(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={chiudiDialog}>Annulla</Button>
          <Button onClick={modificaEmailApprovata}>Salva</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UtentiTable;

