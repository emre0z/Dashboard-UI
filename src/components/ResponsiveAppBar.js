import * as React from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';

const pages = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Başlık Yönetimi', path: '/title-management' },
    { name: 'Proje Yönetimi', path: '/project-management' },
];

function ResponsiveAppBar() {
    const location = useLocation();

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Icon ve başlık sol tarafa hizalama */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <ArticleIcon sx={{ ml: 1, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Proje Yönetimi
                        </Typography>
                    </Box>

                    {/* Boşluğu doldurarak butonları sağa iten bir boşluk kutusu */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Butonları sağa hizalamak için */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {pages.map((page, index) => (
                            <React.Fragment key={page.name}>
                                <Button
                                    component={Link}
                                    to={page.path}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                        mx: 1,
                                        boxShadow: location.pathname === page.path ? 3 : 0,
                                        borderBottom: location.pathname === page.path ? '2px solid white' : 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    {page.name}
                                </Button>
                                {index < pages.length - 1 && (
                                    <Divider
                                        orientation="vertical"
                                        sx={{
                                            height: 28,
                                            mx: 2,
                                            backgroundColor: 'white',
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;

