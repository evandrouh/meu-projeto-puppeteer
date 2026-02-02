export const IDENTIFIERS = {
  USER_INFO: {
    USERNAME: '[data-e2e="user-title"]',
    VERIFIED: 'svg[data-e2e="verify-icon"]',
    FULLNAME: '[data-e2e="user-subtitle"]',
    AVATAR: 'img[data-e2e="user-avatar"]',
    BIO: '[data-e2e="user-bio"]',
    EXTERNAL_URL: '[data-e2e="user-link"]'
  },
  STATS: {
    FOLLOWING: '[data-e2e="following-count"]',
    FOLLOWERS: '[data-e2e="followers-count"]',
    LIKES: '[data-e2e="likes-count"]'
  },
  VIDEO: {
    CONTAINER: '[data-e2e="user-post-item"]',
    LINK: '[data-e2e="user-post-item"] a',
    THUMBNAIL: '[data-e2e="user-post-item-cover"]',
    DESCRIPTION: '[data-e2e="user-post-item-desc"]',
    VIEWS: '[data-e2e="video-views"]',
    PINNED: '[data-e2e="pin-icon"]'
  }
};

export const SELECTORS = {
  WAIT_FOR_USER_PAGE: '[data-e2e="user-page"]',
  WAIT_FOR_USER_INFO: '[data-e2e="user-title"]',
  WAIT_FOR_VIDEOS: '[data-e2e="user-post-item"]'
};
