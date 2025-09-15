import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="copyright_box">
        Copyright &copy; 2025
        <Link href="https://www.evonix.co/" target="_blank" rel="noopener noreferrer" className="company-link">
        Evonix Technologies Pvt. Ltd.
        
        </Link> 
         All right reserved.
      </div>
    </footer>
  );
};

export default Footer;
