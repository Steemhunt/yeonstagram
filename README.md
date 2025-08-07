# 연스타그램 (Yeonstagram)

Yonsei University Instagram Clone with MiniKit & mint.club v2

![Yeonstagram Preview](public/og.png)

## 🌟 프로젝트 소개

연스타그램은 연세대학교를 테마로 한 Instagram 클론으로, Farcaster MiniKit과 mint.club v2 SDK를 활용하여 다음과 같은 기능을 제공합니다:

- **🎯 개인 토큰 발행**: 각 사용자마다 `BASED{USERNAME}` 토큰 생성
- **📸 NFT 포스트**: 이미지를 NFT로 민팅하여 Instagram 스타일 피드에 표시
- **🔗 Farcaster 연동**: MiniKit을 통한 사용자 인증 및 프로필 정보 연동
- **☁️ IPFS 저장**: Filebase를 통한 탈중앙화 이미지 저장

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Filebase 계정 (IPFS 업로드용)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-repo/yeonstagram.git
   cd yeonstagram
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` 파일에 다음 값을 설정하세요:
   ```
   NEXT_PUBLIC_FILEBASE_API_KEY=your_filebase_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

## 🏗️ 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 앱 컴포넌트
│   └── layout.tsx        # 레이아웃 설정
├── components/
│   ├── ProfileHeader.tsx # 프로필 헤더 컴포넌트
│   ├── PostGrid.tsx      # 포스트 그리드 컴포넌트
│   └── CreatePostModal.tsx # 포스트 생성 모달
├── hooks/
│   ├── useUserToken.ts   # 사용자 토큰 관리 훅
│   └── usePosts.ts       # 포스트 관리 훅
├── types/
│   └── index.ts          # TypeScript 타입 정의
├── constants/
│   └── index.ts          # 앱 상수 및 설정값
└── server/
    └── ipfs.ts           # IPFS 업로드 서버 액션
```

## 🔧 주요 기능

### 1. 사용자 토큰 시스템

각 사용자는 Farcaster 사용자명을 기반으로 한 개인 토큰을 발행할 수 있습니다.

- **토큰명**: `BASED{USERNAME}` (예: BASEDTOM)
- **네트워크**: Base Sepolia 테스트넷
- **토큰경제**: 지수함수 커브, 초기가격 0.0000001 ETH, 최종가격 0.1 ETH

### 2. NFT 포스트 생성

사용자는 이미지를 업로드하여 NFT 포스트를 생성할 수 있습니다.

- **Reserve Token**: 사용자의 개인 토큰
- **이미지 저장**: IPFS (Filebase)
- **메타데이터**: JSON 형태로 IPFS에 저장

### 3. Instagram 스타일 UI

연세대학교 브랜드 컬러(#0E4A84)를 활용한 깔끔한 UI/UX

- **3열 그리드**: 인스타그램과 동일한 포스트 레이아웃
- **프로필 섹션**: Farcaster 프로필 정보 표시
- **반응형 디자인**: 모바일 우선 설계

## 🔑 환경변수 설정

### Filebase 설정

1. [Filebase](https://filebase.com/)에 가입
2. IPFS 버킷 생성
3. Access Keys에서 API 키 생성
4. `.env.local`에 API 키 추가

자세한 설정 방법은 [FILEBASE_SETUP.md](FILEBASE_SETUP.md)를 참조하세요.

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: mint.club v2 SDK, Base Sepolia
- **Storage**: IPFS (Filebase)
- **Authentication**: Farcaster MiniKit
- **State Management**: React Hooks (Custom)

## 📝 코드 구조 설명

### 커스텀 훅

#### `useUserToken.ts`
```typescript
// 사용자 토큰 생성 및 관리
const { userToken, checkingToken, checkUserToken, createUserToken } = useUserToken();
```

#### `usePosts.ts`
```typescript
// NFT 포스트 로딩 및 이미지 에러 처리
const { posts, loadingPosts, imageErrors, loadUserPosts, handleImageError } = usePosts();
```

### 주요 컴포넌트

#### `ProfileHeader.tsx`
- Farcaster 프로필 정보 표시
- 토큰 활성화 버튼
- 토큰 상태 표시

#### `PostGrid.tsx`
- 3열 그리드 레이아웃
- 이미지 로딩 실패 처리
- 빈 상태 표시

#### `CreatePostModal.tsx`
- 이미지 업로드 및 압축
- IPFS 메타데이터 업로드
- NFT 민팅

## 🎯 데모 시나리오

1. **사용자 온보딩**: Farcaster로 로그인 후 토큰 활성화
2. **첫 포스트 생성**: 이미지 업로드 및 NFT 민팅
3. **피드 확인**: Instagram 스타일 그리드에서 포스트 확인
4. **추가 포스트**: 더 많은 NFT 포스트 생성

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♂️ 문의사항

프로젝트에 대한 문의사항이 있으시면 Issues를 통해 연락해주세요.

---

**Yeonstagram** - Yonsei University × Instagram × Web3