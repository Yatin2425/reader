"use client";
import { useState, useRef } from "react";

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            setSelectedFile(file);
        } else {
            alert("Please upload a valid PDF file");
            setPdfUrl(null);
            setSelectedFile(null);
            e.target.value = "";
        }
    }

    function openFileDialog() {
        fileInputRef.current.click();
    }

    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Get only base64 string without metadata prefix
            reader.onerror = error => reject(error);
        });
    }

    async function uploadPdf() {
        if (!selectedFile) {
            alert("Please select a PDF file first");
            return;
        }
        setUploading(true);

        try {
            const pdfBase64 = await fileToBase64(selectedFile);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pdfBase64, fileName: selectedFile.name }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Upload failed: " + (data.error || "Unknown error"));
            } else {
                alert("PDF uploaded successfully!");
            }
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen p-5 flex flex-col items-center font-sans">
            <h1 className="mb-10 font-semibold text-2xl">Upload and View PDF</h1>

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
            />

            <button
                onClick={openFileDialog}
                disabled={uploading}
                className="mb-7 px-8 py-3 rounded-full border-2 border-sky-400 text-sky-400 font-medium text-base cursor-pointer transition-colors duration-300 bg-[#1f1f1f] hover:bg-sky-400 hover:text-[#121212] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Choose File
            </button>

            {pdfUrl && (
                <>
                    <embed
                        key={pdfUrl}
                        src={pdfUrl}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                        className="rounded-lg shadow-[0_0_15px_rgba(0,191,255,0.5)] max-w-[700px] mb-5"
                    />

                    <button
                        onClick={uploadPdf}
                        disabled={uploading}
                        className="px-8 py-3 rounded-full bg-sky-400 text-[#121212] font-semibold text-base cursor-pointer shadow-[0_0_10px_#00bfff] transition-colors duration-300 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : "Upload to S3"}
                    </button>
                </>
            )}
        </div>
    );
}
