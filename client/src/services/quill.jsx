import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function RichEditor({ value, onChange, error }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // INIT editor once
  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        onChange(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  // UPDATE editor when value changes (IMPORTANT)
  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div>
      <div
        ref={editorRef}
        style={{
          minHeight: "240px", // ~10 rows
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      {error && (
        <small style={{ color: "red" }}>Content is required</small>
      )}
    </div>
  );
}
