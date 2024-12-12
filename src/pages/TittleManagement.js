import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TableFooter,
    TablePagination,
    Typography,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api'; // API servisimizi kullanıyoruz

function TittleManagement() {
    const [rows, setRows] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [error, setError] = useState({ type: '', message: '' });
    const [alertMessage, setAlertMessage] = useState('');

    const getData = () => {
        api.get('/MainTopic')
            .then((response) => {
                setRows(response.data); // Başlıkları state'e kaydet
            })
            .catch((error) => {
                console.error('Başlıklar yüklenirken hata oluştu:', error);
            });
    }

    // Başlıkları API'den al
    useEffect(() => {
        getData();
    }, []);

    // Yeni başlık ekle
    const handleAddTitle = () => {
        if (newTitle.trim()) {
            // Eğer başlık mevcutsa hata göster
            if (rows.some((row) => row.tittle.toLowerCase() === newTitle.trim().toLowerCase())) {
                setError({ type: 'add', message: 'Bu başlık zaten mevcut.' });
                return;
            }

            const newMainTopic = { tittle: newTitle };
            api.post('/MainTopic', newMainTopic)
                .then((response) => {
                    getData();
                    setNewTitle('');
                    setError({ type: '', message: '' });
                })
                .catch((error) => {
                    console.error('Başlık eklenirken hata oluştu:', error);
                });
        } else {
            setError({ type: 'add', message: 'Bu alan boş bırakılamaz.' });
        }
    };

    // Başlık sil
    const handleDelete = (id) => {
        api.delete(`/MainTopic/${id}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Başlık silinirken hata oluştu:', error);
            });
    };

    // Düzenleme
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    const handleEdit = (id, currentValue) => {
        setEditingIndex(id);
        setEditingValue(currentValue);
        setError({ type: '', message: '' });
        setAlertMessage('');
    };

    const handleEditSave = (id) => {
        if (editingValue.trim()) {
            // Eğer aynı isimde bir başlık varsa hata göster
            if (
                rows.some(
                    (row) => row.id !== id && row.tittle.toLowerCase() === editingValue.trim().toLowerCase()
                )
            ) {
                setError({ type: 'edit', message: 'Bu başlık zaten mevcut.' });
                return;
            }

            const updatedMainTopic = { id, tittle: editingValue };
            api.put(`/MainTopic/${id}`, updatedMainTopic)
                .then(() => {
                    getData();

                    setEditingIndex(null);
                    setEditingValue('');
                    setError({ type: '', message: '' });
                })
                .catch((error) => {
                    console.error('Başlık düzenlenirken hata oluştu:', error);
                });
        } else {
            setError({ type: 'edit', message: 'Bu alan boş bırakılamaz.' });
        }
    };

    const handleKeyPress = (event, id) => {
        if (event.key === 'Enter') {
            handleEditSave(id);
        }
    };

    // Sayfa değişikliği
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Sayfa başına satır sayısını değiştirme
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Başlık Yönetimi
            </Typography>

            {/* Başlık Ekleme Alanı */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Başlık Giriniz"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    error={error.type === 'add'}
                />
                <Button variant="contained" color="success" onClick={handleAddTitle}>
                    Ekle
                </Button>
            </Box>
            {error.type === 'add' && (
                <Alert variant="outlined" severity="warning" sx={{ mb: 3 }}>
                    {error.message}
                </Alert>
            )}

            {/* Tablo Alanı */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }}>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    {editingIndex === row.id ? (
                                        <>
                                            <TextField
                                                fullWidth
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, row.id)}
                                                error={error.type === 'edit'}
                                            />
                                            {error.type === 'edit' && (
                                                <Alert variant="outlined" severity="warning" sx={{ mt: 1 }}>
                                                    {error.message}
                                                </Alert>
                                            )}
                                        </>
                                    ) : (
                                        row.tittle
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {editingIndex === row.id ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditSave(row.id)}
                                        >
                                            Kaydet
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mr: 2 }}
                                            onClick={() => handleEdit(row.id, row.tittle)}
                                        >
                                            Düzenle
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        sx={{
                                            color: 'red',
                                            borderColor: 'red',
                                            '&:hover': {
                                                borderColor: 'darkred',
                                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                            },
                                        }}
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Boş Satırları Doldurma */}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={2}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            {alertMessage && (
                <Alert variant="outlined" severity="info" sx={{ mt: 2 }}>
                    {alertMessage}
                </Alert>
            )}
        </div>
    );
}

export default TittleManagement;
