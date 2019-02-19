export const Footer = ({ config }) => (
  <div className="footer">
    <img src={ config.footerImg } />
    <h3 className="footer-text">{ config.teamSlogan }</h3>
  </div>
);