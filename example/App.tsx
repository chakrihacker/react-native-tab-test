/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  YellowBox,
} from 'react-native';
// tslint:disable-next-line: ordered-imports
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CoverflowExample from './src/CoverflowExample';
import CustomIndicatorExample from './src/CustomIndicatorExample';
import CustomTabBarExample from './src/CustomTabBarExample';
import ScrollableTabBarExample from './src/ScrollableTabBarExample';
import TabBarIconExample from './src/TabBarIconExample';

type State = {
  title: string;
  index: number;
  restoring: boolean;
};

type ExampleComponentType = React.ComponentType<{}> & {
  title: string;
  tintColor?: string;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  appbarElevation?: number;
};

YellowBox.ignoreWarnings(['bind():']);

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_COMPONENTS: ExampleComponentType[] = [
  ScrollableTabBarExample,
  TabBarIconExample,
  CustomIndicatorExample,
  CustomTabBarExample,
  CoverflowExample,
];

export default class ExampleList extends React.Component<{}, State> {
  state = {
    title: 'Examples',
    index: -1,
    restoring: false,
  };

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      this.restoreNavigationState();
    }
  }

  private persistNavigationState = async (currentIndex: number) => {
    if (process.env.NODE_ENV !== 'production') {
      await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
    }
  };

  private restoreNavigationState = async () => {
    this.setState({
      restoring: true,
    });

    const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

    try {
      const savedIndex = JSON.parse(savedIndexString || '');

      if (
        Number.isFinite(savedIndex) &&
        savedIndex > 0 &&
        savedIndex < EXAMPLE_COMPONENTS.length
      ) {
        this.setState({
          index: savedIndex,
        });
      }
    } catch (e) {
      // ignore
    }

    this.setState({
      restoring: false,
    });
  };

  private handleNavigate = (index: number) => {
    this.setState({
      index,
    });
    this.persistNavigationState(index);
  };

  private handleNavigateBack = () => {
    this.handleNavigate(-1);
  };

  private renderItem = (component: ExampleComponentType, i: number) => (
    <TouchableOpacity
      testID={component.title}
      key={i}
      style={styles.touchable}
      onPress={() => this.handleNavigate(i)}
    >
      <Text style={styles.item}>
        {i + 1}. {component.title}
      </Text>
    </TouchableOpacity>
  );

  render() {
    if (this.state.restoring) {
      return null;
    }

    const { index } = this.state;

    const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
    const backgroundColor =
      ExampleComponent && ExampleComponent.backgroundColor
        ? ExampleComponent.backgroundColor
        : '#111';
    const tintColor =
      ExampleComponent && typeof ExampleComponent.tintColor === 'string'
        ? ExampleComponent.tintColor
        : 'white';
    const appbarElevation =
      ExampleComponent && typeof ExampleComponent.appbarElevation === 'number'
        ? ExampleComponent.appbarElevation
        : 4;
    const statusBarStyle =
      ExampleComponent && typeof ExampleComponent.statusBarStyle === 'string'
        ? ExampleComponent.statusBarStyle
        : 'light-content';
    const borderBottomWidth =
      Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0;

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? statusBarStyle : 'light-content'}
        />
        <View
          style={[
            styles.statusbar,
            backgroundColor ? { backgroundColor } : null,
          ]}
        />
        <View
          style={[
            styles.appbar,
            backgroundColor ? { backgroundColor } : null,
            appbarElevation
              ? { elevation: appbarElevation, borderBottomWidth }
              : null,
          ]}
        >
          {index > -1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleNavigateBack}
              testID="back-button"
            >
              <Ionicons
                name={
                  Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'
                }
                size={24}
                color={tintColor}
              />
            </TouchableOpacity>
          ) : null}
          <Text style={[styles.title, tintColor ? { color: tintColor } : null]}>
            {index > -1 ? EXAMPLE_COMPONENTS[index].title : this.state.title}
          </Text>
          {index > -1 ? <View style={styles.button} /> : null}
        </View>
        {index === -1 ? (
          <ScrollView testID="example_list">
            {EXAMPLE_COMPONENTS.map(this.renderItem)}
          </ScrollView>
        ) : ExampleComponent ? (
          <ExampleComponent />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
  statusbar: {
    height: Platform.OS === 'ios' ? 20 : 25,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    flex: 1,
    margin: 16,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    fontSize: 18,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 56,
    padding: 16,
  },
  touchable: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .06)',
  },
  item: {
    fontSize: 16,
    color: '#333',
  },
});
