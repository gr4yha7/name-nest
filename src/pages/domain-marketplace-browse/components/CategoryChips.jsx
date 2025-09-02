import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryChips = ({ categories, activeCategories, onCategoryToggle }) => {
  const handleCategoryClick = (category) => {
    onCategoryToggle(category);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Filter" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Quick Filters</span>
        {activeCategories?.length > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {activeCategories?.length}
          </span>
        )}
      </div>
      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        {categories?.map((category) => {
          const isActive = activeCategories?.includes(category?.value);
          return (
            <button
              key={category?.value}
              onClick={() => handleCategoryClick(category?.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-standard ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <Icon name={category?.icon} size={14} />
              <span>{category?.label}</span>
              {category?.count && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-background text-muted-foreground'
                }`}>
                  {category?.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;