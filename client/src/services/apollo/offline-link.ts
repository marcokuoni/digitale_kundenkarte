import { ApolloLink, Observable } from '@apollo/client'
import gql from 'graphql-tag'
import { EVENTS, PROCESS_ENV, PRODUCTION } from '../../lib/const'

const syncStatusQuery = gql`
  query syncStatus {
    mutations
    inflight
  }
`
const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

export default class OfflineLink extends ApolloLink {
  request(operation, forward) {
    const context = operation.getContext()

    if (!context.optimisticResponse) {
      // If the mutation does not have an optimistic response then we don't defer it
      return forward(operation)
    }

    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          observer.next(result)
        },

        error: async (e) => {
          const errorEvent = new CustomEvent(EVENTS.APOLLO_ERROR)
          window.dispatchEvent(errorEvent)
          !production && console.error(e)
          // Resolve the mutation with the optimistic response so the UI can be updated
          observer.next({
            data: context.optimisticResponse,
            dataPresent: true,
            errors: [],
          })

          // Say we're all done so the UI is re-rendered.
          observer.complete()
        },

        complete: () => observer.complete(),
      })

      return () => {
        subscription.unsubscribe()
      }
    })
  }
}

export { syncStatusQuery }
