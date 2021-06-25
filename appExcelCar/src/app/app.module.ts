import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { ApiTransformService } from './services/api-transform.service';
import { HttpClientModule } from '@angular/common/http';
import { PricePipe } from './pipes/price.pipe';


@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    PricePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ApiTransformService],
  bootstrap: [AppComponent]
})
export class AppModule { }
