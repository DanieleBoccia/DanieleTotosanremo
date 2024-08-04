import React, {useState} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { TiUserAdd } from "react-icons/ti";
import { MdSaveAlt } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { Alert } from '@mui/material';





const CustomTableContainer = styled(TableContainer)({
    maxWidth: '80%', // Limita la larghezza massima al 80% del suo contenitore
    margin: 'auto', // Centra la tabella orizzontalmente
  });

const CantantiAdminTable = ({ cantanti, isAdmin, setCantanti }) => {

    const [newCantante, setNewCantante] = useState({ nome: '', brano: '', cover: '' });
    const [editCantanteId, setEditCantanteId] = useState(null); // Nuovo stato per tenere traccia della riga in modifica
    const [editFormData, setEditFormData] = useState({ nome: '', brano: '', cover: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    console.log("isAdmin:", isAdmin);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCantante({ ...newCantante, [name]: value });
      };

      const handleSubmit = async () => {
        if (!newCantante.nome.trim() || !newCantante.brano.trim() || !newCantante.cover.trim()) {
            setErrorMessage('Tutti i campi sono obbligatori.'); // Imposta il messaggio di errore
            setShowAlert(true); // Mostra l'alert
            return; // Interrompi l'esecuzione della funzione
          }
        
          // Se i campi sono compilati, nascondi l'alert e procedi con la logica di invio
          setShowAlert(false);


        try {
          const response = await fetch('/api/admin/cantanti/aggiungi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Qui potresti anche dover includere un header di autorizzazione se il tuo endpoint richiede autenticazione
            },
            body: JSON.stringify(newCantante),
          });
      
          if (response.ok) {
            const data = await response.json(); // Leggi il corpo della risposta una sola volta qui
            setCantanti(currentCantanti => [...currentCantanti, data]); // Usa 'data' per aggiungere il nuovo cantante all'elenco
            setNewCantante({ nome: '', brano: '', cover: '' }); // Resetta il form
          } else {
            const errorData = await response.json(); // Solo se devi leggere dati di errore dal corpo della risposta
            console.error('Errore durante l\'aggiunta del cantante:', errorData);
            setErrorMessage(errorData.message); // Imposta un messaggio di errore basato sulla risposta del server
            setShowAlert(true);
          }
        } catch (error) {
          console.error('Errore durante l\'inserimento del nuovo cantante:', error);
          setErrorMessage('Errore di rete o del server.'); // Imposta un messaggio di errore generico
          setShowAlert(true);
        }
      };
      

      const handleEditClick = (cantante) => {
        setEditCantanteId(cantante.id);
        setEditFormData({ nome: cantante.nome, brano: cantante.brano, cover: cantante.cover });
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSaveClick = async (id) => {
        // Verifica se i campi sono vuoti
        if (!editFormData.nome.trim() || !editFormData.brano.trim() || !editFormData.cover.trim()) {
            setErrorMessage('Tutti i campi sono obbligatori.');
            setShowAlert(true);
            return;
        }
    
        // Se i campi sono compilati, procedi con la logica di aggiornamento...
        setShowAlert(false); // Nascondi l'alert di eventuali errori precedenti
    
        const editedCantante = { ...editFormData };
        
        try {
            const response = await fetch(`/api/admin/cantanti/aggiorna/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Includi l'header Authorization se il tuo endpoint richiede autenticazione
                },
                body: JSON.stringify(editedCantante),
            });
    
            if (response.ok) {
                const updatedCantante = await response.json(); // Presumendo che il backend restituisca il cantante aggiornato
                const updatedCantanti = cantanti.map(cantante => 
                    cantante.id === id ? updatedCantante : cantante
                );
                setCantanti(updatedCantanti);
                setEditCantanteId(null); // Resetta l'ID di modifica per uscire dalla modalità di modifica
                setEditFormData({ nome: '', brano: '', cover: '' }); // Resetta i campi di input per la modifica
            } else {
                const errorData = await response.json(); // Leggi il corpo della risposta per ottenere il messaggio di errore
                console.error('Errore durante l\'aggiornamento del cantante:', errorData.message);
                setErrorMessage(errorData.message || 'Errore durante l\'aggiornamento del cantante');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Errore di rete durante l\'aggiornamento del cantante:', error);
            setErrorMessage('Errore di rete durante l\'aggiornamento del cantante');
            setShowAlert(true);
        }
    };
    


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/admin/cantanti/elimina/${id}`, {
                method: 'DELETE',
                // Includi headers per l'autenticazione se necessario
            });
    
            if (response.ok) {
                setCantanti(cantanti.filter(cantante => cantante.id !== id));
            } else {
                console.error('Errore durante l\'eliminazione del cantante.');
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione del cantante:', error);
        }
    };
    

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h2>LISTA CANTANTI SANREMO</h2>
        <CustomTableContainer component={Paper}>
        {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert(false)}>
            {errorMessage}
        </Alert>
        )}
        </CustomTableContainer>
        <CustomTableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nome e Cognome</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Titolo Brano</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Titolo Cover</TableCell>
                        {isAdmin && <TableCell sx={{ fontWeight: 'bold' }}>Azioni</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cantanti.map((cantante) => (
                        <TableRow key={cantante.id}>
                        {editCantanteId === cantante.id ? (
                            // Se la riga è in modifica, mostra i campi di input
                            <>
                                <TableCell>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nome Cantante"
                                        name="nome"
                                        value={editFormData.nome}
                                        onChange={handleEditFormChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Titolo Brano"
                                        name="brano"
                                        value={editFormData.brano}
                                        onChange={handleEditFormChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Titolo Cover"
                                        name="cover"
                                        value={editFormData.cover}
                                        onChange={handleEditFormChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleSaveClick(cantante.id)}>
                                        <MdSaveAlt color='green' size={"1.7em"}/>
                                    </Button>
                                    <Button onClick={() => setEditCantanteId(null)}>
                                        <MdCancel color='red' size={"1.7em"} />
                                    </Button>
                                </TableCell>
                            </>
                        ) : (
                            // Visualizzazione normale della riga
                            <>
                                <TableCell>{cantante.nome}</TableCell>
                                <TableCell>{cantante.brano}</TableCell>
                                <TableCell>{cantante.cover}</TableCell>
                                {isAdmin && (
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(cantante)}>
                                            <EditIcon color='primary'/>
                                        </Button>
                                        <Button onClick={() => handleDelete(cantante.id)}>
                                            <DeleteIcon color='error' />
                                        </Button>
                                    </TableCell>
                                )}
                            </>
                        )}
                    </TableRow>
                ))}
                    {/* Aggiungi qui sotto la riga per l'inserimento di un nuovo cantante */}
                    {isAdmin && (
                        <TableRow>
                        <TableCell>
                            <input
                            type="text"
                            placeholder="Nome Cantante"
                            name="nome"
                            value={newCantante.nome}
                            onChange={handleInputChange}
                            />
                        </TableCell>
                        <TableCell>
                            <input
                            type="text"
                            placeholder="Titolo Brano"
                            name="brano"
                            value={newCantante.brano}
                            onChange={handleInputChange}
                            />
                        </TableCell>
                        <TableCell>
                            <input
                            type="text"
                            placeholder="Titolo Cover"
                            name="cover"
                            value={newCantante.cover}
                            onChange={handleInputChange}
                            />
                        </TableCell>
                        <TableCell>
                            <Button onClick={handleSubmit}>
                            <TiUserAdd color='green' size={"1.7em"} />
                            </Button>
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
            </Table>
        </CustomTableContainer>
        </div>
    );
};

export default CantantiAdminTable;
