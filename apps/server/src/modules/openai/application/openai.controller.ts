import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { OpenAiService } from './openai.service'

@Controller('/v1/openai')
export class OpenAiController {
  constructor(private readonly openaiService: OpenAiService) {}

  @Post('/generateReviewReply')
  async generateReviewReply(
    @Body() body: { message: string },
    @Res() res,
  ): Promise<any> {
    try {
      const { message } = body
      const response = await this.openaiService.generateCompletion(message)
      return response.status(HttpStatus.OK).json({ message: response })
    } catch (error) {
      console.error('Error generation text:', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error generating text',
      })
    }
  }
}
