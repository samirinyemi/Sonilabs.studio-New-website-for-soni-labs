import { createContext, useContext } from 'react'

// Signals whether the first-load Loader overlay has begun its exit
// (which is when the home page underneath should start animating).
// Defaults to `true` so any component that uses this hook outside the
// <LoaderProvider> tree just runs its animations immediately.
export const LoaderContext = createContext({ loaderDone: true })

export const useLoaderDone = () => useContext(LoaderContext).loaderDone
