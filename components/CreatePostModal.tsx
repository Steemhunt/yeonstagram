/**
 * 포스트 생성 모달 컴포넌트
 * 이미지 업로드 및 NFT 포스트 생성 기능
 */

import { useState } from "react";
import { mintclub } from "mint.club-v2-sdk";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { CreatePostModalProps } from "@/types";
import {
  DESIGN,
  NETWORK,
  NFT_CONFIG,
  IMAGE_COMPRESSION,
  TOAST_MESSAGES,
} from "@/constants";
import { motion, AnimatePresence } from "motion/react";
import {
  modalOverlay,
  modalContent,
  fadeInUp,
  spring,
  timing,
} from "@/lib/animations";

export default function CreatePostModal({
  userToken,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const [postName, setPostName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  /**
   * 파일 선택 처리
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 이미지를 IPFS에 업로드
   * @param file 업로드할 이미지 파일
   * @returns IPFS 해시
   */
  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      // 이미지 압축
      console.log("원본 파일 크기:", file.size / 1024 / 1024, "MB");

      const compressedFile = await imageCompression(file, IMAGE_COMPRESSION);
      console.log("압축된 파일 크기:", compressedFile.size / 1024 / 1024, "MB");

      // Filebase를 통한 IPFS 업로드
      const { uploadImage } = await import("../server/ipfs");
      const formData = new FormData();
      formData.append("file", compressedFile);
      const imageHash = await uploadImage(formData);
      return imageHash;
    } catch (error) {
      console.error("IPFS 업로드 오류:", error);
      toast.error(
        "이미지 업로드에 실패했습니다. Filebase API 키와 콘솔을 확인해주세요."
      );
      throw error;
    }
  };

  /**
   * NFT 포스트 생성
   */
  const handleCreate = async () => {
    // 입력값 검증
    if (!postName || !selectedFile) {
      toast.error(TOAST_MESSAGES.IMAGE_REQUIRED);
      return;
    }

    if (!userToken) {
      toast.error(TOAST_MESSAGES.TOKEN_REQUIRED);
      return;
    }

    setCreating(true);
    try {
      // 1. 이미지를 IPFS에 업로드
      setUploading(true);
      console.log("Filebase를 통한 IPFS 이미지 업로드 시작...");
      toast.loading(TOAST_MESSAGES.POST_UPLOAD, { id: "post-creation" });

      const imageUrl = await uploadToIPFS(selectedFile);
      console.log("이미지 업로드 완료:", imageUrl);

      // 2. 메타데이터를 IPFS에 업로드
      console.log("메타데이터 IPFS 업로드 시작...");
      toast.loading(TOAST_MESSAGES.POST_METADATA, { id: "post-creation" });

      const { uploadMetadata } = await import("../server/ipfs");
      const metadataForm = new FormData();
      metadataForm.append("image", imageUrl);
      metadataForm.append("name", postName);
      const metadataUrl = await uploadMetadata(metadataForm);
      console.log("메타데이터 업로드 완료:", metadataUrl);

      setUploading(false);

      // 3. NFT 생성
      console.log("NFT 포스트 생성 시작...");
      toast.loading(TOAST_MESSAGES.POST_CREATING, { id: "post-creation" });

      const result = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .nft(postName)
        .create({
          name: postName,
          metadataUrl: metadataUrl as `ipfs://${string}`,
          reserveToken: {
            address: userToken.tokenAddress as `0x${string}`,
            decimals: NFT_CONFIG.DECIMALS,
          },
          curveData: {
            curveType: NFT_CONFIG.CURVE_TYPE,
            stepCount: NFT_CONFIG.STEP_COUNT,
            maxSupply: NFT_CONFIG.MAX_SUPPLY,
            initialMintingPrice: NFT_CONFIG.INITIAL_PRICE,
            finalMintingPrice: NFT_CONFIG.FINAL_PRICE,
            creatorAllocation: NFT_CONFIG.CREATOR_ALLOCATION,
          },
        });

      if (result) {
        console.log("NFT 생성 성공!");
        toast.success(TOAST_MESSAGES.POST_SUCCESS, { id: "post-creation" });
      }

      onSuccess();
    } catch (error) {
      console.error("포스트 생성 오류:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      if (errorMessage?.includes("FILEBASE_API_KEY")) {
        toast.error(TOAST_MESSAGES.FILEBASE_ERROR, { id: "post-creation" });
      } else {
        toast.error(`포스트 생성에 실패했습니다: ${errorMessage}`, {
          id: "post-creation",
        });
      }
    } finally {
      setCreating(false);
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      variants={modalOverlay}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg max-w-md w-full p-6"
        variants={modalContent}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: timing.normal }}
        >
          <h2 className="text-xl font-semibold text-instagram-title">
            새 포스트
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ ...spring.stiff }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* 이미지 업로드 영역 */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: timing.normal }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 text-instagram-body">
            이미지
          </label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <motion.button
                onClick={() => {
                  setImagePreview("");
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ ...spring.stiff }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          ) : (
            <motion.label
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ ...spring.smooth }}
            >
              <motion.svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </motion.svg>
              <p className="text-gray-500 text-instagram-body">
                이미지를 선택하세요
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.label>
          )}
        </motion.div>

        {/* 포스트 이름 입력 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: timing.normal }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 text-instagram-body">
            포스트 이름
          </label>
          <motion.input
            type="text"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            placeholder="포스트 이름을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-instagram-body"
            whileFocus={{ scale: 1.02 }}
            transition={{ ...spring.smooth }}
          />
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: timing.normal }}
        >
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-medium text-instagram-body"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ...spring.stiff }}
          >
            취소
          </motion.button>
          <motion.button
            onClick={handleCreate}
            disabled={!postName || !selectedFile || creating || uploading}
            className="flex-1 px-4 py-2 text-white rounded-md disabled:opacity-50 font-medium text-instagram-body"
            style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ...spring.stiff }}
          >
            {creating || uploading ? "생성 중..." : "포스트 생성"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
