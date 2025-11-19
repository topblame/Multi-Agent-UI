// multi_agent/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";

import { v4 as uuidv4 } from "uuid";
import {uploadPdfToS3} from "@/lib/s3";
import {createDocumentMeta} from "@/lib/db";

// Multer 메모리 스토리지
const upload = multer({ storage: multer.memoryStorage() });

// Multer를 Promise로 래핑
function runMiddleware(req: any, res: any, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) return reject(result);
            resolve(result);
        });
    });
}

export async function POST(req: NextRequest) {
    const res = new NextResponse();

    try {
        let file: Express.Multer.File | null = null;

        // @ts-ignore
        await runMiddleware(req, res, upload.single("file"));
        // @ts-ignore
        file = req.file;

        if (!file) return NextResponse.json({ error: "파일 필요" }, { status: 400 });

        const s3Key = await uploadPdfToS3(file);
        const documentMeta = await createDocumentMeta(file.originalname, s3Key);

        return NextResponse.json(documentMeta);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
    }
}

// Multer 사용 시 bodyParser 비활성화 필요
export const config = { api: { bodyParser: false } };
