import { Application } from '@nativescript/core';
import { AppContainer } from './AppContainer';

Application.run({ create: () => new AppContainer() });