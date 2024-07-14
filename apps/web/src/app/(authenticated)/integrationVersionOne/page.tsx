'use client'

import { ShopOutlined } from '@ant-design/icons'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import { Button, Col, Row, Spin, Typography } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Places } from '../placeSearch/places'

const { Title, Text } = Typography

export default function IntegrationPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [businessAccounts, setBusinessAccounts] = useState<
    Model.BusinessAccount[]
  >([])

  useEffect(() => {
    if (userId) {
      setLoading(true)
      Api.BusinessAccount.findManyByUserId(userId, { includes: ['user'] })
        .then(accounts => setBusinessAccounts(accounts))
        .catch(error =>
          enqueueSnackbar('Failed to fetch business accounts', {
            variant: 'error',
          }),
        )
        .finally(() => setLoading(false))
    }
  }, [userId])

  const handlePlaceIntegration = async () => {
    setLoading(true)
    const indexOfComma = selected.name.indexOf(',')
    const name = selected.name.substring(0, indexOfComma).trim()
    const address = selected.name.substring(indexOfComma + 1).trim()
    console.log(address, selected)
    // Placeholder for OAuth integration logic
    // This should be replaced with actual OAuth flow implementation
    const body = {
      place_id: selected.placeId,
      name,
      address,
      userId,
    }
    Api.Place.createPlace(body)
      .then(data => {
        enqueueSnackbar('Place Integrated Successfully', { variant: 'success' })
        setSelected(null)
      })
      .catch(() =>
        enqueueSnackbar('Place Integration was unsuccessful', {
          variant: 'error',
        }),
      )
      .finally(() => setLoading(false))
  }

  const handleFormSubmit = async (values: {
    googleAccountId: string
    accessToken: string
    refreshToken: string
  }) => {
    if (!userId) return

    setLoading(true)
    try {
      await Api.BusinessAccount.createOneByUserId(userId, values)
      enqueueSnackbar('Business account integrated successfully', {
        variant: 'success',
      })
      router.push('/reviews')
    } catch (error) {
      enqueueSnackbar('Failed to integrate business account', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const [selected, setSelected] = useState(null)
  useEffect(() => {
    console.log(selected)
  }, [selected])

  return (
    <PageLayout layout="narrow">
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: '100vh', gap: '30px' }}
      >
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>Integrate Your Google Business Account</Title>
          <Text>
            Grant access to locations to fetch reviews and generate replies.
          </Text>
        </Col>
        <Places onSelect={setSelected} />
        <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
          <Button
            type="primary"
            icon={<ShopOutlined />}
            onClick={handlePlaceIntegration}
            disabled={!selected || loading}
          >
            Integrate Place
          </Button>
        </Col>

        {loading && (
          <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
            <Spin />
          </Col>
        )}
      </Row>
    </PageLayout>
  )
}
