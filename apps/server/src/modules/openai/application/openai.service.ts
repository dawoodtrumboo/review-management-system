import { OpenAI } from 'openai'

export class OpenAiService {
  private openai

  constructor() {
    this.openai = new OpenAI({
      apiKey: 'sk-proj-EdyJ4G6Z18gifYq9r3V4T3BlbkFJgv4g3E7FgbLyANecBtPE',
    })
  }

  async generateCompletion(prompt: string): Promise<any> {
    const body = {
      model: 'gpt-3.5-turbo-16k',
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content:
            'You are a marketting manager replying to reviews written by customers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }
    try {
      const completion = await this.openai.chat.completion.create(body)

      if (completion.data) {
        return completion.data.choices[0].message.content
      } else {
        throw new Error('Error creating text completion')
      }
    } catch (error) {
      console.error('Error in generating text', error)
    }
  }
}
