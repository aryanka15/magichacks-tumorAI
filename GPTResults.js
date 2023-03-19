const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getResponse() {
  console.log(openai);
  console.log("Requested");
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give me info on brain tumors`,
    temperature: 0,
    max_tokens: 700,
  });
  console.log("Repsonse: " + response.data.choices[0].text);
  console.log("Returned");
  return response.data.choices[0].text;
}

async function onSearch() {
  let response = await getResponse();
  let newResponse = response;
  if (response.trim().charAt(0) !== "1") {
    let index = response.indexOf("\n");
    newResponse = "\n" + response.substring(index + 1);
  }
  document.getElementById("open-ai-output").innerHTML = newResponse;
}
