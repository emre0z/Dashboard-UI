import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Modal,
    Typography,
    List,
    ListItem,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UrlSection from './UrlSection';
import InfoSection from './InfoSection';
import api from '../services/api'; // API servisi

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const ProjectTable = (props) => {
    const [mainTopics, setMainTopics] = useState([]); // Başlıklar için state
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMainTopicId, setSelectedMainTopicId] = useState('');
    const [projectName, setProjectName] = useState('');
    const [editData, setEditData] = useState(null);
    const [urlRows, setUrlRows] = useState([]);
    const [infoRows, setInfoRows] = useState([]);
    const [deletedUrls, setDeletedUrls] = useState([]);
    const [deletedInfos, setDeletedInfos] = useState([]);

    // MainTopic verilerini backend'den çek
    useEffect(() => {
        api.get('/MainTopic')
            .then((response) => setMainTopics(response.data))
            .catch((error) => console.error('Başlıklar yüklenirken hata:', error));
    }, []);

    const handleCreateProject = () => {
        const newProject = {
            mainTopicId: selectedMainTopicId,
            tittle: projectName,
            urls: urlRows,
            infos: infoRows,
        };

        api.post('/SubTopic', newProject)
            .then((response) => {
                // Modal alanlarını temizle
                setSelectedMainTopicId('');
                setProjectName('');
                setUrlRows([]);
                setInfoRows([]);
                setModalOpen(false);
            })
            .catch((error) => console.error('Yeni proje eklenirken hata:', error));

    };

    const handleDeleteProject = (id) => {
        api.delete(`/SubTopic/${id}`)
            .then(() => props.fetchProjects())
            .catch((error) => console.error('Proje silinirken hata:', error));
    };

    const handleEditClick = (project) => {
        setEditData(project);
        setSelectedMainTopicId(project.mainTopicId || '');
        setProjectName(project.tittle || '');

        // URL ve Info verilerini modalda göstermek için backend'den çek
        api.get(`/URL/subtopic/${project.id}`)
            .then((response) => setUrlRows(response.data))
            .catch((error) => console.error('URL verileri yüklenirken hata:', error));

        api.get(`/Info/subtopic/${project.id}`)
            .then((response) => setInfoRows(response.data))
            .catch((error) => console.error('Info verileri yüklenirken hata:', error));

        setModalOpen(true);
    };

    const handleSaveChanges = () => {
        console.log(editData);
        const updatedProject = {
            //...editData,
            id: editData.id,
            mainTopicId: selectedMainTopicId,
            tittle: projectName,
            urls: urlRows,
            infos: infoRows,
        };

        // SubTopic güncelle
        api.put(`/SubTopic/${editData.id}`, updatedProject)
            .then(() => {
                props.fetchProjects(); // Tabloyu güncelle

                // URL silinenleri backend'e gönder
                /*deletedUrls.forEach((url) => {
                    api.delete(`/URL/${url.id}`).catch((error) =>
                        console.error('URL silinirken hata:', error)
                    ); 
                }); 

                // Info silinenleri backend'e gönder
                deletedInfos.forEach((info) => {
                    api.delete(`/Info/${info.id}`).catch((error) =>
                        console.error('Info silinirken hata:', error)
                    );
                }); 

                // URL güncelle veya ekle
                urlRows.forEach((url) => {
                    if (url.id) {
                        api.put(`/URL/${url.id}`, url).catch((error) =>
                            console.error('URL güncellenirken hata:', error)
                        );
                    } else {
                        api.post('/URL', { ...url, subTopicId: editData.id }).catch((error) =>
                            console.error('URL eklenirken hata:', error)
                        );
                    }
                });

                // Info güncelle veya ekle
                infoRows.forEach((info) => {
                    if (info.id) {
                        api.put(`/Info/${info.id}`, info).catch((error) =>
                            console.error('Info güncellenirken hata:', error)
                        );
                    } else {
                        api.post('/Info', { ...info, subTopicId: editData.id }).catch((error) =>
                            console.error('Info eklenirken hata:', error)
                        );
                    }
                }); */

                setModalOpen(false);
            })
            .catch((error) => console.error('Proje düzenlenirken hata:', error));
    };

    return (
        <>
            <Box sx={{ width: '100%', marginTop: 5 }}>
                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
                    Projeler
                </Typography>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '30%' }}>Başlık</TableCell>
                                <TableCell sx={{ width: '40%' }}>Proje Adı</TableCell>
                                <TableCell sx={{ width: '30%', textAlign: 'center' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props?.projects?.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        {mainTopics.find((mt) => mt.id === project.mainTopicId)?.tittle || 'Bilinmiyor'}
                                    </TableCell>
                                    <TableCell>{project.tittle}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditClick(project)}
                                            >
                                                Düzenle
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                Sil
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {editData ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
                    </Typography>
                    <List sx={{ py: 0, width: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', marginBottom: 2 }}>
                        <ListItem>
                            <FormControl fullWidth>
                                <InputLabel id="main-topic-select-label">Başlık Seçiniz</InputLabel>
                                <Select
                                    labelId="main-topic-select-label"
                                    value={selectedMainTopicId}
                                    onChange={(e) => setSelectedMainTopicId(e.target.value)}
                                >
                                    {mainTopics.map((mainTopic) => (
                                        <MenuItem key={mainTopic.id} value={mainTopic.id}>
                                            {mainTopic.tittle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <TextField
                                label="Proje Adı Giriniz"
                                variant="outlined"
                                fullWidth
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <UrlSection
                                urlData={urlRows}
                                setUrlData={setUrlRows}
                                onDelete={(url) =>
                                    setDeletedUrls((prev) => [...prev, url])
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <InfoSection
                                infoData={infoRows}
                                setInfoData={setInfoRows}
                                onDelete={(info) =>
                                    setDeletedInfos((prev) => [...prev, info])
                                }
                            />
                        </ListItem>
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={editData ? handleSaveChanges : handleCreateProject}
                        >
                            {editData ? 'Değişiklikleri Kaydet' : 'Kaydet'}
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => setModalOpen(false)}>
                            Vazgeç
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ProjectTable;
