import { Component, ViewChild} from '@angular/core';
import { ApiTransformService } from 'src/app/services/api-transform.service';
import { ProgressStatusEnum, ProgressStatus, IProgressStatus } from 'src/app/models/progress-status';
import { Vehicle } from './models/vehicle';
import { VehicleCount } from './models/vehicle-count';
import { Observable } from 'rxjs';
import { UploadComponent } from './upload/upload.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appExcelCar';

  @ViewChild(UploadComponent) upload: any;

  public showUploadError!: boolean;
  public percentage?: number;
  public showProgress!: boolean;
  vehicles$!: Observable<Vehicle[]>;
  countVehicle!: VehicleCount[];
  maxVehicle!: VehicleCount;
  fileName!:string;

  constructor(private service: ApiTransformService) { }

  getVehicles() {
        
    this.vehicles$ = this.service.getVehicles(this.fileName);
    this.vehicles$.subscribe((data) => {
                
      data.forEach(vehicle =>{        
        //first time creates array
        if (this.countVehicle === undefined) {
          var v = new VehicleCount(vehicle.vehicleName,1)
          this.countVehicle =  [v];
          return;
        } 
        let f = this.countVehicle.find(x => x.VehicleName === vehicle.vehicleName);
        //no se encuentra
        if (f=== undefined)
        {
          var v = new VehicleCount(vehicle.vehicleName,1)
          this.countVehicle.push(v)
        }
        else //si esta solo agregamos contador
        {
          f.Count ++;
        }        
       });

       this.maxVehicle = this.countVehicle.reduce(function(prev, current) {
        return (prev.Count > current.Count) ? prev : current
       });
       
  });

  }


  procesaName(mensaje:string) {
    this.fileName=mensaje;
  }

  public uploadStatus(event: IProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showUploadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;                
        this.getVehicles();
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showUploadError = true;
        break;
    }
  }

}
