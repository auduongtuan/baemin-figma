import {configureStore} from '@reduxjs/toolkit'
import localeReducer from './localeSlice';
import { listenerMiddleware } from './middleware';


export const store = configureStore({
  // preloadedState: {
  //   locale: {
  //     selectedText: null,
  //     matchedItem: null,
  //     localeItems: localeItemsState || []
  //   }
  // },
  reducer: {
    locale: localeReducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    listenerMiddleware.middleware
  ]
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch