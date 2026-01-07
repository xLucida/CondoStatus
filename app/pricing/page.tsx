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
        '10 property reviews per month',
        'Multi-PDF support (up to 20 docs, 75MB)',
        'Executive summary reports',
        'Red flag detection',
        'PDF export',
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
        '50 property reviews per month',
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
        'Unlimited property reviews',
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
      
      <main className="container-wide section-padding">
        <div className="text-center mb-16">
          <span className="badge-info mb-4">Pricing</span>
          <h1 className="font-serif text-headline text-navy-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your workflow. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-2xl p-8 transition-shadow ${
                plan.popular 
                  ? 'bg-navy-900 text-cream-100 ring-4 ring-brass-400 ring-offset-4 shadow-elevated' 
                  : 'card hover:shadow-medium'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-brass-400 text-navy-900 text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={`font-serif text-2xl font-semibold mb-2 ${plan.popular ? 'text-cream-100' : 'text-navy-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className={`font-serif text-4xl font-bold ${plan.popular ? 'text-cream-100' : 'text-navy-900'}`}>
                  {plan.price === 'Custom' ? '' : '$'}{plan.price}
                </span>
                <span className={plan.popular ? 'text-slate-400' : 'text-slate-500'}>
                  {plan.period}
                </span>
              </div>
              <p className={`mb-6 leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg 
                      className={`w-5 h-5 mt-0.5 ${plan.popular ? 'text-brass-400' : 'text-emerald-500'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.popular ? 'text-cream-100' : 'text-slate-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/analyze'}
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? 'bg-brass-400 text-navy-900 hover:bg-brass-500'
                    : 'btn-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="card p-8 md:p-12">
          <h2 className="font-serif text-title text-navy-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">What counts as one property review?</h3>
              <p className="text-slate-600 leading-relaxed">One property review covers a single condo unit/address and may include multiple PDFs (status certificate + supplementary documents). Limits: up to 600 pages or 75MB per review.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-slate-600 leading-relaxed">Yes, you can change your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">What if I run out of property reviews?</h3>
              <p className="text-slate-600 leading-relaxed">You can purchase additional reviews as needed, or upgrade to a higher tier for better value.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">Is there a free trial?</h3>
              <p className="text-slate-600 leading-relaxed">Yes! All plans include a 14-day free trial with full access to all features.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">How secure is my data?</h3>
              <p className="text-slate-600 leading-relaxed">We use enterprise-grade encryption. Documents are processed securely and never used for AI training.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">Do you offer refunds?</h3>
              <p className="text-slate-600 leading-relaxed">If you're not satisfied within the first 30 days, contact us for a full refund.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
