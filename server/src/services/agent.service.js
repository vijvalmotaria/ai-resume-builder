import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { createAgentTools } from '../config/agent.tools.js';
import * as aiService from './ai.service.js';

// Initialize the LLM
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `You are ResumeBot, an expert AI career counselor and resume writing assistant.

Your role is to:
1. Interview the user about their experience, skills, and career goals
2. Help them build a strong, ATS-optimized resume
3. Use your tools to autonomously update resume sections as you gather information
4. Generate STAR-method bullet points for their experience
5. Provide actionable career advice

GUIDELINES:
- Be conversational and encouraging
- Ask one focused question at a time
- When the user shares experience, use the generate_star_bullets tool to create bullet points
- When you have enough info for a section, use update_resume_section to save it
- Proactively check the current resume state with get_current_resume
- If sections are empty, guide the user to fill them
- Always confirm changes with the user after updating`;

export const chatWithAgent = async (resumeId, userId, message, chatHistory = []) => {
  // Create tools with context for this specific request
  const context = { resumeId, userId };
  const tools = createAgentTools(context, aiService);

  // Create the agent
  const agent = createReactAgent({
    llm: model,
    tools,
    prompt: SYSTEM_PROMPT,
  });

  // Build messages from chat history
  const messages = chatHistory.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'human',
    content: msg.content,
  }));
  messages.push({ role: 'human', content: message });

  // Run the agent
  const result = await agent.invoke({ messages });

  // Extract the final AI response
  const aiMessages = result.messages || [];
  const lastMessage = aiMessages[aiMessages.length - 1];
  const response = lastMessage?.content || 'I apologize, I had trouble processing that. Could you try again?';

  return typeof response === 'string' ? response : JSON.stringify(response);
};
