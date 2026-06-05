import { Link } from "react-router-dom";

const footerPages = {
  support: {
    path: "/support",
    title: "Support",
    subtitle: "We're here to help you use Trackly safely and confidently.",
    content: (
      <>
        <p>
          Need help with SOS alerts, family tracking, or your account? Our support team
          is available to guide you through setup, troubleshooting, and best practices.
        </p>
        <h5 className="mt-4">Contact support</h5>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@trackly.app">support@trackly.app</a>
          </li>
          <li>
            <strong>Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM (IST)
          </li>
          <li>
            <strong>Response time:</strong> Within 24–48 business hours
          </li>
        </ul>
        <h5 className="mt-4">Before you write to us</h5>
        <ul>
          <li>Check the <Link to="/faqs">FAQs</Link> for quick answers.</li>
          <li>Include your registered email and a short description of the issue.</li>
          <li>For SOS or emergency issues, contact local emergency services first.</li>
        </ul>
      </>
    ),
  },
  faqs: {
    path: "/faqs",
    title: "FAQs",
    subtitle: "Frequently asked questions about Trackly.",
    content: (
      <div className="static-faq-list">
        {[
          {
            q: "What is Trackly?",
            a: "Trackly is a family safety app that lets you share live locations, manage emergency contacts, and send SOS alerts when you need help.",
          },
          {
            q: "How does the SOS alert work?",
            a: "When you trigger SOS, Trackly notifies your emergency contacts with your location and alert details so they can respond quickly.",
          },
          {
            q: "Who can see my location?",
            a: "Only members of your family group can view shared locations. You control who is in your family from the Family Tracker section.",
          },
          {
            q: "Is Trackly free?",
            a: "Trackly offers core safety features for free. See Plans and Pricing for optional premium features.",
          },
          {
            q: "How do I reset my password?",
            a: 'Use the "Forgot Password" link on the sign-in page. A reset link will be sent to your registered email.',
          },
        ].map((item) => (
          <details key={item.q} className="static-faq-item">
            <summary>{item.q}</summary>
            <p className="mb-0 mt-2 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    ),
  },
  "follow-us": {
    path: "/follow-us",
    title: "Follow Us",
    subtitle: "Stay updated with Trackly news, tips, and safety guides.",
    content: (
      <>
        <p>Connect with us on social media for product updates and family safety tips.</p>
        <ul className="list-unstyled static-social-list">
          <li>
            <a href="https://www.linkedin.com/company/tracksafety/" target="_blank" rel="noreferrer">
              LinkedIn — Track Safety
            </a>
          </li>
          <li>
            <a href="https://x.com/tracksafety" target="_blank" rel="noreferrer">
              X (Twitter) — @tracksafety
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/tracksafety/" target="_blank" rel="noreferrer">
              Instagram — @tracksafety
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/tracksafety/" target="_blank" rel="noreferrer">
              Facebook — Track Safety
            </a>
          </li>
        </ul>
      </>
    ),
  },
  company: {
    path: "/company",
    title: "Company",
    subtitle: "Building technology that keeps families connected and safe.",
    content: (
      <>
        <p>
          Trackly is built by a team focused on practical family safety tools — real-time
          location sharing, emergency contacts, and instant SOS alerts in one simple app.
        </p>
        <h5 className="mt-4">Our mission</h5>
        <p className="text-muted">
          To give every family peace of mind through reliable, easy-to-use safety features
          that work when it matters most.
        </p>
        <h5 className="mt-4">What we believe</h5>
        <ul>
          <li>Safety tools should be simple, not overwhelming.</li>
          <li>Privacy and trust come first.</li>
          <li>Technology should help families stay connected in everyday life and emergencies.</li>
        </ul>
      </>
    ),
  },
  "contact-us": {
    path: "/contact-us",
    title: "Contact Us",
    subtitle: "Reach the Trackly team for questions, feedback, or partnerships.",
    content: (
      <>
        <p>We'd love to hear from you. Choose the channel that fits your request.</p>
        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <div className="static-info-box">
              <h6>General inquiries</h6>
              <a href="mailto:hello@trackly.app">hello@trackly.app</a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="static-info-box">
              <h6>Support</h6>
              <a href="mailto:support@trackly.app">support@trackly.app</a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="static-info-box">
              <h6>Business & partnerships</h6>
              <a href="mailto:partners@trackly.app">partners@trackly.app</a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="static-info-box">
              <h6>Office</h6>
              <p className="mb-0 text-muted small">India · Remote-first team</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "our-license": {
    path: "/our-license",
    title: "Our License",
    subtitle: "Software licensing and usage terms for Trackly.",
    content: (
      <>
        <p>
          Trackly software and branding are protected by applicable copyright and
          intellectual property laws. Use of the app is subject to our Terms of Service.
        </p>
        <h5 className="mt-4">Permitted use</h5>
        <ul>
          <li>Personal and family safety use through the official Trackly app.</li>
          <li>Sharing location and alerts only with contacts you authorize.</li>
        </ul>
        <h5 className="mt-4">Restrictions</h5>
        <ul>
          <li>No reverse engineering, scraping, or unauthorized redistribution of the app.</li>
          <li>No misuse of SOS or location features to harass or track others without consent.</li>
        </ul>
        <p className="text-muted small mt-3">
          For full legal terms, see our{" "}
          <Link to="/terms-and-conditions">Terms &amp; Service</Link>.
        </p>
      </>
    ),
  },
  blog: {
    path: "/blog",
    title: "Blog",
    subtitle: "Safety tips, product updates, and stories from the Trackly community.",
    content: (
      <div className="static-blog-list">
        {[
          {
            title: "5 ways to set up family safety in under 10 minutes",
            date: "May 2026",
            excerpt: "A quick checklist for emergency contacts, family groups, and SOS setup.",
          },
          {
            title: "Why live location sharing matters for parents",
            date: "April 2026",
            excerpt: "How families use Trackly to stay connected during busy days.",
          },
          {
            title: "Introducing group chat for family groups",
            date: "March 2026",
            excerpt: "Coordinate pickups, check-ins, and daily plans in one place.",
          },
        ].map((post) => (
          <article key={post.title} className="static-blog-item">
            <span className="text-muted small">{post.date}</span>
            <h5 className="mt-1">{post.title}</h5>
            <p className="text-muted mb-0">{post.excerpt}</p>
          </article>
        ))}
      </div>
    ),
  },
  "plans-and-pricing": {
    path: "/plans-and-pricing",
    title: "Plans and Pricing",
    subtitle: "Simple pricing for families who want extra peace of mind.",
    content: (
      <div className="row g-3">
        {[
          {
            name: "Free",
            price: "₹0",
            period: "forever",
            features: ["SOS alerts", "Emergency contacts", "Family tracker (up to 5 members)", "Live map"],
          },
          {
            name: "Family Plus",
            price: "₹199",
            period: "/ month",
            features: ["Everything in Free", "Unlimited family members", "Priority support", "Extended location history"],
          },
        ].map((plan) => (
          <div key={plan.name} className="col-md-6">
            <div className="static-pricing-card h-100">
              <h5>{plan.name}</h5>
              <p className="static-pricing-price">
                {plan.price}
                <span className="text-muted small">{plan.period}</span>
              </p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  "whats-new": {
    path: "/whats-new",
    title: "What's New",
    subtitle: "Latest improvements and features in Trackly.",
    content: (
      <ul className="static-changelog">
        {[
          { version: "Jun 2026", items: ["Secure cookie-based login", "Mobile-responsive family tracker", "Group chat for families"] },
          { version: "May 2026", items: ["Emergency contact search", "SOS contact picker improvements", "Profile page updates"] },
          { version: "Apr 2026", items: ["Live family map", "Family member roles (Head / Member)", "Email verification on sign-up"] },
        ].map((release) => (
          <li key={release.version}>
            <strong>{release.version}</strong>
            <ul>
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    ),
  },
  "privacy-policy": {
    path: "/privacy-policy",
    title: "Privacy Policy",
    subtitle: "Last updated: June 2026",
    content: (
      <>
        <p>
          Trackly respects your privacy. This policy explains what data we collect, how we
          use it, and the choices you have.
        </p>
        <h5 className="mt-4">Information we collect</h5>
        <ul>
          <li>Account details (name, email, contact number for email sign-ups).</li>
          <li>Location data when you use family tracking or SOS features.</li>
          <li>Emergency contact information you add to your account.</li>
        </ul>
        <h5 className="mt-4">How we use your data</h5>
        <ul>
          <li>To provide location sharing, SOS alerts, and family group features.</li>
          <li>To authenticate your account and keep it secure.</li>
          <li>To improve app reliability and support.</li>
        </ul>
        <h5 className="mt-4">Your choices</h5>
        <p className="text-muted">
          You can update profile details, manage emergency contacts, leave a family group,
          or delete your account by contacting support. Location sharing is only active
          when you use tracking features within a family group.
        </p>
      </>
    ),
  },
  "terms-and-conditions": {
    path: "/terms-and-conditions",
    title: "Terms & Service",
    subtitle: "Last updated: June 2026",
    content: (
      <>
        <p>
          By using Trackly, you agree to these terms. Please read them carefully before
          using the app.
        </p>
        <h5 className="mt-4">Use of the service</h5>
        <ul>
          <li>Trackly is a safety and coordination tool, not a replacement for emergency services.</li>
          <li>You must provide accurate account information and keep your credentials secure.</li>
          <li>You may only add emergency contacts and family members who have given consent.</li>
        </ul>
        <h5 className="mt-4">SOS and emergencies</h5>
        <p className="text-muted">
          In a life-threatening emergency, always contact local emergency services (e.g. 112)
          first. SOS alerts supplement — but do not replace — professional emergency response.
        </p>
        <h5 className="mt-4">Limitation of liability</h5>
        <p className="text-muted">
          Trackly is provided &quot;as is.&quot; We are not liable for delays, failed notifications,
          or inaccurate location data caused by device, network, or third-party limitations.
        </p>
      </>
    ),
  },
};

export const footerRoutes = Object.entries(footerPages).map(([key, page]) => ({
  key,
  path: page.path,
}));

export default footerPages;
