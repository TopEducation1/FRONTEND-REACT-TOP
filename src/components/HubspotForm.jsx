// components/HubspotForm.jsx
import { useEffect, useRef } from "react";

export default function HubspotForm() {
  const formRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "45381980",
          formId: "b871a26b-3d92-4b34-91bc-6dbe5a47b2e3",
          target: "#hubspotForm",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (formRef.current) formRef.current.innerHTML = ""; // limpia el contenido al desmontar
    };
  }, []);

  return <div id="hubspotForm" ref={formRef} className="my-10 min-h-[400px]" />;
}
