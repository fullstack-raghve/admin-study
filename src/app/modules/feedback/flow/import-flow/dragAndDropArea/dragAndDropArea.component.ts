import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { field, value } from '../../../../../feedback.global';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SendJsonDatatoParentService } from 'src/app/services/send-json-datato-parent.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { TinyMceComponent } from 'src/app/shared/components/tiny-mce/tiny-mce.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Options } from 'ng5-slider';
import * as inlineEditor from "@ckeditor/ckeditor5-build-inline";
@Component({
  selector: 'app-dragAndDropArea',
  templateUrl: './dragAndDropArea.component.html',
  styleUrls: ['./dragAndDropArea.component.scss']
})
export class DragAndDropComponent implements OnInit {
  @Input() tabname;
  @Input() tabs;
  @Input() pageNumberDyanamic;
  @Input() getModelFieldsData;

  @Output() sendData = new EventEmitter<any>();
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public videoPathUrl = localStorage.getItem('fileBaseUrl');

  value: value = {
    label: "",
    value: ""
  };
  success = false;

  fieldModels: Array<field> = [
    {
      "type": "text",
      "icon": "fa-font",
      "label": "Text",
      "description": "Enter your name",
      "placeholder": "Enter your name",
      "className": "form-control",
      "subType": "text",
      "regex": "",
      "linkTo": "",
      "handle": true
    },
    {
      "type": "email",
      "icon": "fa-envelope",
      "required": true,
      "label": "Email",
      "description": "Enter your email",
      "placeholder": "Enter your email",
      "className": "form-control",
      "subType": "text",
      "regex": "^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$",
      "errorText": "Please enter a valid email",
      "linkTo": "",
      "handle": true
    },
    {
      "type": "phone",
      "icon": "fa-phone",
      "label": "Phone",
      "description": "Enter your phone",
      "placeholder": "Enter your phone",
      "className": "form-control",
      "subType": "text",
      "regex": "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$",
      "errorText": "Please enter a valid phone number",
      "linkTo": "",
      "handle": true
    },
    {
      "type": "date",
      "icon": "fa-calendar",
      "label": "Date",
      "placeholder": "Date",
      "linkTo": "",
      "className": "form-control"
    },
    {
      "type": "checkbox",
      "required": true,
      "label": "Checkbox",
      "icon": "fa-list",
      "description": "Checkbox",
      "inline": true,
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "radio",
      "icon": "fa-list-ul",
      "label": "Radio",
      "description": "Radio boxes",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "autocomplete",
      "icon": "fa-bars",
      "label": "Select",
      "description": "Select",
      "placeholder": "Select",
      "className": "form-control",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        },
        {
          "label": "Option 3",
          "value": "option-3"
        }
      ]
    },
    {
      "type": "button",
      "icon": "fa-paper-plane",
      "subType": "submit",
      "label": "Submit"
    }
  ];

  modelFields: Array<field> = [];
  model: any = {
    // pageNo:'',
    attributes: this.modelFields,
    buttons: [],
    two_screen_questions:[]
  };


  report = false;
  reports: any = [];
  error: boolean = false;

  // tabNumber = [];

  // nps slider
  options: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0, legend: '' },
      { value: 1, legend: 'Very poor' },
      { value: 2 },
      { value: 3, legend: 'Fair' },
      { value: 4 },
      { value: 5, legend: 'Average' },
      { value: 6 },
      { value: 7, legend: 'Good' },
      { value: 8 },
      { value: 9, legend: '' },
      { value: 10, legend: 'Excellent' }
    ]
  };

  public Editor = inlineEditor;

  editorConfig = {
    menubar: false,
    inline: true,

    plugins: [
      'link',
      'lists',
      'powerpaste',
      'autolink',
      'tinymcespellchecker',
      'textcolor colorpicker',
    ],
    custom_colors: true,
    toolbar: [
      ' bold italic underline | fontsizeselect | forecolor ',

    ],
    fontsize_formats: "8pt 9pt 10pt 12pt 14pt 18pt 24pt 36pt 52pt",
    valid_elements: 'div[style],strong[style],em[style],span[style],a[href],ul,ol,li',
    valid_styles: {
      '*': 'font-size,font-family,color,text-decoration,text-align,bold ,italic ,underline,background-color '
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
    content_css: [
      '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
    ]
  };
  NestedLoader: boolean=false;
  public videoLoader: boolean = false;

  constructor(
    private route: ActivatedRoute, private uploadFile: UploadFile, public dialog: MatDialog, public snackBar: MatSnackBar, private jsonService: SendJsonDatatoParentService
  ) { }

  ngOnInit() {
    // if(this.tabs.length>0){
    //   for(var i=0;i<this.tabs.length;i++){
    //     console.log(i);
    //   }
    // }
    //   this.tabs.forEach(names => {
    //     console.log(names);
    //     var ret = names.replace('page','');
    //     console.log(ret);
    //     this.tabNumber.push(ret);
    // })
    if (this.getModelFieldsData) {
      console.log(this.getModelFieldsData)

      this.model['attributes'] = this.getModelFieldsData['attributes'];
      this.model['buttons'] = this.getModelFieldsData['buttons']
      this.model.pageNo = this.pageNumberDyanamic + 1;
      // this.checkLoader();
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.model.attributes, event.previousIndex, event.currentIndex);
  }
  onDragStart(event: DragEvent) {
    console.log("drag started", JSON.stringify(event, null, 2));
  }

  onDragEnd(event: DragEvent) {
    console.log("drag ended", JSON.stringify(event, null, 2));
  }

  onDraggableCopied(event: DragEvent) {
    console.log("draggable copied", JSON.stringify(event, null, 2));
  }

  onDraggableLinked(event: DragEvent) {
    console.log("draggable linked", JSON.stringify(event, null, 2));
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === "move") {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragCanceled(event: DragEvent) {
    console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  onDragover(event: DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }

  onDrop(v, event: DndDropEvent, list?: any[]) {
    this.model.pageNo = v;
    // if (event["data"].type == "popup" || event["data"].type == "tnc") {

    //   // this.model.popup = "true";
    // }

    //  if (event["data"].type == "thankyouMessage") {
    //   this.model.thankupage = "true";
    // }
    console.log(event);
    if (event["data"].type == "nextButton" || event["data"].type == "button" || event["data"].type == "backButton") {
      this.model.buttons.push(event['data'])
    }
    if(event["data"].type == "Nestedcheckbox"){
      this.model.two_screen_array = "true";
      // this.model.two_screen_questions.push(event["data"]);
    }
    if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {

      if (event.dropEffect === "copy")
        event.data.name = event.data.type + '-' + new Date().getTime();
      let index = event.index;
      if (typeof index === "undefined") {
        index = list.length;
      }
      list.splice(index, 0, event.data);
      this.sendJsonData(this.model);
    }
  }

  addValue(values) {
    values.push(this.value);
    this.value = { label: "", value: "" };
  }

  removeField(i, item) {
    this.model.attributes.splice(i, 1);
    console.log(item)
    if (item['type'] == 'tnc' || item["type"] == 'popup') {
      console.log('dele')
      delete this.model.popup
    }
    if (item['type'] == 'thankyouMessage') {
      delete this.model.thankupage

    }
    this.sendJsonData(this.model);
  }
  removeButtonField(i) {
    this.model.buttons.splice(i, 1);
  }

  updateForm() {
    let input = new FormData;
    input.append('id', this.model._id);
    input.append('name', this.model.name);
    input.append('description', this.model.description);
    input.append('bannerImage', this.model.theme.bannerImage);
    input.append('attributes', JSON.stringify(this.model.attributes));
  }


  initReport() {
    this.report = true;
    let input = {
      id: this.model._id
    }
  }



  toggleValue(item) {
    item.selected = !item.selected;
  }

  submit() {
    let valid = true;
    let validationArray = JSON.parse(JSON.stringify(this.model.attributes));
    validationArray.reverse().forEach(field => {
      console.log(field.label + '=>' + field.required + "=>" + field.value);
      if (field.required && !field.value && field.type != 'checkbox') {
        // swal('Error','Please enter '+field.label,'error');
        valid = false;
        return false;
      }
      if (field.required && field.regex) {
        let regex = new RegExp(field.regex);
        if (regex.test(field.value) == false) {
          // swal('Error',field.errorText,'error');
          valid = false;
          return false;
        }
      }
      if (field.required && field.type == 'checkbox') {
        if (field.values.filter(r => r.selected).length == 0) {
          // swal('Error','Please enterrr '+field.label,'error');
          valid = false;
          return false;
        }

      }
    });
    if (!valid) {
      return false;
    }
    console.log('Save', this.model);
    let input = new FormData;
    input.append('formId', this.model._id);
    input.append('attributes', JSON.stringify(this.model.attributes))
  }
  public pageLength: boolean;
  @Output() childData = new EventEmitter<any>();
  sendJsonData(data) {
    console.log(data)
    this.model.pageNo = this.pageNumberDyanamic + 1
    this.pageLength = false;
    if (data.attributes.length > 0) {
      let checkiftncandpopup = data['attributes'].filter(
        (res) => {
          return res.subType == 'popup' || res.subType == 'tnc'
        }
      );
      console.log(checkiftncandpopup)
      if (checkiftncandpopup.length != 0) {
        data.popup = "true";
      }
      let checkiftwoScreenQues =  data['attributes'].filter(
        (res)=>{
          return res.subType == 'multiChoiceCheckboxNested'
        }
      );
      console.log(checkiftwoScreenQues)
      if(checkiftwoScreenQues.length != 0){
        data.two_screen_array = "true";
        data.two_screen_questions = [];
      }
      let checkThankuPage = data['attributes'].filter(
        (res) => {
          return res.subType == 'thankyouMessage'
        }
      );
      console.log(checkThankuPage)
      if (checkThankuPage.length != 0) {
        data.thankupage = "true";
      }
      console.log("init data", data);
      for (let i = 0; i < data.attributes.length; i++) {
        if(data.attributes[i].type != 'Nestedcheckbox' && data.attributes[i].type != 'NestedSinglebox' && data.attributes[i].type != 'NestedAnswers'){

        data.attributes[i].sequenceNumber = i;
        if (data.attributes[i].values) {
          for (let j = 0; j < data.attributes[i].values.length; j++) {
            data.attributes[i].values[j].sequenceNumber = j;
          }
        }
      }
    }

      this.error = true;
      this.childData.emit(data)
      this.jsonService.sendDataToParent(data)
      // this.snackBar.openFromComponent(SnackBarComponent, {
      //   duration: 1500,
      //   data: {
      //     status: "success",
      //     message: "Page content added successfully"
      //   }
      // });
    }
    else {
      console.log("empty page")
      this.pageLength = true;
    }


  }

  addDescription(value) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = value.tempVariable
    dialogConfig.autoFocus = false;

    let dialogRef = this.dialog.open(TinyMceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        console.log(result)
        value.tempVariable = result
      }
    })

  }

  imageFileUrl = '';
  public uploadImage(event: FileList, item) {
    if (event[0].type == "image/svg" || event[0].type == "image/svg+xml" || event[0].type == "image/png") {
      if (event[0].size < 5000000) {
        this.uploadFile.upload(event.item(0), 'tier', 'images')
          .subscribe((response) => {
            console.log(response['message'])
            item['filepathurl'] = this.filePathUrl + response['message'];
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          })
      } else {
        alert("Max upload file size is 5Mb")
      }
    } else {
      alert('Can upload only SVG and PNG image/icon')
    }
  }
  removeImage(item) {
    item.filepathurl = ''
  }
  videoUrl = '';
  videoType = ''
  uploadVideo(event, item) {
    this.videoLoader = true;
    console.log(event[0]);
    if (event && event[0] && event[0].type == 'video/mp4') {
      if (event[0].size < 10000000) {
        this.uploadFile.upload(event.item(0), 'feedback', 'files')
          .subscribe((response) => {
            console.log(response)
            console.log(response['message'])
            item['filepathurl'] = this.videoPathUrl + response['message'];
            this.videoLoader = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " Video successfully uploaded"
              }
            });
          })

      }
      else {
        this.videoLoader = false;
        alert('Max upload file size is 10Mb')
      }
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "failure",
          message: " Upload only mp4 videos"
        }
      });
    }

  }
  removeVideo(item) {
    item.filepathurl = '';
  }
  statusValue;
  public toggleStatus(item, event) {
    console.log(item)
    if (event.checked == true) {
      item.checked = true;
      this.statusValue = 'ONLINE';
    } else {
      item.checked = false;
      this.statusValue = 'OFFLINE';
    }

  }
  customerdrop(event: CdkDragDrop<string[]>, customerarray) {
    console.log(customerarray)
    moveItemInArray(customerarray, event.previousIndex, event.currentIndex);
  }
  checkLoader(item){
    item.toggle = !item.toggle;
    console.log(item.toggle)
    this.NestedLoader=false;
      if(item.type == 'NestedAnswers' || item.type == 'Nestedcheckbox' || item.type == 'NestedSinglebox' ){
        setTimeout (() => {

       }, 1000);

       this.NestedLoader=false;

      }
  }
  deleteNestedLabel(index, totalData){
    if(confirm("Are you sure to delete this label " + index)) {
      totalData.splice(index, 1)
    }
}
}
  // showerr = false;
  // getsequenceValue;
  // sendJsonData(data) {
  //   if (this.getsequenceValue && this.showerr == true) {
  //     console.log('send');
  //     this.jsonService.sendDataToParent(data);
  //     this.snackBar.openFromComponent(SnackBarComponent, {
  //       duration: 1500,
  //       data: {
  //         status: "success",
  //         message: "Page content added successfully"
  //       }
  //     });
  //     this.showerr = false;
  //   }
  //   else {
  //     console.log('err');
  //     this.showerr = true
  //   }
  // }

  // onSeq(value) {
  //   this.getsequenceValue = value;
  // }
