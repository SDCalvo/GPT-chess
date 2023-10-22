import React, { useContext, useEffect, useRef } from "react";
import { UiContext } from "@/context/UiContext";
import "./Log.css";

const Log: React.FC = () => {
  const { uiState } = useContext(UiContext);
  const { logs } = uiState;

  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      const { current } = logContainerRef;
      current.scrollTo({
        top: current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]); // Effect runs whenever logs array changes

  return (
    <div className="log-container" ref={logContainerRef}>
      {logs.map((log, index) => (
        <div key={index} className="log-entry">
          <p className="log-entry-text">{log}</p>
        </div>
      ))}
    </div>
  );
};

export default Log;
