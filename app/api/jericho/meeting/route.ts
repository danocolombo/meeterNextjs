export async function POST(request: Request) {
    const body = await request.json();

    // Process the received data (e.g., save to database)
    console.log('Received data:', body);

    return NextResponse.json({
        status: 200,
        message: 'Meeting saved successfully',
        data: { id: 'tbd' },
    });
}
