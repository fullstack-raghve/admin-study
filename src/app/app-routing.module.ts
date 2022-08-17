import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './services/AuthGuard';
import { permissionGuard } from './services/permissionGuard';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            {
                path: 'login',
                loadChildren: './modules/auth/login/login.module#LoginModule'
            },
            {
                path: 'reset/password',
                loadChildren: './modules/auth/change-password/change-password.module#Change_passwordModule'
            }
        ]
    },
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            
            {
                path: 'clientOnBoarding',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/clientOnBoarding/clientOnBoarding.module#clientOnBoardingModule',
            },

            //master country
            {
                path: 'search-country',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/country/country/search-country/searchCountry.module#SearchCountryModule',
            },
            {
                path: 'add-country',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/country/country/add-country/addCountry.module#AddCountryModule',
            },
            {
                path: 'edit-country',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/country/country/edit-country/edit-country.module#EditCountryModule',
            },
            {
                path: 'view-country',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/country/country/view-country/view-country.module#ViewCountryModule',
            },

            {
                path: 'search-currency',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/currency/currency/search-currency/search-currency.module#SearchCurrencyModule',
            },
            // User Management
            {
                path: 'add-user',
                canActivate: [permissionGuard],
                loadChildren: './modules/userManagement/add-user/add-user.module#AddUserModule'
            },
            {
                path: 'edit-user',
                canActivate: [permissionGuard],
                loadChildren: './modules/userManagement/edit-user/edit-user.module#EditUserModule'
            },
            {
                path: 'view-user',
                canActivate: [permissionGuard],
                loadChildren: './modules/userManagement/view-user/view-user.module#ViewUserModule'
            },
            {
                path: 'search-user',
                canActivate: [permissionGuard],
                loadChildren: './modules/userManagement/search-user/search-user.module#SearchUserModule'
            },
            {
                path: 'create-role',
                canActivate: [permissionGuard],
                // tslint:disable-next-line:max-line-length
                loadChildren: './modules/userManagement/roles-permission/create-roles-permission/create-roles-permission.module#CreateRolesPermissionModule',
            },
            {
                path: 'edit-role',
                canActivate: [permissionGuard],
                // tslint:disable-next-line:max-line-length
                loadChildren: './modules/userManagement/roles-permission/edit-roles-permission/edit-roles-permission.module#EditRolesPermissionModule',
            },
            {
                path: 'view-role',
                canActivate: [permissionGuard],
                // tslint:disable-next-line:max-line-length
                loadChildren: './modules/userManagement/roles-permission/view-roles-permission/view-roles-permission.module#ViewRolesPermissionModule',
            },
            {
                path: 'search-role',
                canActivate: [permissionGuard],
                // tslint:disable-next-line:max-line-length
                loadChildren: './modules/userManagement/roles-permission/search-roles-permission/search-roles-permission.module#SearchRolesPermissionModule',
            },
            // master currency
            {
                path: 'add-currency',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/currency/currency/add-currency/add-currency.module#AddCurrencyModule',
            },
            {
                path: 'view-currency',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/currency/currency/view-currency/view-currency.module#ViewCurrencyModule',
            },
            {
                path: 'edit-currency',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/currency/currency/edit-currency/edit-currency.module#EditCurrencyModule',
            },
            //master brands
            {
                path: 'search-brands',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brands/brands/search-brands/search-brands.module#SearchBrandsModule',
            },
            {
                path: 'add-brands',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brands/brands/add-brands/add-brands.module#AddBrandsModule',
            },
            {
                path: 'edit-brands/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brands/brands/edit-brands/edit-brands.module#EditBrandsModule',
            },
            {
                path: 'view-brands/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brands/brands/view-brands/view-brands.module#ViewBrandsModule',
            },
            //master-malls
            {
                path: 'search-malls',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/malls/malls/search-malls/search-malls.module#SearchMallsModule',
            },
            {
                path: 'add-malls',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/malls/malls/add-malls/add-malls.module#AddMallsModule',
            },
            {
                path: 'view-malls',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/malls/malls/view-malls/view-malls.module#ViewMallsModule',
            },
            {
                path: 'edit-malls',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/malls/malls/edit-malls/edit-malls.module#EditMallsModule',
            },
            //master language
            {
                path: 'search-language',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/language/search-language/search-language.module#SearchLanguageModule',
            },
            {
                path: 'add-language',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/language/add-language/add-language.module#AddLanguageModule',
            },
            {
                path: 'edit-language',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/language/edit-language/edit-language.module#EditLanguageModule',
            },
            {
                path: 'view-language',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/language/view-language/view-language.module#ViewLanguageModule',
            },
            // master brand-category
            {
                path: 'search-brand-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brand-category/search-brand-category/search-brand-category.module#SearchBrandCategoryModule',
            },
            {
                path: 'add-brand-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brand-category/add-brand-category/add-brand-category.module#AddBrandCategoryModule',
            },
            {
                path: 'view-brand-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brand-category/view-brand-category/view-brand-category.module#ViewBrandCategoryModule',
            },
            {
                path: 'edit-brand-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/brand-category/edit-brand-category/edit-brand-category.module#EditBrandCategoryModule',
            },
            // master cities
            {
                path: 'search-cities',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/cities/search-cities/search-cities.module#SearchCitiesModule',
            },
            {
                path: 'add-cities',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/cities/add-cities/add-cities.module#AddCitiesModule',
            },
            {
                path: 'edit-cities',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/cities/edit-cities/edit-cities.module#EditCitiesModule',
            },
            {
                path: 'view-cities',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/cities/view-cities/view-cities.module#ViewCitiesModule',
            },
            // master about us category
            {
                path: 'search-about-us-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/about-us-category/search-about-us-category/search-about-us-category.module#SearchAboutUsCategoryModule',
            },
            {
                path: 'add-about-us-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/about-us-category/add-about-us-category/add-about-us-category.module#AddAboutUsCategoryModule',
            },
            {
                path: 'edit-about-us-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/about-us-category/edit-about-us-category/edit-about-us-category.module#EditAboutUsCategoryModule',
            },
            {
                path: 'view-about-us-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/about-us-category/view-about-us-category/view-about-us-category.module#ViewAboutUsCategoryModule',
            },
            // master currency conversion
            {
                path: 'search-currency-conversion',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/currency-conversion/search-currency-conversion/search-currency-conversion.module#SearchCurrencyConversionModule',
            },
            {
                path: 'add-currency-conversion',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/currency-conversion/add-currency-conversion/add-currency-conversion.module#AddCurrencyConversionModule',
            },
            {
                path: 'view-currency-conversion',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/currency-conversion/view-currency-conversion/view-currency-conversion.module#ViewCurrencyConversionModule',
            },
            {
                path: 'edit-currency-conversion',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/currency-conversion/edit-currency-conversion/edit-currency-conversion.module#EditCurrencyConversionModule',
            },
            // master faq conversion
            {
                path: 'search-faq-category',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/faq-category/search-faq-category/search-faq-category.module#SearchFaqCategoryModule',
            },
            {
                path: 'add-faq-category',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/faq-category/add-faq-category/add-faq-category.module#AddFaqCategoryModule',
            },
            {
                path: 'edit-faq-category',

                loadChildren: './modules/configurations/masters/faq-category/edit-faq-category/edit-faq-category.module#EditFaqCategoryModule',
            },
            {
                path: 'view-faq-category',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/masters/faq-category/view-faq-category/view-faq-category.module#ViewFaqCategoryModule',
            },
            //client on boarding
            {
                path: 'add-client-on-boarding',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/client-OnBoarding/add-client-on-boarding/add-client-on-boarding.module#AddClientOnBoardingModule',
            },
            {
                path: 'view-client-on-boarding',
                //canActivate:[permissionGuard],
                loadChildren: './modules/configurations/client-OnBoarding/view-client-on-boarding/view-client-on-boarding.module#ViewClientOnBoardingModule',
            },
            {
                path: 'edit-client-on-boarding',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/client-OnBoarding/edit-client-on-boarding/edit-client-on-boarding.module#EditClientOnBoardingModule',
            },

            //Delivery Charges

            {
                path: 'delivery-charges',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/delivery-charges/delivery-charges/delivery-charges.module#DeliveryChargesModule',
            },

            // Brand Management

            {
                path: 'search-brand-management',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/search-brand-management/search-brand-management.module#BrandsModule',
            },
            {
                path: 'add-brands-management',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/add-brands-management/add-brands-management.module#AddBrandsModule',
            },
            {
                path: 'view-brand-management',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/view-brand-management/view-brand-management.module#ViewBrandModule',
            },
            {
                path: 'edit-brand-management',
                //    canActivate:[permissionGuard],
                loadChildren: './modules/configurations/brand-management/edit-brand-management/edit-brand-management.module#EditBrandModule',
            },
            {
                path: 'add-product',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/add-product/add-product.module#AddProductModule',
            },
            {
                path: 'view-product',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/view-product/view-product.module#ViewProductDetailsModule',
            },
            {
                path: 'edit-product',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/brand-management/edit-product/edit-product.module#EditProductModule',
            },
            //Banner Management
            {
                path: 'search-banner',
                // canActivate:[permissionGuard],
                loadChildren: './modules/configurations/banner-management/search-banner/search-banner.module#SearchBannerModule',
            },
            {
                path: 'add-banner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/banner-management/add-banner/add-banner.module#AddBannerModule',
            },
            {
                path: 'edit-banner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/banner-management/edit-banner/edit-banner.module#EditBannerModule',
            },
            {
                path: 'view-banner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/banner-management/view-banner/view-banner.module#ViewBannerModule',
            },
            // store Management
            {
                path: 'search-store',
                canActivate: [permissionGuard],

                loadChildren: './modules/configurations/storeManagement/search-store/search-store.module#SearchStoreModule',
            },
            {
                path: 'add-store',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/storeManagement/add-store/add-store.module#AddStoreModule',
            },
            {
                path: 'view-store',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/storeManagement/view-store/view-store.module#ViewStoreModule',
            },
            {
                path: 'edit-store',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/storeManagement/edit-store/edit-store.module#EditStoreModule',
            },
            //press release
            {
                path: 'search-press-release',

                canActivate: [permissionGuard],
                loadChildren: './modules/pressRelease/search-press-release/search-press-release.module#SearchPressReleaseModule',
            },
            {
                path: 'add-press-release',
                canActivate: [permissionGuard],

                loadChildren: './modules/pressRelease/add-press-release/add-press-release.module#AddPressReleaseModule',
            },
            {
                path: 'view-press-release',
                canActivate: [permissionGuard],
                loadChildren: './modules/pressRelease/view-press-release/view-press-release.module#ViewPressReleaseModule',
            },
            {
                path: 'edit-press-release',
                canActivate: [permissionGuard],
                loadChildren: './modules/pressRelease/edit-press-release/edit-press-release.module#EditPressReleaseModule',
            },
            //marketing --> templates
            {
                path: 'search-template',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/templates/search-template/search-template.module#SearchTemplateModule',
            },
            {
                path: 'add-template',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/templates/add-template/add-template.module#AddTemplateModule',
            },
            {
                path: 'view-template',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/templates/view-template/view-template.module#ViewTemplateModule',
            },
            {
                path: 'edit-template',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/templates/edit-template/edit-template.module#EditTemplateModule',
            },
            // FAQ
            {
                path: 'search-faq',
                canActivate: [permissionGuard],
                loadChildren: './modules/FAQ/search-faq/search-faq.module#SearchFaqModule'
            },
            {
                path: 'add-faq',
                canActivate: [permissionGuard],
                loadChildren: './modules/FAQ/add-faq/add-faq.module#AddFaqModule'
            },
            {
                path: 'view-faq',
                canActivate: [permissionGuard],
                loadChildren: './modules/FAQ/view-faq/view-faq.module#ViewFaqModule'
            },
            {
                path: 'edit-faq',
                canActivate: [permissionGuard],
                loadChildren: './modules/FAQ/edit-faq/edit-faq.module#EditFaqModule'
            },
            // About Us Menu
            {
                path: 'search-about-us',
                canActivate: [permissionGuard],
                loadChildren: './modules/aboutUs/search-about-us/search-about-us.module#SearchAboutUsModule'
            },
            {
                path: 'add-about-us',
                canActivate: [permissionGuard],
                loadChildren: './modules/aboutUs/add-about-us/add-about-us.module#AddAboutUsModule'
            },
            {
                path: 'edit-about-us',
                canActivate: [permissionGuard],
                loadChildren: './modules/aboutUs/edit-about-us/edit-about-us.module#EditAboutUsModule'
            },
            {
                path: 'view-about-us',
                canActivate: [permissionGuard],
                loadChildren: './modules/aboutUs/view-about-us/view-about-us.module#ViewAboutUsModule'
            },
            // marketing --> Customer Segments
            {
                path: 'search-customer-segments',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/customerSegments/search-customer-segments/search-customer-segments.module#SearchCustomerSegmentsModule'
            },
            {
                path: 'add-customer-segments',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/customerSegments/add-customer-segments/add-customer-segments.module#AddCustomerSegmentsModule'
            },
            {
                path: 'edit-customer-segments',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/customerSegments/edit-customer-segments/edit-customer-segments.module#EditCustomerSegmentsModule'
            },
            {
                path: 'view-customer-segments',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/customerSegments/view-customer-segments/view-customer-segments.module#ViewCustomerSegmentsModule'
            },
            // marketing --> Campaigns
            {
                path: 'search-campaign',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/campaigns/search-campaign/search-campaign.module#SearchCampaignModule'
            },
            {
                path: 'add-campaign',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/campaigns/add-campaign/add-campaign.module#AddCampaignModule'
            },
            {
                path: 'view-campaign',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/campaigns/view-campaign/view-campaign.module#ViewCampaignModule'
            },
            {
                path: 'edit-campaign',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/campaigns/edit-campaign/edit-campaign.module#EditCampaignModule'
            },
            // menu management-->categories
            {
                path: 'search-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/categories/search-category/search-category.module#SearchCategoryModule'
            },
            {
                path: 'add-category',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/categories/add-category/add-category.module#AddCategoryModule'
            },
            {
                path: 'edit-category/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/categories/edit-category/edit-category.module#EditCategoryModule'
            },
            {
                path: 'view-category/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/categories/view-category/view-category.module#ViewCategoryModule'
            },
            {
                path: 'refresh-cache',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/refreshCache/refresh-cache.module#RefreshCacheModule'
            },
            //Reports
            {
                path: 'reports',
                loadChildren: './modules/reports/reports/reports.module#ReportsModule'
            },
            // menu management-->products
            {
                path: 'search-products',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/products/search-products/search-products.module#SearchProductsModule'
            },
            {
                path: 'add-products',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/products/add-products/add-products.module#AddProductsModule'
            },
            {
                path: 'edit-products/:id/:module',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/products/edit-products/edit-products.module#EditProductsModule'
            },
            {
                path: 'view-products/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/products/view-products/view-products.module#ViewProductsModule'
            },
            // Loyalty --> Programs
            {
                path: 'search-programs',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/programs/search-programs/search-programs.module#SearchProgramsModule'
            },
            {
                path: 'add-programs',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/programs/add-programs/add-programs.module#AddProgramsModule'
            },
            {
                path: 'edit-programs',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/programs/edit-programs/edit-programs.module#EditProgramsModule'
            },
            {
                path: 'view-programs',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/programs/view-programs/view-programs.module#ViewProgramsModule'
            },
            //Loyalty--> Tier Qualification
            {
                path: 'tier-qualification',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/tierQualifications/tier-qualification/tier-qualification.module#TierQualificationModule'
            },
            // Earn Rule
            {
                path: 'add-earn-rule/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/earnRule/add-earn-rule/add-earn-rule.module#AddEarnRuleModule'
            },
            {
                path: 'edit-earn-rule',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/earnRule/edit-earn-rule/edit-earn-rule.module#EditEarnRuleModule'
            },
            {
                path: 'view-earn-rule',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/earnRule/view-earn-rule/view-earn-rule.module#ViewEarnRuleModule'
            },
            //Burn Rule
            {
                path: 'add-burn-rule/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/burnRule/add-burn-rule/add-burn-rule.module#AddBurnRuleModule'
            },
            {
                path: 'edit-burn-rule',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/burnRule/edit-burn-rule/edit-burn-rule.module#EditBurnRuleModule'
            },
            {
                path: 'view-burn-rule',
                canActivate: [permissionGuard],
                loadChildren: './modules/loyalty/burnRule/view-burn-rule/view-burn-rule.module#ViewBurnRuleModule'
            },
            // marketing --> coupons
            {
                path: 'search-coupons',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/coupons/search-coupons/search-coupons.module#SearchCouponsModule'
            },
            {
                path: 'add-coupons',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/coupons/add-coupons/add-coupons.module#AddCouponsModule'
            },
            {
                path: 'view-coupons',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/coupons/view-coupons/view-coupons.module#ViewCouponsModule'
            },
            {
                path: 'edit-coupons',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/coupons/edit-coupons/edit-coupons.module#EditCouponsModule'
            },
            // marketing --> notifications
            {
                path: 'search-notifications',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/notifications/search-notifications/search-notifications.module#SearchNotificationsModule'
            },
            {
                path: 'add-notifications',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/notifications/add-notifications/add-notifications.module#AddNotificationsModule'
            },
            {
                path: 'edit-notifications',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/notifications/edit-notifications/edit-notifications.module#EditNotificationsModule'
            },
            {
                path: 'view-notifications',
                canActivate: [permissionGuard],
                loadChildren: './modules/marketing/notifications/view-notifications/view-notifications.module#ViewNotificationsModule'
            },
            // // Order Management
            // {
            //     path: 'search-orders',
            //     // canActivate: [permissionGuard],
            //     loadChildren: './modules/orderManagement/search-orders/search-orders.module#SearchOrdersModule'
            // },
            // {
            //     path: 'order-details/:id',
            //     // canActivate: [permissionGuard],
            //     loadChildren: './modules/orderManagement/order-details/order-details.module#OrderDetailsModule'
            // },
            // {
            //     path: 'search-transaction',
            //     // canActivate: [permissionGuard],
            //     loadChildren: './modules/orderManagement/search-transaction/search-transaction.module#SearchTransactionModule'
            // },
            // {
            //     path: 'view-transaction-order/:id',
            //     // canActivate: [permissionGuard],
            //     loadChildren: './modules/orderManagement/view-transaction/view-transaction.module#ViewTransactionModule'
            // },
            // Live Orders
            {
                path: 'live-orders-global-search',
                loadChildren: './modules/orderManagement/live-orders-global-search/live-orders-global-search.module#LiveOrdersGlobalSearchModule'
            },
            {
                path: "live-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/live-orders-listing/live-orders-listing.module#LiveOrdersListingModule"
            },
            // New Orders
            {
                path: "new-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/new-orders-dashboard/new-orders-listing/new-orders-listing.module#NewOrdersListingModule"
            },
            // Scheduled Orders
            {
                path: "scheduled-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/scheduled-orders/scheduled-orders-listing/scheduled-orders-listing.module#ScheduledOrdersListingModule"
            },
            {
                path: "view-scheduled-order-details",
                // canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/scheduled-orders/view-scheduled-order-details/view-scheduled-order-details.module#ViewScheduledOrderDetailsModule"
            },
            // Transactions
            {
                path: "transactions-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/transactions/transactions-listing/transactions-listing.module#TransactionsListingModule"
            },
            {
                path: "view-transaction-details",
                // canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/transactions/view-transaction-details/view-transaction-details.module#ViewTransactionDetailsModule"
            },
            // view order details
            {
                path: "view-order-details",
                loadChildren: "./modules/orderManagement/order-details/view-order-details/view-order-details.module#ViewOrderDetailsModule"
            },
            //Feedback & Enquiry
            {
                path: "search-feedback-and-enquiry",
                loadChildren: "./modules/orderManagement/feedback-and-enquiry/search-feedback-and-enquiry/search-feedback-and-enquiry.module#SearchFeedbackAndEnquiryModule"
            },
            {
                path: "view-feedback-and-enquiry",
                loadChildren: "./modules/orderManagement/feedback-and-enquiry/view-feedback-and-enquiry/view-feedback-and-enquiry.module#ViewFeedbackAndEnquiryModule"
            },
            {
                path: "tim-reports",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/tim-reports/tim-reports.module#TimReportsModule"
            },
            {
                path: "app-delivery",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/appDelivery/app-delivery/app-delivery.module#AppDeliveryModule"
            },
            {
                path: "store-menu",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/storeMenu/store-menu/store-menu.module#StoreMenuModule"
            },
            {
                path: "search-pg-transaction",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/PG-transaction/search-pg-transaction/search-pg-transaction.module#SearchPgTransactionModule"
            },
            // Member Management --
            {
                path: 'search-enquiries',
                canActivate: [permissionGuard],
                loadChildren: './modules/memberManagement/enquiries/search-enquiries/search-enquiries.module#SearchEnquiriesModule'
            },
            {
                path: 'view-enquiries',
                loadChildren: './modules/memberManagement/enquiries/view-enquiries/view-enquiries.module#ViewEnquiriesModule'
            },

            // configurations--> File Uploads Create
            {
                path: 'create-upload',
                loadChildren: './modules/configurations/fileUpload/create-file-upload/create-file-upload.module#CreateFileUploadModule'
            },

            // configurations--> File Uploads Search
            {
                path: 'view-upload',
                loadChildren: './modules/configurations/fileUpload/search-uploaded-files/search-uploaded-files.module#SearchUploadedFilesModule'
            },

            // configurations -- > file-gallery
            {
                path: 'create-file-gallery',
                loadChildren: './modules/configurations/file-gallery/create-file-gallery/create-file-gallery.module#CreateFileGalleryModule'
            },

            // configurations--> masters-->Enquiry Type
            {
                path: 'search-enquiry-type',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/enquiry-type/search-enquiry-type/search-enquiry-type.module#SearchEnquiryTypeModule'
            },
            {
                path: 'add-enquiry-type',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/enquiry-type/add-enquiry-type/add-enquiry-type.module#AddEnquiryTypeModule'
            },
            {
                path: 'edit-enquiry-type',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/enquiry-type/edit-enquiry-type/edit-enquiry-type.module#EditEnquiryTypeModule'
            },
            {
                path: 'view-enquiry-type',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/enquiry-type/view-enquiry-type/view-enquiry-type.module#ViewEnquiryTypeModule'
            },

            {
                path: 'add-product-tag',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/product-tag/product-tag/add-product-tag/add-product-tag.module#AddProductTagModule'
            },

            // masters -- > Taxation 

            // {
            //     path: 'add-taxation',
            //     canActivate: [permissionGuard],
            //     loadChildren: './modules/configurations/masters/taxation/taxation/add-taxation/addTaxation.module#AddTaxationModule'
            // },
            // {
            //     path: 'edit-taxation',
            //     canActivate: [permissionGuard],
            //     loadChildren: './modules/configurations/masters/taxation/taxation/edit-taxation/edit-taxation.module#EditTaxationModule'
            // },
            // {
            //     path: 'search-taxation',
            //     canActivate: [permissionGuard],
            //     loadChildren: './modules/configurations/masters/taxation/taxation/search-taxation/search-taxation.module#SearchTaxationModule'
            // },
            // {
            //     path: 'view-taxation',
            //     canActivate: [permissionGuard],
            //     loadChildren: './modules/configurations/masters/taxation/taxation/view-taxation/view-taxation.module#ViewTaxationModule'
            // },
            // masters-->Feedback
            {
                path: 'search-feedback',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/feedback/search-feedback/search-feedback.module#SearchFeedbackModule'
            },
            {
                path: 'add-feedback',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/feedback/add-feedback/add-feedback.module#AddFeedbackModule'
            },
            {
                path: 'edit-feedback',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/feedback/edit-feedback/edit-feedback.module#EditFeedbackModule'
            },
            {
                path: 'view-feedback',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/feedback/view-feedback/view-feedback.module#ViewFeedbackModule'
            },
            // masters-->Partner
            {
                path: 'search-partner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/partner/search-partner/search-partner.module#SearchPartnerModule'
            },
            {
                path: 'add-partner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/partner/add-partner/add-partner.module#AddPartnerModule'
            },
            {
                path: 'edit-partner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/partner/edit-partner/edit-partner.module#EditPartnerModule'
            },
            {
                path: 'view-partner',
                canActivate: [permissionGuard],
                loadChildren: './modules/configurations/masters/partner/view-partner/view-partner.module#ViewPartnerModule'
            },
            // Member Management -->Members
            {
                path: 'search-member',
                canActivate: [permissionGuard],
                loadChildren: './modules/memberManagement/members/search-member/search-member.module#SearchMemberModule'
            },
            {
                path: 'view-member',
                canActivate: [permissionGuard],
                loadChildren: './modules/memberManagement/members/view-member/view-member.module#ViewMemberModule'
            },
            {
                path: 'view-transaction',
                // canActivate:[permissionGuard],
                loadChildren: './modules/memberManagement/members/view-transaction/view-transaction.module#ViewTransactionModule'
            },
            // Store Management --> Amenities
            {
                path: 'search-amenities',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/amenities/search-amenities/search-amenities.module#SearchAmenitiesModule'
            },
            {
                path: 'add-amenities',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/amenities/add-amenities/add-amenities.module#AddAmenitiesModule'
            },
            {
                path: 'edit-amenities',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/amenities/edit-amenities/edit-amenities.module#EditAmenitiesModule'
            },
            {
                path: 'view-amenities',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/amenities/view-amenities/view-amenities.module#ViewAmenitiesModule'
            },
            // Store Management --> Calendar
            {
                path: 'search-calendar',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/calendar/search-calendar/search-calendar.module#SearchCalendarModule'
            },
            {
                path: 'add-calendar',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/calendar/add-calendar/add-calendar.module#AddCalendarModule'
            },
            {
                path: 'view-calendar',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/calendar/view-calendar/view-calendar.module#ViewCalendarModule'
            },
            {
                path: 'edit-calendar',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/calendar/edit-calendar/edit-calendar.module#EditCalendarModule'
            },
            // Store Management --> Delivery Areas
            {
                path: 'search-delivery-area',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/deliveryAreas/search-delivery-area/search-delivery-area.module#SearchDeliveryAreaModule'
            },
            {
                path: 'add-delivery-area',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/deliveryAreas/add-delivery-area/add-delivery-area.module#AddDeliveryAreaModule'
            },
            {
                path: 'edit-delivery-area',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/deliveryAreas/edit-delivery-area/edit-delivery-area.module#EditDeliveryAreaModule'
            },
            {
                path: 'view-delivery-area',
                canActivate: [permissionGuard],
                loadChildren: './modules/storeManagement/deliveryAreas/view-delivery-area/view-delivery-area.module#ViewDeliveryAreaModule'
            },
            // menu management--> variants
            {
                path: 'search-variants',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/variants/search-variants/search-variants.module#SearchVariantsModule'
            },
            {
                path: 'add-variants',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/variants/add-variants/add-variants.module#AddVariantsModule'
            },
            {
                path: 'edit-variants/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/variants/edit-variants/edit-variants.module#EditVariantsModule'
            },
            {
                path: 'view-variants/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/variants/view-variants/view-variants.module#ViewVariantsModule'
            },
            // menu management--> add-ons
            {
                path: 'search-add-ons',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/add-ons/search-add-ons/search-add-ons.module#SearchAddOnsModule'
            },
            {
                path: 'add-add-ons',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/add-ons/add-add-ons/add-add-ons.module#AddAddOnsModule'
            },
            {
                path: 'edit-add-ons/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/add-ons/edit-add-ons/edit-add-ons.module#EditAddOnsModule'
            },
            {
                path: 'view-add-ons/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/add-ons/view-add-ons/view-add-ons.module#ViewAddOnsModule'
            },
            //Combos
            {
                path: 'add-combo',
                // canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/combo/add-combo/add-combo.module#AddComboModule'
            },
            {
                path: 'edit-combo',
                // canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/combo/edit-combo/edit-combo.module#EditComboModule'
            },
            {
                path: 'view-combo',
                // canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/combo/view-combo/view-combo.module#ViewComboModule'
            },
            {
                path: 'search-combo',
                // canActivate: [permissionGuard],
                loadChildren: './modules/menuManagement/combo/search-combo/search-combo.module#SearchComboModule'
            },
            {
                path: 'add-kiosk',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/kiosk/add-kiosk/add-kiosk.module#AddKioskModule'
            },
            {
                path: 'view-kiosk/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/kiosk/view-kiosk/view-kiosk.module#ViewKioskModule'
            },
            {
                path: 'edit-kiosk/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/kiosk/edit-kiosk/edit-kiosk.module#EditKioskModule'
            },
            {
                path: 'search-kiosk',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/kiosk/search-kiosk/search-kiosk.module#SearchKioskModule'
            },
            // feedback notification
            {
                path: 'feedback-search-notifications',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/notifications/search-notifications/search-notifications.module#SearchNotificationsModule'
            },
            {
                path: 'feedback-view-notifications/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/notifications/view-notifications/view-notifications.module#ViewNotificationsModule'
            },
            // feedback flow
            {
                path: 'create-flow',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/flow/create-flow/create-flow.module#CreateFlowModule'
            },
            {
                path: 'search-flow',
                canActivate: [permissionGuard],
                loadChildren: './modules/feedback/flow/search-flow/search-flow.module#SearchFlowModule'
            },
            {
                path: 'view-flow/:id',
                // canActivate: [permissionGuard],
                loadChildren: './modules/feedback/flow/view-flow/view-flow.module#ViewFlowModule'
            },
            {
                path: 'edit-flow/:id/:parameter',
                // canActivate: [permissionGuard],
                loadChildren: './modules/feedback/flow/edit-flow/edit-flow.module#EditFlowModule'
            },
            // 'edit-coupons/:id/:parameter'
            {
                path: 'confirm-transaction-details/:customerOid/:txnId',
                loadChildren: './modules/memberManagement/members/confirm-transaction-details/confirm-transaction-details.module#ConfirmTransactionDetailsModule'
            },

            // Gift Card Management
            // cards template
            {
                path: 'add-card-template',
                loadChildren: './modules/giftCardManagement/cardsTemplates/add-card-template/add-card-template.module#AddCardTemplateModule'
            },
            {
                path: 'search-card-template',
                loadChildren: './modules/giftCardManagement/cardsTemplates/search-card-template/search-card-template.module#SearchCardTemplateModule'
            },
            {
                path: 'view-card-template/:id',
                loadChildren: './modules/giftCardManagement/cardsTemplates/view-card-template/view-card-template.module#ViewCardTemplateModule'
            },
            {
                path: 'edit-card-template/:id',
                loadChildren: './modules/giftCardManagement/cardsTemplates/edit-card-template/edit-card-template.module#EditCardTemplateModule'
            },
            //gift cards
            {
                path: 'add-gift-card',

                loadChildren: './modules/giftCardManagement/giftCard/add-gift-card/add-gift-card.module#AddGiftCardModule'
            },
            {
                path: 'search-gift-card',
                loadChildren: './modules/giftCardManagement/giftCard/search-gift-card/search-gift-card.module#SearchGiftCardModule'
            },
            {
                path: 'edit-gift-card/:id',
                loadChildren: './modules/giftCardManagement/giftCard/edit-gift-card/edit-gift-card.module#EditGiftCardModule'
            },
            {
                path: 'view-gift-card/:id',
                loadChildren: './modules/giftCardManagement/giftCard/view-gift-card/view-gift-card.module#ViewGiftCardModule'
            },
            //corporate account
            {
                path: 'add-corporate-account',
                loadChildren: './modules/giftCardManagement/corporateAccount/add-corporate-account/add-corporate-account.module#AddCorporateAccountModule'
            },
            {
                path: 'search-corporate-account',
                canActivate: [permissionGuard],
                loadChildren: './modules/giftCardManagement/corporateAccount/search-corporate-account/search-corporate-account.module#SearchCorporateAccountModule'
            },
            {
                path: 'edit-corporate-account/:id',
                loadChildren: './modules/giftCardManagement/corporateAccount/edit-corporate-account/edit-corporate-account.module#EditCorporateAccountModule'
            },
            {
                path: 'view-corporate-account/:id',
                loadChildren: './modules/giftCardManagement/corporateAccount/view-corporate-account/view-corporate-account.module#ViewCorporateAccountModule'
            },
            // Gifiting
            {
                path: 'add-gifting',
                loadChildren: './modules/giftCardManagement/gifting/add-gifting/add-gifting.module#AddGiftingModule'
            },
            {
                path: 'view-gifting/:id',
                loadChildren: './modules/giftCardManagement/gifting/view-gifiting/view-gifiting.module#ViewGifitingModule'
            },
            {
                path: 'edit-gifting/:id',
                loadChildren: "./modules/giftCardManagement/gifting/edit-gifting/edit-gifting.module#EditGiftingModule"
            },
            {
                path: "search-gifting",
                loadChildren: "./modules/giftCardManagement/gifting/search-gifting/search-gifting.module#SearchGiftingModule"
            },
            // Recipient
            // {
            //     path: 'add-recipient',
            //     loadChildren:"./modules/giftCardManagement/recipient/add-recipient/add-recipient.module#AddRecipientModule"
            // },
            // {
            //     path: 'edit-recipient',
            //     loadChildren:"./modules/giftCardManagement/recipient/edit-recipient/edit-recipient.module#EditRecipientModule"
            // },
            // {
            //     path: 'view-recipient',
            //     loadChildren:"./modules/giftCardManagement/recipient/view-recipient/view-recipient.module#ViewRecipientModule"
            // },
            {
                path: "search-recipient",
                loadChildren: "./modules/giftCardManagement/recipient/search-recipient/search-recipient.module#SearchRecipientModule"
            },

            //physical cards
            {
                path: 'search-physical-cards',
                loadChildren: "./modules/giftCardManagement/physical cards/search-physical-cards/search-physical-cards.module#SearchPhysicalCardsModule"

            },
            {
                path: 'generate-code',
                loadChildren: "./modules/giftCardManagement/physical cards/generate-code/generate-code.module#GenerateCodeModule"
            },
            //assign physical cards
            {
                path: 'add-assign-physical-cards',
                loadChildren: "./modules/giftCardManagement/assign-physical-cards/add-assign-physical-cards/add-assign-physical-cards.module#AddAssignPhysicalCardsModule"
            },
            {
                path: 'edit-assign-physical-cards',
                loadChildren: "./modules/giftCardManagement/assign-physical-cards/edit-assign-physical-cards/edit-assign-physical-cards.module#EditAssignPhysicalCardsModule"
            },
            {
                path: 'view-assign-physical-cards/:id',
                loadChildren: "./modules/giftCardManagement/assign-physical-cards/view-assign-physical-cards/view-assign-physical-cards.module#ViewAssignPhysicalCardsModule"
            },
            {
                path: 'search-assign-physical-cards',
                loadChildren: "./modules/giftCardManagement/assign-physical-cards/search-assign-physical-cards/search-assign-physical-cards.module#SearchAssignPhysicalCardsModule"
            },
            // search gift cards

            {
                path: "add-search-gift-cards",
                loadChildren: "./modules/giftCardManagement/search gift card/add-search-gift-cards/add-search-gift-cards.module#AddSearchGiftCardsModule"
            },
            {
                path: "edit-search-gift-cards/:id",
                loadChildren: "./modules/giftCardManagement/search gift card/edit-search-gift-cards/edit-search-gift-cards.module#EditSearchGiftCardsModule"
            },
            {
                path: "view-search-gift-cards/:id",
                loadChildren: "./modules/giftCardManagement/search gift card/view-search-gift-cards/view-search-gift-cards.module#ViewSearchGiftCardsModule"
            },
            {
                path: "search-search-gift-cards",
                loadChildren: "./modules/giftCardManagement/search gift card/search-search-gift-card/search-search-gift-card.module#SearchSearchGiftCardModule"
            },
            // Roll Tier Qualifications
            {
                path: 'role-tier-qualification',
                loadChildren: './modules/loyalty/role-tier-qualifications/role-tier-qualifications/role-tier-qualifications.module#RoleTierQualificationsModule'
            },
            //course
            {
                path: 'add-course',
                loadChildren: './modules/configurations/masters/course/add-course/add-course.module#AddCourseModule'
            },
            {
                path: 'edit-course',
                loadChildren: './modules/configurations/masters/course/edit-course/edit-course.module#EditCourseModule'
            },
            {
                path: 'search-course',
                loadChildren: './modules/configurations/masters/course/search-course/search-course.module#SearchCourseModule'
            },
            {
                path: 'view-course',
                loadChildren: './modules/configurations/masters/course/view-course/view-course.module#ViewCourseModule'
            },
            //cuisine
            {
                path: 'add-cuisine',
                loadChildren: './modules/configurations/masters/cuisine/add-cuisine/add-cuisine.module#AddCuisineModule'
            },
            {
                path: 'edit-cuisine',
                loadChildren: './modules/configurations/masters/cuisine/edit-cuisine/edit-cuisine.module#EditCuisineModule'
            },
            {
                path: 'search-cuisine',
                loadChildren: './modules/configurations/masters/cuisine/search-cuisine/search-cuisine.module#SearchCuisineModule'
            },
            {
                path: 'view-cuisine',
                loadChildren: './modules/configurations/masters/cuisine/view-cuisine/view-cuisine.module#ViewCuisineModule'
            },
            //Merchants
            {
                path: 'add-merchant',
                loadChildren: './modules/configurations/masters/merchant/add-merchant/add-merchant.module#AddMerchantModule'
            },
            {
                path: 'edit-merchant',
                loadChildren: './modules/configurations/masters/merchant/edit-merchant/edit-merchant.module#EditMerchantModule'
            },
            {
                path: 'search-merchant',
                loadChildren: './modules/configurations/masters/merchant/search-merchant/search-merchant.module#SearchMerchantModule'
            },
            {
                path: 'view-merchant',
                loadChildren: './modules/configurations/masters/merchant/view-merchant/view-merchant.module#ViewMerchantModule'
            },
            //brand
            {
                path: 'add-brand',
                loadChildren: './modules/configurations/masters/brand/add-brand/add-brand.module#AddBrandModule'
            },
            {
                path: 'edit-brand',
                loadChildren: './modules/configurations/masters/brand/edit-brand/edit-brand.module#EditBrandModule'
            },
            {
                path: 'search-brand',
                loadChildren: './modules/configurations/masters/brand/search-brand/search-brand.module#SearchBrandModule'
            },
            {
                path: 'view-brand',
                loadChildren: './modules/configurations/masters/brand/view-brand/view-brand.module#ViewBrandModule'
            },
            //customer-type/sub-type
            {
                path: 'add-customer-type',
                loadChildren: './modules/configurations/masters/customer-type/add-customer-type/add-customer-type.module#AddCustomerTypeModule'
            },
            {
                path: 'edit-customer-type',
                loadChildren: './modules/configurations/masters/customer-type/edit-customer-type/edit-customer-type.module#EditCustomerTypeModule'
            },
            {
                path: 'search-customer-type',
                loadChildren: './modules/configurations/masters/customer-type/search-customer-type/search-customer-type.module#SearchCustomerTypeModule'
            },
            {
                path: 'view-customer-type',
                loadChildren: './modules/configurations/masters/customer-type/view-customer-type/view-customer-type.module#ViewCustomerTypeModule'
            },

            // Member management --> Transaction Request
            {
                path: 'search-transaction-request',
                loadChildren: './modules/memberManagement/transactionRequest/search-transaction-request/search-transaction-request.module#SearchTransactionRequestModule'
            },

            // feedback --> Reports

            {
                path: "feedback-report",
                canActivate: [permissionGuard],
                loadChildren:
                    "./modules/feedback/feedback-reports/feedback-report/feedback-report.module#FeedbackReportModule"
            },
            {
                path: "flow-performance",
                canActivate: [permissionGuard],
                loadChildren:
                    "./modules/feedback/feedback-reports/flow-performance/flow-performance.module#FlowPerformanceModule"
            },
            {
                path: "kiosk-report",
                canActivate: [permissionGuard],
                loadChildren:
                    "./modules/feedback/feedback-reports/kiosk-report/kiosk-report.module#KioskReportModule"
            },
            {
                path: "incomplete-report",
                canActivate: [permissionGuard],
                loadChildren:
                    "./modules/feedback/feedback-reports/incomplete-reports/incomplete-reports.module#IncompleteReportsModule"
            },
            // feedback kiosk reports
            {
                path: "feedback-kiosk-reports",
                canActivate: [permissionGuard],
                loadChildren:
                    "./modules/feedback/feedback-kiosk-reports/feedback-kiosk-reports.module#FeedbackKioskReportsModule"
            },
            // feedback Alerts
            {
                path: "search-kiosk-alerts",
                loadChildren: "./modules/feedback/alerts/search-kiosk-alerts/search-kiosk-alerts.module#SearchKioskAlertsModule"
            },

            // Feedback Survey

            {
                path: 'search-feedbacksurvey',
                //   canActivate: [permissionGuard],
                loadChildren: './modules/feedback/feedback-survey/search-feedback-survey/search-feedback-survey.module#SearchFeedbackSurveyModule'
            },
            {
                path: 'add-feedbacksurvey',
                //  canActivate: [permissionGuard],
                loadChildren: './modules/feedback/feedback-survey/add-feedback-survey/add-feedback-survey.module#AddFeedbackSurveyModule'
            },

            {
                path: 'view-feedbacksurvey/:id',
                loadChildren: './modules/feedback/feedback-survey/view-feedback-survey/view-feedback-survey.module#ViewFeedbackSurveyModule'
            },
            {
                path: 'edit-feedback-survey/:id',
                loadChildren: './modules/feedback/feedback-survey/edit-feedback-survey/edit-feedback-survey.module#EditFeedbackSurveyModule'
            },
            {
                path: "import-flow",
                loadChildren:
                    "./modules/feedback/flow/import-flow/import-flow.module#ImportFlowModule"
            },
            // NPS Design
            {
                path: "nps-Design",
                loadChildren: "./modules/feedback/nps-design/nps-design/nps-design.module#NpsDesignModule"
            },
            {
                path: "view-nps-Design",
                canActivate: [permissionGuard],
                loadChildren: "./modules/feedback/nps-design/view-nps-design/view-nps-design.module#ViewNpsDesignModule"
            },
            // Order Management 
            // Live Orders
            {
                path: "live-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/live-orders-listing/live-orders-listing.module#LiveOrdersListingModule"
            },
            // // New Orders
            {
                path: "new-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/new-orders-dashboard/new-orders-listing/new-orders-listing.module#NewOrdersListingModule"
            },
            // // Scheduled Orders
            {
                path: "scheduled-orders-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/scheduled-orders/scheduled-orders-listing/scheduled-orders-listing.module#ScheduledOrdersListingModule"
            },
            {
                path: "view-scheduled-order-details",
                // canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/scheduled-orders/view-scheduled-order-details/view-scheduled-order-details.module#ViewScheduledOrderDetailsModule"
            },
            // Transactions
            {
                path: "transactions-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/transactions/transactions-listing/transactions-listing.module#TransactionsListingModule"
            },
            {
                path: "search-pg-transaction",
                canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/PG-transaction/search-pg-transaction/search-pg-transaction.module#SearchPgTransactionModule"
            },
            {
                path: "print-invoice/:id",
                // canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/print-invoice/print-invoice.module#PrintInvoiceModule"
            },

            //Danbro Order management listing
            {
                path: "transaction-listing",
                canActivate: [permissionGuard],
                loadChildren: "./modules/order-management/transactions/transaction-listing/transaction-listing.module#TransactionListingModule"
            },
            {
                path: "view-transaction-details",
                // canActivate: [permissionGuard],
                loadChildren: "./modules/orderManagement/transactions/view-transaction-details/view-transaction-details.module#ViewTransactionDetailsModule"
            },
            // view order details
            {
                path: "view-order-details",
                loadChildren: "./modules/orderManagement/order-details/view-order-details/view-order-details.module#ViewOrderDetailsModule"
            },
            //Feedback & Enquiry
            {
                path: "search-feedback-and-enquiry",
                loadChildren: "./modules/orderManagement/feedback-and-enquiry/search-feedback-and-enquiry/search-feedback-and-enquiry.module#SearchFeedbackAndEnquiryModule"
            },
            {
                path: "view-feedback-and-enquiry",
                loadChildren: "./modules/orderManagement/feedback-and-enquiry/view-feedback-and-enquiry/view-feedback-and-enquiry.module#ViewFeedbackAndEnquiryModule"
            },
            {
                path: 'welcome-page',
                loadChildren: './modules/welcome-page/welcome-page.module#WelcomePageModule',
            },
            // {
            //     path: "tim-reports",
            //     canActivate: [permissionGuard],
            //     loadChildren: "./modules/orderManagement/tim-reports/tim-reports.module#TimReportsModule"
            // },
            // Event Gifting add-card-template.module#AddCardTemplateModule
            //    {
            //     path: "add-event-gifting",
            //     loadChildren:"./modules/giftCardManagement/EventGifting/add-event-gifting/add-event-gifting.module#AddEventGiftingModule"
            //    },
            //View-event-giting
            //    {
            //     path: "view-event-gifting",
            //     loadChildren:"./modules/giftCardManagement/EventGifting/view-event-gifting/view-event-gifting.module#ViewEventGiftingModule"
            //    }
            // E Wallet
            {
                path: 'search-eWallet',
                canActivate: [permissionGuard],
                loadChildren: './modules/eWallet/search-ewallet/search-ewallet.module#SearchEWalletModule'
            },
            {
                path: 'create-eWallet',
                canActivate: [permissionGuard],
                loadChildren: './modules/eWallet/create-ewallet/create-ewallet.module#CreateEWalletModule'
            },
            {
                path: 'view-eWallet',
                canActivate: [permissionGuard],
                loadChildren: './modules/eWallet/view-ewallet/view-ewallet.module#ViewEWalletModule'
            },
            {
                path: 'edit-eWallet',
                canActivate: [permissionGuard],
                loadChildren: './modules/eWallet/edit-ewallet/edit-ewallet.module#EditEWalletModule'
            },


              ///event module
              {
                path: 'add-events',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/add-events/add-events.module#AddEventsModule'
            },
            {
                path: 'view-events/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/view-events/view-events.module#ViewEventsModule'
            },
            {
                path: 'search-events',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/search-events/search-events.module#SearchEventsModule'
            },
            {
                path: 'edit-events/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/edit-events/edit-events.module#EditEventsModule'
            },
            {
                path: 'search-locations',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/search-locations/search-locations.module#SearchLocationsModule'
            },
            {
                path: 'add-location',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/add-location/add-location.module#AddLocationModule'
            },
            {
                path: 'edit-location/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/edit-location/edit-location.module#EditLocationModule'
            },
              {
                path: 'view-location/:id',
                canActivate: [permissionGuard],
                loadChildren: './modules/events/view-location/view-location.module#ViewLocationModule'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
