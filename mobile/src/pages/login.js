import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-community/async-storage";

import {
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  Platform
} from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    console.log(AsyncStorage.getItem('user'));

    AsyncStorage.getItem('user').then(user => {
      if (user != null && user != "") {
        navigation.navigate("Main", { user });
      }
    });
  }, []);

  const handleLogin = async () => {
    const response = await api.post("devs", { username: user });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);

    navigation.navigate("Main", { user: _id });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      enabled={Platform.OS === "ios"}
    >
      <Image source={logo} />

      <TextInput
        placeholder="Digite seu usuário"
        style={styles.input}
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        value={user}
        onChangeText={setUser}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },
  button: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#DF4723",
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center",
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
});
