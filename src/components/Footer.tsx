import './Footer.css';

// Import social icons
import InstagramIcon from '../assets/instagram.jfif';
import FacebookIcon from '../assets/facebook.png';
import TikTokIcon from '../assets/tiktok.jfif';

// Import payment icons for the trust bar
import CBELogo from '../assets/cbe.jfif';
import TelebirrLogo from '../assets/telebirr.png';

const Footer = () => {
  // Logic to show Ethiopian Year (roughly Gregorian - 7)
  const gregorianYear = new Date().getFullYear();
  const ethiopianYear = gregorianYear - 7;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Column 1: Help & Support */}
          <div className="footer-section">
            <h4 className="footer-title">Help</h4>
            <ul className="footer-list">
              <li>
                <span className="footer-heading">Shipping & Returns</span>
                <p className="footer-text">
                  We provide fast, reliable shipping across Ethiopia. Returns are accepted within 30 days of purchase, provided items are unworn and in original packaging.
                </p>
              </li>
              <li>
                <span className="footer-heading">Contact Us</span>
                <p className="footer-text">
                  <a href="mailto:Glamourboutique37@gmail.com" className="footer-link">
                    glamourboutique377@gmail.com
                  </a>
                  <br />
                  <a href="tel:0914454545" className="footer-link">
                    09 14 45 45 45
                  </a>
                </p>
              </li>
            </ul>
          </div>

          {/* Column 2: Social Media Connect */}
          <div className="footer-section">
            <h4 className="footer-title">Connect</h4>
            <ul className="footer-list">
              <li>
                <a href="https://www.instagram.com/glamourboutique669" target="_blank" rel="noopener noreferrer" className="footer-link social-link">
                  <img src={InstagramIcon} alt="Instagram" className="social-icon" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Glamour Boutique" target="_blank" rel="noopener noreferrer" className="footer-link social-link">
                  <img src={FacebookIcon} alt="Facebook" className="social-icon" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@glamourboutique" target="_blank" rel="noopener noreferrer" className="footer-link social-link">
                  <img src={TikTokIcon} alt="TikTok" className="social-icon" />
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: About The Brand */}
          <div className="footer-section">
            <h4 className="footer-title">About Us</h4>
            <p className="footer-text">
              At Glamour Boutique, we bring you carefully curated collections from trusted designers and brands.
              <br /><br />
              Whether you’re looking for everyday essentials or statement pieces, we have your choice in every size, every color, and every style.
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright-info">
            <p>© {ethiopianYear} E.C. GLAMOUR BOUTIQUE. All rights reserved.</p>
          </div>

          <div className="footer-payments">
            <span className="payment-label">Accepted Payments:</span>
            <div className="payment-icons">
              <img src={CBELogo} alt="CBE Bank" className="payment-mini-logo" />
              <img src={TelebirrLogo} alt="Telebirr" className="payment-mini-logo" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;