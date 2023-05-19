<script lang="ts">
  import {
    FETCH_POLICY,
    KIND,
    PATHS,
    PROCESS_ENV,
    PRODUCTION,
    TYPENAME,
  } from '../lib/const'
  import { onMount } from 'svelte'
  import { addStamp, AsyncgetCurrentUser } from '../codegen'
  import jwt_decode from 'jwt-decode'
  import { navigateToWithoutHistory } from '../services/navigate'
  import { updatePersistCache } from '../services/apollo/persistor'
  import loader from '../stores/loader'
  import alerts from '../stores/alerts'

  export let urlToken: string = ''

  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION
  const stampsLength = parseInt(PROCESS_ENV.STAMPS_LENGTH || '8')
  const { exp }: { exp: number } = jwt_decode(urlToken)
  const validUntilDate = new Date(exp * 1000)

  onMount(async () => {
    loader.setLoader(AsyncgetCurrentUser.name, true)
    try {
      const { data: cacheData } = await AsyncgetCurrentUser({
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
        alerts.addAlert(KIND.POSITIVE, 'Stempel wurde erfolgreich eingelesen')
        navigateToWithoutHistory(`/${PATHS.CARD}`)
      } else {
        alerts.addAlert(
          KIND.WARNING,
          'Etwas ist schief gelaufen. Bitte versuche es erneut'
        )
      }
    } catch (e) {
      alerts.addAlert(
        KIND.WARNING,
        'Etwas ist schief gelaufen. Bitte versuche es erneut'
      )
      !production && console.error(e)
    }
    loader.setLoader(AsyncgetCurrentUser.name, false)
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
