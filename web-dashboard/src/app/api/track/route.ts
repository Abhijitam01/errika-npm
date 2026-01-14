import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template, event } = body

    // In production, save to database
    // For now, just log it
    console.log('Track event:', { template, event, timestamp: new Date() })

    // Example database query (requires setup)
    // await sql`
    //   INSERT INTO template_stats (template_id, event_type, created_at)
    //   VALUES (${template}, ${event}, NOW())
    // `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

