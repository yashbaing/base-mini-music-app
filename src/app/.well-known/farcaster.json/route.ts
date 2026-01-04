function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  const manifestJsonObject = withValidProperties({
    accountAssociation: {
      header: 'farcaster-verify',
    },
    websiteUrl: URL,
  });

  return Response.json(manifestJsonObject);
}

