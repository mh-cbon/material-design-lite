/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  /**
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  var CustomCropper = function CustomCropper(element) {
    this.element_ = element;
    this.bt_ = null;
    this.container_ = null;

    // Initialize instance.
    this.init();
  };

  window['CustomCropper'] = CustomCropper;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomCropper.prototype.Constant_ = {
    // None at the moment.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  CustomCropper.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Handle file changes.
   * @private
   */
  CustomCropper.prototype.onFileChanged = function(ev) {
    var files = this.file_.files;
    if (files && files.length) {
      this.img_.style.height = 'auto';
      this.componentContainer_.style.height = 'auto';
      this.componentContainer_.style.width = 'auto';

      this.dialog_.classList.add('beforeshow');
      if (this.cropper_) {
        URL.revokeObjectURL(this.img_.src);
        this.cropper_.destroy();
      }
      this.img_.src = URL.createObjectURL(files[0]);
      this.textEl_.classList.remove('is-dirty');
      this.pendingImg_ = files[0].name;
      this.textInput_.value = '';
      this.file_.value = null;

      this.updateBoxHeight_();

    } else {
      // ?
    }
  };

  /**
   * Create the cropper instance once the image to crop is loaded.
   */
  CustomCropper.prototype.onCropImgLoaded = function() {
    var Cropper = window.Cropper;
    this.cropper_ = new Cropper(this.img_, this.cropperOptions_);
  };

  /**
   * Update the dialog positionning.
   */
  CustomCropper.prototype.updateBoxPosition_ = function() {
    this.updateBoxHeight_();
  };

  /**
   * Update the dialog height.
   */
  CustomCropper.prototype.updateBoxHeight_ = function() {

    var cherry = window.cherry;
    var containerHeight = this.dialogContainer_.offsetHeight;
    var contentInner = cherry.innerHeight(this.dialogContent_);
    var contentOuter = cherry.outerHeight(this.dialogContent_);
    var actionsHeight = cherry.outerHeight(this.dialogActions_);
    var titleHeight = cherry.outerHeight(this.dialogTtile_);

    var imgH = containerHeight - actionsHeight - titleHeight - (contentOuter - contentInner);

    this.preview_.style.right = (contentOuter - contentInner) / 2;
    this.preview_.style.bottom = actionsHeight + (contentOuter - contentInner) / 2;
    this.img_.style.height = '' + imgH + 'px';
    this.componentContainer_.style.height = '' + imgH + 'px';
  };

  /**
   * xxxxxx.
   */
  CustomCropper.prototype.onDialogConfirmed_ = function() {
    if (this.b64result_) {
      this.b64result_.value = this.cropper_.getCroppedCanvas({
        width: this.b64ExportWidth,
        height: this.b64ExportHeight,
      }).toDataURL('image/png');
    }
    if (this.dataResult_) {
      this.dataResult_.value = JSON.stringify(this.cropper_.getData());
    }
    if (this.currentImg_) {
      this.currentImg_.src = this.cropper_.getCroppedCanvas({
        width: this.b64ExportWidth,
        height: this.b64ExportHeight,
      }).toDataURL('image/png');
    }
    if (this.pendingImg_) {
      this.textInput_.value = this.pendingImg_;
      this.textEl_.classList.add('is-dirty');
    }
    this.cropper_.destroy();
  };

  /**
   * xxxxxx.
   */
  CustomCropper.prototype.onDialogCanceled_ = function() {
    this.cropper_.destroy();
  };

  /**
   * xxxxxx.
   */
  CustomCropper.prototype.onFileCleared = function(ev) {
    if (!this.file_.files.length) {
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();
      if (this.b64result_) {
        this.b64result_.value = null;
      }
      if (this.dataResult_) {
        this.dataResult_.value = null;
      }
      if (this.currentImg_ && this.originalCurrentImg_) {
        this.currentImg_.src = this.originalCurrentImg_;
      }
    }
  };

  /**
   * Initialize element.
   */
  CustomCropper.prototype.init = function() {
    if (this.element_) {

      var that = this;

      this.file_ = this.element_.querySelector('.mdl-textfield input[type="file"]');
      this.dialog_ = this.element_.querySelector('.custom-cropper-dialog');
      this.componentContainer_ = this.element_.querySelector('.custom-cropper-component-container');
      this.img_ = this.element_.querySelector('.custom-cropper-dialog-img');
      this.currentImg_ = this.element_.querySelector('.custom-cropper-current-img img');
      this.preview_ = this.element_.querySelector('.custom-cropper-preview');
      this.b64result_ = this.element_.querySelector('.custom-cropper-b64-result');
      this.dataResult_ = this.element_.querySelector('.custom-cropper-data-result');
      this.btAction_ = this.element_.querySelector('.mdl-button--icon');
      this.textInput_ = this.element_.querySelector('.mdl-textfield__input');
      this.textEl_ = this.element_.querySelector('.mdl-textfield');

      this.dialogContainer_ = this.dialog_.querySelector('.custom-dialog-container');
      this.dialogActions_ = this.dialog_.querySelector('.mdl-dialog__actions');
      this.dialogTtile_ = this.dialog_.querySelector('.mdl-dialog__title');
      this.dialogContent_ = this.dialog_.querySelector('.mdl-dialog__content');
      this.dialogContent_ = this.dialog_.querySelector('.mdl-dialog__content');
      this.dialogConfirm_ = this.dialog_.querySelector('.custom-dialog-confirm');
      this.dialogClose_ = this.dialog_.querySelector('.custom-dialog-close');
      this.dialogCancel_ = this.dialog_.querySelector('.custom-dialog-cancel');

      var cherry = window.cherry;
      var imagesLoaded = window.imagesLoaded;
      this.b64ExportWidth = parseInt(this.element_.getAttribute('b64-export-width'));
      this.b64ExportHeight = parseInt(this.element_.getAttribute('b64-export-height'));
      if (this.currentImg_) {
        imagesLoaded(this.currentImg_, function() {
          if (that.currentImg_) {
            that.originalCurrentImg_ = cherry.imgAsDataUrl(that.currentImg_);
            that.b64ExportWidth = that.b64ExportWidth || that.currentImg_.offsetWidth;
            that.b64ExportHeight = that.b64ExportHeight || that.currentImg_.offsetHeight;
          }
        });
      }

      this.cropper_ = null;

      this.cropperOptions_ = {
        aspectRatio: parseInt(this.element_.getAttribute('aspect-ratio')) || NaN,
        movable: trueLike(this.element_.getAttribute('movable'), true),
        scalable: trueLike(this.element_.getAttribute('scalable'), true),
        rotatable: trueLike(this.element_.getAttribute('rotatable'), true),
        dragMode: (this.element_.getAttribute('drag-mode')) || 'crop',
        viewMode: parseInt(this.element_.getAttribute('view-mode')) || 0,
        responsive: trueLike(this.element_.getAttribute('responsive'), true),
        restore: trueLike(this.element_.getAttribute('restore'), true),
        modal: trueLike(this.element_.getAttribute('modal'), true),
        guides: trueLike(this.element_.getAttribute('guides'), true),
        background: trueLike(this.element_.getAttribute('background'), true),
        center: trueLike(this.element_.getAttribute('center'), true),
        highlight: trueLike(this.element_.getAttribute('highlight'), true),
        data: jsonParse(this.element_.getAttribute('cropper-data')),
        toggleDragModeOnDblclick: trueLike(this.element_.getAttribute('toggle-dragmode-ondblcick'), true),
        minCropBoxHeight: parseInt(this.element_.getAttribute('min-crop-box-height')) || 0,
        minCropBoxWidth: parseInt(this.element_.getAttribute('min-crop-box-width')) || 0,
        minCanvasHeight: parseInt(this.element_.getAttribute('min-canvas-height')) || 0,
        minCanvasWidth: parseInt(this.element_.getAttribute('min-canvas-width')) || 0,
        minContainerHeight: parseInt(this.element_.getAttribute('min-container-height')) || 100,
        minContainerWidth: parseInt(this.element_.getAttribute('min-container-width')) || 200,
        cropBoxResizable: trueLike(this.element_.getAttribute('crop-box-resizable'), true),
        cropBoxMovable: trueLike(this.element_.getAttribute('crop-box-movable'), true),
        zoomOnWheel: trueLike(this.element_.getAttribute('zoom-on-wheel'), true),
        zoomOnTouch: trueLike(this.element_.getAttribute('zoom-on-touch'), true),
        wheelZoomRatio: parseFloat(this.element_.getAttribute('wheel-zoom-ratio')) || 0.1,
        autoCropArea: parseFloat(this.element_.getAttribute('auto-crop-area')) || 0.8,
        autoCrop: trueLike(this.element_.getAttribute('auto-crop'), true),
        checkCrossOrigin: trueLike(this.element_.getAttribute('check-cross-origin'), true),
        checkOrientation: trueLike(this.element_.getAttribute('check-orientation'), true),
        zoomable: trueLike(this.element_.getAttribute('zoomable'), true),
        preview: this.preview_,
        /**
         * Ready function show the dialog, clean up image resource.
         */
        ready: function() {
          that.dialog_['CustomDialog'].showBox_();
          window.URL.revokeObjectURL(that.img_.src);
        },
      };

      cherry.on(this.file_, 'customcropper.change', this.onFileChanged).bind(this);
      cherry.on(this.img_, 'customcropper.load', this.onCropImgLoaded).bind(this);
      cherry.on(this.dialogConfirm_, 'customcropper.click', this.onDialogConfirmed_).bind(this);
      cherry.on(this.dialogClose_, 'customcropper.click', this.onDialogCanceled_).bind(this);
      cherry.on(this.dialogCancel_, 'customcropper.click', this.onDialogCanceled_).bind(this);
      cherry.on(this.btAction_, 'customcropper.click', this.onFileCleared).bind(this);

      cherry.on(window, 'customcropper.resize', this.updateBoxPosition_).bind(this).debounce(100);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomCropper.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;

    cherry.off(this.file_, 'customcropper.change', this.onFileChanged);
    cherry.off(this.img_, 'customcropper.load', this.onCropImgLoaded);
    cherry.off(this.dialogConfirm_, 'customcropper.click', this.onDialogConfirmed_);
    cherry.off(this.dialogClose_, 'customcropper.click', this.onDialogCanceled_);
    cherry.off(this.dialogCancel_, 'customcropper.click', this.onDialogCanceled_);
    cherry.off(this.btAction_, 'customcropper.click', this.onFileCleared);

    cherry.off(window, 'customcropper.resize', this.updateBoxPosition_);

    this.file_ = null;
    this.dialog_ = null;
    this.componentContainer_ = null;
    this.img_ = null;
    this.currentImg_ = null;
    this.preview_ = null;
    this.b64result_ = null;
    this.dataResult_ = null;
    this.clearFile_ = null;
    this.textInput_ = null;
    this.textEl_ = null;

    this.dialogContainer_ = null;
    this.dialogActions_ = null;
    this.dialogTtile_ = null;
    this.dialogContent_ = null;
    this.dialogContent_ = null;
    this.dialogConfirm_ = null;
    this.dialogClose_ = null;
    this.dialogCancel_ = null;

    this.b64ExportWidth = null;
    this.b64ExportHeight = null;
    this.originalCurrentImg_ = null;

    this.cropper_ = null;

    this.cropperOptions_ = null;

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomCropper,
    classAsString: 'CustomCropper',
    cssClass: 'custom-js-cropper'
  });

  /**
  * Is is something like true ?
  */
  function trueLike(some, d) {
    if (some === 'true' || some === '1') {
      return true;
    }
    if (some === 'false' || some === '0') {
      return false;
    }
    return d;
  }
  /**
  * JSON parse no exception.
  */
  function jsonParse(some) {
    try {
      return JSON.parse(some);
    }catch (ex) {
      return null;
    }
  }
})();
