export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  let { userId } = await getQuery(event)

  let res = $fetch<{ meetings: { id: number }[], created_at: string }>(`https://api.zoom.us/v2/users/${userId}/meetings`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${config.zoomToken}`,
      'Content-Type': 'application/json',
    },
    query: {
      type: "previous_meetings",
      // type: query.type || 'scheduled', // по умолчанию 'scheduled'
      page_size: 20,
    },
  })

  return res
})