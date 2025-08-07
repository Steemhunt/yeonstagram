"use client";

/**
 * Yeonstagram (연스타그램) - 메인 앱 컴포넌트
 * Yonsei University Instagram Clone with MiniKit & mint.club v2
 *
 * 주요 기능:
 * - Farcaster MiniKit 연동으로 사용자 정보 가져오기
 * - 사용자별 BASED{USERNAME} 토큰 생성
 * - NFT 포스트 생성 및 표시 (Instagram 스타일)
 * - IPFS 이미지 업로드 (Filebase 사용)
 */

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { motion, AnimatePresence } from "motion/react";

// 커스텀 훅들
import { useUserToken } from "@/hooks/useUserToken";
import { usePosts } from "@/hooks/usePosts";

// 컴포넌트들
import ProfileHeader from "@/components/ProfileHeader";
import PostGrid from "@/components/PostGrid";
import CreatePostModal from "@/components/CreatePostModal";

// 상수 및 타입
import { DESIGN } from "@/constants";
import Image from "next/image";

// 애니메이션 설정
import {
  fadeIn,
  fadeInUp,
  timing,
  spring,
  fabAnimation,
  spinnerAnimation,
} from "@/lib/animations";

/**
 * 메인 앱 컴포넌트
 */
export default function App() {
  // MiniKit 상태 관리
  const { context, setFrameReady } = useMiniKit();

  // 커스텀 훅들
  const { userToken, checkingToken, checkUserToken, createUserToken } =
    useUserToken();
  const { posts, loadingPosts, imageErrors, loadUserPosts, handleImageError } =
    usePosts();

  // 로컬 상태
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Farcaster 사용자 정보
  const userContext = context?.user;
  const username = userContext?.username;

  /**
   * TODO Task 1: MiniKit 초기화
   *
   * 🎯 목표: Farcaster MiniKit SDK 초기화
   * 📝 힌트: setFrameReady(); 함수를 호출하세요
   *
   * 이 함수는 MiniKit이 Farcaster 앱과 통신할 수 있도록 준비시킵니다.
   */
  useEffect(() => {
    // TODO: MiniKit SDK 초기화 코드 작성
  }, []);

  /**
   * 사용자명이 로드되면 토큰 확인 및 포스트 로딩
   */
  useEffect(() => {
    if (username) {
      checkUserToken(username).then((tokenAddress) => {
        if (tokenAddress) {
          loadUserPosts(tokenAddress);
        }
      });
    }
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 토큰 활성화 핸들러
   */
  const handleActivate = async () => {
    if (!username) return;

    const success = await createUserToken(username);
    if (success && userToken) {
      loadUserPosts(userToken.tokenAddress);
    }
  };

  /**
   * 포스트 생성 성공 핸들러
   */
  const handlePostSuccess = () => {
    setShowCreateModal(false);
    if (userToken) {
      loadUserPosts(userToken.tokenAddress);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white text-black font-instagram"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* 인스타그램 스타일 헤더 */}
      <motion.header
        className="sticky top-0 z-50 bg-white border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ ...spring.smooth }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-2xl font-bold cursor-pointer font-instagram"
              style={{ color: DESIGN.YONSEI_BLUE }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ...spring.stiff }}
            >
              YEONSTAGRAM
            </motion.h1>
          </div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <motion.main
        className="max-w-md mx-auto"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {/* 프로필 섹션 */}
        <ProfileHeader
          userToken={userToken}
          checkingToken={checkingToken}
          onActivate={handleActivate}
        />

        {/* 포스트 그리드 */}
        <motion.div
          className="border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: timing.normal }}
        >
          {checkingToken || loadingPosts ? (
            <motion.div
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: timing.normal }}
            >
              <motion.div
                className="rounded-full h-8 w-8 border-2 border-gray-300"
                style={{ borderTopColor: DESIGN.YONSEI_BLUE }}
                animate={spinnerAnimation.animate}
              />
            </motion.div>
          ) : (
            <PostGrid
              posts={posts}
              imageErrors={imageErrors}
              onImageError={handleImageError}
            />
          )}
        </motion.div>
      </motion.main>

      {/* 플로팅 포스트 생성 버튼 */}
      <AnimatePresence>
        {userToken && (
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
            style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
            variants={fabAnimation}
            initial="initial"
            animate="animate"
            exit="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: showCreateModal ? 45 : 0 }}
              transition={{ ...spring.stiff }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 포스트 생성 모달 */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal
            userToken={userToken}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handlePostSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
