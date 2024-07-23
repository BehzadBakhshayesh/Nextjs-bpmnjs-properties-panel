import dynamic from "next/dynamic";
import React from "react";
const BpmnCamundaModeler = dynamic(() => import("@/components/bpmnModeler"), {
  ssr: false,
  loading: () => <h1>Loadin...</h1>,
});

const Page = () => {
  const xmlRef = React.useRef(null);

  const handleDownloadBpmn = async () => {
    const xml = await xmlRef.current?.getXml();
    if (xml) {
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.bpmn";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const handleDownloadSvg = async () => {
    const svg = await xmlRef.current?.getSvg();
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const handleUpload = async () => {
    const xml = await xmlRef.current?.getXml();
    console.log({ xml });
  };
  return (
    <>
      <div
        style={{
          padding: "20px",
          border: "1px solid blue",
          maxWidth: "50%",
          margin: "auto",
        }}
      >
        <BpmnCamundaModeler xmlRef={xmlRef} />
      </div>
      <div style={{ margin: "auto", width: "400px", marginTop: "100px" }}>
        <button onClick={handleUpload}>upload</button>
        <button onClick={handleDownloadBpmn}>Download Xml</button>
        <button onClick={handleDownloadSvg}>Download Svg</button>
      </div>
    </>
  );
};

export default Page;
