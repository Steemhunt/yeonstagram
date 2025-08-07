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
   * 사용자 토큰 존재 여부 확인 및 정보 조회
   * @param username Farcaster 사용자명
   */
  const checkUserToken = async (username: string) => {
    if (!username) return;

    setCheckingToken(true);
    try {
      const tokenSymbol = createTokenSymbol(username);

      // 토큰 존재 여부 확인
      const exists = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .exists();

      console.log("토큰 존재 여부:", exists);

      if (exists) {
        // 토큰이 존재하면 상세 정보 가져오기
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

        return tokenDetail.info.token; // 포스트 로딩을 위해 토큰 주소 반환
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

  /**
   * 새로운 사용자 토큰 생성
   * @param username Farcaster 사용자명
   * @returns Promise<boolean> 성공 여부
   */
  const createUserToken = async (username: string): Promise<boolean> => {
    if (!username) {
      toast.error(TOAST_MESSAGES.USERNAME_REQUIRED);
      return false;
    }

    console.log("토큰 생성 시작");
    toast.loading(TOAST_MESSAGES.TOKEN_CREATION, { id: "token-creation" });

    const tokenSymbol = createTokenSymbol(username);

    try {
      // 사용자 토큰 생성 (지정된 파라미터로)
      const result = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .create({
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
        });

      console.log("토큰 생성 결과:", result);

      if (result) {
        console.log("토큰 생성 트랜잭션 전송됨");
        toast.success(TOAST_MESSAGES.TOKEN_SUCCESS, { id: "token-creation" });

        // 토큰 상태 새로고침
        await checkUserToken(username);
        return true;
      }

      return false;
    } catch (error) {
      console.error("토큰 생성 중 오류:", error);
      toast.error(TOAST_MESSAGES.TOKEN_ERROR, { id: "token-creation" });
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
