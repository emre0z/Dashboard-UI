import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Link,
    Button,
    Modal,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';

function Home() {
    const [titles, setTitles] = useState([]);
    const [projects, setProjects] = useState([]);
    const [expanded, setExpanded] = useState({}); // Accordion açık/kapalı durumu için state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);

    // Başlıkları ve projeleri API'den çek
    useEffect(() => {
        fetchTitles();
        fetchProjects();
    }, []);

    const fetchTitles = () => {
        api.get('/MainTopic')
            .then((response) => {
                setTitles(response.data);

                // Varsayılan olarak tüm Accordion'ları açık yap
                const defaultExpanded = {};
                response.data.forEach((title) => {
                    defaultExpanded[title.id] = true; // Varsayılan açık
                });
                setExpanded(defaultExpanded);
            })
            .catch((error) => console.error('Başlıklar yüklenirken hata:', error));
    };

    const fetchProjects = () => {
        api.get('/SubTopic')
            .then((response) => setProjects(response.data))
            .catch((error) => console.error('Projeler yüklenirken hata:', error));
    };

    const handleAccordionToggle = (id) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [id]: !prevExpanded[id], // Tıklanan Accordion'un durumunu değiştir
        }));
    };

    const handleOpenModal = (infoData) => {
        setModalContent(infoData);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
            }}
        >
            <Typography
                variant="h4"
                sx={{ textAlign: 'center', marginBottom: 2 }}
            >
                Anasayfa
            </Typography>
            <Typography sx={{ textAlign: 'center', marginBottom: 4 }}>
                Proje Yönetimi Anasayfasına Hoşgeldiniz!
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    minWidth: '2000px',
                }}
            >
                {titles.map((title) => (
                    <Accordion
                        key={title.id}
                        expanded={!!expanded[title.id]} // Accordion'un açık/kapalı durumu
                        onChange={() => handleAccordionToggle(title.id)}
                        sx={{
                            marginBottom: 2,
                            width: '100%',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel-${title.id}-content`}
                            id={`panel-${title.id}-header`}
                            sx={{
                                backgroundColor: '#f5f5f5',
                                '& .MuiTypography-root': {
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <Typography>{title.tittle}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {projects
                                    .filter((project) => project.mainTopicId === title.id)
                                    .map((project) => (
                                        <Grid item xs={3} key={project.id}>
                                            <Card sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
                                                <CardContent>
                                                    <Typography variant="h5" gutterBottom>
                                                        {project.tittle}
                                                    </Typography>
                                                    {project?.urLs?.length ? (
                                                        project.urLs.map((url, index) => (
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 1 }}
                                                                key={index}
                                                            >
                                                                <Link
                                                                    href={url.content}
                                                                    target="_blank"
                                                                    underline="hover"
                                                                >
                                                                    {url.contentTittle}
                                                                </Link>
                                                            </Typography>
                                                        ))
                                                    ) : (
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                        >
                                                            URL Adı bulunamadı.
                                                        </Typography>
                                                    )}
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ mt: 4 }}
                                                        onClick={() => handleOpenModal(project.infos)}
                                                    >
                                                        Info
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Proje Bilgisi
                    </Typography>
                    {modalContent.map((info, index) => (
                        <Typography key={index}>
                            {info.infoKey}: {info.content}
                        </Typography>
                    ))}
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleCloseModal}
                    >
                        Kapat
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default Home;




