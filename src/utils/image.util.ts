export function ThumbUrlToBytes(thumbUrl: string | undefined) {
    if (thumbUrl === undefined) return undefined;
    
    const binaryString = atob(thumbUrl.split('base64,')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}