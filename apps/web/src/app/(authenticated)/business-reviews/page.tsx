'use client'

import {
  CheckCircleOutlined,
  CheckOutlined,
  CopyFilled,
  EditOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Api, Model } from '@web/domain'
import { AuthenticationHook } from '@web/domain/authentication'
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
  Tag,
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
  const [reviews, setReviews] = useState<{
    name: string
    rating: number
    user_ratings_total: number
    reviews: Model.Review[]
  }>(null)

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
  const [places, setPlaces] = useState<Model.Place[]>([])
  const [placeId, setPlaceId] = useState(null)
  const timeoutRef = useRef(null)

  // This function saves the place_id of the place
  const onSelect = value => {
    setPlaceId(value)
  }

  // Fetch Places on Component Render

  useEffect(() => {
    if (userId) {
      setLoading(true)

      Api.Place.findByUserId(userId)
        .then(places => setPlaces(places))
        .catch(() =>
          enqueueSnackbar('Failed to fetch places', { variant: 'error' }),
        )
        .finally(() => setLoading(false))
    }
  }, [])

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

  const fetchReviews = async () => {
    setLoading(true)
    Api.Review.findManyByPlaceId(placeId, {
      includes: ['name', `rating`, `reviews`, , 'user_ratings_total'],
      filters: {
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
      },
    })
      .then(reviewDetails =>
        // setReviews({
        //   ...reviewDetails,
        //   reviews: reviewDetails.reviews.map(review => ({
        //     ...review,
        //     reviewText: review.text,
        //     reviewDate: new Date(review.time * 1000).toISOString(),
        //     status: 'active',
        //     place_id: placeId,
        //   })),
        // }),
        setReviews(reviewDetails),
      )
      .catch(error =>
        enqueueSnackbar('Failed to fetch reviews', { variant: 'error' }),
      )
      .finally(() => setLoading(false))
  }

  const generateAiReply = async (authorName: string, reviewText: string) => {
    try {
      const prompt = `Generate a reply for the following review: "${reviewText}"`
      const reply = await Api.Ai.chat(prompt, userId)
      setAiReplies(prev => ({ ...prev, [authorName]: reply }))
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

  const saveReview = async (review: Model.Review) => {
    let returnReview
    Api.Review.createOne(review)
      .then(review => {
        setReviews(prevReviews => {
          const updatedReviews = { ...prevReviews }
          updatedReviews.reviews = updatedReviews.reviews.map(item =>
            review.author_name === review.author_name
              ? { ...item, id: review.id }
              : item,
          )
          return updatedReviews
        })
      })
      .catch(error =>
        enqueueSnackbar('Error while saving reviews', { variant: 'error' }),
      )
      .finally(() => (returnReview = review))
    return returnReview
  }

  const createReply = async (review: Model.Review, reply: Model.Reply) => {
    Api.Reply.createOneByReviewId(review.id, reply).then(reply => {
      setAiReplies(prev => ({ ...prev, [review.author_name]: reply.replyText }))
    })
  }

  const saveReply = async (review: Model.Review, replyText: string) => {
    setLoading(true)
    if (!review.id) {
      Api.Review.createOne(review)
        .then(createdReview => {
          setReviews(prevReviews => {
            const updatedReviews = { ...prevReviews }
            updatedReviews.reviews = updatedReviews.reviews.map(item =>
              item.author_name === createdReview.author_name
                ? { ...item, id: createdReview.id }
                : item,
            )
            return updatedReviews
          })

          if (!replyText) return

          Api.Reply.createOneByReviewId(createdReview.id, {
            replyText,
            publishedDate: new Date().toISOString(),
            isAiGenerated: true,
          })
            .then(reply => {
              setAiReplies(prev => ({
                ...prev,
                [createdReview.author_name]: reply.replyText,
              }))
            })
            .catch(error =>
              enqueueSnackbar('Failed to create Reply', { variant: 'error' }),
            )
        })
        .catch(error =>
          enqueueSnackbar('Failed to created Review', { variant: 'error' }),
        )
        .finally(() => setLoading(false))
    } else {
      Api.Reply.createOneByReviewId(review.id, {
        replyText,
        publishedDate: new Date().toISOString(),
        isAiGenerated: true,
      })
        .then(reply => {
          setAiReplies(prev => ({
            ...prev,
            [review.author_name]: reply.replyText,
          }))
        })
        .catch(error =>
          enqueueSnackbar('Failed to create Reply', { variant: 'error' }),
        )
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

  // Format the date with correct options

  return (
    <PageLayout layout="narrow">
      <Title>Reviews</Title>
      <Paragraph>
        Select a location to manage reviews for specific locations.
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Select
            placeholder="Select Business Account"
            style={{ width: '100%' }}
            onChange={setPlaceId}
          >
            {places?.map(place => (
              <Option key={place.id} value={place.place_id}>
                {place.name}
              </Option>
            ))}
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
            onClick={fetchReviews}
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
          {reviews && (
            <Flex vertical>
              <Title className="m-0">{reviews?.name}</Title>
              <Space>
                <Title style={{ margin: '0' }}>{reviews.rating}</Title>
                <Rate
                  style={{ margin: '0' }}
                  className="m-0 mb-0"
                  defaultValue={reviews.rating}
                  allowHalf
                  disabled
                  count={5}
                />
                <Paragraph style={{ marginBottom: '0' }}>
                  {reviews.user_ratings_total} reviews
                </Paragraph>
              </Space>
            </Flex>
          )}

          <List
            itemLayout="vertical"
            dataSource={reviews?.reviews}
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
                          <Space direction="vertical" style={{ gap: '0' }}>
                            <Space>
                              <Title
                                level={4}
                                style={{
                                  margin: '0',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {review.author_name}
                              </Title>
                              {review.status && (
                                <Tag
                                  icon={<CheckCircleOutlined />}
                                  color="success"
                                >
                                  Reply Generated
                                </Tag>
                              )}
                            </Space>

                            <Space style={{ gap: '10px' }}>
                              <Rate
                                style={{ margin: '0', fontSize: '14px' }}
                                className="m-0 mb-0"
                                defaultValue={review.rating}
                                allowHalf
                                disabled
                                count={5}
                              />
                              <Paragraph
                                style={{ margin: '0', fontSize: '12px' }}
                              >
                                {dayjs(review.reviewDate).format('DD/MM/YYYY')}
                              </Paragraph>
                            </Space>
                          </Space>

                          <Paragraph
                            ellipsis={
                              ellipsis
                                ? { rows: 3, expandable: true, symbol: 'more' }
                                : false
                            }
                            style={{ margin: '0' }}
                          >
                            {review.reviewText}
                          </Paragraph>
                          <Col
                            span={24}
                            style={{ position: 'relative', padding: '0' }}
                          >
                            {aiReplies[review.author_name] && (
                              <Input.TextArea
                                value={aiReplies[review.author_name] || ''}
                                onChange={e =>
                                  setAiReplies(prev => ({
                                    ...prev,
                                    [review.author_name]: e.target.value,
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
                            )}

                            {aiReplies[review.author_name] && (
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
                                generateAiReply(review.author_name, review.text)
                              }
                              disabled={
                                editingReply[review.id] ||
                                review.status?.includes('Generated')
                              }
                            >
                              Generate AI Reply
                            </Button>
                            <Tooltip title="Coming Soon">
                              <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                // onClick={() => publishReply(review.id)}
                                onClick={() =>
                                  saveReply(
                                    {
                                      ...review,
                                      place_id: placeId,
                                      status: 'active',
                                    },
                                    aiReplies[review.author_name],
                                  )
                                }
                                disabled={
                                  !aiReplies[review.author_name] ||
                                  review.status
                                }
                              >
                                Save Reply
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
