import { NextRequest, NextResponse } from 'next/server';

interface UploadResponse {
    url: string;
}

// Helper function to format the response
function formatResponse(name: string, contentType: string, url: string, size: number) {
    return {
        name,
        contentType,
        url,
        size
    };
}

// Helper function to handle base64 uploads
async function handleBase64Upload(base64: string, fileName: string, fileType: string) {
    try {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const response = await fetch('https://uplaodpixio-production.up.railway.app/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64: base64,
                fileName: fileName,
                fileType: fileType
            })
        });

        if (!response.ok) {
            throw new Error('Failed to upload base64 file');
        }

        const data: UploadResponse = await response.json();
        return formatResponse(
            fileName,
            fileType,
            data.url,
            Math.round(buffer.length * 0.75)
        );
    } catch (error) {
        console.error('Error in base64 upload:', error);
        throw error;
    }
}

// Helper function to handle direct file uploads
async function handleDirectFileUpload(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://uplaodpixio-production.up.railway.app/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const data: UploadResponse = await response.json();
        return formatResponse(
            file.name,
            file.type,
            data.url,
            file.size
        );
    } catch (error) {
        console.error('Error in direct file upload:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';

        // Handle multipart/form-data (direct file upload)
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json(
                    { error: 'No file uploaded' }, 
                    { status: 400 }
                );
            }

            const result = await handleDirectFileUpload(file);
            return NextResponse.json(result);
        }

        // Handle application/json (base64 upload)
        if (contentType.includes('application/json')) {
            const body = await request.json();
            const { base64, fileName, fileType } = body;

            if (!base64 || !fileName || !fileType) {
                return NextResponse.json(
                    { error: 'Missing required fields for base64 upload' }, 
                    { status: 400 }
                );
            }

            const result = await handleBase64Upload(base64, fileName, fileType);
            return NextResponse.json(result);
        }

        return NextResponse.json(
            { error: 'Unsupported content type' }, 
            { status: 415 }
        );

    } catch (error) {
        console.error('Error processing upload:', error);
        return NextResponse.json(
            { error: 'Failed to process upload' }, 
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

// import { NextRequest, NextResponse } from 'next/server';
// import { put } from '@vercel/blob';

// export async function POST(request: NextRequest) {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//         return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     try {
//         const blob = await put(`mplx/image-${Date.now()}.${file.name.split('.').pop()}`, file, {
//             access: 'public',
//         });

//         return NextResponse.json({
//             name: file.name,
//             contentType: file.type,
//             url: blob.url,
//             size: file.size,  // Include the file size in the response
//         });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//     }
// }