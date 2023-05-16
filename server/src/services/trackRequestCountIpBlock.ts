import IpBlock from '../models/ipBlock'
import { throwForbidden } from '../lib/exceptions'

const requestCountMap = new Map() // Map to store request counts per IP address
const timeWindowMs = parseInt(process.env.TIME_WINDOW_MS || '300000')
const maxRequests = parseInt(process.env.MAX_REQUESTS || '6000')
const blockingDurationMs = parseInt(process.env.BLOCKING_DURATION_MS || '300000')

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

    if (blockedIP && blockedIP.blockedUntil > new Date()) {
      throwForbidden('IP got blocked')
    }
  } catch (error) {
    console.error('Error checking IP block:', error)
    throwForbidden('Error checking IP block')
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

  console.log('%ctrackRequestCountIpBlock.ts line:44 requestCountINTimeW', 'color: #007acc;', requestCountInTimeWindow.length, maxRequests);

  if (requestCountInTimeWindow.length >= maxRequests) {
    const blockedUntil = new Date(currentTime + blockingDurationMs)
    IpBlock.findOneAndUpdate(
      { ip: clientIP },
      { blockedUntil },
      { upsert: true }
    )
      .then(() => {
        console.log(
          `IP ${clientIP} blocked for ${blockingDurationMs / 1000} seconds.`
        )
      })
      .catch((error: string) => {
        console.error('Error blocking IP:', error)
      })

      throwForbidden('IP got blocked')
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

