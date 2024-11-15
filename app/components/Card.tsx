import React from 'react';
import { GridLayout, Label, Image } from '@nativescript/core';

interface CardProps {
  title: string;
  description: string;
  onTap: () => void;
  icon: string;
  row?: number;
}

export function Card({ title, description, onTap, icon, row }: CardProps) {
  return (
    <GridLayout
      rows="auto, auto"
      columns="auto, *"
      className="bg-surface p-4 rounded-lg elevation-2"
      onTap={onTap}
      row={row}
    >
      <Image
        src={`~/assets/icons/${icon}.png`}
        className="w-10 h-10"
        row={0}
        col={0}
        rowSpan={2}
      />
      <Label 
        text={title} 
        className="text-lg font-bold mb-1 ml-3" 
        row={0} 
        col={1}
      />
      <Label 
        text={description} 
        className="text-secondary ml-3" 
        row={1} 
        col={1}
      />
    </GridLayout>
  );
}