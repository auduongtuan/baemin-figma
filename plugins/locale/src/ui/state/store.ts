import {configureStore} from '@reduxjs/toolkit'
import localeReducer from './localeSlice';
import { listenerMiddleware } from './middleware';
import localeAppReducer from './localeAppSlice';


export const store = configureStore({
  // preloadedState: {
  //   locale: {
  //     localeSelection: null,
  //     matchedItem: null,
  //     localeItems: localeItemsState || []
  //   }
  // },
  reducer: {
    locale: localeReducer,
    localeApp: localeAppReducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    listenerMiddleware.middleware
  ]
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch