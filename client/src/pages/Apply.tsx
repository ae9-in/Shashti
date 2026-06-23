import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    categories: [] as string[],
    additionalInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat: string, checked: boolean) => {
    const newCats = checked
      ? [...formData.categories, cat]
      : formData.categories.filter((c) => c !== cat);
    setFormData({ ...formData, categories: newCats });
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.phone || !formData.email) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.city || !formData.state || !formData.pincode) {
        toast.error("Please fill in all required fields.");
        return;
      }
    } else if (currentStep === 3) {
      if (formData.categories.length === 0) {
        toast.error("Please select at least one category.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FBF4E6]">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container max-w-2xl mx-auto text-center space-y-8">
            <svg
              viewBox="0 0 120 120"
              className="w-32 h-32 text-[#C9A227] mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M50 10 L20 30 L20 60 Q20 90 50 110 Q80 90 80 60 L80 30 Z" />
              <line x1="50" y1="40" x2="50" y2="85" />
            </svg>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Application Received
              </h1>
              <p className="text-lg text-[#241108] leading-relaxed">
                Thank you for your interest! Our partnership team will reach out within 2–3 business days.
              </p>
            </div>

            <a href="/" className="inline-block mt-8 px-8 py-3 border-2 border-[#C9A227] text-[#3D0A12] font-bold rounded-lg hover:bg-[#C9A227] hover:text-[#FBF4E6] transition-all duration-300">
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF4E6]">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12">
            {/* Left: Brand Panel */}
            <div className="hidden lg:flex flex-col justify-start space-y-8 sticky top-40">
              <div className="space-y-6">
                <svg viewBox="0 0 100 120" className="w-24 h-24 text-[#C9A227] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 10 L20 30 L20 60 Q20 90 50 110 Q80 90 80 60 L80 30 Z" />
                  <line x1="50" y1="40" x2="50" y2="85" />
                </svg>

                <h2 className="text-2xl font-serif font-bold text-[#3D0A12] text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Only One Partner Per Area
                </h2>

                <div className="space-y-3 text-[#241108] text-sm">
                  {['Exclusive territory protection', 'Higher profit margins', 'Dedicated support team', 'Priority product access'].map((benefit, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-[#C9A227] font-bold">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map((step, idx) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step <= currentStep ? 'bg-[#C9A227] text-[#3D0A12]' : 'bg-[#E3C567] text-[#3D0A12]'}`}>
                      {step}
                    </div>
                    {idx < 3 && <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-[#C9A227]' : 'bg-[#E3C567]'}`} />}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="p-8 rounded-lg border-2 border-[#C9A227] bg-white space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-[#3D0A12]">About You</h3>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Full Name *</label>
                        <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Phone Number *</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="10-digit phone" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Email Address *</label>
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="your@email.com" />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-[#3D0A12]">Your Territory</h3>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">City / Town *</label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="Your city" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">State *</label>
                        <input name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="Your state" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Pincode / Area *</label>
                        <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors" placeholder="Your pincode" />
                        <p className="text-xs text-[#241108] mt-1">We verify one partner per locality, so be specific.</p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-[#3D0A12]">Business Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Categories Interested In *</label>
                        <div className="space-y-2">
                          {['Agarbatti & Incense', 'Camphor Products', 'Kumkum & Turmeric', 'Pooja Essentials', 'Religious Accessories', 'Festival Collections'].map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={formData.categories.includes(cat)}
                                onChange={(e) => handleCategoryChange(cat, e.target.checked)}
                              />
                              <span className="text-[#241108] text-sm">{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D0A12] mb-2">Additional Info</label>
                        <textarea
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border-b-2 border-[#C9A227] bg-transparent focus:outline-none focus:border-[#E3C567] transition-colors resize-none"
                          rows={4}
                          placeholder="Tell us more..."
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-[#3D0A12]">Review & Submit</h3>
                      <div className="bg-[#F5EDE0] p-4 rounded border border-[#C9A227] text-sm space-y-2 text-[#241108]">
                        <p><strong>Name:</strong> {formData.fullName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Location:</strong> {formData.city}, {formData.state} - {formData.pincode}</p>
                        <p><strong>Categories:</strong> {formData.categories.join(', ') || 'None selected'}</p>
                        {formData.additionalInfo && (
                          <p><strong>Additional Info:</strong> {formData.additionalInfo}</p>
                        )}
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 mt-1" required />
                        <span className="text-sm text-[#241108]">I understand only one Preferred Partner is appointed per area and applications are reviewed in order received.</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={isSubmitting}
                      className="px-6 py-2 border-2 border-[#C9A227] text-[#3D0A12] font-semibold rounded-lg hover:bg-[#C9A227]/10 disabled:opacity-50 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    type={currentStep === 4 ? 'submit' : 'button'}
                    onClick={currentStep < 4 ? handleNext : undefined}
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-[#C9A227] text-[#3D0A12] font-semibold rounded-lg hover:bg-[#E3C567] disabled:opacity-50 transition-all"
                  >
                    {currentStep === 4 ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
