import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Bulb} from './base/bulb';
import {Ground} from './base/ground';
import {LightService} from './services/light.service';
import {MaterialService} from './services/material.service';
import {provideSlot} from './services/slot-factory.service';
import {SlotContainer} from './slot/slot-container';
import {SlotBox} from './slot/slot-box';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
    ],
    providers: [
        provideSlot(SlotContainer),
        provideSlot(SlotBox, [LightService, MaterialService]),
        provideSlot(Ground, [MaterialService]),
        provideSlot(Bulb, [LightService, MaterialService]),

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
