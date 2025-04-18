import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'DataVibes AI - Leading AI Tutor Platform'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 70,
          background: 'linear-gradient(to right, #EC4899, #8B5CF6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <img 
            src="https://img.mytsi.org/i/lP72916.png" 
            width="120" 
            height="120" 
            alt="DataVibes Logo" 
            style={{ marginRight: '20px' }}
          />
          <h1 style={{ margin: 0, fontSize: '80px', fontWeight: 'bold' }}>DataVibes</h1>
        </div>
        <p style={{ fontSize: '32px', marginTop: '10px', textAlign: 'center' }}>
          The Ultimate AI Tutor Platform for Data Science & ML
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
