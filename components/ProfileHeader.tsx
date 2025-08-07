/**
 * 프로필 헤더 컴포넌트
 * 사용자 정보 표시 및 토큰 활성화 버튼
 */

import { ProfileHeaderProps } from "@/types";
import { DESIGN } from "@/constants";

export default function ProfileHeader({
  userContext,
  userToken,
  checkingToken,
  onActivate,
}: ProfileHeaderProps) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Task 2: 사용자 정보 표시</h2>

      <div className="flex items-center">
        {/* 
          TODO Task 2-1: 프로필 이미지 표시
          
          🎯 목표: Farcaster 프로필 이미지를 표시하세요
          📝 힌트: userContext?.pfpUrl을 사용하세요
          
          조건:
          1. userContext?.pfpUrl이 있으면 <img> 태그로 표시
          2. 없으면 기본 아바타 아이콘 표시
        */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {/* TODO: 프로필 이미지 조건부 렌더링 */}
          {userContext?.pfpUrl ? (
            // 힌트: <img src={userContext.pfpUrl} alt="Profile" className="w-full h-full object-cover" />
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500">📷</span>
            </div>
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
        </div>

        {/* 사용자 정보 */}
        <div className="ml-6 flex-1">
          <div className="flex items-center space-x-4">
            {/*
              TODO Task 2-2: 사용자명 표시
              
              🎯 목표: Farcaster 사용자명을 표시하세요
              📝 힌트: userContext?.username을 사용하세요
              
              조건:
              1. userContext?.username이 있으면 표시
              2. 없으면 "사용자" 표시
            */}
            <h1 className="text-xl font-bold">
              {/* TODO: 사용자명 조건부 렌더링 */}
              {/* 힌트: userContext?.username || "사용자" */}
              사용자명을 여기에 표시하세요
            </h1>

            {/* 토큰 상태에 따른 버튼 표시 */}
            {userToken ? (
              <div
                className="text-sm px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
              >
                활성화됨
              </div>
            ) : (
              <button
                onClick={onActivate}
                disabled={checkingToken || !userContext?.username}
                className="px-4 py-1 text-sm font-medium text-white rounded-md disabled:opacity-50"
                style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
              >
                {checkingToken ? "확인 중..." : "활성화"}
              </button>
            )}
          </div>

          {/*
            TODO Task 2-3: FID 표시 (선택사항)
            
            🎯 목표: Farcaster ID(FID)를 표시하세요
            📝 힌트: userContext?.fid를 사용하세요
            
            조건:
            1. userContext?.fid가 있을 때만 표시
          */}
          {/* TODO: FID 조건부 렌더링 */}
          {userContext?.fid && (
            <p className="text-sm text-gray-500 mt-1">
              {/* 힌트: FID: {userContext.fid} */}
              FID: 여기에 FID 표시
            </p>
          )}

          {/* 토큰 정보 표시 */}
          {userToken && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">토큰: {userToken.symbol}</p>
              <p className="text-xs text-gray-500">
                {userToken.tokenAddress.slice(0, 8)}...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 완성 확인 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">✅ 완성 확인:</h3>
        <ul className="text-sm space-y-1">
          <li>• 프로필 이미지가 표시되나요?</li>
          <li>• 사용자명이 올바르게 표시되나요?</li>
          <li>• FID가 표시되나요? (있는 경우)</li>
        </ul>
      </div>
    </div>
  );
}
