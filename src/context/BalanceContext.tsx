import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react';
import {AccountContext} from './AccountContextProvider';
import {Modalize} from 'react-native-modalize';
import {Layout, Button, Text, Divider} from '@ui-kitten/components';
import globalStyles, {standardPadding} from 'src/styles';
import {ChainApiContext} from './ChainApiContext';
import {AccountInfo} from '@polkadot/types/interfaces';
import {formatBalance} from '@polkadot/util';
import ModalTitle from 'presentational/ModalTitle';
import {NetworkContext} from './NetworkContext';
import {StyleSheet} from 'react-native';
import Balances from 'presentational/Balances';

type BalanceContextValueType = {
  show: () => void;
};
export const BalanceContext = createContext<BalanceContextValueType>({
  show: () => undefined,
});

type PropTypes = {
  children: React.ReactNode;
};

export default function BalanceContextProvider({children}: PropTypes) {
  const {status, api} = useContext(ChainApiContext);
  const {currentNetwork} = useContext(NetworkContext);
  const {accounts} = useContext(AccountContext);
  const [balance, setBalance] = useState<AccountInfo | null>(null);

  const modalRef = useRef<Modalize>(null);
  const currentAccount = accounts?.[0];

  useEffect(() => {
    let localUnsub: () => void | null;
    if (status && api && currentAccount) {
      api?.query.system
        .account(currentAccount.address, (accountInfo) => {
          console.log('----', accountInfo);
          setBalance(accountInfo);
        })
        .then((unsub) => {
          localUnsub = unsub;
        });
    }

    return () => {
      localUnsub && localUnsub();
    };
  }, [status, api, currentAccount]);

  const show = useCallback(() => {
    modalRef.current?.open();
  }, []);
  const value = useMemo(
    () => ({
      show,
    }),
    [show],
  );

  if (!currentAccount) {
    return null;
  }

  return (
    <BalanceContext.Provider value={value}>
      <>
        {children}
        {currentAccount && (
          <Modalize
            ref={modalRef}
            threshold={250}
            scrollViewProps={{showsVerticalScrollIndicator: false}}
            adjustToContentHeight
            handlePosition="outside"
            closeOnOverlayTap
            panGestureEnabled>
            <Layout level="1" style={styles.container}>
              <ModalTitle
                title={currentAccount.name}
                subtitle={` (@${currentNetwork?.name})`}
              />
              <Divider />
              <Balances balance={balance} />
              <Divider style={globalStyles.divider} />
              <Button
                appearance="ghost"
                onPress={() => modalRef.current?.close()}>
                Close
              </Button>
            </Layout>
          </Modalize>
        )}
      </>
    </BalanceContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: standardPadding * 2,
  },
});
