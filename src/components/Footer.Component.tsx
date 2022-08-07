import "../styles/footer.scss";

const FooterComponent = () => {
  return (
    <div className="ieo-footer-container">
      <div className="ieo-footer-app-info">
        <div className="ieo-footer-app-author">
          Made by Ed (<span className="ieo-logo-first-letter">エ</span>ヂイ)
        </div>
        <div className="ieo-footer-app-version">
          version {process.env.REACT_APP_VERSION}
        </div>
      </div>
      <div className="ieo-footer-credits">
        <div className="ieo-footer-section-title">Credits</div>
        <a
          href="https://www.flaticon.com/free-icons/photoshop"
          title="photoshop icons"
        >
          Photoshop icons created by Smashicons - Flaticon
        </a>
      </div>
    </div>
  );
};

export default FooterComponent;
