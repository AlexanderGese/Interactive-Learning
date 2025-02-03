import { GoogleGenerativeAI } from '@google/generative-ai';
import { AdventureStyle } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function validateApiKey(): string | null {
  if (!API_KEY || API_KEY === 'your-api-key-here') {
    return 'Please set your Gemini API key in the .env file';
  }
  return null;
}

const genAI = new GoogleGenerativeAI(API_KEY);

const stylePrompts: Record<AdventureStyle, string> = {
  fantasy: 'Create an immersive fantasy world where magical elements serve as metaphors for learning concepts. Use rich descriptions of mystical environments, magical creatures, and enchanted items to illustrate educational points.',
  scifi: 'Set the learning experience aboard an advanced starship or space station, using futuristic technology and scientific phenomena to explain concepts. Include detailed descriptions of advanced technology and space environments.',
  modern: 'Frame the learning experience in a vivid contemporary setting, using detailed descriptions of urban environments, modern technology, and real-world scenarios to illustrate concepts.',
  apocalyptic: 'Create a compelling post-apocalyptic world where knowledge is crucial for survival. Use detailed descriptions of the changed environment and survival challenges to frame learning concepts.',
  cyberpunk: 'Set the scene in a neon-lit, high-tech dystopia where information and technology reign supreme. Use detailed descriptions of digital landscapes and advanced cyber-systems to explain concepts.',
  steampunk: 'Create an alternate Victorian world filled with brass, steam, and mechanical marvels. Use detailed descriptions of ingenious contraptions and mechanical processes to illustrate learning concepts.',
  historical: 'Transport learners to richly detailed historical settings, connecting concepts to significant events and discoveries. Include vivid descriptions of historical environments and authentic period details.'
};

export async function generateGameResponse(
  context: string,
  history: string[],
  style: AdventureStyle,
  answer?: string
) {
  const validationError = validateApiKey();
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert educational AI creating an immersive learning experience with the following content:

${context}

Style Context: ${stylePrompts[style]}

Key Instructions:
1. Create HIGHLY DETAILED and VIVID scenes that bring the learning material to life
2. Use rich sensory descriptions and environmental details to enhance immersion
3. Create complex, thought-provoking questions that encourage deep understanding
4. Provide diverse example approaches that showcase different thinking strategies
5. Evaluate answers thoroughly and award medals based on:
   - Bronze: Basic understanding with some key concepts identified
   - Silver: Good comprehension with clear application and connections
   - Gold: Exceptional understanding with creative application, unique insights, or complex connections

Previous answers:
${history.join('\n')}

${answer ? `Student's answer: ${answer}

Provide a detailed evaluation:
1. Thorough analysis of their understanding
2. Specific examples from their answer that demonstrate comprehension
3. Detailed explanation of any misconceptions
4. Clear connections to previous concepts
5. Award a medal if deserved, with specific reasoning
6. Lead into the next concept with a compelling scenario` : 'Create an engaging first learning scenario'}

Response Format (JSON):
{
  "scene": "Your detailed response, including:
    - Rich environmental descriptions
    - Clear educational content
    - Thought-provoking questions
    - Include example approaches between <!-- examples --> and <!-- end examples --> tags",
  "examples": [
    "Detailed example approach 1 showing one way of thinking",
    "Detailed example approach 2 showing an alternative perspective",
    "Detailed example approach 3 demonstrating creative problem-solving"
  ],
  "medal": answer ? {
    "type": "bronze|silver|gold",
    "message": "Detailed explanation of why they earned this medal",
    "timestamp": Date.now()
  } : null
}

Guidelines:
- Create immersive, detailed scenes that enhance learning
- Ask complex questions that require deep understanding
- Provide diverse and detailed example approaches
- Give thorough, constructive feedback
- Use the style elements to create memorable learning experiences
- Ensure your response is valid JSON`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    try {
      return JSON.parse(response.text());
    } catch (jsonError) {
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse response. Please try again.');
    }
  } catch (error: any) {
    if (error.message?.includes('API key not valid')) {
      throw new Error('Invalid Gemini API key. Please check your .env file and ensure you have set a valid API key.');
    }
    throw error;
  }
}