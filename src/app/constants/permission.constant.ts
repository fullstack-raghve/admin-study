export const Routes = {
    path: [
        {
            path: 'clientOnBoarding',
            permissionId: 1001,
        },


        //master country
        {
            path: 'search-country',
            permissionId: 1002,

        },
        {
            path: 'add-country',
            permissionId: 1002

        },
        {
            path: 'edit-country/:id',
            permissionId: 1002

        },
        {
            path: 'view-country/:id',
            permissionId: 1002

        },

        // User Management
        {
            path: 'search-user',
            permissionId: 5001

        },
        {
            path: 'add-user',
            permissionId: 5002

        },
        {
            path: 'view-user/:id',
            permissionId: 5003

        },
        {
            path: 'edit-user/:id',
            permissionId: 5004

        },
        {
            path: 'search-role',
            permissionId: 5005001
            // tslint:disable-next-line:max-line-length

        },
        {
            path: 'create-role',
            permissionId: 5005002
            // tslint:disable-next-line:max-line-length

        },
        {
            path: 'view-role/:id',
            permissionId: 5005003
            // tslint:disable-next-line:max-line-length
        },
        {
            path: 'edit-role/:id',
            permissionId: 5005004
            // tslint:disable-next-line:max-line-length
        },

        // master currency
        {
            path: 'add-currency',
            permissionId: 1002
        },
        {
            path: 'view-currency/:id',
            permissionId: 1002
        },
        {
            path: 'edit-currency/:id',
            permissionId: 1002

        },
        {
            path: 'search-currency',
            permissionId: 1002

        },
        //master brands
        {
            path: 'search-brands',
            permissionId: 1002

        },

        {
            path: 'add-brands',
            permissionId: 1002

        },
        {
            path: 'edit-brands/:id',
            permissionId: 1002

        },
        {
            path: 'view-brands/:id',
            permissionId: 1002

        },
        //master-malls
        {
            path: 'search-malls',
            permissionId: 1002

        },
        {
            path: 'add-malls',
            permissionId: 1002
        },
        {
            path: 'view-malls/:id',
            permissionId: 1002

        },
        {
            path: 'edit-malls/:id',
            permissionId: 1002

        },
        //master language
        {
            path: 'search-language',
            permissionId: 1002

        },
        {
            path: 'add-language',
            permissionId: 1002

        },
        {
            path: 'edit-language/:id',
            permissionId: 1002

        },
        {
            path: 'view-language/:id',
            permissionId: 1002

        },
        // master brand-category
        {
            path: 'search-brand-category',
            permissionId: 1002

        },
        {
            path: 'add-brand-category',
            permissionId: 1002

        },
        {
            path: 'view-brand-category/:id',
            permissionId: 1002

        },
        {
            path: 'edit-brand-category/:id',
            permissionId: 1002

        },
        // master cities
        {
            path: 'search-cities',
            permissionId: 1002

        },
        {
            path: 'add-cities',
            permissionId: 1002

        },
        {
            path: 'edit-cities/:id',
            permissionId: 1002

        },
        {
            path: 'view-cities/:id',
            permissionId: 1002

        },
        // master about us category
        {
            path: 'search-about-us-category',
            permissionId: 1002

        },
        {
            path: 'add-about-us-category',
            permissionId: 1002

        },
        {
            path: 'edit-about-us-category/:id',
            permissionId: 1002

        },
        {
            path: 'view-about-us-category/:id',
            permissionId: 1002

        },
        // master currency conversion
        {
            path: 'search-currency-conversion',
            permissionId: 1002
        },
        {
            path: 'add-currency-conversion',
            permissionId: 1002


        },
        {
            path: 'view-currency-conversion/:id',
            permissionId: 1002


        },
        {
            path: 'edit-currency-conversion/:id',
            permissionId: 1002


        },
        // master faq conversion
        {
            path: 'search-faq-category',
            permissionId: 1002


        },
        {
            path: 'add-faq-category',
            permissionId: 1002


        },
        {
            path: 'edit-faq-category/:id',
            permissionId: 1002


        },
        {
            path: 'view-faq-category/:id',
            permissionId: 1002


        },

        // {
        //     path: 'add-taxation',
        //     permissionId: 1002,
        // },

        //client on boarding
        {
            path: 'add-client-on-boarding',
            permissionId: 1001

        },
        {
            path: 'view-client-on-boarding',
            permissionId: 1001

        },
        {
            path: 'edit-client-on-boarding',
            permissionId: 1001

        },

        //Delivey charges
        {
            path: 'delivery-charges',
            permissionId: 1006001
        },
        //Brand Management
        {
            path: 'search-brand-management',
            permissionId: 1003
        },
      
        {
            path: 'add-brands-management',
            permissionId: 1003
        },

        {
            path: 'view-brand-management',
            permissionId: 1003
        },
        {
            path: 'edit-brand-management',
            permissionId: 1003
        },
        {
            path: 'add-product',
            permissionId: 1003
        },
        {
            path: 'view-product',
            permissionId: 1003
        },
        {
            path: 'edit-product',
            permissionId: 1003
        },

        //Banner Manangement

        {
            path: 'search-banner',
            permissionId: 1004
        },
        {
            path: 'add-banner',
            permissionId: 1004001
        },
        {
            path: 'view-banner',
            permissionId: 1004002
        },
        {
            path: 'edit-banner',
            permissionId: 1004003
        },
        {
            path: 'search-banner',
            permissionId: 1004004
        },
        // store Management
        {
            path: 'search-store',
            permissionId: 2001
        },
        {
            path: 'add-store',
            permissionId: 2002
        },
        {
            path: 'view-store',
            permissionId: 2003
        },
        {
            path: 'edit-store',
            permissionId: 2004
        },
        //press release
        {
            path: 'search-press-release',
            permissionId: 13001
        },
        {
            path: 'add-press-release',
            permissionId: 13002
        },
        {
            path: 'view-press-release/:id',
            permissionId: 13003
        },
        {
            path: 'edit-press-release/:id',
            permissionId: 13004
        },
        //marketing --> templates
        {
            path: 'search-template',
            permissionId: 8001001

        },
        {
            path: 'add-template',
            permissionId: 8001002
        },
        {
            path: 'view-template/:id',
            permissionId: 8001003

        },
        {
            path: 'edit-template/:id/:id',
            permissionId: 8001004

        },
        // FAQ
        {
            path: 'search-faq',
            permissionId: 11001

        },
        {
            path: 'add-faq',
            permissionId: 11002

        },
        {
            path: 'view-faq/:id',
            permissionId: 11003

        },
        {
            path: 'edit-faq/:id',
            permissionId: 11004

        },
        // About Us Menu
        {
            path: 'search-about-us',
            permissionId: 12001
        },
        {
            path: 'add-about-us',
            permissionId: 12002

        },
        {
            path: 'view-about-us/:id',
            permissionId: 12003

        },
        {
            path: 'edit-about-us/:id/:module',
            permissionId: 12004

        },

        // marketing --> Customer Segments
        {
            path: 'search-customer-segments',
            permissionId: 8002001
        },
        {
            path: 'add-customer-segments',
            permissionId: 8002002

        },
        {
            path: 'view-customer-segments/:id',
            permissionId: 8002003

        },
        {
            path: 'edit-customer-segments/:id/:id',
            permissionId: 8002004

        },
        // marketing --> Campaigns
        {
            path: 'search-campaign',
            permissionId: 8004001

        },
        {
            path: 'add-campaign',
            permissionId: 8004002
        },
        {
            path: 'view-campaign/:id',
            permissionId: 8004003
        },
        {
            path: 'edit-campaign/:id/:id',
            permissionId: 8004004
        },
        // menu management-->categories
        {
            path: 'search-category',
            permissionId: 6002
        },
        {
            path: 'search-category',
            permissionId: 6002001
        },
        {
            path: 'add-category',
            permissionId: 6002002

        },
        {
            path: 'view-category/:id',
            permissionId: 6002003
        },
        {
            path: 'edit-category/:id',
            permissionId: 6002004
        },
        // menu management-->products
        {
            path: 'search-products',
            permissionId: 6003
        },
        {
            path: 'search-products',
            permissionId: 6003001
        },
        {
            path: 'add-products',
            permissionId: 6003002
        },
        {
            path: 'view-products/:id',
            permissionId: 6003003
        },
        {
            path: 'edit-products/:id/:module',
            permissionId: 6003004
        },
        // Loyalty --> Programs
        {
            path: 'search-programs',
            permissionId: 3003
        },
        {
            path: 'search-programs',
            permissionId: 3003001
        },
        {
            path: 'add-programs',
            permissionId: 3003002
        },
        {
            path: 'view-programs',
            permissionId: 3003003
        },
        {
            path: 'edit-programs',
            permissionId: 3003004
        },

        // {
        //     path: 'approval-programs/:id',
        //     permissionId: 3003005
        // },

        //Loyalty--> Tier Qualification
        {
            path: 'tier-qualification',
            permissionId: 3001
        },
        {
            path: 'role-tier-qualification',
            permissionId: 3002
        },
        // Earn Rule
        {
            path: 'add-earn-rule/:id',
            permissionId: 3004
        },
        // {
        //     path: 'search-earn-rule',
        //     permissionId: 3004001
        // },
        {
            path: 'add-earn-rule/:id',
            permissionId: 3004002
        },
        {
            path: 'view-earn-rule',
            permissionId: 3004003
        },
        {
            path: 'edit-earn-rule',
            permissionId: 3004004
        },

        //Burn Rule
        {
            path: 'add-burn-rule',
            permissionId: 3005
        },
        // {
        //     path: 'search-burn-rule',
        //     permissionId: 3005001
        // },
        {
            path: 'add-burn-rule',
            permissionId: 3005002
        },
        {
            path: 'view-burn-rule',
            permissionId: 3005003
        },
        {
            path: 'edit-burn-rule',
            permissionId: 3005004
        },
        //Gift Cards Management//
        {
            path: 'search-card-template',
            permissionId: 4001
        },
        {
            path: 'search-gift-card',
            permissionId: 4002
        },
        {
            path: 'search-corporate-account',
            permissionId: 4003
        },
        {
            path: 'search-gifting',
            permissionId: 4004
        },
        {
            path: 'search-recipient',
            permissionId: 4005
        },
        {
            path: 'search-physical-cards',
            permissionId: 4006
        },
        {
            path: 'search-assign-physical-cards',
            permissionId: 4007
        },
        {
            path: 'search-search-gift-cards',
            permissionId: 4008
        },
        // {
        //     path: 'view-gift-card',
        //     permissionId: 4009
        // },
        // marketing --> coupons
        {
            path: 'search-coupons',
            permissionId: 8003001
        },
        {
            path: 'add-coupons',
            permissionId: 8003002
        },
        {
            path: 'view-coupons/:id',
            permissionId: 8003003
        },
        {
            path: 'edit-coupons/:id/:module',
            permissionId: 8003004
        },
        // marketing --> notifications
        {
            path: 'search-notifications',
            permissionId: 8005001
        },
        {
            path: 'add-notifications',
            permissionId: 8005002
        },
        {
            path: 'view-notifications/:id',
            permissionId: 8005003
        },
        {
            path: 'edit-notifications/:id',
            permissionId: 8005004
        },
        // Reports
        {
            path: 'reports',
            permissionId: 9
        },
        
    // Order Management

        {
            path: 'live-orders-listing', 
            permissionId: 14001
        },
        {
            path: 'new-orders-listing',
            permissionId: 14003
        },
        {
            path: 'scheduled-orders-listing',
            permissionId: 14004
        },
        {
            path: 'transactions-listing',
            permissionId: 14002
        },

        {
            path: 'search-feedback-and-enquiry',
            permissionId: 14005
        },
        {
            path: "search-pg-transaction",
            permissionId: 14009
        },

     //Order management Danbro 
         {
            path: 'transaction-listing',
            permissionId: 10003011
        },

     // E wallet
     {
        path: 'search-eWallet',
        permissionId: 15001
    },
    {
        path: 'create-eWallet',
        permissionId: 15002
    },
    {
        path: 'view-eWallet',
        permissionId: 15003
    },
    {
        path: 'edit-eWallet',
        permissionId: 15004
    },
        // Member Management --
        {
            path: 'search-enquiries',
            permissionId: 7001
        },
        {
            path: 'search-enquiries',
            permissionId: 7001001
        },
        {
            path: 'view-enquiries',
            permissionId: 7001002
        },
        {
            path: 'update-enquiries',
            permissionId: 7001003
        },
        {
            path: 'export-enquiries',
            permissionId: 7001004
        },
        {
            path: 'view-enquiries/:id',
            permissionId: 7001002
        },
        // Transaction Request
        {
            path: 'search-transaction-request',
            permissionId: 7002
        },
        {
            path: 'view-transaction-request',
            permissionId: 7002001
        },
        {
            path: 'update-transaction-request',
            permissionId: 7002002
        },
        {
            path: 'export-transaction-request',
            permissionId: 7002003
        },

        // add-product-tag

        {
            path: 'add-product-tag',
            permissionId: 1002
        },
        // configurations--> masters-->Enquiry Type
        {
            path: 'search-enquiry-type',
            permissionId: 1002
        },
        {
            path: 'view-enquiry-type/:id',
            permissionId: 1002
        },
        {
            path: 'add-enquiry-type',
            permissionId: 1002
        },
        {
            path: 'edit-enquiry-type/:id',
            permissionId: 1002
        },
        // masters-->Feedback
        
        {
            path: 'search-feedback',
            permissionId: 1002
        },
        {
            path: 'add-feedback',
            permissionId: 1002
        },
        {
            path: 'edit-feedback/:id',
            permissionId: 1002
        },
        {
            path: 'view-feedback/:id',
            permissionId: 1002
        },
        // masters-->Partner
        {
            path: 'search-partner',
            permissionId: 1002
        },
        {
            path: 'add-partner',
            permissionId: 1002
        },
        {
            path: 'edit-partner/:id',
            permissionId: 1002
        },
        {
            path: 'view-partner/:id',
            permissionId: 1002
        },
        // Member Management -->Members
        {
            path: 'search-member',
            permissionId: 7003
        },
        {
            path: 'view-member',
            permissionId: 7003001
        },
        {
            path: 'view-transaction',
            // permissionId: 167
        },
        // Member Management -->Members
        {
            path: 'basic-details',
            permissionId: 7004
        },
        {
            path: 'make-member-offline',
            permissionId: 7004001
        },
        {
            path: 'edit-profile',
            permissionId: 7004002
        },
        {
            path: 'send-OTP',
            permissionId: 7004003
        },
        {
            path: 'send-email-verification',
            permissionId: 7004004
        },
        {
            path: 'extend-points-expiry',
            permissionId: 7004005
        },
        {
            path: 'change-tier',
            permissionId: 7004006
        },
        // Transactions --
        {
            path: 'transactions',
            permissionId: 7005
        },
        {
            path: 'view-transactions',
            permissionId: 7005001
        },
        {
            path: 'add-transactions',
            permissionId: 7005002
        },
        {
            path: 'update-transactions',
            permissionId: 7005003
        },
        // {
        //     path: 'transactions-based-search',
        //     permissionId: 7005004
        // },
        //Points
        {
            path: 'points',
            permissionId: 7006
        },
        {
            path: 'view-points',
            permissionId: 7006001
        },
        {
            path: 'manual-debit-credit',
            permissionId: 7006002
        },

        // Store Management --> Amenities
        {
            path: 'search-amenities',
            permissionId: 2005
        },
        {
            path: 'search-amenities',
            permissionId: 2005001
        },
        {
            path: 'add-amenities',
            permissionId: 2005002
        },
        {
            path: 'view-amenities',
            permissionId: 2005003
        },
        {
            path: 'edit-amenities',
            permissionId: 2005004
        },
        // Store Management --> Calendar
        {
            path: 'search-calendar',
            permissionId: 2007
        },
        {
            path: 'add-calendar',
            permissionId: 2007001
        },
        {
            path: 'view-calendar',
            permissionId: 2007002
        },
        {
            path: 'edit-calendar',
            permissionId: 2007003
        },
        {
            path: 'search-calendar',
            permissionId: 2007004
        },
        // Store Management --> Delivery Areas
        {
            path: 'search-delivery-area',
            permissionId: 2006
        },
        {
            path: 'add-delivery-area',
            permissionId: 2006001
        },
        {
            path: 'view-delivery-area',
            permissionId: 2006002
        },
        {
            path: 'edit-delivery-area',
            permissionId: 2006003
        },
        {
            path: 'search-delivery-area',
            permissionId: 2006004
        },
        //Menu Management --> Variants
        {
            path: 'search-variants',
            permissionId: 6001
        },
        {
            path: 'add-variants',
            permissionId: 6001001
        },
        {
            path: 'view-variants',
            permissionId: 6001002
        },
        {
            path: 'edit-variants',
            permissionId: 6001003
        },
        {
            path: 'search-variants',
            permissionId: 6001004
        },
        {
            path: 'refresh-cache',
            permissionId: 6003004
        },
        //Menu Management --> Variants
        {
            path: 'search-add-ons',
            permissionId: 6004
        },

        {
            path: 'add-add-ons',
            permissionId: 6004001
        },
        {
            path: 'view-add-ons',
            permissionId: 6004002
        },
        {
            path: 'edit-add-ons',
            permissionId: 6004003
        },
        {
            path: 'search-add-ons',
            permissionId: 6004004
        },
        // menu management-->Combos
        {
            path: 'search-combo',
            permissionId: 600504
        },
        {
            path: 'edit-combo',
            permissionId: 6005003
        },
        {
            path: 'add-combo',
            permissionId: 6005001
        },
        {
            path: 'view-combo',
            permissionId: 6005002
        },
        // Feedback --> Kiosk
        {
            path: 'search-kiosk',
            permissionId: 10001
        },
        {
            path: 'add-kiosk',
            permissionId: 10001001
        },
        {
            path: 'view-kiosk',
            permissionId: 10001002
        },
        {
            path: 'edit-kiosk',
            permissionId: 10001003
        },
        {
            path: 'search-kiosk',
            permissionId: 10001004
        },
        // Feedback Survey
        {
            path: 'search-feedbacksurvey',
            permissionId: 10006001
        },
        {
            path: 'add-feedbacksurvey',
            permissionId: 10006005
        },
        {
            path: 'view-feedbacksurvey',
            permissionId: 10006003
        },
        {
            path: 'edit-feedbacksurvey',
            permissionId: 10006002
        },
        {
            path: 'search-feedbacksurvey',
            permissionId: 10001004
        },
        //NPS Design
        {
            path: 'nps-Design',
            permissionId: 10007
        },
        // Feedback --> Flow
        {
            path: 'search-flow',
            permissionId: 10002
        },
        {
            path: 'create-flow',
            permissionId: 10002001
        },
        {
            path: 'view-flow',
            permissionId: 10002003
        },
        {
            path: 'edit-flow',
            permissionId: 10002004
        },
        // Feedback --> Notifications
        {
            path: 'feedback-search-notifications',
            permissionId: 10003
        },
        {
            path: 'feedback-search-notifications',
            permissionId: 10003001
        },
        {
            path: 'feedback-view-notifications',
            permissionId: 10003002
        },
        {
            path: 'flow-performance',
            permissionId: 10004001
        },
        {
            path: 'feedback-report',
            permissionId: 10004002
        },
        {
            path: 'kiosk-report',
            permissionId: 10004003
        },
        {
            path: 'incomplete-report',
            permissionId: 10004004
        },

        //File Gallery 

        {
            path: 'create-file-gallery',
            permissionId: 1006
        },
        //File Upload ----//
        {
            path: 'create-upload',
            permissionId: 1005001
        },
        {
            path: 'view-upload',
            permissionId: 1005002
        },
        // Feedback reports
        {
            path: 'feedback-kiosk-reports',
            permissionId: 10004
        },
        // Feedback NPS template
        {
            path: 'view-nps-Design',
            permissionId: 10007
        },

        //Event gifting////////
        
         {
            path: 'search-events',
            permissionId: 17003

        },
        {
            path: 'add-events',
            permissionId:17001

        },
        {
            path: 'view-events/:id',
            permissionId:17002

        },
        {
            path: 'edit-events/:id',
            permissionId:17004

        },
       ///location master
       {
        path: 'search-locations',
        permissionId: 17005003

    },
    {
        path: 'add-location',
        permissionId:17005001

    },
    {
        path: 'view-location/:id',
        permissionId:17005002

    },
    {
        path: 'edit-location/:id',
        permissionId:17005004

    }

    ]
}
