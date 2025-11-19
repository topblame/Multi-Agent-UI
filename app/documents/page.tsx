"use client";

import FileUpload from "../../components/FileUpload";

export default function DocumentPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">문서 분석</h1>
            <p className="mb-6">PDF 문서를 업로드하면 Multi-Agent가 분석을 시작합니다.</p>
            <FileUpload />
        </div>
    );
}
