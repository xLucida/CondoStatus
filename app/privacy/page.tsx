import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Last updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 mb-4">
              At CertAnalyzer, we take your privacy seriously. This policy describes how we collect, 
              use, and protect your information when you use our status certificate analysis service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              When you use CertAnalyzer, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Documents you upload for analysis (status certificates)</li>
              <li>Account information (email, name) if you create an account</li>
              <li>Usage data to improve our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide the certificate analysis service</li>
              <li>Improve our AI analysis capabilities</li>
              <li>Communicate with you about your account</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Document Handling</h2>
            <p className="text-gray-600 mb-4">
              <strong>Your documents are never used to train AI models.</strong> We understand that 
              status certificates contain sensitive information. Documents are:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Encrypted in transit and at rest</li>
              <li>Processed only for the purpose of generating your report</li>
              <li>Deleted according to your retention preferences</li>
              <li>Never shared with third parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 mb-4">
              You control how long we retain your documents. Options include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Delete immediately after analysis</li>
              <li>Retain for 7 days</li>
              <li>Retain for 30 days</li>
            </ul>
            <p className="text-gray-600">
              You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this privacy policy or how we handle your data, 
              please contact us at{' '}
              <a href="mailto:privacy@certanalyzer.com" className="text-blue-600 hover:text-blue-700">
                privacy@certanalyzer.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
