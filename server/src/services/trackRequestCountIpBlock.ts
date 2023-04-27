import { GraphQLError } from 'graphql'

import IpBlock from '../models/ipBlock'

const requestCountMap = new Map() // Map to store request counts per IP address
const timeWindowMs = parseInt(process.env.TIME_WINDOW || '5000')
const maxRequests = parseInt(process.env.MAX_REQUESTS || '10')
const blockingDuration = parseInt(process.env.BLOCKING_DURATION || '300000')

const trackRequestCountIpBlock = async (
  clientIP: string,
  userIsAuthenticated: boolean
) => {
  if (!userIsAuthenticated) {
    await _checkForExistingIpBlock(clientIP)
    _checkForFutureIpBlock(clientIP)
  }
}

export default trackRequestCountIpBlock

async function _checkForExistingIpBlock(clientIP: string) {
  try {
    const blockedIP = await IpBlock.findOne({ ip: clientIP })

    if (blockedIP && blockedIP.blockedUntil > Date.now()) {
      throw new GraphQLError('IP is blocked', {
        extensions: {
          code: 'IP_BLOCKED',
          http: { status: 403 },
        },
      })
    }
  } catch (error) {
    console.error('Error checking IP block:', error)
    throw new GraphQLError('Error checking IP block', {
      extensions: {
        code: 'IP_BLOCKED',
        http: { status: 403 },
      },
    })
  }
}

function _checkForFutureIpBlock(clientIP: string) {
  const currentTime = Date.now()
  const timeWindowStart = currentTime - timeWindowMs

  const requestCountInTimeWindow = Array.from(
    requestCountMap.entries()
  ).filter(
    ([timestamp, ip]) => timestamp >= timeWindowStart && ip === clientIP
  )

  if (requestCountInTimeWindow.length >= maxRequests) {
    const blockedUntil = new Date(currentTime + blockingDuration)
    IpBlock.findOneAndUpdate(
      { ip: clientIP },
      { blockedUntil },
      { upsert: true }
    )
      .then(() => {
        console.log(
          `IP ${clientIP} blocked for ${blockingDuration / 1000} seconds.`
        )
      })
      .catch((error: string) => {
        console.error('Error blocking IP:', error)
      })

    throw new GraphQLError('IP got blocked', {
      extensions: {
        code: 'IP_BLOCKED',
        http: { status: 403 },
      },
    })
  }

  const requestCountInTimeWindowToDelete = Array.from(
    requestCountMap.entries()
  ).filter(
    ([timestamp, ip]) => timestamp < timeWindowStart && ip === clientIP
  )
  requestCountInTimeWindowToDelete.forEach(([timestamp]) => {
    requestCountMap.delete(timestamp)
  })

  requestCountMap.set(currentTime, clientIP)
}

