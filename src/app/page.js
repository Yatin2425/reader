"use client";
import { useState, useRef } from "react";
import UploadToS3 from './pdfUploader';

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();
    const [status, setStatus] = useState("");

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            setPdfUrl(URL.createObjectURL(file));
            setSelectedFile(file);
            setStatus("");
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

    function handleUploadClick() {
        if (!selectedFile) return alert("No file selected!");
        setStatus("Uploading...");
        setUploading(true);
    }

    function onUploadComplete(msg) {
        setStatus(msg);
        setUploading(false);
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
                className="mb-7 px-8 py-3 rounded-full border-2 border-sky-400 text-sky-400 font-medium text-base cursor-pointer transition-colors duration-300 bg-[#1f1f1f] hover:bg-sky-400 hover:text-[#121212]"
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
                        onClick={handleUploadClick}
                        className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition"
                    >
                        Upload PDF to S3
                    </button>

                    <p className="mt-3">{status}</p>

                    {uploading && (
                        <UploadToS3 file={selectedFile} onUploadComplete={onUploadComplete} />
                    )}
                </>
            )}
        </div>
    );
}
