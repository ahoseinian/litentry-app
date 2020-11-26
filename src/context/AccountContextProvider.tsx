import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {useAsyncStorage} from '@react-native-community/async-storage';
import {AccountAddressType} from 'src/types';

type AccountContextValueType = {
  accounts: AccountAddressType[] | null;
  setAccount: (account: AccountAddressType | null) => void;
};

type PropTypes = {
  children: React.ReactNode;
};

export const AccountContext = createContext<AccountContextValueType>({
  accounts: [],
  setAccount: () => undefined,
});

function AccountContextProvider({children}: PropTypes) {
  const {getItem, setItem, removeItem} = useAsyncStorage('accounts');
  const [accounts, setAccounts] = useState<AccountAddressType[] | null>(null);

  useEffect(() => {
    getItem((_, result) => {
      if (result) {
        setAccounts(JSON.parse(result));
      }
    });
  }, [getItem]);

  const setAccount = useCallback(
    (account: AccountAddressType | null) => {
      if (account) {
        setItem(JSON.stringify([account]), () => {
          setAccounts([account]);
        });
      } else {
        removeItem(() => {
          setAccounts([account]);
        });
      }
    },
    [setItem, removeItem],
  );

  const value = useMemo(
    () => ({
      accounts,
      setAccount,
    }),
    [accounts, setAccount],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export default AccountContextProvider;
