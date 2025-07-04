import React, {useEffect, useRef, useState} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {socket} from "./socket";
import {useParams, useNavigate} from "react-router-dom";
import {jsPDF} from "jspdf";

function Editor() {
  const {roomId} = useParams();
  const wrapperRef = useRef();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [quill, setQuill] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const name = prompt("Enter your name:");
    if (!name) navigate("/");
    else setUsername(name);
  }, [navigate]);

  useEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.innerHTML = "";
    wrapperRef.current.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      readOnly: true,
    });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  useEffect(() => {
    if (!quill || !username) return;

    socket.emit("join-room", {roomId, username});

    socket.on("load-content", (content) => {
      quill.setContents(quill.clipboard.convert(content));
      quill.enable();
    });

    socket.on("room-users", (userList) => {
      setUsers(userList);
    });

    // ✅ NEW: Apply remote changes from other users
    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });

    const handleSave = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        const content = quill.root.innerHTML;
        socket.emit("save-doc", content);
        alert("Saved");
      }
    };

    document.addEventListener("keydown", handleSave);

    const interval = setInterval(() => {
      const content = quill.root.innerHTML;
      socket.emit("save-doc", content);
    }, 60000);

    return () => {
      document.removeEventListener("keydown", handleSave);
      clearInterval(interval);
      socket.off("receive-changes");
      socket.off("room-users");
    };
  }, [quill, username, roomId]);

  useEffect(() => {
    if (!quill) return;
    quill.on("text-change", (delta, _, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    });
  }, [quill]);
  const handleDownloadPDF = () => {
    if (!quill) return;

    const text = quill.getText(); // Get plain text from editor

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      lineHeight: 1.5,
      margin: 40,
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(text, pageWidth);
    doc.text(lines, margin, margin);

    doc.save(`${roomId}.pdf`);
  };

  return (
    <div>
      <div style={{background: "#242423", padding: "0.5rem", color: "#fff"}}>
        <strong>Users:</strong> {users.length ? users.join(", ") : "None"}
        <div style={{float: "right"}}>
          <button onClick={handleDownloadPDF} style={{marginRight: "10px"}}>
            Download PDF
          </button>
        </div>{" "}
      </div>

      <div ref={wrapperRef}></div>
    </div>
  );
}

export default Editor;
