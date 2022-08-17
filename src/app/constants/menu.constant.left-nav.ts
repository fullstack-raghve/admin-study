export const permissions = {
  "data": [
    {
      menuId: 1,
      displayName: "Configurations",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/configurations_ico.png",
      route: "",
      checked: false,
      children: [
       {
          menuId: 1001,
          displayName: "Client On-Boarding",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "view-client-on-boarding",
          checked: false,
          children: []
        },
        {
          menuId: 1002,
          displayName: "Masters",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-country",
          checked: false,
          children: [
            { isMenuYes: false, route: "add-country"},
            { isMenuYes: false, route: "view-country"},
            { isMenuYes: false, route: "edit-country"},

            { isMenuYes: false, route: "search-cities"},
            { isMenuYes: false, route: "add-cities"},
            { isMenuYes: false, route: "view-cities"},
            { isMenuYes: false, route: "edit-cities"},

            { isMenuYes: false, route: "search-malls"},
            { isMenuYes: false, route: "add-malls"},
            { isMenuYes: false, route: "view-malls"},
            { isMenuYes: false, route: "edit-malls"},

            { isMenuYes: false, route: "search-currency"},
            { isMenuYes: false, route: "add-currency"},
            { isMenuYes: false, route: "view-currency"},
            { isMenuYes: false, route: "edit-currency"},

            { isMenuYes: false, route: "search-currency-conversion"},
            { isMenuYes: false, route: "add-currency-conversion"},
            { isMenuYes: false, route: "view-currency-conversion"},
            { isMenuYes: false, route: "edit-currency-conversion"},

            { isMenuYes: false, route: "search-brand-category"},
            { isMenuYes: false, route: "add-brand-category"},
            { isMenuYes: false, route: "view-brand-category"},
            { isMenuYes: false, route: "edit-brand-category"},

            { isMenuYes: false, route: "search-language"},
            { isMenuYes: false, route: "add-language"},
            { isMenuYes: false, route: "view-language"},
            { isMenuYes: false, route: "edit-language"},

            { isMenuYes: false, route: "search-faq-category"},
            { isMenuYes: false, route: "add-faq-category"},
            { isMenuYes: false, route: "view-faq-category"},
            { isMenuYes: false, route: "edit-faq-category"},

            { isMenuYes: false, route: "search-about-us-category"},
            { isMenuYes: false, route: "add-about-us-category"},
            { isMenuYes: false, route: "view-about-us-category"},
            { isMenuYes: false, route: "edit-about-us-category"},

            { isMenuYes: false, route: "search-feedback"},
            { isMenuYes: false, route: "add-feedback"},
            { isMenuYes: false, route: "view-feedback"},
            { isMenuYes: false, route: "edit-feedback"},

            // { isMenuYes: false, route: "search-partner"},
            // { isMenuYes: false, route: "add-partner"},
            // { isMenuYes: false, route: "view-partner"},
            // { isMenuYes: false, route: "edit-partner"},

            { isMenuYes: false, route: "search-enquiry-type"},
            { isMenuYes: false, route: "add-enquiry-type"},
            { isMenuYes: false, route: "view-enquiry-type"},
            { isMenuYes: false, route: "edit-enquiry-type"},

            // { isMenuYes: false, route: "add-taxation"}
           { isMenuYes: false, route: "add-product-tag"}

          ]
        },
        {
          menuId: 1006001,
          displayName: "Delivery Charges",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "delivery-charges",
          checked: false,
          children: []
        },
        {
          menuId: 1003,
          displayName: "Brand Management",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-brand-management",
          checked: false,
          children: [
            { isMenuYes: false, route: "add-brands-management"},
            { isMenuYes: false, route: "view-brand-management"},
            { isMenuYes: false, route: "edit-brand-management"}
          ]
        },
        {
          menuId: 1004,
          displayName: "Banner Management",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-banner",
          checked: false,
          children: [
            {
              menuId: 1004001,
              displayName: "Create",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "add-banner",
              checked: false,
              children: []
            },
            {
              menuId: 1004002,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "view-banner",
              checked: false,
              children: []
            },
            {
              menuId: 1004003,
              displayName: "Edit",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "edit-banner",
              checked: false,
              children: []
            },
            {
              menuId: 1004004,
              displayName: "Search",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "search-banner",
              checked: false,
              children: []
            }
          ]
        },
        // {
        //   menuId: 1006,
        //   displayName: "File Gallery",
        //   isMenuYes: true,
        //   isMasterYes: false,
        //   isChildDisplayYes: false,
        //   iconName: "",
        //   route: "create-file-gallery",
        //   checked: false,
        //   children: [
        //     {
        //       menuId: 1006001,
        //       displayName: "Create",
        //       isMenuYes: false,
        //       isMasterYes: false,
        //       isChildDisplayYes: false,
        //       iconName: "",
        //       route: "create-file-gallery",
        //       checked: false,
        //       children: []
        //     },  
        //   ]
        // },
        {
          menuId: 1005,
          displayName: "File Upload",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "",
          checked: false,
          children: [
            {
              menuId: 1005001,
              displayName: "Upload",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "create-upload",
              checked: false,
              children: []
            },
            {
              menuId: 1005002,
              displayName: "View Uploads",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "view-upload",
              checked: false,
              children: []
            }
          ]
        }
      ]
    },
    {
      menuId: 2,
      displayName: "Stores",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/storemanagement_ico.png",
      route: "",
      checked: false,
      children: [
        {
          menuId: 2001,
          displayName: "Search",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "search-store",
          checked: false,
          children: []
        },
        {
          menuId: 2002,
          displayName: "Add",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "add-store",
          checked: false,
          children: []
        },
        {
          menuId: 2003,
          displayName: "View",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "view-store",
          checked: false,
          children: []
        },
        {
          menuId: 2004,
          displayName: "Update",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "edit-store",
          checked: false,
          children: []
        },
        {
          menuId: 2005,
          displayName: "Amenities",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-amenities",
          checked: false,
          children: [
            {
              menuId: 2005001,
              displayName: "Search",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "search-amenities",
              checked: false,
              children: []
            },
            {
              menuId: 2005002,
              displayName: "Add",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "add-amenities",
              checked: false,
              children: []
            },
            {
              menuId: 2005003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "view-amenities",
              checked: false,
              children: []
            },
            {
              menuId: 2005004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "edit-amenities",
              checked: false,
              children: []
            }
          ]
        },
        {
          menuId: 2006,
          displayName: "Delivery Areas",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-delivery-area",
          checked: false,
          children: [
            {
              menuId: 2006001,
              displayName: "Create",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "add-delivery-area",
              checked: false,
              children: []
            }, {
              menuId: 2006002,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "view-delivery-area",
              checked: false,
              children: []
            }, {
              menuId: 2006003,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "edit-delivery-area",
              checked: false,
              children: []
            }, {
              menuId: 2006004,
              displayName: "Search",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "search-delivery-area",
              checked: false,
              children: []
            }
          ]
        },
        {
          menuId: 2007,
          displayName: "Calendar",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "search-calendar",
          checked: false,
          children: [
            {
              menuId: 2007001,
              displayName: "Create",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "add-calendar",
              checked: false,
              children: []
            },
            {
              menuId: 2007002,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "view-calendar",
              checked: false,
              children: []
            },
            {
              menuId: 2007003,
              displayName: "update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "edit-calendar",
              checked: false,
              children: []
            },
            {
              menuId: 2007004,
              displayName: "Search",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: false,
              iconName: "",
              route: "search-calendar",
              checked: false,
              children: []
            }
          ]
        }
      ]
    },
    {
      menuId: 3,
      displayName: "Loyalty",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/loyalty_ico.png",
      route: "",
      checked: false,
      children: [
        {
          menuId: 3001,
          displayName: "Tier Qualifications",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "tier-qualification",
          checked: false,
          children: []
        },
        {
          menuId: 3002,
          displayName: "Role-Tier",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "role-tier-qualification",
          checked: false,
          children: []
        },
        {
          menuId: 3003,
          displayName: "Programs",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "",
          checked: false,
          children: [
            {
              menuId: 3003001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "search-programs",
              checked: false,
              children: []
            },
            {
              menuId: 3003002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "/add-programs",
              checked: false,
              children: []
            },
            {
              menuId: 3003003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "view-programs",
              checked: false,
              children: []
            },
            {
              menuId: 3003004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "edit-programs",
              checked: false,
              children: []
            },
            {
              menuId: 3003005,
              displayName: "Approval",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              route: "",
              checked: false,
              children: []
            }
          ]
        },
        {
          menuId: 3004,
          displayName: "Add Earn Rule",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "add-earn-rule/0",
          checked: false,
          children: [
          ]
        },
        {
          menuId: 3005,
          displayName: "Add Burn Rule",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          route: "add-burn-rule/0",
          checked: false,
          children: [
          ]
        }
      ]
    },
    // {
    //   menuId: 4,
    //   displayName: "Gift Cards Management",
    //   isMenuYes: true,
    //   isMasterYes: false,
    //   isChildDisplayYes: true,
    //   iconName: "assets/images/icons/loyalty_ico.png",
    //   route: "",
    //   checked: false,
    //   children: [
    //     {
    //       menuId: 4001,
    //       displayName: "Cards Template",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-card-template",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-card-template"},
    //         { isMenuYes: false, route: "view-card-template"},
    //         { isMenuYes: false, route: "edit-card-template"}
    //       ]
    //     },
    //     {
    //       menuId: 4002,
    //       displayName: "Gift Card",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-gift-card",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-gift-card"},
    //         { isMenuYes: false, route: "view-gift-card"},
    //         { isMenuYes: false, route: "edit-gift-card"}
    //       ]
    //     },
    //     {
    //       menuId: 4003,
    //       displayName: "Corporate Account",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-corporate-account",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-corporate-account"},
    //         { isMenuYes: false, route: "view-corporate-account"},
    //         { isMenuYes: false, route: "edit-corporate-account"}
    //       ]
    //     },
    //     {
    //       menuId: 4004,
    //       displayName: "Gifting",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-gifting",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-gifting"},
    //         { isMenuYes: false, route: "view-gifting"},
    //         { isMenuYes: false, route: "edit-gifting"}
    //       ]
    //     },
    //     {
    //       menuId: 4005,
    //       displayName: "Recipient List",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: true,
    //       iconName: "",
    //       route: "search-recipient",
    //       checked: false,
    //       children: []
    //     },

    //     {
    //       menuId: 4006,
    //       displayName: "Physical Cards",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-physical-cards",
    //       checked: false,
    //       children: [{ isMenuYes: false, route: "generate-code"}]
    //     },

    //     {
    //       menuId: 4007,
    //       displayName: "Assign Physical Cards",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-assign-physical-cards",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-assign-physical-cards"},
    //         { isMenuYes: false, route: "view-assign-physical-cards"},
    //         { isMenuYes: false, route: "edit-assign-physical-cards"}
    //       ]
    //     },

    //     {
    //       menuId: 4008,
    //       displayName: "Search Gift Cards",
    //       isMenuYes: true,
    //       isMasterYes: false,
    //       isChildDisplayYes: false,
    //       iconName: "",
    //       route: "search-search-gift-cards",
    //       checked: false,
    //       children: [
    //         { isMenuYes: false, route: "add-search-gift-cards"},
    //         { isMenuYes: false, route: "view-search-gift-cards"},
    //         { isMenuYes: false, route: "edit-search-gift-cards"}
    //       ]
    //     },


    //     {
    //       menuId: 4009,
    //       displayName: "Gift card Approve Button",
    //       isMenuYes: false,
    //       isMasterYes: false,
    //       isChildDisplayYes: true,
    //       iconName: "",
    //       route: "",
    //       checked: false,
    //       children: []
    //     },
    //     {
    //       menuId: 10006012,
    //       displayName: "Corporate Account Approve Button",
    //       isMenuYes: false,
    //       isMasterYes: false,
    //       isChildDisplayYes: true,
    //       iconName: "",
    //       route: "",
    //       checked: false,
    //       children: []
    //     }

    //   ]
    // },
    {
      menuId: 5,
      displayName: "User Management",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/usermanagement_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 5001,
          displayName: "Search User",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "search-user",
          children: []
        },
        {
          menuId: 5002,
          displayName: "Add User",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "add-user",
          children: []
        },
        {
          menuId: 5003,
          displayName: "View User",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "view-user",
          children: []
        },
        {
          menuId: 5004,
          displayName: "Update User",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "edit-user",
          children: []
        },
        {
          menuId: 5005,
          displayName: "Roles & Permissions",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-role",
          children: [
            {
              menuId: 5005001,
              displayName: "Search Role",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 5005002,
              displayName: "Add Role",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "create-role",
              children: []
            },
            {
              menuId: 5005003,
              displayName: "View Role",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-role",
              children: []
            },
            {
              menuId: 5005004,
              displayName: "Update Role",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-role",
              children: []
            }
          ]
        }
      ]
    },
    {
      menuId: 6,
      displayName: "Menu Management",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/productmanagement_ico.png",
      route: "",
      checked: false,
      children: [
        {
          menuId: 6001,
          displayName: "Variants",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-variants",
          children: [
            {
              menuId: 6001001,
              displayName: "Create Variants",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "add-variants",
              children: []
            },
            {
              menuId: 6001002,
              displayName: "View Variants",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-variants",
              children: []
            },
            {
              menuId: 6001003,
              displayName: "Update Variants",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-variants",
              children: []
            },
            {
              menuId: 6001004,
              displayName: "Search Variants",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        {
          menuId: 6002,
          displayName: "Category",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-category",
          children: [
            {
              menuId: 6002001,
              displayName: "Search categories",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 6002002,
              displayName: "Add categories",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "add-category",
              children: []
            },
            {
              menuId: 6002003,
              displayName: "View categories",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-category",
              children: []
            },
            {
              menuId: 6002004,
              displayName: "Update categories",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-category",
              children: []
            }
          ]
        },
        {
          menuId: 6003,
          displayName: "Products",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-products",
          children: [
            {
              menuId: 6003001,
              displayName: "Search products",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "search-products",
              children: []
            },
            {
              menuId: 6003002,
              displayName: "Add products",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "add-products",
              children: []
            },
            {
              menuId: 6003003,
              displayName: "View products",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-products",
              children: []
            },
            {
              menuId: 6003004,
              displayName: "Update products",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-products",
              children: []
            }
          ]
        },
        {
          menuId: 6003004,
          displayName: "Refresh Menu",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "refresh-cache",
          children: []
        },
        {
          menuId: 6004,
          displayName: "Add-ons",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-add-ons",
          children: [
            {
              menuId: 6004001,
              displayName: "Create Addon",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "add-add-ons",
              children: []
            },
            {
              menuId: 6004002,
              displayName: "View Addon",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-add-ons",
              children: []
            },
            {
              menuId: 6004003,
              displayName: "Update Addon",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-add-ons",
              children: []
            },
            {
              menuId: 6004004,
              displayName: "Search Addon",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        {
          menuId: 6005,
          displayName: "Combos",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-combo",
          children: [
            {
              menuId: 6005001,
              displayName: "Create Combo",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "add-combo",
              children: []
            },
            {
              menuId: 6005002,
              displayName: "View Combo",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-combo",
              children: []
            },
            {
              menuId: 6005003,
              displayName: "Update Combo",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "edit-combo",
              children: []
            },
            {
              menuId: 6005004,
              displayName: "Search Combo",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        }
      ]
    },
 // Order Mgmt

  {
    menuId: 14,
    displayName: "Order Management",
    isMenuYes: true,
    isMasterYes: false,
    isChildDisplayYes: true,
    iconName: "assets/images/icons/pressrelease_ico.png",
    checked: false,
    route: "",
    children: [
      {
        menuId: 10003011,
        displayName: "All Transactions",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "transaction-listing",
        children: []
      },
      {
        menuId: 14003,
        displayName: "New Orders",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "new-orders-listing",
        children: []
      },
      {
        menuId: 14001,
        displayName: "Live Orders",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "live-orders-listing",
        children: []
      },
      {
        menuId: 14004,
        displayName: "Scheduled Orders",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "scheduled-orders-listing",
        children: []
      },
      {
        menuId: 14002,
        displayName: "App Transactions",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "transactions-listing",
        children: []
      },
      {
        menuId: 14005,
        displayName: "Feedback & Enquiry",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "search-feedback-and-enquiry",
        children: []
      },
      {
        menuId: 14009,
        displayName: "PG Transaction",
        isMenuYes: true,
        isMasterYes: false,
        isChildDisplayYes: true,
        iconName: "",
        checked: false,
        route: "search-pg-transaction",
        children: []
      }
      // {
      //   menuId: 14006,
      //   displayName: "TH Reports",
      //   isMenuYes: true,
      //   isMasterYes: false,
      //   isChildDisplayYes: false,
      //   iconName: "",
      //   checked: false,
      //   route: "tim-reports",
      //   children: []
      // }
    ]
  },
  // Order Management Danbro

  // {
  //   menuId: 14,
  //   displayName: "Order Management",
  //   isMenuYes: true,
  //   isMasterYes: false,
  //   isChildDisplayYes: true,
  //   iconName: "assets/images/icons/faq_ico.png",
  //   checked: false,
  //   route: "",
  //   children: [
  //     {
  //       menuId: 10003011,
  //       displayName: "Transactions",
  //       isMenuYes: true,
  //       isMasterYes: false,
  //       isChildDisplayYes: true,
  //       iconName: "",
  //       checked: false,
  //       route: "transaction-listing",
  //       children: []
  //     },
  //   ]
  // },

    {
      menuId: 7,
      displayName: "Member Management",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/membermanagement_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 7001,
          displayName: "Enquiries",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-enquiries",
          children: [
            {
              menuId: 7001001,
              displayName: "Search Enquiries",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "search-enquiries",
              children: []
            },
            {
              menuId: 7001002,
              displayName: "View Enquiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-enquiries",
              children: []
            },
            {
              menuId: 7001003,
              displayName: "Update Enquiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7001004,
              displayName: "Export Sheet",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        {
          menuId: 7002,
          displayName: "Transaction Request",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-transaction-request",
          children: [
            {
              menuId: 7002001,
              displayName: "View Transaction Request",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7002002,
              displayName: "Update Transaction Request",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7002003,
              displayName: "Export Sheet",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            // {
            //   menuId: 7002004,
            //   displayName: "ADD_TRANSACTION_REQUEST",
            //   isMenuYes: false,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   checked: false,
            //   iconName: "",
            //   route: "",
            //   children: []
            // },
          ]
        },
        {
          menuId: 7003,
          displayName: "View Members",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          iconName: "",
          route: "search-member",
          children: [
            {
              menuId: 7003001,
              displayName: "View Member",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "view-member",
              children: []
            }
          ]
        },
        {
          menuId: 7004,
          displayName: "Basic Details",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          checked: false,
          iconName: "",
          route: "",
          children: [
            {
              menuId: 7004001,
              displayName: "Make member offline",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7004002,
              displayName: "Edit profile",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7004003,
              displayName: "Send OTP",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7004004,
              displayName: "Send Email Verification",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7004005,
              displayName: "Extend points Expiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7004006,
              displayName: "Change tier",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        {
          menuId: 7005,
          displayName: "Transactions",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          checked: false,
          iconName: "",
          route: "",
          children: [
            {
              menuId: 7005001,
              displayName: "View Transactions",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7005002,
              displayName: "Add Transactions",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7005003,
              displayName: "Update Transaction Details",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            // {
            //   menuId: 7005004,
            //   displayName: "Transaction Based Search",
            //   isMenuYes: false,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   checked: false,
            //   iconName: "",
            //   route: "",
            //   children: []
            // }
          ]
        },
        {
          menuId: 7006,
          displayName: "Points",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          checked: false,
          iconName: "",
          route: "",
          children: [
            {
              menuId: 7006001,
              displayName: "View Points",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7006002,
              displayName: "Manual Debit/Credit",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        {
          menuId: 7007,
          displayName: "Enquiry",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          checked: false,
          iconName: "",
          route: "",
          children: [
            {
              menuId: 7007001,
              displayName: "View Enquiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7007002,
              displayName: "Add Enquiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            },
            {
              menuId: 7007003,
              displayName: "Update Enquiry",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              checked: false,
              iconName: "",
              route: "",
              children: []
            }
          ]
        },
        // {
        //   menuId: 7008,
        //   displayName: "EDIT_MEMBERS",
        //   isMenuYes: false,
        //   isMasterYes: false,
        //   isChildDisplayYes: true,
        //   checked: false,
        //   iconName: "",
        //   route: "",
        //   children: []
        // }
      ]
    },
    {
      menuId: 15,
      displayName: "E Wallet",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/E_wallet_icon.png",
      checked: false,
      route: "search-eWallet",
      // children: [
      //   {
      //     menuId: 15001,
      //     displayName: "Search",
      //     isMenuYes: true,
      //     isMasterYes: false,
      //     isChildDisplayYes: true,
      //     iconName: "",
      //     checked: false,
      //     route: "search-eWallet",
      //     children: []
      //   },
      //   {
      //     menuId: 15002,
      //     displayName: "Add",
      //     isMenuYes: true,
      //     checked: false,
      //     isMasterYes: false,
      //     isChildDisplayYes: true,
      //     iconName: "",
      //     route: "create-eWallet",
      //     children: []
      //   },
      //   {
      //     menuId: 15003,
      //     displayName: "View",
      //     isMenuYes: false,
      //     isMasterYes: false,
      //     isChildDisplayYes: true,
      //     iconName: "",
      //     checked: true,
      //     route: "view-eWallet",
      //     children: []
      //   },
      //   {
      //     menuId: 15004,
      //     displayName: "Update",
      //     isMenuYes: false,
      //     isMasterYes: false,
      //     isChildDisplayYes: true,
      //     iconName: "",
      //     checked: true,
      //     route: "edit-eWallet",
      //     children: []
      //   }
      // ]
    },
    {
      menuId: 8,
      displayName: "Marketing",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/couponmanagement_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 8001,
          displayName: "Templates",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "",
          children: [
            {
              menuId: 8001001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-template",
              children: []
            },
            {
              menuId: 8001002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-template",
              children: []
            },
            {
              menuId: 8001003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              iconName: "",
              checked: false,
              route: "view-template",
              children: []
            },
            {
              menuId: 8001004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              iconName: "",
              checked: false,
              route: "edit-template",
              children: []
            }
          ]
        },
        {
          menuId: 8002,
          displayName: "Customer Segments",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "",
          children: [
            {
              menuId: 8002001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-customer-segments",
              children: []
            },
            {
              menuId: 8002002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-customer-segments",
              children: []
            },
            {
              menuId: 8002003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-customer-segments",
              children: []
            },
            {
              menuId: 8002004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-customer-segments",
              children: []
            }
          ]
        },
        {
          menuId: 8003,
          displayName: "Coupons",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "",
          children: [
            {
              menuId: 8003001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-coupons",
              children: []
            },
            {
              menuId: 8003002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-coupons",
              children: []
            },
            {
              menuId: 8003003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-coupons",
              children: []
            },
            {
              menuId: 8003004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-coupons",
              children: []
            }
          ]
        },
        {
          menuId: 8004,
          displayName: "Campaigns",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "",
          children: [
            {
              menuId: 8004001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-campaign",
              children: []
            },
            {
              menuId: 8004002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-campaign",
              children: []
            },
            {
              menuId: 8004003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-campaign",
              children: []
            },
            {
              menuId: 8004004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-campaign",
              children: []
            }
          ]
        },
        {
          menuId: 8005,
          displayName: "Notifications",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "",
          children: [
            {
              menuId: 8005001,
              displayName: "Search",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-notifications",
              children: []
            },
            {
              menuId: 8005002,
              displayName: "Add",
              isMenuYes: true,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-notifications",
              children: []
            },
            {
              menuId: 8005003,
              displayName: "View",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-notifications",
              children: []
            },
            {
              menuId: 8005004,
              displayName: "Update",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-notifications",
              children: []
            }
          ]
        }
      ]
    },
    {
      menuId: 9,
      displayName: "Reports",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: false,
      iconName: "assets/images/icons/reports_ico.png",
      checked: false,
      route: "reports",
      children: []
    },
    {
      menuId: 10,
      displayName: "Feedback",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/productmanagement_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 10006001,
          displayName: "Feeback Survey",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          checked: false,
          route: "search-feedbacksurvey",
          children: [
            {
              menuId: 10006005,
              displayName: "Add Feeback Survey",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-feedbacksurvey",
              children: []
            },
            {
              menuId: 10006003,
              displayName: "View Feeback Survey",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-feedbacksurvey",
              children: []
            },

            {
              menuId: 10006002,
              displayName: "Update Feeback Survey",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-feedbacksurvey",
              children: []
            },
            {
              menuId: 10001004,
              displayName: "Search Feeback Survey",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-feedbacksurvey",
              children: []
            },
            {
              menuId: 10006004,
              displayName: "Send For Approval Button",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-feedbacksurvey",
              children: []
            }
          ]
        },
        {
          menuId: 10001,
          displayName: "Kiosk",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          checked: false,
          route: "search-kiosk",
          children: [
            {
              menuId: 10001001,
              displayName: "Add Kiosk",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "add-kiosk",
              children: []
            },
            {
              menuId: 10001002,
              displayName: "View Kiosk",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-kiosk",
              children: []
            },
            {
              menuId: 10001003,
              displayName: "Update Kiosk",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-kiosk",
              children: []
            },
            {
              menuId: 10001004,
              displayName: "Search Kiosk",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-kiosk",
              children: []
            }
          ]
        },
        {
          menuId: 10005,
          displayName: "Alerts",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          checked: false,
          route: "search-kiosk-alerts",
          children: [
            {
              menuId: 10005001,
              displayName: "Search Alerts",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-kiosk-alerts",
              children: []
            },
            {
              menuId: 10006009,
              displayName: "Update Alert Status",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "",
              children: []
            },
          ]
        },
        {
          menuId: 10002,
          displayName: "Flow",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          checked: false,
          route: "search-flow",
          children: [
            {
              menuId: 10002001,
              displayName: "Create Flow",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "create-flow",
              children: []
            },
            {
              menuId: 10002002,
              displayName: "Search Flow",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "search-flow",
              children: []
            },
            {
              menuId: 10002003,
              displayName: "View Flow",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "view-flow",
              children: []
            },
            {
              menuId: 10002004,
              displayName: "Edit Flow",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "edit-flow",
              children: []
            },
          ]
        },
        {
          menuId: 10003,
          displayName: "Notifications",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          iconName: "",
          checked: false,
          route: "feedback-search-notifications",
          children: [
            {
              menuId: 10003001,
              displayName: "Search Notification",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "feedback-search-notifications",
              children: []
            },
            {
              menuId: 10003002,
              displayName: "View Notification",
              isMenuYes: false,
              isMasterYes: false,
              isChildDisplayYes: true,
              iconName: "",
              checked: false,
              route: "feedback-view-notifications",
              children: []
            }
          ]
        },
        // {
        //   menuId: 10007,
        //   displayName: "NPS Design",
        //   isMenuYes: true,
        //   isMasterYes: false,
        //   isChildDisplayYes: false,
        //   // iconName: "assets/images/icons/reports_ico.png",
        //   checked: false,
        //   route: "nps-Design",
        //   children: []
        // },
        {
          menuId: 10007,
          displayName: "NPS Design",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          route: "nps-Design",
          children: []
        },
        {
          menuId: 10004,
          displayName: "Reports",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: false,
          checked: false,
          route: "feedback-kiosk-reports",
          children: [
            // {
            //   menuId: 10004001,
            //   displayName: "Flow Summary",
            //   isMenuYes: true,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   iconName: "",
            //   checked: false,
            //   route: "flow-performance",
            //   children: []
            // },
            // {
            //   menuId: 10004002,
            //   displayName: "Brand Summary",
            //   isMenuYes: true,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   iconName: "",
            //   checked: false,
            //   route: "feedback-report",
            //   children: []
            // },
            // {
            //   menuId: 10004003,
            //   displayName: "Kiosk Summary",
            //   isMenuYes: true,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   iconName: "",
            //   checked: false,
            //   route: "kiosk-report",
            //   children: []
            // },
            // {
            //   menuId: 10004004,
            //   displayName: "Dropoff Summary",
            //   isMenuYes: true,
            //   isMasterYes: false,
            //   isChildDisplayYes: true,
            //   iconName: "",
            //   checked: false,
            //   route: "incomplete-report",
            //   children: []
            // }
          ]
        }
      ]
    },
    {
      menuId: 11,
      displayName: "FAQ",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/faq_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 11001,
          displayName: "Search",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "search-faq",
          children: []
        },
        {
          menuId: 11002,
          displayName: "Add",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "add-faq",
          children: []
        },
        {
          menuId: 11003,
          displayName: "View",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "view-faq",
          children: []
        },
        {
          menuId: 11004,
          displayName: "Update",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "edit-faq",
          children: []
        }
      ]
    },
    {
      menuId: 12,
      displayName: "About Us",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/about_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 12001,
          displayName: "Search",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "search-about-us",
          children: []
        },
        {
          menuId: 12002,
          displayName: "Add",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "add-about-us",
          children: []
        },
        {
          menuId: 12003,
          displayName: "View",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "view-about-us",
          children: []
        },
        {
          menuId: 12004,
          displayName: "Update",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "edit-about-us",
          children: []
        }
      ]
    },
    {
      menuId: 13,
      displayName: "Press Release",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "assets/images/icons/pressrelease_ico.png",
      checked: false,
      route: "",
      children: [
        {
          menuId: 13001,
          displayName: "Search",
          isMenuYes: true,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "search-press-release",
          children: []
        },
        {
          menuId: 13002,
          displayName: "Add",
          isMenuYes: true,
          checked: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          route: "add-press-release",
          children: []
        },
        {
          menuId: 13003,
          displayName: "View",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "view-press-release",
          children: []
        },
        {
          menuId: 13004,
          displayName: "Update",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: true,
          route: "edit-press-release",
          children: []
        }
      ]
    },

////events , gifting & location
{
  menuId: 17,
  displayName: "Events",
  isMenuYes: true,
  isMasterYes: false,
  isChildDisplayYes: true,
   iconName: "assets/images/icons/event.svg",
  checked: false,
  route: "",
  children: [
    {
      menuId: 17001,
      displayName: "Add",
      isMenuYes: false,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "",
      checked: false,
      route: "add-events",
      children: []
    },
    {
      menuId: 17002,
      displayName: "edit",
      isMenuYes: false,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "",
      checked: true,
      route: "edit-events",
      children: []
    },
    {
      menuId: 17003,
      displayName: "Search",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "",
      checked: false,
      route: "search-events",
      children: []
    },

    {
      menuId: 17004,
      displayName: "Update",
      isMenuYes: false,
      isMasterYes: false,
      isChildDisplayYes: true,
      iconName: "",
      checked: true,
      route: "view-events",
      children: []
    },


    {
      menuId: 17005,
      displayName: "Locations",
      isMenuYes: true,
      isMasterYes: false,
      isChildDisplayYes: false,
      iconName: "",
      checked: false,
      route: "search-locations",
      children: [
        {
          menuId: 17005002,
          displayName: "View Location",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "view-location",
          children: []
        },
        {
          menuId: 17005001,
          displayName: "Add Location",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "add-location",
          children: []
        },
        {
          menuId: 17005004,
          displayName: "Edit Location",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "edit-location",
          children: []
        },
        {
          menuId: 17005003,
          displayName: "Search Location",
          isMenuYes: false,
          isMasterYes: false,
          isChildDisplayYes: true,
          iconName: "",
          checked: false,
          route: "search-locations",
          children: []
        }
      ]
    }
  ]
}
    //EGL end

  ]
}
