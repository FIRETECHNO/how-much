/**
 * @returns array of suggestions
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { q } = getQuery(event);

  var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";

  console.log('HAS TOKEN:', !!config.dadataToken)
  console.log('TOKEN LENGTH:', config.dadataToken?.length)


  try {
    console.log(config.dadataToken);

    let res = await $fetch<{ suggestions: any }>(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${config.dadataToken}`
      },
      body: JSON.stringify({
        query: q
      })
    })

    console.log("dadata res: ", res);


    return res.suggestions
  } catch (error) {
    console.log("dadata error: ", error);
    return error;
  }
});