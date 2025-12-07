import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On all orders over $100'
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      description: 'Pay when you receive'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure payment'
    }
  ];

  return (
    <section className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors group cursor-default">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <feature.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;