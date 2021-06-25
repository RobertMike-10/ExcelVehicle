import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ApiTransformService } from '../services/api-transform.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatus, ProgressStatusEnum, IProgressStatus } from '../models/progress-status';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @Input() public disabled!: boolean;
  @Output() public uploadStatus: EventEmitter<IProgressStatus>;
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Output()filePadre = new EventEmitter<string>();
  public fileName: string="";
  constructor(private service: ApiTransformService) {
    this.uploadStatus = new EventEmitter<IProgressStatus>();
  }

  public upload(event:any) {

    
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;      
      this.filePadre.emit(file.name);
      this.uploadStatus.emit({status: ProgressStatusEnum.START});
      this.service.uploadFile(file).subscribe(
        data=> {
          if (data) {
            switch (data.type) {
              case HttpEventType.UploadProgress:
                this.uploadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total!) * 100)});
                break;
              case HttpEventType.Response:
                //this.inputFile.nativeElement.value = '';
                this.uploadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                break;
            }
          }
        },
        error => {
          this.inputFile.nativeElement.value = '';
          this.uploadStatus.emit({status: ProgressStatusEnum.ERROR});
        }
      );
    }
  }

  ngOnInit(): void {
  }

}

