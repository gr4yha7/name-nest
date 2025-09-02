import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DomainCard from './DomainCard';

const FeaturedCarousel = ({ domains, onFavorite, onPreview, onContact }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const getItemsPerView = () => {
    if (window.innerWidth >= 1024) return itemsPerView?.desktop;
    if (window.innerWidth >= 768) return itemsPerView?.tablet;
    return itemsPerView?.mobile;
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, domains?.length - currentItemsPerView);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [domains?.length, currentItemsPerView, isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, domains?.length - currentItemsPerView);
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, domains?.length - currentItemsPerView);
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const maxIndex = Math.max(0, domains?.length - currentItemsPerView);

  if (!domains || domains?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Domains</h2>
          <p className="text-muted-foreground mt-1">
            Premium domains handpicked by our experts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="hidden sm:flex"
          >
            <Icon name={isAutoPlaying ? "Pause" : "Play"} size={16} />
          </Button>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`,
            width: `${(domains?.length / currentItemsPerView) * 100}%`
          }}
        >
          {domains?.map((domain) => (
            <div
              key={domain?.id}
              className="px-2"
              style={{ width: `${100 / domains?.length}%` }}
            >
              <div className="h-full">
                <DomainCard
                  domain={domain}
                  onFavorite={onFavorite}
                  onPreview={onPreview}
                  onContact={onContact}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Indicators */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-standard ${
              index === currentIndex
                ? 'bg-primary' :'bg-muted-foreground hover:bg-muted-foreground/70'
            }`}
          />
        ))}
      </div>
      {/* Stats */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={16} className="text-warning" />
          <span>Premium Quality</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span>Verified Sellers</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span>Fast Transfer</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;