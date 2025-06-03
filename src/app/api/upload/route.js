export async function POST(req) {
    try {
        const body = await req.json(); // 👈 read body

        const lambdaRes = await fetch(
            'https://i0yrpparf7.execute-api.ap-south-1.amazonaws.com/default/pdfUploader',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body), // 👈 pass body to Lambda
            }
        );

        const text = await lambdaRes.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return Response.json({ error: 'Invalid JSON from Lambda', raw: text }, { status: 502 });
        }

        if (!lambdaRes.ok) {
            return Response.json(data, { status: lambdaRes.status });
        }

        return Response.json(data);
    } catch (err) {
        return Response.json({ error: err.message || 'Server Error' }, { status: 500 });
    }
}
