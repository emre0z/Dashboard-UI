import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function Navbar() {
    return (
        <nav>
            <Stack direction="row" spacing={2} style={{ margin: '10px' }}>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="primary"
                >
                    Anasayfa
                </Button>
                <Button
                    component={Link}
                    to="/title-management"
                    variant="contained"
                    color="secondary"
                >
                    Başlık Yönetimi
                </Button>
                <Button
                    component={Link}
                    to="/project-management"
                    variant="contained"
                    color="success"
                >
                    Proje Yönetimi
                </Button>
            </Stack>
        </nav>
    );
}

export default Navbar;

