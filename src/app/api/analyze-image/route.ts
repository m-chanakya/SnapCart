import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward the file to the agent server
    const agentFormData = new FormData();
    agentFormData.append('file', file);

    const response = await fetch('http://127.0.0.1:9000/analyze-image', {
      method: 'POST',
      body: agentFormData,
    });

    if (!response.ok) {
      throw new Error(`Agent server responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in image analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
