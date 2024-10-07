import { createGlobalTheme } from '@vanilla-extract/css';

import * as designTokens from './tokens';

export const tokens = createGlobalTheme(':root', designTokens);
