import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AnimatedRoute from './components/AnimatedRoute';
import SocialCTABanner from './components/SocialCTABanner';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';

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
          <AppRoutes />
        </main>
        <Footer />
        <SocialCTABanner />
      </div>
    </Router>
  );
}

export default App;
