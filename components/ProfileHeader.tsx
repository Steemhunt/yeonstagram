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
      <div className="flex items-center">
        {/* 프로필 이미지 */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {userContext?.pfpUrl ? (
            <img
              src={userContext.pfpUrl}
              alt="Profile"
              className="w-full h-full object-cover"
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
        </div>

        {/* 사용자 정보 */}
        <div className="ml-6 flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">
              {userContext?.username || "사용자"}
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

          {/* FID 표시 */}
          {userContext?.fid && (
            <p className="text-sm text-gray-500 mt-1">FID: {userContext.fid}</p>
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
    </div>
  );
}
