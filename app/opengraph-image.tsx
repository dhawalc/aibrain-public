import { ImageResponse } from 'next/og'

export const alt = 'QorSync AI - Autonomous Enterprise Operations'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #020617 0%, #172554 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #093E8F, #1C74BC)',
              color: 'white',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            Q
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              QorSync AI
            </span>
            <span
              style={{
                fontSize: '16px',
                color: '#94a3b8',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
              }}
            >
              An Accel4 Product
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#26AAE3',
            fontWeight: 600,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Autonomous Enterprise Operations Platform
        </div>

        <div
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            marginTop: '20px',
            lineHeight: 1.5,
          }}
        >
          AI agents handle 95% of operational work with human approvals at critical checkpoints
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '0',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '16px',
              color: '#64748b',
            }}
          >
            <span>qorsync.online</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
