import React, { useState, useEffect } from 'react';
import UrlSection from '../components/UrlSection';
import InfoSection from '../components/InfoSection';
import ProjectTable from '../components/ProjectTable';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    Divider,
    Button,
    Dialog,
    Typography,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [selectedMainTopicId, setSelectedMainTopicId] = useState('');
    const [subTopicName, setSubTopicName] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [mainTopics, setMainTopics] = useState([]);
    const [urlData, setUrlData] = useState([]);
    const [infoData, setInfoData] = useState([]);

    // Projeleri backend'den çek
    const fetchProjects = () => {
        api.get('/SubTopic')
            .then((response) => setProjects(response.data))
            .catch((error) => console.error('Projeler yüklenirken hata:', error));
    };

    useEffect(() => {
        api.get('/MainTopic')
            .then((response) => setMainTopics(response.data))
            .catch((error) => console.error('MainTopic verileri yüklenirken hata:', error));
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSelectionChange = (event) => {
        setSelectedMainTopicId(event.target.value);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        fetchProjects();
        setModalOpen(false);
        setUrlData([]);
        setInfoData([]);
    };

    const handleCreateSubTopic = () => {
        const newSubTopic = {
            mainTopicId: selectedMainTopicId,
            tittle: subTopicName,
            urls: urlData,
            infos: infoData,
        };

        api.post('/SubTopic', newSubTopic)
            .then(() => {
                setSubTopicName('');
                setSelectedMainTopicId('');
                setModalOpen(false);
                fetchProjects();
            })
            .catch((error) => console.error('Proje oluşturulurken hata:', error));
    };

    return (
        <div>
            <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3 }}>
                Proje Yönetimi
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpenModal}
                    startIcon={<AddIcon />}
                >
                    Yeni Proje Oluştur
                </Button>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 4 }}>
                <ProjectTable projects={projects} fetchProjects={fetchProjects} />
            </Box>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Yeni Proje Oluştur
                    </Typography>

                    <List
                        sx={{
                            py: 0,
                            width: '100%',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                            marginBottom: 2,
                        }}
                    >
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="main-topic-select-label">Başlık Seçiniz</InputLabel>
                                    <Select
                                        labelId="main-topic-select-label"
                                        value={selectedMainTopicId}
                                        onChange={handleSelectionChange}
                                    >
                                        {mainTopics.map((mainTopic) => (
                                            <MenuItem key={mainTopic.id} value={mainTopic.id}>
                                                {mainTopic.tittle}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    label="Proje Adı Giriniz"
                                    variant="outlined"
                                    fullWidth
                                    value={subTopicName}
                                    onChange={(e) => setSubTopicName(e.target.value)}
                                    sx={{ marginTop: 2 }}
                                />
                            </Box>
                        </ListItem>
                        <Divider />
                    </List>

                    <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'center' }}>
                        <UrlSection urlData={urlData} setUrlData={setUrlData} />
                    </Box>

                    <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'center' }}>
                        <InfoSection infoData={infoData} setInfoData={setInfoData} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" color="success" onClick={handleCreateSubTopic}>
                            Kaydet
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleCloseModal}>
                            Vazgeç
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
};

export default ProjectManagement;

