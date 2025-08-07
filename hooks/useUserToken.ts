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
   * 사용자 토큰 존재 여부 확인
   * mint.club SDK를 사용해서 BASED{USERNAME} 토큰이 이미 존재하는지 확인
   */
  const checkUserToken = async (username: string) => {
    if (!username) {
      console.warn("⚠️ 사용자명이 없어 토큰 확인을 건너뛰니다");
      return;
    }

    console.log("🔍 사용자 토큰 존재 확인 시작:", username);
    setCheckingToken(true);
    try {
      const tokenSymbol = createTokenSymbol(username);
      console.log("🏷️ 확인할 토큰 심볼:", tokenSymbol);

      console.log("📡 mint.club SDK로 토큰 존재 여부 확인 중...");
      const exists = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .exists();

      console.log("📋 토큰 존재 여부 결과:", exists);

      if (exists) {
        console.log("✅ 토큰이 존재합니다! 상세 정보를 가져옵니다...");

        const tokenDetail = await mintclub
          .network(NETWORK.BASE_SEPOLIA)
          .token(tokenSymbol)
          .getDetail();

        console.log("📋 토큰 상세 정보:", tokenDetail);
        console.log("📦 토큰 주소:", tokenDetail.info.token);
        console.log("🏷️ 토큰 심볼:", tokenDetail.info.symbol);
        console.log("📝 토큰 이름:", tokenDetail.info.name);

        if (
          !tokenDetail.info.token ||
          !tokenDetail.info.token.startsWith("0x")
        ) {
          console.error("❌ 유효하지 않은 토큰 주소:", tokenDetail.info.token);
          setUserToken(null);
          return null;
        }

        const userTokenData = {
          tokenAddress: tokenDetail.info.token,
          symbol: tokenDetail.info.symbol,
          name: tokenDetail.info.name,
        };

        console.log("💾 사용자 토큰 데이터 저장:", userTokenData);
        setUserToken(userTokenData);

        return tokenDetail.info.token;
      } else {
        console.log("❌ 토큰이 존재하지 않습니다.");
        setUserToken(null);
        return null;
      }
    } catch (error) {
      console.error("💥 토큰 확인 중 오류 발생:");
      console.error("🔍 에러 타입:", typeof error);
      console.error("📋 에러 상세:", error);
      if (error instanceof Error) {
        console.error("📝 에러 메시지:", error.message);
      }
      setUserToken(null);
      return null;
    } finally {
      console.log("🏁 토큰 확인 프로세스 종료");
      setCheckingToken(false);
    }
  };

  /**
   * 새로운 사용자 토큰 생성
   * mint.club SDK로 exponential curve 토큰 생성
   */
  const createUserToken = async (username: string): Promise<boolean> => {
    if (!username) {
      console.error("❌ 사용자명이 없어 토큰을 생성할 수 없습니다");
      toast.error(TOAST_MESSAGES.USERNAME_REQUIRED);
      return false;
    }

    console.log("🚀 사용자 토큰 생성 시작:", username);
    toast.loading(TOAST_MESSAGES.TOKEN_CREATION, { id: "token-creation" });

    const tokenSymbol = createTokenSymbol(username);
    console.log("🏷️ 생성할 토큰 심볼:", tokenSymbol);

    try {
      const tokenParams = {
        name: tokenSymbol,
        reserveToken: {
          address: NETWORK.ETH_ADDRESS,
          decimals: USER_TOKEN_CONFIG.DECIMALS,
        },
        curveData: {
          curveType: USER_TOKEN_CONFIG.CURVE_TYPE,
          stepCount: USER_TOKEN_CONFIG.STEP_COUNT,
          maxSupply: USER_TOKEN_CONFIG.MAX_SUPPLY,
          initialMintingPrice: USER_TOKEN_CONFIG.INITIAL_PRICE,
          finalMintingPrice: USER_TOKEN_CONFIG.FINAL_PRICE,
        },
      };

      console.log("⚙️ 토큰 생성 파라미터:", tokenParams);
      console.log("📡 mint.club SDK로 토큰 생성 요청 중...");

      const result = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .create(tokenParams);

      console.log("🔍 토큰 생성 결과 타입:", typeof result);
      console.log("📊 토큰 생성 결과 상세:", result);

      if (result) {
        console.log("✅ 토큰 생성 트랜잭션 전송됨");
        toast.success(TOAST_MESSAGES.TOKEN_SUCCESS, { id: "token-creation" });

        console.log("🔄 토큰 상태 새로고침 중...");
        await checkUserToken(username);
        return true;
      } else {
        console.error("❌ 토큰 생성 실패: 결과가 null/undefined");
        toast.error("토큰 생성에 실패했습니다.", { id: "token-creation" });
        return false;
      }
    } catch (error) {
      console.error("💥 토큰 생성 중 오류 발생:");
      console.error("🔍 에러 타입:", typeof error);
      console.error("📋 에러 상세:", error);

      if (error instanceof Error) {
        console.error("📝 에러 메시지:", error.message);
        console.error("🔗 에러 스택:", error.stack);
      }

      // 에러 메시지 분석
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("🚨 최종 에러 메시지:", errorMessage);

      if (errorMessage.includes("User rejected")) {
        console.error("❌ 사용자가 트랜잭션 거부");
        toast.error("사용자가 트랜잭션을 거부했습니다.", {
          id: "token-creation",
        });
      } else if (errorMessage.includes("insufficient funds")) {
        console.error("❌ 잔액 부족");
        toast.error("잔액이 부족합니다. Base Sepolia ETH가 필요합니다.", {
          id: "token-creation",
        });
      } else if (errorMessage.includes("already exists")) {
        console.error("❌ 토큰 심볼 중복");
        toast.error("이미 존재하는 토큰 심볼입니다.", { id: "token-creation" });
      } else {
        toast.error(TOAST_MESSAGES.TOKEN_ERROR, { id: "token-creation" });
      }

      return false;
    }
  };

  console.log("📋 useUserToken 후크 상태:", {
    hasUserToken: !!userToken,
    tokenAddress: userToken?.tokenAddress,
    symbol: userToken?.symbol,
    checkingToken,
  });

  return {
    userToken,
    checkingToken,
    checkUserToken,
    createUserToken,
  };
};
