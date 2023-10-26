import React, { useEffect, useRef, useContext } from "react";
import { UiContext } from "@/context/UiContext";
import LogEntry from "./LogEntry"; // Import the new LogEntry component
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
  }, [logs]);

  return (
    <div className="log-container" ref={logContainerRef}>
      {logs.map((log, index) => (
        <LogEntry key={index} text={log} /> // Use the LogEntry component here
      ))}
    </div>
  );
};

export default Log;
