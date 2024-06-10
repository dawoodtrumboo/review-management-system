import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useDesignSystem } from '@web/designSystem'
import { Button, Tooltip } from 'antd'
import React from 'react'

export const TabTheme: React.FC = () => {
  const { isDarkMode, setIsDarkMode } = useDesignSystem()
  return (
    <Tooltip title="search">
      <Button
        shape="circle"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={() => setIsDarkMode(!isDarkMode)}
      />
    </Tooltip>
  )
}
