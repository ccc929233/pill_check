import React, { useRef } from 'react';
import { CameraIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageSubmit: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSubmit(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">欢迎使用！</h2>
      <p className="text-lg text-slate-500 mb-8">
        请为您的药品拍一张清晰的照片，我们将为您识别。
      </p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white font-bold text-xl py-4 px-10 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
      >
        <CameraIcon />
        拍照或上传图片
      </button>
      <div className="mt-8 text-slate-500 text-sm">
        <h3 className="font-bold text-base mb-2">拍照小提示：</h3>
        <ul className="list-disc list-inside text-left max-w-xs mx-auto">
          <li>在光线充足的地方拍照</li>
          <li>背景干净整洁</li>
          <li>确保药品上的文字清晰可见</li>
        </ul>
      </div>
    </div>
  );
};