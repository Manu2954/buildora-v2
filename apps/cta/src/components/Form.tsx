import { useState } from 'react'

interface FormData {
  fullName: string
  mobileNumber: string
  location: string
  requirement: string
  requirements: string[]
  otherRequirement: string
  consent: boolean
}

interface FormErrors {
  fullName?: string
  mobileNumber?: string
  location?: string
  requirement?: string
  consent?: string
}

const requirementOptions = [
  'Interior Supplies/Products',
  'Modular Kitchen',
  'Wardrobe or Storage',
  'TV Unit or Showcase',
  'Full Home Interiors',
  'Other'
]

function Form() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    location: '',
    requirement: '',
    requirements: [],
    otherRequirement: '',
    consent: false
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.requirement && formData.requirements.length === 0) {
      newErrors.requirement = 'Please select at least one requirement'
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to be contacted'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
      // Reset form
      setFormData({
        fullName: '',
        mobileNumber: '',
        location: '',
        requirement: '',
        requirements: [],
        otherRequirement: '',
        consent: false
      })
    }, 1500)
  }

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requirements: checked 
        ? [...prev.requirements, requirement]
        : prev.requirements.filter(r => r !== requirement)
    }))
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-base mb-4">Thank You!</h3>
            <p className="text-gray-600 leading-relaxed">
              Our team will connect with you shortly to understand your requirement and begin your project.
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium focus-ring"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-text-base mb-2">Get Started Today</h2>
        <p className="text-gray-600">Fill out the form below and our team will reach out to you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-text-base mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg form-input focus-ring ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-text-base mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg form-input focus-ring ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your 10-digit mobile number"
            maxLength={10}
          />
          {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-base mb-2">
            Your Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg form-input focus-ring ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your city/location"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-text-base mb-3">
            Select or Describe Your Requirement <span className="text-red-500">*</span>
          </label>
          
          {/* Dropdown */}
          <select
            value={formData.requirement}
            onChange={(e) => setFormData({...formData, requirement: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg form-input focus-ring mb-4 ${errors.requirement ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select your primary requirement</option>
            {requirementOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          {/* Checkbox List */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">You can also select multiple interests:</p>
            {requirementOptions.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requirements.includes(option)}
                  onChange={(e) => handleRequirementChange(option, e.target.checked)}
                  className="w-4 h-4 text-brand-gold bg-gray-100 border-gray-300 rounded focus:ring-brand-gold focus:ring-2"
                />
                <span className="text-text-base">{option}</span>
              </label>
            ))}
          </div>
          
          {/* Other Requirement Text Box */}
          {(formData.requirement === 'Other' || formData.requirements.includes('Other')) && (
            <div className="mt-4">
              <input
                type="text"
                value={formData.otherRequirement}
                onChange={(e) => setFormData({...formData, otherRequirement: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg form-input focus-ring"
                placeholder="Please specify your requirement"
              />
            </div>
          )}
          
          {errors.requirement && <p className="text-red-500 text-sm mt-1">{errors.requirement}</p>}
        </div>

        {/* Consent Checkbox */}
        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({...formData, consent: e.target.checked})}
              className={`w-4 h-4 text-brand-gold bg-gray-100 border-gray-300 rounded focus:ring-brand-gold focus:ring-2 mt-1 ${errors.consent ? 'border-red-300' : ''}`}
            />
            <span className="text-sm text-text-base leading-relaxed">
              I agree to be contacted by Buildora Enterprise for my inquiry. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-white font-semibold py-4 px-6 rounded-lg focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send My Requirement'}
        </button>
      </form>
    </div>
  )
}

export default Form
