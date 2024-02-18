import React, { createContext, useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/app/store";
import refreshToken from "src/app/api/auth/refreshTokenThunk";

export const RefreshTokensContext = createContext({
  hasRefreshedToken: false,
});

interface Props {
  children?: React.ReactNode;
}

const RefreshTokensProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // React.StrictMode rerenders the app twice in dev mode
  const firstRender = useRef(true);

  const [hasRefreshedToken, setHasRefreshedToken] = useState(!!accessToken);

  useEffect(() => {
    const getRefreshedAccessToken = async () => {
      await dispatch(refreshToken());
      setHasRefreshedToken(true);
    };

    if (!accessToken && firstRender.current) {
      firstRender.current = false;
      getRefreshedAccessToken();
    }
  }, [accessToken, dispatch]);

  return (
    <RefreshTokensContext.Provider value={{ hasRefreshedToken }}>
      {children}
    </RefreshTokensContext.Provider>
  );
};

export default RefreshTokensProvider;
