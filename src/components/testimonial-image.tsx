import React from 'react';

const TestimonialImage = ({ name, alt }: { name: string; alt: string }) => {
  return (
    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
        <span className="text-gray-600 text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
      </div>
      <img 
        src={`https://picsum.photos/seed/${name.toLowerCase()}/40/40`} 
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${name}&background=random`;
        }}
      />
    </div>
  );
};

export default TestimonialImage;
