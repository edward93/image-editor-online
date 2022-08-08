import React, { useEffect } from "react";
import ReactGA from "react-ga";

import Header from "./Header.Component";
import ImageEditor from "./Image.Editor.Component";

import Footer from "./Footer.Component";

ReactGA.initialize("G-FHPMY22TTL");

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  
  return (
    <div className="ieo-app-content">
      <Header />
      <ImageEditor />
      <Footer />
    </div>
  );
}

export default App;
