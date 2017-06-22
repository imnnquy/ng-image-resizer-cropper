import { ElementRef, SimpleChange, OnChanges, Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'image-cropper',
    styles: [":host{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._img{position:absolute;display:flex}._img img{width:inherit;height:inherit;cursor:move}._img:after{position:absolute;content:'';top:0;bottom:0;left:0;right:0;pointer-events:none;border:dashed 1px;opacity:.75;color:inherit;z-index:1}/deep/ .fileUpload input[type=\"file\"]{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0;cursor:pointer}.content-img{position:relative;width:100%;min-height:320px;overflow:hidden}.NoNe{display:none}.resize{position:absolute;width:300px;height:300px;top:0;pointer-events:none;bottom:0;left:0;right:0;margin:auto;box-shadow:0 0 0 1200px rgba(255,255,255,0.25),0 0 0 1px rgba(255,255,255,0),0 0 0 1px rgba(0,0,0,0.22)}.resize:before,.resize:after{content:'';background:#000;top:0;bottom:0;margin:auto;position:absolute;left:0;right:0;opacity:.25}.resize:before{width:1px;height:25px}.resize:after{width:25px;height:1px}.r_w,.r_n,.r_e,.r_s,.r_nw,.r_ne,.r_se,.r_sw{position:absolute;background:inherit}.r_w:after,.r_n:after,.r_e:after,.r_s:after,.r_nw:after,.r_ne:after,.r_se:after,.r_sw:after{position:absolute;background:inherit;content:'';width:11px;height:11px;margin:auto;opacity:.85;z-index:1}.r_w{left:0;height:100%;width:1px;cursor:w-resize}.r_w:after{right:-3px;top:0;bottom:0}.r_nw{top:-5px;left:-5px;cursor:nw-resize}.r_ne{top:-5px;right:5px;cursor:ne-resize}.r_se{bottom:5px;right:5px;cursor:se-resize}.r_sw{bottom:5px;left:-5px;cursor:sw-resize} "],
    template: "\n  <ng-content></ng-content>\n  <div class=\"content-img\"\n  (mouseleave)=\"stateType='none'; crop();\"\n  (mouseup)=\"stateType='none'; crop();\"\n  (mouseenter)=\"stateType='none'; crop();\"\n  (mousemove)=\"moveImg($event);\"\n  (dblclick)=\"center();\"\n  >\n    <div class=\"_img\"\n    [class.NoNe]=\"imgDataUrl==undefined || imgDataUrl==null\"\n    [style.top.px]=\"_top\"\n    [style.left.px]=\"_left\"\n    [ngStyle]=\"styleCrop\"\n\n    >\n      <img\n      (mousedown)=\"stateType='move'; startMove($event)\"\n      (mouseup)=\"stateType='none'\"\n      [src]=\"imgDataUrl\"\n      >\n      <span\n      class=\"r_nw\"\n      (mousedown)=\"stateType='resize'; stateR='nw'\"\n      (mouseup)=\"stateType='none'\"\n      ></span>\n      <span\n      class=\"r_ne\"\n      (mousedown)=\"stateType='resize'; stateR='ne'\"\n      (mouseup)=\"stateType='none'\"\n      ></span>\n      <span\n      class=\"r_se\"\n      (mousedown)=\"stateType='resize'; stateR='se'\"\n      (mouseup)=\"stateType='none'\"\n      ></span>\n      <span\n      class=\"r_sw\"\n      (mousedown)=\"stateType='resize'; stateR='sw'\"\n      (mouseup)=\"stateType='none'\"\n      ></span>\n    </div>\n    <div class=\"resize\"\n    [style.width.px]=\"sizeW\"\n    [style.height.px]=\"sizeH\"\n    >\n      <!--<span class=\"r_w\"></span>\n      <span class=\"r_n\"></span>\n      <span class=\"r_e\"></span>\n      <span class=\"r_s\"></span>\n      <span class=\"r_nw\"></span>\n      <span class=\"r_ne\"></span>\n      <span class=\"r_se\"></span>\n      <span class=\"r_sw\"></span>-->\n    </div>\n  </div>\n  <!--<code>{{ _log.logs | json }}</code>-->\n  ",
})
export class ImageCropperComponent implements OnChanges, ControlValueAccessor {
    private elementRef;
    _format: string;
    img: string;
    imgDataUrl: string;
    origImg: string;
    sizeW: number;
    sizeH: number;
    sizeWmax: number;
    sizeHmax: number;
    stateMouse: boolean;
    stateType: string;
    stateR: string;
    centerX: number;
    centerY: number;
    imgWidth: number;
    imgHeight: number;
    imgCrop: any;
    percent: number;
    imgUrl: string;
    _top: number;
    _left: number;
    _img: any;
    _src: string;
    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
        this._format = 'jpeg';
        this.img = null;
        this.sizeW = 230;
        this.sizeH = 150;
        this.sizeWmax = 720;
        this.sizeHmax = 720;
        this.stateMouse = false;
        this.stateType = 'none';
        this.stateR = 'none';
        this.centerX = 0;
        this.centerY = 0;
        this.percent = 100;
        this.imgUrl = null;
        this._top = 0;
        this._left = 0;
        this._img = {};
        this._src = null;
    }
    readonly styleCrop: {
        color: string;
        background: string;
    };
    format: string;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }) {

    }

    offset(elem) {
        var /** @type {?} */ docElem, /** @type {?} */ win, /** @type {?} */ box = { top: 0, left: 0 }, /** @type {?} */ doc = elem && elem.ownerDocument;
        docElem = doc.documentElement;
        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = this.getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    getWindow(elem) {
        return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    isWindow(obj) {
        return obj !== null && obj === obj.window;
    }
    zoom(state: string) {
        var W = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
        var /** @type {?} */ H = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
        var /** @type {?} */ oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
        var /** @type {?} */ oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
        this.stateType = 'resize';
        this.stateR = state;
        this.resize(0, W, H, oTop, oLeft);
    }
    startMove($e: any){
        var /** @type {?} */ oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
        var /** @type {?} */ oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
        this.centerX = $e.clientX -
            this.offset(this.elementRef.nativeElement.querySelector('.content-img')).left - oLeft;
        this.centerY = $e.clientY -
            this.offset(this.elementRef.nativeElement.querySelector('.content-img')).top - oTop;
    }
    moveImg($e: any){
        $e.stopPropagation();
        $e.preventDefault();
        var /** @type {?} */ W = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
        var /** @type {?} */ H = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
        var /** @type {?} */ oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
        var /** @type {?} */ oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
        if (this.stateType === 'move') {
            this._left = $e.clientX -
                this.offset(this.elementRef.nativeElement.querySelector('.content-img')).left - (this.centerX);
            this._top = -this.offset(this.elementRef.nativeElement.querySelector('.content-img')).top +
                $e.clientY - (this.centerY);
        }
        else if (this.stateType === 'resize') {
            this.resize($e, W, H, oTop, oLeft);
        }
    }
    resize(ev$: any, W: any, H: any, oTop: any, oLeft: any){
        var /** @type {?} */ _W, /** @type {?} */ _H;
        var /** @type {?} */ contentImg = this.elementRef.nativeElement.querySelector('.content-img');
        if (this.stateR === 'nw') {
            this._left = -this.offset(contentImg).left + (ev$.clientX || ev$.pageY);
            this._top = -this.offset(contentImg).top +
                (ev$.clientY || ev$.pageX);
            _W = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetWidth -
                (this._left - oLeft));
            _H = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetHeight -
                (this._top - oTop));
            if (ev$.shiftKey) {
                this._top = (-this.offset(contentImg).top + (ev$.clientY ||
                    ev$.pageX)) - ((_W / this.imgWidth * this.imgHeight) - _H);
            }
        }
        else if (this.stateR === 'ne') {
            this._left = oLeft;
            this._top = -this.offset(contentImg).top +
                (ev$.clientY || ev$.pageY);
            _W = Math.round((-this.offset(contentImg).left +
                (ev$.clientX || ev$.pageX)) - oLeft);
            _H = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetHeight -
                (this._top - oTop));
            if (ev$.shiftKey) {
                this._top = (-this.offset(contentImg).top +
                    (ev$.clientY || ev$.pageY)) - ((_W / this.imgWidth * this.imgHeight) - _H);
            }
        }
        else if (this.stateR === 'se') {
            this._left = oLeft;
            this._top = oTop;
            _W = (-this.offset(contentImg).left +
                (ev$.clientX || ev$.pageX)) - oLeft;
            _H = (-this.offset(contentImg).top +
                (ev$.clientY || ev$.pageY)) - oTop;
        }
        else if (this.stateR === 'sw') {
            // console.log('event ne', ev$);
            this._left = -this.offset(contentImg).left + (ev$.clientX || ev$.pageX);
            this._top = oTop;
            _W = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetWidth -
                (this._left - oLeft));
            _H = Math.round((-this.offset(contentImg).top +
                (ev$.clientY || ev$.pageY)) - oTop);
        }
        else if (this.stateR === '-') {
            _W = W / 2;
            _H = H / 2;
            this.stateType = 'none';
            this._left = (contentImg.offsetWidth / 2) - _W / 2;
            this._top = (contentImg.offsetHeight / 2) - _H / 2;
            this.crop();
        }
        else if (this.stateR === '+') {
            _W = W * 2;
            _H = H * 2;
            this._left = (contentImg.offsetWidth / 2) - _W / 2;
            this._top = (contentImg.offsetHeight / 2) - _H / 2;
            this.stateType = 'none';
            this.crop();
        }
        if (ev$.shiftKey) {
            _H = _W / this.imgWidth * this.imgHeight;
        }
        var /** @type {?} */ fileReader = new FileReader();
        var /** @type {?} */ img;
        var /** @type {?} */ origSrc = new Image();
        var /** @type {?} */ minWidth = 80; // Change as required
        var /** @type {?} */ minHeight = 80;
        var /** @type {?} */ maxWidth = 2400; // Change as required
        var /** @type {?} */ maxHeight = 2200;
        var /** @type {?} */ cropCanvas = document.createElement('canvas');
        origSrc.src = this.origImg;
        cropCanvas.width = _W;
        cropCanvas.height = _H;
        var /** @type {?} */ ctx = cropCanvas.getContext('2d');
        ctx.drawImage(origSrc, 0, 0, // Start at 10 pixels from the left and the top of the image (crop),
        _W, _H);
        this.imgDataUrl = cropCanvas.toDataURL("image/" + this._format);
        // console.log(cropCanvas.toDataURL("image/jpeg"));
        // console.log(origSrc.width,origSrc.height);
    }
    writeValue(value: any){
        // nothing
    }
    private _onTouchedCallback;
    /** Callback registered via registerOnChange (ControlValueAccessor) */
    private _onChangeCallback;
    registerOnTouched(fn: any){
        this._onTouchedCallback = fn;
    };
    registerOnChange(fn: any){
        this._onChangeCallback = fn;
    };
    imgChange($event: any){
        var _this = this;
        // this._log.setLog('imgChange', $event);
        // important add converter img to size of output
        // important add converter img to size of output
        this._img = $event.target.files[0];
        this.img = $event.target.value.replace(/.*(\/|\\)/, '');
        var /** @type {?} */ fileReader = new FileReader();
        var /** @type {?} */ img;
        var /** @type {?} */ origSrc = new Image();
        var /** @type {?} */ minWidth = 80; // Change as required!!
        var /** @type {?} */ minHeight = 80;
        var /** @type {?} */ maxWidth = 2400; // Change as required
        var /** @type {?} */ maxHeight = 2200;
        var /** @type {?} */ cropCanvas = document.createElement('canvas');
        var /** @type {?} */ blank = "data:image/png;base64,iVBORw0KGg" + 'oAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAU' + "AAarVyFEAAAAASUVORK5CYII=";
        fileReader.onload = function (ev) {
            // this._log.setLog('ev', ev);
            // this._log.setLog('$event.target.files', $event.target.files);
            // this._log.setLog('$event.target.files', $event.target.files);
            // this._log.setLog('$event.target.files[0].type', $event.target.files[0].type);
            if ($event.target.files[0].type === 'image/jpeg' ||
                $event.target.files[0].type === 'image/jpg' ||
                $event.target.files[0].type === 'image/png' ||
                $event.target.files[0].type === 'image/gif') {
                _this.imgDataUrl = (<any> ev.target).result;
                _this.origImg = (<any> ev.target).result;
                origSrc.src = (<any> ev.target).result;
                img = (<any> ev.target).result;
            }
            else {
                _this.imgDataUrl = blank;
                _this.origImg = blank;
                origSrc.src = blank;
            }
            _this.imgWidth = origSrc.width;
            _this.imgHeight = origSrc.height;
            _this._left = (_this.elementRef.nativeElement.querySelector('.content-img').offsetWidth / 2) -
                _this.imgWidth / 2;
            _this._top = (_this.elementRef.nativeElement.querySelector('.content-img').offsetHeight / 2) -
                _this.imgHeight / 2;
            // ctx.drawImage(origSrc, 0, 0);
            console.warn(origSrc.width);
        };
        fileReader.readAsDataURL($event.target.files[0]);
        // console.log($event.target.files[0]);
    }
    center(){
        var _this = this;
        this.imgWidth = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
        this.imgHeight = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
        this._left = (this.elementRef.nativeElement.querySelector('.content-img').offsetWidth / 2) -
            this.imgWidth / 2;
        this._top = (this.elementRef.nativeElement.querySelector('.content-img').offsetHeight / 2) -
            this.imgHeight / 2;
        this.crop();
        setTimeout(function () {
            _this.crop();
        }, 10);
        setTimeout(function () {
            _this.crop();
        }, 100);
    }
    crop(){
        var /** @type {?} */ cropCanvas, /** @type {?} */ resize = this.elementRef.nativeElement.querySelector('.resize'), /** @type {?} */ left = this.offset(resize).left - this.offset(this.elementRef.nativeElement.querySelector('._img')).left, /** @type {?} */ top = this.offset(resize).top - this.offset(this.elementRef.nativeElement.querySelector('._img')).top, /** @type {?} */ width = resize.offsetWidth, /** @type {?} */ height = resize.offsetHeight;
        var /** @type {?} */ origSrc = new Image();
        origSrc.src = this.imgDataUrl;
        cropCanvas = document.createElement('canvas');
        cropCanvas.width = width;
        cropCanvas.height = height;
        cropCanvas.getContext('2d').drawImage(origSrc, left, top, width, height, 0, 0, width, height);
        this.imgCrop = cropCanvas.toDataURL("image/" + this._format);
    }
}
