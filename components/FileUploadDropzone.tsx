'use client';

import Image from 'next/image';
import { DropzoneOptions } from 'react-dropzone';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from './FileUpload';
import { Trash2 as RemoveIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FileSvgDraw = () => {
    const t = useTranslations('Common');
    return (
        <>
            <svg
                className="w-8 h-8 mb-3 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="mb-1 text-sm text-black">
                <span className="font-semibold">{t('clickToUpload')}</span>
                &nbsp; {t('dragAndDrop')}
            </p>
            <p className="text-xs text-gray-600">{t('typeFiles')}</p>
        </>
    );
};

const FileUploadDropzone = ({
    files,
    setFiles,
    existingImageUrls = [],
    onRemoveExistingImage,
}: {
    files: File[] | null;
    setFiles: (files: File[] | null) => void;
    existingImageUrls?: string[];
    onRemoveExistingImage?: (index: number) => void;
}) => {
    const dropzone = {
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
        },
        multiple: true,
        maxFiles: 4,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;

    return (
        <FileUploader
            value={files}
            orientation="vertical"
            onValueChange={setFiles}
            dropzoneOptions={dropzone}
            className="relative rounded-lg p-2 mx-auto"
        >
            <FileInput className="outline-dashed bg-background outline-2 outline-black/40">
                <div className="flex items-center justify-center flex-col pt-5 pb-6 w-full ">
                    <FileSvgDraw />
                </div>
            </FileInput>
            <FileUploaderContent className="flex items-center flex-row gap-2">
                {/* Render existing images first */}
                {existingImageUrls.map((url, i) => (
                    <FileUploaderItem
                        key={`existing-${i}`}
                        index={i}
                        className="size-20 p-0 rounded-md overflow-hidden border"
                        aria-roledescription={`existing image ${i + 1}`}
                    >
                        <Image
                            src={url}
                            alt={`existing-image-${i}`}
                            height={80}
                            width={80}
                            className="size-20 rounded-md object-contain"
                        />
                        {onRemoveExistingImage && (
                            <button
                                type="button"
                                className="absolute z-10 top-1 right-1 bg-primary rounded text-background p-1"
                                onClick={() => onRemoveExistingImage(i)}
                            >
                                <span className="sr-only">remove existing image {i}</span>
                                <RemoveIcon className="w-3 h-3 text-rose-500 hover:stroke-destructive duration-200 ease-in-out" />
                            </button>
                        )}
                    </FileUploaderItem>
                ))}
                {/* Render new files */}
                {files?.map((file, i) => (
                    <FileUploaderItem
                        key={i}
                        index={i}
                        className="size-20 p-0 rounded-md overflow-hidden border"
                        aria-roledescription={`file ${i + 1} containing ${file.name}`}
                    >
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            height={80}
                            width={80}
                            className="size-20 rounded-md object-contain"
                        />
                    </FileUploaderItem>
                ))}
            </FileUploaderContent>
        </FileUploader>
    );
};

export default FileUploadDropzone;
