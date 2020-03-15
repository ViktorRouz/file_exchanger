import {Component, OnInit} from '@angular/core';
import {ValidateService} from '../_services/validate/validate.service';
import {NgFlashMessageService} from 'ng-flash-messages';
import {GetImageService} from '../_services/get-image/get-image.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-get-image',
  templateUrl: './get-image.component.html',
  styleUrls: ['./get-image.component.css']
})
export class GetImageComponent implements OnInit {

  public isAuthenticate = false;

  public sourceExtension = '';

  public nameEncrypted = '';

  public showDownloadPasswordStatus = false;
  public typeDownloadImagePasswordInput = 'password';
  public downloadImageId = '';
  public downloadImagePassword = '';
  public downloadImageStatus = false;

  constructor(
    private validateService: ValidateService,
    private flashMessage: NgFlashMessageService,
    private getImageService: GetImageService
  ) {
    const token = localStorage.getItem('id_token');
    this.isAuthenticate = !!token;
  }

  ngOnInit() {
  }

  public onGetSubmit(): void {
    this.downloadImage();
  }

  public deleteSpaces(value: string, type): void {
    if (type === 'id') {
      this.downloadImageId = value.trim().replace(/\s\s+/g, ' ');
    } else {
      this.downloadImagePassword = value.trim().replace(/\s\s+/g, ' ');
    }
  }

  public changeShowDownloadPasswordStatus(): void {
    if (this.showDownloadPasswordStatus) {
      this.typeDownloadImagePasswordInput = 'text';
    } else {
      this.typeDownloadImagePasswordInput = 'password';
    }
  }

  public checkDownloadImageId(): boolean {
    if (this.downloadImageId.length < 24 && this.downloadImageId.length > 26) {
      return false;
    } else {
      if (this.downloadImageId.indexOf('#') !== -1 && this.downloadImageId.length === 25) {
        this.downloadImageId = this.downloadImageId.slice(1, this.downloadImageId.length);
        return true;
      } else {
        return this.downloadImageId.indexOf('#') === -1 && this.downloadImageId.length === 24;
      }
    }
  }

  public downloadImage(): void {
    if (this.validateService.validateDownloadImageId(this.downloadImageId)) {
      if (this.checkDownloadImageId()) {
        if (this.validateService.validateDownloadPassword(this.downloadImagePassword)) {

          this.downloadImageStatus = true;

          this.getImageService.getDataImage(this.downloadImageId).subscribe((data: any) => {

            if (data.success) {
              this.sourceExtension = data.file.sourceExtension;
              this.nameEncrypted = data.file.nameEncrypted;

              const downloadingData = {
                id: this.downloadImageId,
                password: this.downloadImagePassword,
              };

              const nameEncrypted = `${this.nameEncrypted}.${this.sourceExtension}`;

              this.getImageService.getImage(downloadingData).subscribe((data: any) => {
                if (data.size < 50 || data.type === 'application/json') {
                  this.downloadImageStatus = false;
                  this.flashMessage.showFlashMessage({
                    messages: ['Error of downloading'],
                    timeout: 3000,
                    type: 'danger'
                  });
                } else {
                  this.downloadImageStatus = false;
                  this.clearValues();

                  return saveAs(data, nameEncrypted);
                }
              });
            } else {
              this.flashMessage.showFlashMessage({
                messages: ['Image not found'],
                timeout: 3000,
                type: 'danger'
              });
            }
          });
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Password is too short'],
            timeout: 3000,
            type: 'danger'
          });
        }
      } else {
        this.flashMessage.showFlashMessage({
          messages: ['Incorrect id of image!'],
          timeout: 3000,
          type: 'danger'
        });
      }
    } else {
      this.flashMessage.showFlashMessage({
        messages: ['Please fill id of image'],
        timeout: 3000,
        type: 'danger'
      });
    }
  }

  public clearValues(): void {
    this.sourceExtension = '';
    this.nameEncrypted = '';
    this.downloadImageId = '';
    this.downloadImagePassword = '';
  }

}
