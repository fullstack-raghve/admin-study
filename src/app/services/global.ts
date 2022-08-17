import { Injectable } from "@angular/core";

var S1 = "[";
var S3 = "'";
var S4 = "\\]";
var S5 = "\\\\";

export const Globals = {
  regCommValWhiteListed: '',

  /* Mobile And Email Validators */
  regEmailVal: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
  regMobileVal: '^[0-9]+$',
  // regOnlyNumber: '(/^-?(0|[1-9]\d*)?$/)',
  regUrl: "^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$",

  /* Text Validators */


  /* Number Validators */


  /* Albhanumeric Validators */

  regAlbhanumericVal: "^[0-9a-zA-Z & ( ) , - . : ? '\"\' _/-]{1,40}$",
  regAlbhanumericOnly: "^[0-9a-zA-Z & ( ) , - . : ? '\"\' _/-]+$",
  regAlbhanumericWithoutSpace: "^[0-9a-zA-Z]+$",

  regCustomwhiteList: '^[a-zA-Z0-9\u0600-\u06FF ' + S1 + S3 + S5 + '}{$!"“ ” ‘ ’#%&()\\<\\>*+,-.\/:;=?@^_`|~©™®| <>\\\n ' + S4 + ']+$',

  // regWithNewLine: '^[A-Za-z0-9\u0600-\u06FF \\\n \"&\'(),-:.?_%}{ ]+$'

  regOnlyArabic: '^[\u0600-\u06FF '+ S3 + ']+$',


  mulRegExpAlphaNumWithSplChar:'^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-.:?`،؟_ ]*$',

  mulRegExpOnlyAlphaWithSplChar:'^[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\"&\'(),-.:?`،؟_ ]*$'

}
