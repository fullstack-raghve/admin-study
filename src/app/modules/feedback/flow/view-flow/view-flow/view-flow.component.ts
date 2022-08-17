import { Component, OnInit, ViewChild } from '@angular/core';
import { field, value } from '../../../../../feedback.global';
import { ActivatedRoute } from '@angular/router';
import { DropEffect, DndDropEvent } from 'ngx-drag-drop';
import { SendJsonDatatoParentService } from 'src/app/services/send-json-datato-parent.service';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar, MatDialogConfig ,MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { DumpFlowDialogComponent } from '../dump-flow-dialog/dump-flow-dialog.component';
@Component({
  selector: 'view-flow',
  templateUrl: './view-flow.component.html',
  styleUrls: ['./view-flow.component.scss']
})
export class ViewFlowComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Feedback',
    link: '/search-flow'
  },
  ];
  @ViewChild("createFlowForm") createFlowForm;
  updateFlowFormGroup: FormGroup;
  public disabled: boolean;
  public checked: boolean;
  public toggleVal;
  public showError = false;
  public pagesArray = false;
  public loading: boolean = false;
  // --tabs
  public idIndex: number = 2;
  tabs = [];
  selected = new FormControl(0);
  //tabs--
  onlineCheckbox;//prod issue
  value: value = {
    label: "",
    value: "",
    linkTo: "",
    sequenceNumber: ""
  };
  success = false;
  public API_Endpoint;

  public kisokCheckbox: boolean = true;
  public emailCheckbox: boolean = true;
  public smsCheckbox: boolean = true;

  fieldModels: Array<field> = [
    {
      "type": "text",
      "icon": "assets/images/flow_icons/text.png",
      "question": "Small Text",
      "className": "form-control",
      "subType": "text",
      "linkTo": "",
      "tempVariable": "",
      "handle": true,
      'textSize': ''
    },
    {
      "type": "radio",
      "icon": "assets/images/flow_icons/single_choice.png",
      "question": "Single Choice",
      "subType": "singleChoice",
      "constant": "",
      "value": '',
      "tempVariable": "",
      "getLableIndex": '',
      "otherlabel": '',
      "otherradio": false,
      "values": [
        {
          "label": "Option 1",
          "value": "option-1",
          "linkTo": "",
          "tempVariable": "",
        },
        {
          "label": "Option 2",
          "value": "option-2",
          "linkTo": "",
          "tempVariable": "",
        }
      ]
    },
    {
      "type": "checkbox",
      "required": true,
      "question": "Multi Choice",
      "icon": "assets/images/flow_icons/multi_choice.png",
      "subType": "checkbox",
      "tempVariable": "",
      "othercheckbox": false,
      "otherLabelValue": '',
      "othersTitle":'Others Title',
      "constant": [],
      "allAnswerID": [],
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
      "type": "NestedAnswers",
      "required": true,
      "question": "Nested Answers",
      "icon": "assets/images/flow_icons/Nested_Answer.png",
      "subType": "noQuestion",
      "tempVariable": "",
      "sequenceNumber": 1000,
      "constant": [],
      "allAnswerID": [],
      "inline": true,
      "values": [
        {
          "sequenceNumber": 970,
          "sNo": "a1",
          "label": "a1",
          "constant": [],
          "allAnswerID": [],
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 101,
              "sNo": "a1a1",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10101,
                  "sNo": "a1a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10102,
                  "sNo": "a1a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10103,
                  "sNo": "a1a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10104,
                  "sNo": "a1a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10105,
                  "sNo": "a1a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10106,
                  "sNo": "a1a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion",
              "constant": [],
              "allAnswerID": []
            },
            {
              "sequenceNumber": 102,
              "sNo": "a1a2",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10201,
                  "sNo": "a1a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10202,
                  "sNo": "a1a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10203,
                  "sNo": "a1a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10204,
                  "sNo": "a1a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10205,
                  "sNo": "a1a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10206,
                  "sNo": "a1a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 103,
              "sNo": "a1a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10301,
                  "sNo": "a1a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10302,
                  "sNo": "a1a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10303,
                  "sNo": "a1a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10304,
                  "sNo": "a1a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10305,
                  "sNo": "a1a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10306,
                  "sNo": "a1a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 104,
              "sNo": "a1a4",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10401,
                  "sNo": "a1a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10402,
                  "sNo": "a1a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10403,
                  "sNo": "a1a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10404,
                  "sNo": "a1a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10405,
                  "sNo": "a1a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10406,
                  "sNo": "a1a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 105,
              "sNo": "a1a5",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10501,
                  "sNo": "a1a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10502,
                  "sNo": "a1a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10503,
                  "sNo": "a1a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10504,
                  "sNo": "a1a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10505,
                  "sNo": "a1a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10506,
                  "sNo": "a1a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 106,
              "sNo": "a1a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10601,
                  "sNo": "a1a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10602,
                  "sNo": "a1a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10603,
                  "sNo": "a1a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10604,
                  "sNo": "a1a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10605,
                  "sNo": "a1a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 10606,
                  "sNo": "a1a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        },
        {
          "sequenceNumber": 971,
          "sNo": "a2",
          "label": "a2",
          "constant": [],
          "allAnswerID": [],
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 201,
              "sNo": "a2a1",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20101,
                  "sNo": "a2a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20102,
                  "sNo": "a2a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20103,
                  "sNo": "a2a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20104,
                  "sNo": "a2a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20105,
                  "sNo": "a2a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20106,
                  "sNo": "a2a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 202,
              "sNo": "a2a2",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20201,
                  "sNo": "a2a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20202,
                  "sNo": "a2a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20203,
                  "sNo": "a2a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20204,
                  "sNo": "a2a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20205,
                  "sNo": "a2a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20206,
                  "sNo": "a2a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 203,
              "sNo": "a2a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20301,
                  "sNo": "a2a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": []
                },
                {
                  "sequenceNumber": 20302,
                  "sNo": "a2a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20303,
                  "sNo": "a2a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20304,
                  "sNo": "a2a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20305,
                  "sNo": "a2a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20306,
                  "sNo": "a2a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 204,
              "sNo": "a2a4",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20401,
                  "sNo": "a2a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20402,
                  "sNo": "a2a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20403,
                  "sNo": "a2a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20404,
                  "sNo": "a2a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20405,
                  "sNo": "a2a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20406,
                  "sNo": "a2a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 205,
              "sNo": "a2a5",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20501,
                  "sNo": "a2a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20502,
                  "sNo": "a2a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20503,
                  "sNo": "a2a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20504,
                  "sNo": "a2a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20505,
                  "sNo": "a2a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20506,
                  "sNo": "a2a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 206,
              "sNo": "a2a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 20601,
                  "sNo": "a2a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20602,
                  "sNo": "a2a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20603,
                  "sNo": "a2a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20604,
                  "sNo": "a2a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20605,
                  "sNo": "a2a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 20606,
                  "sNo": "a2a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        },
        {
          "sequenceNumber": 972,
          "sNo": "a3",
          "label": "",
          "constant": [],
          "allAnswerID": [],
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 301,
              "sNo": "a3a1",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 30101,
                  "sNo": "a3a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30102,
                  "sNo": "a3a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30103,
                  "sNo": "a3a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30104,
                  "sNo": "a3a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30105,
                  "sNo": "a3a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30106,
                  "sNo": "a3a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 302,
              "sNo": "a3a2",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "constant": [],
              "allAnswerID": [],
              "values": [
                {
                  "sequenceNumber": 30201,
                  "sNo": "a3a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30202,
                  "sNo": "a3a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30203,
                  "sNo": "a3a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30204,
                  "sNo": "a3a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30205,
                  "sNo": "a3a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30206,
                  "sNo": "a3a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 303,
              "sNo": "a3a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 30301,
                  "sNo": "a3a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30302,
                  "sNo": "a3a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30303,
                  "sNo": "a3a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30304,
                  "sNo": "a3a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30305,
                  "sNo": "a3a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30306,
                  "sNo": "a3a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 304,
              "sNo": "a3a4",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 30401,
                  "sNo": "a3a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30402,
                  "sNo": "a3a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30403,
                  "sNo": "a3a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30404,
                  "sNo": "a3a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30405,
                  "sNo": "a3a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30406,
                  "sNo": "a3a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 305,
              "sNo": "a3a5",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 30501,
                  "sNo": "a3a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30502,
                  "sNo": "a3a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30503,
                  "sNo": "a3a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30504,
                  "sNo": "a3a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30505,
                  "sNo": "a3a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30506,
                  "sNo": "a3a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 306,
              "sNo": "a3a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 30601,
                  "sNo": "a3a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30602,
                  "sNo": "a3a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30603,
                  "sNo": "a3a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30604,
                  "sNo": "a3a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30605,
                  "sNo": "a3a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 30606,
                  "sNo": "a3a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        },
        {
          "sequenceNumber": 973,
          "sNo": "a4",
          "constant": [],
          "allAnswerID": [],
          "label": "",
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 401,
              "sNo": "a4a1",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40101,
                  "sNo": "a4a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40102,
                  "sNo": "a4a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40103,
                  "sNo": "a4a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40104,
                  "sNo": "a4a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40105,
                  "sNo": "a4a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40106,
                  "sNo": "a4a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 402,
              "sNo": "a4a2",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40201,
                  "sNo": "a4a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40202,
                  "sNo": "a4a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40203,
                  "sNo": "a4a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40204,
                  "sNo": "a4a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40205,
                  "sNo": "a4a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40206,
                  "sNo": "a4a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 403,
              "sNo": "a4a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40301,
                  "sNo": "a4a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40302,
                  "sNo": "a4a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40303,
                  "sNo": "a4a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40304,
                  "sNo": "a4a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40305,
                  "sNo": "a4a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40306,
                  "sNo": "a4a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 404,
              "sNo": "a4a4",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40401,
                  "sNo": "a4a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40402,
                  "sNo": "a4a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40403,
                  "sNo": "a4a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40404,
                  "sNo": "a4a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40405,
                  "sNo": "a4a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40406,
                  "sNo": "a4a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 405,
              "sNo": "a4a5",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40501,
                  "sNo": "a4a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40502,
                  "sNo": "a4a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40503,
                  "sNo": "a4a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40504,
                  "sNo": "a4a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40505,
                  "sNo": "a4a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40506,
                  "sNo": "a4a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 406,
              "sNo": "a4a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 40601,
                  "sNo": "a4a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40602,
                  "sNo": "a4a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40603,
                  "sNo": "a4a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40604,
                  "sNo": "a4a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40605,
                  "sNo": "a4a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 40606,
                  "sNo": "a4a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        },
        {
          "sequenceNumber": 974,
          "sNo": "a5",
          "label": "",
          "constant": [],
          "allAnswerID": [],
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 501,
              "sNo": "a5a1",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50101,
                  "sNo": "a5a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50102,
                  "sNo": "a5a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50103,
                  "sNo": "a5a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50104,
                  "sNo": "a5a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50105,
                  "sNo": "a5a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50106,
                  "sNo": "a5a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 502,
              "sNo": "a5a2",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50201,
                  "sNo": "a5a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50202,
                  "sNo": "a5a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50203,
                  "sNo": "a5a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50204,
                  "sNo": "a5a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50205,
                  "sNo": "a5a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50206,
                  "sNo": "a5a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 503,
              "sNo": "a5a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50301,
                  "sNo": "a5a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50302,
                  "sNo": "a5a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50303,
                  "sNo": "a5a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50304,
                  "sNo": "a5a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50305,
                  "sNo": "a5a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50306,
                  "sNo": "a5a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 504,
              "sNo": "a5a4",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50401,
                  "sNo": "a5a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50402,
                  "sNo": "a5a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50403,
                  "sNo": "a5a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50404,
                  "sNo": "a5a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50405,
                  "sNo": "a5a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50406,
                  "sNo": "a5a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 505,
              "sNo": "a5a5",
              "label": "",
              "constant": [],
              "allAnswerID": [],
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50501,
                  "sNo": "a5a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50502,
                  "sNo": "a5a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50503,
                  "sNo": "a5a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50504,
                  "sNo": "a5a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50505,
                  "sNo": "a5a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50506,
                  "sNo": "a5a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 506,
              "sNo": "a5a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 50601,
                  "sNo": "a5a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50602,
                  "sNo": "a5a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50603,
                  "sNo": "a5a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50604,
                  "sNo": "a5a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50605,
                  "sNo": "a5a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 50606,
                  "sNo": "a5a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        },
        {
          "sequenceNumber": 975,
          "sNo": "a6",
          "label": "",
          "constant": [],
          "allAnswerID": [],
          "value": "",
          "nestedQuestion": false,
          "subType": "noQuestion",
          "values": [
            {
              "sequenceNumber": 601,
              "sNo": "a6a1",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60101,
                  "sNo": "a6a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60102,
                  "sNo": "a6a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60103,
                  "sNo": "a6a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60104,
                  "sNo": "a6a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60105,
                  "sNo": "a6a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60106,
                  "sNo": "a6a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 602,
              "sNo": "a6a2",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60201,
                  "sNo": "a6a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60202,
                  "sNo": "a6a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60203,
                  "sNo": "a6a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60204,
                  "sNo": "a6a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60205,
                  "sNo": "a6a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60206,
                  "sNo": "a6a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 603,
              "sNo": "a6a3",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60301,
                  "sNo": "a6a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60302,
                  "sNo": "a6a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60303,
                  "sNo": "a6a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60304,
                  "sNo": "a6a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60305,
                  "sNo": "a6a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60306,
                  "sNo": "a6a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 604,
              "sNo": "a6a4",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60401,
                  "sNo": "a6a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60402,
                  "sNo": "a6a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60403,
                  "sNo": "a6a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60404,
                  "sNo": "a6a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60405,
                  "sNo": "a6a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60406,
                  "sNo": "a6a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 605,
              "sNo": "a6a5",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60501,
                  "sNo": "a6a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60502,
                  "sNo": "a6a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60503,
                  "sNo": "a6a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60504,
                  "sNo": "a6a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60505,
                  "sNo": "a6a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60506,
                  "sNo": "a6a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            },
            {
              "sequenceNumber": 606,
              "sNo": "a6a6",
              "label": "",
              "value": "",
              "constant": [],
              "allAnswerID": [],
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 60601,
                  "sNo": "a6a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60602,
                  "sNo": "a6a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60603,
                  "sNo": "a6a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60604,
                  "sNo": "a6a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60605,
                  "sNo": "a6a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                },
                {
                  "sequenceNumber": 60606,
                  "sNo": "a6a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "true",
                  "constant": [],
                  "allAnswerID": []
                }
              ],
              "subType": "noQuestion"
            }
          ]
        }
      ],
      "nestQuestion1": "",
      "nestQuestion2": "",
      "nestQuestion3": "",
      "nested": "",
      "nested1": "",
      "nested2": ""
    },
    {
      "type": "Nestedcheckbox",
      "required": true,
      "question": "Nested checkbox Choice",
      "icon": "assets/images/flow_icons/Nested_Checkbox_Choice.png",
      "subType": "multiChoiceCheckboxNested",
      "tempVariable": "",
      "sequenceNumber": 0,
      "constant": [],
      "allAnswerID": [],
      "inline": true,
      "values": [
        {
          "sequenceNumber": 980,
          "sNo": "a1",
          "label": "a1",
          "value": "",
          "nestedQuestion": true,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 101,
              "sNo": "a1a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10101,
                  "sNo": "a1a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10102,
                  "sNo": "a1a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10103,
                  "sNo": "a1a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10104,
                  "sNo": "a1a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10105,
                  "sNo": "a1a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10106,
                  "sNo": "a1a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 102,
              "sNo": "a1a2",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10201,
                  "sNo": "a1a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10202,
                  "sNo": "a1a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10203,
                  "sNo": "a1a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10204,
                  "sNo": "a1a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10205,
                  "sNo": "a1a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10206,
                  "sNo": "a1a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 103,
              "sNo": "a1a3",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10301,
                  "sNo": "a1a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10302,
                  "sNo": "a1a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10303,
                  "sNo": "a1a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10304,
                  "sNo": "a1a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10305,
                  "sNo": "a1a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10306,
                  "sNo": "a1a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 104,
              "sNo": "a1a4",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10401,
                  "sNo": "a1a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10402,
                  "sNo": "a1a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10403,
                  "sNo": "a1a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10404,
                  "sNo": "a1a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10405,
                  "sNo": "a1a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10406,
                  "sNo": "a1a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 105,
              "sNo": "a1a5",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10501,
                  "sNo": "a1a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10502,
                  "sNo": "a1a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10503,
                  "sNo": "a1a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10504,
                  "sNo": "a1a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10505,
                  "sNo": "a1a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10506,
                  "sNo": "a1a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 106,
              "sNo": "a1a6",
              "label": "",
              "value": "",
              "nestedQuestion": false,
              "values": [
                {
                  "sequenceNumber": 10601,
                  "sNo": "a1a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10602,
                  "sNo": "a1a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10603,
                  "sNo": "a1a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10604,
                  "sNo": "a1a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10605,
                  "sNo": "a1a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10606,
                  "sNo": "a1a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": []
        },
        {
          "sequenceNumber": 981,
          "sNo": "a2",
          "label": "a2",
          "value": "",
          "nestedQuestion": false,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 201,
              "sNo": "a2a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20101,
                  "sNo": "a2a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20102,
                  "sNo": "a2a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20103,
                  "sNo": "a2a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20104,
                  "sNo": "a2a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20105,
                  "sNo": "a2a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20106,
                  "sNo": "a2a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 202,
              "sNo": "a2a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20201,
                  "sNo": "a2a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20202,
                  "sNo": "a2a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20203,
                  "sNo": "a2a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20204,
                  "sNo": "a2a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20205,
                  "sNo": "a2a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20206,
                  "sNo": "a2a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 203,
              "sNo": "a2a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20301,
                  "sNo": "a2a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20302,
                  "sNo": "a2a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20303,
                  "sNo": "a2a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20304,
                  "sNo": "a2a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20305,
                  "sNo": "a2a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20306,
                  "sNo": "a2a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 204,
              "sNo": "a2a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20401,
                  "sNo": "a2a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20402,
                  "sNo": "a2a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20403,
                  "sNo": "a2a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20404,
                  "sNo": "a2a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20405,
                  "sNo": "a2a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20406,
                  "sNo": "a2a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 205,
              "sNo": "a2a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20501,
                  "sNo": "a2a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20502,
                  "sNo": "a2a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20503,
                  "sNo": "a2a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20504,
                  "sNo": "a2a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20505,
                  "sNo": "a2a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20506,
                  "sNo": "a2a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 206,
              "sNo": "a2a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20601,
                  "sNo": "a2a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20602,
                  "sNo": "a2a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20603,
                  "sNo": "a2a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20604,
                  "sNo": "a2a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20605,
                  "sNo": "a2a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20606,
                  "sNo": "a2a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ]
        },
        {
          "sequenceNumber": 982,
          "sNo": "a3",
          "label": "",
          "value": "",
          "nestedQuestion": false,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 301,
              "sNo": "a3a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30101,
                  "sNo": "a3a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30102,
                  "sNo": "a3a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30103,
                  "sNo": "a3a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30104,
                  "sNo": "a3a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30105,
                  "sNo": "a3a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30106,
                  "sNo": "a3a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 302,
              "sNo": "a3a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30201,
                  "sNo": "a3a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30202,
                  "sNo": "a3a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30203,
                  "sNo": "a3a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30204,
                  "sNo": "a3a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30205,
                  "sNo": "a3a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30206,
                  "sNo": "a3a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 303,
              "sNo": "a3a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30301,
                  "sNo": "a3a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30302,
                  "sNo": "a3a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30303,
                  "sNo": "a3a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30304,
                  "sNo": "a3a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30305,
                  "sNo": "a3a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30306,
                  "sNo": "a3a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 304,
              "sNo": "a3a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30401,
                  "sNo": "a3a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30402,
                  "sNo": "a3a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30403,
                  "sNo": "a3a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30404,
                  "sNo": "a3a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30405,
                  "sNo": "a3a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30406,
                  "sNo": "a3a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 305,
              "sNo": "a3a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30501,
                  "sNo": "a3a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30502,
                  "sNo": "a3a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30503,
                  "sNo": "a3a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30504,
                  "sNo": "a3a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30505,
                  "sNo": "a3a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30506,
                  "sNo": "a3a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 306,
              "sNo": "a3a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30601,
                  "sNo": "a3a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30602,
                  "sNo": "a3a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30603,
                  "sNo": "a3a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30604,
                  "sNo": "a3a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30605,
                  "sNo": "a3a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30606,
                  "sNo": "a3a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": []
        },
        {
          "sequenceNumber": 983,
          "sNo": "a4",
          "label": "",
          "value": "",
          "nestedQuestion": false,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 401,
              "sNo": "a4a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40101,
                  "sNo": "a4a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40102,
                  "sNo": "a4a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40103,
                  "sNo": "a4a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40104,
                  "sNo": "a4a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40105,
                  "sNo": "a4a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40106,
                  "sNo": "a4a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 402,
              "sNo": "a4a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40201,
                  "sNo": "a4a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40202,
                  "sNo": "a4a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40203,
                  "sNo": "a4a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40204,
                  "sNo": "a4a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40205,
                  "sNo": "a4a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40206,
                  "sNo": "a4a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 403,
              "sNo": "a4a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40301,
                  "sNo": "a4a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40302,
                  "sNo": "a4a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40303,
                  "sNo": "a4a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40304,
                  "sNo": "a4a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40305,
                  "sNo": "a4a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40306,
                  "sNo": "a4a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 404,
              "sNo": "a4a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40401,
                  "sNo": "a4a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40402,
                  "sNo": "a4a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40403,
                  "sNo": "a4a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40404,
                  "sNo": "a4a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40405,
                  "sNo": "a4a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40406,
                  "sNo": "a4a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 405,
              "sNo": "a4a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40501,
                  "sNo": "a4a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40502,
                  "sNo": "a4a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40503,
                  "sNo": "a4a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40504,
                  "sNo": "a4a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40505,
                  "sNo": "a4a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40506,
                  "sNo": "a4a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 406,
              "sNo": "a4a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40601,
                  "sNo": "a4a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40602,
                  "sNo": "a4a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40603,
                  "sNo": "a4a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40604,
                  "sNo": "a4a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40605,
                  "sNo": "a4a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40606,
                  "sNo": "a4a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": []
        },
        {
          "sequenceNumber": 984,
          "sNo": "a5",
          "label": "",
          "value": "",
          "nestedQuestion": false,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 501,
              "sNo": "a5a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50101,
                  "sNo": "a5a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50102,
                  "sNo": "a5a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50103,
                  "sNo": "a5a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50104,
                  "sNo": "a5a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50105,
                  "sNo": "a5a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50106,
                  "sNo": "a5a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 502,
              "sNo": "a5a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50201,
                  "sNo": "a5a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50202,
                  "sNo": "a5a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50203,
                  "sNo": "a5a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50204,
                  "sNo": "a5a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50205,
                  "sNo": "a5a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50206,
                  "sNo": "a5a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 503,
              "sNo": "a5a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50301,
                  "sNo": "a5a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50302,
                  "sNo": "a5a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50303,
                  "sNo": "a5a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50304,
                  "sNo": "a5a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50305,
                  "sNo": "a5a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50306,
                  "sNo": "a5a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 504,
              "sNo": "a5a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50401,
                  "sNo": "a5a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50402,
                  "sNo": "a5a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50403,
                  "sNo": "a5a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50404,
                  "sNo": "a5a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50405,
                  "sNo": "a5a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50406,
                  "sNo": "a5a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 505,
              "sNo": "a5a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50501,
                  "sNo": "a5a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50502,
                  "sNo": "a5a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50503,
                  "sNo": "a5a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50504,
                  "sNo": "a5a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50505,
                  "sNo": "a5a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50506,
                  "sNo": "a5a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 506,
              "sNo": "a5a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50601,
                  "sNo": "a5a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50602,
                  "sNo": "a5a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50603,
                  "sNo": "a5a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50604,
                  "sNo": "a5a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50605,
                  "sNo": "a5a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50606,
                  "sNo": "a5a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": []
        },
        {
          "sequenceNumber": 985,
          "sNo": "a6",
          "label": "",
          "value": "",
          "nestedQuestion": false,
          "question": "Multi Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "Nestedcheckbox",
          "subType": "multiChoiceCheckboxNested",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 601,
              "sNo": "a6a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60101,
                  "sNo": "a6a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60102,
                  "sNo": "a6a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60103,
                  "sNo": "a6a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60104,
                  "sNo": "a6a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60105,
                  "sNo": "a6a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60106,
                  "sNo": "a6a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 602,
              "sNo": "a6a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60201,
                  "sNo": "a6a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60202,
                  "sNo": "a6a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60203,
                  "sNo": "a6a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60204,
                  "sNo": "a6a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60205,
                  "sNo": "a6a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60206,
                  "sNo": "a6a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 603,
              "sNo": "a6a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60301,
                  "sNo": "a6a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60302,
                  "sNo": "a6a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60303,
                  "sNo": "a6a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60304,
                  "sNo": "a6a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60305,
                  "sNo": "a6a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60306,
                  "sNo": "a6a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 604,
              "sNo": "a6a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60401,
                  "sNo": "a6a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60402,
                  "sNo": "a6a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60403,
                  "sNo": "a6a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60404,
                  "sNo": "a6a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60405,
                  "sNo": "a6a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60406,
                  "sNo": "a6a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 605,
              "sNo": "a6a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60501,
                  "sNo": "a6a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60502,
                  "sNo": "a6a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60503,
                  "sNo": "a6a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60504,
                  "sNo": "a6a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60505,
                  "sNo": "a6a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60506,
                  "sNo": "a6a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            },
            {
              "sequenceNumber": 606,
              "sNo": "a6a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60601,
                  "sNo": "a6a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60602,
                  "sNo": "a6a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60603,
                  "sNo": "a6a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60604,
                  "sNo": "a6a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60605,
                  "sNo": "a6a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60606,
                  "sNo": "a6a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "Multi Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "Nestedcheckbox",
              "subType": "multiChoiceCheckboxNested",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true,
              "allNestedElementArray": []
            }
          ],
          "allAnswerID": [],
          "allNestedElementArray": [],
          "allInsideNestedElementArray": [],
          "parentAnswerID": []
        }
      ]
    },
    {
      "type": "NestedSinglebox",
      "required": true,
      "question": "Nested  Single Choice",
      "icon": "assets/images/flow_icons/Nested_Single_Choice.png",
      "subType": "singleChoiceNested",
      "tempVariable": "",
      "sequenceNumber": 1000,
      "constant": [],
      "allAnswerID": [],
      "inline": true,
      "values": [
        {
          "sequenceNumber": 950,
          "sNo": "a1",
          "label": "a1",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 101,
              "sNo": "a1a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10101,
                  "sNo": "a1a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10102,
                  "sNo": "a1a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10103,
                  "sNo": "a1a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10104,
                  "sNo": "a1a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10105,
                  "sNo": "a1a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10106,
                  "sNo": "a1a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 102,
              "sNo": "a1a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10201,
                  "sNo": "a1a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10202,
                  "sNo": "a1a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10203,
                  "sNo": "a1a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10204,
                  "sNo": "a1a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10205,
                  "sNo": "a1a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10206,
                  "sNo": "a1a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 103,
              "sNo": "a1a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10301,
                  "sNo": "a1a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10302,
                  "sNo": "a1a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10303,
                  "sNo": "a1a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10304,
                  "sNo": "a1a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10305,
                  "sNo": "a1a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10306,
                  "sNo": "a1a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 104,
              "sNo": "a1a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10401,
                  "sNo": "a1a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10402,
                  "sNo": "a1a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10403,
                  "sNo": "a1a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10404,
                  "sNo": "a1a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10405,
                  "sNo": "a1a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10406,
                  "sNo": "a1a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 105,
              "sNo": "a1a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10501,
                  "sNo": "a1a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10502,
                  "sNo": "a1a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10503,
                  "sNo": "a1a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10504,
                  "sNo": "a1a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10505,
                  "sNo": "a1a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10506,
                  "sNo": "a1a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 106,
              "sNo": "a1a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 10601,
                  "sNo": "a1a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10602,
                  "sNo": "a1a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10603,
                  "sNo": "a1a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10604,
                  "sNo": "a1a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10605,
                  "sNo": "a1a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 10606,
                  "sNo": "a1a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ],
          "allAnswerID": []
        },
        {
          "sequenceNumber": 951,
          "sNo": "a2",
          "label": "a2",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "allAnswerID": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 201,
              "sNo": "a2a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20101,
                  "sNo": "a2a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20102,
                  "sNo": "a2a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20103,
                  "sNo": "a2a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20104,
                  "sNo": "a2a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20105,
                  "sNo": "a2a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20106,
                  "sNo": "a2a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 202,
              "sNo": "a2a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20201,
                  "sNo": "a2a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20202,
                  "sNo": "a2a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20203,
                  "sNo": "a2a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20204,
                  "sNo": "a2a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20205,
                  "sNo": "a2a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20206,
                  "sNo": "a2a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 203,
              "sNo": "a2a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20301,
                  "sNo": "a2a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20302,
                  "sNo": "a2a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20303,
                  "sNo": "a2a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20304,
                  "sNo": "a2a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20305,
                  "sNo": "a2a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20306,
                  "sNo": "a2a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 204,
              "sNo": "a2a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20401,
                  "sNo": "a2a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20402,
                  "sNo": "a2a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20403,
                  "sNo": "a2a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20404,
                  "sNo": "a2a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20405,
                  "sNo": "a2a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20406,
                  "sNo": "a2a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 205,
              "sNo": "a2a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20501,
                  "sNo": "a2a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20502,
                  "sNo": "a2a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20503,
                  "sNo": "a2a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20504,
                  "sNo": "a2a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20505,
                  "sNo": "a2a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20506,
                  "sNo": "a2a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 206,
              "sNo": "a2a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 20601,
                  "sNo": "a2a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20602,
                  "sNo": "a2a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20603,
                  "sNo": "a2a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20604,
                  "sNo": "a2a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20605,
                  "sNo": "a2a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 20606,
                  "sNo": "a2a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ]
        },
        {
          "sequenceNumber": 952,
          "sNo": "a3",
          "label": "",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 301,
              "sNo": "a3a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30101,
                  "sNo": "a3a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30102,
                  "sNo": "a3a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30103,
                  "sNo": "a3a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30104,
                  "sNo": "a3a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30105,
                  "sNo": "a3a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30106,
                  "sNo": "a3a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 302,
              "sNo": "a3a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30201,
                  "sNo": "a3a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30202,
                  "sNo": "a3a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30203,
                  "sNo": "a3a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30204,
                  "sNo": "a3a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30205,
                  "sNo": "a3a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30206,
                  "sNo": "a3a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 303,
              "sNo": "a3a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30301,
                  "sNo": "a3a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30302,
                  "sNo": "a3a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30303,
                  "sNo": "a3a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30304,
                  "sNo": "a3a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30305,
                  "sNo": "a3a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30306,
                  "sNo": "a3a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 304,
              "sNo": "a3a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30401,
                  "sNo": "a3a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30402,
                  "sNo": "a3a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30403,
                  "sNo": "a3a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30404,
                  "sNo": "a3a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30405,
                  "sNo": "a3a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30406,
                  "sNo": "a3a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 305,
              "sNo": "a3a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30501,
                  "sNo": "a3a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30502,
                  "sNo": "a3a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30503,
                  "sNo": "a3a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30504,
                  "sNo": "a3a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30505,
                  "sNo": "a3a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30506,
                  "sNo": "a3a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 306,
              "sNo": "a3a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 30601,
                  "sNo": "a3a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30602,
                  "sNo": "a3a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30603,
                  "sNo": "a3a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30604,
                  "sNo": "a3a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30605,
                  "sNo": "a3a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 30606,
                  "sNo": "a3a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ],
          "allAnswerID": []
        },
        {
          "sequenceNumber": 953,
          "sNo": "a4",
          "label": "",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 401,
              "sNo": "a4a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40101,
                  "sNo": "a4a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40102,
                  "sNo": "a4a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40103,
                  "sNo": "a4a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40104,
                  "sNo": "a4a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40105,
                  "sNo": "a4a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40106,
                  "sNo": "a4a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 402,
              "sNo": "a4a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40201,
                  "sNo": "a4a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40202,
                  "sNo": "a4a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40203,
                  "sNo": "a4a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40204,
                  "sNo": "a4a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40205,
                  "sNo": "a4a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40206,
                  "sNo": "a4a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 403,
              "sNo": "a4a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40301,
                  "sNo": "a4a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40302,
                  "sNo": "a4a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40303,
                  "sNo": "a4a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40304,
                  "sNo": "a4a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40305,
                  "sNo": "a4a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40306,
                  "sNo": "a4a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 404,
              "sNo": "a4a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40401,
                  "sNo": "a4a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40402,
                  "sNo": "a4a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40403,
                  "sNo": "a4a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40404,
                  "sNo": "a4a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40405,
                  "sNo": "a4a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40406,
                  "sNo": "a4a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 405,
              "sNo": "a4a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40501,
                  "sNo": "a4a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40502,
                  "sNo": "a4a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40503,
                  "sNo": "a4a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40504,
                  "sNo": "a4a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40505,
                  "sNo": "a4a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40506,
                  "sNo": "a4a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 406,
              "sNo": "a4a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 40601,
                  "sNo": "a4a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40602,
                  "sNo": "a4a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40603,
                  "sNo": "a4a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40604,
                  "sNo": "a4a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40605,
                  "sNo": "a4a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 40606,
                  "sNo": "a4a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ],
          "allAnswerID": []
        },
        {
          "sequenceNumber": 954,
          "sNo": "a5",
          "label": "",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 501,
              "sNo": "a5a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50101,
                  "sNo": "a5a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50102,
                  "sNo": "a5a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50103,
                  "sNo": "a5a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50104,
                  "sNo": "a5a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50105,
                  "sNo": "a5a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50106,
                  "sNo": "a5a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 502,
              "sNo": "a5a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50201,
                  "sNo": "a5a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50202,
                  "sNo": "a5a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50203,
                  "sNo": "a5a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50204,
                  "sNo": "a5a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50205,
                  "sNo": "a5a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50206,
                  "sNo": "a5a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 503,
              "sNo": "a5a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50301,
                  "sNo": "a5a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50302,
                  "sNo": "a5a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50303,
                  "sNo": "a5a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50304,
                  "sNo": "a5a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50305,
                  "sNo": "a5a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50306,
                  "sNo": "a5a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 504,
              "sNo": "a5a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50401,
                  "sNo": "a5a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50402,
                  "sNo": "a5a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50403,
                  "sNo": "a5a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50404,
                  "sNo": "a5a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50405,
                  "sNo": "a5a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50406,
                  "sNo": "a5a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 505,
              "sNo": "a5a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50501,
                  "sNo": "a5a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50502,
                  "sNo": "a5a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50503,
                  "sNo": "a5a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50504,
                  "sNo": "a5a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50505,
                  "sNo": "a5a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50506,
                  "sNo": "a5a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 506,
              "sNo": "a5a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 50601,
                  "sNo": "a5a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50602,
                  "sNo": "a5a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50603,
                  "sNo": "a5a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50604,
                  "sNo": "a5a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50605,
                  "sNo": "a5a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 50606,
                  "sNo": "a5a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ],
          "allAnswerID": []
        },
        {
          "sequenceNumber": 955,
          "sNo": "a6",
          "label": "",
          "value": "",
          "nestedQuestion": true,
          "question": "single Choice",
          "icon": "assets/images/flow_icons/multi_choice.png",
          "type": "NestedSinglebox",
          "subType": "singleChoiceQuestionAnswer",
          "tempVariable": "",
          "constant": [],
          "inline": true,
          "values": [
            {
              "sequenceNumber": 601,
              "sNo": "a6a1",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60101,
                  "sNo": "a6a1a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60102,
                  "sNo": "a6a1a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60103,
                  "sNo": "a6a1a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60104,
                  "sNo": "a6a1a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60105,
                  "sNo": "a6a1a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60106,
                  "sNo": "a6a1a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 602,
              "sNo": "a6a2",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60201,
                  "sNo": "a6a2a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60202,
                  "sNo": "a6a2a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60203,
                  "sNo": "a6a2a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60204,
                  "sNo": "a6a2a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60205,
                  "sNo": "a6a2a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60206,
                  "sNo": "a6a2a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 603,
              "sNo": "a6a3",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60301,
                  "sNo": "a6a3a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60302,
                  "sNo": "a6a3a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60303,
                  "sNo": "a6a3a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60304,
                  "sNo": "a6a3a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60305,
                  "sNo": "a6a3a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60306,
                  "sNo": "a6a3a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 604,
              "sNo": "a6a4",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60401,
                  "sNo": "a6a4a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60402,
                  "sNo": "a6a4a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60403,
                  "sNo": "a6a4a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60404,
                  "sNo": "a6a4a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60405,
                  "sNo": "a6a4a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60406,
                  "sNo": "a6a4a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 605,
              "sNo": "a6a5",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60501,
                  "sNo": "a6a5a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60502,
                  "sNo": "a6a5a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60503,
                  "sNo": "a6a5a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60504,
                  "sNo": "a6a5a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60505,
                  "sNo": "a6a5a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60506,
                  "sNo": "a6a5a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            },
            {
              "sequenceNumber": 606,
              "sNo": "a6a6",
              "label": "",
              "value": "",
              "nestedQuestion": true,
              "values": [
                {
                  "sequenceNumber": 60601,
                  "sNo": "a6a6a1",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60602,
                  "sNo": "a6a6a2",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60603,
                  "sNo": "a6a6a3",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60604,
                  "sNo": "a6a6a4",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60605,
                  "sNo": "a6a6a5",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                },
                {
                  "sequenceNumber": 60606,
                  "sNo": "a6a6a6",
                  "label": "",
                  "value": "",
                  "nestedQuestion": "false"
                }
              ],
              "question": "single Choice",
              "icon": "assets/images/flow_icons/multi_choice.png",
              "type": "NestedSinglebox",
              "subType": "singleChoiceQuestionAnswer",
              "tempVariable": "",
              "constant": [],
              "allAnswerID": [],
              "inline": true
            }
          ],
          "allAnswerID": []
        }
      ],
      "nestQuestion1": "",
      "nestQuestion2": "",
      "nestQuestion3": ""
    },
    {
      "type": "email",
      "icon": "assets/images/flow_icons/email.png",
      "required": true,
      "question": "Email",
      "className": "form-control",
      "subType": "text",
      "tempVariable": "",
      "linkTo": "",
      "handle": true
    },
    {
      "type": "phone",
      "icon": "assets/images/flow_icons/phone.png",
      "question": "Phone",
      "className": "form-control",
      "subType": "text",
      "linkTo": "",
      "tempVariable": "",
      "phoneNumberWithDialcode": "",
      "handle": true,
      "dropDownData" : []
    },
    {
      "type": "date",
      "icon": "assets/images/flow_icons/date.png",
      "question": "Date",
      "subType": "date",
      "linkTo": "",
      "tempVariable": "",
      "className": "form-control"
    },
    {
      "type": "autocomplete",
      "icon": "assets/images/flow_icons/dropdown.png",
      "question": "Dropdown",
      "subType": "dropdown",
      "className": "form-control",
      "tempVariable": "",
      "value": 0,
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
      "type": "rating",
      "icon": "assets/images/flow_icons/nps_rating.png",
      "question": "NPS",
      "subType": "rating",
      "area": "Rating",
      "tempVariable": "",
      "constant": "",
      "value": '',
      "otherlabel": '',
      "values": [
        {
          "value": "0",
          "label": '0',
          "linkTo": '',
          "color": '#FF3123',
          "npsRedirectionLink": ''
        },
        {
          "value": "1",
          "label": '1',
          "linkTo": '',
          "color": '#FF453B',
          "npsRedirectionLink": ''
        },
        {
          "value": "2",
          "label": '2',
          "linkTo": '',
          "color": '#FF6936',
          "npsRedirectionLink": ''
        },
        {
          "value": "3",
          "label": '3',
          "linkTo": '',
          "color": '#FF8822',
          "npsRedirectionLink": ''
        },
        {
          "value": "4",
          "label": '4',
          "linkTo": '',
          "color": '#FFA600',
          "npsRedirectionLink": ''
        },
        {
          "value": "5",
          "label": '5',
          "linkTo": '',
          "color": '#FFBD00',
          "npsRedirectionLink": ''
        },
        {
          "value": "6",
          "label": '6',
          "linkTo": '',
          "color": '#EEBD00',
          "npsRedirectionLink": ''
        },
        {
          "value": "7",
          "label": '7',
          "linkTo": '',
          "color": '#C1C000',
          "npsRedirectionLink": ''
        },
        {
          "value": "8",
          "label": '8',
          "linkTo": '',
          "color": '#92BE00',
          "npsRedirectionLink": ''
        },
        {
          "value": "9",
          "label": '9',
          "linkTo": '',
          "color": '#5EBC00',
          "npsRedirectionLink": 'https://www.reciproci.com/'
        },
        {
          "value": "10",
          "label": '10',
          "linkTo": '',
          "color": '#009800',
          "npsRedirectionLink": 'https://www.reciproci.com/'
        }
      ]
    },
    {
      "type": "starRating",
      "icon": "assets/images/feedback/star_rating_icon.png",
      "subType": "star_rating",
      "question": "Star Rating",
      "tempVariable": "",
      "constant": "",
      "starSizes": ['1X', '2X'],
      "starSize": "",
      "value" : '',
      "values": [
        {
          "id": "1",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "1",
          "linkTo": "",
          "afterSelecteing":"assets/images/selectedStar.png",
          "beforeSelecting":"assets/images/star.png"
        },
        {
          "id": "2",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "2",
          "linkTo": "",
          "afterSelecteing":"assets/images/selectedStar.png",
          "beforeSelecting":"assets/images/star.png"
        },
        {
          "id": "3",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "3",
          "linkTo": "",
          "afterSelecteing":"assets/images/selectedStar.png",
          "beforeSelecting":"assets/images/star.png"
        },
        {
          "id": "4",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "4",
          "linkTo": "",
          "afterSelecteing":"assets/images/selectedStar.png",
          "beforeSelecting":"assets/images/star.png"
        },
        {
          "id": "5",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "5",
          "linkTo": "",
          "afterSelecteing":"assets/images/selectedStar.png",
          "beforeSelecting":"assets/images/star.png"
        }
      ]
    },
    {
      "type": "productRating",
      "icon": "assets/images/flow_icons/product_rating.png",
      "subType": "product_rating",
      "question": "Product Rating",
      "tempVariable": "",
      "constant": "",
      "starSizes": ['1X', '2X'],
      "starSize": "",
      "value" : '',
      "dynamicProductList": [],
      "values": [
        {
          "id": "1",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "1",
          "questionTitle": "",
          "productMessage": "",
          "afterSelecteing":"assets/images/product_star_selected.png",
          "beforeSelecting":"assets/images/product_star.png"
        },
        {
          "id": "2",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "2",
          "questionTitle": "",
          "productMessage": "",
          "afterSelecteing":"assets/images/product_star_selected.png",
          "beforeSelecting":"assets/images/product_star.png"
        },
        {
          "id": "3",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "3",
          "questionTitle": "",
          "productMessage": "",
          "afterSelecteing":"assets/images/product_star_selected.png",
          "beforeSelecting":"assets/images/product_star.png"
        },
        {
          "id": "4",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "4",
          "questionTitle": "",
          "productMessage": "",
          "afterSelecteing":"assets/images/product_star_selected.png",
          "beforeSelecting":"assets/images/product_star.png"
        },
        {
          "id": "5",
          "label": "assets/images/feedback/star_rating_icon.png",
          "value": "5",
          "questionTitle": "",
          "productMessage": "",
          "afterSelecteing":"assets/images/product_star_selected.png",
          "beforeSelecting":"assets/images/product_star.png"
        }
      ]
    },
    {
      "type": "sliderRating",
      "icon": "assets/images/flow_icons/nps_rating.png",
      "question": "NPS Slider",
      "subType": "sliderRating",
      "area": "sliderRating",
      "tempVariable": "",
      "constant": "",
      "showTicksValues": true,
      "sliderArray": [
        {
          showTicksValues: true,
          stepsArray: [
            { value: 1, legend: "Very poor", "linkTo": '' },
            { value: 2, "linkTo": '' },
            { value: 3, legend: "Fair", "linkTo": '' },
            { value: 4, "linkTo": '' },
            { value: 5, legend: "Average", "linkTo": '' },
            { value: 6, "linkTo": '' },
            { value: 7, legend: "Good", "linkTo": '' },
            { value: 8, "linkTo": '' },
            { value: 9, legend: "Excellent", "linkTo": '' }
          ]
        }
      ]
    },
    {
      "type": "emoji",
      "icon": "assets/images/flow_icons/sentiment.png",
      "subType": "emotions",
      "question": "Sentiment",
      "tempVariable": "",
      "constant": "",
      "emojiSizes": ['1X', '2X'],
      "emojiSize": "",
      "value": '',
      "values": [
        // {
        //   "id": "1",
        //   "label": "assets/images/sentiments/1_1.png",
        //   "value": "0",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_1.png"
        // },
        // {
        //   "id": "2",
        //   "label": "assets/images/sentiments/2_1.png",
        //   "value": "1",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_2.png"
        // },
        // {
        //   "id": "3",
        //   "label": "assets/images/sentiments/3_1.png",
        //   "value": "2",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_3.png"
        // },
        // {
        //   "id": "4",
        //   "label": "assets/images/sentiments/4_1.png",
        //   "value": "3",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_4.png"
        // },
        // {
        //   "id": "5",
        //   "label": "assets/images/sentiments/5_1.png",
        //   "value": "4",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_5.png"
        // },
        // {
        //   "id": "6",
        //   "label": "assets/images/sentiments/6_1.png",
        //   "value": "5",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_6.png"
        // },
        // {
        //   "id": "7",
        //   "label": "assets/images/sentiments/7_1.png",
        //   "value": "6",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_7.png"
        // },
        // {
        //   "id": "8",
        //   "label": "assets/images/sentiments/8_1.png",
        //   "value": "7",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_8.png"
        // },
        // {
        //   "id": "9",
        //   "label": "assets/images/sentiments/9_1.png",
        //   "value": "8",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_9.png"
        // },
        // {
        //   "id": "10",
        //   "label": "assets/images/sentiments/10_1.png",
        //   "value": "9",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_10.png"
        // },
        // {
        //   "id": "11",
        //   "label": "assets/images/sentiments/11_1.png",
        //   "value": "10",
        //   "linkTo": "",
        //   "afterClickSentimentImage": "assets/images/sentiments/afterClick_11.png"
        // },
        {
          "id": "1",
          "label": "assets/images/sentiments/SMO/before_click_1.png",
          "value": "0",
          "linkTo": "",
          "afterClickSentimentImage": "assets/images/sentiments/SMO/after_click_1.png"
        },
        {
          "id": "2",
          "label": "assets/images/sentiments/SMO/before_click_2.png",
          "value": "5",
          "linkTo": "",
          "afterClickSentimentImage": "assets/images/sentiments/SMO/after_click_2.png"
        },
        {
          "id": "2",
          "label": "assets/images/sentiments/SMO/before_click_3.png",
          "value": "10",
          "linkTo": "",
          "afterClickSentimentImage": "assets/images/sentiments/SMO/after_click_3.png"
        }
      ]
    },
    {
      "type": "customerProfile",
      "icon": "assets/images/flow_icons/User.png",
      "subType": "customerProfile",
      "tempVariable": "",
      "question": "Customer Profile",
      "customerData": [
        {
          "type": "customer_text",
          "icon": "assets/images/flow_icons/text.png",
          "question": "Please enter your name?",
          "className": "form-control",
          "subType": "text",
          "sequenceNumber": 10,
          "linkTo": "",
          "handle": true
        },
        {
          "type": "customer_radio",
          "icon": "assets/images/flow_icons/single_choice.png",
          "question": "Please select your gender?",
          "subType": "singleChoice",
          "sequenceNumber": 11,
          "values": [
            {
              "label": "Male",
              "value": "male",
              "sequenceNumber": 0,
              "linkTo": ""
            },
            {
              "label": "Female",
              "value": "female",
              "sequenceNumber": 1,
              "linkTo": ""
            }
          ]
        },
        {
          "type": "customer_email",
          "icon": "assets/images/flow_icons/email.png",
          "required": true,
          "question": "Please enter your email?",
          "className": "form-control",
          "subType": "email",
          "sequenceNumber": 12,
          "linkTo": "",
          "handle": true
        },
        {
          "type": "customer_phone",
          "icon": "assets/images/flow_icons/phone.png",
          "question": "Please enter your phone number?",
          "className": "form-control",
          "subType": "phone",
          "sequenceNumber": 13,
          "phoneNumberWithDialcode": "",
          "linkTo": "",
          "handle": true,
          "dropDownData" : []
        },
        {
          "type": "customer_date",
          "icon": "assets/images/flow_icons/date.png",
          "question": "Please enter your date of birth?",
          "subType": "date",
          "sequenceNumber": 14,
          "linkTo": "",
          "className": "form-control"
        },
        {
          "type": "customer_age",
          "icon": "assets/images/flow_icons/date.png",
          "question": "Please enter your Age?",
          "subType": "age",
          "sequenceNumber": 15,
          "linkTo": "",
          "className": "form-control"
        },
        {
          "type": "customer_city",
          "icon": "assets/images/flow_icons/date.png",
          "question": "Please enter your City?",
          "subType": "city",
          "sequenceNumber": 16,
          "linkTo": "",
          "className": "form-control"
        },
        {
          "type": "customer_country",
          "icon": "assets/images/flow_icons/date.png",
          "question": "Please enter your country?",
          "subType": "country",
          "sequenceNumber": 17,
          "linkTo": "",
          "className": "form-control"
        },
        {
          "type": "customer_address",
          "icon": "assets/images/flow_icons/date.png",
          "question": "Please enter your Address?",
          "subType": "address",
          "sequenceNumber": 18,
          "linkTo": "",
          "className": "form-control"
        }
      ]
    },
    {
      "type": "link",
      "icon": "assets/images/flow_icons/external_link.png",
      "question": "External Link",
      "subType": "link",
      "linkTo": "",
      "className": "form-control",
      "externalLink": ''
    },
    {
      "type": "tnc",
      "icon": "assets/images/flow_icons/tnc.png",
      "question": "Please accept the T&C",
      "subType": "tnc",
      "linkTo": "",
      "className": "form-control",
      "tncDescription": "accept",
      "checked": true,
      "tempVariable": ''
    },
    {
      "type": "popup",
      "icon": "assets/images/flow_icons/popup.png",
      "question": "Popup",
      "subType": "popup",
      "linkTo": "",
      "className": "form-control",
      "popupDescription": '',
      "tempVariable": ''

    },
    {
      "type": "textarea",
      "icon": "assets/images/flow_icons/large_text.png",
      "question": "Large Text",
      "className": "form-control",
      "subType": "textarea",
      "linkTo": "",
      "tempVariable": "",
      "handle": true
    },
    {
      "type": "label",
      "icon": "assets/images/flow_icons/label.png",
      "question": "Display Text",
      "className": "form-control",
      "subType": "displayText",
      "displayStyle": ['h1', 'h2', 'h3', 'h4'],
      "fontStyle": "h1",
      "linkTo": "",
      "tempVariable": "",
      "handle": true
    },
    {
      "type": "imageupload",
      "icon": "assets/images/flow_icons/image.png",
      "question": "Image",
      "className": "form-control",
      "subType": "image",
      "linkTo": "",
      "tempVariable": "",
      "handle": true,
      "filepathurl": ""
    },
    {
      "type": "videoupload",
      "icon": "assets/images/flow_icons/video.png",
      "question": "Video",
      "className": "form-control",
      "subType": "image",
      "linkTo": "",
      "tempVariable": "",
      "handle": true,
      "filepathurl": "",
      "videoLink": "",
    },
    {
      "type": "thankyouMessage",
      "icon": "assets/images/flow_icons/thank_you.png",
      "subType": "thankyouMessage",
      "tempVariable": "",
      "question": "Thank You"
    },
    {
      "type": "backButton",
      "icon": "assets/images/flow_icons/back.png",
      "subType": "back",
      "tempVariable": "",
      "question": "Back"
    },
    {
      "type": "nextButton",
      "icon": "assets/images/flow_icons/next_btn.png",
      "subType": "next",
      "tempVariable": "",
      "question": "Next"
    },
    {
      "type": "button",
      "icon": "assets/images/flow_icons/submit.png",
      "subType": "submit",
      "tempVariable": "",
      "question": "Submit"
    },


  ];

  modelFields: Array<field> = [];
  model: any = {
    name: 'Feedback Survey',
    description: 'Questions',
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: ""
    },
    attributes: this.modelFields
  };

  report = false;
  reports: any = [];
  getJsonDataCreateFlow;
  pages = [];
  tabNumber: any;
  brand: any;
  countries: any[];
  brandId: any = [];
  currentemailType: any;
  currentkioskType: any;
  currentsmsType: any;
  currentOnlineType:any;
  countryId: any = [];
  flowId: any;
  // loading: boolean;
  public NPSColorCodes: any = [];
  public npsValues: any = [];
  public sentimentIcons: any = [];
  public emojiValues: any = [];
  fbTransaction: any;
  fbEnquiry: any;
  caTransaction: any;
  caEnquiry: any;
  language: any;
  qrEnquiry: any;
  qrTransactionDelivery: any;
  qrTransactionPickUp: any;
  fbTransactionDelivery: any;
  fbTransactionPickUp: any;

  constructor(
    private fb: FormBuilder,public dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router, public snackBar: MatSnackBar, private route: ActivatedRoute, private dataService: SendJsonDatatoParentService, private http: HttpService
  ) {
    this.buildCreateAboutUsForm();

  }

  ngOnInit() {
    this.getSentimentNPSValues();
    this.getDataFromChild();
    this.getParams();
    this.getCurrentFowData();
    this.getBrand();
    // this.getCountryByBrandId(this.brandId);
    // this.clickOnTab = false;
  }
  getSentimentNPSValues() {
    let GET_EMOJI_NPS = environment.APIEndpoint + "api/rpa/feedback/nps/sentiment/v1/view";
    this.http.getJson(GET_EMOJI_NPS).subscribe((response) => {
      console.log(response);
      this.NPSColorCodes = response['colourCodingCreateBean'];
      this.sentimentIcons = response['sentimentCreateBean'];
      console.log(this.NPSColorCodes);
      if (this.NPSColorCodes != null && this.NPSColorCodes != '') {
        for (var i = 0; i < this.fieldModels.length; i++) {
          if (this.fieldModels[i].type == 'rating') {
            console.log(this.fieldModels[i]);
            console.log(this.fieldModels[i].values);
            this.npsValues = this.fieldModels[i].values;
            console.log(this.npsValues);
            // this.fieldModels[i].values = this.NPSColorCodes;
            // console.log(this.fieldModels[i].values);
            // console.log(this.fieldModels);

          }
        }
        if (this.npsValues != null) {
          for (var j = 0; j < this.npsValues.length; j++) {
            for (var k = 0; k < this.NPSColorCodes.length; k++) {
              // console.log(this.npsValues[j].value);
              // console.log(this.NPSColorCodes[k].id);
              if (this.npsValues[j].id == this.NPSColorCodes[k].id) {
                this.npsValues[j].color = this.NPSColorCodes[k].colourCoding;
              }
            }
          }
          console.log(this.npsValues);
          console.log(this.fieldModels);
        }
      }
      if (this.sentimentIcons != null && this.sentimentIcons != '') {
        for (var i = 0; i < this.fieldModels.length; i++) {
          if (this.fieldModels[i].type == 'emoji') {
            console.log(this.fieldModels[i]);
            console.log(this.fieldModels[i].values);
            this.emojiValues = this.fieldModels[i].values;
            console.log(this.emojiValues);
            // this.fieldModels[i].values = this.sentimentIcons;
            // console.log(this.fieldModels[i].values);
            // console.log(this.fieldModels);

          }
        }
        if (this.emojiValues != null) {
          for (var j = 0; j < this.emojiValues.length; j++) {
            for (var k = 0; k < this.sentimentIcons.length; k++) {
              // console.log(this.emojiValues[j].value);
              // console.log(this.sentimentIcons[k].id);
              if (this.emojiValues[j].id == this.sentimentIcons[k].id) {
                this.emojiValues[j].label = this.sentimentIcons[k].beforeClickSentimentImage;
                this.emojiValues[j].afterClickSentimentImage = this.sentimentIcons[k].afterClickSentimentImage;
              }
            }
          }
          console.log(this.emojiValues);
          console.log(this.fieldModels);
        }
      }
    }
    )
  }

  getParams() {
    this.UrlId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.UrlId)
  }

  public getCurrentFlowData;
  public currentFlowName;
  public pageLength;
  pageNumber = [];
  public UrlId;

  public idIndexNew: number;
  getCurrentFowData() {
    const getFlowData = "api/rpa/feedback/flow/unsec/v1/viewB2B";
    let reqBody = {
      flowId: this.UrlId,
    };
    this.http.postJson(environment.APIEndpoint + getFlowData, reqBody).subscribe((data: any) => {
      console.log(data);
      this.getCurrentFlowData = data;
      this.currentFlowName = data['flowName'];
      this.currentemailType = data['emailType'] == "YES" ? true : false;
      this.currentkioskType = data['kioskType'] == "YES" ? true : false;
      this.currentsmsType = data['smsType'] == "YES" ? true : false;
      this.currentOnlineType = data['onlineType'] == "YES" ? true : false;
      this.countryId = data['countryId'];
      this.brandId = data['brandId'];
      this.flowId = data['flowId'];
      this.fbTransaction = data['isFbTransaction'];
      this.fbEnquiry = data['isFbEnquiry'];
      this.caTransaction = data['isCaTransaction'];
      this.caEnquiry = data['isCaEnquiry'];
      this.qrEnquiry = data['isQrCodeEnquiry'];
      this.fbTransactionPickUp = data['isFbTransactionPickup'];
      this.fbTransactionDelivery = data['isFbTransactionDelivery'];
      this.qrTransactionPickUp = data['isQrTransactionPickup'];
      this.qrTransactionDelivery = data['isQrTransactionDelivery'];


      this.language = data['language'];
      this.getAllCountries(this.brandId);
      // this.currentsmsType = data['smsType'];
      this.pageLength = JSON.parse(data["pageJson"]);
      console.log(this.pageLength)
      this.pageLength.forEach(element => {
        this.pageNumber.push(element.pageNo);
      });
      this.tabs.push(...this.pageNumber);
      console.log(this.tabs);
      var maxLengthElemnt = Math.max(...this.tabs);
      this.idIndexNew = maxLengthElemnt;
      console.log('max length', this.idIndexNew)
      console.log(this.pageLength.length);

      this.updateFlowFormGroup.patchValue({
        flowName: this.currentFlowName,
        emailType: this.currentemailType,
        kioskType: this.currentkioskType,
        smsType: this.currentsmsType,
        onlineType: this.currentOnlineType,
        countryOid: this.countryId,
        brandOid: this.brandId,
        language: this.language
      });
    })
  }

  public buildCreateAboutUsForm() {
    let form = {
      flowName: ["", Validators.required],
      emailType: false,
      kioskType: false,
      smsType: false,
      onlineType: false,
      brandOid: [''],
      countryOid: [''],
      language:['']

    }
    this.updateFlowFormGroup = this.fb.group(form);
  }

  public getDataFromChild() {
    this.dataService.dataJson
      .subscribe(
        (data) => {
          console.log(data)
          this.getJsonDataCreateFlow = data;
          if (data) {
            this.getJsonDataCreateFlow = data;
            console.log("page ", data);
            console.log("pageNo ", data.pageNo);
            const found = this.pages.some(el => el.pageNo === data.pageNo);
            console.log("index " + found);
            if (!found) {


              this.pages.push(this.getJsonDataCreateFlow);
            } else {
              this.pages[data.pageNo - 1] = this.getJsonDataCreateFlow;
            }
            console.log('push all data', this.pages)
          }
        },
        (err) => {
          console.log(err)
        }
      );
  }

  getData(v): void {
    console.log(v)
  }
  // --tabs

  clickOnTab = false;
  addTab(value) {
    var maxLengthElemnt = Math.max(...this.tabs);
    this.idIndexNew = maxLengthElemnt;
    console.log('max length', this.idIndexNew)
    this.tabs.push(this.idIndexNew + 1);
    console.log(this.tabs)
    this.clickOnTab = true;

    if (value) {
      this.selected.setValue(this.idIndexNew);
      console.log(this.tabs.length)
    }

  }

  removeTab(index: number) {

    this.tabs.splice(index, 1);
    let indesx = this.pageLength.findIndex(record => record.pageNo === index + 1);
    console.log(index)
    this.pageLength.splice(indesx, 1);
    console.log("pages", this.pageLength);
  }
  //tabs--
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

  // onDragged(item: any, list: any[], effect: DropEffect) {
  //   if (effect === "move") {
  //     const index = list.indexOf(item);
  //     list.splice(index, 1);
  //   }
  // }

  onDragCanceled(event: DragEvent) {
    console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  onDragover(event: DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }

  // onDrop(event: DndDropEvent, list?: any[]) {
  //   if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {

  //     if (event.dropEffect === "copy")
  //       event.data.name = event.data.type + '-' + new Date().getTime();
  //     let index = event.index;
  //     if (typeof index === "undefined") {
  //       index = list.length;
  //     }
  //     list.splice(index, 0, event.data);
  //   }
  // }


  updateFlow(formdata) {
    // console.log(this.pages.length)
    if (String(this.pageLength) == '' || this.pageLength == null) {
      this.pagesArray = true;
    }
    else {
      this.pagesArray = false;
      if (this.updateFlowFormGroup.invalid == true) {
        this.showError = true;
        this.loading = false;
      } else {
        this.loading = true;
        this.disabled = true;
        this.showError = false;
        let req = {
          flowId: this.flowId,
          flowName: formdata.flowName,
          kioskType: formdata.kioskType === true ? 'YES' : 'NO',
          smsType: formdata.smsType === true ? 'YES' : 'NO',
          emailType: formdata.emailType === true ? 'YES' : 'NO',
          countryOid: formdata.countryOid,
          brandOid: formdata.brandOid,
          pages: this.pageLength,
          pageJson: JSON.stringify(this.pageLength)
        }
        console.log(req);
        this.http.postJson(environment.APIEndpoint + "api/rpa/feedback/flow/v1/updateFlow", req).subscribe(
          (res) => {
            console.log(res);
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Flow has been updated successfully"
              }
            });
            this.loading = false;
            this.disabled = false;
            this.router.navigate(['/search-flow']);
          },
          err => {
            this.loading = false;
            this.disabled = false;
            console.log("error Status = " + err.error.errorDetails[0].description);
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          }
        )
        console.log(req);
        console.log("pages", this.pages);
      }
    }
  }
  data: any;
  receiveDataFromChild($event) {
    this.data = $event
    console.log('recied data From child')
    console.log(this.data)
    this.getJsonDataCreateFlow = this.data;
    if (this.data) {
      this.getJsonDataCreateFlow = this.data;
      console.log("page ", this.data);
      console.log("pageNo ", this.data.pageNo);
      if (this.data.attributes.length > 0) {
        for (var i = 0; i > this.data.attributes.length; i++) {
          console.log('customerdata', this.data.attributes['customerData'].type)
        }
      }
      const found = this.pageLength.some(el => el.pageNo === this.data.pageNo);
      console.log("index " + found);
      if (!found) {
        this.pageLength.push(this.getJsonDataCreateFlow);
      } else {
        this.pageLength[this.data.pageNo - 1] = this.getJsonDataCreateFlow;
      }
      console.log('push all data', this.pageLength);
    }
  }

  getBrand() {
    const SEARCH_BRANDS = 'api/rpa/master/brand/v1/getAllBrand';
    this.http.getJson(environment.APIEndpoint + SEARCH_BRANDS).subscribe(res => {
      this.brand = res;
      console.log(this.brand);
    }, err => {
      console.log(err);
    });

  }

  // getCountryByBrandId(BrandId) {
  //   const COUNTRY_BY_BRAND = environment.APIEndpoint + 'api/rpa/master/brand/v1/getBrandRegion/' + BrandId;
  //   this.http.getJson(COUNTRY_BY_BRAND)
  //       .subscribe((response) => {
  //           console.log(response);
  //           this.countries = response;
  //       });
  // }
  // selectCountryByBrandId(brand) {
  //   this.brandId = brand.brandId;
  //   this.getCountryByBrandId(this.brandId);
  // }

  getAllCountries(brandId) {
    console.log(brandId)
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
    this.http.getJson(GET_ALL_COUNTRIES + '?brandOid=' + brandId)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;
      })
  }


  // DUMP flow Data

  openDumpFlow() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      flowOid: this.flowId
    }
    const dialogRef = this.dialog.open(DumpFlowDialogComponent, dialogConfig);
  }

  // export json functionality
  fakeValidateUserData() {
    return of(this.pageLength);
  }

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  //.txt file download
  // dynamicDownloadTxt() {
  //   this.fakeValidateUserData().subscribe((res) => {
  //     this.dyanmicDownloadByHtmlTag({
  //       fileName: 'My Report',
  //       text: JSON.stringify(res)
  //     });
  //   });
  // }

  dynamicDownloadJson() {
    this.fakeValidateUserData().subscribe((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'Flow.json',
        text: JSON.stringify(res)
      });
    });
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }


}
