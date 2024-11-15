import React from 'react';
import { Navigator } from 'react-nativescript-navigation';
import { MainScreen } from './screens/MainScreen';
import { RawMaterialScreen } from './screens/RawMaterialScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { PackagingScreen } from './screens/PackagingScreen';

export function AppContainer() {
  return (
    <Navigator
      initialRoute={{
        component: MainScreen,
      }}
      screens={{
        main: MainScreen,
        rawMaterial: RawMaterialScreen,
        processing: ProcessingScreen,
        packaging: PackagingScreen,
      }}
    />
  );
}