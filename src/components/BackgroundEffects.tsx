import React, { useEffect } from 'react';

const BackgroundEffects: React.FC = () => {
  useEffect(() => {
    const createParticles = () => {
      const container = document.body;
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.width = `${Math.random() * 30 + 10}px`;
        particle.style.height = particle.style.width;
        container.appendChild(particle);
      }
    };

    createParticles();

    return () => {
      const particles = document.querySelectorAll('.floating-particle');
      particles.forEach(p => p.remove());
    };
  }, []);

  return null;
};

export default BackgroundEffects;
