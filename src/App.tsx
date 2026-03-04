import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AnimatedRoute from './components/AnimatedRoute';
import SocialCTABanner from './components/SocialCTABanner';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Contact = lazy(() => import('./pages/Contact'));

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
        <Route path="/a-propos" element={<AnimatedRoute><About /></AnimatedRoute>} />
        <Route path="/services" element={<AnimatedRoute><Services /></AnimatedRoute>} />
        <Route path="/galerie" element={<AnimatedRoute><Gallery /></AnimatedRoute>} />
        <Route path="/temoignages" element={<AnimatedRoute><Testimonials /></AnimatedRoute>} />
        <Route path="/contact" element={<AnimatedRoute><Contact /></AnimatedRoute>} />
        <Route path="/admin" element={<AnimatedRoute><Admin /></AnimatedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
        </main>
        <Footer />
        <SocialCTABanner />
      </div>
    </Router>
  );
}

export default App;
