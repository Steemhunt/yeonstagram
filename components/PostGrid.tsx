/**
 * 포스트 그리드 컴포넌트
 * 인스타그램 스타일의 3열 그리드로 NFT 포스트 표시
 */

import { PostGridProps } from "@/types";
import { DESIGN } from "@/constants";
import Image from "next/image";

export default function PostGrid({
  posts,
  imageErrors,
  onImageError,
}: PostGridProps) {
  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div
        className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300"
        style={{ borderTopColor: DESIGN.YONSEI_BLUE }}
      />
    </div>
  );

  // 빈 상태 컴포넌트
  const EmptyState = ({ hasToken }: { hasToken: boolean }) => (
    <div className="text-center py-20">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <p className="text-gray-500">아직 포스트가 없습니다</p>
      {hasToken && (
        <p className="text-sm text-gray-400 mt-2">
          첫 번째 NFT 포스트를 만들어보세요!
        </p>
      )}
    </div>
  );

  // 포스트 아이템 컴포넌트
  const PostItem = ({ post }: { post: any }) => {
    const hasImageError = imageErrors.has(post.tokenAddress);
    const showImage = post.image && !hasImageError;

    return (
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {showImage ? (
          <Image
            width={100}
            height={100}
            src={post.image}
            alt={post.name}
            className="w-full h-full object-cover"
            onError={() => onImageError(post.tokenAddress)}
          />
        ) : (
          // 이미지 로딩 실패 또는 없을 때 대체 UI
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">{post.name}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 포스트가 있을 때 그리드 표시
  if (posts.length > 0) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <PostItem key={post.tokenAddress || index} post={post} />
        ))}
      </div>
    );
  }

  // 포스트가 없을 때 빈 상태 표시
  return <EmptyState hasToken={true} />;
}
