import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg">Privacy Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 prose prose-sm text-gray-700">
        <p className="text-sm text-gray-400 mb-8">
          Last updated April 08, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            1. Introduction
          </h2>
          <p>
            This Privacy Policy for IngredientIQ ("we," "us," or "our")
            describes how we collect, use, and share information about you when
            you use our smart food safety scanner application ("the App"). By
            using IngredientIQ, you agree to the collection and use of
            information in accordance with this policy.
          </p>
          <p className="mt-3">
            IngredientIQ is a smart food safety scanner that allows users to
            scan ingredient labels on packaged food products using their device
            camera. The App uses optical character recognition (OCR) to extract
            ingredient text and artificial intelligence to provide an instant
            safety verdict and detailed breakdown of potentially harmful or
            beneficial ingredients. Results are for informational purposes only
            and do not constitute medical or dietary advice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            2. Information We Collect
          </h2>
          <h3 className="font-semibold text-gray-800 mb-2">
            Information you provide directly
          </h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Display name</li>
            <li>Email address</li>
            <li>Password (stored securely and never in plain text)</li>
            <li>Product names and ingredient text you submit for analysis</li>
          </ul>
          <h3 className="font-semibold text-gray-800 mb-2">
            Information collected automatically
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Log and usage data (IP address, browser type, pages visited)
            </li>
            <li>Device data (browser version, operating system)</li>
            <li>Authentication tokens and session data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            3. Camera and Image Data
          </h2>
          <p>
            IngredientIQ requests access to your device camera solely to capture
            images of ingredient labels. All image processing is performed
            entirely on your device using Tesseract.js, an in-browser OCR
            engine. No images are ever transmitted to our servers or any
            third-party service. Images are processed in memory and immediately
            discarded after text extraction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and manage your account</li>
            <li>To provide the ingredient scanning and analysis service</li>
            <li>To store your scan history (authenticated users only)</li>
            <li>
              To send transactional emails such as account confirmation and
              password reset
            </li>
            <li>To respond to your inquiries and support requests</li>
            <li>To identify usage trends and improve the service</li>
            <li>To maintain the security and integrity of our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            5. Third-Party Services
          </h2>
          <p className="mb-3">
            We use the following third-party services to operate IngredientIQ.
            Each has their own privacy policy governing how they handle data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Supabase</strong> — database storage and authentication
            </li>
            <li>
              <strong>Google Generative AI (Gemini)</strong> — AI-powered
              ingredient analysis
            </li>
            <li>
              <strong>Google Sign-In</strong> — optional social authentication
            </li>
            <li>
              <strong>Vercel</strong> — frontend hosting
            </li>
            <li>
              <strong>Render</strong> — backend hosting
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery
            </li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to any third party.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            6. Data Retention
          </h2>
          <p>
            We retain your personal information for as long as your account
            remains active. When you delete your account, your profile and all
            associated scan history will be permanently deleted from our
            database. Guest scan data is stored locally on your device using
            localStorage and is never transmitted to our servers unless you
            choose to create an account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            7. International Data Transfers
          </h2>
          <p>
            IngredientIQ is operated from Ireland. Our backend infrastructure
            and third-party services are located in the United States. By using
            the App, you acknowledge that your data may be transferred to and
            processed in the United States. These transfers are governed by
            Standard Contractual Clauses as provided by our third-party
            processors including Supabase, Google, and Resend.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            8. Your Rights
          </h2>
          <p className="mb-3">
            Under GDPR and applicable privacy laws, you have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your personal data (right to erasure)</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, you can delete your account
            directly from the Profile page in the App, or contact us at{' '}
            <a
              href="mailto:alabaoreoluwa@gmail.com"
              className="text-green-600 hover:underline"
            >
              alabaoreoluwa@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            9. AI-Generated Analysis Disclaimer
          </h2>
          <p>
            The ingredient safety analysis provided by IngredientIQ is generated
            by artificial intelligence and is intended for informational
            purposes only. It does not constitute medical, dietary, or
            nutritional advice and should not be relied upon as a substitute for
            professional medical guidance. IngredientIQ makes no warranties
            regarding the accuracy, completeness, or reliability of any
            AI-generated analysis. Users with specific dietary requirements,
            allergies, or health conditions should consult a qualified
            healthcare professional before making food choices based on this
            App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">10. Security</h2>
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal data. These include encrypted connections
            (HTTPS), row-level security on our database ensuring users can only
            access their own data, server-side API key storage, and JWT-based
            authentication. However, no method of transmission over the internet
            is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            11. Children's Privacy
          </h2>
          <p>
            IngredientIQ is not intended for users under the age of 18. We do
            not knowingly collect personal data from children. If you believe a
            child has provided us with personal data, please contact us and we
            will delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            12. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any significant changes by posting a notice in the App at
            least 7 days before the changes take effect. Your continued use of
            the App after changes are posted constitutes your acceptance of the
            updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            13. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            how we handle your data, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-gray-100 rounded-xl text-sm">
            <p>
              <strong>IngredientIQ</strong>
            </p>
            <p>Dublin, Ireland</p>
            <p>
              Email:{' '}
              <a
                href="mailto:alabaoreoluwa@gmail.com"
                className="text-green-600 hover:underline"
              >
                alabaoreoluwa@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
