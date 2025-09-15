
export default function TermsAndConditions() {
    return (
        <>
            <header style={styles.header}>
                <div style={styles.logo}>LEAP</div>
                <nav>
                    {/* <a style={styles.link} href="/">Home</a>
                    <a style={styles.link} href="/features">Features</a>
                    <a style={styles.link} href="/pricing">Pricing</a> */}
                </nav>
                <button style={styles.signinBtn}>Sign In</button>
            </header>

            <div style={styles.banner}>
                <h1 style={styles.bannerTitle}>
                    Terms and Conditions for <span style={styles.highlight}>LEAP HRMS</span>
                </h1>
                <p>Please read these terms carefully before using our services.</p>
            </div>

            <main style={styles.content}>
                <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using LEAP HRMS, you accept and agree to be bound by these terms and conditions.
                </p>

                <h2 style={styles.sectionTitle}>2. Use of the Service</h2>
                <p>
                    You agree to use the platform only for lawful purposes and in a way that does not violate the rights of others.
                </p>

                <h2 style={styles.sectionTitle}>3. User Accounts</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
                </p>

                <h2 style={styles.sectionTitle}>4. Intellectual Property</h2>
                <p>
                    All content and software provided on LEAP HRMS is the property of the company and protected by applicable laws.
                </p>

                <h2 style={styles.sectionTitle}>5. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to the service at any time without notice if you violate these terms.
                </p>

                <h2 style={styles.sectionTitle}>6. Limitation of Liability</h2>
                <p>
                    LEAP HRMS is not liable for any damages arising from the use or inability to use the service.
                </p>

                <h2 style={styles.sectionTitle}>7. Changes to Terms</h2>
                <p>
                    We may update these terms at any time. Continued use of the service implies acceptance of the updated terms.
                </p>

                <h2 style={styles.sectionTitle}>8. Contact Information</h2>
                <p>
                    If you have any questions about these terms, contact us at <strong>support@leaphrms.com</strong>.
                </p>
            </main>

            <footer style={styles.footer}>
                © 2025 LEAP HRMS. All rights reserved.
            </footer>
        </>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        background: '#fff',
        padding: '16px 48px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    logo: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    link: {
        marginRight: '20px',
        textDecoration: 'none',
        color: '#000',
        fontWeight: 500,
    },
    signinBtn: {
        backgroundColor: '#e53935',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    banner: {
        textAlign: 'center',
        padding: '80px 40px',
        background: 'radial-gradient(circle at center, rgba(243, 113, 113, 0.1), transparent)',
    },
    bannerTitle: {
        fontSize: '3rem',
        marginBottom: '10px',
        fontWeight: 700,
    },
    highlight: {
        color: '#e53935',
    },
    content: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
        lineHeight: '1.7',
    },
    sectionTitle: {
        color: '#e53935',
        fontSize: '1.5rem',
        marginTop: '40px',
    },
    footer: {
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '14px',
        borderTop: '1px solid #eee',
        marginTop: '40px',
    },
};
