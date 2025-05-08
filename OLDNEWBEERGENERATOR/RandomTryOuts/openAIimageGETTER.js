const openai = require('openai');

// Set your OpenAI API key.
openai.apiKey = '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';

// Set the text description you want to use to generate an image.
const description = 'a red apple on a table';

// Call the DALL-E API to generate an image based on the description.
openai.dallE.generateImage(description)
    .then((response) => {
        // The API returns a JSON object containing the generated image data.
        // You can use this data to display the image on your website or save it to a file.
    })
    .catch((error) => {
        // Handle any errors that occur during the API call.
    });