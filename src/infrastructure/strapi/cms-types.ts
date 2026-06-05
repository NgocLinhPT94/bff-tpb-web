import type { AboutGetAbout200ResponseData } from './generated/StrapiAbout';
import type {
  ArticleGetArticles200Response,
  ArticleGetArticles200ResponseDataInnerAuthorArticlesInnerCategoryFaqsInnerProductsInnerPromotionsInnerSeoInner,
  ArticleGetArticles200ResponseDataInnerCover,
  ArticleGetArticlesById200ResponseData,
} from './generated/StrapiArticle';
import type {
  AuthorGetAuthors200Response,
  AuthorGetAuthorsById200ResponseData,
} from './generated/StrapiAuthor';
import type {
  CategoryGetCategories200Response,
  CategoryGetCategoriesById200ResponseData,
} from './generated/StrapiCategory';
import type {
  FaqGetFaqs200Response,
  FaqGetFaqsById200ResponseData,
} from './generated/StrapiFaq';
import type { GlobalGetGlobal200ResponseData } from './generated/StrapiGlobal';
import type {
  NavigationGetNavigations200Response,
  NavigationGetNavigationsById200ResponseData,
} from './generated/StrapiNavigation';
import type {
  NavigationItemGetNavigationItems200Response,
  NavigationItemGetNavigationItemsById200ResponseData,
} from './generated/StrapiNavigation';
import type {
  PageGetPages200Response,
  PageGetPagesById200ResponseData,
} from './generated/StrapiPage';
import type {
  ProductGetProducts200Response,
  ProductGetProductsById200ResponseData,
} from './generated/StrapiProduct';
import type {
  PromotionGetPromotions200Response,
  PromotionGetPromotionsById200ResponseData,
} from './generated/StrapiPromotion';

/** CMS About singleton entity returned by Strapi. */
export type CmsAbout = AboutGetAbout200ResponseData;

/** CMS Global singleton entity returned by Strapi. */
export type CmsGlobal = GlobalGetGlobal200ResponseData;

/** CMS Article detail entity with the full article shape. */
export type CmsArticle = ArticleGetArticlesById200ResponseData;

/** CMS Author detail entity. */
export type CmsAuthor = AuthorGetAuthorsById200ResponseData;

/** CMS Category detail entity. */
export type CmsCategory = CategoryGetCategoriesById200ResponseData;

/** CMS FAQ detail entity. */
export type CmsFaq = FaqGetFaqsById200ResponseData;

/** CMS Navigation detail entity. */
export type CmsNavigation = NavigationGetNavigationsById200ResponseData;

/** CMS Navigation Item detail entity. */
export type CmsNavigationItem =
  NavigationItemGetNavigationItemsById200ResponseData;

/** CMS Page detail entity. */
export type CmsPage = PageGetPagesById200ResponseData;

/** CMS Product detail entity. */
export type CmsProduct = ProductGetProductsById200ResponseData;

/** CMS Promotion detail entity. */
export type CmsPromotion = PromotionGetPromotionsById200ResponseData;

/** CMS Article list response wrapper. */
export type CmsArticleList = ArticleGetArticles200Response;

/** CMS Author list response wrapper. */
export type CmsAuthorList = AuthorGetAuthors200Response;

/** CMS Category list response wrapper. */
export type CmsCategoryList = CategoryGetCategories200Response;

/** CMS FAQ list response wrapper. */
export type CmsFaqList = FaqGetFaqs200Response;

/** CMS Navigation list response wrapper. */
export type CmsNavigationList = NavigationGetNavigations200Response;

/** CMS Navigation Item list response wrapper. */
export type CmsNavigationItemList = NavigationItemGetNavigationItems200Response;

/** CMS Page list response wrapper. */
export type CmsPageList = PageGetPages200Response;

/** CMS Product list response wrapper. */
export type CmsProductList = ProductGetProducts200Response;

/** CMS Promotion list response wrapper. */
export type CmsPromotionList = PromotionGetPromotions200Response;

/** CMS media asset used by mapped image and file fields. */
export type CmsMedia = ArticleGetArticles200ResponseDataInnerCover;

/** CMS SEO metadata block shared across mapped entities. */
export type CmsSeo =
  ArticleGetArticles200ResponseDataInnerAuthorArticlesInnerCategoryFaqsInnerProductsInnerPromotionsInnerSeoInner;

/** CMS dynamic zone blocks; generated schemas currently expose these as untyped arrays. */
export type CmsBlocks = Array<unknown>;
