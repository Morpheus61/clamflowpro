import React, { useState } from 'react';
import { ScrollView, GridLayout, TextField, Button, Label, Image } from '@nativescript/core';
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { QRGenerator } from 'nativescript-qr-generator';
import { useAvailableLots } from '../hooks/useLots';
import { usePackagingSubmit } from '../hooks/useFormSubmit';

export function PackagingScreen() {
  const [lotId, setLotId] = useState('');
  const [type, setType] = useState<'shell-on' | 'meat'>('shell-on');
  const [boxNumber, setBoxNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const { data: lots } = useAvailableLots();
  const { mutate: submitPackaging } = usePackagingSubmit();

  const generateQR = async () => {
    if (!lotId || !boxNumber || !weight) return;

    try {
      const qr = await QRGenerator.generate({
        text: JSON.stringify({
          lotId,
          boxNumber,
          type,
          weight,
          date: new Date().toISOString()
        }),
        width: 300,
        height: 300
      });
      setQrCode(qr);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const handleSubmit = () => {
    if (!lotId || !boxNumber || !weight || !qrCode) return;

    submitPackaging({
      lotId,
      type,
      boxNumber,
      weight: parseFloat(weight),
      qrCode,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <ScrollView className="p-4">
      <GridLayout rows="auto, auto, auto, auto, auto, auto" className="space-y-4">
        <Label text="Packaging Details" className="text-xl font-bold" />

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
                label={lot.lot_number}
                value={lot.lot_number}
              />
            ))}
          </Picker>
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Product Type" className="text-sm font-medium" />
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
          >
            <Picker.Item label="Shell-On Clams" value="shell-on" />
            <Picker.Item label="Clam Meat" value="meat" />
          </Picker>
        </GridLayout>

        <GridLayout rows="auto, auto" className="space-y-2">
          <Label text="Box Number" className="text-sm font-medium" />
          <TextField
            value={boxNumber}
            onTextChange={(e) => setBoxNumber(e.value)}
            className="input"
            hint="Enter box number (XX000000)"
          />
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

        {qrCode && (
          <Image src={qrCode} className="h-64 w-64 self-center" />
        )}

        <Button 
          text="Generate QR Code" 
          onTap={generateQR}
          className="btn"
          isEnabled={!!lotId && !!boxNumber && !!weight}
        />

        <Button 
          text="Submit" 
          onTap={handleSubmit}
          className="btn btn-primary"
          isEnabled={!!qrCode}
        />
      </GridLayout>
    </ScrollView>
  );
}