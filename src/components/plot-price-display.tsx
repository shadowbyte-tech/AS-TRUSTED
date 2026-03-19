interface PlotPriceDisplayProps {
  price?: number;
  pricePerSqft?: number;
  priceNegotiable?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function PlotPriceDisplay({
  price,
  pricePerSqft,
  priceNegotiable,
  size = 'medium',
  className
}: PlotPriceDisplayProps) {
  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const subTextSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  if (!price) {
    return (
      <div className="text-muted-foreground">
        <p className={textSizes[size]}>Price on Request</p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className || ''}`}>
      <div className="flex items-baseline gap-2">
        <p className={`font-bold ${textSizes[size]}`}>
          {formatPrice(price)}
        </p>
        {priceNegotiable && (
          <span className={`text-muted-foreground ${subTextSizes[size]}`}>
            (Negotiable)
          </span>
        )}
      </div>
      {pricePerSqft && (
        <p className={`text-muted-foreground ${subTextSizes[size]}`}>
          ₹{pricePerSqft.toLocaleString('en-IN')}/sqft
        </p>
      )}
    </div>
  );
}
