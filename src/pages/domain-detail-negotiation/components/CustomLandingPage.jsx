import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { cn } from 'utils/cn';
import { formatUnits } from 'viem';
import { DOCUMENT_HTML } from '../html/landingPage';

const PROJECT_ID = 'NAMENEST';

const getWebsiteKey = (env = 'STAGE') => PROJECT_ID + env;

const saveToSessionStorage = async (projectId, project) => {
  sessionStorage.setItem(projectId, JSON.stringify(project));
}

const loadFromSessionStorage = async (projectId) => {
  const projectString = sessionStorage.getItem(projectId);
  return projectString ? JSON.parse(projectString) : null;
}

const publishWebsite = async (editor, env) => {
  const files = await editor.runCommand('studio:projectFiles', { styles: 'inline' })
  // For simplicity, we'll "publish" only the first page.
  const firstPage = files.find(file => file.mimeType === 'text/html');
  const websiteData = {
    lastPublished: new Date().toLocaleString(),
    html: firstPage.content,
  };
  sessionStorage.setItem(getWebsiteKey(env), JSON.stringify(websiteData));
}

const viewPublishedWebsite = (editor, env) => {
  const websiteDataString = sessionStorage.getItem(getWebsiteKey(env));
  const websiteData = websiteDataString ? JSON.parse(websiteDataString) : null;
  const emptyStateText = 'Website not yet published! ' + (env === 'PROD' ? 'Click on the "rocket" icon to publish on PROD!' : 'Save a project to see it in STAGE');

  editor?.runCommand('studio:layoutToggle', {
    id: 'viewPublishedWebsite',
    header: false,
    placer: { type: 'dialog', size: 'l', title: 'Published website on ' + env },
    layout: {
      type: 'column',
      style: { minHeight: 600 },
      children: websiteData ? [
        'Last time published: ' + websiteData.lastPublished,
        {
          type: 'row',
          as: 'iframe',
          srcDoc: websiteData.html,
          style: { backgroundColor: 'white', height: 600 },
        }
      ] : emptyStateText,
    },
  });
}

const CustomLandingPage = ({ domainDetails }) => {
  return (
    <div 
      className={cn(
        "w-full h-full",
      )}
    >
      <StudioEditor
        options={{
        //   licenseKey: import.meta.env.VITE_GRAPESJS_LICENSE_KEY,
          project: {
            type: 'web',
          },
          dataSources: {
            blocks: true, // This enables the Data Source specific blocks
            globalData: { // Provide default globalData for the project
              domain: {
                price: `${domainDetails?.tokens[0]?.listings?.length > 0 ? formatUnits(domainDetails?.tokens[0]?.listings[0]?.price, domainDetails?.tokens[0]?.listings[0]?.currency?.decimals) : "Domain Not Listed Yet"} ${domainDetails?.tokens[0]?.listings?.length > 0 ? domainDetails?.tokens[0]?.listings[0]?.currency?.symbol : ""}`,
                chain: domainDetails?.tokens[0]?.chain?.name,
                ...domainDetails,
              },
            },
          },
          layout: {
            default: {
              type: 'column',
              style: { height: '100%' },
              children: [
                {
                  type: 'row',
                  style: { padding: 5, gap: 10, borderBottomWidth: '1px', justifyContent: 'center' },
                  children: [
                    {
                      type: 'button',
                      variant: 'outline',
                      label: 'View Website Stage',
                      onClick: ({ editor }) => viewPublishedWebsite(editor, 'STAGE'),
                    },
                    {
                      type: 'button',
                      variant: 'primary',
                      label: 'View Website Prod',
                      onClick: ({ editor }) => viewPublishedWebsite(editor, 'PROD'),
                    },
                  ]
                },
                {
                  type: 'row',
                  // style: { flexGrow: 1 },
                  children: [
                    {
                      type: 'canvasSidebarTop',
                      sidebarTop: {
                        leftContainer: {
                          buttons: ({ items }) => [
                            ...items,
                            {
                              type: 'button',
                              icon: '<svg viewBox="0 0 24 24"><path d="m13.13 22.19-1.63-3.83a21.05 21.05 0 0 0 4.4-2.27l-2.77 6.1M5.64 12.5l-3.83-1.63 6.1-2.77a21.05 21.05 0 0 0-2.27 4.4M21.61 2.39S16.66.27 11 5.93a19.82 19.82 0 0 0-4.35 6.71c-.28.75-.09 1.57.46 2.13l2.13 2.12c.55.56 1.37.74 2.12.46A19.1 19.1 0 0 0 18.07 13c5.66-5.66 3.54-10.61 3.54-10.61m-7.07 7.07a2 2 0 0 1 2.83-2.83 2 2 0 0 1-2.83 2.83m-5.66 7.07-1.41-1.41 1.41 1.41M6.24 22l3.64-3.64a3.06 3.06 0 0 1-.97-.45L4.83 22h1.41M2 22h1.41l4.77-4.76-1.42-1.41L2 20.59V22m0-2.83 4.09-4.08c-.21-.3-.36-.62-.45-.97L2 17.76v1.41Z"/></svg>',
                              tooltip: 'Publish website ',
                              onClick: ({ editor, event }) => {
                                const layoutId =  'publishWebsiteProd';
                                const rect = event.currentTarget.getBoundingClientRect();
                                editor.runCommand('studio:layoutToggle', {
                                  id: layoutId,
                                  header: false,
                                  placer: {
                                    type: 'popover',
                                    closeOnClickAway: true,
                                    x: rect.x, y: rect.y, w: rect.width, h: rect.height,
                                    options: { placement: 'bottom-start' }
                                  },
                                  style: { width: 200 },
                                  layout: {
                                    type: 'column',
                                    style: { padding: 10, gap: 10 },
                                    children: [
                                      'Click to publish on PROD',
                                      {
                                        type: 'button',
                                        variant: 'primary',
                                        label: 'Publish',
                                        full: true,
                                        onClick: async ({ editor }) => {
                                          await publishWebsite(editor, 'PROD');
                                          editor.runCommand('studio:layoutRemove', { id: layoutId });
                                        },
                                      },
                                    ]
                                  },
                                });
                              },
                            },
                          ]
                        }
                      }
                    },
                    { type: 'sidebarRight' },
                  ]
                }
              ],
            },
          },
          storage: {
            type: 'self',
            autosaveChanges: 5, // save after every 5 changes
          
            onSave: async ({ project, editor }) => {
              await saveToSessionStorage(PROJECT_ID, project);
              // With every save, we'll publish the website to STAGE
              await publishWebsite(editor, 'STAGE');
              console.log('Project saved and publised to STAGE', { project });
            },
          
            onLoad: async () => {
              const project = await loadFromSessionStorage(PROJECT_ID);
              console.log('Project loaded', { project });
              return {
                project: project || {
                  pages: [
                    {
                      name: 'Home',
                      component: DOCUMENT_HTML,
                    },
                  ]
                }
              };
            },
          }
        }}
      />
    </div>
  )
}

export default CustomLandingPage;