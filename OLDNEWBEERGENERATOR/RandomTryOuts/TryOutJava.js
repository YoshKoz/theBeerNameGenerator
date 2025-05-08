const axios = require('axios');

async function generateImage(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            model: 'image-alpha-001',
            prompt: prompt,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DALLE_API_KEY}`,
            },
        });

        const imageUrl = response.data.data.url;
        console.log(`Generated image: ${imageUrl}`);
    } catch (error) {
        console.error(error);
    }
}

const prompt = `The ${tasteProfiles[getRandomNumber(tasteProfiles.length)]} 'N ${tasteProfiles[getRandomNumber(tasteProfiles.length)]}  ${mythicalCreatures[getRandomNumber(mythicalCreatures.length)]}

a ${coolAdjectives[getRandomNumber(coolAdjectives.length)]}  ${colors[getRandomNumber(colors.length)]}-colored ${tasteProfiles[getRandomNumber(tasteProfiles.length)]} ${types[getRandomNumber(types.length)]} ${categories[getRandomNumber(categories.length)]} served "${coolAdjectives[getRandomNumber(coolAdjectives.length)]}" in a ${beerGlasses[getRandomNumber(beerGlasses.length)]}-styled glass`;

generateImage(prompt);