import "../styles/header.scss";
import logo from "../images/logo512.png";

const HeaderComponent = () => {
  return (
    <header className="ieo-app-header">
      <div className="ieo-app-header-left">
        <a href="/">
          <img src={logo} alt="logo" />
          {/* Bla bla bla */}
        </a>
      </div>
      <div className="ieo-app-header-center">
        <h1>Online Image Editor</h1>
      </div>
      <div className="ieo-app-header-right"></div>
    </header>
  );
};

export default HeaderComponent;
