import { Button, StyleSheet, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '../../components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import * as types from '@/types';
import Store from '../../components/Store';
import db from '../../lib/db';
import { Ionicons } from '@expo/vector-icons';

db.then((db) => {
  db.runAsync(
    'CREATE TABLE IF NOT EXISTS stores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)'
  );
});

export default function TabThreeScreen() {
  const [stores, setStores] = useState<types.Store[]>([]);
  const [newStoreName, setNewStoreName] = useState<types.Store['name']>('');
  const storeInputRef = useRef<TextInput>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    if (!shouldRefetch) {
      return
    };

    db.then((db) => {
      db.getAllAsync<types.Store>('SELECT * from stores').then((stores) => {
        setStores(stores);
      });
    });

    setShouldRefetch(false);
  }, [shouldRefetch]);

  const addStore = () => {
    db.then((db) => {
      db.runAsync('INSERT INTO stores (name) values (?)', [newStoreName]);
    })

    setNewStoreName('');
    setShouldRefetch(true);
  };

  return (
    <ParallaxScrollView>
        <ThemedView style={styles.storeInputContainer}>
          <TextInput
            ref={storeInputRef}
            value={newStoreName}
            onChangeText={(text) => setNewStoreName(text)}
            style={styles.storeInput}
            placeholder='Type in a new store'
          />
          {/* <Button title='Add' onPress={addStore} /> */}
          <Ionicons style={styles.addButton} size={30} name='add' onPress={addStore} />
        </ThemedView>
        <ThemedView style={styles.storesContainer}>
          {
            stores.map((store) => {
              return (
                <Store
                  store={store}
                  remove={() => {}}
                  rename={(newName) => {
                    db.then((db) => {
                      const bindParams = { $name: newName, $id: store.id }

                      db.runAsync('UPDATE stores SET name = $name WHERE id = $id', bindParams)
                        .then(() => {
                          setShouldRefetch(true);
                        });
                    });
                  }}
                  key={store.id}
                />
              )
            })
          }
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 5,
  },
  storeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
  },
  storeInput: {
    flex: 1,
    padding: 5,
  },
  storesContainer: {
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
