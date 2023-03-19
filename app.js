const fileInput = document.getElementById("file-input");
const image = document.getElementById("image");
const description = document.getElementById("prediction");

let model = await tf.loadLayersModel('model_js/model.json');;

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
function classifyImage() {
  model.classify(image).then((predictions) => {
    displayDescription(predictions);
  });
}

/**
 * Get the image from file input and display on page
 */
function getImage() {
  // Check if an image has been found in the input
  if (!fileInput.files[0]) throw new Error("Image not found");
  const file = fileInput.files[0];

  // Get the data url form the image
  const reader = new FileReader();

  // When reader is ready display image
  reader.onload = function (event) {
    // Ge the data url
    const dataUrl = event.target.result;
    console.log("Hi")

    // Create image object
    const imageElement = new Image();
    imageElement.src = dataUrl;

    // When image object is loaded
    imageElement.onload = function () {
      // Set <img /> attributes
      image.setAttribute("src", this.src);
      image.setAttribute("height", this.height);
      image.setAttribute("width", this.width);

      // Classify image
      classifyImage();
    };

    // Add the image-loaded class to the body
    document.body.classList.add("image-loaded");
  };

  // Get data URL
  reader.readAsDataURL(file);
}
