import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import io from 'socket.io-client';

import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text
} from "react-native";

import api from '../services/api';
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  const user = navigation.getParam('user');

  useEffect(() => {
    const loadUsers = async () => {
      const response = await api.get('devs', {
        headers: {
          user: user
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [user]);

  useEffect(() => {
    const socket = io('http://10.0.2.2:3366/', {
      query: {
        user
      }
    });

    socket.on('match', match => {
      setMatchDev(match);
    });
  }, [user]);

  const handleLogout = async () => {
    AsyncStorage.clear();

    navigation.navigate('Login');
  }

  const handleLike = async () => {
    const [_users, ...rest] = users;

    await api.post(`devs/${_users._id}/likes`, null, {
      headers: {
        user: user
      }
    });

    setUsers(rest);
  }

  const handleDislike = async () => {
    const [_users, ...rest] = users;

    await api.post(`devs/${_users._id}/dislikes`, null, {
      headers: {
        user: user
      }
    });

    setUsers(rest);
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {
          users.length === 0
            ?
            <Text style={styles.empty}>Acabou :(</Text>
            : (
              users.map((_item, index) => {
                return (
                  <View key={_item._id} style={[styles.card, { zIndex: users.length - index }]}>
                    <Image style={styles.avatar} source={{ uri: _item.avatar }} />
                    <View style={styles.footer}>
                      <Text style={styles.name}>{_item.name}</Text>
                      <Text numberOfLines={3} style={styles.bio}>{_item.bio}</Text>
                    </View>
                  </View>)
              })
            )
        }
      </View>

      {
        users.length > 0 &&
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      }
      {
        matchDev && (
          <View style={styles.matchContainer}>
            <Image style={styles.matchImage} soure={itsamatch} />
            <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />

            <Text style={styles.matchName}>{matchDev.name}</Text>
            <Text style={styles.matchBio} numberOfLines={3}>{matchDev.bio}</Text>
            <TouchableOpacity onPress={() => { setMatchDev(null) }}>
              <Text style={styles.closeMatch}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute'
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#333'
  },
  logo: {
    marginTop: 30
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 8,
      height: 2,
    },
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  matchImage: {
    height: 60,
    resizeMode: 'contain'
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 90,
    borderWidth: 5,
    borderColor: '#FFF',
    marginVertical: 30
  },
  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF'
  },
  matchBio: {
    marginTop: 20,
    fontSize: 16,
    color: 'rgba(255,255,255, 0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30
  },
  closeMatch: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold'
  }

});
