import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadPdfToS3(file: File | Express.Multer.File) {
    // 파일명 안전하게 가져오기
    const originalName = "name" in file ? file.name : file.originalname;
    const fileKey = `documents/${uuidv4()}-${originalName}`;

    // 버퍼 가져오기
    const buffer =
        "arrayBuffer" in file
            ? Buffer.from(await file.arrayBuffer())
            : file.buffer;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileKey,
            Body: buffer,
            ContentType: "application/pdf",
        })
    );

    return fileKey;
}
