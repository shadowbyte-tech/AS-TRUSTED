import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyType, villageName, areaName, price, features } = body;

    // Validate required fields
    if (!propertyType || !villageName || !areaName || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyType, villageName, areaName, price' },
        { status: 400 }
      );
    }

    // Generate AI-powered property description
    const description = await generatePropertyDescription({
      propertyType,
      villageName,
      areaName,
      price,
      features
    });

    return NextResponse.json({
      success: true,
      description
    });

  } catch (error) {
    console.error('AI Description generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI description',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function generatePropertyDescription(params: {
  propertyType: string;
  villageName: string;
  areaName: string;
  price: number;
  features?: string[];
}): Promise<string> {
  const { propertyType, villageName, areaName, price, features } = params;

  // Create a comprehensive, professional property description
  const priceInLakhs = Math.round(price / 100000);
  const propertyTypeLower = propertyType.toLowerCase();

  // Base description templates for different property types
  const baseDescriptions = {
    plot: `Presenting an exceptional ${propertyType} opportunity in the prime location of ${villageName}, ${areaName}. This well-positioned property offers tremendous potential for both investment and development purposes.`,
    house: `Discover this stunning ${propertyType} located in the sought-after area of ${villageName}, ${areaName}. This thoughtfully designed residence combines modern comfort with strategic location advantages.`,
    land: `Explore this valuable ${propertyType} parcel in the developing area of ${villageName}, ${areaName}. This property represents an excellent opportunity for both residential and commercial development.`
  };

  // Features section
  const featuresText = features && features.length > 0 
    ? `Key highlights include: ${features.join(', ')}.` 
    : '';

  // Investment potential
  const investmentText = `Priced at ${priceInLakhs} Lakhs, this property offers excellent value and strong appreciation potential in the rapidly developing ${villageName} region.`;

  // Location advantages
  const locationAdvantages = `The property benefits from excellent connectivity to major business hubs, educational institutions, and healthcare facilities. ${areaName} is emerging as one of the most promising locations for real estate investment.`;

  // Call to action
  const callToAction = `This ${propertyType} represents a rare opportunity to own property in one of ${villageName}'s most desirable locations. Don't miss this chance to invest in your future.`;

  // Combine all sections
  const fullDescription = [
    baseDescriptions[propertyTypeLower as keyof typeof baseDescriptions] || baseDescriptions.plot,
    featuresText,
    investmentText,
    locationAdvantages,
    callToAction
  ].filter(Boolean).join(' ');

  return fullDescription;
}
