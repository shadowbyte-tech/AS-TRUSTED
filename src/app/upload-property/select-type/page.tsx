'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building, 
  MapPin, 
  Crown, 
  Star, 
  Users, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Building2,
  Gem
} from 'lucide-react';

export default function SelectPropertyTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'premium' | 'normal' | null>(null);

  const propertyTypes = [
    {
      id: 'premium',
      name: 'Premium Properties',
      description: 'Exclusive high-value properties with premium features and prime locations',
      icon: <Gem className="h-10 w-10" />,
      bgGradient: 'from-amber-400 via-orange-500 to-red-500',
      cardGradient: 'from-amber-50 via-orange-50 to-red-50',
      borderColor: 'border-amber-300',
      hoverBorder: 'hover:border-amber-500',
      shadowColor: 'shadow-amber-500/20',
      features: [
        { icon: <MapPin className="h-4 w-4" />, text: 'Prime Locations' },
        { icon: <TrendingUp className="h-4 w-4" />, text: 'High ROI Potential' },
        { icon: <Sparkles className="h-4 w-4" />, text: 'Premium Amenities' },
        { icon: <Shield className="h-4 w-4" />, text: 'Legal Verification' },
        { icon: <DollarSign className="h-4 w-4" />, text: 'Bank Loan Eligible' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'RERA Approved' }
      ],
      badgeText: 'Most Popular',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      stats: [
        { label: 'Avg. Value', value: '50L+' },
        { label: 'ROI', value: '18-25%' },
        { label: 'Timeline', value: '3-5 yrs' }
      ]
    },
    {
      id: 'normal',
      name: 'Standard Properties',
      description: 'Affordable properties with great value and essential amenities',
      icon: <Building2 className="h-10 w-10" />,
      bgGradient: 'from-blue-400 via-indigo-500 to-purple-500',
      cardGradient: 'from-blue-50 via-indigo-50 to-purple-50',
      borderColor: 'border-blue-300',
      hoverBorder: 'hover:border-blue-500',
      shadowColor: 'shadow-blue-500/20',
      features: [
        { icon: <DollarSign className="h-4 w-4" />, text: 'Affordable Pricing' },
        { icon: <MapPin className="h-4 w-4" />, text: 'Good Locations' },
        { icon: <Home className="h-4 w-4" />, text: 'Standard Amenities' },
        { icon: <Shield className="h-4 w-4" />, text: 'Basic Verification' },
        { icon: <Zap className="h-4 w-4" />, text: 'Quick Processing' },
        { icon: <CheckCircle className="h-4 w-4" />, text: 'Flexible Payment' }
      ],
      badgeText: 'Best Value',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
      stats: [
        { label: 'Avg. Value', value: '10-50L' },
        { label: 'ROI', value: '12-18%' },
        { label: 'Timeline', value: '2-4 yrs' }
      ]
    }
  ];

  const handleSelect = (type: 'premium' | 'normal') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/upload-property/details?type=${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gray-800"></div>
      </div>
      
      {/* Animated Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full mb-6">
            <Building className="h-8 w-8 text-amber-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
            Upload Your Property
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect property type that best describes your listing and reach the right buyers
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">500+ Properties Listed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span className="text-sm">98% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-600"></div>
              <span className="text-sm">24hr Approval</span>
            </div>
          </div>
        </div>

        {/* Property Type Selection */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {propertyTypes.map((type, index) => (
            <div
              key={type.id}
              className={`relative group cursor-pointer transition-all duration-500 ${index === 0 ? 'lg:translate-x-0' : 'lg:translate-x-0'}`}
              onClick={() => handleSelect(type.id as 'premium' | 'normal')}
            >
              {/* Selection Indicator */}
              {selectedType === type.id && (
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl opacity-20 animate-pulse"></div>
              )}
              
              <Card className={`relative h-full border-2 ${selectedType === type.id ? `${type.borderColor} ${type.shadowColor} shadow-2xl` : 'border-gray-700 hover:border-gray-600'} transition-all duration-300 ${selectedType === type.id ? 'scale-105' : 'hover:scale-102'} bg-gradient-to-br ${type.cardGradient} backdrop-blur-sm`}>
                {/* Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <Badge className={`${type.badgeColor} px-3 py-1 text-xs font-bold shadow-lg`}>
                    {type.badgeText}
                  </Badge>
                </div>

                {/* Selection Check */}
                {selectedType === type.id && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className={`w-8 h-8 bg-gradient-to-r ${type.bgGradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 bg-gradient-to-r ${type.bgGradient} rounded-2xl shadow-lg ${selectedType === type.id ? 'animate-pulse' : ''}`}>
                      <div className="text-white">
                        {type.icon}
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <div className="text-sm font-medium text-gray-600">
                        Selected
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {type.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {type.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                        <div className={`text-lg font-bold bg-gradient-to-r ${type.bgGradient} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 p-2 bg-white/30 rounded-lg backdrop-blur-sm">
                          <div className={`p-1 bg-gradient-to-r ${type.bgGradient} rounded text-white`}>
                            {feature.icon}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            size="lg"
            className={`px-12 py-4 text-lg font-bold transition-all duration-300 ${
              selectedType === 'premium'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40'
                : selectedType === 'normal'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedType ? (
              <>
                Continue to Property Details
                <ArrowRight className="ml-3 h-5 w-5" />
              </>
            ) : (
              <>
                Select a Property Type
                <ArrowRight className="ml-3 h-5 w-5" />
              </>
            )}
          </Button>
          
          {selectedType && (
            <p className="mt-4 text-gray-400 text-sm">
              You'll be redirected to fill in the details for your {selectedType} property
            </p>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mb-4">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Not Sure Which Type to Choose?</h3>
                <p className="text-gray-400">
                  Here's a quick guide to help you make the right decision
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-6 w-6 text-amber-400" />
                    <h4 className="font-bold text-amber-400 text-lg">Choose Premium if:</h4>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Property value greater than 50 Lakhs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Located in prime, high-demand areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Has premium amenities and facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Target high-end buyers and investors</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-6 w-6 text-blue-400" />
                    <h4 className="font-bold text-blue-400 text-lg">Choose Standard if:</h4>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Property value between 10-50 Lakhs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Standard but essential amenities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Target budget-conscious buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Quick listing and processing needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
