import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlashSale = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 24, minutes: 0, seconds: 0 }; // Reset for demo
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-2 min-w-[60px]">
            <span className="text-2xl font-bold font-mono">{String(value).padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">{label}</span>
        </div>
    );

    return (
        <section className="py-12 bg-gradient-to-r from-violet-600 to-indigo-600 text-white my-8 rounded-3xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-yellow-300">
                            <Zap className="fill-current" size={20} />
                            <span className="font-bold tracking-widest uppercase text-sm">Flash Sale</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 italic">DEAL OF THE DAY</h2>
                        <p className="text-indigo-100 text-lg max-w-md mb-6">
                            Grab premium products at unbeatable prices. Limited stock available for this exclusive offer!
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <TimeBox value={timeLeft.hours} label="Hrs" />
                            <TimeBox value={timeLeft.minutes} label="Mins" />
                            <TimeBox value={timeLeft.seconds} label="Secs" />
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-2xl">
                        {/* Product Showcase - In real app, fetch products */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-white text-gray-900 rounded-xl p-3 shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                                    <div className="relative h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-${item === 1 ? '1542291026-7eec264c27ff' : item === 2 ? '1505740420926-473bd430dc25' : '1523275335684-37898b6baf30'}?q=80&w=300&auto=format&fit=crop`}
                                            alt="Product"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-40%</span>
                                    </div>
                                    <h4 className="font-bold text-sm truncate">Premium NIke Shoe</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-lg text-indigo-600">$129</span>
                                        <span className="text-gray-400 text-xs line-through">$249</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/products?sort=sale" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                            View All Deals <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashSale;
