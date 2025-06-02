export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { pdfBase64 } = req.body;

        if (!pdfBase64) {
            return res.status(400).json({ error: 'Missing pdfBase64' });
        }

        // Call your AWS Lambda API here
        const lambdaRes = await fetch(
            'https://i0yrpparf7.execute-api.ap-south-1.amazonaws.com/default/pdfUploader',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdfBase64 }),
            }
        );

        const data = await lambdaRes.json();

        if (!lambdaRes.ok) {
            return res.status(lambdaRes.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('API Route Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
