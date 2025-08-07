/**
 * 프로필 헤더 컴포넌트
 * 사용자 정보 표시 및 토큰 활성화 버튼
 */

import { ProfileHeaderProps } from "@/types";
import { DESIGN } from "@/constants";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { motion } from "motion/react";
import { fadeInUp, spring, timing } from "@/lib/animations";

export default function ProfileHeader({
  userToken,
  checkingToken,
  onActivate,
}: ProfileHeaderProps) {
  const { context } = useMiniKit();
  const userContext = context?.user;
  const userName = userContext?.username || "사용자";
  const userPfpUrl = userContext?.pfpUrl;
  const userFid = userContext?.fid;

  return (
    <motion.div
      className="px-4 py-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, ...spring.smooth }}
      >
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ ...spring.smooth }}
        >
          {userPfpUrl ? (
            <motion.img
              src={userPfpUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: timing.normal }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </motion.div>

        {/* 사용자 정보 */}
        <motion.div
          className="ml-6 flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...spring.smooth }}
        >
          <div className="flex items-center space-x-4">
            <motion.h1
              className="text-xl font-semibold text-instagram-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: timing.normal }}
            >
              {userName}
            </motion.h1>

            {/* 토큰 상태에 따른 버튼 표시 */}
            {userToken ? (
              <motion.div
                className="text-sm px-3 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, ...spring.bouncy }}
              >
                활성화됨
              </motion.div>
            ) : (
              <motion.button
                onClick={onActivate}
                disabled={checkingToken || !userName}
                className="px-4 py-1 text-sm font-medium text-white rounded-md disabled:opacity-50"
                style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ ...spring.stiff }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {checkingToken ? "확인 중..." : "활성화"}
              </motion.button>
            )}
          </div>

          <motion.p
            className="text-sm text-gray-500 mt-1 text-instagram-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: timing.normal }}
          >
            {userFid && `FID: ${userFid}`}
          </motion.p>

          {/* 토큰 정보 표시 */}
          {userToken && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...spring.smooth }}
            >
              <p className="text-sm text-gray-600 text-instagram-body">
                토큰: {userToken.symbol}
              </p>
              <p className="text-xs text-gray-500 text-instagram-caption font-mono">
                {userToken.tokenAddress.slice(0, 8)}...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
