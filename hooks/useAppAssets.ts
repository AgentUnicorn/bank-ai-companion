

import { useState, useEffect } from 'react';

// --- CONFIGURATION ---
// Set to true to fetch assets and create local blob URLs.
// Set to false to use direct paths, which may be better for caching but can cause flashes of unstyled content on first load.
const USE_BLOB_FOR_IMAGES = true;

const imagePaths = {
    G: 'img/G.png',
    G_avatar: 'img/G_avatar.png',
    user_avatar: 'img/user_avatar.png',
    user_avatar_full: 'img/user_avatar_full.png',
    bg_interactivepanel: 'img/bg_interactivepanel.png',
    bg_info: 'img/bg_info.png',
    bg_interactivepanel_live_chat: 'img/bg_interactive_panel_live_chat.png',
};

export const useAppAssets = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const urlsToRevoke: string[] = [];
    
    const loadAssets = async () => {
        if (USE_BLOB_FOR_IMAGES) {
            // --- Blob-based loading ---
            try {
                const loadedUrls: Record<string, string> = {};
                const promises = Object.entries(imagePaths).map(async ([key, path]) => {
                    const response = await fetch(path);
                    if (!response.ok) {
                        console.warn(`Failed to fetch image: ${path}`);
                        return; 
                    }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    loadedUrls[key] = url;
                    urlsToRevoke.push(url);
                });

                await Promise.all(promises);
                setImageUrls(loadedUrls);
            } catch (error) {
                console.error("Error loading images, using direct paths as fallback:", error);
                setImageUrls(imagePaths); // Fallback to direct paths
            }
        } else {
            // --- Direct path loading ---
            setImageUrls(imagePaths);
        }
    };

    loadAssets();

    return () => {
        if (USE_BLOB_FOR_IMAGES) {
            urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
        }
    };
  }, []);

  return imageUrls;
};