import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiYoutube } from "react-icons/fi";
import { FaTiktok, FaCheck, FaRocket, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { MdSignalCellularAlt, MdEmail } from "react-icons/md";
import { BsFillPersonCheckFill, BsLightningCharge } from "react-icons/bs";
import Faq from 'react-faq-component';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Component() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/') setCurrentPage('home');
    else if (pathname.startsWith('/features')) setCurrentPage('features');
    else if (pathname.startsWith('/pricing')) setCurrentPage('pricing');
    else if (pathname.startsWith('/contact')) setCurrentPage('contact');
    else setCurrentPage('');

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const technicalIndicators = [
    { icon: FiYoutube, title: "Youtube Subscribers", value: "850,000+" },
    { icon: FaTiktok, title: "Tiktok Followers", value: "450,000+" },
    { icon: MdSignalCellularAlt, title: "Trading Experience", value: "10 Years+" },
  ];

  const offerings = [
    { icon: BsLightningCharge, title: "Automated Setup", description: "Set up your custom email in minutes with our easy 3-step process." },
    { icon: MdEmail, title: "Seamless Integration", description: "Works with major domain registrars like GoDaddy, NameCheap, and HostGator" },
    { icon: FaRocket, title: "AI-Powered Tools", description: "Use AI writing assistant and template builder to craft perfect emails." },
    { icon: BsFillPersonCheckFill, title: "White Label Capabilities", description: "Customize the platform to match your brand." },
    { icon: FaChartLine, title: "Advanced Analytics", description: "Get insights into your email performance with detailed analytics." },
    { icon: FaShieldAlt, title: "Enhanced Security", description: "State-of-the-art encryption and security measures to protect your data." },
  ];

  const howItWorks = [
    { title: "Enter Your Domain Name", description: "Simply type in the domain name that you already own into the provided field. Our system will identify your domain registrar automatically." },
    { title: "Choose Your Email Address", description: "Specify the email address you want, like sales@yourdomain.com. This personalized email will help you maintain a professional appearance." },
    { title: "Automated Setup and Start Using Your Email", description: "Our software will handle all the technical configurations with your domain registrar, setting up your email account seamlessly." },
  ];

  const pricingPlans = [
    { title: "Basic", price: "$9.99", features: ["1 Custom Email Address", "5GB Storage", "Web-based Email Client", "24/7 Support"] },
    { title: "Pro", price: "$19.99", features: ["5 Custom Email Addresses", "25GB Storage", "Web and Mobile Apps", "Advanced Spam Protection", "Priority Support"] },
    { title: "Enterprise", price: "$49.99", features: ["Unlimited Custom Email Addresses", "100GB Storage", "Web, Mobile, and Desktop Apps", "Advanced Security Features", "Dedicated Account Manager"] },
  ];

  const testimonials = [
    { name: "John Doe", position: "CEO, TechCorp", content: "This email management solution has revolutionized our communication. It's user-friendly and incredibly efficient!" },
    { name: "Jane Smith", position: "Marketing Director, CreativeHub", content: "The AI-powered tools have saved us countless hours in crafting emails. It's a game-changer for our marketing team." },
    { name: "Mike Johnson", position: "Freelance Developer", content: "As a freelancer, having a professional email setup is crucial. This platform made it incredibly easy and affordable." },
  ];

  const faqData = {
    rows: [
      { title: "How does the automated setup work?", content: "Our automated setup process uses advanced algorithms to detect your domain registrar and configure the necessary DNS records automatically. This eliminates the need for manual configuration and reduces the chance of errors." },
      { title: "Can I use my existing domain name?", content: "Our system is designed to work with any domain name you already own. Simply enter your domain during the setup process, and we'll guide you through the rest." },
      { title: "What kind of support do you offer?", content: "We offer 24/7 customer support via email and live chat. Our Pro and Enterprise plans also include priority support with faster response times." },
      { title: "Is my data secure?", content: "Yes, we take data security very seriously. We use industry-standard encryption protocols and regularly update our security measures to protect your data from unauthorized access." },
    ]
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <Navbar currentPage={currentPage} />
      <main className="container mx-auto px-4 py-16 pt-28">
        <section id="home" className="text-center mb-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              All-in-One Email Management Solution
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Easy and automated setup in just a few steps
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 animate-pulse shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            The New Face of Technical Indicators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {technicalIndicators.map((item, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <item.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-400 text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            What We Offer
          </h2>
          <p className="text-center text-gray-300 text-xl mb-12">
            Discover Our Best Email Management Features
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((item, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <item.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            How It Works
          </h2>
          <p className="text-center text-gray-300 text-xl mb-12">
            Set up your professional email in three easy steps
          </p>
          <div className="max-w-3xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="flex mb-8 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 text-white font-bold rounded-full flex items-center justify-center mr-6 group-hover:animate-bounce shadow-md">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-300 mb-4">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-700">
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <p className="text-4xl font-bold text-blue-400 mb-6">{plan.price}<span className="text-sm text-gray-300">/month</span></p>
                <ul className="text-left mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <FaCheck className="text-teal-400 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            What Our Customers Say
          </h2>
          <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 text-center relative border border-gray-700">
            <p className="text-gray-300 mb-6 text-lg italic">
              "{testimonials[currentTestimonial].content}"
            </p>
            <p className="text-2xl font-bold mb-2">{testimonials[currentTestimonial].name}</p>
            <p className="text-blue-400">{testimonials[currentTestimonial].position}</p>
            <div className="flex justify-center mt-8 space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-400 scale-125' : 'bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mb-24">
          <div className="flex flex-wrap justify-between">
            <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-4">Any questions?</h2>
              <p className="text-gray-300 mb-6">
                Find answers to common questions about our email management solution. If you can't find what you're looking for, don't hesitate to contact our support team.
              </p>
              <Link to="/faq" className="text-teal-400 hover:underline transition-all duration-300 hover:text-blue-400">
                More FAQs
              </Link>
            </div>
            <div className="w-full lg:w-2/3">
              <Faq
                data={faqData}
                styles={{
                  bgColor: 'transparent',
                  titleTextColor: 'white',
                  rowTitleColor: 'white',
                  rowContentColor: '#A5A3CB',
                  arrowColor: 'white',
                }}
                config={{
                  animate: true,
                  openOnload: 0,
                  expandIcon: "+",
                  collapseIcon: "-",
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}

