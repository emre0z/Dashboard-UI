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

const InfoSection = ({ infoData = [], setInfoData = () => { }, onDelete = () => { } }) => {
    const [newInfo, setNewInfo] = useState({ infoKey: '', content: '' });
    const [editData, setEditData] = useState({ index: null, infoKey: '', content: '' });
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddInfo = () => {
        if (newInfo.infoKey && newInfo.content) {
            setInfoData((prev) => [...prev, newInfo]);
            setNewInfo({ infoKey: '', content: '' });
        } else {
            console.error('Tüm alanları doldurun!');
        }
    };

    const handleDeleteInfo = (index) => {
        const infoToDelete = infoData[index];
        setInfoData((prev) => prev.filter((_, i) => i !== index));
        if (infoToDelete?.id) {
            onDelete(infoToDelete);
        }
    };

    const handleEditClick = (row, index) => {
        setEditData({ ...row, index });
        setModalOpen(true);
    };

    const handleSaveChanges = () => {
        setInfoData((prev) =>
            prev.map((info, index) =>
                index === editData.index
                    ? { infoKey: editData.infoKey, content: editData.content }
                    : info
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
                            label="Info Anahtarı"
                            variant="outlined"
                            fullWidth
                            value={newInfo.infoKey}
                            onChange={(e) => setNewInfo({ ...newInfo, infoKey: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Info İçeriği"
                            variant="outlined"
                            fullWidth
                            value={newInfo.content}
                            onChange={(e) => setNewInfo({ ...newInfo, content: e.target.value })}
                        />
                    </Box>
                </ListItem>

                <ListItem>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddInfo}
                        >
                            Info Ekle
                        </Button>
                    </Box>
                </ListItem>

                <Divider />
                <ListItem>
                    <TableContainer component={Paper}>
                        <Table sx={{ tableLayout: 'fixed' }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Info Anahtarı</TableCell>
                                    <TableCell>Info İçeriği</TableCell>
                                    <TableCell align="right">İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {infoData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.infoKey}</TableCell>
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
                                                onClick={() => handleDeleteInfo(index)}
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
                        Info Düzğenle
                    </Typography>
                    <TextField
                        label="Info Anahtarı"
                        variant="outlined"
                        fullWidth
                        value={editData.infoKey}
                        onChange={(e) => setEditData({ ...editData, infoKey: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Info İçeriği"
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

export default InfoSection;
