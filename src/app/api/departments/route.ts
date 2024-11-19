import { NextResponse } from 'next/server'
import { Department } from '@/types/api'

export async function GET() {
  try {
    const departments: Department[] = [
      'Engineering',
      'Sales',
      'Marketing',
      'HR'
    ]
    
    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}