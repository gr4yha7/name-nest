import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const LandingPageBuilder = ({ onNext, onPrev, formData, setFormData }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(false);

  const componentLibrary = [
    {
      id: 'hero',
      name: 'Hero Section',
      icon: 'Layout',
      description: 'Eye-catching header with domain name and key selling points'
    },
    {
      id: 'features',
      name: 'Feature List',
      icon: 'List',
      description: 'Highlight domain benefits and unique characteristics'
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: 'MessageSquare',
      description: 'Social proof from previous buyers or industry experts'
    },
    {
      id: 'contact',
      name: 'Contact Form',
      icon: 'Mail',
      description: 'Lead capture form for interested buyers'
    },
    {
      id: 'stats',
      name: 'Statistics',
      icon: 'BarChart3',
      description: 'Domain metrics, traffic data, and performance stats'
    },
    {
      id: 'gallery',
      name: 'Image Gallery',
      icon: 'Image',
      description: 'Visual showcase of domain potential or related content'
    }
  ];

  const templates = [
    { value: 'minimal', label: 'Minimal Clean', description: 'Simple, professional layout' },
    { value: 'modern', label: 'Modern Business', description: 'Contemporary design with bold elements' },
    { value: 'creative', label: 'Creative Portfolio', description: 'Artistic layout with visual focus' },
    { value: 'corporate', label: 'Corporate Professional', description: 'Traditional business appearance' }
  ];

  const handleComponentAdd = (component) => {
    const newComponents = [...(formData?.landingPageComponents || []), {
      id: Date.now(),
      type: component?.id,
      name: component?.name,
      settings: getDefaultSettings(component?.id)
    }];
    setFormData(prev => ({ ...prev, landingPageComponents: newComponents }));
  };

  const handleComponentRemove = (componentId) => {
    const updatedComponents = formData?.landingPageComponents?.filter(comp => comp?.id !== componentId) || [];
    setFormData(prev => ({ ...prev, landingPageComponents: updatedComponents }));
  };

  const handleComponentEdit = (componentId) => {
    setSelectedComponent(componentId);
  };

  const getDefaultSettings = (type) => {
    const defaults = {
      hero: {
        title: formData?.domain || 'Premium Domain',
        subtitle: 'Perfect for your next big project',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
      },
      features: {
        items: [
          'Memorable and brandable',
          'SEO-friendly domain name',
          'Instant credibility boost',
          'Perfect for marketing campaigns'
        ]
      },
      testimonials: {
        items: [
          {
            text: 'This domain perfectly represents our brand vision.',
            author: 'Sarah Johnson',
            company: 'Tech Startup CEO'
          }
        ]
      },
      contact: {
        title: 'Interested in this domain?',
        fields: ['name', 'email', 'message']
      },
      stats: {
        metrics: [
          { label: 'Domain Age', value: '5+ years' },
          { label: 'Monthly Searches', value: '10K+' },
          { label: 'Brand Score', value: '95/100' }
        ]
      },
      gallery: {
        images: [
          'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=300&fit=crop',
          'https://images.pixabay.com/photo/2016/11/29/06/18/home-office-1867761_960_720.jpg?w=400&h=300&fit=crop'
        ]
      }
    };
    return defaults?.[type] || {};
  };

  const handleTemplateChange = (template) => {
    setFormData(prev => ({ ...prev, landingPageTemplate: template }));
  };

  const renderComponentPreview = (component) => {
    switch (component?.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{component?.settings?.title}</h1>
            <p className="opacity-90">{component?.settings?.subtitle}</p>
          </div>
        );
      case 'features':
        return (
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {component?.settings?.items?.slice(0, 2)?.map((item, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Icon name="Check" size={16} className="text-success mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'contact':
        return (
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">{component?.settings?.title}</h3>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">{component?.name} Component</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Landing Page</h2>
        <p className="text-muted-foreground">
          Create a compelling landing page to showcase your domain
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Component Library */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Template</h3>
            <Select
              placeholder="Choose a template"
              options={templates}
              value={formData?.landingPageTemplate || ''}
              onChange={handleTemplateChange}
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-4">Components</h3>
            <div className="space-y-2">
              {componentLibrary?.map((component) => (
                <div
                  key={component?.id}
                  className="p-3 border border-border rounded-lg hover:bg-muted transition-standard cursor-pointer"
                  onClick={() => handleComponentAdd(component)}
                >
                  <div className="flex items-center mb-2">
                    <Icon name={component?.icon} size={16} className="mr-2 text-primary" />
                    <span className="font-medium text-sm">{component?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{component?.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Builder */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg">
            {/* Builder Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold">Page Builder</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Icon name="Smartphone" size={16} />
                  </Button>
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Icon name="Monitor" size={16} />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                iconName="Eye"
                iconPosition="left"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>

            {/* Builder Content */}
            <div className="p-4">
              {formData?.landingPageComponents?.length > 0 ? (
                <div className={`space-y-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  {formData?.landingPageComponents?.map((component) => (
                    <div key={component?.id} className="group relative">
                      {showPreview ? (
                        renderComponentPreview(component)
                      ) : (
                        <div className="border-2 border-dashed border-border p-4 rounded-lg hover:border-primary transition-standard">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon name="GripVertical" size={16} className="text-muted-foreground mr-2" />
                              <span className="font-medium">{component?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-standard">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComponentEdit(component?.id)}
                                iconName="Edit"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComponentRemove(component?.id)}
                                iconName="Trash2"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Layout" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Start Building</h3>
                  <p className="text-muted-foreground mb-4">
                    Add components from the library to create your landing page
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleComponentAdd(componentLibrary?.[0])}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Hero Section
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Verification
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          disabled={!formData?.landingPageComponents?.length}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to SEO Setup
        </Button>
      </div>
    </div>
  );
};

export default LandingPageBuilder;