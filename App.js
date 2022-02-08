import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {primary: '#1f145c', white: '#fff'};
const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([]);
  // get todos list from device
  useEffect(() => {
    getTodoFromDevice();
  }, [])


  //set todos to device
  useEffect(() => {
    saveTodoToDevice(todos);
  }, [todos])

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.complete ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo.complete && (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => markTodoComplete(todo?.id)}>
            <Icon name="done" size={25} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionIcon, {backgroundColor: 'red', borderRadius: 5, height: 25}}
          onPress={() => deleteTodoById(todo?.id)}>
          <Icon name="delete" size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const saveTodoToDevice = async todos => {
    try {
      const jsonValue = JSON.stringify(todos)
      await AsyncStorage.setItem('react-native-todo', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getTodoFromDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('react-native-todo');
      if(todos != null){
        setTodos(JSON.parse(todos))
      }
    } catch (e) {
      console.log(e)
    }
  }
  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please enter todo!');
    } else {
      const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        task: textInput,
        complete: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const markTodoComplete = todoId => {
    const newTodos = todos.map(item => {
      if (item.id == todoId) {
        return {...item, complete: true};
      }
      return item;
    });
    setTodos(newTodos);
  };

  const deleteTodoById = todoId => {
    const newTodo = todos.filter(item => item.id != todoId);
    setTodos(newTodo);
  };

  const deleteAll = () => {
    if(todos != ''){
      Alert.alert('Comfirm', 'Are you sure?', [
        {
          text: 'Yes',
          onPress: () => setTodos([]),
        },
        {
          text: 'No',
        },
      ]);
    }else {
      Alert.alert('Error', 'Todos list not found');
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          TODO APP
        </Text>
        <Icon name="delete" color="red" size={25} onPress={deleteAll} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add todo"
            onChangeText={text => setTextInput(text)}
            value={textInput}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.white} size={25} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    elevation: 12,
    flexDirection: 'row',
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
});

export default App;
