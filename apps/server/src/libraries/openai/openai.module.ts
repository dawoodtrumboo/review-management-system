import { Module } from '@nestjs/common'
import { AiPromptDomainModule } from '@server/modules/aiPrompt/domain'
import { Openai } from './internal/openai'
import { OpenaiService } from './openai.service'

@Module({
  imports: [AiPromptDomainModule],
  providers: [OpenaiService, Openai],
  exports: [OpenaiService],
})
export class OpenaiModule {}
