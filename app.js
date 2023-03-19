const fileInput = document.getElementById("file-input");
const image = document.getElementById("image");
const description = document.getElementById("prediction");
let interpet_key = [
  "glioma_tumor",
  "meningioma_tumor",
  "no_tumor",
  "pituitary_tumor",
];
let model = await tf.loadLayersModel("http://127.0.0.1:8080/model.json");
console.log("Model loaded");

// /**
//  * Display the result in the page
//  */
// function displayDescription(predictions) {
//   // Sort by probability
//   const result = predictions.sort((a, b) => a > b)[0];

//   if (result.probability > 0.2) {
//     const probability = Math.round(result.probability * 100);

//     // Display result
//     description.innerText = `${probability}% shure this is a ${result.className.replace(
//       ",",
//       " or"
//     )} 🐶`;
//   } else description.innerText = "I am not shure what I should recognize 😢";
// }

/**
 * Classify with the image with the mobilenet model
 */
async function classifyImage(image_tf) {
  console.log("Started predicting");
  let predictions = model.predict(image_tf);
  // Interpret the predictions of tensorflowjs
  console.log(predictions.dataSync());
  console.log(predictions);
  // Index of largest value in predictions.dataSync()
  let max_index = predictions.argMax(1).dataSync()[0];
  // Use the index to get the key from the interpet_key array
  let prediction = interpet_key[max_index];
  console.log("Finished predicting");
  return prediction;
}

function displayDescription(text) {
  document.getElementById("prediction").innerHTML = text;
}

/**
 * Get the image from file input and display on page
 */
function getImage() {
  // Check if an image has been found in the input
  document.getElementById("prediction").innerHTML = "Loading...";
  if (!fileInput.files[0]) throw new Error("Image not found");
  const file = fileInput.files[0];

  // Get the data url form the image
  const reader = new FileReader();

  // When reader is ready display image
  reader.onload = function (event) {
    // Ge the data url
    const dataUrl = event.target.result;
    console.log("Hi");

    // Create image object
    const imageElement = new Image();
    imageElement.src = dataUrl;

    // When image object is loaded
    imageElement.onload = async function () {
      // Set <img /> attributes
      image.setAttribute("src", this.src);
      image.setAttribute("height", this.height);
      image.setAttribute("width", this.width);
      let image_tf = tf.browser.fromPixels(this);
      const smallImg = tf.image.resizeBilinear(image_tf, [180, 180]);
      const resized = tf.cast(smallImg, "float32");
      const t4d = tf.tensor4d(resized.dataSync(), [1, 180, 180, 3]);
      let prediction = await classifyImage(t4d);
      displayDescription(prediction);
      getGPTResults(prediction);
    };
    // Add the image-loaded class to the body
    document.body.classList.add("image-loaded");
  };

  // Get data URL
  reader.readAsDataURL(file);
}

document.getElementById("submitButton").addEventListener("click", () => {
  console.log("Button clicked");
  getImage();
});

function getGPTResults(prediction) {
  // curl https://api.openai.com/v1/chat/completions \
  // -H "Content-Type: application/json" \
  // -H "Authorization: Bearer $OPENAI_API_KEY" \
  // -d '{
  //    "model": "gpt-3.5-turbo",
  //    "messages": [{"role": "user", "content": "Say this is a test!"}],
  //    "temperature": 0.7
  //  }'

  // Convert curl above to fetch
  fetch("https://api.openai.com/v1/chat/completions/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer " + "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",
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      messages: [{ role: "user", content: "Give me info on " + prediction }],
      temperature: 0,
      max_tokens: 700,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    });
}
