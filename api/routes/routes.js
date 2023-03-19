const express = require("express");
require("dotenv").config();
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const openAIKey = process.env.REACT_APP_OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function onSearch(string) {
  let response = await getResponse(string);
  let newResponse = response;
  if (response.trim().charAt(0) !== "1") {
    let index = response.indexOf("\n");
    newResponse = "\n" + response.substring(index + 1);
  }
  return newResponse;
}

async function getResponse(string) {
  console.log("Requested");
  if (string.value === "") {
    return;
  }
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give me info on ${string.toString()}`,
    temperature: 0,
    max_tokens: 700,
  });
  console.log(response);
  console.log("Repsonse: " + response.data.choices[0].text);
  console.log("Returned");
  return response.data.choices[0].text;
}

router.get("/:id/", async (req, res) => {
  let string = await onSearch(req.params.id);
  res.send(string);
});

module.exports = router;
