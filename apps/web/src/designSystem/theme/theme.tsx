// theme.ts
import { theme } from 'antd'
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ['latin'],
})

export const LightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Colors
    colorPrimary: '#1890ff',
    colorPrimaryBg: '#e6f7ff',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorTextBase: '#000',
    colorLink: '#1890ff',
    colorBgBase: '#fff',
    colorBgContainer: '#fff',
    // Typography
    fontFamily: `${interFont.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    linkDecoration: 'underline',
    // Layout
    padding: 16,
    boxShadow:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    controlHeight: 32,
    lineType: 'solid',
    lineWidth: 1,
    motion: false,
  },
  components: {
    Form: {
      itemMarginBottom: '22px',
    },
    Layout: {
      headerBg: '#fff',
      footerBg: '#fff',
      bodyBg: '#fff',
      siderBg: '#f0f2f5',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemHeight: 30,
      itemColor: '#000',
      itemSelectedColor: '#1890ff',
      itemHoverBg: 'transparent',
      itemSelectedBg: 'transparent',
      itemBg: 'transparent',
      itemActiveBg: 'transparent',
    },
  },
}

export const DarkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Colors
    colorPrimary: '#1890ff',
    colorPrimaryBg: '#141414',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorTextBase: '#fff',
    colorLink: '#1890ff',
    colorBgBase: '#000',
    colorBgContainer: '#141414',
    // Typography
    fontFamily: `${interFont.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    linkDecoration: 'underline',
    // Layout
    padding: 16,
    boxShadow:
      '0 6px 16px 0 rgba(255, 255, 255, 0.08), 0 3px 6px -4px rgba(255, 255, 255, 0.12), 0 9px 28px 8px rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    controlHeight: 32,
    lineType: 'solid',
    lineWidth: 1,
    motion: false,
  },
  components: {
    Form: {
      itemMarginBottom: '22px',
    },
    Layout: {
      headerBg: '#141414',
      footerBg: '#141414',
      bodyBg: '#141414',
      siderBg: '#1b1b1b',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemHeight: 30,
      itemColor: '#fff',
      itemSelectedColor: '#1890ff',
      itemHoverBg: 'transparent',
      itemSelectedBg: 'transparent',
      itemBg: 'transparent',
      itemActiveBg: 'transparent',
    },
  },
}
