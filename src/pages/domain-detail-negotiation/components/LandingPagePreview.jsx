import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import CustomLandingPage from './CustomLandingPage';

const LandingPagePreview = ({ domain }) => {
  const [viewMode, setViewMode] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewUrl = `https://${domain?.name}`;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <h3 className="text-lg font-semibold text-foreground">Landing Page Preview</h3>
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-background rounded-md p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setViewMode('desktop')}
            >
              <Icon name="Monitor" size={16} />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setViewMode('tablet')}
            >
              <Icon name="Tablet" size={16} />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setViewMode('mobile')}
            >
              <Icon name="Smartphone" size={16} />
            </Button>
          </div>
          
          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(previewUrl, '_blank')}
          >
            <Icon name="ExternalLink" size={16} />
          </Button>
        </div>
      </div>
      {/* Preview Container */}
      <div className={`relative bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-center p-8">
          <div
            className={`bg-white border border-border rounded-lg shadow-elevated overflow-hidden transition-all duration-300 ${
              viewMode === 'desktop' ?'w-full max-w-6xl h-full' 
                : viewMode === 'tablet' ?'w-96 h-80' :'w-80 h-96'
            } ${isFullscreen ? 'w-full h-full max-w-none' : ''}`}
          >
            <CustomLandingPage domainDetails={domain} />
          </div>
        </div>

        {/* Preview Info */}
        {!isFullscreen && (
          <div className="px-4 pb-4 hidden">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Last updated: {domain?.landingPage?.lastUpdated}</span>
                <span>•</span>
                <span>SEO Score: {domain?.landingPage?.seoScore}/100</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Eye" size={14} />
                <span>{domain?.landingPage?.views} views</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* SEO Metrics */}
      {!isFullscreen && (
        <div className="p-4 hidden border-t border-border bg-muted/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{domain?.landingPage?.pageSpeed}</div>
              <div className="text-xs text-muted-foreground">Page Speed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{domain?.landingPage?.mobileScore}</div>
              <div className="text-xs text-muted-foreground">Mobile Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{domain?.landingPage?.accessibility}</div>
              <div className="text-xs text-muted-foreground">Accessibility</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{domain?.landingPage?.bestPractices}</div>
              <div className="text-xs text-muted-foreground">Best Practices</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPagePreview;