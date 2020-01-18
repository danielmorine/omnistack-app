import { StyleSheet, Image,View, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker,Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
 

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }){
    const [currentRegion, setCurrentRegion] = useState(null);
    const [data, setData] = useState([]);
    const [techs, setTechs] = useState('');
    
        useEffect(() => {
            async function loadInitialPosition(){
                const { granted } = await requestPermissionsAsync();
                if(granted){
                    const { coords } = await getCurrentPositionAsync({enableHighAccuracy: true});
                    setCurrentRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04
                    })
                }
            }
            loadInitialPosition();
        }, []);

        useEffect(() => {
            subscribeToNewDevs(dev => setData([...data, dev]));
        },[dev]);

        if(!currentRegion){
            return null;
        }

    connectWebSocket = async () => {
        disconnect();
        const { latitude, longitude } = currentRegion;
        connect(latitude, longitude, techs);
    }

    async function searchDev()  {        
        const response = await api.get('/search', {
            params: {
                techs,
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude
            }
        });
        setData(response.data);
        console.log(response.data);
        debugger;

    }

    const handleMapChange = (region) => {
        setCurrentRegion(region);
    }

    return(
        <>
            <MapView onRegionChangeComplete={handleMapChange} style={styles.map} initialRegion={currentRegion}>
                {
                    data && data.map(e =>                         
                        <Marker key={e._id} coordinate={{ latitude: e.location.coordinates[1], longitude: e.location.coordinates[0]}}>
                        <Image style={styles.avatar} source={{uri: e.avatar_url}}/>
                        <Callout onPress={() => {
                            navigation.navigate('Profile', {gitHubUserName: e.githubUserName });
                            }}>
                            <View style={styles.callOut}>
                            <Text style={styles.devName}>{e.name}</Text>
                                <Text style={styles.devBio}>{e.bio}</Text>
                                <Text style={styles.devTechs}>{e.techs.map(i => `${i}, `)}</Text>
                            </View>
                        </Callout>
                        </Marker>                                                
                    )
                        }

            </MapView>
            <View style={styles.searchForm}>
                <TextInput style={styles.searchInput}
                    placeholder="Busca devs por techs"
                    placeholderTextColor="#FFF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={value => setTechs(value)}
                />
                <TouchableOpacity style={styles.loadButton} onPress={searchDev}>
                   <MaterialIcons name="my-location" size={20} color="#FFF" /><Text>Salvar</Text>
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