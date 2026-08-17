import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RentalImageGallery from '@/components/RentalImageGallery';
import { BaseCrudService } from '@/integrations';
import { RentalProducts, BusinessInformation } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MessageCircle } from 'lucide-react';

export default function RentalBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<RentalProducts | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currency } = useCurrency();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    eventType: '',
    eventDate: '',
    returnDate: '',
    deliveryLocation: '',
    shippingAddress: '',
    landmark: '',
    pincode: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      const productData = await BaseCrudService.getById<RentalProducts>('rentalproducts', id);
      setProduct(productData);

      const businessData = await BaseCrudService.getAll<BusinessInformation>('businessinformation', {}, { limit: 1 });
      if (businessData.items.length > 0) {
        setBusinessInfo(businessData.items[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.eventDate.trim()) newErrors.eventDate = 'Event Date is required';
    if (!formData.returnDate.trim()) newErrors.returnDate = 'Return Date is required';
    if (!formData.deliveryLocation.trim()) newErrors.deliveryLocation = 'Delivery Location is required';
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping Address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppBooking = () => {
    if (!validateForm()) {
      return;
    }

    const defaultWhatsApp = '919080242663';
    const finalWhatsApp = businessInfo?.whatsAppNumber || defaultWhatsApp;

    if (!product || !finalWhatsApp) {
      alert('Unable to process booking. Please try again.');
      return;
    }

    // Build the message
    const productUrl = `${window.location.origin}/rental-booking/${product._id}`;
    const message = `*Rental Booking Inquiry*

*Product Details:*
Product: ${product.name}
Price: ${formatPrice(product.price || 0, currency ?? DEFAULT_CURRENCY)}
URL: ${productUrl}
${product.image ? `Image: ${product.image}` : ''}

*Customer Information:*
Name: ${formData.fullName}
Phone: ${formData.phoneNumber}
WhatsApp: ${formData.whatsappNumber || formData.phoneNumber}
Email: ${formData.email || 'Not provided'}

*Booking Details:*
Event Type: ${formData.eventType || 'Not specified'}
Event Date: ${formData.eventDate}
Return Date: ${formData.returnDate}
Delivery Location: ${formData.deliveryLocation}
Shipping Address: ${formData.shippingAddress}
Landmark: ${formData.landmark || 'Not provided'}
Pincode: ${formData.pincode}

*Additional Notes:*
${formData.additionalNotes || 'None'}`;

    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = finalWhatsApp.replace(/\D/g, '');
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-heading text-4xl text-foreground mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/rental')} className="bg-primary hover:bg-primary/90">
              Back to Rentals
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-primary/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-sm font-paragraph">
            <button onClick={() => navigate('/rental')} className="text-primary hover:text-primary/80">
              Rentals
            </button>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image and Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8 p-4">
              <RentalImageGallery
                mainImage={product.image || '/media/b9ec8c_46c93e43a9f3488d916f12200eb5b759_mv2.png'}
                productGallery={product.productGallery}
                productGallery2={product.productGallery2}
                productGallery3={product.productGallery3}
                productGallery4={product.productGallery4}
                productGallery5={product.productGallery5}
                productName={product.name || 'Product'}
              />
            </div>

            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="font-heading text-4xl text-foreground mb-4">{product.name}</h1>
              
              <div className="mb-6 pb-6 border-b border-foreground/10">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-heading text-4xl font-bold text-primary">
                    {formatPrice(product.price || 0, currency ?? DEFAULT_CURRENCY)}
                  </span>
                  <span className="text-lg text-foreground/60 font-paragraph">/ rental</span>
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-heading text-lg text-foreground mb-2">Description</h3>
                  <p className="text-foreground/70 font-paragraph leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-heading text-3xl text-foreground mb-8">Rental Booking Form</h2>

              {product.availabilityStatus === false ? (
                <div className="text-center py-12 px-6 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-heading text-red-600 mb-2">Out of Stock</h3>
                  <p className="text-foreground/70 font-paragraph">
                    This item is currently out of stock and unavailable for new rental bookings at the moment.
                  </p>
                </div>
              ) : (
              <form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.fullName
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.phoneNumber
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.phoneNumber && <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    WhatsApp Number <span className="text-foreground/50">(optional if same as phone)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="Leave blank if same as phone"
                    className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none font-paragraph transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Email Address <span className="text-foreground/50">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none font-paragraph transition-colors"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none font-paragraph transition-colors"
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Reception">Reception</option>
                    <option value="Party">Party</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Event Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.eventDate
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.eventDate && <p className="text-destructive text-sm mt-1">{errors.eventDate}</p>}
                </div>

                {/* Return Date */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Jewellery Return Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.returnDate
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.returnDate && <p className="text-destructive text-sm mt-1">{errors.returnDate}</p>}
                </div>

                {/* Delivery Location */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Delivery Location (City/Town) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    placeholder="Enter city or town"
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.deliveryLocation
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.deliveryLocation && <p className="text-destructive text-sm mt-1">{errors.deliveryLocation}</p>}
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Complete Shipping Address <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors resize-none ${
                      errors.shippingAddress
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.shippingAddress && <p className="text-destructive text-sm mt-1">{errors.shippingAddress}</p>}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Landmark <span className="text-foreground/50">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter nearby landmark"
                    className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none font-paragraph transition-colors"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Pincode <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    className={`w-full px-4 py-3 rounded-lg border font-paragraph transition-colors ${
                      errors.pincode
                        ? 'border-destructive bg-destructive/5'
                        : 'border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none'
                    }`}
                  />
                  {errors.pincode && <p className="text-destructive text-sm mt-1">{errors.pincode}</p>}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block font-paragraph font-semibold text-foreground mb-2">
                    Additional Notes / Special Requirements <span className="text-foreground/50">(optional)</span>
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any special requests or requirements"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 focus:border-primary focus:outline-none font-paragraph transition-colors resize-none"
                  />
                </div>

                {/* WhatsApp Button */}
                <Button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-3 text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Book on WhatsApp
                </Button>

                <p className="text-xs text-foreground/60 font-paragraph text-center">
                  By clicking "Book on WhatsApp", you'll be connected to our team to complete your rental booking.
                </p>
              </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
