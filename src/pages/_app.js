import React from "react";
import "@/styles/globals.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
