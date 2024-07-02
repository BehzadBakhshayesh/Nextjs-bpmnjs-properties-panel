import dynamic from "next/dynamic";
import React from "react";
const BpmnComponent = dynamic(() => import("@/components/bpmnComponent"), {
  ssr: false,
});

const Page = () => {
  const xmlRef = React.useRef(null);
  const handleDownloadXml = async () => {
    console.log({ xmlRef });
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
    console.log({ xmlRef });
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
  return (
    <>
      <BpmnComponent ref={xmlRef} />
      <div style={{ margin: "auto", width: "400px", marginTop: "100px" }}>
        <button
          onClick={async () => {
            const xml = await xmlRef.current?.getXml();
            console.log({ xml });
          }}
        >
          show Xml
        </button>
        <button onClick={handleDownloadXml}>Download Xml</button>
        <button onClick={handleDownloadSvg}>Download Svg</button>
      </div>
    </>
  );
};

export default Page;
