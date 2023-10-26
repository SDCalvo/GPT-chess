import React, { useState, useEffect } from "react";

interface LogEntryProps {
  text: string;
}

const LogEntry = ({ text }: LogEntryProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true); // New state to track typing status

  useEffect(() => {
    if (charIndex < text.length) {
      const timer = setTimeout(() => setCharIndex(charIndex + 1), 100);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false); // Update isTyping state when typing is complete
    }
  }, [text, charIndex]);

  useEffect(() => {
    setDisplayedText(text.slice(0, charIndex));
  }, [text, charIndex]);

  return (
    <div className="log-entry">
      <p className="log-entry-text">
        {displayedText}
        {isTyping && <span className="cursor"></span>}{" "}
      </p>
    </div>
  );
};

export default LogEntry;
