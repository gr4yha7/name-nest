import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const routeMap = {
    '/domain-marketplace-browse': 'Marketplace',
    '/domain-listing-creation': 'Sell Domain',
    '/domain-detail-negotiation': 'Domain Details',
    '/real-time-messaging-center': 'Messages',
    '/transaction-order-management': 'Orders',
    '/analytics-performance-dashboard': 'Analytics'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeMap?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path} className="flex items-center">
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="mx-2 text-muted-foreground" />
            )}
            {item?.isLast ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item?.label}
              </span>
            ) : (
              <a
                href={item?.path}
                className="hover:text-foreground transition-standard"
              >
                {item?.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;