import { Injectable } from '@nestjs/common'
import { AiPromptDomainFacade } from '@server/modules/aiPrompt/domain'
import { ReadStream } from 'fs'
import { Openai } from './internal/openai'

@Injectable()
export class OpenaiService {
  constructor(
    private openai: Openai,
    private aiPromptDomainFacade: AiPromptDomainFacade,
  ) {}

  async chat(prompt: string, userId: string): Promise<string> {
    const mostRecentPrompt =
      await this.aiPromptDomainFacade.findMostRecentPromptByUser(userId)
    const userPrompt = prompt
    const systemPrompt = mostRecentPrompt ? mostRecentPrompt.promptText : ''
    const message = { userPrompt, systemPrompt }
    return this.openai.chat(message)
  }

  async generateImage(prompt: string): Promise<string> {
    return this.openai.generateImage(prompt)
  }

  async fromAudioToText(readStream: ReadStream): Promise<string> {
    return this.openai.fromAudioToText(readStream)
  }

  async fromTextToAudio(text: string): Promise<Buffer> {
    return this.openai.fromTextToAudio(text)
  }

  isActive(): boolean {
    return this.openai.isActive()
  }
}
