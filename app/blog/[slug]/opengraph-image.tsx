import { ImageResponse } from 'next/og'
import { getArticleBySlug, resolveCanonicalArticleSlug } from '@/lib/blog'

export const alt = 'QorSync AI Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const canonicalSlug = await resolveCanonicalArticleSlug(slug)
  const post = canonicalSlug ? await getArticleBySlug(canonicalSlug) : null
  const title = post?.title ?? 'QorSync AI Blog'
  const category = post?.category ?? 'Blog'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '60px',
          background: 'linear-gradient(135deg, #020617 0%, #172554 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #093E8F, #1C74BC)',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              Q
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>QorSync AI</span>
            <span
              style={{
                fontSize: '14px',
                color: '#26AAE3',
                background: 'rgba(38, 170, 227, 0.1)',
                border: '1px solid rgba(38, 170, 227, 0.3)',
                borderRadius: '9999px',
                padding: '4px 14px',
                marginLeft: '8px',
              }}
            >
              {category}
            </span>
          </div>

          <div
            style={{
              fontSize: title.length > 80 ? '36px' : '44px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '18px', color: '#e2e8f0' }}>Dhawal Chheda</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>AI Leader at Accel4</span>
          </div>
          <span style={{ fontSize: '16px', color: '#64748b' }}>qorsync.online</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
