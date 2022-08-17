import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Globals } from 'src/app/services/global';
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export interface category {
    categoryTitle: string;
    languageId: number;
}
@Component({
    selector: 'edit-brand-category',
    templateUrl: './edit-brand-category.component.html',
    styleUrls: ['./edit-brand-category.component.scss']
})
export class EditBrandCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Brand Category',
        link: '/search-brand-category'
    }
    ];
    @ViewChild("editBrandCategoryForm") editBrandCategoryForm;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    brandCategoryFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showBrandError: boolean = false;
    public minLengthError=false;
    public statusValue: string;
    checked = true;
    disabled = false;
    public languageList: any = [];
    public categoryArr: any = [];
    public arr: any = [];
    public buildFlag: boolean = false;
    public categoryFlag: boolean = false;
    categoryLocales: category[] = [];
    public categoryId;
    public categoryData: any = [];
    public toggleVal: boolean = true;
    public imagePath: string = '';
    public showImageError: boolean = false;
    public imageUploading: boolean = false;
    public alignCss=[];
    public filePathUrl=localStorage.getItem("imgBaseUrl");
    getLanguage() {
        this.languageList = [
            { code: 'EN', name: 'English' },
            { code: 'AR', name: 'Arabic' },
            { code: 'ITL', name: 'Italian' },
            { code: 'FR', name: 'French' }
        ]

    }


    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, private fb: FormBuilder,
        private router: Router, public snackBar: MatSnackBar,
        private uploadFile: UploadFile, ) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.categoryId = params.id;

        // });

    }

    ngOnInit() {
        // this.getBrandById();
        let data=localStorage.getItem('BrandCategoryEditID');
        if(data){
            this.categoryId=data;
            this.getBrandById();
            localStorage.removeItem('BrandCategoryEditID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-brand-category'])
        }
    }

    getBrandById() {
        let GET_BRAND_CATEGORY_BY_ID = environment.APIEndpoint + "api/rpa/master/brandCategory/v1/view";
        let request = {
            categoryId: this.categoryId
        }
        this.http.postJson(GET_BRAND_CATEGORY_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.categoryData = response;
                this.toggleVal == (this.categoryData.status == 'ONLINE' ? true : false);
                this.buildEditBrandCategoryForm(response);
                this.imagePath = response['categoryImgPath'];

            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be saved at this time. Please try again later"
                        }
                    });
                    console.log("error Status = " + err.status);

                })
    }
    //image upload

    url: any = '';
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.url = <string>reader.result;

            }
        }
    }

    public categoryLocale() {
        console.log("size = " + this.languageList.length);
        const control = <FormArray>this.brandCategoryFormGroup.controls['categoryLocales'];
        for(let cn of this.categoryData.brandCategoryLocales) {
            let arr= this.fb.group({
                 brandCategoryName: [cn.categoryTitle,Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });
            control.push(arr);
             this.alignCss.push(cn.languageDirection == 'RTL' ? 'text-right' : '')
        }

    }
    addCategoryValue(code, name) {
        var key = code;
        return this.fb.group({
            [key]: [name, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.:?_-]*')])]
        });
    }

    private buildEditBrandCategoryForm(editBrand) {
        if (editBrand.categoryCode == undefined) {
            let formData = {
                categoryLocales: this.fb.array([]),
                categoryCode: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z0-9 ]{1,10}$")])],

            }
            this.brandCategoryFormGroup = this.fb.group(formData);
        }
        else {

            this.buildFlag = true;

            this.statusValue = editBrand.status;

            this.brandCategoryFormGroup = this.fb.group({
                categoryLocales: this.fb.array([]),
                categoryCode: [editBrand.categoryCode, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z0-9 ]{1,10}$")])],

            })
            this.categoryLocale();
            this.toggleVal = editBrand.status == 'ONLINE' ? true : false;

            this.categoryFlag = true;
            this.brandCategoryFormGroup.updateValueAndValidity();
        }
    }

    updateBrandCategory(formData) {
        this.categoryLocales=[];

         if (this.brandCategoryFormGroup.invalid == true) {
            this.showError = true;
        } else if (this.imagePath == '') {
            this.showImageError = true;
        }
        else {
            this.loading = true;
            this.showError = false;
            formData.categoryLocales.forEach((brandCat, index)=>{
                this.categoryLocales.push({
                    categoryTitle:brandCat.brandCategoryName,
                     languageId:this.categoryData.brandCategoryLocales[index].languageId
                })
            })
            let createBrandReq = {
                categoryId: this.categoryId,
                brandCategoryLocales: this.categoryLocales,
                categoryCode: formData.categoryCode,
                categoryImgPath: this.imagePath,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("contryReq = " + createBrandReq);
            let UPDATE_CATEGORY = environment.APIEndpoint + "api/rpa/master/brandCategory/v1/update";
            this.http.postJson(UPDATE_CATEGORY, createBrandReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Brand category master has been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-brand-category']);
                }
                    , err => {
                        this.loading = false;
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: "Your request cannot be saved at this time. Please try again later"
                            }
                        });
                        console.log("error Status = " + err.status);
                    })
        }

    }
    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }
    public uploadImage(event: FileList) {
        this.imageUploading = true;
        if (event[0].size < 1000000){
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
            this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                .subscribe((response) => {
                    console.log(response);
                    this.imagePath = response['message'];
                    this.imageUploading = false;
                    this.showImageError=false;
                    this.uploadElRef.nativeElement.value = ''

                    console.log("res ::: " + response)
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
                    }


                )
        }else{
            this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Supported format is JPG, JPEG and PNG"
                    }
                });
        }
    }else{
        this.imagePath='';
        this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Max upload file size is 1Mb"
                }
            });
    }
    }
    removeImage(){
        this.imagePath='';
    }

}
