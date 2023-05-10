<script lang="ts">
  import { PATHS } from '../lib/const'
  import { onMount } from 'svelte'
  import {
    addStamp,
    AsyncgetCurrentUser,
  } from '../codegen'
  import jwt_decode from 'jwt-decode'
  import { navigateToWithoutHistory } from '../lib/navigate'
  import { updatePersistCache } from '../lib/apollo/persistor'

  export let urlToken: string = ''

  const stampsLength = parseInt(process.env.STAMPS_LENGTH || '8')
  const { validUntil }: { validUntil: string } = jwt_decode(urlToken)
  const validUntilDate = new Date(validUntil)

  onMount(async () => {
      const {data:cacheData} = await AsyncgetCurrentUser({
        fetchPolicy: 'cache-only',
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
            __typename: 'Stamp',
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
        navigateToWithoutHistory(PATHS.CARD)
        console.log('stamp added')
      } else {
        console.error('Error')
      }
  })

  const _createNewCard = () => {
    return {
      __typename: 'Card',
      creationDate: new Date().getTime(),
      honouredAt: null,
      stamps: [
        {
          __typename: 'Stamp',
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
