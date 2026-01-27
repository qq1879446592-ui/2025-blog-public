import '@/styles/globals.css'

import type { Metadata } from 'next'
import Layout from '@/layout'
import Head from '@/layout/head'
import siteContent from '@/config/site-content.json'
import MusicPlayer from '@/(home)/Music-Player';

const {
	meta: { title, description },
	theme
} = siteContent

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	},
	twitter: {
		title,
		description
	}
}

const htmlStyle = {
	cursor: 'url(/images/cursor.svg) 2 1, auto',
	'--color-brand': theme.colorBrand,
	'--color-primary': theme.colorPrimary,
	'--color-secondary': theme.colorSecondary,
	'--color-brand-secondary': theme.colorBrandSecondary,
	'--color-bg': theme.colorBg,
	'--color-border': theme.colorBorder,
	'--color-card': theme.colorCard,
	'--color-article': theme.colorArticle
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning style={htmlStyle}>
      <Head />
      <body>
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <MusicPlayer width={320} height={65} />
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.navigator.userAgent.includes('Windows')) {
                document.documentElement.classList.add('windows');
              }
            `,
          }}
        />

        <Layout>{children}</Layout>
      </body>
    </html>
