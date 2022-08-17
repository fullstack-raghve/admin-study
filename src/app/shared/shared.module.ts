import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginLayoutComponent } from '../layouts/login-layout/login-layout.component';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { TopNavComponent } from './components/top-Nav/top-Nav.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { addBeaconsDialog } from '../shared/components/add-beacons-dialog/add-beacons.component';
import { addStoreDialog } from './components/add-store-dialog/add-store.component';
import { storeStaffDialog } from '../shared/components/store-staff-dialog/storestaff.component';
import { segmentRuleDialog } from '../shared/components/segment-rule-dialog/segment-rule.component';
import { addRulesDialog } from '../shared/components/rule-dialog/add-rule.component';
import { productsDialog } from '../shared/components/products-dialog/products-dialog.component';
import { addCouponDialog } from '../shared/components/coupon-dialog/add-coupon.component';
import { storeContactDialog } from '../shared/components/store-contact-dialog/store-contact.component';
import { addAttributesDialog } from '../shared/components/attributes-dialog/attributes.component';
import { editStoreDialog } from '../shared/components/edit-store-dialog/edit-store.component';
import { storeAmenitiesDialog } from '../modules/configurations/storeManagement/store-amenities-dialog/store-amenites.component';
import { AreaMappingDialog } from '../modules/configurations/storeManagement/area-mapping-dialog/area-mapping.component';
import { notificationDialog } from '../shared/components/notification-dialog/notification.component';
import { spinnerComponent } from '../shared/components/spinner-component/spinner-component';
import { SelectedstoreDataComponent } from '../modules/giftCardManagement/assign-physical-cards/selectedstore-data/selectedstore-data.component';
import { SelectedFeedbacksurveyflowComponent } from "../modules/feedback/feedback-survey/selected-feedbacksurveyflow/selected-feedbacksurveyflow.component";
import { selectStoreDialog } from './components/select-store-dialog/select-store.component';
import { selectStoreVariantDialog } from './components/select-store-variant-dialog/select-store-variant.component';
import { productOnlineOfflineDialog } from './components/product-online-offline-dialogue/product-online-offline-dialogue.component';
import { AddFlowNameComponent } from '../modules/feedback/flow/create-flow/add-flow-name/add-flow-name.component';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCheckboxModule,
  MatSortModule,
  MatPaginatorModule, MatTableModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from '../directives/onlyNumbers.directive';
import { FormatTimePipe } from '../directives/counter.directive';
import { spaceTrimDirective } from '../directives/spaceTrim.directive'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/components/left-Nav/app-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './components/footer/footer.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { UploadFile } from '../services/uploadFile.service';
import { uploadBonusFile } from '../services/uploadBonus.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QueryBuilderModule } from "angular2-query-builder";
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { KioskSelectedUserComponent } from '../modules/feedback/kiosk/kiosk-selected-user/kiosk-selected-user.component';
import { TxnAddedSuccessfullyDialogComponent } from '../modules/memberManagement/members/view-member/txn-added-successfully-dialog/txn-added-successfully-dialog.component';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';
import { AddFlowDialogComponent } from './components/add-flow-dialog/add-flow-dialog.component';
import { DieatryImageDialog } from '../modules/menuManagement/products/dieatry-image-dialog/dieatry-image-dialog.component';
import { AlergionImageDialog } from '../modules/menuManagement/products/alergion-image-dialog/alergion-image-dialog.component';
import { SelectedFeedbackFlowComponent } from '../modules/feedback/kiosk/selected-feedback-flow/selected-feedback-flow.component';
import { AlertMessageDialogComponent } from './components/alert-message-dialog/alert-message-dialog.component';
import { AddMultiselectComponent } from './components/add-multiselect/add-multiselect.component';
import { ViewStoreDialogComponent } from './components/view-store-dialog/view-store-dialog.component';
import { SelectedGiftCardComponent } from '../modules/giftCardManagement/corporateAccount/selected-gift-card/selected-gift-card.component';
import { CorporateAdduserDialogComponent } from '../modules/giftCardManagement/corporateAccount/corporate-adduser-dialog/corporate-adduser-dialog.component';
import { CorporateAdddeductDialogComponent } from '../modules/giftCardManagement/corporateAccount/corporate-adddeduct-dialog/corporate-adddeduct-dialog.component';
import { CorporateAccountDeductDialogComponent } from '../modules/giftCardManagement/corporateAccount/corporate-account-deduct-dialog/corporate-account-deduct-dialog.component';
import { CorporateAccountHistoryComponent } from '../modules/giftCardManagement/corporateAccount/corporate-account-history/corporate-account-history.component';
import { TermConditionDialogComponent } from '../modules/giftCardManagement/gifting/term-condition-dialog/term-condition-dialog.component';
import { SelectRecipientDialogComponent } from '../modules/giftCardManagement/gifting/add-gifting/select-recipient-dialog/select-recipient-dialog.component';
import { BulkUploadComponent } from '../modules/giftCardManagement/recipient/search-recipient/bulk-upload/bulk-upload.component';
import { AddRecipientComponent } from '../modules/giftCardManagement/recipient/add-recipient/add-recipient/add-recipient.component';
import { ViewRecipientComponent } from '../modules/giftCardManagement/recipient/view-recipient/view-recipient/view-recipient.component';
import { ViewGiftCardProductDialogComponent } from '../modules/giftCardManagement/giftCard/view-gift-card/view-gift-card-product-dialog/view-gift-card-product-dialog.component';
import { EditRecipientComponent } from  '../modules/giftCardManagement/recipient/edit-recipient/edit-recipient/edit-recipient.component';
import { ViewHistoryDialogComponent } from '../modules/giftCardManagement/search gift card/view-history-dialog/view-history-dialog.component';
import { EditHistoryDialogComponent } from '../modules/giftCardManagement/search gift card/edit-history-dialog/edit-history-dialog.component';
import { AddSearchGiftCardCardStatusDialogComponent } from '../modules/giftCardManagement/search gift card/add-search-gift-cards/add-search-gift-card-card-status-dialog/add-search-gift-card-card-status-dialog.component';
import { EditSearchGiftCardRedeemedDialogComponent } from '../modules/giftCardManagement/search gift card/edit-search-gift-cards/edit-search-gift-cards/edit-search-gift-card-redeemed-dialog/edit-search-gift-card-redeemed-dialog.component';
import { ViewGiftingTncDialogComponent } from '../modules/giftCardManagement/gifting/view-gifiting/view-gifting-tnc-dialog/view-gifting-tnc-dialog.component';
import {SelectKioskDialogComponent} from '../modules/feedback/select-kiosk-dialog/select-kiosk-dialog.component'
import { SortByPipe } from '../pipes/sort-by.pipe';
import { TruncatePipe } from '../pipes/limitTo.pipe';
import { ToDateObjPipe } from '../pipes/datepipe';
import { DateTimePipe } from '../pipes/date-time.pipe';
import { GenerateQrCodeComponent } from '../modules/feedback/kiosk/generate-qr-code/generate-qr-code.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SafePipe } from '../pipes/safePipe';
import {SelectGiftcardTemplateComponent} from '../modules/giftCardManagement/giftCard/select-giftcard-template/select-giftcard-template.component'
import {SkuDialogComponent} from '../modules/giftCardManagement/giftCard/sku-dialog/sku-dialog.component';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import {ConfirmDialogComponent} from '../modules/feedback/feedback-survey/confirm-dialog/confirm-dialog.component';
import { SafeHTMLPipe } from '../pipes/safe-html.pipe';
import {DefaultDialogComponent} from '../modules/feedback/nps-design/default-dialog/default-dialog.component';
import { AuditlogDialogComponent } from './components/auditlog-dialog/auditlog-dialog.component';
import { OrderDescriptionDetailsComponent } from './components/orderManagement/order-description-details/order-description-details.component';
// import { PrintInvoiceComponent } from './components/orderManagement/print-invoice/print-invoice-dialog.component';
import { OrderEnquiryComponent } from './components/orderManagement/order-enquiry/order-enquiry.component';
import { RejectOrderDialogComponent } from './components/orderManagement/reject-order-dialog/reject-order-dialog.component';
import { ModifyOrderDialogComponent } from './components/orderManagement/modify-order-dialog/modify-order-dialog.component';
import { OrderTrackingComponent } from './components/orderManagement/order-tracking/order-tracking.component';
import {ProductDialogComponent} from './components/menuManagement/product-dialog/product-dialog.component';
import { EditStoreContactDialog } from './components/edit-store-contact/edit-store-contact.component';
import {DenominationDialog} from '../modules/orderManagement/cart-configuration/denomination-dialog/denomination-dialog.component';
import { ErrorMessagesDialogComponent } from './components/orderManagement/error-messages-dialog/error-messages-dialog.component';
import { StoresDialogComponent } from './components/stores-dialog/stores-dialog.component';
import {CategoryPopupComponent} from './components/menuManagement/categoryPopup/categoryPopup.component';
import {ProductPopupComponent} from './components/menuManagement/productPopup/productPopup.component';
import {ComboStorePopupComponent} from './components/menuManagement/combo-store-popup/store-popup.component'
import {VarientDialogComponent} from './components/menuManagement/varientDialog/varientDialog.component';
import { DxSelectBoxModule, DxListModule, DxTemplateModule } from 'devextreme-angular';
import { SelectProductDailogComponent } from './components/select-product-dailog/select-product-dailog.component';
import { SelectCategoryDailogComponent } from './components/select-category-dailog/select-category-dailog.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { CouponProductsDialogComponent } from './components/coupon-products-dialog/coupon-products-dialog.component';
import { CouponVariantDialogComponent } from './components/coupon-variant-dialog/coupon-variant-dialog.component';

import { SelectLocationDialogComponent } from '../modules/events/select-location-dialog/select-location-dialog.component';
import { UserLocationDialogComponent } from '../modules/events/user-location-dialog/user-location-dialog.component';
import { GiftingLimitDialogComponent } from '../modules/events/gifting-limit-dialog/gifting-limit-dialog.component';
import { ViewGiftingLimitComponent } from '../modules/events/view-gifting-limit/view-gifting-limit.component';
import { SelectProductItemsDialogComponent } from '../modules/events/select-product-items-dialog/select-product-items-dialog.component';
import { SelectCouponDialogeComponent } from '../modules/events/select-coupon-dialoge/select-coupon-dialoge.component';
import { EventsStoreDialogComponent } from '../modules/events/events-store-dialog/events-store-dialog.component';
import { EditGiftingLimitDialogComponent } from '../modules/events/edit-gifting-limit-dialog/edit-gifting-limit-dialog.component';
import { EventDialogComponent } from './components/event-dialog/event-dialog.component';



 @NgModule({
  declarations: [
    LoginLayoutComponent,
    DashboardLayoutComponent,
    TopNavComponent,
    ProductDialogComponent,
    EditStoreContactDialog,
    FooterComponent,
    BreadcrumbComponent,
    SnackBarComponent,
    addStoreDialog,
    selectStoreDialog,
    selectStoreVariantDialog,
    addBeaconsDialog,
    storeStaffDialog,
    segmentRuleDialog,
    addRulesDialog,
    addCouponDialog,
    EventDialogComponent,
    storeContactDialog,
    addAttributesDialog,
    SelectedstoreDataComponent,
    editStoreDialog,
    productOnlineOfflineDialog,
    OnlyNumberDirective,
    FormatTimePipe,
    notificationDialog,
    spinnerComponent,
    productsDialog,
    spaceTrimDirective,
    storeAmenitiesDialog,
    AreaMappingDialog,
    TxnAddedSuccessfullyDialogComponent,
    KioskSelectedUserComponent,
    TinyMceComponent,
    AddFlowDialogComponent,
    DieatryImageDialog,
    AlergionImageDialog,
    SelectedFeedbackFlowComponent,
    AlertMessageDialogComponent,
    AddMultiselectComponent,
    ViewStoreDialogComponent,
    SortByPipe,
    TruncatePipe,
    DateTimePipe,
    ToDateObjPipe,
    GenerateQrCodeComponent,
    SelectedGiftCardComponent,
    SelectGiftcardTemplateComponent,
    SkuDialogComponent,
    CorporateAdduserDialogComponent,
    CorporateAdddeductDialogComponent,
    CorporateAccountDeductDialogComponent,
    CorporateAccountHistoryComponent,
    TermConditionDialogComponent,
    SelectRecipientDialogComponent,
    AddRecipientComponent,
    BulkUploadComponent,
    ViewRecipientComponent,
    EditRecipientComponent,
    ViewHistoryDialogComponent,
    EditHistoryDialogComponent,
    ViewGiftingTncDialogComponent,
    EditSearchGiftCardRedeemedDialogComponent,
    AddSearchGiftCardCardStatusDialogComponent,
    ViewGiftCardProductDialogComponent,
    SafePipe,
    SelectedFeedbacksurveyflowComponent,
    SelectKioskDialogComponent,
    ConfirmDialogComponent,
    SafeHTMLPipe,
    DefaultDialogComponent,
    AuditlogDialogComponent,
    OrderDescriptionDetailsComponent,
    OrderEnquiryComponent,
    RejectOrderDialogComponent,
    // PrintInvoiceComponent,
    ErrorMessagesDialogComponent,
    DenominationDialog,
    OrderTrackingComponent,
    ModifyOrderDialogComponent,
    AddFlowNameComponent,
    StoresDialogComponent,
    CategoryPopupComponent,
    ProductPopupComponent,
    VarientDialogComponent,
    ComboStorePopupComponent,
    SelectProductDailogComponent,
    SelectCategoryDailogComponent,
    CategoryDialogComponent,
    CouponProductsDialogComponent,
    CouponVariantDialogComponent,
    SelectLocationDialogComponent,

UserLocationDialogComponent,
GiftingLimitDialogComponent,
ViewGiftingLimitComponent,
EditGiftingLimitDialogComponent,
SelectProductItemsDialogComponent,
SelectCouponDialogeComponent,
EventsStoreDialogComponent,

  ],
  imports: [
    DxSelectBoxModule, DxListModule, DxTemplateModule,
    CommonModule,
    MatAutocompleteModule,
    RouterModule,
    MaterialModule,
    NgbModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
    LayoutModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSortModule,
    CdkTableModule,
    MatSnackBarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatPaginatorModule,
    CdkTableModule,
    MatTableModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    EditorModule,
    QueryBuilderModule,
    MatStepperModule,
    EditorModule,
    MatExpansionModule,
    MatCardModule,
    MalihuScrollbarModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SelectAutocompleteModule,
    NgxQRCodeModule,
  ],
  exports: [
    RouterModule,
    ProductDialogComponent,
    LoginLayoutComponent,
    DashboardLayoutComponent,
    MatToolbarModule,
    MatButtonModule,
    productOnlineOfflineDialog,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSortModule,
    BreadcrumbComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    EditorModule,
    QueryBuilderModule,
    MatStepperModule,
    MatExpansionModule,
    OnlyNumberDirective,
    FormatTimePipe,
    spaceTrimDirective,
    spinnerComponent,
    MatCardModule,
    KioskSelectedUserComponent,
    TxnAddedSuccessfullyDialogComponent,
    TinyMceComponent,
    AddFlowDialogComponent,
    SelectedFeedbackFlowComponent,
    AddMultiselectComponent,
    SortByPipe,
    TruncatePipe,
    DateTimePipe,
    ToDateObjPipe,
    SelectAutocompleteModule,
    GenerateQrCodeComponent,
    NgxQRCodeModule,
    SelectedGiftCardComponent,
    CorporateAdduserDialogComponent,
    CorporateAdddeductDialogComponent,
    CorporateAccountDeductDialogComponent,
    CorporateAccountHistoryComponent,
    TermConditionDialogComponent,
    SelectRecipientDialogComponent,
    AddRecipientComponent,
    BulkUploadComponent,
    ViewRecipientComponent,
    EditRecipientComponent,
    ViewHistoryDialogComponent,
    EditHistoryDialogComponent,
    ViewGiftingTncDialogComponent,
    EditSearchGiftCardRedeemedDialogComponent,
    AddSearchGiftCardCardStatusDialogComponent,
    SelectGiftcardTemplateComponent,
    SkuDialogComponent,
    ViewGiftCardProductDialogComponent,
    SafePipe,
    SelectedFeedbacksurveyflowComponent,
    SelectKioskDialogComponent,
    ConfirmDialogComponent,
    SafeHTMLPipe,
    DefaultDialogComponent,
    AuditlogDialogComponent,
    OrderDescriptionDetailsComponent,
    OrderEnquiryComponent,
    RejectOrderDialogComponent,
    // PrintInvoiceComponent,
    ErrorMessagesDialogComponent,
    DenominationDialog,
    OrderTrackingComponent,
    ModifyOrderDialogComponent,
    StoresDialogComponent,
    AddFlowNameComponent,
    CategoryPopupComponent,
    ProductPopupComponent,
    VarientDialogComponent,
    ComboStorePopupComponent,
    SelectProductDailogComponent,
    SelectCategoryDailogComponent,
    CategoryDialogComponent,
    CouponProductsDialogComponent,
    CouponVariantDialogComponent,

    SelectLocationDialogComponent,
UserLocationDialogComponent,
GiftingLimitDialogComponent,
ViewGiftingLimitComponent,
EditGiftingLimitDialogComponent,
SelectProductItemsDialogComponent,
SelectCouponDialogeComponent,
EventsStoreDialogComponent
  ],
  entryComponents: [
    SnackBarComponent,
    addStoreDialog,
    selectStoreDialog,
    selectStoreVariantDialog,
    addBeaconsDialog,
    storeStaffDialog,
    segmentRuleDialog,
    addRulesDialog,
    addCouponDialog,
    EventDialogComponent,
    storeContactDialog,
    ProductDialogComponent,
    addAttributesDialog,
    EditStoreContactDialog,
    SelectedstoreDataComponent,
    productOnlineOfflineDialog,
    editStoreDialog,
    notificationDialog,
    spinnerComponent,
    productsDialog,
    storeAmenitiesDialog,
    AreaMappingDialog,
    KioskSelectedUserComponent,
    TxnAddedSuccessfullyDialogComponent,
    TinyMceComponent,
    AddFlowDialogComponent,
    DieatryImageDialog,
    AlergionImageDialog,
    SelectedFeedbackFlowComponent,
    AlertMessageDialogComponent,
    AddMultiselectComponent,
    ViewStoreDialogComponent,
    GenerateQrCodeComponent,
    SelectedGiftCardComponent,
    CorporateAdduserDialogComponent,
    CorporateAdddeductDialogComponent,
    CorporateAccountDeductDialogComponent,
    CorporateAccountHistoryComponent,
    TermConditionDialogComponent,
    SelectRecipientDialogComponent,
    AddRecipientComponent,
    BulkUploadComponent,
    ViewRecipientComponent,
    EditRecipientComponent,
    ViewHistoryDialogComponent,
    EditHistoryDialogComponent,ViewGiftingTncDialogComponent,
    AddSearchGiftCardCardStatusDialogComponent,
    SelectGiftcardTemplateComponent,
    SkuDialogComponent,
    ViewGiftCardProductDialogComponent,
    EditSearchGiftCardRedeemedDialogComponent,
    SelectedFeedbacksurveyflowComponent,
    SelectKioskDialogComponent,
    ConfirmDialogComponent,
    DefaultDialogComponent,
    AuditlogDialogComponent,
    RejectOrderDialogComponent,
    // PrintInvoiceComponent,
    ErrorMessagesDialogComponent,
    DenominationDialog,
    OrderTrackingComponent,
    ModifyOrderDialogComponent,
    StoresDialogComponent,
    AddFlowNameComponent,
    CategoryPopupComponent,
    ProductPopupComponent,
    VarientDialogComponent,
    ComboStorePopupComponent,
    SelectProductDailogComponent,
    SelectCategoryDailogComponent,
    CategoryDialogComponent,
    CouponProductsDialogComponent,
    CouponVariantDialogComponent,
    //
    SelectLocationDialogComponent,
UserLocationDialogComponent,
GiftingLimitDialogComponent,
ViewGiftingLimitComponent,
EditGiftingLimitDialogComponent,
SelectProductItemsDialogComponent,
SelectCouponDialogeComponent,
EventsStoreDialogComponent
  ],

  providers: [
    UploadFile,
    uploadBonusFile
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
