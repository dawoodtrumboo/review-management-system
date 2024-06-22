'use client'

import {
  CheckOutlined,
  CopyFilled,
  EditOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Api, Model } from '@web/domain'
import { AuthenticationHook } from '@web/domain/authentication'
import { Review } from '@web/domain/places'
import { PageLayout } from '@web/layouts/Page.layout'
import { useAuthentication } from '@web/modules/authentication'
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Flex,
  Input,
  List,
  Rate,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
const { Title, Text, Paragraph } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

export default function TestPage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()

  const [businessAccounts, setBusinessAccounts] = useState<
    Model.BusinessAccount[]
  >([])
  const [locations, setLocations] = useState<Model.Location[]>([])
  const [selectedBusinessAccount, setSelectedBusinessAccount] = useState<
    string | undefined
  >(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const [reviews, setReviews] = useState<Review[]>([])
  const [placeDetails, setPlaceDetails] = useState<{
    name: string
    rating: number
    user_ratings_total: number
  }>(null)

  // const [reviews, setReviews] = useState<Model.Review[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  )
  const [aiReplies, setAiReplies] = useState<{ [key: string]: string }>({})
  const [editingReply, setEditingReply] = useState<{ [key: string]: boolean }>(
    {},
  )

  const token = AuthenticationHook.useToken().getToken()

  const ratingOptions = [
    {
      value: 1,
      label: '1 Star',
    },
    {
      value: 2,
      label: '2 Star',
    },
    {
      value: 3,
      label: '3 Star',
    },
    {
      value: 4,
      label: '4 Star',
    },
    {
      value: 5,
      label: '5 Star',
    },
  ]

  const [searchTerm, setSearchTerm] = useState(null)
  const [places, setPlaces] = useState([])
  const [placeId, setPlaceId] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  // Logic to search places in the search
  const handleChange = value => {
    setSearchTerm(value)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      if (!value) return

      setLoading(true)
      Api.Place.findPlaces(value)
        .then(data => {
          setPlaces(data.results)
        })
        .catch(() =>
          enqueueSnackbar('Failed to fetch places', { variant: 'error' }),
        )
        .finally(() => setLoading(false))
      // const response = await axios.get(
      //   `http://localhost:3099/api/v1/places?query=${value}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   },
      // )
      // console.log(response.data.result)
      // setPlaces(response.data.results)
    }, 500)
  }

  // This function saves the place_id of the place
  const onSelect = value => {
    setPlaceId(value)
  }

  useEffect(() => {
    if (userId) {
      Api.BusinessAccount.findManyByUserId(userId, { includes: ['locations'] })
        .then(setBusinessAccounts)
        .catch(() =>
          enqueueSnackbar('Failed to fetch business accounts', {
            variant: 'error',
          }),
        )
    }
  }, [userId])

  useEffect(() => {
    if (selectedBusinessAccount) {
      const account = businessAccounts.find(
        account => account.id === selectedBusinessAccount,
      )
      if (account?.locations) {
        setLocations(account.locations)
      }
    }
  }, [selectedBusinessAccount, businessAccounts])

  const fetchPlaceReviews = async () => {
    setLoading(true)

    const body = {
      place_id: placeId,
      fields: 'name,rating,reviews,user_ratings_total',
      rating: selectedRating,
      startDate: dateRange[0].toISOString(),
      endDate: dateRange[1].toISOString(),
    }
    Api.Place.reviewsByPlace(body)
      .then(data => {
        setReviews(data.reviews)
        setPlaceDetails({
          name: data.name,
          rating: data.rating,
          user_ratings_total: data.user_ratings_total,
        })
      })
      .catch(() =>
        enqueueSnackbar('Failed to fetch reviews', { variant: 'error' }),
      )
      .finally(() => setLoading(false))

    // try {
    //   const reviews = await axios.get(
    //     'http://localhost:3099/api/v1/placeReviews',
    //     { params, headers: { Authorization: `Bearer ${token}` } },
    //   )
    //   if (reviews.data) {
    //     setReviews(reviews.data.reviews)
    //   }
    // } catch (error) {
    //   console.error(error)
    // } finally {
    //   setLoading(false)
    // }
  }

  const generateAiReply = async (reviewId: string, reviewText: string) => {
    try {
      const prompt = `Generate a reply for the following review: "${reviewText}"`
      const reply = await Api.Ai.chat(prompt)
      setAiReplies(prev => ({ ...prev, [reviewId]: reply }))
      enqueueSnackbar('AI reply generated', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to generate AI reply', { variant: 'error' })
    }
  }

  const publishReply = async (reviewId: string) => {
    const replyText = aiReplies[reviewId]
    if (!replyText) return

    try {
      await Api.Reply.createOneByReviewId(reviewId, {
        replyText,
        publishedDate: new Date().toISOString(),
        isAiGenerated: true,
      })
      enqueueSnackbar('Reply published', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to publish reply', { variant: 'error' })
    }
  }

  useEffect(() => {
    console.log(dateRange)
  }, [dateRange])

  const handleDateChange = value => {
    setDateRange(value as [dayjs.Dayjs, dayjs.Dayjs])
  }

  const handleCopyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text)
      enqueueSnackbar('Copied to clipboard', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'success' })
    }
  }

  const [selectedRating, setSelectedRating] = useState(null)
  return (
    <PageLayout layout="narrow">
      <Title>Reviews</Title>
      <Paragraph>
        Select a location to manage reviews for specific locations.
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Select
            style={{ width: '100%' }}
            showSearch
            value={searchTerm}
            placeholder="Search a place"
            filterOption={false} // Disable default filtering
            onSelect={onSelect}
            onSearch={handleChange}
            options={places?.map(place => ({
              value: place.place_id,
              label: place.name,
            }))}
          >
            <Input.Search style={{ width: '100%' }} />
          </Select>
        </Col>
        {/* <Col span={24}>
          <Select
            placeholder="Select Rating"
            style={{ width: '100%' }}
            onChange={value => setSelectedRating(value)}
            disabled={!places}
          >
            {ratingOptions?.map(rating => (
              <Option key={rating.value} value={rating.value}>
                {rating.label}
              </Option>
            ))}
          </Select>
        </Col> */}
        <Col span={24}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={dates => handleDateChange(dates)}
          />
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={fetchPlaceReviews}
            disabled={!placeId || !dateRange || loading}
          >
            Fetch Reviews
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Spin style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Flex vertical className="my-5" gap="1rem">
          {placeDetails && (
            <Flex vertical>
              <Title className="m-0">{placeDetails?.name}</Title>
              <Space>
                <Title style={{ margin: '0' }}>{placeDetails.rating}</Title>
                <Rate
                  style={{ margin: '0' }}
                  className="m-0 mb-0"
                  defaultValue={4.5}
                  allowHalf
                  disabled
                  count={5}
                />
                <Paragraph style={{ marginBottom: '0' }}>
                  {placeDetails.user_ratings_total} reviews
                </Paragraph>
              </Space>
            </Flex>
          )}

          <List
            itemLayout="vertical"
            dataSource={reviews}
            renderItem={(review, i) => {
              const [ellipsis, setellipsis] = useState(true)
              return (
                <List.Item key={i} style={{ paddingBlock: '3rem' }}>
                  {/* <List.Item.Meta
                title={dayjs(review.reviewDate).format('MMMM D, YYYY')}
                description={review.text}
              /> */}
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Space size={10} align="start">
                        <Avatar size="large" icon={<UserOutlined />} />
                        <Flex vertical gap="10px">
                          <Title
                            level={4}
                            style={{ margin: '0', textTransform: 'capitalize' }}
                          >
                            {review.author_name}
                          </Title>
                          <Paragraph
                            ellipsis={
                              ellipsis
                                ? { rows: 3, expandable: true, symbol: 'more' }
                                : false
                            }
                            style={{ margin: '0' }}
                          >
                            {review.text}
                          </Paragraph>
                          <Col
                            span={24}
                            style={{ position: 'relative', padding: '0' }}
                          >
                            <Input.TextArea
                              value={aiReplies[review.id] || ''}
                              onChange={e =>
                                setAiReplies(prev => ({
                                  ...prev,
                                  [review.id]: e.target.value,
                                }))
                              }
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderLeft: '3px solid #393939',
                                borderRadius: '0',
                                resize: 'none',
                              }}
                              disabled={!editingReply[review.id]}
                              rows={4}
                            />
                            {aiReplies[review.id] && (
                              <Tooltip title="copy">
                                <CopyFilled
                                  style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '20px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() =>
                                    handleCopyToClipboard(review.text)
                                  }
                                />
                              </Tooltip>
                            )}
                          </Col>
                          <Col
                            span={24}
                            style={{ display: 'flex', gap: '2rem' }}
                          >
                            <Button
                              icon={<EditOutlined />}
                              onClick={() =>
                                setEditingReply(prev => ({
                                  ...prev,
                                  [review.id]: !prev[review.id],
                                }))
                              }
                            >
                              {editingReply[review.id] ? 'Save' : 'Edit'}
                            </Button>
                            <Button
                              type="primary"
                              icon={<SendOutlined />}
                              onClick={() =>
                                generateAiReply(review.id, review.text)
                              }
                              disabled={editingReply[review.id]}
                            >
                              Generate AI Reply
                            </Button>
                            <Tooltip title="Coming Soon">
                              <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => publishReply(review.id)}
                                // disabled={!aiReplies[review.id]}
                                disabled={true}
                              >
                                Publish Reply
                              </Button>
                            </Tooltip>
                          </Col>
                        </Flex>
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )
            }}
          />
        </Flex>
      )}
    </PageLayout>
  )
}
