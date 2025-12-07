import React from 'react';

const brands = [
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma_logo.svg" },
    { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
    { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
    { name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg" },
    { name: "Prada", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg" },
    { name: "Dior", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" }
];

const TrustedBrands = () => {
    return (
        <div className="bg-white border-y border-gray-100 py-10 overflow-hidden">
            <div className="container mx-auto px-4 mb-8">
                <h3 className="text-xl font-bold text-center text-gray-800">Trusted by Top Brands</h3>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-20 px-4">
                    {/* First set of brands */}
                    {brands.map((brand, index) => (
                        <div key={index} className="w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {brands.map((brand, index) => (
                        <div key={`dup-${index}`} className="w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                    {/* Triplicate set for wide screens */}
                    {brands.map((brand, index) => (
                        <div key={`tri-${index}`} className="w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
};

export default TrustedBrands;
