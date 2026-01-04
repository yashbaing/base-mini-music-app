function withValidProperties(properties: Record<string, undefined | string | string[] | object>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return !!value;
    })
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://your-domain.com';
  
  // Account association fields - Generated from Base Build
  // Can be overridden via environment variables if needed
  const accountAssociationHeader = process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER || 'eyJmaWQiOjE0MDAwNTQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhFQjM2MWVjY0M5RmYxNWY5N0Q1Njg1NzM2ODQyNDY4QWRDZDE3ZDM3In0';
  const accountAssociationPayload = process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD || 'eyJkb21haW4iOiJiYXNlLW1pbmktbXVzaWMtYXBwLnZlcmNlbC5hcHAifQ';
  const accountAssociationSignature = process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE || 'yhuV8w//TF1X06KeLjr3OEf7UC1KmMoVzu/c7Rc0zyspKCUg8ZczUMb8H+Tf9DD47X8eseNwCc/IxhIspzoP2Bw=';
  
  // URL encode image filename to handle spaces
  const imageUrl = `${URL}/images/${encodeURIComponent('Ninad Bedekar Sir.png')}`;
  
  const miniappConfig: Record<string, any> = {
    version: '1',
    name: 'Maratha Music',
    homeUrl: URL,
    iconUrl: imageUrl,
    splashImageUrl: imageUrl,
    splashBackgroundColor: '#0a0a0a',
    subtitle: 'Shivaji Maharaj Music',
    description: 'Music player honoring the legacy of Chhatrapati Shivaji Maharaj with Base blockchain integration. Stream music, earn points, and connect with Web3.',
    screenshotUrls: [],
    primaryCategory: 'music',
    tags: ['music', 'miniapp', 'baseapp', 'web3', 'blockchain'],
    heroImageUrl: imageUrl,
    tagline: 'Stream and earn',
    ogTitle: 'Maratha Music',
    ogDescription: 'Music player honoring the legacy of Chhatrapati Shivaji Maharaj with Base blockchain integration',
    ogImageUrl: imageUrl,
    noindex: false,
  };
  
  // Only include webhookUrl if it's a valid HTTPS URL
  const webhookUrl = process.env.FARCASTER_WEBHOOK_URL || '';
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    miniappConfig.webhookUrl = webhookUrl;
  }
  
  const manifestJsonObject = withValidProperties({
    accountAssociation: {
      header: accountAssociationHeader,
      payload: accountAssociationPayload,
      signature: accountAssociationSignature,
    },
    miniapp: miniappConfig,
  });

  return Response.json(manifestJsonObject);
}

