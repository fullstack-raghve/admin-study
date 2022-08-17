import { Component, Inject, AfterViewInit } from '@angular/core';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import * as access from 'src/app/constants/countries.constant';
declare var $: any;

@Component({
    selector: 'segment-rule.component',
    templateUrl: 'segment-rule.component.html',
    styleUrls: ['segment-rule.component.scss']
})

export class segmentRuleDialog implements AfterViewInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public queryCtrl: FormControl;
    public segmentAttrJson;
    public countries: Array<{ name: string, value: string }> = [];
    public cities: Array<{ name: string, value: string }> = [];
    public tiers: Array<{ name: string, value: string }> = [];
    public brands: Array<{ name: string, value: string }> = [];
    public countryData: any;
    public countryJsonList = access.countries.country;
    public selectedId;

    predefinedFormGroup: FormGroup;

    preDefinedsegments = [
        {
            segmentId: 1,
            segmentName: 'Average Ticket size across all Brands for a period',
            rules: [{
                id: 'txn__average',
                operator: 'greater',
                value: '250',
                flags: {
                    filter_readonly: true,
                }
            },
            ]
        },
        {
            segmentId: 2,
            segmentName: 'Average ticket size by Brand',
            rules: [{
                id: 'txn__average',
                operator: 'greater',
                value: '250',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'txn__brand_transacted',
                operator: 'in',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
        ]
        },
        {
            segmentId: 3,
            segmentName: 'Annual Spending in currency',
            rules: [{
                id: 'txn__annual__spend',
                operator: 'greater',
                value: '250',
                flags: {
                    filter_readonly: true,
                }
            },
            ]
        },
        {
            segmentId: 4,
            segmentName: 'Lifetime spending in a currency',
            rules: [{
                id: 'txn__lifetime__spend',
                operator: 'greater',
                value: '250',
                flags: {
                    filter_readonly: true,
                }
            },
            ]
        },
        {
            segmentId: 5,
            segmentName: 'Cumulative spending with specific Brands',
            rules: [{
                id: 'txn__cumulative__spend',
                operator: 'equal',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'txn__brand_transacted',
                operator: 'in',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
        ]
        },
        {
            segmentId: 6,
            segmentName: 'Cumulative spending across Brands',
            rules: [{
                id: 'txn__cumulative__spend',
                operator: 'equal',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
            ]
        },
        {
            segmentId: 7,
            segmentName: 'Prefered Brand',
            rules: [
                {
                    id: 'txn__brand_transacted',
                    operator: 'in',
                    value: '',
                    flags: {
                        filter_readonly: true,
                    }
                },
                {
                    id: 'txn__brand_transacted',
                    operator: 'not_in',
                    value: '',
                    flags: {
                        filter_readonly: true,
                    }
                },
            ]
        },
        {
            segmentId: 8,
            segmentName: 'Value in respective point type',
            rules: [{
                id: 'cpst__balance__points',
                operator: 'greater',
                value: '10',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'cpst__brand',
                operator: 'in',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'cpst__points__region',
                operator: 'equal',
                value: 'GCC',
                flags: {
                    filter_readonly: true,
                }
            },
            ]
        },
        {
            segmentId: 9,
            segmentName: 'Expiry of points during a certain period',
            rules: [{
                id: 'cpst__balance__points',
                operator: 'greater',
                value: '10',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'cpst__expiry__point__days',
                operator: 'between',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            },
            {
                id: 'cpst__points__region',
                operator: 'equal',
                value: '',
                flags: {
                    filter_readonly: true,
                }
            }]
        },
        {
            segmentId: 10,
            segmentName: 'Number of visits with transactions period',
            rules: [
                {
                    id: "npvisit__no__visits",
                    operators: 'between',
                    value: '',
                    flags: {
                        filter_readonly: true,
                    }
                },
                {
                    id: "npvisit__date",
                    operators: 'between',
                    value: '',
                    flags: {
                        filter_readonly: true,
                    }
                },
            ]
        },
    ];

    constructor(
        private https: HttpService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<MatDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public snackBar: MatSnackBar) {
        this.buildPreDefinedForm();
        if (data != null && data != undefined) {
            if (data.segmentAttrJson != "" && data.segmentAttrJson != undefined && data.segmentAttrJson != null) {
                try {
                    this.segmentAttrJson = JSON.parse(data.segmentAttrJson);
                }
                catch{
                    this.segmentAttrJson = data.segmentAttrJson;
                }
            }
        }
        dialogRef.disableClose = true;
    }

    public buildPreDefinedForm() {
        let form = {
            preDefinedsegmentsCtrl: [""],
        }
        this.predefinedFormGroup = this.fb.group(form);
    }

    ngAfterViewInit() {
        this.getQueryBuilder();
        $('#builder').on('afterCreateRuleInput.queryBuilder', function (e, rule) {
            if (rule.filter.plugin == 'selectize') {
                rule.$el.find('.rule-value-container').css('min-width', '200px')
                    .find('.selectize-control').removeClass('form-control');
            }
        });
        $('#builder').on('validationError.queryBuilder', function (e, rule, error, value) {
            if (rule.filter !== null && rule.filter !== undefined) {
                if (rule.filter && rule.filter.id === 'birthDateRange') {
                    var regEx = /^(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                    if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                        $("#errorValidation").text(error[0]);
                    }
                }
                if (rule.filter && (rule.filter.id == 'tspt__point__expiry__date') || rule.filter.id == 'txn__date' || rule.filter.id == 'pstmt__redeem__date' || rule.filter.id == 'pstmt__redeem__date_bonus' || rule.filter.id == 'pstmt__redeem__date_bonus_redeem') {
                    $("#errorValidation").text(error[0]);
                }

                if (rule.filter && rule.filter.id == 'ca__dateOfBirth') {
                    if (error[0] == 'number_not_integer') {
                        $("#errorValidation").text('The provided age not valid');
                    } else if (error[0] == 'number_exceed_min') {
                        $("#errorValidation").text('The provided age should be greater than 0');
                    } else if (error[0] == 'number_between_invalid') {
                        $("#errorValidation").text('The provided age range not valid');
                    }
                }

                if (rule.filter && rule.filter.id == 'txn__no') {
                    if (error[0] == 'number_not_integer') {
                        $("#errorValidation").text('The provided transcation number not valid');
                    } else if (error[0] == 'number_exceed_min') {
                        $("#errorValidation").text('The provided transcation number should be greater than 0');
                    } else if (error[0] == 'number_between_invalid') {
                        $("#errorValidation").text('The provided transcation numbers range not valid');
                    }
                }
            }
        });
    }

    segmentSelection(id) {
        this.selectedId = id;
    }

    applyCustomRule() {
        const result = $('#builder').queryBuilder('getRules', { get_flags: true, skip_empty: true, allow_invalid: true });
        if (!$.isEmptyObject(result)) {
            if (this.selectedId) {
                const [selectedSegment] = this.preDefinedsegments.filter(segment => segment.segmentId === this.selectedId)
                result.rules.push(
                    {
                        "condition": "AND",
                        "rules": selectedSegment.rules
                    });
            }
            $('#builder').queryBuilder('setRules', result);
        } else {
            if (this.selectedId) {
                const [selectedSegment] = this.preDefinedsegments.filter(segment => segment.segmentId === this.selectedId)
                $('#builder').queryBuilder('setRules', selectedSegment.rules);
            }
        }
    }

    reset() {
        $('#builder').queryBuilder('reset');
        this.buildPreDefinedForm();
    }

    private getQueryBuilder() {

        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let countryJsonList = access.countries.country;
        $('#builder').queryBuilder({
            display_errors: true,
            plugins: [
                'sortable',
                'filter-description',
                'unique-filter',
                'bt-tooltip-errors',
            ],

            operators: $.fn.queryBuilder.constructor.DEFAULTS.operators.concat([
                { type: 'test_equal_oprator', nb_inputs: 2, multiple: false, apply_to: ['string'] },
                { type: 'test_not_equal_oprator', nb_inputs: 2, multiple: false, apply_to: ['string'] }
            ]),
            lang: {
                operators: {
                    is_null: 'No',
                    is_not_null: 'Yes'
                }
            },
            filters: [
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__gender",
                    "label": "Gender",
                    "type": "string",
                    "input": "select",
                    "multiple": "true",
                    unique: 'group',
                    "values": {
                        "MALE": "Male",
                        "FEMALE": "Female",
                        "null": "Not Available"
                    },
                    "operators": ["in", "not_in"],
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__dateOfBirth",
                    "label": "Age",
                    "type": "integer",
                    unique: 'group',
                    validation: {
                        min: 1
                    },
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "birthDateRange",
                    "label": "DOB Range without year",
                    "type": "string",
                    "placeholder": "mm-dd",
                    unique: 'group',
                    validation: {
                        format: /^(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
                        messages: {
                            format: 'The provided Date is not valid'
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Customer Profile",
                    id: "ca__COUNTRY_CODE",
                    label: "Mobile Country Code",
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'code',
                        labelField: 'name',
                        searchField: 'name',
                        sortField: 'name',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            countryJsonList.forEach(country => {
                                this.addOption(country);
                            });

                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    id: "ca__COUNTRY_OID",
                    label: "Country of Residence",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'countryId',
                        labelField: 'countryName',
                        searchField: 'countryName',
                        sortField: 'countryName',
                        create: false,
                        plugins: ['remove_button'],

                        onInitialize: function () {
                            var that = this;
                            if (localStorage.countryData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries", function (data) {
                                    localStorage.countryData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.countryData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__RELIGION_OID",
                    "label": "Religion",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'oid',
                        labelField: 'religionTitle',
                        searchField: 'religionTitle',
                        sortField: 'religionTitle',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.religionData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/country/v1/get/countries", function (data) {
                                    localStorage.religionData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.religionData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "rul__location",
                    "label": "Location",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'cityId',
                        labelField: 'cityName',
                        searchField: 'cityName',
                        sortField: 'cityName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.cityData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/city/v1/list", function (data) {
                                    localStorage.cityData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.cityData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__CITY_OID",
                    "label": "City",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'cityId',
                        labelField: 'cityName',
                        searchField: 'cityName',
                        sortField: 'cityName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.cityData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/city/v1/list", function (data) {
                                    console.log(localStorage.cityData);
                                    localStorage.cityData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.cityData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    id: "rfms__customer",
                    label: "RFM Segment",
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: false,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'rfmsValue',
                        labelField: 'rfmsKey',
                        searchField: 'rfmsKey',
                        sortField: 'rfmsKey',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.rfmData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/customer/segment/v1/getRfmsValue", function (data) {
                                    localStorage.rfmData = JSON.stringify(data);
                                    data['rfms'].forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                const menuData = JSON.parse(localStorage.getItem('rfmData'));
                                this.rfms = menuData.rfms;
                                this.rfms.forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['equal'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    id: "ca__NATIONALITY_OID",
                    label: "Nationality",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'countryId',
                        labelField: 'countryName',
                        searchField: 'countryName',
                        sortField: 'countryName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.countryData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries", function (data) {
                                    localStorage.countryData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.countryData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__FAMILY_SIZE",
                    "label": "Family Size",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__EMAIL_ID",
                    "label": "EmailId",
                    unique: 'group',
                    "operators": ["is_null", "is_not_null"]
                },
                {
                    "optgroup": "Customer Profile",
                    id: "ca__TIER_OID",
                    label: "Customer Tier",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    unique: 'group',
                    plugin_config: {
                        valueField: 'tierId',
                        labelField: 'tierName',
                        searchField: 'tierName',
                        sortField: 'tierName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.tierData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/tier/v1/qualification/list", function (data) {
                                    localStorage.tierData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.tierData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__OFFER_NOTIFICATION",
                    "label": "Receive Offer Notification",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "YES": "Yes",
                        "NO": "No"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__all_registered",
                    "label": "All Users",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "YES": "Yes",
                        "NO": "No"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__GEO_NOTIFICATION",
                    "label": "Receive Location Notifications",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "YES": "Yes",
                        "NO": "No"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__MIGRATED_USER",
                    "label": "Migrated",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "YES": "Yes",
                        "NO": "No"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__GUEST_USER",
                    "label": "Guest",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "YES": "Yes",
                        "NO": "No"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__OID",
                    "label": "Fixed Customers",
                    "type": "string",
                    "placeholder": "Enter Member Id/Id's comma seperated",
                    unique: 'group',
                    "operators": ["in", "not_in"],
                    valueGetter: function (rule) {
                        var ids = rule.$el.find('.rule-value-container [name$=_0]').val();
                        return ids.split(',');
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "ca__CUSTOMER_TAG",
                    "label": "Customer Tag",
                    "type": "string",
                    "input": "select",
                    "multiple": "true",
                    unique: 'group',
                    "operators": ["in", "not_in"],
                    "values": {
                        "M1": "M1",
                        "M2": "M2",
                        "M3": "M3",
                        "M4": "M4",
                        "M5": "M5"
                    }
                },
                {
                    "optgroup": "Customer Profile",
                    "id": "INCOMPLETE_PROFILE",
                    "label": "Incomplete Profile",
                    unique: 'group',
                    "operators": ["is_null", "is_not_null"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__transaction_type",
                    "label": "Transaction Type",
                    "type": "string",
                    "input": "select",
                    "operators": ["equal"],
                    unique: 'group',
                    "values": {
                        "Purchase": "After go-live",
                        "Migrated": "Migrated"
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__brand_transacted",
                    "label": "Brands Transacted With",
                    unique: 'group',
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'brandId',
                        labelField: 'brandName',
                        searchField: 'brandName',
                        sortField: 'brandName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.brandData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands", function (data) {
                                    localStorage.brandData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.brandData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__city",
                    "label": "City Transacted With",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'cityId',
                        labelField: 'cityName',
                        searchField: 'cityName',
                        sortField: 'cityName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.cityData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/city/v1/list", function (data) {
                                    localStorage.cityData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.cityData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__no",
                    "label": "No. of Transactions",
                    "type": "integer",
                    unique: 'group',
                    validation: {
                        min: 1
                    },
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__date",
                    "label": "Transaction Date",
                    "type": "string",
                    unique: 'group',
                    "placeholder": "yyyy-mm-dd",
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Transaction Date should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Transaction Date is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Transaction Date range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "npvisit__no__visits",
                    "label": "Number of Visits",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "npvisit__date",
                    "label": "Period of Visit with Transaction",
                    "type": "string",
                    unique: 'group',
                    "placeholder": "yyyy-mm-dd",
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Period of Visit with Transaction should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Period of Visit with Transaction is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Period of Visit with Transaction range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__average",
                    "label": "Average Value of Transactions",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__currency",
                    "label": "Currency",
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    unique: 'group',
                    multiple: false,
                    plugin_config: {
                        valueField: 'currencyId',
                        labelField: 'currencyCode',
                        searchField: 'currencyCode',
                        sortField: 'currencyCode',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.currencyData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/currency/v1/select", function (data) {
                                    localStorage.currencyData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.currencyData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['equal'],
                    valueSetter: function (rule, value) {
                    
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__annual__spend",
                    "label": "Annual Spending",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__cumulative__spend",
                    "label": "Cumulative Spending",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__lifetime__spend",
                    "label": "Lifetime Spending",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Transaction History",
                    "id": "txn__last__transaction",
                    "label": "Last Transaction",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "7": "Last 7 Days",
                        "15": "Last 15 Days",
                        "30": "Last 30 Days",
                        "180": "Last 180 Days",
                        "365": "Last 365 Days"
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "cc__coupon__oid",
                    "label": "Coupon",
                    unique: 'group',
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'couponId',
                        labelField: 'couponTitle',
                        searchField: 'couponTitle',
                        sortField: 'couponTitle',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.coupon === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/coupon/v1/list", function (data) {
                                    localStorage.coupon = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.coupon).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Transaction History",
                    "id": "cc__coupon__status",
                    "label": "Coupon Status",
                    "type": "string",
                    "input": "select",
                    unique: 'group',
                    "operators": ["equal", "not_equal"],
                    "values": {
                        "CLAIMED_ACTIVE": "CLAIMED ACTIVE",
                        "CLAIMED_EXPIRED": "CLAIMED EXPIRED",
                        "DELIVERED": "DELIVERED",
                        "NOT_CLAIMED_EXPIRED": "NOT CLAIMED EXPIRED",
                        "USED": "USED"
                    }
                },
                {
                    "optgroup": "Point Balance",
                    "id": "pstmt__redeem__point",
                    "label": "Point Redeemed",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
               
                {
                    "optgroup": "Point Balance",
                    "id": "pstmt__redeem__date",
                    "label": "Point Redeemed Date",
                    "type": "date",
                    unique: 'group',
                    placeholder: 'yyyy-mm-dd',
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Point Redeemed Date should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Point Redeemed Date is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Point Redeemed Date range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "cpst__balance__points",
                    "label": "Specific No. of Points",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "tspt__expiry__point",
                    "label": "Expiry Points",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "tspt__point__expiry__date",
                    "label": "Point Expiry Date",
                    "type": "date",
                    unique: 'group',
                    placeholder: 'yyyy-mm-dd',
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Point Expiry Date should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Point Expiry Date is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Point Expiry Date range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "tspt__brand",
                    "label": "Point Expiry Brand",
                    unique: 'group',
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'brandId',
                        labelField: 'brandName',
                        searchField: 'brandName',
                        sortField: 'brandName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.brandData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands", function (data) {
                                    localStorage.brandData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.brandData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Point Balance",
                    "id": "cpst__expiry__point__days",
                    "label": "Remaining Days For Expiry",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "pstmt__redeem__date_bonus",
                    "label": "Bonus Points Earned",
                    "type": "date",
                    unique: 'group',
                    placeholder: 'yyyy-mm-dd',
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Bonus Points Earned Date should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Bonus Points Earned Date is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Bonus Points Earned Date range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Point Balance",
                    "id": "pstmt__redeem__date_bonus_redeem",
                    "label": "Bonus points redeemed",
                    "type": "date",
                    unique: 'group',
                    placeholder: 'yyyy-mm-dd',
                    validation: {
                        callback: function (value, rule) {
                            var regEx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
                            if (value[0] == null || value[1] == null) {
                                return ['Bonus points redeemed Date should not empty', value];
                            } else if ((value[0].match(regEx)) == null || (value[1].match(regEx)) == null) {
                                return ['Bonus points redeemed Date is not valid', value];
                            } else if (new Date(value[0]) > new Date(value[1])) {
                                return ['Bonus points redeemed Date range not valid', value];
                            }

                            return true;
                        }
                    },
                    "operators": ["between", "not_between"]
                },
                {
                    "optgroup": "Visit History",
                    "id": "txn__storeId",
                    "label": "Store Transacted With",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'storeId',
                        labelField: 'storeName',
                        searchField: 'storeName',
                        sortField: 'storeName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.storeData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.get(environment.APIEndpoint + "api/rpa/store/v2/getAllStores", function (data) {
                                    localStorage.storeData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.storeData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Visit History",
                    "id": "txn__mall",
                    "label": "Mall Transacted With",
                    unique: 'group',
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'mallId',
                        labelField: 'mallName',
                        searchField: 'mallName',
                        sortField: 'mallName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;

                            if (localStorage.mallData === undefined) {

                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls?cityIds=", function (data) {
                                    localStorage.mallData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.mallData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "App Attributes",
                    "id": "rpt__call__to__reserve",
                    "label": "Call To Reserve",
                    unique: 'group',
                    type: "integer",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'brandId',
                        labelField: 'brandName',
                        searchField: 'brandName',
                        sortField: 'brandName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.brandData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands", function (data) {
                                    localStorage.brandData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.brandData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__email__campaign__id",
                    "label": "Response To Campaign - Email",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'campaignId',
                        labelField: 'campaignName',
                        searchField: 'campaignName',
                        sortField: 'campaignName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.emailCampiagnData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn?communicationType=Email", function (data) {
                                    localStorage.emailCampiagnData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.emailCampiagnData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__email__read__status",
                    "label": "Response To Campaign Email Read",
                    unique: 'group',
                    type: "string",
                    input: 'radio',
                    "values": {
                        "Yes": "Yes",
                        "No": "No"
                    },
                    operators: ['equal', 'not_equal']
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__email__clicked__status",
                    "label": "Response To Campaign Email Any Link Clicked",
                    unique: 'group',
                    type: "string",
                    input: 'radio',
                    "values": {
                        "Yes": "Yes",
                        "No": "No"
                    },
                    operators: ['equal', 'not_equal']
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__sms__campaign__id",
                    "label": "Response To Campaign - SMS",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'campaignId',
                        labelField: 'campaignName',
                        searchField: 'campaignName',
                        sortField: 'campaignName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.smsCampiagnData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn?communicationType=SMS", function (data) {
                                    localStorage.smsCampiagnData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.smsCampiagnData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__sms__delivered__status",
                    "label": "Response To Campaign SMS Delivered",
                    unique: 'group',
                    type: "string",
                    input: 'radio',
                    "values": {
                        "PROCESSED": "Processed",
                        "FAILED": "Failed"
                    },
                    operators: ['equal', 'not_equal']
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__exclude__campaign__cust",
                    "label": "Exclude Customers from this campaign",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'campaignId',
                        labelField: 'campaignName',
                        searchField: 'campaignName',
                        sortField: 'campaignName',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.campiagnData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn", function (data) {
                                    localStorage.campiagnData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.campiagnData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__coupon__email__couponId",
                    "label": "Response To Coupon - Email",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'couponId',
                        labelField: 'couponTitle',
                        searchField: 'couponTitle',
                        sortField: 'couponTitle',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.couponData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/coupon/v1/list", function (data) {
                                    localStorage.couponData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.couponData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__coupon__email__read",
                    "label": "Response To Coupon Email Read",
                    unique: 'group',
                    type: "string",
                    input: 'radio',
                    "values": {
                        "Yes": "Yes",
                        "No": "No"
                    },
                    operators: ['equal', 'not_equal']
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__coupon__email__clicked",
                    "label": "Response To Coupon Email Any Link Clicked",
                    unique: 'group',
                    type: "string",
                    input: 'radio',
                    "values": {
                        "Yes": "Yes",
                        "No": "No"
                    },
                    operators: ['equal', 'not_equal']
                },
                {
                    "optgroup": "Response Attributes",
                    "id": "res__exclude__coupon__cust",
                    "label": "Exclude Customers from this coupon",
                    unique: 'group',
                    type: "string",
                    input: "select",
                    plugin: 'selectize',
                    multiple: true,
                    plugin_config: {
                        valueField: 'couponId',
                        labelField: 'couponTitle',
                        searchField: 'couponTitle',
                        sortField: 'couponTitle',
                        create: false,
                        plugins: ['remove_button'],
                        onInitialize: function () {
                            var that = this;
                            if (localStorage.couponData === undefined) {
                                $.ajaxSetup({
                                    headers: {
                                        'Authorization': userData.token_type + " " + userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                $.getJSON(environment.APIEndpoint + "api/rpa/coupon/v1/list", function (data) {
                                    localStorage.couponData = JSON.stringify(data);
                                    data.forEach(function (item) {
                                        that.addOption(item);
                                    });
                                });
                            }
                            else {
                                JSON.parse(localStorage.couponData).forEach(function (item) {
                                    that.addOption(item);
                                });
                            }
                        }
                    },
                    operators: ['in', 'not_in'],
                    valueSetter: function (rule, value) {
                        rule.$el.find('.rule-value-container [name$=_0]').selectize()[0].selectize.setValue(value);
                    }
                },
                {
                    "optgroup": "Others",
                    "id": "csc__viewed__offers",
                    "field": "csc__viewed__offers",
                    "label": "Viewed Offers",
                    "type": "integer",
                    unique: 'group',
                    "operators": ["equal", "less", "less_or_equal", "greater", "greater_or_equal"]
                }
            ]
        });

        if (this.segmentAttrJson != undefined) {
            $("#builder").queryBuilder('setRules', this.segmentAttrJson);
        }
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    getSql(): void {

        this.segmentAttrJson = $('#builder').queryBuilder('getRules');

        if (this.segmentAttrJson != null) {
            $("#errorValidation").text("");
            let obj = {
                'buttonName': 'APPLY',
                'segmentAttrJson': this.segmentAttrJson
            }
            this.dialogRef.close(obj);
        }
    }
    resetSql() {
        this.dialogRef.close();
    }
    getAllCities() {
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities"
        this.https.getJson(GET_ALL_CITIES)
            .subscribe((response) => {
                response.forEach(city => {
                    this.cities.push({ name: city.cityName, value: city.cityId });
                })
            })
    }

}
