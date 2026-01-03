import express from 'express';
import type { Request, Response } from 'express';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req: Request, res: Response) => {
    const { ssid, password, encryption = 'WPA' } = req.body;

    if (!ssid) {
        return res.status(400).json({ error: 'SSID is required' });
    }

    // Format for WiFi QR Code: WIFI:T:WPA;S:myssid;P:mypassword;;
    // Encryption can be WEP, WPA, or nopass (no password)
    const qrText = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

    try {
        // Generate QR code as a Data URL (Base64)
        const qrCodeDataUrl = await QRCode.toDataURL(qrText, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        res.json({ qrCode: qrCodeDataUrl });
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.listen(PORT, () => {
    console.log(`GuestPass Server is running on http://localhost:${PORT}`);
});
