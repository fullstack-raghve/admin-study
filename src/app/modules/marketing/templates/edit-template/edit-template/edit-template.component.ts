import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { addAttributesDialog } from '../../../../../shared/components/attributes-dialog/attributes.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

// for stripo
import { HttpClient } from '@angular/common/http';
declare var window: any;
// const STRIPO_AUTH_PATH = "https://plugins.stripo.email/api/v1/auth";
const STRIPO_AUTH_PATH = environment.APIEndpoint + "api/rpa/marketing/template/v1/token";
console.log(STRIPO_AUTH_PATH);

@Component({
  selector: 'edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Templates',
    link: '/search-template'
  }
  ];

  @ViewChild("createTemplateForm") createTemplateForm;
  @ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
  @ViewChildren('content', {read: ElementRef}) inputContent : QueryList<ElementRef>;
  templateFormGroup: FormGroup;
  public href;
  public form;
  public editUserData;
  public toggleVal: boolean;
  public checked;
  public hyperlink;
  public showError;
  selectedTemplateNameErr: boolean = false;
  hyperlinkerr: boolean = false;
  public personaliseAttributes = [];
  public selectedTemplateName;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public url;
  public btntxt;
  public alignCss = [];
  public langfield = [];
  selectedTemplateType = 'PUSH';
  pushNotificationGroup: FormGroup;
  SMSGroup: FormGroup;
  EmailGroup: FormGroup;
  public loading: boolean = false;
  public show_error:boolean = false;
  public imageRequired = [];
  public prePopulateImg = [];

  public htmlContent: any;
  public templateHtml: any;
  public templateCss: any;

  public langfieldname = [];
  public languageDirection = [];
  URLtype;
  @ViewChild('uploadImgEl') uploadImgEl: ElementRef;
  smsTemplateId: any;
  smsEntityId: any;
  selectedEmoji:any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private httpClient: HttpClient,
    private uploadFile: UploadFile) {
      this.getLanguage();
  }

  ngOnInit() {
    // this.getViewData();
    // this.getLanguage();
    let data=localStorage.getItem('TemplateEditID');
    if(data){
      this.href=data.split('-')[0];
      this.URLtype=data.split('-')[1];
      this.getViewData();
      localStorage.removeItem('TemplateEditID')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-template']);
    }
  }

  ngAfterViewInit(): void {
    console.log(this.input);
    document.onclick = (args: any): void => {
        let emojiBox = false;
        emojiBox = args.target.parentElement.classList.contains('emoji-mart-emoji')
        if (args.target.id == 'emojiBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
            return;
        } else {
            for (let i = 0; i < this.showEmojiPicker.length; i++) {
                this.showEmojiPicker[i] = false;
            }
            emojiBox = false;
        }

        if ( args.target.id == 'emojiContentBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
            return;
        } else {
            for (let i = 0; i < this.showEmojiPickerAppCOntent.length; i++) {
                this.showEmojiPickerAppCOntent[i] = false;
            }
            emojiBox = false;
        }
    }
  }


  getLanguage() {
    this.languageList = JSON.parse(localStorage.getItem("languageList"));
  }
  getViewData() {
    // this.href = this.router.url.split('/')[2];
    let data = {
      "templateId": this.href
    }

    // if (this.router.url.split('/')[3] == 'clone') {
      if (this.URLtype == 'clone') {
      this.https.postJson(environment.APIEndpoint + 'api/rpa/marketing/template/v1/clonetemplate', data).subscribe((res: any) => {
        this.htmlContent = res.marketingTemplateLocales[0].content;
        this.templateHtml = res.marketingTemplateLocales[0].templateHtml;
        this.templateCss = res.marketingTemplateLocales[0].templateCss;

        this.editUserData = res;
        this.toggleVal = res["status"] == "ONLINE" ? true : false
        this.selectedTemplateName = this.editUserData["templateName"];
        this.hyperlink = this.editUserData["hyperLink"];
        this.smsTemplateId = this.editUserData["smsTemplateId"];
        this.smsEntityId = this.editUserData["smsEntityId"];
        this.selectedTemplateType = this.editUserData["templateType"]
        this.url = environment.APIEndpoint + "api/rpa/marketing/template/v1/create";
        this.btntxt = 'ADD'
        this.buildEditTemplateForm();
      }, err => {

      })
    }
    else {
      this.https.postJson(environment.APIEndpoint + 'api/rpa/marketing/template/v1/view', data).subscribe((res: any) => {

        console.log(res);
        this.htmlContent = res.marketingTemplateLocales[0].content;
        this.templateHtml = res.marketingTemplateLocales[0].templateHtml;
        this.templateCss = res.marketingTemplateLocales[0].templateCss;


        this.editUserData = res;
        this.toggleVal = res["status"] == "ONLINE" ? true : false
        this.selectedTemplateName = this.editUserData["templateName"];
        this.selectedTemplateType = this.editUserData["templateType"];
        this.hyperlink = this.editUserData["hyperLink"];
        this.smsTemplateId = this.editUserData["smsTemplateId"];
        this.smsEntityId = this.editUserData["smsEntityId"];
        this.url = environment.APIEndpoint + "api/rpa/marketing/template/v1/update";
        this.btntxt = 'UPDATE'
        this.buildEditTemplateForm();
      }, err => {
        console.log(err);
      })
    }
  }

  populatedata() {
    if (this.editUserData.templateType == "PUSH") {
      console.log(this.editUserData.marketingTemplateLocales);
      for (let i = 0; i < this.editUserData.marketingTemplateLocales.length; i++) {
        this.textAreaAppSubject[i] = this.editUserData.marketingTemplateLocales[i].subject;
        this.textAreaAppContent[i] = this.editUserData.marketingTemplateLocales[i].content;
        const item = <FormArray>this.pushNotificationGroup.controls['notificationArray'];
        item.at(i).patchValue({
          subject: this.textAreaAppSubject[i],
          content: this.textAreaAppContent[i],
          languageId: this.editUserData.marketingTemplateLocales[i].languageId,
        });
    
        this.imagePath.push(this.editUserData.marketingTemplateLocales[i].imagePath);
        this.imagePathTwo.push(this.editUserData.marketingTemplateLocales[i].imagePathTwo);
        if (this.imagePath[i] == null || this.imagePath[i] == ''){
          this.prePopulateImg.push(true);
          this.uploadFlag.push(false);
        }
        else{
          this.uploadFlag.push(true);
          this.prePopulateImg.push(true);
        }

        if(this.imagePathTwo[i] != '' && this.imagePathTwo[i] != null){
          this.storeImgFlag.push(true);
        }
        else{
          this.storeImgFlag.push(false);
        }
        
        this.pushNotificationGroup.value.notificationArray[i].imagePath = this.editUserData.marketingTemplateLocales[i].imagePath;
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfield.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
      }
    }

    if (this.editUserData.templateType == "SMS") {
      for (let i = 0; i < this.editUserData.marketingTemplateLocales.length; i++) {
        const item = <FormArray>this.SMSGroup.controls['smsArray'];
        item.at(i).patchValue({
          subject: this.editUserData.marketingTemplateLocales[i].subject,
          content: this.editUserData.marketingTemplateLocales[i].content,
          languageId: this.editUserData.marketingTemplateLocales[i].languageId,
        })
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfield.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
      }
    }

    if (this.editUserData.templateType == "EMAIL") {
      for (let i = 0; i < this.editUserData.marketingTemplateLocales.length; i++) {
        const item = <FormArray>this.EmailGroup.controls['emailArray'];
        item.at(i).patchValue({
          subject: this.editUserData.marketingTemplateLocales[i].subject,
          content: this.editUserData.marketingTemplateLocales[i].content,
          templateHtml: this.editUserData.marketingTemplateLocales[i].templateHtml,
          templateCss: this.editUserData.marketingTemplateLocales[i].templateCss,
          languageId: this.editUserData.marketingTemplateLocales[i].languageId,
        })
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfield.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
        this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
      }
    }
  }

  public buildEditTemplateForm() {
    if (this.editUserData.templateType == "PUSH") {
      let form = {
        notificationArray: this.fb.array([]),
      }
      this.pushNotificationGroup = this.fb.group(form);
      this.getQuestionAnswer();
    }
    else if (this.editUserData.templateType == "SMS") {
      let form = {
        smsArray: this.fb.array([]),
      }
      this.SMSGroup = this.fb.group(form);
      this.smsArray();
    }
    else if (this.editUserData.templateType == "EMAIL") {
      let form = {
        emailArray: this.fb.array([]),
      }
      this.EmailGroup = this.fb.group(form);
      this.emailArray();
      this.stripoInitializeForm();
    }
  }

  public stripoInitializeForm() {
    console.log('== >> Preview:' + document.getElementById('stripoPreviewContainer'));
    console.log('== >> Settings:' + document.getElementById('stripoSettingsContainer'));
    this.loadStripoScript();
  }
  
  public emailArray() {
    for (let ln of this.editUserData.marketingTemplateLocales) {
      const control = <FormArray>this.EmailGroup.controls['emailArray'];
      let newGroup = this.fb.group({
       subject: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        content: ["", Validators.compose([Validators.required])],
        languageId: [''],
      });
      control.push(newGroup);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
    }
    this.populatedata();
  }

  public smsArray() {
    for (let ln of this.editUserData.marketingTemplateLocales) {
      const control = <FormArray>this.SMSGroup.controls['smsArray'];
      let newGroup = this.fb.group({
        content: ["", Validators.compose([Validators.required])],
        languageId: [''],
        campaingnSMSImage: [''],
      });
      control.push(newGroup);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
    }
    this.populatedata();
    for (let l of this.languageList) {
      this.uploadSMSFlag.push(false);
      this.uploadSMSError.push(false);
      this.imageSMSPath.push('');
    }
  }

  public getQuestionAnswer() {
    for (let ln of this.editUserData.marketingTemplateLocales) {
      const control = <FormArray>this.pushNotificationGroup.controls['notificationArray'];
      let newGroup = this.fb.group({
        subject: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        content: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        languageId: [''],
      });
      control.push(newGroup);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
      this.showEmojiPicker.push(false);
      this.textAreaAppContent.push('');
      this.textAreaAppSubject.push('');
    }
    this.populatedata();
  }

  attributeDialog(index, type) {
    const dialogRef = this.dialog.open(addAttributesDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.personaliseAttributes = result.map(e => {
        return e.id
      });
      let content = result.map(e => {
        return `{${e.name}}`
      });
      if (type == 'PUSH') {
        const item = <FormArray>this.pushNotificationGroup.controls['notificationArray'];
        item.at(index).patchValue({
          content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
        });
      }
      else if (type == 'SMS') {
        const item = <FormArray>this.SMSGroup.controls['smsArray'];
        item.at(index).patchValue({
          content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
        });
      }
      else if (type == 'EMAIL') {
        const item = <FormArray>this.EmailGroup.controls['emailArray'];
        item.at(index).patchValue({
            content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
        });
    }
    });
  }

  public checkProperties(obj) {
    for (var key in obj) {
      if (obj[key].subject != "" && obj[key].content != "") {
        this.showError = false;
      }
      else {
        this.showError = true;
      }
    }
  }
 
  expandDataEmail() {
    var allifram = document.getElementById("arabicID");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;text-align: right;");
  }
  
  public imagePath: any = [];
  public uploadError = [];
  public uploadFlag = [];
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imgUpload = false;
  public imagePathTwo = [];
  public imageUploading: boolean = false;
  public storeImgFlag = [];

  public uploadFullImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].size < 5000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'store360', 'images')
          .subscribe((response) => {
            this.imagePathTwo[i] = response['message'];
            this.storeImgFlag[i] = true;
            this.uploadImgEl.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Internal server error"
              }
            });
          });
      }
      else {
        this.imagePathTwo[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } 
    else {
      this.imagePathTwo[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 5Mb"
        }
      });
    }
  }

  public uploadImage(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadError[i] = false;
            this.uploadFlag[i] = true;
            this.prePopulateImg[i] = true;
            this.uploadElRef.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Supported format is JPG, JPEG and PNG"
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
          });
      }
      else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    this.prePopulateImg[index] = false;
    const control = this.pushNotificationGroup.get('notificationArray') as FormArray;
  }

  public removeDetailImage(index) {
    this.imagePathTwo[index] = "";
    this.storeImgFlag[index] = false;
    const control = this.pushNotificationGroup.get('notificationArray') as FormArray;
  }

  public imageSMSPath: any = [];
  public uploadSMSError = [];
  public uploadSMSFlag = [];
  @ViewChild('uploadSMSEl') uploadSMSElRef: ElementRef;
  public imgSMSUpload = false;

  public uploadSMSImage(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imageSMSPath[i] = response['message'];
            this.uploadSMSError[i] = false;
            this.uploadSMSFlag[i] = true;
            this.uploadSMSElRef.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Supported format is JPG, JPEG and PNG"
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
          });
      }
      else {
        this.imageSMSPath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imageSMSPath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  public removeSMSImage(index) {
    this.imageSMSPath[index] = "";
    this.uploadSMSFlag[index] = false;
    const control = this.SMSGroup.get('smsArray') as FormArray;
    control.at(index).get('campaingnSMSImage').setValue('');
  }

      /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
            this.markFormGroupTouched(control);
        }
    });
}

  public updateTemplate(x) {
    this.show_error = true;
    let imgErr = false
   
    let templateData = {
      "templateId": this.editUserData.templateId,
      "templateType": this.selectedTemplateType,
      "templateName": this.selectedTemplateName,
      "hyperLink": this.hyperlink,
      "smsTemplateId":this.smsTemplateId,
      "smsEntityId": this.smsEntityId,
      "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
      "personaliseAttributes": this.personaliseAttributes
    }
    let isImgErrInPush = false;
    if (this.selectedTemplateType == "PUSH") {
      isImgErrInPush = imgErr;
      templateData["marketingTemplateLocales"] = this.pushNotificationGroup.value.notificationArray;
      this.form = this.pushNotificationGroup;
      for (let index = 0; index < this.pushNotificationGroup.value.notificationArray.length; index++) {
        this.pushNotificationGroup.value.notificationArray[index].imagePath = this.imagePath[index]          
      }
      for (let index = 0; index < this.pushNotificationGroup.value.notificationArray.length; index++) {
        this.pushNotificationGroup.value.notificationArray[index].imagePathTwo = this.imagePathTwo[index]          
      }
    }

    else if (this.selectedTemplateType == "SMS") {
      templateData["marketingTemplateLocales"] = this.SMSGroup.value.smsArray;
      this.form = this.SMSGroup
    }

    else if (this.selectedTemplateType == "EMAIL") {
      templateData["marketingTemplateLocales"] = this.EmailGroup.value.emailArray;
      this.form = this.EmailGroup
      this.onExportHtmlTemp().then((d: any) => {
        console.log(d)
        this.getSeperateTemplate().then((contentObj: any) => {

        this.EmailGroup.value.emailArray[0].content = d;
        this.EmailGroup.value.emailArray[0].templateHtml = contentObj.html;
        this.EmailGroup.value.emailArray[0].templateCss = contentObj.css;
        console.log(this.EmailGroup.value);
        templateData["marketingTemplateLocales"] = this.EmailGroup.value.emailArray;
        this.form = this.EmailGroup;
        this.repeatCreateForEmail(templateData);
        console.log('API Called');
    });

    });
    return;
    }
    console.log('I am from default else');

    if (this.form.valid == true && isImgErrInPush == false) {
      console.log(this.form.valid);
      this.https.postJson(this.url, templateData).subscribe(res => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Template updated successfully"
          }
        });
        this.router.navigate(['/search-template']);
      }, err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: err.error.errorDetails[0].description
          }
        });
      });
    }


  }
   // Stripo code
   public loadStripoScript() {
    let self = this;

    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.id = 'stripoScript';
    script.src = 'https://plugins.stripo.email/static/latest/stripo.js';
    script.async = true;
    script.defer = true;
    script.onload = function () {
        self.loadDemoTemplate(self.initStripo)
    };
    body.appendChild(script);
}

// Utility methods
public request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            callback(req.responseText);
        } else if (req.readyState === 4 && req.status !== 200) {
            console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
        }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
        req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
}

public loadDemoTemplate(callback) {
    console.log("load template")
    return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.html', { responseType: 'text' }).subscribe(
        (html) => {
            return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.css', { responseType: 'text' }).subscribe(
                (css) => {
                    callback({ html: this.templateHtml, css: this.templateCss });
                }
            )
        }
    )
}


initStripo(template) {
    let self = this;
    window.Stripo.init({
        settingsId: 'stripoSettingsContainer',
        previewId: 'stripoPreviewContainer',
        codeEditorButtonId: 'codeEditor',
        undoButtonId: 'undoButton',
        redoButtonId: 'redoButton',
        locale: 'en',
        html: template.html,
        css: template.css,
        apiRequestData: {
            emailId: 123
        },
        "mergeTags": [
            {
                "category": "Reciproci-1",
                "entries": [
                    {
                        "label": "First Name",
                        "value": "{FNAME}"
                    }
                ]
            },
            {
                "category": "Reciproci-2",
                "entries": [
                    {
                        "label": "Last Name",
                        "value": "{LNAME}"
                    }
                ]
            }
        ],
        getAuthToken: function (callback) {
            // TEMPORARILY INSERT CREDS HERE, BUT DON'T SAVE IT PERMANENTLY!!!
            // let pluginId = "699ff104a7ff4e3c8467d2f9be4ed6f5"; // <----
            // let secretKey = "aa898dc4111f4419ad10b162efa3b07c"; // <----
            let userData = JSON.parse(localStorage.getItem("userpermissions"));


            let config = {
                url: STRIPO_AUTH_PATH,
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*' ,
                },
                // body: {
                //     pluginId: pluginId,
                //     secretKey: secretKey
                //     // role: 'ADMIN' // only pass this if you want admin role; leave blank for normal users
                // }
            };
            var xhr = new XMLHttpRequest();
            xhr.open('GET', config.url, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', userData.token_type + " " + userData.access_token);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.onload = function () {
                console.log(this.responseText);
                callback(JSON.parse(this.responseText).token);
            };
            // xhr.send(JSON.stringify(config.body));
            xhr.send(JSON.stringify(config.headers));

            // this.httpClient.post(config.url, JSON.stringify(config.body), { observe: "response" }).subscribe(
            //         (token: any) => {
            //             let _token = token.json();
            //             console.log('token', _token);
            //             return _token;
            //         },
            //         error => {
            //             console.error("fetchUrl error:", error);
            //             return { error: error };
            //         }
            //     );
        },
        "notifications": {
            "info": message => console.log(message),
            "error": message => console.error(message),
            "success": message => console.log(message),
            "warn": message => console.log(message),
            "loader": message => console.log(message),
            "hide": message => console.log(message)
        }
    });


}

// On Export the HTML
public onExportHtml() {
    // window.StripoApi.compileEmail((error, html, ampHtml, ampError) => {
    //     var x = html;
    //     console.log(x);
    // });
    window.StripoApi.getTemplate((error, html, ampHtml, ampError) => {
        var x = html;
        console.log(x);
    });
}

// for recreating EmailTemplateHTML
public repeatCreateForEmail(templateData) {

  if (this.form.valid == true) {
    this.https.postJson(this.url, templateData).subscribe(res => {
        console.log(res);
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
                status: "success",
                message: "Template updated successfully"
            }
        });
        this.router.navigate(['/search-template'])

    }, err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
                status: "failure",
                message: err.error.errorDetails[0].description
            }
        });
    })
}
    // if (this.form.valid == true) {
    //     this.https.postJson(this.url, templateData).subscribe(
    //         (res: any) => {
    //             console.log(res);
    //             this.snackBar.openFromComponent(SnackBarComponent, {
    //                 duration: 1500,
    //                 data: {
    //                     status: "success",
    //                     message: "Template updated successfully"
    //                 }
    //             });
    //             sessionStorage.clear();
    //             this.router.navigate(['/search-template']);
    //         },
    //         (err: any) => {
    //             this.snackBar.openFromComponent(SnackBarComponent, {
    //                 duration: 1500,
    //                 data: {
    //                     status: "failure",
    //                     message: err.error.errorDetails[0].description
    //                 }
    //             });
    //         })
    // }
}
// for export EmailTemplateHTML
public onExportHtmlTemp() {
    let promise = new Promise((resolve, reject) => {
        window.StripoApi.compileEmail((error, html, ampHtml, ampError) => { 
            resolve(html);
            console.log(html);
        });
    });

    return promise;
}

public getSeperateTemplate() {
    let promiseForGetTemplate = new Promise((resolve, reject) => {
        window.StripoApi.getTemplate((HTML, CSS, width, heigh) => { 
            resolve({html: HTML, css: CSS});
            console.log(HTML);
        });   
    })
    return promiseForGetTemplate;
}


   public textAreaAppSubject: any[] = [];
   public textAreaAppContent: any[] = [];
 
   showEmojiPicker = [];
   showEmojiPickerAppCOntent = [];

   sets = [
     'native',
     'google',
     'twitter',
     'facebook',
     'emojione',
     'apple',
     'messenger'
   ]
   set = 'twitter';
   // App Push Section
   toggleEmojiPicker(index) {
       this.showEmojiPicker[index] = !this.showEmojiPicker[index];
   }
   addEmojiAppSubject(event,index) {
    //  this.textAreaAppSubject = `${this.textAreaAppSubject}${event.emoji.native}`;
    const emoji : string = (event.emoji as any).native;
    const input = (index == 0) ? this.input.first.nativeElement : this.input.last.nativeElement;
    input.focus();

    const text = this.textAreaAppSubject[index] + `${event.emoji.native}`;
    this.textAreaAppSubject[index] = text;

    if (document.execCommand){ 
      var event1 = new Event('input');
      document.execCommand('insertText', false, emoji);
      return; 
    }
    const [start, end] = [input.selectionStart, input.selectionEnd]; 
    input.setRangeText(emoji, start, end, 'end');
   }

   toggleEmojiPickerAppContent(index) {
       this.showEmojiPickerAppCOntent[index] = !this.showEmojiPickerAppCOntent[index];
   }
   addEmojiAppContent(event,index) {
      const emoji : string = (event.emoji as any).native;
      const inputContent = (index == 0) ? this.inputContent.first.nativeElement : this.inputContent.last.nativeElement;
      inputContent.focus();

      const text = this.textAreaAppContent[index] + `${event.emoji.native}`;
      this.textAreaAppContent[index] = text;

      if (document.execCommand){ 
        var event1 = new Event('inputContent');
        document.execCommand('insertText', false, emoji);
        return; 
      }
      const [start, end] = [inputContent.selectionStart, inputContent.selectionEnd]; 
      inputContent.setRangeText(emoji, start, end, 'end');
   }
}
