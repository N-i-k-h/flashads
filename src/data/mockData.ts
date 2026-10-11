import { Screen, MediaAsset, Playlist } from '../types';

export const initialScreens: Screen[] = [
  {
    id: 'scr-1',
    name: 'Sainika Hospital',
    description: 'Main outpatient reception display and doctor schedule board',
    orientation: 'landscape',
    status: 'online',
    lastSeen: 'Just now',
    registeredDate: '12 Jan 2026',
    thumbnail: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    resolution: '1920 x 1080',
    assignedPlaylistId: 'pl-1',
    assignedPlaylistName: 'Hospital Announcements',
    defaultImageDuration: 10,
    operatingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  {
    id: 'scr-2',
    name: 'Jyothi Prakash',
    description: 'Entrance commercial screen and community announcements',
    orientation: 'portrait',
    status: 'online',
    lastSeen: '3 mins ago',
    registeredDate: '18 Feb 2026',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    resolution: '1080 x 1920',
    assignedPlaylistId: 'pl-2',
    assignedPlaylistName: 'Morning Broadcast Loop',
    defaultImageDuration: 10,
    operatingHours: {
      start: '07:00',
      end: '23:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  {
    id: 'scr-3',
    name: 'Krishna Bhavan',
    description: 'Dining hall dynamic menu card and daily lunch special screen',
    orientation: 'landscape',
    status: 'online',
    lastSeen: '5 mins ago',
    registeredDate: '04 Mar 2026',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    resolution: '1920 x 1080',
    assignedPlaylistId: 'pl-3',
    assignedPlaylistName: 'Dining Room Menu Loop',
    defaultImageDuration: 8,
    operatingHours: {
      start: '06:30',
      end: '23:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  {
    id: 'scr-4',
    name: 'Demonstration Screen',
    description: 'Test display for testing 4K media playback and new playlist sequencing',
    orientation: 'landscape',
    status: 'offline',
    lastSeen: '2 hours ago',
    registeredDate: '01 Jan 2026',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    resolution: '3840 x 2160',
    assignedPlaylistId: 'pl-4',
    assignedPlaylistName: 'Showcase Demo Reel',
    defaultImageDuration: 10,
    operatingHours: {
      start: '08:00',
      end: '20:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  }
];

export const initialMediaAssets: MediaAsset[] = [
  {
    id: 'med-1',
    filename: 'Special_Offers_Bhavan.jpg',
    title: 'Special Offers Bhavan',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 10,
    sizeBytes: 2400000,
    uploadDate: '08 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-2',
    filename: 'Doctor_Consultation_Hours.jpg',
    title: 'Doctor Consultation Hours',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 12,
    sizeBytes: 1950000,
    uploadDate: '07 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-3',
    filename: 'Morning_Coffee_Special.jpg',
    title: 'Morning Coffee Special',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    orientation: 'portrait',
    durationSeconds: 8,
    sizeBytes: 3100000,
    uploadDate: '06 Oct 2026',
    resolution: '1080 x 1920'
  },
  {
    id: 'med-4',
    filename: 'FlashAds_Intro_Promo.mp4',
    title: 'FlashAds Intro Promo',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-screens-41480-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 15,
    sizeBytes: 42000000,
    uploadDate: '05 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-5',
    filename: 'Health_Awareness_Tips.jpg',
    title: 'Health Awareness Tips',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 10,
    sizeBytes: 2800000,
    uploadDate: '04 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-6',
    filename: 'Evening_Dining_Specials.jpg',
    title: 'Evening Dining Specials',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 10,
    sizeBytes: 3400000,
    uploadDate: '03 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-7',
    filename: 'Brand_Store_Showcase.mp4',
    title: 'Brand Store Showcase',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-car-traveling-on-the-highway-at-night-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
    orientation: 'landscape',
    durationSeconds: 15,
    sizeBytes: 38000000,
    uploadDate: '02 Oct 2026',
    resolution: '1920 x 1080'
  },
  {
    id: 'med-8',
    filename: 'Fresh_Bakery_Morning.jpg',
    title: 'Fresh Bakery Morning',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    orientation: 'portrait',
    durationSeconds: 10,
    sizeBytes: 2900000,
    uploadDate: '01 Oct 2026',
    resolution: '1080 x 1920'
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Hospital Announcements',
    screenId: 'scr-1',
    updatedAt: '08 Oct 2026',
    totalDuration: 22,
    items: [
      {
        id: 'pli-1',
        mediaAssetId: 'med-2',
        filename: 'Doctor_Consultation_Hours.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 12,
        order: 1
      },
      {
        id: 'pli-2',
        mediaAssetId: 'med-5',
        filename: 'Health_Awareness_Tips.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 10,
        order: 2
      }
    ]
  },
  {
    id: 'pl-2',
    name: 'Morning Broadcast Loop',
    screenId: 'scr-2',
    updatedAt: '07 Oct 2026',
    totalDuration: 18,
    items: [
      {
        id: 'pli-3',
        mediaAssetId: 'med-3',
        filename: 'Morning_Coffee_Special.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
        orientation: 'portrait',
        durationSeconds: 8,
        order: 1
      },
      {
        id: 'pli-4',
        mediaAssetId: 'med-8',
        filename: 'Fresh_Bakery_Morning.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
        orientation: 'portrait',
        durationSeconds: 10,
        order: 2
      }
    ]
  },
  {
    id: 'pl-3',
    name: 'Dining Room Menu Loop',
    screenId: 'scr-3',
    updatedAt: '06 Oct 2026',
    totalDuration: 20,
    items: [
      {
        id: 'pli-5',
        mediaAssetId: 'med-1',
        filename: 'Special_Offers_Bhavan.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 10,
        order: 1
      },
      {
        id: 'pli-6',
        mediaAssetId: 'med-6',
        filename: 'Evening_Dining_Specials.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 10,
        order: 2
      }
    ]
  },
  {
    id: 'pl-4',
    name: 'Showcase Demo Reel',
    screenId: 'scr-4',
    updatedAt: '05 Oct 2026',
    totalDuration: 30,
    items: [
      {
        id: 'pli-7',
        mediaAssetId: 'med-4',
        filename: 'FlashAds_Intro_Promo.mp4',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-screens-41480-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 15,
        order: 1
      },
      {
        id: 'pli-8',
        mediaAssetId: 'med-7',
        filename: 'Brand_Store_Showcase.mp4',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-car-traveling-on-the-highway-at-night-42289-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
        orientation: 'landscape',
        durationSeconds: 15,
        order: 2
      }
    ]
  }
];

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Alexander Wright',
    email: 'alex@flashads.io',
    role: 'Administrator',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lastActive: 'Just now',
  }
];

