import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
const BpmnModeler = require("bpmn-js/lib/Modeler").default;
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  CamundaPlatformTooltipProvider,
  useService,
} from "bpmn-js-properties-panel";
import { CreateAppendAnythingModule } from "bpmn-js-create-append-anything";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import { initXml } from "./initXml";

const BpmnCamundaModeler = forwardRef(({ diagramXML = initXml }, ref) => {
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const bpmnModeler = useRef(null);

  useEffect(() => {
    bpmnModeler.current = new BpmnModeler({
      container: canvasRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      keyboard: {
        bindTo: window,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        CamundaPlatformTooltipProvider,
        useService,
        CreateAppendAnythingModule,
        BpmnColorPickerModule,
      ],
      moddleExtensions: {
        camunda: CamundaBpmnModdle,
      },
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
BpmnCamundaModeler.displayName = "BpmnCamundaModeler";
// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({ diagramXML, xmlRef }) => (
  <BpmnCamundaModeler diagramXML={diagramXML} ref={xmlRef} />
);
