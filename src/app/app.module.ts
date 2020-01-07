import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { provideSlot } from './services/slot-factory.service';
import {SlotContainer} from './slot/slot';
import {SlotBox} from './slot/slot-box';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
      provideSlot(SlotContainer),
      provideSlot(SlotBox),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
