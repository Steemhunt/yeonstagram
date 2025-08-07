/**
 * 프로필 헤더 컴포넌트
 * 사용자 정보 표시 및 토큰 활성화 버튼
 */

import { ProfileHeaderProps } from "@/types";
import { DESIGN } from "@/constants";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function ProfileHeader({
  userToken,
  checkingToken,
  onActivate,
}: ProfileHeaderProps) {
  {
    /* 
          TODO Task 2: 프로필 정보 표시
          
          🎯 목표: Farcaster 프로필 정보를 표시하세요
          📝 힌트: const {context} = useMiniKit();
          const userContext = context?.user;
          const userName = userContext?.username;
          const userPfpUrl = userContext?.pfpUrl;
          const userFid = userContext?.fid;
          
        */
  }

  const data = {
    userName: "test",
    userPfpUrl: "https://i.makeagif.com/media/12-12-2023/dKpfk7.gif",
    userFid: 1111,
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {/* TODO: 프로필 이미지 조건부 렌더링 */}
          {data.userPfpUrl ? (
            <img
              src={data.userPfpUrl}
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
            <h1 className="text-xl font-bold">{data.userName}</h1>

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
                disabled={checkingToken || !data.userName}
                className="px-4 py-1 text-sm font-medium text-white rounded-md disabled:opacity-50"
                style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
              >
                {checkingToken ? "확인 중..." : "활성화"}
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">FID: {data.userFid}</p>

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
