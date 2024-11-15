import React, { useState } from 'react';
import { ScrollView, GridLayout, TextField, Button, Label } from '@nativescript/core';
import { useAvailableLots } from '../hooks/useLots';
import { useProcessingSubmit } from '../hooks/useFormSubmit';

export function ProcessingScreen() {
  const [lotId, setLotId] = useState('');
  const [weights, setWeights] = useState({
    shellOn: '',
    meat: '',
    shells: ''
  });

  const { data: lots } = useAvailableLots();
  const { mutate: submitProcessing } = useProcessingSubmit();

  const handleSubmit = () => {
    if (!lotId || !weights.shellOn || !weights.meat || !weights.shells) return;

    submitProcessing({
      lotId,
      shellOnWeight: parseFloat(weights.shellOn),
      meatWeight: parseFloat(weights.meat),
      shellWeight: parseFloat(weights.shells),
      createdAt: new Date().toISOString()
    });
  };

  return (
    <ScrollView className="p-4">
      <GridLayout rows="auto, auto, auto, auto, auto" className="space-y-4">
        <Label text="Processing Data Entry" className="text-xl font-bold" />

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Select Lot" className="text-sm font-medium" />
          <Picker
            selectedValue={lotId}
            onValueChange={(value) => setLotId(value)}
          >
            <Picker.Item label="Select a lot" value="" />
            {lots?.map(lot => (
              <Picker.Item
                key={lot.lot_number}
                label={`${lot.lot_number} - ${lot.weight}kg`}
                value={lot.lot_number}
              />
            ))}
          </Picker>
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Shell-On Weight (kg)" className="text-sm font-medium" />
          <TextField
            value={weights.shellOn}
            onTextChange={(e) => setWeights(prev => ({ ...prev, shellOn: e.value }))}
            keyboardType="number"
            className="input"
            hint="Enter shell-on weight"
          />
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Meat Weight (kg)" className="text-sm font-medium" />
          <TextField
            value={weights.meat}
            onTextChange={(e) => setWeights(prev => ({ ...prev, meat: e.value }))}
            keyboardType="number"
            className="input"
            hint="Enter meat weight"
          />
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Shell Weight (kg)" className="text-sm font-medium" />
          <TextField
            value={weights.shells}
            onTextChange={(e) => setWeights(prev => ({ ...prev, shells: e.value }))}
            keyboardType="number"
            className="input"
            hint="Enter shell weight"
          />
        </GridLayout>

        <Button 
          text="Submit" 
          onTap={handleSubmit}
          className="btn btn-primary"
          isEnabled={!!lotId && !!weights.shellOn && !!weights.meat && !!weights.shells}
        />
      </GridLayout>
    </ScrollView>
  );
}