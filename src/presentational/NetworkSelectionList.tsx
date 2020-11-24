import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text, Divider, RadioGroup, Radio} from '@ui-kitten/components';
import globalStyles from 'src/styles';
import {NetworkType} from 'src/types';

type PropTypes = {
  items: NetworkType[];
  selected: NetworkType;
  onSelect: (item: NetworkType) => void;
};

function NetworkSelectionList(props: PropTypes) {
  const {items, selected, onSelect} = props;
  const [selectedIndex, setSelectedIndex] = useState(
    items.findIndex(({ws}) => selected.ws === ws),
  );

  return (
    <Layout style={styles.container} level="1">
      <Layout level="1" style={styles.header}>
        <Text category="h4">Networks</Text>
        <Divider style={globalStyles.divider} />
      </Layout>

      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index) => {
          setSelectedIndex(index);
          onSelect(items[index]);
        }}>
        {items.map((item) => (
          <Radio checked={item.ws === selected.ws} key={item.ws}>
            {item.name}
          </Radio>
        ))}
      </RadioGroup>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {alignItems: 'center'},
});

export default NetworkSelectionList;