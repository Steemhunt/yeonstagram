/**
 * 사용자 토큰 관리 훅
 * 사용자의 BASED{USERNAME} 토큰 생성 및 조회 관리
 */

import { useState } from "react";
import { mintclub } from "mint.club-v2-sdk";
import toast from "react-hot-toast";
import { UserToken } from "@/types";
import {
  NETWORK,
  USER_TOKEN_CONFIG,
  TOAST_MESSAGES,
  createTokenSymbol,
} from "@/constants";

export const useUserToken = () => {
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [checkingToken, setCheckingToken] = useState(false);

  /**
   * TODO Task 3: 사용자 토큰 존재 여부 확인
   * 
   * 🎯 목표: mint.club SDK를 사용해서 BASED{USERNAME} 토큰이 이미 존재하는지 확인
   * 
   * 📝 단계별 힌트:
   * 1. 토큰 심볼 만들기: `BASED${username.toUpperCase()}`
   * 2. mint.club SDK로 토큰 존재 여부 확인
   * 3. 결과에 따라 UI 상태 업데이트
   * 
   * 🔗 mint.club SDK 문서: https://sdk.mint.club/docs/sdk/network/token/exists
   */
  const checkUserToken = async (username: string) => {
    if (!username) return;

    setCheckingToken(true);
    try {
      /*
        TODO Task 3-1: 토큰 심볼 생성
        
        🎯 목표: 사용자명을 기반으로 토큰 심볼을 만드세요
        📝 힌트: `BASED${username을_대문자로_변환}`
        
        예시:
        - username이 "tom"이면 → "BASEDTOM"
        - username이 "alice"면 → "BASEDALICE"
      */
      const tokenSymbol = `BASED${/* TODO: username을 대문자로 변환 */}`;
      
      console.log("확인할 토큰 심볼:", tokenSymbol);

      /*
        TODO Task 3-2: mint.club SDK로 토큰 존재 여부 확인
        
        🎯 목표: mint.club SDK를 사용해서 토큰이 존재하는지 확인하세요
        📝 힌트: mintclub.network().token().exists() 패턴 사용
        
        단계:
        1. mintclub.network("네트워크명")
        2. .token("토큰심볼")
        3. .exists()
      */
      const exists = await mintclub
        .network(/* TODO: 네트워크 이름 입력 (힌트: "basesepolia") */)
        .token(/* TODO: 토큰 심볼 입력 */)
        .exists();

      console.log("토큰 존재 여부:", exists);

      if (exists) {
        /*
          토큰이 존재하면 상세 정보 가져오기
          (이 부분은 이미 완성되어 있습니다)
        */
        console.log("토큰이 존재합니다! 상세 정보를 가져옵니다...");
        
        const tokenDetail = await mintclub
          .network(NETWORK.BASE_SEPOLIA)
          .token(tokenSymbol)
          .getDetail();
        
        console.log("토큰 상세 정보:", tokenDetail);
        
        setUserToken({
          tokenAddress: tokenDetail.info.token,
          symbol: tokenDetail.info.symbol,
          name: tokenDetail.info.name,
        });
        
        return tokenDetail.info.token;
      } else {
        console.log("토큰이 존재하지 않습니다.");
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

  /**
   * TODO Task 4: 새로운 사용자 토큰 생성
   * 
   * 🎯 목표: mint.club SDK로 exponential curve 토큰 생성
   * 
   * 📝 단계별 힌트:
   * 1. 토큰 생성 파라미터 이해하기
   * 2. mint.club create 함수 사용하기
   * 3. 트랜잭션 결과 처리하기
   * 
   * 🔗 mint.club SDK 문서: https://sdk.mint.club/docs/sdk/network/token/create
   */
  const createUserToken = async (username: string): Promise<boolean> => {
    if (!username) {
      toast.error(TOAST_MESSAGES.USERNAME_REQUIRED);
      return false;
    }

    console.log("토큰 생성 시작");
    toast.loading(TOAST_MESSAGES.TOKEN_CREATION, { id: "token-creation" });

    /*
      TODO Task 4-1: 토큰 심볼 생성
      
      🎯 목표: 생성할 토큰의 심볼을 만드세요
      📝 힌트: createTokenSymbol 함수를 사용하거나 직접 구현
      
      createTokenSymbol 함수는 이미 constants에 정의되어 있습니다:
      export const createTokenSymbol = (username: string): string => 
        `BASED${username.toUpperCase()}`;
    */
    const tokenSymbol = createTokenSymbol(username);
    console.log("생성할 토큰 심볼:", tokenSymbol);

    try {
      /*
        TODO Task 4-2: mint.club 토큰 생성
        
        🎯 목표: mint.club SDK를 사용해서 새로운 토큰을 생성하세요
        📝 힌트: mintclub.network().token().create() 패턴 사용
        
        단계:
        1. mintclub.network("네트워크명")
        2. .token("토큰심볼")
        3. .create({ 설정객체 })
        
        설정객체 구조:
        {
          name: 토큰이름,
          reserveToken: { address: ETH주소, decimals: 18 },
          curveData: { curveType, stepCount, maxSupply, ... }
        }
      */
      const result = await mintclub
        .network(/* TODO: 네트워크 이름 (힌트: NETWORK.BASE_SEPOLIA) */)
        .token(/* TODO: 토큰 심볼 */)
        .create({
          name: tokenSymbol,
          reserveToken: {
            address: NETWORK.ETH_ADDRESS, // Base ETH 주소 (이미 정의됨)
            decimals: USER_TOKEN_CONFIG.DECIMALS, // 18
          },
          curveData: {
            /*
              TODO Task 4-3: 커브 타입 설정
              
              🎯 목표: 토큰의 가격 커브 타입을 설정하세요
              📝 힌트: USER_TOKEN_CONFIG.CURVE_TYPE 사용
              
              사용 가능한 커브 타입:
              - "LINEAR": 선형 증가
              - "EXPONENTIAL": 지수 증가 (권장)
              - "LOGARITHMIC": 로그 증가
            */
            curveType: /* TODO: 커브 타입 입력 (힌트: USER_TOKEN_CONFIG.CURVE_TYPE) */ as const,
            stepCount: USER_TOKEN_CONFIG.STEP_COUNT, // 100
            maxSupply: USER_TOKEN_CONFIG.MAX_SUPPLY, // 1,000,000,000
            initialMintingPrice: USER_TOKEN_CONFIG.INITIAL_PRICE, // 0.0000001 ETH
            finalMintingPrice: USER_TOKEN_CONFIG.FINAL_PRICE, // 0.1 ETH
          },
        });

      console.log("토큰 생성 결과:", result);

      if (result) {
        console.log("토큰 생성 트랜잭션 전송됨");
        toast.success(TOAST_MESSAGES.TOKEN_SUCCESS, { id: "token-creation" });
        
        /*
          TODO Task 4-4: 토큰 상태 새로고침
          
          🎯 목표: 새로 생성된 토큰을 확인하기 위해 상태를 새로고침하세요
          📝 힌트: checkUserToken 함수를 호출하세요
          
          이 함수는 파라미터로 받은 checkUserToken 함수입니다.
        */
        await /* TODO: checkUserToken 함수 호출 */(username);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("토큰 생성 중 오류:", error);
      
      // 에러 메시지 분석
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      
      if (errorMessage.includes("User rejected")) {
        toast.error("사용자가 트랜잭션을 거부했습니다.", { id: "token-creation" });
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("잔액이 부족합니다. Base Sepolia ETH가 필요합니다.", { id: "token-creation" });
      } else if (errorMessage.includes("already exists")) {
        toast.error("이미 존재하는 토큰 심볼입니다.", { id: "token-creation" });
      } else {
        toast.error(TOAST_MESSAGES.TOKEN_ERROR, { id: "token-creation" });
      }
      
      return false;
    }
  };

  return {
    userToken,
    checkingToken,
    checkUserToken,
    createUserToken,
  };
};
