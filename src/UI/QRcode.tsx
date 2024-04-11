import QRCode from 'qrcode';

const address = 'http://localhost:3000/labels-app/';

export const generateQRCodeDataURL = async (id: string) => {
    const text = `${address}${id}`;
        try {
            const dataURL = await QRCode.toDataURL(text);
            return dataURL;
        } catch (err) {
            console.error(err);
        }
};
export const generateQRCodeCanvas = async (id: string) => {
    const text = `${address}${id}`;
    try {
        const canvas = await QRCode.toCanvas(text);
        return canvas;
    } catch (err) {
        console.error(err);
    }
};
