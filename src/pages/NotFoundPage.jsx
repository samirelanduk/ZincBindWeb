import React, { useEffect } from "react";
import ReactGA from "react-ga";
import Box from "../components/Box";

const NotFoundPage = () => {

  useEffect(() => {
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
    document.title = "Page Not Found - ZincBind";
  })
        

  return (
    <main className="not-found-page">
      <Box>
        <h1>Page Not Found</h1>
      </Box>
    </main>
  );
}
 
export default NotFoundPage;