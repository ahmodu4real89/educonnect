import { useEffect } from "react"
import { FieldValues, UseFormSubscribe } from "react-hook-form";

export const  useFormValueChange = <T extends FieldValues>(subscribe: UseFormSubscribe<T>, callback: () => void, runFlag: boolean) => {
  useEffect(() => {
    if(runFlag){
      subscribe({
        formState: {
          values: true
        },
        callback(){
          callback()
          if(runFlag){
            // console.log('callback')
          }
        }
      })

    }

    // return handle()
  }, [runFlag])
}


// type AsyncResult<T> = {
//   data: T | null
//   error: Error | null
// }

// type AsyncTransitionReturn<T, Args extends unknown[]> = {
//   execute: (asyncFn: (...args: Args) => Promise<T>, ...args: Args) => Promise<AsyncResult<T>>
//   isPending: boolean
//   data: T | null
//   error: Error | null
//   reset: () => void
// }

// // export function useAsyncTransition<T, Args extends unknown[] = unknown[]>(): AsyncTransitionReturn<T, Args> {
// //   const [isPending, startTransition] = useTransition()
// //   const [state, setState] = useState<AsyncResult<T>>({
// //     data: null,
// //     error: null,
// //   })

// //   const execute = useCallback((
// //     asyncFn: (...args: Args) => Promise<T>, 
// //     ...args: Args
// //   ): Promise<AsyncResult<T>> => {
// //     return new Promise((resolve) => {
// //       startTransition(() => {
// //         // Clear previous state at the start
// //         setState({ data: null, error: null })

// //         asyncFn(...args)
// //           .then((data: T) => {
// //             const result: AsyncResult<T> = { data, error: null }
// //             setState(result)
// //             console.log('sssss---', result)
// //             resolve(result)
// //           })
// //           .catch((err: unknown) => {
// //             console.log('eerr---')
// //             const error = err instanceof Error ? err : new Error(String(err))
// //             const result: AsyncResult<T> = { data: null, error }
// //             setState(result)
// //             resolve(result)
// //           })
// //       })
// //     })
// //   }, [startTransition])

// //   const reset = useCallback(() => {
// //     setState({ data: null, error: null })
// //   }, [])

// //   return {
// //     execute,
// //     isPending,
// //     data: state.data,
// //     error: state.error,
// //     reset,
// //   }
// // }