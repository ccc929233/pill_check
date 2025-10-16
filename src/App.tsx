import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { identifyMedication } from './services/geminiService';
import type { MedicationInfo, GroundingSource } from './types';
import { CameraIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfo | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSubmit = useCallback(async (file: File) => {
    setImageFile(file);
    setIsLoading(true);
    setError(null);
    setMedicationInfo(null);
    setSources([]);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const result = await identifyMedication(base64String, file.type);
          setMedicationInfo(result.medicationInfo);
          setSources(result.sources);
        } catch (err) {
          console.error(err);
          setError('无法识别药品或获取信息。请尝试一张更清晰的照片，或检查您的网络连接。');
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        throw new Error('无法读取图片文件。');
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '发生了未知错误。');
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImageFile(null);
    setMedicationInfo(null);
    setSources([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 transition-all duration-300">
          {!imageFile && !isLoading && (
            <ImageUploader onImageSubmit={handleImageSubmit} />
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="text-center">
              <p className="text-red-600 bg-red-100 p-4 rounded-lg text-lg">{error}</p>
              <button
                onClick={handleReset}
                className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <CameraIcon />
                重新拍照
              </button>
            </div>
          )}
          
          {!isLoading && medicationInfo && (
            <div>
              <ResultDisplay
                imagePreviewUrl={imageFile ? URL.createObjectURL(imageFile) : ''}
                medicationInfo={medicationInfo}
                sources={sources}
              />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 mx-auto"
                >
                  <CameraIcon />
                  识别另一种药品
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        <p>免责声明：本工具仅供参考，不能替代专业的医疗建议。请务必咨询您的医生或药剂师。</p>
        <p>&copy; 2024 Pill Identifier. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
