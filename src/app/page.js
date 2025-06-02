"use client";
import { useState, useRef } from "react";

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const fileInputRef = useRef();

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfUrl(URL.createObjectURL(file));
        } else {
            alert("Please upload a valid PDF file");
            setPdfUrl(null);
        }
    }

    function openFileDialog() {
        fileInputRef.current.click();
    }

    function onCheckContent() {
        alert("Checking content... (You can implement your logic here)");
    }

    return (
        <div
            style={{
                backgroundColor: "#121212",
                color: "white",
                minHeight: "100vh",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h1 style={{ marginBottom: 40, fontWeight: "600" }}>
                Upload and View PDF
            </h1>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                style={{ display: "none" }}
            />

            {/* Custom choose file button */}
            <button
                onClick={openFileDialog}
                style={{
                    backgroundColor: "#1f1f1f",
                    border: "2px solid #00bfff",
                    color: "#00bfff",
                    padding: "12px 30px",
                    borderRadius: 30,
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginBottom: 30,
                    fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#00bfff";
                    e.currentTarget.style.color = "#121212";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f1f1f";
                    e.currentTarget.style.color = "#00bfff";
                }}
            >
                Choose File
            </button>

            {/* PDF Viewer */}
            {pdfUrl && (
                <>
                    <embed
                        src={pdfUrl}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                        style={{
                            borderRadius: 8,
                            boxShadow: "0 0 15px rgba(0, 191, 255, 0.5)",
                            maxWidth: 700,
                            marginBottom: 20,
                        }}
                    />

                    {/* Check Content Button */}
                    <button
                        onClick={onCheckContent}
                        style={{
                            backgroundColor: "#00bfff",
                            border: "none",
                            color: "#121212",
                            padding: "12px 30px",
                            borderRadius: 30,
                            fontSize: 16,
                            cursor: "pointer",
                            fontWeight: "600",
                            boxShadow: "0 0 10px #00bfff",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0099cc")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00bfff")}
                    >
                        Check Content
                    </button>
                </>
            )}
        </div>
    );
}
