import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const plans = [
    {
      name: 'Pay-as-you-go',
      price: '49',
      unit: 'per Property Review',
      description: 'Best for occasional files.',
      included: null,
      overage: null,
      cta: 'Buy 1 Review',
      popular: false,
    },
    {
      name: 'Small Practice',
      price: '149',
      unit: '/ month',
      description: 'For solo practitioners and small teams.',
      included: '10 Property Reviews / month',
      overage: '$20 / Property Review',
      cta: 'Start Small Practice',
      popular: false,
    },
    {
      name: 'Firm',
      price: '299',
      unit: '/ month',
      description: 'For busy practices handling multiple deals.',
      included: '35 Property Reviews / month',
      overage: '$12 / Property Review',
      cta: 'Start Firm',
      popular: true,
    },
  ];

  const sharedFeatures = [
    'Executive summary and severity overview',
    'Red flags with page citations',
    'Key numbers extracted',
    'Missing / not disclosed detection',
    'Questions-to-ask checklist',
    'Exportable report (PDF/print)',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container-wide section-padding">
        <div className="text-center mb-12">
          <span className="badge-info mb-4">Pricing</span>
          <h1 className="font-serif text-headline text-navy-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Same product on every plan. Pay only for volume.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="card p-6 md:p-8 bg-cream-50 border-brass-400/30">
            <h2 className="font-serif text-xl text-navy-900 mb-3">
              What counts as a Property Review?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              One Property Review covers one condo unit/address. Upload the status certificate and related PDFs and get one consolidated report.
            </p>
            <p className="text-slate-600 text-sm mb-4">
              <strong>Limits:</strong> up to 600 total pages or 75 MB across all documents. Larger packages may require splitting (each part counts as a separate Property Review).
            </p>
            <p className="text-slate-500 text-sm italic">
              Overages: we'll prompt you to approve before any extra charges.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                  Most popular
                </span>
              )}
              <h3 className={`font-serif text-2xl font-semibold mb-2 ${plan.popular ? 'text-cream-100' : 'text-navy-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-2">
                <span className={`font-serif text-4xl font-bold ${plan.popular ? 'text-cream-100' : 'text-navy-900'}`}>
                  ${plan.price}
                </span>
                <span className={plan.popular ? 'text-slate-400 ml-1' : 'text-slate-500 ml-1'}>
                  {plan.unit}
                </span>
              </div>
              
              {plan.included && (
                <p className={`text-sm mb-1 ${plan.popular ? 'text-brass-400' : 'text-emerald-600'}`}>
                  {plan.included}
                </p>
              )}
              {plan.overage && (
                <p className={`text-sm mb-4 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  Overage: {plan.overage}
                </p>
              )}
              {!plan.included && <div className="mb-4" />}
              
              <p className={`mb-6 leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.description}
              </p>
              
              {/* TODO: Implement actual payment/subscription flow. Currently links to /analyze */}
              <Link
                href="/analyze"
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

        <div className="max-w-3xl mx-auto mb-16">
          <div className="card p-6 md:p-8">
            <h2 className="font-serif text-xl text-navy-900 mb-6 text-center">
              Included in every plan
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sharedFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <svg 
                    className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-8 md:p-12 mb-16">
          <h2 className="font-serif text-title text-navy-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">What counts as a Property Review?</h3>
              <p className="text-slate-600 leading-relaxed">One Property Review covers one condo unit/address and can include multiple PDFs. It produces one consolidated report.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">How many documents can I upload for one property?</h3>
              <p className="text-slate-600 leading-relaxed">A Property Review can include multiple PDFs. Each review covers up to 600 total pages or 75 MB across all documents.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">What happens if I go over my monthly usage?</h3>
              {/* TODO: Implement automatic overage billing. Currently using manual approval flow. */}
              <p className="text-slate-600 leading-relaxed">We'll pause and ask before billing overages. You can approve additional Property Reviews at your plan's overage rate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600 leading-relaxed">Yes. Your plan remains active until the end of your billing period.</p>
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

        <div className="text-center py-12 px-6 bg-cream-50 rounded-2xl">
          <h2 className="font-serif text-2xl text-navy-900 mb-3">
            Need higher volume?
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            For 100+ Property Reviews/month, firm-wide billing, or procurement support.
          </p>
          <Link
            href="/contact"
            className="btn-primary inline-block"
          >
            Contact us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
