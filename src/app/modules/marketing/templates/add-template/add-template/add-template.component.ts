import { Component, OnInit, ViewChild,ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { addAttributesDialog } from '../../../../../shared/components/attributes-dialog/attributes.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

// for stripo
// import { StripoAuthService } from '../stripo-auth.service';
import { HttpClient } from '@angular/common/http';
declare var window: any;
// const STRIPO_AUTH_PATH = "https://plugins.stripo.email/api/v1/auth";
const STRIPO_AUTH_PATH = environment.APIEndpoint + "api/rpa/marketing/template/v1/token";
console.log(STRIPO_AUTH_PATH);



@Component({
    selector: 'add-template',
    templateUrl: './add-template.component.html',
    styleUrls: ['./add-template.component.scss'],
   
})

export class AddTemplateComponent implements OnInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }, {
        title: 'Templates',
        link: '/search-template'
    }
    ];
    @ViewChild('div1') div1: ElementRef;
    @ViewChild('div2') div2: ElementRef;

    @ViewChild("createTemplateForm") createTemplateForm;
    @ViewChild('notification') notification: NgForm;
    @ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
    @ViewChildren('content', {read: ElementRef}) inputContent : QueryList<ElementRef>;
    @ViewChild('sms') sms: NgForm;
    @ViewChild('email') email: NgForm;
    pushNotificationGroup: FormGroup;
    SMSGroup: FormGroup;
    EmailGroup: FormGroup;
    toggleVal: boolean = true;
    public checked: boolean = true;
    public tineyMce = 0;
    showError: boolean = false;
    selectedTemplateNameErr: boolean = false;
    hyperlinkerr: boolean = false;
    public personaliseAttributes = [];
    public languageList;
    selectedTemplateType;
    alignCss = [];
    hyperlink;
    name: string;
    show: boolean = false;
    createTemplateFormGroup: FormGroup;
    templateName: any;
    selectedTemplateName: any;
    public selected = 'PUSH';
    public langfield = [];
    public langfieldname = [];
    public imageRequired = [];
    public loading: boolean = false;
    public prePopulateImg = [];
    public imagePathTwo = [];

    chars = 0;

    selectedEmoji:any;
    constructor(
        private fb: FormBuilder, 
        public dialog: MatDialog, 
        private https: HttpService, 
        public snackBar: MatSnackBar,
        private uploadFile: UploadFile,
        private router: Router,private httpClient: HttpClient  ) {
        this.getLanguage();
        this.formBuild(this.selected);
    }

    ngOnInit() {
        this.buildCreateTemplateForm();
    }

    ngAfterViewInit(): void {
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

    public buildCreateTemplateForm() {
        this.createTemplateFormGroup = this.fb.group({
            selectedTemplateType: ['', Validators.compose([Validators.required])],
            selectedTemplateName: ['', Validators.compose([Validators.required])],
            hyperlink: ['', Validators.compose([Validators.pattern("^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$")])],
            smsTemplateId: [''],
            smsEntityId: [''],
        });
    }
  
    public call(x) {
        console.log(x.index)
        this.tineyMce = x.index;
    }

    getLanguage() {
        this.languageList = JSON.parse(localStorage.getItem("languageList"));
    }

    public formBuild(value: any) {
        this.getLanguage();
        if (value == "PUSH") {
            let form = {
                notificationArray: this.fb.array([]),
            }
            this.pushNotificationGroup = this.fb.group(form);
            this.getQuestionAnswer();
        }

        if (value == "SMS") {
            let form = {
                smsArray: this.fb.array([]),
            }
            this.SMSGroup = this.fb.group(form);
            this.smsArray();
        }

        if (value == "EMAIL") {
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
        for (let ln of this.languageList) {
            const control = <FormArray>this.EmailGroup.controls['emailArray'];
            let newGroup = this.fb.group({
                subject: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                content: ["", Validators.compose([Validators.required])],
                languageId: [''],
            });
            control.push(newGroup);
            this.alignCss.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
        }  
    }

    public smsArray() {
        for (let ln of this.languageList) {
            const control = <FormArray>this.SMSGroup.controls['smsArray'];
            let newGroup = this.fb.group({
                content: ["", Validators.compose([Validators.required])],
                languageId: [''],
                // campaingnSMSImage: [''],
            });
            control.push(newGroup);
            this.alignCss.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
        }
    }

    public getQuestionAnswer() {
        for (let ln of this.languageList) {
            const control = <FormArray>this.pushNotificationGroup.controls['notificationArray'];
            let newGroup = this.fb.group({
                subject: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                content: ["", Validators.compose([Validators.required])],
                languageId: [''],
                // campaingnPushImage: [''],
            });
            control.push(newGroup);
            this.alignCss.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfieldname.push(ln.direction == 'RTL' ? 'direction' : '');
            this.showEmojiPicker.push(false);
            this.textAreaAppContent.push('');
            this.textAreaAppSubject.push('');
        }
        for (let l of this.languageList) {
            this.uploadFlag.push(false);
            this.uploadError.push(false);
             this.imagePath.push('');
            this.imagePathTwo.push('');
          }
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

    show_error = false;  

    attributeDialog(index, type) {
        console.log(index, type);
        const dialogRef = this.dialog.open(addAttributesDialog);
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            this.personaliseAttributes = result.map(e => {
                return e.id
            })
            let content = result.map(e => {
                return `{${e.fieldName}}`
            })
            if (type == 'PUSH') {
                const item = <FormArray>this.pushNotificationGroup.controls['notificationArray'];
                console.log(item)
                item.at(index).patchValue({
                    content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
                })
            }
            else if (type == 'SMS') {
                const item = <FormArray>this.SMSGroup.controls['smsArray'];
                item.at(index).patchValue({
                    content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
                })
            }

            else if (type == 'EMAIL') {
                const item = <FormArray>this.EmailGroup.controls['emailArray'];
                item.at(index).patchValue({
                    content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
                })
            }
        });
    }

    expandDataEmail(){
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

    public uploadImage(event: FileList, i) {
        if (event[0].size < 1000000) {
          if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
            || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
            this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
              .subscribe((response) => {
                // if (this.imageRequired.length != 0) {
                //     this.imageRequired[i] = false;
                //   }
                this.imagePath[i] = response['message'];
                console.log(this.imagePath[i].lenght);
                
                // for (let i = 0; i < this.imagePath[i].length; i++) {
                //   const element = array[i];
                  
                // }
                this.uploadError[i] = false;
                this.uploadFlag[i] = true;
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
              })
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

      public imageUploading: boolean = false;
      public storeImgFlag = [];
      @ViewChild('uploadImgEl') uploadImgEl: ElementRef;

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
              })
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

      public removeDetailImage(index) {
        this.imagePathTwo[index] = "";
        this.storeImgFlag[index] = false;
        const control = this.pushNotificationGroup.get('notificationArray') as FormArray;
      }

      public removeImage(index) {
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;
        const control = this.pushNotificationGroup.get('notificationArray') as FormArray;
      }

      createTemplates(formData) {
        this.show_error = true;
        let imgErr = false;
        console.log(formData);
        let templateData = {
            "templateType": formData.selectedTemplateType,
            "templateName": formData.selectedTemplateName,
            "hyperLink": this.hyperlink,
            "smsTemplateId": formData.smsTemplateId,
            "smsEntityId": formData.smsEntityId,
            "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
            "personaliseAttributes": this.personaliseAttributes
        }
        if (formData.selectedTemplateType == "PUSH") {
            this.markFormGroupTouched(this.pushNotificationGroup);
            for (let i = 0; i < this.languageList.length; i++) {
                this.pushNotificationGroup.value.notificationArray[i].languageId = this.languageList[i].languageId
            }
            for (let index = 0; index < this.pushNotificationGroup.value.notificationArray.length; index++) {
              this.pushNotificationGroup.value.notificationArray[index].imagePath = this.imagePath[index]          
            }
            for (let index = 0; index < this.pushNotificationGroup.value.notificationArray.length; index++) {
                this.pushNotificationGroup.value.notificationArray[index].imagePathTwo = this.imagePathTwo[index]
            }
            templateData["marketingTemplateLocales"] = this.pushNotificationGroup.value.notificationArray;
        }
        else if (formData.selectedTemplateType == "SMS") {
            this.markFormGroupTouched(this.SMSGroup);
            for (let i = 0; i < this.languageList.length; i++) {
                this.SMSGroup.value.smsArray[i].languageId = this.languageList[i].languageId
            }
            templateData["marketingTemplateLocales"] = this.SMSGroup.value.smsArray;
        }
        else if (formData.selectedTemplateType == "EMAIL") {
            // this.markFormGroupTouched(this.EmailGroup);
            // for (let i = 0; i < this.languageList.length; i++) {
            //     this.EmailGroup.value.emailArray[i].languageId = this.languageList[i].languageId
            // }
            // templateData["marketingTemplateLocales"] = this.EmailGroup.value.emailArray;
            this.onExportHtmlTemp().then((d) => {
              var htmlContent;
              htmlContent = d;
              this.getSeperateTemplate().then((contentObj: any) => {
                  this.markFormGroupTouched(this.EmailGroup);
                  for (let i = 0; i < this.languageList.length; i++) {
                      this.EmailGroup.value.emailArray[i].languageId = this.languageList[i].languageId;
                      this.EmailGroup.value.emailArray[i].content = htmlContent;
                      this.EmailGroup.value.emailArray[i].templateHtml = contentObj.html;
                      this.EmailGroup.value.emailArray[i].templateCss = contentObj.css;
                      console.log(this.EmailGroup.value);
                  }
                  templateData["marketingTemplateLocales"] = this.EmailGroup.value.emailArray;
                  // repeat this function for getting delay data of emailTemplate in stripo response
                  this.repeatCreateForEmail(templateData);
              });
          });
          return;
        }
        this.checkProperties(templateData["marketingTemplateLocales"]);
        if (this.showError == false) {
            this.https.postJson(environment.APIEndpoint + "api/rpa/marketing/template/v1/create", templateData).subscribe(res => {
                console.log(res);
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Template added successfully"
                    }
                });
                sessionStorage.clear();
                this.router.navigate(['/search-template'])
            }, (error) => {
                console.log(error);
                if (error.error.errorType == 'VALIDATION') {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "failure",
                            message: error.error.errorDetails[0].description
                        }
                    });
                } else {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "failure",
                            message: "Your request cannot be saved at this time. Please try again later"
                        }
                    });
                }
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
                      callback({ html: html, css: css });
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
                      // withCredentials: true,                        
                  },
                  // body: {
                  //     pluginId: pluginId,
                  //     secretKey: secretKey
                  //     // role: 'ADMIN' // only pass this if you want admin role; leave blank for normal users
                  // }
              };

              var xhr = new XMLHttpRequest();
              xhr.open('GET', config.url,  true);
              xhr.setRequestHeader('Content-type', 'application/json');
              xhr.setRequestHeader('Authorization', userData.token_type + " " + userData.access_token);
              xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
              // xhr.withCredentials = true;
              xhr.onload = function () {
                  callback(JSON.parse(this.responseText).token);
                  console.log(this.responseText);
              };
              // xhr.send(JSON.stringify(config.headers));
              xhr.send(JSON.stringify(config.headers));
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
      window.StripoApi.compileEmail((error, html, ampHtml, ampError) => {
          var x = html;
          console.log(x);
      });
  }


  // for recreating EmailTemplateHTML
  public repeatCreateForEmail(templateData) {
      this.checkProperties(templateData["marketingTemplateLocales"]);
      if (this.showError == false) {
        this.https.postJson(environment.APIEndpoint + "api/rpa/marketing/template/v1/create", templateData).subscribe(res => {
            console.log(res);
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "success",
                    message: "Template added successfully"
                }
            });
            sessionStorage.clear();
            this.router.navigate(['/search-template'])
        }, (error) => {
            console.log(error);
            if (error.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: error.error.errorDetails[0].description
                    }
                });
            } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }
                });
            }
        });
    }
  }
  // for export EmailTemplateHTML
  public onExportHtmlTemp() {
      // return new Promise((resolve) => {
      //     window.StripoApi.compileEmail((error, html, ampHtml, ampError) => {
      //         this.htmlContent1 = html;
      //         resolve(html);
      //     });
      // })


      let promise = new Promise((resolve, reject) => {
          window.StripoApi.compileEmail((error, html, ampHtml, ampError) => { 
              resolve(html);
              console.log(html);
          });

          // window.StripoApi.getTemplate((HTML, CSS, width, heigh) => {
          //     console.log(typeof(CSS))
          //     resolve(HTML);
          //     console.log(HTML)
          //     if(HTML){
          //         // let headSelect = document.getElementsByTagName('head');
          //         let styleTag = document.createElement('style') as any;
          //         let combinedTag = document.head.appendChild(styleTag);
          //         styleTag.type = 'text/css';
          //         if (styleTag.styleSheet){
          //             // This is required for IE8 and below.
          //             styleTag.styleSheet.cssText = CSS;
          //           } else {
          //             styleTag.appendChild(document.createTextNode(CSS));
          //           }
          //     }

          // })
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
    toggleEmojiPicker(index) {
        console.log(index);
        this.showEmojiPicker[index] = !this.showEmojiPicker[index];
    }
    
    addEmojiAppSubject(event,index) {
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
