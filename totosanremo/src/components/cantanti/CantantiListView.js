import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableContainer = styled(TableContainer)({
  maxWidth: '80%', // Keeps the maximum width consistent with the admin table
  margin: 'auto', // Centers the table horizontally
});

const CantantiListView = ({ cantanti }) => {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
      <h2>LISTA CANTANTI SANREMO</h2>
      <CustomTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome e Cognome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Titolo Brano</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Titolo Cover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cantanti.map((cantante) => (
              <TableRow key={cantante.id}>
                <TableCell>{cantante.nome}</TableCell>
                <TableCell>{cantante.brano}</TableCell>
                <TableCell>{cantante.cover}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </div>
  );
};

export default CantantiListView;

