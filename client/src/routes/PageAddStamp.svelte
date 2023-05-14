<script lang="ts">
  import { FETCH_POLICY, PATHS, PROCESS_ENV, TYPENAME } from '../lib/const'
  import { onMount } from 'svelte'
  import {
    addStamp,
    AsyncgetCurrentUser,
  } from '../codegen'
  import jwt_decode from 'jwt-decode'
  import { navigateToWithoutHistory } from '../services/navigate'
  import { updatePersistCache } from '../services/apollo/persistor'

  export let urlToken: string = ''

  const stampsLength = parseInt(PROCESS_ENV.STAMPS_LENGTH || '8')
  const { exp }: { exp: number } = jwt_decode(urlToken)
  const validUntilDate = new Date(exp * 1000)
  
  onMount(async () => {
      const {data:cacheData} = await AsyncgetCurrentUser({
        fetchPolicy: FETCH_POLICY.CACHE_ONLY,
      })
      const value = cacheData.getCurrentUser

      let cards = JSON.parse(JSON.stringify(value.cards)) || []
      if (cards.length === 0) {
        cards = [_createNewCard()]
      } else if (cards[0].stamps.length >= stampsLength) {
        cards = [_createNewCard(), ...cards]
      } else {
        cards[0].stamps = [
          {
            __typename: TYPENAME.STAMP,
            validUntilDate,
            creationDate: new Date().getTime(),
          },
          ...cards[0].stamps,
        ]
      }

      const { data } = await addStamp({
        variables: {
          urlToken,
        },
        optimisticResponse: {
          addStamp: {
            ...value,
            cards: [...cards],
          },
        },
      })

      if (data && data.addStamp) {
        await updatePersistCache()
        navigateToWithoutHistory(`/${PATHS.CARD}`)
        console.log('stamp added')
      } else {
        console.error('Error')
      }
  })

  const _createNewCard = () => {
    return {
      __typename: TYPENAME.CARD,
      creationDate: new Date().getTime(),
      honouredAt: null,
      stamps: [
        {
          __typename: TYPENAME.STAMP,
          validUntilDate,
          creationDate: new Date().getTime(),
        },
      ],
    }
  }
</script>

<h1>Stamp Page</h1>
<p>
  This page is never shown to the user and is just used to set the session
  cookie for the stamp
</p>
