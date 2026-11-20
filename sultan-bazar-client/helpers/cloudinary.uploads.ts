type CloudinaryPreset = 'product' | 'category' | 'avatar';

const PRESET_CONFIG: Record<CloudinaryPreset, { maxDimension: number; targetMaxKB: number; targetMinKB: number }> = {
    product:  { maxDimension: 1000, targetMaxKB: 200, targetMinKB: 80 },
    category: { maxDimension: 800,  targetMaxKB: 150, targetMinKB: 60 },
    avatar:   { maxDimension: 400,  targetMaxKB: 80,  targetMinKB: 30 },
};

async function compressImage(
    file: File,
    maxDimension: number,
    targetMaxKB: number,
    targetMinKB: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.85;
            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Compression failed.'));
                        const kb = blob.size / 1024;
                        if (kb > targetMaxKB && quality > 0.1) {
                            quality = Math.max(0.1, quality - 0.1);
                            tryCompress();
                        } else {
                            resolve(blob);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            tryCompress();
            void targetMinKB;
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image for compression.'));
        };

        img.src = objectUrl;
    });
}

export async function uploadToCloudinary(file: File, preset: CloudinaryPreset = 'product'): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary is not configured.');

    const { maxDimension, targetMaxKB, targetMinKB } = PRESET_CONFIG[preset];
    const compressed = await compressImage(file, maxDimension, targetMaxKB, targetMinKB);

    const formData = new FormData();
    formData.append('file', compressed, file.name.replace(/\.[^.]+$/, '.jpg'));
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error('Image upload failed. Please try again.');

    const json = await res.json() as { secure_url?: string; error?: { message?: string } };
    if (json.error) throw new Error(json.error.message || 'Image upload failed.');
    if (!json.secure_url) throw new Error('Image upload failed: no URL returned.');

    return json.secure_url;
}
