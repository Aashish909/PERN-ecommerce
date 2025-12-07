import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "We offer express shipping which typically takes 1-3 business days. Standard shipping usually takes 5-7 business days depending on your location."
        },
        {
            question: "What is your return policy?",
            answer: "We have a 30-day return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard SSL encryption to protect your personal and payment information. We do not store your credit card details."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {faqs.map((faq, index) => (
                        <div key={index} className="py-4">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between text-left focus:outline-none group"
                            >
                                <span className={`font-medium text-lg transition-colors ${openIndex === index ? 'text-primary' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-primary flex-shrink-0" size={18} />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0 group-hover:text-gray-600" size={18} />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-gray-500 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
