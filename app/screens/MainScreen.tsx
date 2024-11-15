import React from 'react';
import { StackNavigationProp } from 'react-nativescript-navigation';
import { GridLayout, ScrollView, Label, Image } from '@nativescript/core';
import { MainStackParamList } from '../types';
import { Card } from '../components/Card';

interface Props {
  navigation: StackNavigationProp<MainStackParamList, 'main'>;
}

export default function MainScreen({ navigation }: Props) {
  return (
    <ScrollView className="bg-primary">
      <GridLayout rows="auto, auto" className="p-4">
        {/* Logo and Title */}
        <GridLayout rows="auto, auto" className="text-center p-4">
          <Image src="~/assets/logo.png" className="h-20 w-20 self-center" />
          <Label text="ClamFlow" className="text-2xl text-center text-white font-bold" />
        </GridLayout>
        
        {/* Menu Cards - Vertical Layout */}
        <GridLayout rows="auto, auto, auto" className="gap-4 mt-4">
          <Card
            title="Raw Material Entry"
            description="Record incoming clam deliveries"
            onTap={() => navigation.navigate('rawMaterial')}
            icon="scale"
            row={0}
          />
          
          <Card
            title="Processing Data"
            description="Track processing yields and weights"
            onTap={() => navigation.navigate('processing')}
            icon="package"
            row={1}
          />
          
          <Card
            title="Packaging Details"
            description="Generate QR codes for packages"
            onTap={() => navigation.navigate('packaging')}
            icon="box"
            row={2}
          />
        </GridLayout>
      </GridLayout>
    </ScrollView>
  );
}