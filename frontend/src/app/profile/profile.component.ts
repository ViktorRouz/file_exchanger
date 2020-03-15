import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticateService} from '../_services/auth/authenticate.service';
import {ValidateService} from '../_services/validate/validate.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NgFlashMessageService} from 'ng-flash-messages';
import {User} from '../_models/user';
import {Image} from '../_models/image';
import {ImageService} from '../_services/image/image.service';
import {environment} from '../../environments/environment';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', './profile.media.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticateService,
    private validateService: ValidateService,
    private flashMessage: NgFlashMessageService,
    private imageService: ImageService
  ) {
    route.params.subscribe(param => {
      this.authService.getProfile().subscribe((profile: any) => {
          this.loadSpinnerStatus = true;
          if (profile.name === 'CastError') {
            this.router.navigate(['/get-image']);
            this.loadSpinnerStatus = false;
          } else {
            this.authService.updateStoreUser(profile.authUser);
            this.isAccess = param.id === profile.authUser._id;
            this.user = profile.user;
            this.getUserData();
            if (profile.user.photoProfileName === null) {
              this.photoProfileUrl = '../assets/images/user.png';
              this.photoStatus = false;
            } else {
              const idProfile = profile.user._id;
              const photoProfileName = profile.user.photoProfileName;
              this.setProfilePhoto(idProfile, photoProfileName);
              this.photoStatus = true;
            }
            this.loadSpinnerStatus = false;
          }

        },
        err => {
          console.log(err);
          this.loadSpinnerStatus = false;
          return false;
        }
      );

    });

    this.uploaderProfile.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
      const idProfile = JSON.parse(localStorage.getItem('user')).id;
      this.attachmentListProfilePhoto.push(JSON.parse(res));
      this.setProfilePhoto(idProfile, this.attachmentListProfilePhoto[0].uploadname);
    };
  }

  public isAccess: boolean;

  // Images

  private creatorId: string;

  public imageName = '';
  public fileName = '';

  public showPasswordStatus = false;
  public typeImagePasswordInput = 'password';
  public imagePassword = '';

  private images: Array<Image> = [];
  public invertedImages: Array<Image> = [];

  public sourceExtension = '';

  public nameEncrypted = '';

  public showDownloadPasswordStatus = false;
  public typeDownloadImagePasswordInput = 'password';
  public downloadImageId = '';
  public downloadImagePassword = '';
  public downloadImageStatus = false;
  public downloadImagePasswordValid = false;

  // pagination
  public p = 1;

  // User
  public user: User;
  public id: string;

  public text: string;

  public loadSpinnerStatus = false;

  // Photo response
  public attachmentListProfilePhoto: any = [];

  // Change profile data
  public aboutYourself: string;
  public name: string;
  public updateProfileStatus = false;

  // Photo functions
  public photoStatus: boolean;
  public uploadPhotoStatus = false;
  public uploaderProfile: any = this.imageService.uploaderProfile;
  public photoProfileUrl: string;
  public uploaderImage: any = this.imageService.uploaderImage;

  public hasBaseDropZoneOver = false;

  @ViewChild('imageInput') imageInput;

  private getUserData(): void {
    this.aboutYourself = this.user.aboutYourself;
    this.name = this.user.name;
  }

  public onUpdateProfile(): void {
    this.updateProfileStatus = true;
  }

  public onUpdateProfileSubmit(): void {
    const user = {
      name: this.name,
      aboutYourself: this.aboutYourself
    };

    if (this.validateService.validateProfile(user)) {
      this.authService.updateProfile(user).subscribe((res: any) => {
        if (res.success) {
          this.user.name = res.name;
          this.user.aboutYourself = res.aboutYourself;
          this.closeEdit();
        }
      });
    } else {
      this.flashMessage.showFlashMessage({
        messages: ['Incorrect input: enter name and something about yourself'],
        timeout: 3000,
        type: 'danger'
      });
    }
  }

  public closeEdit(): void {
    this.typeDownloadImagePasswordInput = 'password';
    this.downloadImageId = '';
    this.downloadImagePassword = '';
    this.sourceExtension = '';
    this.nameEncrypted = '';
    this.uploadPhotoStatus = false;
    this.downloadImageStatus = false;
    this.updateProfileStatus = false;
  }

  public onFileSelected(): void {
    if (this.uploaderProfile.queue.length !== 0) {
      if (this.uploaderProfile.queue.length === 2) {
        this.uploaderProfile.queue.splice(0, 1);
      }
    } else {
      if (this.uploaderImage.queue.length === 2) {
        this.uploaderImage.queue.splice(0, 1);
        this.fileName = this.uploaderImage.queue[0].file.rawFile.name;
      } else {
        this.fileName = this.uploaderImage.queue[0].file.rawFile.name;
      }
    }
  }

  public onUploadPhotoProfile(): void {
    this.uploaderProfile.queue[0].upload();
    this.uploadPhotoStatus = false;
    this.uploaderProfile.queue.splice(0, this.uploaderProfile.queue.length);
    this.photoStatus = true;
  }

  private setProfilePhoto(idProfile, photoProfileName): void {
    this.photoProfileUrl = `${environment.apiUrl}/profile/${idProfile}/photo/${photoProfileName}`;
    this.attachmentListProfilePhoto.splice(0, this.attachmentListProfilePhoto.length);
  }

  public onDeletePhotoProfile(): void {
    this.imageService.deletePhotoProfile().subscribe((res: any) => {
      if (res.success) {
        this.photoProfileUrl = '../assets/images/user.png';
        this.photoStatus = false;
      } else {
        this.flashMessage.showFlashMessage({
          messages: ['Something went wrong'],
          timeout: 3000,
          type: 'danger'
        });
      }
    });
  }

  private onUploadImage(): void {
    if (this.uploaderImage.queue.length !== 0) {
      this.loadSpinnerStatus = true;
      this.uploaderImage.queue[0].upload();
      this.uploaderImage.queue.splice(0, this.uploaderImage.queue.length);
      this.onResetImage();
    } else {
      this.flashMessage.showFlashMessage({
        messages: ['File not selected'],
        timeout: 3000,
        type: 'danger'
      });
      this.onResetImage();
    }
  }

  public onResetImage(): void {
    this.hasBaseDropZoneOver = false;
    this.imageInput.nativeElement.value = '';
    this.uploaderImage.queue.splice(0, this.uploaderImage.queue.length);
  }

  public changeShowPasswordStatus(): void {
    if (this.showPasswordStatus) {
      this.typeImagePasswordInput = 'text';
    } else {
      this.typeImagePasswordInput = 'password';
    }
  }

  public generatePassword(): void {
    this.imagePassword = '';
    this.imagePassword = Math.random().toString(36).substr(2, 10);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (this.uploaderImage.queue !== undefined && this.uploaderImage.queue.length !== 0) {
      this.onFileSelected();
    }
  }

  public onUploadFileSubmit(): void {
    if (!this.validateService.validateImage(this.imageName, this.imagePassword)) {
      this.flashMessage.showFlashMessage({
        messages: ['Please fill in all field'],
        timeout: 3000,
        type: 'danger'
      });
    } else {
      if (this.imagePassword.length >= 6) {

        this.uploaderImage.onBuildItemForm = (item, form) => {
          form.append('nameForAuthor', this.imageName);
          form.append('password', this.imagePassword);
          form.append('creatorId', this.creatorId);
        };

        this.onUploadImage();

        this.uploaderImage.onCompleteItem = (item: any, response: any) => {
          response = JSON.parse(response);
          console.log(response);
          if (response.success) {
            this.images.push(response.file);
            this.setAllImages();
            this.flashMessage.showFlashMessage({
              messages: ['Created successfully'],
              timeout: 3000,
              type: 'success'
            });
            this.imageName = '';
            this.imagePassword = '';
            this.loadSpinnerStatus = false;
          } else {
            this.loadSpinnerStatus = false;
            this.flashMessage.showFlashMessage({
              messages: ['Something went wrong!'],
              timeout: 3000,
              type: 'danger'
            });
          }
        };
      } else {
        this.loadSpinnerStatus = false;
        this.flashMessage.showFlashMessage({
          messages: ['Password is too short'],
          timeout: 3000,
          type: 'danger'
        });
      }
    }
  }

  private setAllImages(): void {
    this.invertedImages = this.images.slice(0);
    this.invertedImages.reverse();
    this.loadSpinnerStatus = false;
  }

  public deleteSpaces(event: any, type): void {
    if (type === 'upload') {
      this.imagePassword = event.target.value.trim().replace(/\s\s+/g, ' ');
    } else {
      this.downloadImagePassword = event.target.value.trim().replace(/\s\s+/g, ' ');
      this.downloadImagePasswordValid = !!this.downloadImagePassword.length;
    }
  }

  public changeShowDownloadPasswordStatus(): void {
    if (this.showDownloadPasswordStatus) {
      this.typeDownloadImagePasswordInput = 'text';
    } else {
      this.typeDownloadImagePasswordInput = 'password';
    }
  }

  public onDownloadImage(id, nameEncrypted, sourceExtension): void {
    this.downloadImageId = id;
    this.sourceExtension = sourceExtension;
    this.nameEncrypted = nameEncrypted;
    this.downloadImageStatus = true;
  }

  public downloadImage(): void {
    this.loadSpinnerStatus = true;
    if (this.validateService.validateDownloadPassword(this.downloadImagePassword)) {

      const downloadingData = {
        id: this.downloadImageId,
        password: this.downloadImagePassword,
      };

      const nameEncrypted = `${this.nameEncrypted}.${this.sourceExtension}`;

      this.imageService.getImage(downloadingData).subscribe((data: any) => {
        if (data.size < 50 || data.type === 'application/json') {
          this.loadSpinnerStatus = false;
          this.flashMessage.showFlashMessage({
            messages: ['Error of downloading'],
            timeout: 3000,
            type: 'danger'
          });
        } else {
          this.loadSpinnerStatus = false;
          return saveAs(data, nameEncrypted);
        }
      });

      this.closeEdit();
    } else {
      this.flashMessage.showFlashMessage({
        messages: ['Password is too short'],
        timeout: 3000,
        type: 'danger'
      });
    }
  }

  public onDeleteImage(id): void {
    this.loadSpinnerStatus = true;
    this.imageService.deleteImage(id).subscribe((res: any) => {
      if (res.success) {
        this.images.forEach((item, i) => {
          if (item._id === id) {
            this.images.splice(i, 1);
          }
        });
        this.setAllImages();
        this.loadSpinnerStatus = false;
        this.flashMessage.showFlashMessage({
          messages: ['Deleted successfully'],
          timeout: 3000,
          type: 'success'
        });
      } else {
        this.loadSpinnerStatus = false;
        this.flashMessage.showFlashMessage({
          messages: ['Error of deleting'],
          timeout: 3000,
          type: 'danger'
        });
      }
    });
  }

  ngOnInit() {
    this.loadSpinnerStatus = true;
    this.creatorId = this.router.url.replace('/', '').split('/')[1];
    this.imageService.getImagesAuthor()
      .subscribe((res: any) => {
        this.images = res.files;
        this.setAllImages();
      });
  }

}
