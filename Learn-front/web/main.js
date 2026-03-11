import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";
import React from "https://esm.sh/react@18.2.0";

const appDomElement = document.getElementById("app");

const root = ReactDOM.createRoot(appDomElement);
const button = React.createElement('button', null, 'Click Me');

root.render('<button></button>');