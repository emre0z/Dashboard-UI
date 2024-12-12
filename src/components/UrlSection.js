import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Divider,
    List,
    ListItem,
    Modal,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const UrlSection = ({ urlData = [], setUrlData = () => { }, onDelete = () => { } }) => {
    const [newUrl, setNewUrl] = useState({ contentTittle: '', content: '' });
    const [editData, setEditData] = useState({ index: null, contentTittle: '', content: '' });
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddUrl = () => {
        if (newUrl.contentTittle && newUrl.content) {
            setUrlData((prev) => [...prev, newUrl]);
            setNewUrl({ contentTittle: '', content: '' });
        } else {
            console.error('Tüm alanları doldurun!');
        }
    };

    const handleDeleteUrl = (index) => {
        const urlToDelete = urlData[index];
        setUrlData((prev) => prev.filter((_, i) => i !== index));
        if (urlToDelete?.id) {
            onDelete(urlToDelete);
        }
    };

    const handleEditClick = (row, index) => {
        setEditData({ ...row, index });
        setModalOpen(true);
    };

    const handleSaveChanges = () => {
        setUrlData((prev) =>
            prev.map((url, index) =>
                index === editData.index
                    ? { contentTittle: editData.contentTittle, content: editData.content }
                    : url
            )
        );
        setModalOpen(false);
    };

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 600, marginBottom: 2 }}>
                <ListItem>
                    <Box sx={{ width: '100%' }}>
                        <TextField
                            label="Url Adı Giriniz"
                            variant="outlined"
                            fullWidth
                            value={newUrl.contentTittle}
                            onChange={(e) =>
                                setNewUrl({ ...newUrl, contentTittle: e.target.value })
                            }
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Url Giriniz"
                            variant="outlined"
                            fullWidth
                            value={newUrl.content}
                            onChange={(e) => setNewUrl({ ...newUrl, content: e.target.value })}
                        />
                    </Box>
                </ListItem>

                <ListItem>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddUrl}
                        >
                            Url Ekle
                        </Button>
                    </Box>
                </ListItem>

                <Divider />
                <ListItem>
                    <TableContainer component={Paper}>
                        <Table sx={{ tableLayout: 'fixed' }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Url Adı</TableCell>
                                    <TableCell>Url</TableCell>
                                    <TableCell align="right">İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {urlData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.contentTittle}</TableCell>
                                        <TableCell>{row.content}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditClick(row, index)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteUrl(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ListItem>
            </List>

            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        URL Düzğenle
                    </Typography>
                    <TextField
                        label="Url Adı"
                        variant="outlined"
                        fullWidth
                        value={editData.contentTittle}
                        onChange={(e) =>
                            setEditData({ ...editData, contentTittle: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Url"
                        variant="outlined"
                        fullWidth
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                    />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                            Kaydet
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setModalOpen(false)}
                        >
                            Vazgeç
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UrlSection;
