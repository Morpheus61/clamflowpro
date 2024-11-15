import React, { useState } from 'react';
import { ScrollView, GridLayout, TextField, Button, Image } from '@nativescript/core';
import { Camera } from '@nativescript/camera';
import { useSuppliers } from '../hooks/useSuppliers';
import { useRawMaterialSubmit } from '../hooks/useFormSubmit';

export function RawMaterialScreen() {
  const [weight, setWeight] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
  const { data: suppliers } = useSuppliers();
  const { mutate: submitRawMaterial } = useRawMaterialSubmit();

  const takePhoto = async () => {
    try {
      const image = await Camera.takePicture({
        width: 1024,
        height: 1024,
        keepAspectRatio: true,
        saveToGallery: false
      });
      setPhoto(image.android || image.ios);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleSubmit = () => {
    if (!photo || !weight || !supplierId) return;

    submitRawMaterial({
      supplierId,
      weight: parseFloat(weight),
      photoUrl: photo,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <ScrollView className="p-4">
      <GridLayout rows="auto, auto, auto, auto, auto" className="space-y-4">
        <Label text="Raw Material Receipt" className="text-xl font-bold" />
        
        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Select Supplier" className="text-sm font-medium" />
          <Picker
            selectedValue={supplierId}
            onValueChange={(value) => setSupplierId(value)}
          >
            <Picker.Item label="Select a supplier" value="" />
            {suppliers?.map(supplier => (
              <Picker.Item 
                key={supplier.id}
                label={`${supplier.code} - ${supplier.name}`}
                value={supplier.id}
              />
            ))}
          </Picker>
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Weight (kg)" className="text-sm font-medium" />
          <TextField
            value={weight}
            onTextChange={(e) => setWeight(e.value)}
            keyboardType="number"
            className="input"
            hint="Enter weight"
          />
        </GridLayout>

        {photo ? (
          <GridLayout rows="*, auto" className="space-y-2">
            <Image src={photo} className="h-64 rounded" />
            <Button text="Retake Photo" onTap={takePhoto} className="btn" />
          </GridLayout>
        ) : (
          <Button text="Take Weight Photo" onTap={takePhoto} className="btn" />
        )}

        <Button 
          text="Submit" 
          onTap={handleSubmit}
          className="btn btn-primary"
          isEnabled={!!photo && !!weight && !!supplierId}
        />
      </GridLayout>
    </ScrollView>
  );
}