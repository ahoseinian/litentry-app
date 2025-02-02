import React, {useCallback, useRef, useContext, useMemo} from 'react';
import {Modalize} from 'react-native-modalize';
import {StyleSheet} from 'react-native';
import NetworkSelectionList from 'presentational/NetworkSelectionList';
import globalStyles, {standardPadding} from 'src/styles';
import {Divider, Button, Layout} from '@ui-kitten/components';
import {NetworkContext} from 'context/NetworkContext';
import {NetworkType} from 'src/types';

export type InjectedPropTypes = {
  networkSelection: {
    selectNetwork: () => void;
    currentNetwork: NetworkType | undefined;
  };
};

function withNetworkSelect<T>(
  Comp: React.ComponentType<T & InjectedPropTypes>,
) {
  return function Hoc(props: T) {
    const modalRef = useRef<Modalize>(null);
    const {currentNetwork, availableNetworks, select} = useContext(
      NetworkContext,
    );
    const selectNetwork = useCallback(() => {
      modalRef.current?.open();
    }, []);
    const handleSelection = useCallback(
      (network: NetworkType) => {
        select(network);
        modalRef.current?.close();
      },
      [select],
    );
    const value = useMemo(() => ({selectNetwork, currentNetwork}), [
      selectNetwork,
      currentNetwork,
    ]);

    return (
      <>
        <Comp {...props} networkSelection={value} />
        <Modalize
          ref={modalRef}
          threshold={250}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          handlePosition="outside"
          adjustToContentHeight
          closeOnOverlayTap
          panGestureEnabled>
          <Layout style={styles.networkModal}>
            <NetworkSelectionList
              items={availableNetworks}
              selected={currentNetwork}
              onSelect={handleSelection}
            />
            <Divider style={globalStyles.divider} />
            <Button
              appearance="ghost"
              onPress={() => modalRef.current?.close()}>
              Close
            </Button>
          </Layout>
        </Modalize>
      </>
    );
  };
}

const styles = StyleSheet.create({
  modal: {},
  networkModal: {
    paddingVertical: standardPadding * 3,
    paddingHorizontal: standardPadding * 2,
  },
});

export default withNetworkSelect;
