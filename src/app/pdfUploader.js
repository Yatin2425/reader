import React, { useEffect } from 'react';

export default function UploadToS3({ file, onUploadComplete }) {
    useEffect(() => {
        if (!file) return;

        async function upload() {
            try {
                // 1. Get presigned URL from backend
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: file.name, filetype: file.type }),
                });

                const { uploadUrl, error } = await res.json();
                if (error) throw new Error(error);

                // 2. Upload file to S3
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': file.type },
                    body: file,
                });

                if (!uploadRes.ok) throw new Error('Upload to S3 failed');

                onUploadComplete('Upload successful!');
            } catch (err) {
                onUploadComplete('Upload failed: ' + err.message);
            }
        }

        upload();
    }, [file, onUploadComplete]);

    return null;
}
