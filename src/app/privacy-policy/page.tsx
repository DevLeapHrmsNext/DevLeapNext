import LeapHeader from "../components/header";
import { pageURL_defaultLogin } from "../pro_utils/stringRoutes";

export default function PrivacyPolicy() {
  return (
    <>
      {/* <header style={styles.header}>
        <div style={styles.logo}>LEAP</div>
        <nav>
          <link style={styles.link} href="/">Home</link>
          <link style={styles.link} href="/features">Features</link>
          <link style={styles.link} href="/pricing">Pricing</link>
        </nav>
        <a href={pageURL_defaultLogin}><button style={styles.signinBtn}>Sign In</button></a>
      </header> */}
      <header>
        <LeapHeader title={""} />
      </header>
      <div style={styles.banner}>
        <h1 style={styles.bannerTitle}>
          Privacy Policy for <span style={styles.highlight}>LEAP HRMS</span>
        </h1>
        <p>Your privacy is important to us. Here&apos;s how we protect your data.</p>
      </div>

      <main style={styles.content}>
        <h2 style={styles.sectionTitle}> Introduction</h2>
        <p>
          At Evonix Technologies Private Limited (Evonix, we, us, or our), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website Evonix.co (the “Website”) or use our services, including payment processing functionalities. By accessing or using our Website and services, you agree to the terms of this Privacy Policy.
        </p>

        <h2 style={styles.sectionTitle}>1. Data Collection</h2>
        <p>We may collect the following types of information:</p>
        <p>Personal Information: When you interact with our Website or services, such as making a payment, we may collect personal details including but not limited to:
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing address</li>
          </ul></p>
        <p>Non-Personal Information: We may collect non-identifiable data such as:
          <ul>
            <li>Browser type and version</li>
            <li>IP address</li>
            <li>Device information</li>
            <li>Usage data (e.g., pages visited, time spent on the Website)</li>
          </ul></p>
        <p>Payment-Related Information: When you use our payment gateway, we collect transaction details necessary to process payments securely. Sensitive payment data (e.g., card numbers) is handled by our trusted third-party payment processors and is not stored directly by us.</p>
        <p>When you voluntarily send us electronic mail / fillup the form, we will keep a record of this information so that we can respond to you. We only collect information from you when you register on our site or fill out a form. Also, when filling out a form on our site, you may be asked to enter your: name, e-mail address or phone number. You may, however, visit our site anonymously. In case you have submitted your personal information and contact details, we reserve the rights to Call, SMS, Email or WhatsApp about our products and offers, even if your number has DND activated on it.</p>

        <h2 style={styles.sectionTitle}>2. How We Collect Information</h2>
        <p>We collect information in the following ways:
          <ul>
            <li>Directly from You: When you provide details during account creation, payment transactions, or form submissions.</li>
            <li>Automatically: Through cookies, web beacons, and similar technologies that track your interaction with our Website.</li>
            <li>Third Parties: From payment gateway providers or analytics services to facilitate transactions and improve our offerings.</li>
          </ul></p>

        <h2 style={styles.sectionTitle}>3. How We Use Your Information</h2>
        <p>We use information we collect to:
          <ul>
            <li>Process and complete payment transactions securely</li>
            <li>Provide, maintain, and improve our Website and services.</li>
            <li>Communicate with you, including responding to inquiries or sending transactional emails (e.g., payment confirmations).</li>
            <li> Ensure the security of our Website and prevent fraudulent activities.</li>
            <li>Comply with legal obligations and resolve disputes.</li>
            <li>Analyze usage trends to enhance user experience.</li>
          </ul></p>

        <h2 style={styles.sectionTitle}>4. Sharing Your Information</h2>
        <p>We do not sell or rent your personal information. We may share your information with:
          <ul>
            <li>Payment Processors: Third-party payment gateway providers (e.g., Razorpay, Stripe, PayPal) to process transactions securely. These providers have their own privacy policies, which we encourage you to review.</li>
            <li>Service Providers: Trusted partners who assist us in operating our Website, conducting business, or providing analytics, under strict confidentiality agreements.</li>
            <li>Legal Authorities: When required by law, regulation, or legal process, or to protect the rights, property, or safety of Evonix, our users, or others.</li>
          </ul></p>

        <h2 style={styles.sectionTitle}>5. Security of Your Information</h2>
        <p>We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no online system is 100% secure, and we cannot guarantee absolute security of data transmitted over the internet.</p>

        <h2 style={styles.sectionTitle}>6.  Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar technologies to enhance your experience, analyze usage, and facilitate payment processes. You can manage your cookie preferences through your browser settings, though disabling cookies may affect Website functionality.</p>

        <h2 style={styles.sectionTitle}>7.  Your Rights and Choices</h2>
        <p>Depending on your jurisdiction, you may have rights such as:
          <ul>
            <li>Accessing or correcting your personal information.</li>
            <li>Requesting deletion of your data (subject to legal obligations).</li>
            <li>Opting out of marketing communications.</li>
          </ul>
          To exercise these rights, please contact us at <b>info@evonix.co</b></p>

        <h2 style={styles.sectionTitle}>8. Third-Party Services</h2>
        <p>Our Website may contain links to third-party sites (e.g., payment gateways). We are not responsible for the privacy practices or content of these external sites. We recommend reviewing their privacy policies before providing any information.</p>

        <h2 style={styles.sectionTitle}>9.  International Data Transfers</h2>
        <p>If you are located outside India, your information may be transferred to and processed in India or other countries where our service providers operate. We ensure appropriate safeguards are in place to protect your data.</p>

        <h2 style={styles.sectionTitle}>10. Retention of Information</h2>
        <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, or resolve disputes.</p>

        <h2 style={styles.sectionTitle}>11. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised “Effective Date.” We encourage you to review this policy periodically.</p>

        <h2 style={styles.sectionTitle}>12. Contact Us</h2>
        <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us at:<br />
        </p><p>Evonix Technologies Private Limited<br />
          Akruti Avenues, 402-403,<br />
          Datta Mandir Rd, Shankar Kalat<br />
          Nagar, Wakad, Pune,<br />
          Maharashtra 411057<br />
          Email: hello@evonix.co<br />
          Phone: +91-7888000375</p>
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
