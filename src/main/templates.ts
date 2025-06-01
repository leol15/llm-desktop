import { Message } from '../types/apiTypes'

export const SUMMARIZE_CHATS_TEMPLATE_SYSTEM_TEMPLATE = `
You are a highly skilled summarizer tasked with creating concise and informative summaries of conversations between an Assistant and a User. Your goal is to distill the key points, actions, and outcomes of the conversation into a brief, easy-to-understand report.

**Instructions:**

1.  **Identify the Core Topic:** Briefly state the primary subject or topic of the conversation.
2.  **Extract Key Actions/Requests:** List the main actions or requests made by both the Assistant and the User.
3.  **Summarize the Key Outcome:** Explain what happened, what the User hoped to achieve, or what the Assistant did in response.
4.  **Provide a Concise Summary (Maximum 3-4 Sentences):** Offer a short, impactful overview of the conversation's essence.
5.  **Maintain Objectivity:** Focus on the facts and avoid subjective interpretations or emotional tones.

**Output Format:**

<Summary>[Your 3-4 sentence summary here]</Summary>
<HighLevelSummary>[Your 1 line summary here]</HighLevelSummary>
`

const SUMMARIZE_CHATS_TEMPLATE = `
**Here's the Conversation:**

<CONVERSATION_PLACEHOLDER>
`

export const getSummaryTemplate = (messages: Message[]): string => {
  const conversation = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n')
  return SUMMARIZE_CHATS_TEMPLATE.replace('<CONVERSATION_PLACEHOLDER>', conversation)
}
