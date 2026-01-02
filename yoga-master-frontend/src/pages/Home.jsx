import React, { useState, useEffect } from 'react';
import PopularClasses from '../components/home/PopularClasses';
import PopularInstructors from '../components/home/PopularInstructors';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, Play, Star, 
  Quote, ChevronDown, Zap, ShieldCheck, Heart, Users, MonitorPlay, Activity, CheckCircle, Instagram, Twitter, Facebook
} from 'lucide-react';

const Home = () => {
  // --- FIXED: Optimized & Spiritual Images (Fast Loading) ---
  const bgImages = [
    // Spiritual/Meditation (Fast Load: w=1600)
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1600&auto=format&fit=crop", 
    // Indian Yoga Vibe (Fast Load)
    "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1600&auto=format&fit=crop",
    // Nature & Peace (Fast Load)
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#FAFAF9] font-sans text-stone-900 selection:bg-green-200 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION: THE HOOK --- */}
      {/* Changed to grid-cols-1 for mobile, lg:grid-cols-2 for desktop */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left: Value Proposition */}
        {/* Order-2 on mobile (below image), order-1 on desktop if you want text first. Currently standard stacking. */}
        <div className="relative flex flex-col justify-center px-6 sm:px-12 md:px-24 py-16 lg:py-20 bg-[#0c0c0c] text-white z-20 order-2 lg:order-1">
            
            <div className="mb-6 lg:mb-8 flex items-center gap-3 animate-fade-in-up">
                <span className="px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-green-500/10">
                    #1 Rated Online Yoga Platform
                </span>
            </div>

            {/* Responsive Text Sizing */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif leading-[1.1] mb-6 drop-shadow-2xl">
                Master Your Body, <br/>
                <span className="italic text-stone-500 font-light">Calm</span> Your Mind.
            </h1>

            <p className="text-stone-400 text-base sm:text-lg max-w-lg mb-8 lg:mb-10 leading-relaxed font-light">
                The ultimate destination for online yoga. Access live classes, track your progress, and learn from the world's best instructors—all from your home.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 items-start sm:items-center">
                <Link to="/classes" className="w-full sm:w-auto justify-center group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold transition-all hover:bg-green-500 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    Explore Classes <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform"/>
                </Link>
                <Link to="/classes" className="w-full sm:w-auto justify-center flex items-center gap-3 text-stone-300 hover:text-white transition font-medium px-4 py-2">
                    <Play size={18} fill="currentColor" /> See Demo video
                </Link>
            </div>

            {/* Trust Signals */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-white/10 flex flex-col gap-4">
                <p className="text-stone-500 text-xs uppercase tracking-widest">Trusted by 10,000+ Yogis Worldwide</p>
                <div className="flex gap-2 items-center">
                    <div className="flex">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-500" fill="currentColor"/>)}
                    </div>
                    <span className="text-sm font-bold ml-2">4.9/5 Rating</span>
                </div>
            </div>
        </div>

        {/* Right: Visual Slider */}
        {/* Adjusted height for mobile (50vh) vs desktop (auto/full) */}
        <div className="relative h-[50vh] lg:h-auto min-h-[400px] overflow-hidden bg-stone-900 order-1 lg:order-2">
            {bgImages.map((img, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out
                    ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    style={{ backgroundImage: `url(${img})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-50 lg:bg-gradient-to-l"></div>
                </div>
            ))}
        </div>
      </section>

      {/* --- 2. ABOUT: WHAT IS YOGAMASTER? --- */}
      <section className="py-16 lg:py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image Container */}
              <div className="relative px-4 sm:px-0 order-2 lg:order-1">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                  <img src="https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=800" className="relative z-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full" alt="About Us"/>
                  
                  {/* Floating Badge - Responsive positioning */}
                  <div className="absolute -bottom-6 right-0 sm:-bottom-10 sm:-right-10 bg-white p-4 sm:p-6 rounded-2xl shadow-xl z-20 max-w-[200px] sm:max-w-xs animate-bounce-slow">
                      <p className="font-serif text-lg sm:text-2xl font-bold text-stone-900">"Changed my life."</p>
                      <p className="text-stone-500 text-xs sm:text-sm mt-2">- Sarah J., Member since 2024</p>
                  </div>
              </div>

              {/* Text Content */}
              <div className="order-1 lg:order-2">
                  <h4 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4">Who We Are</h4>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 mb-6 leading-tight">More Than Just A <br/> Workout App.</h2>
                  <p className="text-stone-600 text-base sm:text-lg mb-6 leading-relaxed">
                      YogaMaster is a holistic wellness ecosystem designed to help you find balance in a chaotic world. We combine ancient wisdom with modern technology to bring you a personalized yoga experience.
                  </p>
                  <ul className="space-y-4 mb-8">
                      {[
                          "Personalized progress tracking",
                          "Access to 500+ HD video classes",
                          "Live interactive sessions with gurus"
                      ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-stone-700 font-medium text-sm sm:text-base">
                              <CheckCircle className="text-green-600 shrink-0" size={20}/> {item}
                          </li>
                      ))}
                  </ul>
                  <Link to="/classes" className="inline-block text-stone-900 font-bold border-b-2 border-green-500 hover:text-green-600 transition pb-1">
                      Read Our Full Story
                  </Link>
              </div>
          </div>
      </section>

      {/* --- 3. HOW IT WORKS (Process) --- */}
      {/* Margin adjustments for mobile vs desktop */}
      <section className="bg-[#1a1918] text-white py-16 lg:py-24 px-6 rounded-[2rem] lg:rounded-[3rem] mx-4 md:mx-10 shadow-2xl relative overflow-hidden">
          {/* Bg Noise */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-serif mb-12 lg:mb-16">Your Journey in 3 Steps</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                      { icon: <Users size={40}/>, title: "1. Create Account", desc: "Join our community and set your fitness goals." },
                      { icon: <MonitorPlay size={40}/>, title: "2. Choose a Class", desc: "Filter by difficulty, duration, or instructor." },
                      { icon: <Activity size={40}/>, title: "3. Start Practicing", desc: "Follow along in HD and track your daily progress." }
                  ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center group">
                          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition duration-500 text-green-400 group-hover:text-black">
                              {step.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                          <p className="text-stone-400 max-w-xs mx-auto text-sm sm:text-base">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- 4. FEATURES GRID (Bento Style) --- */}
      <section className="py-16 lg:py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-4">Why Choose Us?</h2>
              <p className="text-stone-500 text-sm sm:text-base">Everything you need to succeed in your yoga journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-green-50 p-8 rounded-[2rem] hover:-translate-y-2 transition duration-300">
                  <div className="bg-green-200 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-green-800">
                      <Zap size={28}/>
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-3">Instant Access</h3>
                  <p className="text-stone-600">No waiting. Start streaming classes immediately after signup on any device.</p>
              </div>
              
              {/* Feature 2 (Highlighted) */}
              <div className="bg-stone-900 text-white p-8 rounded-[2rem] hover:-translate-y-2 transition duration-300 shadow-xl">
                  <div className="bg-stone-700 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-white">
                      <ShieldCheck size={28}/>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Certified Masters</h3>
                  <p className="text-stone-400">We only hire instructors with 500+ hours of certified training and experience.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-blue-50 p-8 rounded-[2rem] hover:-translate-y-2 transition duration-300">
                  <div className="bg-blue-200 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-blue-800">
                      <Heart size={28}/>
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-3">Community Love</h3>
                  <p className="text-stone-600">Join a supportive tribe. Share progress, ask questions, and grow together.</p>
              </div>
          </div>
      </section>

      {/* --- 5. DYNAMIC SECTIONS (FIXED) --- */}
      <div className="bg-white pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-6">
             
             {/* SECTION A: POPULAR CLASSES */}
             {/* Flex-col on mobile, Flex-row on desktop */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-green-500"></div>
                        <span className="uppercase tracking-widest font-bold text-sm text-stone-500">Trending Now</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mt-2">Popular Classes</h2>
                </div>
                <Link to="/classes" className="text-stone-500 hover:text-green-600 font-medium text-sm transition">View all classes &rarr;</Link>
             </div>
             
             {/* Dynamic Popular Classes */}
             {/* Ensure the child component (PopularClasses) also has responsive grids */}
             <PopularClasses />
             
             {/* Spacer */}
             <div className="py-12 lg:py-16"></div>
             
             {/* SECTION B: POPULAR INSTRUCTORS (FIXED) */}
             <div className="relative">
                {/* 1. Header for Instructors */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 md:gap-4">
                    <div>
                        <h4 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-2">Expert Guidance</h4>
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Meet Your Mentors</h2>
                        <p className="text-stone-500 mt-2 max-w-md text-sm sm:text-base">Learn from certified yoga masters with decades of experience.</p>
                    </div>
                    <Link to="/instructors" className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition font-medium">
                        View All Instructors <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform"/>
                    </Link>
                </div>

                {/* 2. Enhanced Container */}
                <div className="bg-stone-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-stone-100 relative overflow-hidden hover:shadow-lg transition-shadow duration-500">
                    {/* Decorative Blur Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    
                    {/* The Component */}
                    <div className="relative z-10">
                        <PopularInstructors />
                    </div>
                </div>
             </div>

          </div>
      </div>

      {/* --- 6. MEGA FOOTER --- */}
      <footer className="bg-[#0c0c0c] text-white pt-16 lg:pt-24 pb-12 rounded-t-[2rem] lg:rounded-t-[3rem] mt-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 lg:mb-20 border-b border-white/10 pb-12">
              
              {/* Brand Col */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <Link to="/" className="text-3xl font-serif font-bold text-white mb-6 block">
                      Yoga<span className="text-green-500">Master</span>.
                  </Link>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6">
                      The world's #1 platform for yoga and wellness. Empowering you to live a healthier, happier life.
                  </p>
                  <div className="flex gap-4">
                      <div className="p-2 bg-white/10 rounded-full hover:bg-green-500 transition cursor-pointer"><Instagram size={18}/></div>
                      <div className="p-2 bg-white/10 rounded-full hover:bg-green-500 transition cursor-pointer"><Twitter size={18}/></div>
                      <div className="p-2 bg-white/10 rounded-full hover:bg-green-500 transition cursor-pointer"><Facebook size={18}/></div>
                  </div>
              </div>

              {/* Links Col 1 */}
              <div>
                  <h4 className="font-bold text-lg mb-6">Platform</h4>
                  <ul className="space-y-4 text-stone-400 text-sm">
                      <li><Link to="/classes" className="hover:text-green-400 transition">Browse Classes</Link></li>
                      <li><Link to="/instructors" className="hover:text-green-400 transition">Our Instructors</Link></li>
                      <li><Link to="/pricing" className="hover:text-green-400 transition">Membership Plans</Link></li>
                      <li><Link to="/live" className="hover:text-green-400 transition">Live Schedule</Link></li>
                  </ul>
              </div>

              {/* Links Col 2 */}
              <div>
                  <h4 className="font-bold text-lg mb-6">Company</h4>
                  <ul className="space-y-4 text-stone-400 text-sm">
                      <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
                      <li><Link to="/careers" className="hover:text-green-400 transition">Careers</Link></li>
                      <li><Link to="/blog" className="hover:text-green-400 transition">Wellness Blog</Link></li>
                      <li><Link to="/contact" className="hover:text-green-400 transition">Contact Support</Link></li>
                  </ul>
              </div>

              {/* Newsletter */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
                  <p className="text-stone-400 text-xs mb-4">Get the latest wellness tips and exclusive offers.</p>
                  <div className="flex bg-white/10 rounded-lg p-1">
                      <input type="email" placeholder="Email address" className="bg-transparent text-white px-4 py-2 w-full text-sm focus:outline-none placeholder-stone-500"/>
                      <button className="bg-green-600 px-4 py-2 rounded-md font-bold text-xs hover:bg-green-500 transition">JOIN</button>
                  </div>
              </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4 md:gap-0">
              <p>&copy; 2026 YogaMaster Inc. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-6">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Cookie Settings</span>
              </div>
          </div>
      </footer>

    </div>
  );
};

export default Home;