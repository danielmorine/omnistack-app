import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';


const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            title: 'DevRadar',
        },
        Profile: {
            screen: Profile,
            title: 'Perfil',
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#7D40E7'
            },
            headerTintColor: '#FFF',
            headerBackTitle: null
        }
    })
);

export default Routes;
