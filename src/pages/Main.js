import { StyleSheet, Image,View, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker,Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

function Main({ navigation }){
    const [currentRegion, setCurrentRegion] = useState(null);
    
        useEffect(() => {
            async function loadInitialPosition(){
                const { granted } = await requestPermissionsAsync();
                if(granted){
                    const { coords } = await getCurrentPositionAsync({enableHighAccuracy: true});

                    setCurrentRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.04,
                        longitudeDela: 0.04
                    })
                }
            }
            loadInitialPosition();
        }, []);

        if(!currentRegion){
            return null;
        }

    return(
        <>
            <MapView style={styles.map} initialRegion={currentRegion}>
                <Marker coordinate={{ latitude: -23.5634448, longitude: -46.6347358}}>
                <Image style={styles.avatar} source={{uri: 'https://avatars3.githubusercontent.com/u/30440137?s=460&v=4'}}/>
                <Callout onPress={() => {
                    navigation.navigate('Profile', {gitHubUserName: 'danielmorine' });
                    }}>
                    <View style={styles.callOut}>
                        <Text style={styles.devName}>Daniel</Text>
                        <Text style={styles.devBio}>Dev FullStatck</Text>
                        <Text style={styles.devTechs}>C#, React, ReactNative</Text>
                    </View>
                </Callout>
                </Marker>
            </MapView>
            <View style={styles.searchForm}>
                <TextInput style={styles.searchInput}
                    placeholder="Busca devs por techs"
                    placeholderTextColor="#FFF"
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                <TouchableOpacity style={styles.loadButton} onPress={() => {}}>
                   <MaterialIcons name="my-location" size={20} color="#FFF" /> Salvar
                </TouchableOpacity>
            </View>

        </>
        )
}


const styles = StyleSheet.create({
    map:{
        flex: 1
    },
    avatar: {
        width: 54,
        height:54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },
    callOut: { width: 260 },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio:{
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },

    searchForm: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      zIndex: 5,
      flexDirection: 'row'
    },
    searchInput: {
        flex:1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset:{
            width: 4, 
            height: 4 
       },
       elevation: 2,    
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }

});

export default Main;