import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  CamundaPlatformTooltipProvider,
  ZeebePropertiesProviderModule,
  ZeebeTooltipProvider,
  useService,
} from "bpmn-js-properties-panel";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

export const initXml =
  '<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:b="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:o="http://www.omg.org/spec/DD/20100524/DC" xmlns:x="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="" x:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd"><process id="Process_0boow2r"/><b:BPMNDiagram id="sid-74620812-92c4-44e5-949c-aa47393d3830"><b:BPMNPlane id="sid-cdcae759-2af7-4a6d-bd02-53f3352a731d" bpmnElement="Process_0boow2r"/><b:BPMNLabelStyle id="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581"><o:Font name="Arial" size="11" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false"/></b:BPMNLabelStyle><b:BPMNLabelStyle id="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b"><o:Font name="Arial" size="12" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false"/></b:BPMNLabelStyle></b:BPMNDiagram></definitions>';

const BpmnComponent = forwardRef(({ diagramXML = initXml }, ref) => {
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const bpmnModeler = useRef(null);

  useEffect(() => {
    bpmnModeler.current = new BpmnModeler({
      container: canvasRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        CamundaPlatformTooltipProvider,
        ZeebePropertiesProviderModule,
        ZeebeTooltipProvider,
        useService,
      ],
    });

    async function openDiagram(xml) {
      try {
        await bpmnModeler.current.importXML(xml);
      } catch (err) {
        console.error("Error importing BPMN diagram", err);
      }
    }

    openDiagram(diagramXML);

    return () => {
      bpmnModeler.current.destroy();
    };
  }, [diagramXML]);

  useImperativeHandle(
    ref,
    () => ({
      getXml: async () => {
        try {
          const { xml } = await bpmnModeler.current.saveXML({ format: true });
          return xml;
        } catch (err) {
          console.error("Failed to save BPMN XML", err);
          return null;
        }
      },
      getSvg: async () => {
        try {
          const { svg } = await bpmnModeler.current.saveSVG({ format: true });
          return svg;
        } catch (err) {
          console.error("Failed to save BPMN SVG", err);
          return null;
        }
      },
    }),
    []
  );

  return (
    <div className="content with-diagram">
      <div className="canvas" ref={canvasRef}></div>
      <div
        className="properties-panel-parent"
        id="js-properties-panel"
        ref={propertiesPanelRef}
      ></div>
    </div>
  );
});
BpmnComponent.displayName = "BpmnComponent";

export default BpmnComponent;
