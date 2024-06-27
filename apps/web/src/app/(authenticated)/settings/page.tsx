'use client'

import { SaveOutlined } from '@ant-design/icons'
import { Api } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
const { Title, Text } = Typography
const { TextArea } = Input

export default function SettingsPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [promptText, setPromptText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (userId) {
      Api.User.findOne(userId, { includes: ['aiPrompts'] })
        .then(user => {
          if (user.aiPrompts && user.aiPrompts.length > 0) {
            setPromptText(user.aiPrompts[0].promptText)
          }
        })
        .catch(error => {
          enqueueSnackbar('Failed to fetch user data', { variant: 'error' })
        })
    }
  }, [userId])

  const handleSave = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const values = { promptText }
      if (promptText) {
        await Api.AiPrompt.createOneByUserId(userId, values)
        enqueueSnackbar('Prompt saved successfully', { variant: 'success' })
      } else {
        enqueueSnackbar('Prompt cannot be empty', { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar('Failed to save prompt', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center" style={{ minHeight: '100vh', gap: '0' }}>
        <Space
          align="center"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width={100}
            height={100}
            style={{ marginInline: 'auto' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </Space>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>AI Reply Tone Settings</Title>
          <Text>Set the tone for AI replies by providing a prompt below:</Text>
          <Form
            layout="vertical"
            onFinish={handleSave}
            style={{ marginTop: 20 }}
          >
            <Form.Item label="AI Prompt">
              <TextArea
                rows={4}
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                placeholder="Enter your prompt here..."
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                disabled={!promptText || loading}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </PageLayout>
  )
}
