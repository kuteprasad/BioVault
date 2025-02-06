import React, { useState } from 'react';
import { Shield, Check, Star, Zap, Lock, Fingerprint, Users, Cloud, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop&q=60&fit=crop&w=800&h=400',
    features: [
      'Basic password storage',
      'Up to 50 passwords',
      'Basic encryption',
      'Browser extension',
    ],
    buttonText: 'Get Started',
    color: 'purple',
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: 'per month',
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60&fit=crop&w=800&h=400', // Updated image URL
    features: [
      'Unlimited passwords',
      'Advanced encryption',
      'Priority support',
      'Secure password sharing',
      'Password health reports',
      'Two-factor authentication',
    ],
    buttonText: 'Upgrade to Pro',
    color: 'yellow',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$9.99',
    period: 'per user/month',
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    image: 'https://images.unsplash.com/photo-1560732488-6b0df240254a?w=800&auto=format&fit=crop&q=60&fit=crop&w=800&h=400',
    features: [
      'Everything in Pro',
      'Team management',
      'Admin console',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SSO integration',
    ],
    buttonText: 'Contact Sales',
    color: 'blue',
  },
];

const features = [
  {
    icon: <Lock className="h-6 w-6 text-purple-600" />,
    title: "Military-Grade Security",
    description: "AES-256 encryption ensures your passwords are unbreakable",
    animation: { rotate: 360, transition: { duration: 2, repeat: Infinity } }
  },
  {
    icon: <Fingerprint className="h-6 w-6 text-purple-600" />,
    title: "Biometric Authentication",
    description: "Secure access with your unique biometric data",
    animation: { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } }
  },
  {
    icon: <Users className="h-6 w-6 text-purple-600" />,
    title: "Team Collaboration",
    description: "Securely share passwords with team members",
    animation: { x: [-5, 5, -5], transition: { duration: 2, repeat: Infinity } }
  },
  {
    icon: <Cloud className="h-6 w-6 text-purple-600" />,
    title: "Cloud Sync",
    description: "Access your passwords from any device, anywhere",
    animation: { y: [-5, 5, -5], transition: { duration: 2, repeat: Infinity } }
  },
  {
    icon: <Clock className="h-6 w-6 text-purple-600" />,
    title: "Auto-Fill & Save",
    description: "Save time with automatic password filling",
    animation: { rotate: [-10, 10, -10], transition: { duration: 2, repeat: Infinity } }
  },
  {
    icon: <Globe className="h-6 w-6 text-purple-600" />,
    title: "Cross-Platform",
    description: "Available on all major browsers and devices",
    animation: { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } }
  }
];

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'easeInOut',
  },
};

export default function SubscriptionPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const handleSubscribe = (planName: string) => {
    // Here you would implement your subscription logic
    toast.success(`Selected ${planName} plan! Subscription feature coming soon.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full opacity-50"
        animate={floatingAnimation}
      />
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full opacity-50"
        animate={floatingAnimation}
        style={{ animationDelay: '1s' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full opacity-50"
        animate={floatingAnimation}
        style={{ animationDelay: '2s' }}
      />

      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Secure Your Digital Life with BioVault
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The most secure and user-friendly password manager with biometric authentication.
          Choose the perfect plan for your needs.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-8 mb-24 relative z-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative rounded-2xl bg-white p-8 shadow-lg flex flex-col
              ${plan.popular ? 'ring-2 ring-purple-600' : ''}
              cursor-pointer
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredPlan(plan.name)}
            onHoverEnd={() => setHoveredPlan(null)}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex-1">
              <motion.img
                src={plan.image}
                alt={`${plan.name} plan`}
                className="w-full h-48 object-cover rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            </div>
            <motion.button
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-6 px-4 rounded-xl font-medium text-lg transition-all
                transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2
                ${plan.popular 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.buttonText}
              {plan.name === 'Pro' && <Star className="h-5 w-5" />}
              {plan.name === 'Enterprise' && <Zap className="h-5 w-5" />}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <motion.div 
        className="mt-24 max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose BioVault?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4"
                animate={feature.animation}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-24 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of users who trust BioVault with their digital security
        </p>
        <button 
          onClick={() => handleSubscribe('Pro')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Try BioVault Pro Free for 14 Days
        </button>
      </motion.div>
    </div>
  );
}