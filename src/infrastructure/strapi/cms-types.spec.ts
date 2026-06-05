import type {
  CmsAbout,
  CmsArticle,
  CmsArticleList,
  CmsAuthor,
  CmsAuthorList,
  CmsBlocks,
  CmsCategory,
  CmsCategoryList,
  CmsFaq,
  CmsFaqList,
  CmsGlobal,
  CmsMedia,
  CmsNavigation,
  CmsNavigationItem,
  CmsNavigationItemList,
  CmsNavigationList,
  CmsPage,
  CmsPageList,
  CmsProduct,
  CmsProductList,
  CmsPromotion,
  CmsPromotionList,
  CmsSeo,
} from './cms-types';

const generatedId = {};
const publishedAt = '2026-06-05T00:00:00.000Z';

const mediaFixture = {
  documentId: 'media-document-id',
  id: generatedId,
  name: 'Cover image',
  hash: 'cover_hash',
  mime: 'image/png',
  size: 1,
  url: '/uploads/cover.png',
  provider: 'local',
  publishedAt,
  related: null,
} satisfies CmsMedia;

const seoFixture = {
  metaTitle: 'SEO title',
  metaDescription: 'SEO description',
  shareImage: mediaFixture,
} satisfies CmsSeo;

const blocksFixture = [] satisfies CmsBlocks;

const aboutFixture = {
  documentId: 'about-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsAbout;

const globalFixture = {
  documentId: 'global-document-id',
  id: generatedId,
  siteName: 'TPB',
  siteDescription: 'TPB website',
  analytics_script: blocksFixture,
  publishedAt,
  defaultSeo: seoFixture,
} satisfies CmsGlobal;

const articleFixture = {
  documentId: 'article-document-id',
  id: generatedId,
  content: blocksFixture,
  publishedAt,
  cover: mediaFixture,
  seo: seoFixture,
} satisfies CmsArticle;

const authorFixture = {
  documentId: 'author-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsAuthor;

const categoryFixture = {
  documentId: 'category-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsCategory;

const faqFixture = {
  documentId: 'faq-document-id',
  id: generatedId,
  answer: blocksFixture,
  publishedAt,
} satisfies CmsFaq;

const navigationFixture = {
  documentId: 'navigation-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsNavigation;

const navigationItemFixture = {
  documentId: 'navigation-item-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsNavigationItem;

const pageFixture = {
  documentId: 'page-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsPage;

const productFixture = {
  documentId: 'product-document-id',
  id: generatedId,
  publishedAt,
} satisfies CmsProduct;

const promotionFixture = {
  documentId: 'promotion-document-id',
  id: generatedId,
  content: blocksFixture,
  publishedAt,
} satisfies CmsPromotion;

const articleListFixture = { data: [] } satisfies CmsArticleList;
const authorListFixture = { data: [] } satisfies CmsAuthorList;
const categoryListFixture = { data: [] } satisfies CmsCategoryList;
const faqListFixture = { data: [] } satisfies CmsFaqList;
const navigationListFixture = { data: [] } satisfies CmsNavigationList;
const navigationItemListFixture = { data: [] } satisfies CmsNavigationItemList;
const pageListFixture = { data: [] } satisfies CmsPageList;
const productListFixture = { data: [] } satisfies CmsProductList;
const promotionListFixture = { data: [] } satisfies CmsPromotionList;

describe('CMS type facade', () => {
  describe('mediaFixture', () => {
    it('should have correct url', () => {
      expect(mediaFixture.url).toBe('/uploads/cover.png');
    });
    it('should have correct mime type', () => {
      expect(mediaFixture.mime).toBe('image/png');
    });
    it('should have correct name', () => {
      expect(mediaFixture.name).toBe('Cover image');
    });
    it('should have correct provider', () => {
      expect(mediaFixture.provider).toBe('local');
    });
  });

  describe('seoFixture', () => {
    it('should have correct metaTitle', () => {
      expect(seoFixture.metaTitle).toBe('SEO title');
    });
    it('should have correct metaDescription', () => {
      expect(seoFixture.metaDescription).toBe('SEO description');
    });
    it('should reference mediaFixture as shareImage', () => {
      expect(seoFixture.shareImage).toBe(mediaFixture);
    });
  });

  describe('aboutFixture', () => {
    it('should have correct documentId', () => {
      expect(aboutFixture.documentId).toBe('about-document-id');
    });
  });

  describe('globalFixture', () => {
    it('should have correct documentId', () => {
      expect(globalFixture.documentId).toBe('global-document-id');
    });
    it('should have correct siteName', () => {
      expect(globalFixture.siteName).toBe('TPB');
    });
    it('should have correct siteDescription', () => {
      expect(globalFixture.siteDescription).toBe('TPB website');
    });
    it('should have defaultSeo with shareImage', () => {
      expect(globalFixture.defaultSeo.shareImage).toBe(mediaFixture);
    });
  });

  describe('articleFixture', () => {
    it('should have correct documentId', () => {
      expect(articleFixture.documentId).toBe('article-document-id');
    });
    it('should reference mediaFixture as cover', () => {
      expect(articleFixture.cover).toBe(mediaFixture);
    });
    it('should reference seoFixture', () => {
      expect(articleFixture.seo).toBe(seoFixture);
    });
  });

  describe('authorFixture', () => {
    it('should have correct documentId', () => {
      expect(authorFixture.documentId).toBe('author-document-id');
    });
  });

  describe('categoryFixture', () => {
    it('should have correct documentId', () => {
      expect(categoryFixture.documentId).toBe('category-document-id');
    });
  });

  describe('faqFixture', () => {
    it('should have correct documentId', () => {
      expect(faqFixture.documentId).toBe('faq-document-id');
    });
  });

  describe('navigationFixture', () => {
    it('should have correct documentId', () => {
      expect(navigationFixture.documentId).toBe('navigation-document-id');
    });
  });

  describe('navigationItemFixture', () => {
    it('should have correct documentId', () => {
      expect(navigationItemFixture.documentId).toBe('navigation-item-document-id');
    });
  });

  describe('pageFixture', () => {
    it('should have correct documentId', () => {
      expect(pageFixture.documentId).toBe('page-document-id');
    });
  });

  describe('productFixture', () => {
    it('should have correct documentId', () => {
      expect(productFixture.documentId).toBe('product-document-id');
    });
  });

  describe('promotionFixture', () => {
    it('should have correct documentId', () => {
      expect(promotionFixture.documentId).toBe('promotion-document-id');
    });
  });

  describe('list fixtures', () => {
    it('articleListFixture should have data array', () => {
      expect(articleListFixture.data).toEqual([]);
    });
    it('authorListFixture should have data array', () => {
      expect(authorListFixture.data).toEqual([]);
    });
    it('categoryListFixture should have data array', () => {
      expect(categoryListFixture.data).toEqual([]);
    });
    it('faqListFixture should have data array', () => {
      expect(faqListFixture.data).toEqual([]);
    });
    it('navigationListFixture should have data array', () => {
      expect(navigationListFixture.data).toEqual([]);
    });
    it('navigationItemListFixture should have data array', () => {
      expect(navigationItemListFixture.data).toEqual([]);
    });
    it('pageListFixture should have data array', () => {
      expect(pageListFixture.data).toEqual([]);
    });
    it('productListFixture should have data array', () => {
      expect(productListFixture.data).toEqual([]);
    });
    it('promotionListFixture should have data array', () => {
      expect(promotionListFixture.data).toEqual([]);
    });
  });
});
