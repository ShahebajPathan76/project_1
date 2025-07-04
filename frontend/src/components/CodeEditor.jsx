import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <div className="rounded-xl shadow-md border border-gray-300 overflow-hidden bg-white">
      <Editor
        height="60vh"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        options={{
          fontSize: 16,
          fontFamily: "Fira Code, monospace",
          minimap: { enabled: false },
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          lineNumbers: "on",
          cursorSmoothCaretAnimation: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
