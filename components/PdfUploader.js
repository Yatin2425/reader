// components/PdfUploader.route.js
"use client";
import { useState } from "react";

// Helper to convert File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });
}

export default function PdfUploader({ file }) {
    const [uploading, setUploading] = useState(false);

    async function handleUpload() {
        if (!file) {
            alert("No file selected");
            return;
        }

        setUploading(true);

        try {
            const pdfBase64 = await fileToBase64(file);
            console.log("📄 Base64 PDF being sent:", pdfBase64);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdfBase64, fileName: file.name }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Upload failed: " + (data.error || "Unknown error"));
            } else {
                alert("PDF uploaded successfully!");
            }
        } catch (err) {
            alert("Upload error: " + err.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-8 py-3 rounded-full bg-sky-400 text-[#121212] font-semibold text-base cursor-pointer shadow-[0_0_10px_#00bfff] transition-colors duration-300 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {uploading ? "Uploading..." : "Upload to S3"}
        </button>
    );
}
