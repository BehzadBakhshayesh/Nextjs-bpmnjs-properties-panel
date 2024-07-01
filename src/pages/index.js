import BpmnComponent from "@/components/bpmnComponent";

export default function Home() {
  const xmlRef = useRef(null);
  const handleDownloadXml = async () => {
    const xml = await xmlRef.current.getXml();
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
    const svg = await xmlRef.current.getSvg();
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
            const xml = await xmlRef.current.getXml();
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
}
