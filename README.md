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

## 🎓 Hands-on 라이브 코딩 워크샵

**총 소요시간**: 약 20분  
**난이도**: 초급~중급  
**목표**: Farcaster MiniKit과 mint.club SDK 핵심 기능 체험

### 📋 워크샵 준비사항

1. **Node.js 18+** 설치
2. **Farcaster 계정** (Warpcast 앱에서 생성)
3. **Filebase 계정** 및 API 키
4. **Base Sepolia 테스트넷** ETH (소량)

### 🚀 Task 0: 환경 설정 (5분)

#### 1. 프로젝트 클론 및 설치
```bash
git clone https://github.com/your-repo/yeonstagram.git
cd yeonstagram
npm install
```

#### 2. Filebase API 키 설정
1. [Filebase](https://filebase.com/) 가입
2. IPFS 버킷 생성
3. Access Keys → Create Key
4. `.env.local` 파일 생성:
```bash
NEXT_PUBLIC_FILEBASE_API_KEY=당신의_API_키
```

#### 3. 프로젝트 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

---

### ⚡ Task 1: MiniKit 초기화 (3분)

**🎯 목표**: Farcaster MiniKit 연결하기

**📍 파일**: `app/page.tsx`

```typescript
/**
 * TODO Task 1: MiniKit 초기화
 * 힌트: sdk.actions.ready() 함수를 호출하세요
 */
useEffect(() => {
  // TODO: MiniKit SDK 초기화 코드 작성
  // 힌트: sdk.actions.ready();
}, []);
```

**✅ 성공 확인**: 브라우저 개발자 도구에서 에러 없이 로딩

---

### 👤 Task 2: 사용자 정보 표시 (4분)

**🎯 목표**: Farcaster 프로필 정보 가져와서 화면에 표시하기

**📍 파일**: `components/ProfileHeader.tsx`

```typescript
/**
 * TODO Task 2: Farcaster 사용자 정보 연동
 * 힌트: userContext에서 username, pfpUrl 사용
 */
export default function ProfileHeader({ userContext, ... }) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center">
        {/* TODO: 프로필 이미지 표시 */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {/* 힌트: userContext?.pfpUrl 사용 */}
        </div>
        
        <div className="ml-6 flex-1">
          <h1 className="text-xl font-bold">
            {/* TODO: 사용자명 표시 */}
            {/* 힌트: userContext?.username 또는 "사용자" */}
          </h1>
        </div>
      </div>
    </div>
  );
}
```

**✅ 성공 확인**: 본인의 Farcaster 프로필 사진과 사용자명이 표시됨

---

### 🪙 Task 3: 토큰 존재 확인 (5분)

**🎯 목표**: mint.club SDK로 사용자 토큰 존재 여부 확인하기

**📍 파일**: `hooks/useUserToken.ts`

```typescript
/**
 * TODO Task 3: 사용자 토큰 존재 여부 확인
 * 힌트: mintclub.network().token().exists() 사용
 */
const checkUserToken = async (username: string) => {
  if (!username) return;

  setCheckingToken(true);
  try {
    // 힌트 1: 토큰 심볼 생성 (예: "BASEDTOM")
    const tokenSymbol = `BASED${/* TODO: username을 대문자로 변환 */}`;

    // 힌트 2: mint.club SDK 사용
    const exists = await mintclub
      .network(/* TODO: "basesepolia" 입력 */)
      .token(/* TODO: tokenSymbol 입력 */)
      .exists();

    console.log("토큰 존재 여부:", exists);

    if (exists) {
      // 토큰 상세 정보 가져오기 (제공됨)
      const tokenDetail = await mintclub
        .network("basesepolia")
        .token(tokenSymbol)
        .getDetail();
      
      setUserToken({
        tokenAddress: tokenDetail.info.token,
        symbol: tokenDetail.info.symbol,
        name: tokenDetail.info.name,
      });
      
      return tokenDetail.info.token;
    } else {
      setUserToken(null);
      return null;
    }
  } catch (error) {
    console.error("토큰 확인 중 오류:", error);
    setUserToken(null);
    return null;
  } finally {
    setCheckingToken(false);
  }
};
```

**💡 정답**: 
- `username.toUpperCase()`
- `"basesepolia"`
- `tokenSymbol`

**✅ 성공 확인**: 콘솔에 "토큰 존재 여부: false" 출력

---

### 🎨 Task 4: 토큰 생성 (6분)

**🎯 목표**: 나만의 BASED{USERNAME} 토큰 생성하기

**📍 파일**: `hooks/useUserToken.ts`

```typescript
/**
 * TODO Task 4: 새로운 사용자 토큰 생성
 * 힌트: mintclub.network().token().create() 사용
 */
const createUserToken = async (username: string): Promise<boolean> => {
  if (!username) {
    toast.error("사용자명이 필요합니다");
    return false;
  }

  console.log("토큰 생성 시작");
  toast.loading("토큰 생성 중...", { id: "token-creation" });

  const tokenSymbol = `BASED${username.toUpperCase()}`;

  try {
    const result = await mintclub
      .network(/* TODO: 네트워크 이름 */)
      .token(/* TODO: 토큰 심볼 */)
      .create({
        name: tokenSymbol,
        reserveToken: {
          address: "0x4200000000000000000000000000000000000006", // Base ETH
          decimals: 18,
        },
        curveData: {
          curveType: /* TODO: "EXPONENTIAL" 입력 */ as const,
          stepCount: 100,
          maxSupply: 1_000_000_000,
          initialMintingPrice: 0.0000001, // 0.0000001 ETH
          finalMintingPrice: 0.1, // 0.1 ETH
        },
      });

    console.log("토큰 생성 결과:", result);

    if (result) {
      console.log("토큰 생성 트랜잭션 전송됨");
      toast.success("토큰이 성공적으로 생성되었습니다! 🎉", { id: "token-creation" });
      
      // TODO: 토큰 상태 새로고침
      await /* TODO: checkUserToken 함수 호출 */(username);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("토큰 생성 중 오류:", error);
    toast.error("토큰 생성에 실패했습니다. 다시 시도해주세요.", { id: "token-creation" });
    return false;
  }
};
```

**💡 정답**:
- `"basesepolia"`
- `tokenSymbol`
- `"EXPONENTIAL"`
- `checkUserToken`

**✅ 성공 확인**: 
- 토스트 메시지: "토큰이 성공적으로 생성되었습니다! 🎉"
- 프로필에서 "활성화됨" 배지 표시
- 토큰 주소 표시

---

### 🎉 완성!

축하합니다! 여러분은 방금:
- ✅ Farcaster MiniKit 연동
- ✅ Web3 사용자 인증 구현  
- ✅ 블록체인 상태 조회
- ✅ 본인만의 토큰 생성

을 완성했습니다!

### 🚀 다음 단계

1. **포스트 생성**: NFT 포스트 만들어보기
2. **토큰 거래**: mint.club에서 토큰 거래해보기
3. **커스텀 기능**: 본인만의 기능 추가해보기

### 🛠️ 문제 해결

#### 자주 발생하는 오류들:

1. **"Network Error"**: 인터넷 연결 확인
2. **"User Rejected"**: 지갑에서 거래 승인 필요
3. **"Insufficient Funds"**: Base Sepolia ETH 필요
4. **"Token Already Exists"**: 다른 사용자명으로 시도

#### 도움 요청:
- 🙋‍♂️ 강사에게 손들고 질문
- 💬 옆 사람과 함께 문제 해결
- 🔍 브라우저 개발자 도구 확인

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