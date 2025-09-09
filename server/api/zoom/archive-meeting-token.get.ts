export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const q = getQuery(event);
  const { meetingId } = q;


  let res = $fetch<{ token: string, expire_in: number }>(`https://api.zoom.us/v2/meetings/${meetingId}/jointoken/local_archiving`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${config.zoomToken}`,
      'Content-Type': 'application/json',
    },
  })

  return res
});