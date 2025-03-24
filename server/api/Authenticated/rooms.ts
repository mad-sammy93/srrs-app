import { defineEventHandler, H3Event, getRequestHeader } from 'h3'

const BACKEND_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export default defineEventHandler(async (event: H3Event) => {
  const authToken = getRequestHeader(event, 'Authorization')

  try {
    const response = await $fetch(`${BACKEND_URL}/api/rooms`, {
      method: 'GET',
      headers: {
        Authorization: authToken || '',
      },
    })
    return response
  } catch (error) {
    console.error('Error fetching rooms:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch rooms' })
  }
})
