
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { Splash } from './pages/Splash';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { Auth } from './pages/Auth';
import { Premium } from './pages/Premium';
import { Payment } from './pages/Payment';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { Watchlist } from './pages/Watchlist';
import { ShortDrama } from './pages/ShortDrama';
import { Downloads } from './pages/Downloads';
import { Feedback } from './pages/Feedback';
import { Settings } from './pages/Settings';
import { ContactSupport, PrivacyPolicy, TermsOfService } from './pages/StaticPages';
import { AdminLayout, AdminDashboard } from './pages/Admin/Dashboard';
import { ContentManagement } from './pages/Admin/ContentManagement';
import { AdManagement } from './pages/Admin/AdManagement';
import { AppControl } from './pages/Admin/AppControl';
import { SupportDesk } from './pages/Admin/SupportDesk';
import { UserManagement } from './pages/Admin/UserManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isLoading } = useApp();
  
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/home" />;
  
  return <>{children}</>;
};

const SuccessPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
      <i className="fa-solid fa-check"></i>
    </div>
    <h1 className="text-4xl font-black">Payment Successful!</h1>
    <p className="text-slate-400 max-w-md">Your account has been upgraded to Premium. You can now enjoy ad-free streaming in 4K resolution.</p>
    <button onClick={() => window.location.hash = '#/home'} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl">Back to Home</button>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth />} />
      
      {/* User Routes */}
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/watch/:id" element={<Layout><Watch /></Layout>} />
      <Route path="/short-drama" element={<Layout><ShortDrama /></Layout>} />
      <Route path="/downloads" element={<Layout><Downloads /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/watchlist" element={<Layout><Watchlist /></Layout>} />
      <Route path="/feedback" element={<Layout><Feedback /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      
      {/* Static & Legal Pages */}
      <Route path="/contact-support" element={<Layout><ContactSupport /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
      
      {/* Premium & Payment */}
      <Route path="/premium" element={<Layout><Premium /></Layout>} />
      <Route path="/payment" element={<Layout><Payment /></Layout>} />
      <Route path="/payment-successful" element={<Layout><SuccessPage /></Layout>} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/app-control" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><AppControl /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/content" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><ContentManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/ads" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><AdManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><UserManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminLayout><div className="p-10 text-slate-500">Payment Logs coming soon...</div></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/support" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><SupportDesk /></AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
