import { Button, StyleSheet, TextInput } from 'react-native';
import * as types from '../types';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';

type StoreProps = {
  store: types.Store;
} & {
  remove: () => void;
  rename: (newName: string) => void;
};

const Store: React.FC<StoreProps> = ({ store, remove, rename }) => {
  const [newName, setNewName] = useState(store.name);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
    setNewName(store.name);
  }, [store.name]);

  const handleSubmitEditing = () => {
    rename(newName);
    setEditing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.nameContainer}>
        {
          editing
            ? (
              <TextInput
                style={styles.newNameInput}
                value={newName}
                onChangeText={(text) => setNewName(text)}
                onSubmitEditing={handleSubmitEditing}
              ></TextInput>
            )
            : (
              <ThemedText type={'subtitle'}>{store.name}</ThemedText>
            )
        }
        <Ionicons
          size={18}
          name='pencil'
          style={styles.button}
          onPress={() => {
            if (editing) {
              handleSubmitEditing();
            } else {
              setEditing(true)
            }
          }}
        />
      </ThemedView>
      <Ionicons
        size={18}
        name='remove'
        style={styles.button}
        onPress={() => remove()}
      />
    </ThemedView>
  );
}

export default Store;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'transparent',
  },
  button: {
    padding: 5,
  },
  newNameInput: {
    fontSize: 20,
    borderWidth: 1,
    padding: 5,
  },
});
