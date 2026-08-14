import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import HomePage from '@/components/pages/HomePage';
import ShopPage from '@/components/pages/ShopPage';
import CollectionsPage from '@/components/pages/CollectionsPage';
import ContactPage from '@/components/pages/ContactPage';
import RentalPage from '@/components/pages/RentalPage';
import RentalBookingPage from '@/components/pages/RentalBookingPage';
import AboutPage from '@/components/pages/AboutPage';
import WishlistPage from '@/components/pages/WishlistPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import ProfilePage from '@/components/pages/ProfilePage';
import FAQPage from '@/components/pages/FAQPage';
import ShippingReturnsPage from '@/components/pages/ShippingReturnsPage';
import PrivacyPolicyPage from '@/components/pages/PrivacyPolicyPage';
import TermsConditionsPage from '@/components/pages/TermsConditionsPage';
import LoginCallbackPage from '@/components/pages/LoginCallbackPage';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
          handle: {
            pageIdentifier: 'home',
          },
        },
        {
          path: 'shop',
          element: <ShopPage />,
          handle: {
            pageIdentifier: 'shop',
          },
        },
        {
          path: 'product/:id',
          element: <ProductDetailPage />,
          handle: {
            pageIdentifier: 'product-detail',
          },
        },
        {
          path: 'collections',
          element: <CollectionsPage />,
          handle: {
            pageIdentifier: 'collections',
          },
        },
        {
          path: 'collections/:slug',
          element: <CollectionsPage />,
          handle: {
            pageIdentifier: 'collection-detail',
          },
        },
        {
          path: 'rental',
          element: <RentalPage />,
          handle: {
            pageIdentifier: 'rental',
          },
        },
        {
          path: 'rental-booking/:id',
          element: <RentalBookingPage />,
          handle: {
            pageIdentifier: 'rental-booking',
          },
        },
        {
          path: 'about',
          element: <AboutPage />,
          handle: {
            pageIdentifier: 'about',
          },
        },
        {
          path: 'contact',
          element: <ContactPage />,
          handle: {
            pageIdentifier: 'contact',
          },
        },
        {
          path: 'checkout',
          element: <CheckoutPage />,
          handle: {
            pageIdentifier: 'checkout',
          },
        },
        {
          path: 'profile',
          element: <ProfilePage />,
          handle: {
            pageIdentifier: 'profile',
          },
        },
        {
          path: 'faq',
          element: <FAQPage />,
          handle: {
            pageIdentifier: 'faq',
          },
        },
        {
          path: 'shipping-returns',
          element: <ShippingReturnsPage />,
          handle: {
            pageIdentifier: 'shipping-returns',
          },
        },
        {
          path: 'privacy-policy',
          element: <PrivacyPolicyPage />,
          handle: {
            pageIdentifier: 'privacy-policy',
          },
        },
        {
          path: 'terms-conditions',
          element: <TermsConditionsPage />,
          handle: {
            pageIdentifier: 'terms-conditions',
          },
        },
        {
          path: 'login-callback',
          element: <LoginCallbackPage />,
          handle: {
            pageIdentifier: 'login-callback',
          },
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_NAME,
  }
);

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
