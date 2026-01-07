import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '49',
      period: '/month',
      description: 'Perfect for individual agents or small teams just getting started.',
      features: [
        '10 certificate analyses per month',
        'Executive summary reports',
        'Red flag detection',
        'PDF export',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '149',
      period: '/month',
      description: 'For busy real estate professionals handling multiple deals.',
      features: [
        '50 certificate analyses per month',
        'Everything in Starter',
        'Lawyer-grade detailed reports',
        'Questions-to-ask checklist',
        'Shareable client links',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For law firms and brokerages with high volume needs.',
      features: [
        'Unlimited analyses',
        'Everything in Professional',
        'Custom branding',
        'Team management',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your workflow. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-4' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price === 'Custom' ? '' : '$'}{plan.price}
                </span>
                <span className={plan.popular ? 'text-blue-200' : 'text-gray-500'}>
                  {plan.period}
                </span>
              </div>
              <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg 
                      className={`w-5 h-5 mt-0.5 ${plan.popular ? 'text-blue-200' : 'text-emerald-500'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.popular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/analyze'}
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What counts as one analysis?</h3>
              <p className="text-gray-600">Each status certificate PDF you upload and analyze counts as one analysis, regardless of the document length.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if I run out of analyses?</h3>
              <p className="text-gray-600">You can purchase additional analyses as needed, or upgrade to a higher tier for better value.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! All plans include a 14-day free trial with full access to all features.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How secure is my data?</h3>
              <p className="text-gray-600">We use enterprise-grade encryption. Documents are processed securely and never used for AI training.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">If you're not satisfied within the first 30 days, contact us for a full refund.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
