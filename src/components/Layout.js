import React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar'; // Yeni AppBar bileşeni içe aktarılır.

function Layout({ children }) {
    return (
        <div style={styles.layoutContainer}>
            <ResponsiveAppBar /> {/* Proje Yönetimi başlığı ve butonlar burada */}
            <main style={styles.contentContainer}>
                {children}
            </main>
        </div>
    );
}

const styles = {
    layoutContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        paddingTop: '20px',
    },
    contentContainer: {
        width: '80%',
        maxWidth: '600px',
        marginTop: '20px',
    },
};

export default Layout;

